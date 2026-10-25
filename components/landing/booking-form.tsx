"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [todayMinDate, setTodayMinDate] = useState<string>("");

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

  useEffect(() => {
    const t = setTimeout(() => {
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
    }, 0);

    return () => clearTimeout(t);
  }, []);

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
    <section id="booking" className="py-14 sm:py-20 md:py-24 relative border-b border-slate-200 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[350px] sm:h-[550px] bg-teal-500/8 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-teal-600 mb-2 sm:mb-2.5 font-semibold">
            <span>Instant Reservation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Reserve Your BMW
          </h2>
          <p className="mt-1.5 sm:mt-2.5 text-slate-600 text-xs sm:text-base font-light">
            Guaranteed model allocation with curbside handover across India.
          </p>
        </div>

        {confirmedBooking ? (
          /* Success Card */
          <div className="max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-teal-500/30 bg-white p-5 sm:p-10 shadow-2xl shadow-teal-500/10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-4 sm:mb-6 border border-teal-200 shadow-sm">
                <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>

              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-teal-600 font-semibold mb-1">
                Booking Confirmed
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Thank You, {confirmedBooking.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6">
                Your reservation for the <span className="text-slate-900 font-medium">{confirmedBooking.carName}</span> has been confirmed. Our concierge is preparing your handover.
              </p>

              {/* Reference Box */}
              <div className="w-full rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 mb-6 text-left space-y-2.5 sm:space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 uppercase font-mono text-[10px] sm:text-xs">Reference ID</span>
                  <span className="font-mono font-bold text-teal-600 text-xs sm:text-sm">{confirmedBooking.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Vehicle</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[180px] sm:max-w-none">{confirmedBooking.carName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="text-slate-800 text-right text-[11px] sm:text-xs">
                    {confirmedBooking.pickupDate} to {confirmedBooking.dropoffDate} ({confirmedBooking.days} {confirmedBooking.days === 1 ? "day" : "days"})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-800 truncate max-w-[160px] sm:max-w-[220px] text-right">{confirmedBooking.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-700 font-medium">Total (INR)</span>
                  <span className="text-base sm:text-lg font-black text-teal-600">{formatINR(confirmedBooking.totalPrice)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl cursor-pointer h-10 sm:h-11 text-xs sm:text-sm font-semibold"
                >
                  Book Another Vehicle
                </Button>
                <Link
                  href="/admin"
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-xs sm:text-sm h-10 sm:h-11 px-4 transition-all shadow-md shadow-teal-600/20"
                >
                  <span>Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-xl shadow-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {errorMessage && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 sm:p-3.5 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Vehicle Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-teal-600" />
                      Model
                    </Label>
                    <span className="text-xs text-teal-600 font-mono font-semibold">
                      {formatINR(currentCar.pricePerDay)}/day
                    </span>
                  </div>
                  <select
                    value={formData.carId}
                    onChange={(e) => {
                      setFormData({ ...formData, carId: e.target.value });
                      onCarChange(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none cursor-pointer [color-scheme:light]"
                  >
                    {FLEET_CARS.map((car) => (
                      <option key={car.id} value={car.id} className="bg-white text-slate-900">
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
                        ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Self-Drive</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Pure driving joy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rentalType: "chauffeur" })}
                    className={`flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border transition-all cursor-pointer min-h-[58px] ${
                      formData.rentalType === "chauffeur"
                        ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">VIP Chauffeur</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                      +{formatINR(CHAUFFEUR_DAILY_RATE)}/day
                    </span>
                  </button>
                </div>

                {/* Dates & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" />
                      Pickup Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={todayMinDate || undefined}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 text-xs [color-scheme:light] min-w-0 h-10 px-2 sm:px-3 focus:bg-white focus:border-teal-600"
                      />
                      <Input
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 text-xs [color-scheme:light] min-w-0 h-10 px-2 sm:px-3 focus:bg-white focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" />
                      Drop-off Date & Time
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        required
                        min={formData.pickupDate || todayMinDate || undefined}
                        value={formData.dropoffDate}
                        onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 text-xs [color-scheme:light] min-w-0 h-10 px-2 sm:px-3 focus:bg-white focus:border-teal-600"
                      />
                      <Input
                        type="time"
                        value={formData.dropoffTime}
                        onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 text-xs [color-scheme:light] min-w-0 h-10 px-2 sm:px-3 focus:bg-white focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      Pickup Location
                    </Label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none [color-scheme:light]"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-white text-slate-900">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      Drop-off Location
                    </Label>
                    <select
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-teal-600 focus:bg-white focus:outline-none [color-scheme:light]"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-white text-slate-900">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="pt-2 sm:pt-3 border-t border-slate-200 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs text-slate-700 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Vikram Singhania"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 h-10 text-xs sm:text-sm focus:bg-white focus:border-teal-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs text-slate-700 font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="vikram@singhania.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 h-10 text-xs sm:text-sm focus:bg-white focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs text-slate-700 font-medium">
                        Mobile Number (WhatsApp) *
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-mono text-teal-600 font-semibold border-r border-slate-200 pr-2">
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
                          className="pl-14 border-slate-200 bg-slate-50 text-slate-900 font-mono h-10 text-xs sm:text-sm focus:bg-white focus:border-teal-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="license" className="text-xs text-slate-700 font-medium">
                        Driving Licence / Passport
                      </Label>
                      <Input
                        id="license"
                        placeholder="MH-02-2020-0012345"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-slate-900 font-mono h-10 text-xs sm:text-sm focus:bg-white focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs text-slate-700 font-medium">
                      Special Requests / Delivery Address
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Flight 6E-204 arriving at T2 Mumbai, doorstep handover."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="border-slate-200 bg-slate-50 text-slate-900 resize-none text-xs sm:text-sm focus:bg-white focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl shadow-lg shadow-teal-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 border-0"
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
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="relative h-40 sm:h-44 w-full bg-slate-900">
                  <Image
                    src={currentCar.image}
                    alt={currentCar.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-slate-800 border border-slate-200 shadow-sm">
                      {currentCar.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3.5 sm:left-4">
                    <span className="text-[10px] sm:text-[11px] font-mono text-teal-400 font-bold uppercase tracking-widest block">
                      {currentCar.modelCode}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">{currentCar.name}</h3>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 bg-white">
                  {/* Clean Specs Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-slate-500 block text-[9px] uppercase font-mono font-medium">Power</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block">{currentCar.specs.power}</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-slate-500 block text-[9px] uppercase font-mono font-medium">0-100 km/h</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block">{currentCar.specs.acceleration.split(" ")[0]}</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-slate-500 block text-[9px] uppercase font-mono font-medium">Seats</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate block">{currentCar.specs.seats}</span>
                    </div>
                  </div>

                  {/* Clean Price Breakdown */}
                  <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 space-y-2 sm:space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        Vehicle Rental ({rentalDays} {rentalDays === 1 ? "day" : "days"})
                      </span>
                      <span className="font-semibold text-slate-800">{formatINR(dailyPrice)}</span>
                    </div>

                    {formData.rentalType === "chauffeur" && (
                      <div className="flex justify-between text-slate-600">
                        <span>Chauffeur Service ({rentalDays} d)</span>
                        <span className="font-semibold text-teal-600">+{formatINR(chauffeurFee)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-teal-700 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Insurance & FASTag
                      </span>
                      <span>Included</span>
                    </div>

                    <div className="pt-2 sm:pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Total</span>
                      <span className="text-xl sm:text-2xl font-black text-teal-600">{formatINR(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="space-y-1.5 sm:space-y-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                      <span>Complimentary cancellation up to 24h prior.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
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
