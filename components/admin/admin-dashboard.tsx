"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Booking, BookingStatus } from "@/types/booking";
import { FLEET_CARS } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Car,
  User,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Copy,
  Info,
} from "lucide-react";

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCarFilter, setSelectedCarFilter] = useState<string>("all");
  const [activeBookingModal, setActiveBookingModal] = useState<Booking | null>(null);
  
  // Google Sheets Connection State
  const [isGoogleSheetsConnected, setIsGoogleSheetsConnected] = useState(false);
  const [googleSheetError, setGoogleSheetError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gasUrlInput, setGasUrlInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load custom Google Apps Script URL from localStorage if set
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bmw_custom_gas_url");
      if (saved) {
        setGasUrlInput(saved);
      }
    }
  }, []);

  // Fetch bookings from API
  const fetchBookings = async (customUrl?: string) => {
    setIsRefreshing(true);
    try {
      const effectiveUrl =
        customUrl !== undefined
          ? customUrl
          : typeof window !== "undefined"
          ? localStorage.getItem("bmw_custom_gas_url") || ""
          : "";

      const headers: Record<string, string> = {};
      if (effectiveUrl) {
        headers["x-google-script-url"] = effectiveUrl;
      }

      const res = await fetch("/api/bookings", {
        headers,
        cache: "no-store",
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
        setIsGoogleSheetsConnected(data.isGoogleSheetsConnected || false);
        setGoogleSheetError(data.googleSheetError || null);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Status Updater
  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      // Optimistic update
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (activeBookingModal?.id === id) {
        setActiveBookingModal((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const scriptUrl = typeof window !== "undefined" ? localStorage.getItem("bmw_custom_gas_url") || undefined : undefined;

      await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(scriptUrl ? { "x-google-script-url": scriptUrl } : {}),
        },
        body: JSON.stringify({ id, status: newStatus, scriptUrl }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        booking.fullName.toLowerCase().includes(q) ||
        booking.phone.toLowerCase().includes(q) ||
        booking.email.toLowerCase().includes(q) ||
        booking.id.toLowerCase().includes(q) ||
        booking.carName.toLowerCase().includes(q);

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || booking.status === selectedStatus;

      // Car filter
      const matchesCar =
        selectedCarFilter === "all" ||
        booking.carId === selectedCarFilter ||
        booking.carName.toLowerCase().includes(selectedCarFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCar;
    });
  }, [bookings, searchQuery, selectedStatus, selectedCarFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return { total, pending, confirmed, revenue };
  }, [bookings]);

  // CSV Export helper
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = [
      "Booking ID",
      "Created At",
      "Full Name",
      "Email",
      "Phone",
      "License Number",
      "Car",
      "Rental Type",
      "Pickup Date",
      "Pickup Time",
      "Dropoff Date",
      "Dropoff Time",
      "Pickup Location",
      "Dropoff Location",
      "Days",
      "Total Price ($)",
      "Status",
      "Notes",
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.createdAt}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.phone}"`,
      `"${b.licenseNumber || ''}"`,
      `"${b.carName}"`,
      `"${b.rentalType}"`,
      `"${b.pickupDate}"`,
      `"${b.pickupTime}"`,
      `"${b.dropoffDate}"`,
      `"${b.dropoffTime}"`,
      `"${b.pickupLocation}"`,
      `"${b.dropoffLocation}"`,
      b.days,
      b.totalPrice,
      `"${b.status}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kalash_bmw_bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveGasUrl = () => {
    const trimmed = gasUrlInput.trim();
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("bmw_custom_gas_url", trimmed);
      } else {
        localStorage.removeItem("bmw_custom_gas_url");
      }
    }
    setSaveStatus("Saved! Refreshing connection...");
    fetchBookings(trimmed);
    setTimeout(() => {
      setSaveStatus(null);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const copyAppsScript = () => {
    const scriptCode = `// PASTE INTO GOOGLE APPS SCRIPT (Extensions > Apps Script in Google Sheets)
const SHEET_NAME = "Bookings";
const HEADERS = ["Booking ID", "Created At", "Full Name", "Email", "Phone", "License Number", "Car Model", "Rental Type", "Pickup Date", "Pickup Time", "Dropoff Date", "Dropoff Time", "Pickup Location", "Dropoff Location", "Days", "Total Price ($)", "Status", "Notes"];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setBackground("#111827").setFontColor("#FFF").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify({ success: true, bookings: [] })).setMimeType(ContentService.MimeType.JSON);
    const rows = data.slice(1);
    const bookings = rows.map(r => ({
      id: String(r[0]||""), createdAt: String(r[1]||""), fullName: String(r[2]||""), email: String(r[3]||""),
      phone: String(r[4]||""), licenseNumber: String(r[5]||""), carName: String(r[6]||""), rentalType: String(r[7]||"self-drive"),
      pickupDate: String(r[8]||""), pickupTime: String(r[9]||""), dropoffDate: String(r[10]||""), dropoffTime: String(r[11]||""),
      pickupLocation: String(r[12]||""), dropoffLocation: String(r[13]||""), days: Number(r[14])||1, totalPrice: Number(r[15])||0,
      status: String(r[16]||"pending").toLowerCase(), notes: String(r[17]||""), source: "google_sheets"
    })).reverse();
    return ContentService.createTextOutput(JSON.stringify({ success: true, count: bookings.length, bookings: bookings })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : (e.parameter || {});
    if (body.action === "updateStatus") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          sheet.getRange(i + 1, 17).setValue(body.status);
          return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Not found" })).setMimeType(ContentService.MimeType.JSON);
    }
    const b = body.data || body;
    const bId = b.id || ("BMW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    sheet.appendRow([bId, b.createdAt || new Date().toISOString(), b.fullName||"", b.email||"", b.phone||"", b.licenseNumber||"", b.carName||"", b.rentalType||"self-drive", b.pickupDate||"", b.pickupTime||"", b.dropoffDate||"", b.dropoffTime||"", b.pickupLocation||"", b.dropoffLocation||"", b.days||1, b.totalPrice||0, b.status||"pending", b.notes||""]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, bookingId: bId })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Review</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge className="bg-zinc-800 text-zinc-300">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Landing Page</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base tracking-wider text-white uppercase">
                KALASH <span className="text-blue-500">BMW CARS</span>
              </span>
              <Badge className="bg-zinc-900 border-zinc-700 text-zinc-300 text-[10px] font-mono uppercase">
                Owner Portal
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Google Sheets Connection Pill */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono border transition-all cursor-pointer ${
                isGoogleSheetsConnected
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50"
                  : "border-amber-500/40 bg-amber-950/40 text-amber-400 hover:bg-amber-900/50"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>{isGoogleSheetsConnected ? "Google Sheet Synced" : "Local / Demo Mode"}</span>
              <span className="text-[10px] underline ml-1">Settings</span>
            </button>

            {/* Refresh Button */}
            <Button
              onClick={() => fetchBookings()}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white h-8 px-2.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
            <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider block">Total Bookings</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">{stats.total}</span>
              <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px]">All Time</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5">
            <span className="text-xs text-amber-400 uppercase font-mono tracking-wider block">Requires Review</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-amber-400">{stats.pending}</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">Pending</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5">
            <span className="text-xs text-emerald-400 uppercase font-mono tracking-wider block">Confirmed Rentals</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-400">{stats.confirmed}</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Active</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/10 p-5">
            <span className="text-xs text-blue-400 uppercase font-mono tracking-wider block">Projected Revenue</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-blue-400">${stats.revenue.toLocaleString()}</span>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">Calculated</Badge>
            </div>
          </div>
        </div>

        {/* Search, Filters & Actions Bar */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search by customer name, phone, email, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-white/10 bg-zinc-900 text-white text-xs sm:text-sm h-10 w-full"
              />
            </div>

            {/* Car Filter */}
            <select
              value={selectedCarFilter}
              onChange={(e) => setSelectedCarFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs sm:text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All BMW Models</option>
              {FLEET_CARS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs sm:text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Export CSV */}
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white text-xs h-10 px-3 gap-1.5 shrink-0"
            >
              <Download className="h-4 w-4 text-zinc-400" />
              <span>Export CSV</span>
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-white/5">
            <span>
              Showing <strong className="text-white">{filteredBookings.length}</strong> of{" "}
              <strong className="text-white">{bookings.length}</strong> total bookings
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Bookings List / Table */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-900 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">BMW Model</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Rental Type</th>
                  <th className="py-3.5 px-4">Total ($)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-zinc-500">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-400" />
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-zinc-500">
                      <Car className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-base text-zinc-400 font-medium">No bookings match your filter criteria.</p>
                      <p className="text-xs text-zinc-600 mt-1">New submissions on the landing page will appear here immediately.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-zinc-900/60 transition-colors cursor-pointer group"
                      onClick={() => setActiveBookingModal(b)}
                    >
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-bold text-blue-400">
                        {b.id}
                        <span className="block text-[10px] text-zinc-500 font-sans font-normal">
                          {b.createdAt ? b.createdAt.split("T")[0] : ""}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {b.fullName}
                        </div>
                        <div className="text-zinc-400 text-xs flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3 w-3 text-zinc-500" />
                          <span>{b.phone}</span>
                        </div>
                        <div className="text-zinc-500 text-[11px] truncate max-w-[180px]">
                          {b.email}
                        </div>
                      </td>

                      {/* Car */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-white">{b.carName}</span>
                        <span className="block text-[11px] text-zinc-500">
                          ${b.carDailyRate}/day
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 text-xs">
                        <div className="flex items-center gap-1 text-zinc-300">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <span>{b.pickupDate} ({b.pickupTime})</span>
                        </div>
                        <div className="text-zinc-500 text-[11px] mt-0.5">
                          to {b.dropoffDate} • <strong className="text-zinc-300">{b.days} {b.days === 1 ? 'day' : 'days'}</strong>
                        </div>
                      </td>

                      {/* Rental Type */}
                      <td className="py-4 px-4">
                        {b.rentalType === "chauffeur" ? (
                          <Badge className="bg-purple-950/60 text-purple-300 border-purple-500/30 text-[10px]">
                            Chauffeur VIP
                          </Badge>
                        ) : (
                          <Badge className="bg-zinc-800 text-zinc-300 text-[10px]">
                            Self-Drive
                          </Badge>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-base">
                        ${b.totalPrice}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === "pending" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "confirmed")}
                              title="Confirm booking"
                              className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white p-1.5 transition-colors border border-emerald-500/30"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <Button
                            onClick={() => setActiveBookingModal(b)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {activeBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveBookingModal(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
                  Booking Dossier
                </span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>{activeBookingModal.id}</span>
                  {getStatusBadge(activeBookingModal.status)}
                </h3>
              </div>
            </div>

            {/* Customer Contact Bar */}
            <div className="rounded-2xl bg-zinc-900 border border-white/10 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-base">{activeBookingModal.fullName}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Driver's License / ID: <span className="text-zinc-200 font-mono">{activeBookingModal.licenseNumber || "N/A"}</span></p>
              </div>

              {/* Quick Contact Links */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${activeBookingModal.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${activeBookingModal.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2 px-3 transition-colors border border-white/10"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${activeBookingModal.email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2 px-3 transition-colors border border-white/10"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="rounded-xl bg-zinc-900/50 p-3.5 border border-white/5 space-y-1">
                <span className="text-zinc-500 block uppercase font-mono text-[10px]">Vehicle Reserved</span>
                <span className="font-bold text-sm text-white">{activeBookingModal.carName}</span>
                <span className="block text-zinc-400">Daily Rate: ${activeBookingModal.carDailyRate} / day</span>
              </div>

              <div className="rounded-xl bg-zinc-900/50 p-3.5 border border-white/5 space-y-1">
                <span className="text-zinc-500 block uppercase font-mono text-[10px]">Schedule & Duration</span>
                <span className="font-bold text-sm text-white">
                  {activeBookingModal.pickupDate} ({activeBookingModal.pickupTime})
                </span>
                <span className="block text-zinc-400">
                  to {activeBookingModal.dropoffDate} ({activeBookingModal.dropoffTime}) • {activeBookingModal.days} Days
                </span>
              </div>

              <div className="rounded-xl bg-zinc-900/50 p-3.5 border border-white/5 space-y-1">
                <span className="text-zinc-500 block uppercase font-mono text-[10px]">Pickup Location</span>
                <span className="font-medium text-zinc-200">{activeBookingModal.pickupLocation}</span>
              </div>

              <div className="rounded-xl bg-zinc-900/50 p-3.5 border border-white/5 space-y-1">
                <span className="text-zinc-500 block uppercase font-mono text-[10px]">Drop-off Location</span>
                <span className="font-medium text-zinc-200">{activeBookingModal.dropoffLocation}</span>
              </div>
            </div>

            {/* Special Notes */}
            {activeBookingModal.notes && (
              <div className="rounded-xl bg-zinc-900/70 p-4 border border-white/10 mb-6 text-xs">
                <span className="text-zinc-400 block uppercase font-mono text-[10px] mb-1">
                  Customer Special Requests & Notes:
                </span>
                <p className="text-zinc-200 leading-relaxed italic">
                  "{activeBookingModal.notes}"
                </p>
              </div>
            )}

            {/* Price breakdown */}
            <div className="rounded-xl bg-zinc-900 border border-white/10 p-4 mb-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-zinc-400 block">Total Rental Fee ({activeBookingModal.rentalType})</span>
                <span className="text-xs text-emerald-400">Full Insurance & Delivery Included</span>
              </div>
              <span className="text-2xl font-black text-emerald-400 font-mono">${activeBookingModal.totalPrice}</span>
            </div>

            {/* Status Change Buttons */}
            <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">Update Booking Status:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "pending")}
                  className={`text-xs ${
                    activeBookingModal.status === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Pending
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "confirmed")}
                  className={`text-xs ${
                    activeBookingModal.status === "confirmed"
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "completed")}
                  className={`text-xs ${
                    activeBookingModal.status === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "cancelled")}
                  className={`text-xs ${
                    activeBookingModal.status === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Google Sheets Integration</h3>
                <p className="text-xs text-zinc-400">Connect Google Apps Script Web App to store bookings in your spreadsheet</p>
              </div>
            </div>

            {/* Input URL */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
                Google Apps Script Web App URL
              </label>
              <Input
                placeholder="https://script.google.com/macros/s/XXXXX/exec"
                value={gasUrlInput}
                onChange={(e) => setGasUrlInput(e.target.value)}
                className="border-white/10 bg-zinc-900 text-white font-mono text-xs"
              />
              <p className="text-[11px] text-zinc-500">
                Leave empty to run in local in-memory demo mode. When configured, bookings are written directly to Google Sheets and read from there.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mb-8">
              <Button
                onClick={handleSaveGasUrl}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Save & Connect
              </Button>
              <Button
                onClick={copyAppsScript}
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-xs gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedCode ? "Copied Script!" : "Copy Apps Script Code"}</span>
              </Button>
              {saveStatus && <span className="text-xs text-emerald-400">{saveStatus}</span>}
            </div>

            {/* Setup Instructions */}
            <div className="rounded-2xl bg-zinc-900/70 border border-white/10 p-5 text-xs text-zinc-300 space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block">
                3-Minute Setup Instructions:
              </span>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400">
                <li>Create a new spreadsheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-400 underline">sheets.new</a></li>
                <li>Go to <strong className="text-zinc-200">Extensions &gt; Apps Script</strong></li>
                <li>Click <strong className="text-zinc-200">"Copy Apps Script Code"</strong> above and paste it into the editor.</li>
                <li>Click <strong className="text-zinc-200">Deploy &gt; New deployment</strong>.</li>
                <li>Select type: <strong className="text-zinc-200">Web app</strong>. Set <em className="text-white">Who has access: "Anyone"</em>.</li>
                <li>Click <strong className="text-zinc-200">Deploy</strong> and copy the URL ending in <code className="text-blue-300">/exec</code>.</li>
                <li>Paste the URL above or add it to <code className="text-blue-300">.env.local</code> as <code className="text-blue-300">GOOGLE_APPS_SCRIPT_URL</code>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
