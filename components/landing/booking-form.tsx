"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  FLEET_CARS,
  POPULAR_LOCATIONS,
  RENTAL_PACKAGES,
  EXTRA_CHARGES,
  CONTACT_INFO,
} from "@/lib/fleet";
import { BookingFormData, Booking } from "@/types/booking";
import { formatINR, isValidIndianMobile, formatIndianMobile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface BookingFormProps {
  selectedCarId: string;
  onCarChange: (carId: string) => void;
  selectedPackageId?: string;
  onPackageChange?: (pkgId: string) => void;
}

export function BookingForm({
  selectedCarId,
  selectedPackageId,
  onPackageChange,
}: BookingFormProps) {
  const [todayMinDate, setTodayMinDate] = useState<string>("");

  const [activePackageId, setActivePackageId] = useState<string>(
    selectedPackageId || "full-day"
  );

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    carId: selectedCarId || FLEET_CARS[0].id,
    packageId: selectedPackageId || "full-day",
    pickupDate: "",
    pickupTime: "10:00",
    dropoffDate: "",
    dropoffTime: "18:00",
    pickupLocation: POPULAR_LOCATIONS[0],
    dropoffLocation: POPULAR_LOCATIONS[0],
    rentalType: "chauffeur",
    notes: "",
  });

  useEffect(() => {
    const t = setTimeout(() => {
      const today = new Date();
      const format = (d: Date) => d.toISOString().split("T")[0];

      setTodayMinDate(format(today));
      setFormData((prev) => ({
        ...prev,
        pickupDate: prev.pickupDate || format(today),
        dropoffDate: prev.dropoffDate || format(today),
      }));
    }, 0);

    return () => clearTimeout(t);
  }, []);

  // Synchronously sync prop changes
  const [prevCarId, setPrevCarId] = useState(selectedCarId);
  if (selectedCarId && selectedCarId !== prevCarId) {
    setPrevCarId(selectedCarId);
    setFormData((prev) => ({ ...prev, carId: selectedCarId }));
  }

  const [prevPkgId, setPrevPkgId] = useState(selectedPackageId);
  if (selectedPackageId && selectedPackageId !== prevPkgId) {
    setPrevPkgId(selectedPackageId);
    setActivePackageId(selectedPackageId);
    setFormData((prev) => ({ ...prev, packageId: selectedPackageId }));
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const currentCar = useMemo(() => {
    return FLEET_CARS.find((c) => c.id === formData.carId) || FLEET_CARS[0];
  }, [formData.carId]);

  const selectedPackage = useMemo(() => {
    return (
      RENTAL_PACKAGES.find((p) => p.id === activePackageId) ||
      RENTAL_PACKAGES.find((p) => p.id === "full-day") ||
      RENTAL_PACKAGES[0]
    );
  }, [activePackageId]);

  const totalPrice = useMemo(() => {
    const isMultiDay = activePackageId === "multiday";

    if (!isMultiDay) {
      return selectedPackage.price;
    }

    if (!formData.pickupDate || !formData.dropoffDate) {
      return currentCar.pricePerDay;
    }

    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const diff = Math.max(end.getTime() - start.getTime(), 0);
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return currentCar.pricePerDay * days;
  }, [activePackageId, selectedPackage, currentCar.pricePerDay, formData.pickupDate, formData.dropoffDate]);

  const handlePackageSelect = (pkgId: string) => {
    setActivePackageId(pkgId);
    setFormData((prev) => ({ ...prev, packageId: pkgId }));
    if (onPackageChange) onPackageChange(pkgId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidIndianMobile(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number (e.g. 9594781000).");
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
          packageId: activePackageId,
          packageName: selectedPackage.name,
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
    <section id="booking" className="py-10 sm:py-16 md:py-20 relative border-b border-slate-200 bg-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-600 mb-2 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Instant Reservation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Reserve Your BMW 520D
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-light">
            Fast curbside handover across Mumbai & Navi Mumbai with zero hidden fees.
          </p>
        </div>

        {confirmedBooking ? (
          /* Success Card */
          <div className="max-w-md mx-auto rounded-2xl border border-teal-500/30 bg-white p-5 sm:p-8 shadow-xl shadow-teal-500/10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mx-auto mb-3 border border-teal-200">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-600 font-bold block mb-1">
              Reservation Confirmed
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
              Thank You, {confirmedBooking.fullName}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Your BMW 520D ({confirmedBooking.packageName || selectedPackage.name}) booking is reserved. Our concierge will contact you on WhatsApp.
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">Ref ID:</span>
                <span className="font-mono font-bold text-teal-700">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">Tariff:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.packageName || selectedPackage.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-800">{confirmedBooking.pickupDate} ({confirmedBooking.pickupTime})</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="font-semibold text-slate-700">Total:</span>
                <span className="font-black text-amber-700 text-sm">{formatINR(confirmedBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleReset}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl h-9 text-xs font-semibold cursor-pointer"
              >
                New Booking
              </Button>
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        ) : (
          /* Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-md shadow-slate-200/40">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Duty / Tariff Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-xs font-semibold tracking-wider text-slate-700 uppercase flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>Select Duty / Tariff Package *</span>
                    </Label>
                    <span className="text-xs text-amber-700 font-mono font-bold">
                      {formatINR(totalPrice)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                    {RENTAL_PACKAGES.map((pkg) => {
                      const isSelected = activePackageId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => handlePackageSelect(pkg.id)}
                          className={`flex flex-col text-left p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-500 bg-amber-50/80 ring-1 ring-amber-500 shadow-2xs"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {pkg.name}
                            </span>
                            <span className="text-amber-700 font-black text-[11px] shrink-0">
                              {formatINR(pkg.price)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                            {pkg.durationText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rental Preference */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rentalType: "chauffeur" })}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      formData.rentalType === "chauffeur"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="text-xs font-bold block">Chauffeur Driven</span>
                    <span className="text-[10px] text-amber-700 block">Included with package</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rentalType: "self-drive" })}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      formData.rentalType === "self-drive"
                        ? "border-amber-500 bg-amber-50 text-amber-950 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="text-xs font-bold block">Self-Drive</span>
                    <span className="text-[10px] text-slate-500 block">Security deposit req.</span>
                  </button>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                      <span>Pickup Date & Time *</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Input
                        type="date"
                        required
                        min={todayMinDate || undefined}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-xs h-9 px-2"
                      />
                      <Input
                        type="time"
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="border-slate-200 bg-slate-50 text-xs h-9 px-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-600" />
                      <span>Pickup Location *</span>
                    </Label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    >
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs text-slate-700 font-medium">
                        Your Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        placeholder="Vikram Singhania"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="border-slate-200 bg-slate-50 h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs text-slate-700 font-medium">
                        Mobile Number (WhatsApp) *
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-xs font-mono text-amber-700 font-bold border-r border-slate-200 pr-1.5">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          maxLength={15}
                          placeholder="95947 81000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-13 border-slate-200 bg-slate-50 text-slate-900 font-mono h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="notes" className="text-xs text-slate-700 font-medium">
                      Special Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      placeholder="e.g. Flight 6E-204 at T2 Terminal, White ribbon dressing for wedding, etc."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="border-slate-200 bg-slate-50 text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-bold text-xs sm:text-sm h-10 sm:h-11 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0"
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

            {/* Right Summary Card */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-md">
                <div className="relative w-full aspect-[16/9] bg-slate-950">
                  <Image
                    src={currentCar.image}
                    alt={currentCar.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-slate-700">
                      BMW 520D
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 space-y-3 bg-white">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Package:</span>
                      <span className="font-bold text-slate-900">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Coverage:</span>
                      <span className="font-mono text-slate-700">{selectedPackage.durationText}</span>
                    </div>
                    <div className="flex justify-between text-teal-700 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Chauffeur & FASTag
                      </span>
                      <span>Included</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">Total Tariff:</span>
                      <span className="text-xl font-black text-amber-700">{formatINR(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Extra Charges Quick Notice */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-2.5 text-[10px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Extra KM: <b className="text-slate-800">₹{EXTRA_CHARGES.extraKmRate}/km</b></span>
                      <span>Extra Hour: <b className="text-slate-800">₹{EXTRA_CHARGES.extraHourRate}/hr</b></span>
                    </div>
                    <div className="flex justify-between pt-0.5 border-t border-slate-200/60">
                      <span>Night (10PM-6AM): <b className="text-slate-800">₹{EXTRA_CHARGES.nightAllowance}</b></span>
                      <span>Toll: <b className="text-slate-800">Actuals</b></span>
                    </div>
                  </div>

                  {/* Instant WhatsApp Direct */}
                  <a
                    href={CONTACT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 transition-all shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Book on WhatsApp ({CONTACT_INFO.phone})</span>
                  </a>

                  <a
                    href={CONTACT_INFO.phoneTel}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 text-amber-600" />
                    <span>Call Concierge: {CONTACT_INFO.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
