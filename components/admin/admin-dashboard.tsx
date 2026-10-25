"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Booking, BookingStatus } from "@/types/booking";
import { FLEET_CARS } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR, getWhatsAppNumber } from "@/lib/utils";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Phone,
  Mail,
  Calendar,
  Car,
  Check,
  X,
  MessageSquare,
  ArrowLeft,
  Copy,
  Wrench,
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gasUrlInput, setGasUrlInput] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bmw_custom_gas_url") || "";
    }
    return "";
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    async function loadInitial() {
      try {
        const effectiveUrl =
          typeof window !== "undefined"
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
        if (isSubscribed && data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          setIsGoogleSheetsConnected(data.isGoogleSheetsConnected || false);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    loadInitial();
    return () => {
      isSubscribed = false;
    };
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

      const scriptUrl =
        typeof window !== "undefined"
          ? localStorage.getItem("bmw_custom_gas_url") || undefined
          : undefined;

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

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const revenue = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return { total, pending, confirmed, revenue };
  }, [bookings]);

  // Export CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;

    const headers = [
      "Booking ID",
      "Created At",
      "Full Name",
      "Email",
      "Phone",
      "License Number",
      "Car Name",
      "Rental Type",
      "Pickup Date",
      "Pickup Time",
      "Dropoff Date",
      "Dropoff Time",
      "Pickup Location",
      "Dropoff Location",
      "Days",
      "Total Price",
      "Status",
      "Notes",
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.createdAt}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.phone || ""}"`,
      `"${b.licenseNumber || ""}"`,
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
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `kalash_bmw_bookings_${new Date().toISOString().split("T")[0]}.csv`
    );
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
const HEADERS = [
  "Booking ID", "Created At", "Full Name", "Email", "Phone", "License Number",
  "Car Model", "Rental Type", "Pickup Date", "Pickup Time", "Dropoff Date",
  "Dropoff Time", "Pickup Location", "Dropoff Location", "Days", "Total Price (₹)",
  "Status", "Notes"
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#0F2825");
    headerRange.setFontColor("#FAF7F0");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("E:E").setNumberFormat("@");
  return sheet;
}

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify({ success: true, bookings: [] })).setMimeType(ContentService.MimeType.JSON);
    const rows = data.slice(1);
    const bookings = rows.map(r => {
      let rawPhone = String(r[4]||"").trim();
      let cleanPhone = rawPhone.replace(/^'+/, "");
      if (cleanPhone === "#ERROR!" || cleanPhone.startsWith("#")) {
        cleanPhone = "";
      }
      return {
        id: String(r[0]||""), createdAt: String(r[1]||""), fullName: String(r[2]||""), email: String(r[3]||""),
        phone: cleanPhone, licenseNumber: String(r[5]||""), carName: String(r[6]||""), rentalType: String(r[7]||"self-drive"),
        pickupDate: String(r[8]||""), pickupTime: String(r[9]||""), dropoffDate: String(r[10]||""), dropoffTime: String(r[11]||""),
        pickupLocation: String(r[12]||""), dropoffLocation: String(r[13]||""), days: Number(r[14])||1, totalPrice: Number(r[15])||0,
        status: String(r[16]||"pending").toLowerCase(), notes: String(r[17]||""), source: "google_sheets"
      };
    }).reverse();
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
    
    const rawPhone = String(b.phone || "").trim().replace(/^'+/, "");
    const safePhone = rawPhone ? "'" + rawPhone : "";

    sheet.appendRow([
      bId, b.createdAt || new Date().toISOString(), b.fullName||"", b.email||"", safePhone,
      b.licenseNumber||"", b.carName||b.carId||"", b.rentalType||"self-drive", b.pickupDate||"",
      b.pickupTime||"", b.dropoffDate||"", b.dropoffTime||"", b.pickupLocation||"", b.dropoffLocation||"",
      b.days||1, b.totalPrice||0, b.status||"pending", b.notes||""
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 5).setNumberFormat("@");

    return ContentService.createTextOutput(JSON.stringify({ success: true, bookingId: bId })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] sm:text-xs">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] sm:text-xs">Pending Review</Badge>;
      case "completed":
        return <Badge className="bg-teal-500/20 text-[#2DD4BF] border-[#2DD4BF]/30 text-[10px] sm:text-xs">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px] sm:text-xs">Cancelled</Badge>;
      default:
        return <Badge className="bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#061110] text-[#FAF7F0] font-sans pb-16">
      {/* Top Navigation */}
      <header className="border-b border-[#FAF7F0]/10 bg-[#061110]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-[#FAF7F0]/60 hover:text-[#2DD4BF] transition-colors py-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Landing</span>
            </Link>
            <div className="h-4 w-px bg-[#FAF7F0]/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-gradient-to-br from-[#0F2825] to-[#061110] shadow-[0_0_12px_rgba(45,212,191,0.15)] shrink-0">
                <div className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full overflow-hidden border border-[#FAF7F0]/30 grid grid-cols-2 grid-rows-2">
                  <div className="bg-[#14B8A6]" />
                  <div className="bg-[#FAF7F0]" />
                  <div className="bg-[#FAF7F0]" />
                  <div className="bg-[#14B8A6]" />
                </div>
              </div>
              <span className="font-bold text-xs sm:text-sm tracking-wider text-[#FAF7F0] uppercase">
                KALASH <span className="text-[#2DD4BF]">BMW</span>
              </span>
              <Badge className="hidden sm:inline-flex bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#5EEAD4] text-[10px] font-mono uppercase">
                Owner Portal
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Google Sheets Connection Pill (Compact on Mobile) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono border transition-all cursor-pointer ${
                isGoogleSheetsConnected
                  ? "border-[#2DD4BF]/40 bg-[#14B8A6]/10 text-[#5EEAD4] hover:bg-[#14B8A6]/20"
                  : "border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50"
              }`}
            >
              <FileSpreadsheet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">
                {isGoogleSheetsConnected ? "Google Sheets Connected" : "Local / Demo Mode"}
              </span>
              <span className="sm:hidden">
                {isGoogleSheetsConnected ? "Sheets" : "Demo"}
              </span>
              <span className="text-[10px] underline ml-0.5 sm:ml-1">Setup</span>
            </button>

            {/* Refresh Button */}
            <Button
              onClick={() => fetchBookings()}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-[#FAF7F0]/15 bg-[#0A1917] text-[#FAF7F0]/80 hover:bg-[#102623] hover:text-[#2DD4BF] h-7 sm:h-8 px-2 sm:px-2.5"
            >
              <RefreshCw className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isRefreshing ? "animate-spin text-[#2DD4BF]" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="rounded-xl sm:rounded-2xl border border-[#FAF7F0]/10 bg-[#0A1917]/70 backdrop-blur-xl p-3.5 sm:p-5">
            <span className="text-[10px] sm:text-xs text-[#FAF7F0]/60 uppercase font-mono tracking-wider block">Total Bookings</span>
            <div className="mt-1 sm:mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-3xl font-extrabold text-[#FAF7F0]">{stats.total}</span>
              <Badge className="bg-[#FAF7F0]/5 text-[#FAF7F0]/60 border-[#FAF7F0]/10 text-[9px] sm:text-[10px] px-1.5 py-0.5">All Time</Badge>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-xl p-3.5 sm:p-5">
            <span className="text-[10px] sm:text-xs text-amber-300 uppercase font-mono tracking-wider block">Requires Review</span>
            <div className="mt-1 sm:mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-3xl font-extrabold text-amber-300">{stats.pending}</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px] sm:text-[10px] px-1.5 py-0.5">Pending</Badge>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl p-3.5 sm:p-5">
            <span className="text-[10px] sm:text-xs text-emerald-400 uppercase font-mono tracking-wider block">Active Rentals</span>
            <div className="mt-1 sm:mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-3xl font-extrabold text-emerald-400">{stats.confirmed}</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] sm:text-[10px] px-1.5 py-0.5">Confirmed</Badge>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-[#2DD4BF]/30 bg-[#14B8A6]/10 backdrop-blur-xl p-3.5 sm:p-5">
            <span className="text-[10px] sm:text-xs text-[#2DD4BF] uppercase font-mono tracking-wider block">Projected Revenue</span>
            <div className="mt-1 sm:mt-2 flex items-baseline justify-between">
              <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#2DD4BF] font-mono truncate">{formatINR(stats.revenue)}</span>
              <Badge className="bg-[#2DD4BF]/20 text-[#5EEAD4] border-[#2DD4BF]/30 text-[9px] sm:text-[10px] px-1.5 py-0.5 shrink-0">Calculated</Badge>
            </div>
          </div>
        </div>

        {/* Search, Filters & Actions Bar */}
        <div className="rounded-xl sm:rounded-2xl border border-[#FAF7F0]/10 bg-[#0A1917]/70 backdrop-blur-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FAF7F0]/40" />
              <Input
                placeholder="Search customer, phone, model, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-[#FAF7F0]/15 bg-[#061110] text-[#FAF7F0] text-xs sm:text-sm h-9 sm:h-10 w-full focus:border-[#2DD4BF]"
              />
            </div>

            {/* Filter Group: 2 columns on mobile, row on tablet/desktop */}
            <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
              <select
                value={selectedCarFilter}
                onChange={(e) => setSelectedCarFilter(e.target.value)}
                className="rounded-lg border border-[#FAF7F0]/15 bg-[#061110] px-2.5 py-2 text-xs text-[#FAF7F0]/80 focus:border-[#2DD4BF] focus:outline-none truncate [color-scheme:dark]"
              >
                <option value="all">All BMW Models</option>
                {FLEET_CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-[#FAF7F0]/15 bg-[#061110] px-2.5 py-2 text-xs text-[#FAF7F0]/80 focus:border-[#2DD4BF] focus:outline-none [color-scheme:dark]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Export CSV */}
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="border-[#FAF7F0]/15 bg-[#061110] text-[#FAF7F0]/80 hover:bg-[#102623] hover:text-[#2DD4BF] text-xs h-9 sm:h-10 px-3 gap-1.5 shrink-0 w-full md:w-auto justify-center"
            >
              <Download className="h-4 w-4 text-[#FAF7F0]/60" />
              <span>Export CSV</span>
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#FAF7F0]/50 pt-1 border-t border-[#FAF7F0]/5">
            <span>
              Showing <strong className="text-[#FAF7F0]">{filteredBookings.length}</strong> of{" "}
              <strong className="text-[#FAF7F0]">{bookings.length}</strong> total bookings
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#2DD4BF] hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Bookings View: Responsive Dual View */}
        {/* MOBILE VIEW (Screens < md): Touch-optimized Cards */}
        <div className="block md:hidden space-y-3">
          {isLoading ? (
            <div className="rounded-xl border border-[#FAF7F0]/10 bg-[#0A1917]/70 p-8 text-center text-[#FAF7F0]/40">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#2DD4BF]" />
              <p className="text-xs">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-[#FAF7F0]/10 bg-[#0A1917]/70 p-8 text-center text-[#FAF7F0]/40">
              <Car className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#2DD4BF]" />
              <p className="text-sm font-medium text-[#FAF7F0]/70">No bookings match your filter criteria.</p>
              <p className="text-xs text-[#FAF7F0]/40 mt-1">Customer bookings will appear here instantly.</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setActiveBookingModal(b)}
                className="rounded-2xl border border-[#FAF7F0]/10 bg-[#0A1917]/80 p-4 transition-all active:scale-[0.99] cursor-pointer shadow-lg space-y-3"
              >
                {/* Card Header: ID, Date, Status */}
                <div className="flex items-center justify-between gap-2 border-b border-[#FAF7F0]/10 pb-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-xs text-[#2DD4BF]">{b.id}</span>
                    <span className="text-[10px] text-[#FAF7F0]/40 font-mono">
                      {b.createdAt ? b.createdAt.split("T")[0] : ""}
                    </span>
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </div>

                {/* Customer and Car info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#FAF7F0] truncate">{b.fullName}</h4>
                    <p className="text-xs font-semibold text-[#5EEAD4] mt-0.5">{b.carName}</p>
                    <span className="text-[10px] text-[#FAF7F0]/40 font-mono block mt-0.5">
                      {b.rentalType === "chauffeur" ? "VIP Chauffeur" : "Self-Drive"}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-[#2DD4BF] font-mono">{formatINR(b.totalPrice)}</span>
                    <span className="block text-[10px] text-[#FAF7F0]/50 mt-0.5">
                      {b.days} {b.days === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>

                {/* Schedule strip */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#FAF7F0]/70 bg-[#061110]/60 p-2 rounded-xl border border-[#FAF7F0]/5">
                  <Calendar className="h-3 w-3 text-[#2DD4BF] shrink-0" />
                  <span className="truncate">
                    {b.pickupDate} ({b.pickupTime}) → {b.dropoffDate}
                  </span>
                </div>

                {/* Card Actions Bar */}
                <div
                  className="flex items-center justify-between gap-2 pt-1 border-t border-[#FAF7F0]/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {getWhatsAppNumber(b.phone) && (
                      <a
                        href={`https://wa.me/${getWhatsAppNumber(b.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-2.5 transition-colors shadow-sm"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>Chat</span>
                      </a>
                    )}
                    {b.phone && !b.phone.includes("#ERROR") && (
                      <a
                        href={`tel:${b.phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F0]/10 text-[#FAF7F0] text-[11px] font-semibold py-1.5 px-2.5 hover:bg-[#FAF7F0]/20 transition-colors border border-[#FAF7F0]/10"
                      >
                        <Phone className="h-3 w-3 text-[#2DD4BF]" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "confirmed")}
                        className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-[#061110] px-2.5 py-1.5 text-xs font-semibold transition-colors border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Confirm</span>
                      </button>
                    )}
                    <Button
                      onClick={() => setActiveBookingModal(b)}
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[11px] border-[#FAF7F0]/15 bg-transparent text-[#FAF7F0]/80"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW (Screens >= md): High-density Table */}
        <div className="hidden md:block rounded-2xl border border-[#FAF7F0]/10 bg-[#0A1917]/70 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#071413] text-[#FAF7F0]/60 font-mono text-[11px] uppercase tracking-wider border-b border-[#FAF7F0]/10">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">BMW Model</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Rental Type</th>
                  <th className="py-3.5 px-4">Total (₹)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F0]/5 text-[#FAF7F0]/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[#FAF7F0]/40">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#2DD4BF]" />
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[#FAF7F0]/40">
                      <Car className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#2DD4BF]" />
                      <p className="text-base text-[#FAF7F0]/70 font-medium">No bookings match your filter criteria.</p>
                      <p className="text-xs text-[#FAF7F0]/40 mt-1">New submissions from customers will appear here immediately.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-[#14B8A6]/[0.06] transition-colors cursor-pointer group"
                      onClick={() => setActiveBookingModal(b)}
                    >
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-bold text-[#2DD4BF]">
                        {b.id}
                        <span className="block text-[10px] text-[#FAF7F0]/40 font-sans font-normal">
                          {b.createdAt ? b.createdAt.split("T")[0] : ""}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#FAF7F0] group-hover:text-[#2DD4BF] transition-colors">
                          {b.fullName}
                        </div>
                        <div className="text-[#FAF7F0]/60 text-xs flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3 w-3 text-[#2DD4BF]/70" />
                          <span>
                            {b.phone && !b.phone.includes("#ERROR") ? (
                              b.phone
                            ) : (
                              <span className="text-amber-400/80 italic text-[11px]">Phone needs update</span>
                            )}
                          </span>
                        </div>
                        <div className="text-[#FAF7F0]/40 text-[11px] truncate max-w-[180px]">
                          {b.email}
                        </div>
                      </td>

                      {/* Car */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-[#FAF7F0]">{b.carName}</span>
                        <span className="block text-[11px] text-[#FAF7F0]/50 font-mono">
                          {formatINR(b.carDailyRate)}/day
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 text-xs">
                        <div className="flex items-center gap-1 text-[#FAF7F0]/90">
                          <Calendar className="h-3 w-3 text-[#2DD4BF]" />
                          <span>{b.pickupDate} ({b.pickupTime})</span>
                        </div>
                        <div className="text-[#FAF7F0]/50 text-[11px] mt-0.5">
                          to {b.dropoffDate} • <strong className="text-[#FAF7F0]/80">{b.days} {b.days === 1 ? 'day' : 'days'}</strong>
                        </div>
                      </td>

                      {/* Rental Type */}
                      <td className="py-4 px-4">
                        {b.rentalType === "chauffeur" ? (
                          <Badge className="bg-[#2DD4BF]/15 text-[#5EEAD4] border-[#2DD4BF]/30 text-[10px]">
                            Chauffeur VIP
                          </Badge>
                        ) : (
                          <Badge className="bg-[#FAF7F0]/10 text-[#FAF7F0]/80 border-[#FAF7F0]/15 text-[10px]">
                            Self-Drive
                          </Badge>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono font-bold text-[#2DD4BF] text-sm sm:text-base">
                        {formatINR(b.totalPrice)}
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
                              className="rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-[#061110] p-1.5 transition-colors border border-emerald-500/30 cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <Button
                            onClick={() => setActiveBookingModal(b)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-[#FAF7F0]/70 hover:text-[#2DD4BF] hover:bg-[#FAF7F0]/5"
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

      {/* Booking Details Modal (Responsive for Mobile Screens) */}
      {activeBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-[#FAF7F0]/15 bg-[#0A1917] p-4 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveBookingModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#FAF7F0]/50 hover:text-[#FAF7F0] p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between border-b border-[#FAF7F0]/10 pb-3 sm:pb-4 mb-4 sm:mb-6 pr-6">
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#2DD4BF]">
                  Booking Dossier
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FAF7F0] flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{activeBookingModal.id}</span>
                  {getStatusBadge(activeBookingModal.status)}
                </h3>
              </div>
            </div>

            {/* Customer Contact Bar */}
            <div className="rounded-xl sm:rounded-2xl bg-[#061110] border border-[#FAF7F0]/10 p-3.5 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h4 className="font-bold text-[#FAF7F0] text-sm sm:text-base">{activeBookingModal.fullName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#FAF7F0]/60">Mobile:</span>
                  <span className="text-xs font-mono font-semibold text-[#5EEAD4]">
                    {activeBookingModal.phone && !activeBookingModal.phone.includes("#ERROR")
                      ? activeBookingModal.phone
                      : "Not Available / Needs Update"}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#FAF7F0]/60 mt-0.5">
                  Driver&apos;s License / ID:{" "}
                  <span className="text-[#FAF7F0]/90 font-mono">
                    {activeBookingModal.licenseNumber || "N/A"}
                  </span>
                </p>
              </div>

              {/* Quick Contact Links */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {getWhatsAppNumber(activeBookingModal.phone) && (
                  <a
                    href={`https://wa.me/${getWhatsAppNumber(activeBookingModal.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 transition-colors shadow-sm"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {activeBookingModal.phone && !activeBookingModal.phone.includes("#ERROR") && (
                  <a
                    href={`tel:${activeBookingModal.phone.replace(/[^0-9+]/g, "")}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 text-[#FAF7F0] text-xs font-semibold py-2 px-3 transition-colors border border-[#FAF7F0]/15"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>Call</span>
                  </a>
                )}

                {activeBookingModal.email && (
                  <a
                    href={`mailto:${activeBookingModal.email}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 text-[#FAF7F0] text-xs font-semibold py-2 px-3 transition-colors border border-[#FAF7F0]/15"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 text-xs mb-4 sm:mb-6">
              <div className="rounded-xl bg-[#061110]/70 p-3 sm:p-3.5 border border-[#FAF7F0]/10 space-y-1">
                <span className="text-[#FAF7F0]/50 block uppercase font-mono text-[10px]">Vehicle Reserved</span>
                <span className="font-bold text-xs sm:text-sm text-[#FAF7F0]">{activeBookingModal.carName}</span>
                <span className="block text-[#FAF7F0]/60 font-mono text-[11px]">Daily Rate: {formatINR(activeBookingModal.carDailyRate)} / day</span>
              </div>

              <div className="rounded-xl bg-[#061110]/70 p-3 sm:p-3.5 border border-[#FAF7F0]/10 space-y-1">
                <span className="text-[#FAF7F0]/50 block uppercase font-mono text-[10px]">Schedule & Duration</span>
                <span className="font-bold text-xs sm:text-sm text-[#FAF7F0]">
                  {activeBookingModal.pickupDate} ({activeBookingModal.pickupTime})
                </span>
                <span className="block text-[#FAF7F0]/60 text-[11px]">
                  to {activeBookingModal.dropoffDate} ({activeBookingModal.dropoffTime}) • {activeBookingModal.days} Days
                </span>
              </div>

              <div className="rounded-xl bg-[#061110]/70 p-3 sm:p-3.5 border border-[#FAF7F0]/10 space-y-1">
                <span className="text-[#FAF7F0]/50 block uppercase font-mono text-[10px]">Pickup Location</span>
                <span className="font-medium text-[#FAF7F0]">{activeBookingModal.pickupLocation}</span>
              </div>

              <div className="rounded-xl bg-[#061110]/70 p-3 sm:p-3.5 border border-[#FAF7F0]/10 space-y-1">
                <span className="text-[#FAF7F0]/50 block uppercase font-mono text-[10px]">Drop-off Location</span>
                <span className="font-medium text-[#FAF7F0]">{activeBookingModal.dropoffLocation}</span>
              </div>
            </div>

            {/* Special Notes */}
            {activeBookingModal.notes && (
              <div className="rounded-xl bg-[#061110]/70 p-3 sm:p-4 border border-[#FAF7F0]/10 mb-4 sm:mb-6 text-xs">
                <span className="text-[#FAF7F0]/50 block uppercase font-mono text-[10px] mb-1">
                  Customer Special Requests & Notes:
                </span>
                <p className="text-[#FAF7F0]/90 leading-relaxed italic">
                  &ldquo;{activeBookingModal.notes}&rdquo;
                </p>
              </div>
            )}

            {/* Price breakdown */}
            <div className="rounded-xl bg-[#061110] border border-[#2DD4BF]/20 p-3.5 sm:p-4 mb-4 sm:mb-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] sm:text-xs text-[#FAF7F0]/60 block uppercase font-mono">
                  Total Fee ({activeBookingModal.rentalType})
                </span>
                <span className="text-[11px] sm:text-xs text-[#2DD4BF]">Insurance & Handover Included</span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-[#2DD4BF] font-mono">{formatINR(activeBookingModal.totalPrice)}</span>
            </div>

            {/* Status Change Buttons */}
            <div className="border-t border-[#FAF7F0]/10 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-[#FAF7F0]/60">Update Booking Status:</span>
              <div className="grid grid-cols-3 sm:flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "pending")}
                  className={`text-xs ${
                    activeBookingModal.status === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-[#061110] text-[#FAF7F0]/80 hover:bg-[#FAF7F0]/10 border border-[#FAF7F0]/15"
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
                      : "bg-[#061110] text-[#FAF7F0]/80 hover:bg-[#FAF7F0]/10 border border-[#FAF7F0]/15"
                  }`}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "completed")}
                  className={`text-xs ${
                    activeBookingModal.status === "completed"
                      ? "bg-[#14B8A6] text-[#061110] font-semibold"
                      : "bg-[#061110] text-[#FAF7F0]/80 hover:bg-[#FAF7F0]/10 border border-[#FAF7F0]/15"
                  }`}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(activeBookingModal.id, "cancelled")}
                  className={`text-xs col-span-3 sm:col-span-1 ${
                    activeBookingModal.status === "cancelled"
                      ? "bg-rose-600 text-white"
                      : "bg-[#061110] text-[#FAF7F0]/80 hover:bg-[#FAF7F0]/10 border border-[#FAF7F0]/15"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-[#FAF7F0]/15 bg-[#0A1917] p-4 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#FAF7F0]/50 hover:text-[#FAF7F0] p-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#FAF7F0]/10 pb-4 mb-5 sm:mb-6 pr-6">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 shrink-0">
                <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#FAF7F0]">Google Sheets Integration</h3>
                <p className="text-[11px] sm:text-xs text-[#FAF7F0]/60">Connect Google Apps Script Web App to sync bookings in your spreadsheet</p>
              </div>
            </div>

            {/* Input URL */}
            <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#FAF7F0]/80 block">
                Google Apps Script Web App URL
              </label>
              <Input
                placeholder="https://script.google.com/macros/s/XXXXX/exec"
                value={gasUrlInput}
                onChange={(e) => setGasUrlInput(e.target.value)}
                className="border-[#FAF7F0]/15 bg-[#061110] text-[#FAF7F0] font-mono text-xs focus:border-[#2DD4BF] h-10"
              />
              <p className="text-[10px] sm:text-[11px] text-[#FAF7F0]/50">
                Leave empty to run in local demo mode. When configured, bookings are written directly to Google Sheets and read from there.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <Button
                onClick={handleSaveGasUrl}
                className="bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#061110] font-bold text-xs h-10"
              >
                Save & Connect
              </Button>
              <Button
                onClick={copyAppsScript}
                variant="outline"
                className="border-[#FAF7F0]/15 bg-[#061110] text-[#FAF7F0]/80 hover:text-[#2DD4BF] hover:bg-[#102623] text-xs gap-1.5 h-10"
              >
                <Copy className="h-3.5 w-3.5 text-[#2DD4BF]" />
                <span>{copiedCode ? "Copied Script to Clipboard!" : "Copy Fixed Apps Script Code"}</span>
              </Button>
              {saveStatus && <span className="text-xs text-[#5EEAD4] text-center sm:text-left">{saveStatus}</span>}
            </div>

            {/* Fix Notice for #ERROR! */}
            <div className="rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 mb-4 sm:mb-6 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Wrench className="h-4 w-4 shrink-0" />
                <span>Fix for Google Sheets Phone #ERROR! Formula Parse Error</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed text-[11px] sm:text-xs">
                Google Sheets automatically interprets text starting with <code className="text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded font-mono">+</code> as an arithmetic formula, causing <code className="text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded font-mono">#ERROR!</code>. The updated script forces Plain Text formatting (<code className="text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded font-mono">@</code>) and prefixes phone numbers safely with <code className="text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded font-mono">&apos;</code>.
              </p>
            </div>

            {/* Setup Instructions */}
            <div className="rounded-xl sm:rounded-2xl bg-[#061110]/80 border border-[#FAF7F0]/10 p-4 sm:p-5 text-xs text-[#FAF7F0]/80 space-y-2.5 sm:space-y-3">
              <span className="font-bold text-[#FAF7F0] uppercase tracking-wider block">
                How to update / deploy in Google Sheets:
              </span>
              <ol className="list-decimal list-inside space-y-2 text-[#FAF7F0]/60 leading-relaxed text-[11px] sm:text-xs">
                <li>Open your Google Sheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-[#2DD4BF] underline">Google Sheets</a></li>
                <li>Go to <strong className="text-[#FAF7F0]">Extensions &gt; Apps Script</strong></li>
                <li>Click <strong className="text-[#FAF7F0]">&quot;Copy Fixed Apps Script Code&quot;</strong> above, select all existing code in the editor, and paste the replacement.</li>
                <li>Click <strong className="text-[#FAF7F0]">Deploy &gt; Manage deployments</strong> &gt; Edit (pencil icon) &gt; Version: <em>New version</em> &gt; <strong>Deploy</strong>.</li>
                <li>Ensure access is set to <em className="text-[#FAF7F0]">&quot;Anyone&quot;</em>.</li>
                <li>Copy the URL ending in <code className="text-[#2DD4BF]">/exec</code> and paste it into the field above.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
