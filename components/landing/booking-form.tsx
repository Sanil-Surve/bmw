"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FLEET_CARS, POPULAR_LOCATIONS, CHAUFFEUR_DAILY_RATE } from "@/lib/fleet";
import { BookingFormData, Booking } from "@/types/booking";
import { formatINR, isValidIndianMobile, formatIndianMobile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Zap,
} from "lucide-react";

interface BookingFormProps {
  selectedCarId: string;
  onCarChange: (carId: string) => void;
}

export function BookingForm({ selectedCarId, onCarChange }: BookingFormProps) {
  const [todayMinDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [formData, setFormData] = useState<BookingFormData>(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const format = (d: Date) => d.toISOString().split("T")[0];

    return {
      fullName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      carId: selectedCarId || FLEET_CARS[0].id,
      pickupDate: format(tomorrow),
      pickupTime: "10:00",
      dropoffDate: format(threeDaysLater),
      dropoffTime: "18:00",
      pickupLocation: POPULAR_LOCATIONS[0],
      dropoffLocation: POPULAR_LOCATIONS[0],
      rentalType: "self-drive",
      notes: "",
    };
  });

  // Synchronously sync prop change without triggering cascading effect renders
  const [prevCarId, setPrevCarId] = useState(selectedCarId);
  if (selectedCarId && selectedCarId !== prevCarId) {
    setPrevCarId(selectedCarId);
    setFormData((prev) => ({ ...prev, carId: selectedCarId }));
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const currentCar = useMemo(() => {
    return FLEET_CARS.find((c) => c.id === formData.carId) || FLEET_CARS[0];
  }, [formData.carId]);

  const { rentalDays, dailyPrice, chauffeurFee, totalPrice } = useMemo(() => {
    if (!formData.pickupDate || !formData.dropoffDate) {
      return {
        rentalDays: 1,
        dailyPrice: currentCar.pricePerDay,
        chauffeurFee: 0,
        totalPrice: currentCar.pricePerDay,
      };
    }
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const diff = Math.max(end.getTime() - start.getTime(), 1000 * 60 * 60 * 24);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    const base = currentCar.pricePerDay * days;
    const chauffeur = formData.rentalType === "chauffeur" ? CHAUFFEUR_DAILY_RATE * days : 0;
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

    if (!isValidIndianMobile(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      let customScriptUrl: string | undefined = undefined;
      if (typeof window !== "undefined") {
        customScriptUrl = localStorage.getItem("bmw_custom_gas_url") || undefined;
      }

      const formattedPhone = formatIndianMobile(formData.phone);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customScriptUrl ? { "x-google-script-url": customScriptUrl } : {}),
        },
        body: JSON.stringify({
          ...formData,
          phone: formattedPhone,
          scriptUrl: customScriptUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking. Please try again.");
      }

      setConfirmedBooking(data.booking);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setErrorMessage(null);
  };

  return (
    <section id="booking" className="py-14 sm:py-20 md:py-24 relative border-b border-[#FAF7F0]/10 overflow-hidden">
      {/* Luminous Seafoam Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[350px] sm:h-[550px] bg-[#14B8A6]/12 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#2DD4BF] mb-2 sm:mb-2.5">
            <span>Instant Reservation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAF7F0]">
            Reserve Your BMW
          </h2>
          <p className="mt-1.5 sm:mt-2.5 text-[#FAF7F0]/65 text-xs sm:text-base font-light">
            Guaranteed model allocation with curbside handover across India.
          </p>
        </div>

        {confirmedBooking ? (
          /* Glassmorphic Success Card */
          <div className="max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-[#2DD4BF]/30 bg-[#091A18]/85 p-5 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#2DD4BF]/15 text-[#2DD4BF] mb-4 sm:mb-6 border border-[#2DD4BF]/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>

              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#2DD4BF] mb-1">
                Booking Confirmed
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-[#FAF7F0] mb-2">
                Thank You, {confirmedBooking.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF7F0]/60 max-w-md mb-6">
                Your reservation for the <span className="text-[#FAF7F0] font-medium">{confirmedBooking.carName}</span> has been confirmed. Our concierge is preparing your handover.
              </p>

              {/* Reference Box */}
              <div className="w-full rounded-xl sm:rounded-2xl bg-[#061110]/70 border border-[#FAF7F0]/10 p-4 sm:p-5 mb-6 text-left space-y-2.5 sm:space-y-3 text-xs backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-[#FAF7F0]/10 pb-2">
                  <span className="text-[#FAF7F0]/50 uppercase font-mono text-[10px] sm:text-xs">Reference ID</span>
                  <span className="font-mono font-bold text-[#2DD4BF] text-xs sm:text-sm">{confirmedBooking.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#FAF7F0]/10 pb-2">
                  <span className="text-[#FAF7F0]/50">Vehicle</span>
                  <span className="font-semibold text-[#FAF7F0] text-right truncate max-w-[180px] sm:max-w-none">{confirmedBooking.carName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#FAF7F0]/10 pb-2">
                  <span className="text-[#FAF7F0]/50">Duration</span>
                  <span className="text-[#FAF7F0] text-right text-[11px] sm:text-xs">
                    {confirmedBooking.pickupDate} to {confirmedBooking.dropoffDate} ({confirmedBooking.days} {confirmedBooking.days === 1 ? "day" : "days"})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#FAF7F0]/10 pb-2">
                  <span className="text-[#FAF7F0]/50">Location</span>
                  <span className="text-[#FAF7F0] truncate max-w-[160px] sm:max-w-[220px] text-right">{confirmedBooking.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#FAF7F0]/70 font-medium">Total (INR)</span>
                  <span className="text-base sm:text-lg font-black text-[#2DD4BF]">{formatINR(confirmedBooking.totalPrice)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-[#FAF7F0]/[0.08] hover:bg-[#FAF7F0]/[0.15] text-[#FAF7F0] border border-[#FAF7F0]/15 rounded-xl cursor-pointer h-10 sm:h-11 text-xs sm:text-sm font-semibold"
                >
                  Book Another Vehicle
                </Button>
                <Link
                  href="/admin"
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF] text-[#061110] font-bold text-xs sm:text-sm h-10 sm:h-11 px-4 transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)]"
                >
                  <span>Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Glassmorphic Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-[#FAF7F0]/12 bg-[#091A18]/65 p-4 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(250,247,240,0.12)]">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {errorMessage && (
                  <div className="rounded-xl bg-red-950/40 border border-red-500/30 p-3 sm:p-3.5 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Vehicle Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold tracking-wider text-[#FAF7F0]/70 uppercase flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Model
                    </Label>
                    <span className="text-xs text-[#2DD4BF] font-mono font-semibold">
                      {formatINR(currentCar.pricePerDay)}/day
                    </span>
                  </div>
                  <select
                    value={formData.carId}
                    onChange={(e) => {
                      setFormData({ ...formData, carId: e.target.value });
                      onCarChange(e.target.value);
                    }}
                    className="w-full rounded-xl border border-[#FAF7F0]/12 bg-[#061110]/60 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#FAF7F0] focus:border-[#2DD4BF] focus:outline-none backdrop-blur-md cursor-pointer [color-scheme:dark]"
                  >
                    {FLEET_CARS.map((car) => (
                      <option key={car.id} value={car.id} className="bg-[#091A18] text-[#FAF7F0]">
                        {car.name} — {formatINR(car.pricePerDay)}/day
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rental Preference */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rentalType: "self-drive" })}
                    className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border transition-all cursor-pointer min-h-[58px] ${
                      formData.rentalType === "self-drive"
                        ? "border-[#2DD4BF] bg-[#2DD4BF]/15 text-[#FAF7F0] shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                        : "border-[#FAF7F0]/10 bg-[#061110]/40 text-[#FAF7F0]/50 hover:border-[#FAF7F0]/20"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Self-Drive</span>
                    <span className="text-[9px] sm:text-[10px] text-[#FAF7F0]/60 mt-0.5">Pure driving joy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rentalType: "chauffeur" })}
                    className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border transition-all cursor-pointer min-h-[58px] ${
                      formData.rentalType === "chauffeur"
                        ? "border-[#2DD4BF] bg-[#2DD4BF]/15 text-[#FAF7F0] shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                        : "border-[#FAF7F0]/10 bg-[#061110]/40 text-[#FAF7F0]/50 hover:border-[#FAF7F0]/20"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">VIP Chauffeur</span>
                    <span className="text-[9px] sm:text-[10px] text-[#FAF7F0]/60 mt-0.5">
                      +{formatINR(CHAUFFEUR_DAILY_RATE)}/day
                    </span>
                  </button>
                </div>

                {/* Dates & Times (Optimized for Mobile Screens) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-[#FAF7F0]/70 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Pickup Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={todayMinDate || undefined}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] text-xs [color-scheme:dark] min-w-0 h-10 px-2 sm:px-3"
                      />
                      <Input
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] text-xs [color-scheme:dark] min-w-0 h-10 px-2 sm:px-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-[#FAF7F0]/70 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Drop-off Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={formData.pickupDate || todayMinDate || undefined}
                        value={formData.dropoffDate}
                        onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] text-xs [color-scheme:dark] min-w-0 h-10 px-2 sm:px-3"
                      />
                      <Input
                        type="time"
                        value={formData.dropoffTime}
                        onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] text-xs [color-scheme:dark] min-w-0 h-10 px-2 sm:px-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-[#FAF7F0]/70 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Pickup Location
                    </Label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full rounded-xl border border-[#FAF7F0]/12 bg-[#061110]/60 px-3 py-2.5 text-xs sm:text-sm text-[#FAF7F0] focus:border-[#2DD4BF] focus:outline-none [color-scheme:dark]"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-[#091A18] text-[#FAF7F0]">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-[#FAF7F0]/70 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Drop-off Location
                    </Label>
                    <select
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      className="w-full rounded-xl border border-[#FAF7F0]/12 bg-[#061110]/60 px-3 py-2.5 text-xs sm:text-sm text-[#FAF7F0] focus:border-[#2DD4BF] focus:outline-none [color-scheme:dark]"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-[#091A18] text-[#FAF7F0]">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="pt-2 sm:pt-3 border-t border-[#FAF7F0]/10 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs text-[#FAF7F0]/70">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Vikram Singhania"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-[#FAF7F0]/70">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="vikram@singhania.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs text-[#FAF7F0]/70">
                        Mobile Number (WhatsApp) *
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-mono text-[#2DD4BF] border-r border-[#FAF7F0]/10 pr-2">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          maxLength={15}
                          placeholder="98201 54920"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-14 border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] font-mono h-10 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="license" className="text-xs text-[#FAF7F0]/70">
                        Driving Licence / Passport
                      </Label>
                      <Input
                        id="license"
                        placeholder="MH-02-2020-0012345"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] font-mono h-10 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs text-[#FAF7F0]/70">
                      Special Requests / Delivery Address
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Flight 6E-204 arriving at T2 Mumbai, doorstep handover."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="border-[#FAF7F0]/12 bg-[#061110]/60 text-[#FAF7F0] resize-none text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF] hover:from-[#0D9488] hover:to-[#14B8A6] text-[#061110] font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 border-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book for {formatINR(totalPrice)}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-[#FAF7F0]/12 bg-[#091A18]/65 overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(250,247,240,0.12)]">
                <div className="relative h-40 sm:h-44 w-full bg-[#061110]">
                  <Image
                    src={currentCar.image}
                    alt={currentCar.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091A18] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-[#061110]/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-[#FAF7F0] border border-[#FAF7F0]/15">
                      {currentCar.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3.5 sm:left-4">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#2DD4BF] uppercase tracking-widest block">
                      {currentCar.modelCode}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#FAF7F0]">{currentCar.name}</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                  {/* Clean Specs Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-[#061110]/50 p-2 border border-[#FAF7F0]/10">
                      <span className="text-[#FAF7F0]/40 block text-[9px] uppercase font-mono">Power</span>
                      <span className="font-bold text-[#FAF7F0] text-xs sm:text-sm truncate block">{currentCar.specs.power}</span>
                    </div>
                    <div className="rounded-xl bg-[#061110]/50 p-2 border border-[#FAF7F0]/10">
                      <span className="text-[#FAF7F0]/40 block text-[9px] uppercase font-mono">0-100 km/h</span>
                      <span className="font-bold text-[#FAF7F0] text-xs sm:text-sm truncate block">{currentCar.specs.acceleration.split(" ")[0]}</span>
                    </div>
                    <div className="rounded-xl bg-[#061110]/50 p-2 border border-[#FAF7F0]/10">
                      <span className="text-[#FAF7F0]/40 block text-[9px] uppercase font-mono">Seats</span>
                      <span className="font-bold text-[#FAF7F0] text-xs sm:text-sm truncate block">{currentCar.specs.seats}</span>
                    </div>
                  </div>

                  {/* Clean Price Breakdown */}
                  <div className="rounded-xl sm:rounded-2xl bg-[#061110]/60 border border-[#FAF7F0]/10 p-3.5 sm:p-4 space-y-2 sm:space-y-2.5 text-xs backdrop-blur-md">
                    <div className="flex justify-between text-[#FAF7F0]/70">
                      <span>
                        Vehicle Rental ({rentalDays} {rentalDays === 1 ? "day" : "days"})
                      </span>
                      <span className="font-semibold text-[#FAF7F0]">{formatINR(dailyPrice)}</span>
                    </div>

                    {formData.rentalType === "chauffeur" && (
                      <div className="flex justify-between text-[#FAF7F0]/70">
                        <span>Chauffeur Service ({rentalDays} d)</span>
                        <span className="font-semibold text-[#2DD4BF]">+{formatINR(chauffeurFee)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#5EEAD4]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4BF]" /> Insurance & FASTag
                      </span>
                      <span>Included</span>
                    </div>

                    <div className="pt-2 sm:pt-2.5 border-t border-[#FAF7F0]/10 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-[#FAF7F0]">Total</span>
                      <span className="text-xl sm:text-2xl font-black text-[#2DD4BF]">{formatINR(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="space-y-1.5 sm:space-y-2 text-[11px] text-[#FAF7F0]/60 pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2DD4BF] shrink-0" />
                      <span>Complimentary cancellation up to 24h prior.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2DD4BF] shrink-0" />
                      <span>FASTag equipped for all national expressways.</span>
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
