"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FLEET_CARS, POPULAR_LOCATIONS } from "@/lib/fleet";
import { BookingFormData, Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";

interface BookingFormProps {
  selectedCarId: string;
  onCarChange: (carId: string) => void;
}

export function BookingForm({ selectedCarId, onCarChange }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    carId: selectedCarId || FLEET_CARS[0].id,
    pickupDate: "",
    pickupTime: "10:00",
    dropoffDate: "",
    dropoffTime: "18:00",
    pickupLocation: POPULAR_LOCATIONS[0],
    dropoffLocation: POPULAR_LOCATIONS[0],
    rentalType: "self-drive",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [syncedToSheets, setSyncedToSheets] = useState<boolean | null>(null);
  const [todayMinDate, setTodayMinDate] = useState<string>("");

  // Sync external car selection changes
  useEffect(() => {
    if (selectedCarId) {
      setFormData((prev) => ({ ...prev, carId: selectedCarId }));
    }
  }, [selectedCarId]);

  // Set default dates (tomorrow and 3 days later)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const format = (d: Date) => d.toISOString().split("T")[0];

    setTodayMinDate(format(today));
    setFormData((prev) => ({
      ...prev,
      pickupDate: prev.pickupDate || format(tomorrow),
      dropoffDate: prev.dropoffDate || format(threeDaysLater),
    }));
  }, []);

  const currentCar = useMemo(() => {
    return FLEET_CARS.find((c) => c.id === formData.carId) || FLEET_CARS[0];
  }, [formData.carId]);

  // Calculate rental duration and price
  const { rentalDays, dailyPrice, chauffeurFee, totalPrice } = useMemo(() => {
    if (!formData.pickupDate || !formData.dropoffDate) {
      return { rentalDays: 1, dailyPrice: currentCar.pricePerDay, chauffeurFee: 0, totalPrice: currentCar.pricePerDay };
    }
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const diff = Math.max(end.getTime() - start.getTime(), 1000 * 60 * 60 * 24);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    const base = currentCar.pricePerDay * days;
    const chauffeur = formData.rentalType === "chauffeur" ? 120 * days : 0;
    return {
      rentalDays: days,
      dailyPrice: base,
      chauffeurFee: chauffeur,
      totalPrice: base + chauffeur,
    };
  }, [formData.pickupDate, formData.dropoffDate, formData.rentalType, currentCar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Check if custom Google Apps Script URL exists in client localStorage
      let customScriptUrl: string | undefined = undefined;
      if (typeof window !== "undefined") {
        customScriptUrl = localStorage.getItem("bmw_custom_gas_url") || undefined;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customScriptUrl ? { "x-google-script-url": customScriptUrl } : {}),
        },
        body: JSON.stringify({
          ...formData,
          scriptUrl: customScriptUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking. Please try again.");
      }

      setConfirmedBooking(data.booking);
      setSyncedToSheets(data.syncedToGoogleSheets ?? null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setSyncedToSheets(null);
    setErrorMessage(null);
  };

  return (
    <section id="booking" className="py-20 bg-black text-white relative border-b border-white/10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="border-blue-500/40 bg-blue-950/40 text-blue-400 font-mono text-xs uppercase mb-3">
            Instant Reserve
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Book Your BMW Rental
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Complete the form below to lock in your reservation. All bookings are synced directly to our concierge team and Google Sheets.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success Card */
          <div className="max-w-2xl mx-auto rounded-3xl border border-emerald-500/30 bg-zinc-950/90 p-8 sm:p-10 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
                Booking Confirmed & Recorded
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Thank You, {confirmedBooking.fullName}!
              </h3>
              <p className="text-sm text-zinc-400 max-w-md mb-6">
                Your reservation for the <span className="text-white font-medium">{confirmedBooking.carName}</span> has been received. Our rental manager has your details.
              </p>

              {/* Booking Reference Box */}
              <div className="w-full rounded-2xl bg-zinc-900 border border-white/10 p-5 mb-6 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400 uppercase font-mono">Reference Number</span>
                  <span className="font-mono text-sm font-bold text-blue-400">{confirmedBooking.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Selected Vehicle</span>
                  <span className="text-sm font-semibold text-white">{confirmedBooking.carName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Dates & Duration</span>
                  <span className="text-sm text-zinc-200">
                    {confirmedBooking.pickupDate} to {confirmedBooking.dropoffDate} ({confirmedBooking.days} {confirmedBooking.days === 1 ? 'day' : 'days'})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Pickup Location</span>
                  <span className="text-sm text-zinc-200 truncate max-w-[220px]">{confirmedBooking.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Total Estimated Price</span>
                  <span className="text-lg font-black text-emerald-400">${confirmedBooking.totalPrice}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400">Google Sheets Storage</span>
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                    {syncedToSheets ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Synced to Sheet
                      </span>
                    ) : (
                      <span className="text-blue-400 flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" /> Recorded in System
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* What happens next */}
              <div className="w-full rounded-xl bg-blue-950/30 border border-blue-500/20 p-4 mb-8 text-left text-xs text-blue-200">
                <span className="font-semibold block mb-1">What Happens Next?</span>
                <p className="text-blue-300/80 leading-relaxed">
                  Our dispatch concierge will message you via WhatsApp or phone at <strong className="text-white">{confirmedBooking.phone}</strong> to confirm your exact delivery coordinates and ID verification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                >
                  Book Another Vehicle
                </Button>
                <Link
                  href="/admin"
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm h-9 px-4 transition-colors"
                >
                  <span>View in Owner Admin</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* The Interactive Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Form Input Fields */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-4 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Vehicle Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-blue-400" />
                      1. Select Your BMW Model
                    </Label>
                    <span className="text-xs text-blue-400 font-mono">${currentCar.pricePerDay}/day</span>
                  </div>
                  <select
                    value={formData.carId}
                    onChange={(e) => {
                      setFormData({ ...formData, carId: e.target.value });
                      onCarChange(e.target.value);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/90 px-3.5 py-2.5 text-sm font-medium text-white focus:border-blue-500 focus:outline-none"
                  >
                    {FLEET_CARS.map((car) => (
                      <option key={car.id} value={car.id} className="bg-zinc-900 text-white">
                        {car.name} — ${car.pricePerDay}/day ({car.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section 2: Rental Type Selection (Self-Drive vs Chauffeur) */}
                <div>
                  <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase block mb-2">
                    Rental Preference
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, rentalType: "self-drive" })}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-center border transition-all ${
                        formData.rentalType === "self-drive"
                          ? "border-blue-500 bg-blue-600/10 text-white font-medium"
                          : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-sm font-bold">Self-Drive Experience</span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">Full control & driving joy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, rentalType: "chauffeur" })}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-center border transition-all ${
                        formData.rentalType === "chauffeur"
                          ? "border-blue-500 bg-blue-600/10 text-white font-medium"
                          : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-sm font-bold">Chauffeur-Driven</span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">VIP Driver (+$120/day)</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: Dates & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pickup */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      Pickup Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={todayMinDate || undefined}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white text-xs sm:text-sm"
                      />
                      <Input
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      Drop-off Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={formData.pickupDate || todayMinDate || undefined}
                        value={formData.dropoffDate}
                        onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white text-xs sm:text-sm"
                      />
                      <Input
                        type="time"
                        value={formData.dropoffTime}
                        onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      Pickup Location
                    </Label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-zinc-900 text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-400" />
                      Drop-off Location
                    </Label>
                    <select
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-zinc-900 text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 5: Driver Information */}
                <div className="pt-2 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-bold tracking-wider text-zinc-300 uppercase flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Customer Details (Stored in Google Sheets)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs text-zinc-400">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="e.g. Alexander Wright"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-zinc-400">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="alexander@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs text-zinc-400">
                        Phone Number (w/ WhatsApp) *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="license" className="text-xs text-zinc-400">
                        Driver's License / Passport No.
                      </Label>
                      <Input
                        id="license"
                        placeholder="e.g. DL-98327491"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="border-white/10 bg-zinc-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs text-zinc-400">
                      Special Requests / Flight Number / Delivery Notes
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Flight LH442 arriving at Terminal 3, request extra luggage space."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="border-white/10 bg-zinc-900 text-white resize-none text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm sm:text-base py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving Reservation to Google Sheets...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book for ${totalPrice}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Right 5 Columns: Vehicle Card & Price Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Selected Car Highlight Card */}
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 overflow-hidden backdrop-blur-xl shadow-xl">
                <div className="relative h-48 w-full bg-zinc-900">
                  <Image
                    src={currentCar.image}
                    alt={currentCar.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/80 text-white border-white/20 text-xs">
                      {currentCar.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                      {currentCar.modelCode}
                    </span>
                    <h3 className="text-xl font-bold text-white">{currentCar.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Key specs badge strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-zinc-900 p-2 border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">Power</span>
                      <span className="font-bold text-white">{currentCar.specs.power}</span>
                    </div>
                    <div className="rounded-lg bg-zinc-900 p-2 border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">0-60</span>
                      <span className="font-bold text-white">{currentCar.specs.acceleration.split(" ")[0]}</span>
                    </div>
                    <div className="rounded-lg bg-zinc-900 p-2 border border-white/5">
                      <span className="text-zinc-500 block text-[10px] uppercase">Seats</span>
                      <span className="font-bold text-white">{currentCar.specs.seats}</span>
                    </div>
                  </div>

                  {/* Price Calculation Summary */}
                  <div className="rounded-2xl bg-zinc-900/90 border border-white/10 p-4 space-y-2.5 text-xs">
                    <span className="font-bold uppercase tracking-wider text-zinc-400 block pb-1 border-b border-white/5">
                      Rental Summary
                    </span>
                    <div className="flex justify-between text-zinc-300">
                      <span>
                        Vehicle Base ({rentalDays} {rentalDays === 1 ? 'day' : 'days'} × ${currentCar.pricePerDay})
                      </span>
                      <span className="font-semibold text-white">${dailyPrice}</span>
                    </div>

                    {formData.rentalType === "chauffeur" && (
                      <div className="flex justify-between text-zinc-300">
                        <span>Chauffeur Service ({rentalDays} days × $120)</span>
                        <span className="font-semibold text-blue-400">+${chauffeurFee}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Full Coverage Insurance
                      </span>
                      <span className="font-semibold">$0 (Included)</span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                      <span>Delivery & Handover</span>
                      <span className="font-semibold text-zinc-200">Complimentary</span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-white">Estimated Total</span>
                      <span className="text-2xl font-black text-blue-400">${totalPrice}</span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="space-y-2 text-[11px] text-zinc-400 pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Zero cancellation fees up to 24 hours prior to handover.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Cleanliness & sanitized cabin guarantee before every delivery.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
