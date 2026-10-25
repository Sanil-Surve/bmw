"use client";

import { useState, useEffect } from "react";
import { FLEET_CARS, POPULAR_LOCATIONS } from "@/lib/fleet";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Car,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HeroProps {
  onSelectCarAndScroll: (carId: string) => void;
}

export function Hero({ onSelectCarAndScroll }: HeroProps) {
  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET_CARS[0].id);
  const [selectedLocation, setSelectedLocation] = useState<string>(POPULAR_LOCATIONS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleQuickBook = () => {
    onSelectCarAndScroll(selectedCarId);
  };

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 md:py-28 border-b border-slate-200 bg-white">
      {/* Ambient Seafoam Luminous Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[300px] sm:h-[360px] bg-gradient-to-tr from-teal-500/12 via-cyan-500/8 to-transparent blur-[120px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-teal-500/5 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] bg-teal-600/8 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />

      {/* Subtle modern geometric grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Minimal Glass Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/25 bg-teal-50 px-3.5 py-1.5 text-xs font-medium text-teal-800 backdrop-blur-xl mb-6 sm:mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="tracking-widest uppercase font-mono text-[10px] sm:text-[11px] font-semibold">
              Premier BMW Fleet • India
            </span>
          </div>

          {/* Clean, Majestic Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6">
            Pure Performance. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-slate-900 bg-clip-text text-transparent">
              Unrivaled Luxury.
            </span>
          </h1>

          {/* Refined Concise Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 sm:mb-12 font-light px-2 sm:px-0">
            Rent Munich’s finest engineering across Mumbai, Delhi NCR, Bengaluru, Hyderabad, and Goa. Handcrafted track power and executive comfort, delivered directly to your doorstep.
          </p>

          {/* Elegant Quick Booking Bar */}
          <div className="w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white/95 p-3 sm:p-5 backdrop-blur-2xl shadow-xl shadow-slate-200/60 mb-8 sm:mb-14">
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-3 text-left">
              {/* Car Selection */}
              <div className="flex flex-col justify-center rounded-xl sm:rounded-2xl bg-slate-50/90 p-3 sm:p-3.5 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white transition-all">
                <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                  <Car className="h-3.5 w-3.5 text-teal-600" />
                  BMW Model
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 focus:outline-none cursor-pointer truncate [color-scheme:light]"
                >
                  {FLEET_CARS.map((car) => (
                    <option key={car.id} value={car.id} className="bg-white text-slate-900">
                      {car.name} ({formatINR(car.pricePerDay)}/d)
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Selection */}
              <div className="flex flex-col justify-center rounded-xl sm:rounded-2xl bg-slate-50/90 p-3 sm:p-3.5 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white transition-all">
                <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  Pickup Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 focus:outline-none cursor-pointer truncate [color-scheme:light]"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-white text-slate-900">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col justify-center rounded-xl sm:rounded-2xl bg-slate-50/90 p-3 sm:p-3.5 border border-slate-200/80 hover:border-teal-500/40 hover:bg-white transition-all">
                <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={selectedDate || undefined}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 focus:outline-none cursor-pointer [color-scheme:light]"
                />
              </div>
            </div>

            {/* Quick Action Button & Trust Badges */}
            <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1">
              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-slate-600 w-full sm:w-auto">
                <span className="flex items-center gap-1.5 text-teal-700 text-[11px] sm:text-xs font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" /> Comprehensive Coverage
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 flex items-center gap-1 text-[11px] sm:text-xs">
                  <Zap className="h-3.5 w-3.5 text-teal-600 shrink-0" /> FASTag
                </span>
              </div>
              <Button
                onClick={handleQuickBook}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 h-10 rounded-xl shadow-md shadow-teal-600/25 transition-all cursor-pointer border-0"
              >
                <span>Reserve Vehicle</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Refined Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-4xl">
            <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-4 text-left sm:text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate block">
                3.0s
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-widest block mt-0.5 sm:mt-1 font-mono">
                0 - 100 km/h
              </span>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-teal-500/20 bg-teal-50/60 p-3 sm:p-4 text-left sm:text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-teal-700 tracking-tight truncate block">
                627 HP
              </span>
              <span className="text-[10px] sm:text-[11px] text-teal-700/80 uppercase tracking-widest block mt-0.5 sm:mt-1 font-mono font-medium">
                Peak V8 Output
              </span>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-4 text-left sm:text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate block">
                Curbside
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-widest block mt-0.5 sm:mt-1 font-mono">
                Doorstep Delivery
              </span>
            </div>
            <div className="rounded-xl sm:rounded-2xl border border-teal-500/20 bg-teal-50/60 p-3 sm:p-4 text-left sm:text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-teal-700 tracking-tight truncate block">
                4.98★
              </span>
              <span className="text-[10px] sm:text-[11px] text-teal-700/80 uppercase tracking-widest block mt-0.5 sm:mt-1 font-mono font-medium">
                Client Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
