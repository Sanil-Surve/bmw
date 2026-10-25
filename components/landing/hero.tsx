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
  Sparkles,
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
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleQuickBook = () => {
    onSelectCarAndScroll(selectedCarId);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-28 border-b border-[#FAF7F0]/10">
      {/* Ambient Seafoam & Cream Luminous Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-[#14B8A6]/20 via-[#2DD4BF]/15 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] bg-[#FAF7F0]/[0.05] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#0D9488]/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Subtle modern geometric grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F0 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Minimal Glass Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-1.5 text-xs font-medium text-[#5EEAD4] backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
            <span className="flex h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="tracking-widest uppercase font-mono text-[11px] text-[#FAF7F0]">
              Premier BMW Fleet • India
            </span>
          </div>

          {/* Clean, Majestic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF7F0] leading-[1.08] mb-6">
            Pure Performance. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2DD4BF] via-[#5EEAD4] to-[#FAF7F0] bg-clip-text text-transparent">
              Unrivaled Luxury.
            </span>
          </h1>

          {/* Refined Concise Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-[#FAF7F0]/70 leading-relaxed mb-12 font-light">
            Rent Munich’s finest engineering across Mumbai, Delhi NCR, Bengaluru, Hyderabad, and Goa. Handcrafted track power and executive comfort, delivered directly to your doorstep.
          </p>

          {/* Elegant Glassmorphic Quick Booking Bar */}
          <div className="w-full max-w-4xl rounded-3xl border border-[#FAF7F0]/15 bg-[#0A1A18]/65 p-3 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(250,247,240,0.15)] mb-14">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
              {/* Car Selection */}
              <div className="flex flex-col justify-center rounded-2xl bg-[#061110]/60 p-3.5 border border-[#FAF7F0]/10 hover:border-[#2DD4BF]/40 transition-all backdrop-blur-md">
                <label className="text-[10px] font-semibold tracking-wider text-[#FAF7F0]/60 uppercase flex items-center gap-1.5 mb-1.5">
                  <Car className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  BMW Model
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[#FAF7F0] focus:outline-none cursor-pointer truncate"
                >
                  {FLEET_CARS.map((car) => (
                    <option key={car.id} value={car.id} className="bg-[#091A18] text-[#FAF7F0]">
                      {car.name} ({formatINR(car.pricePerDay)}/d)
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Selection */}
              <div className="flex flex-col justify-center rounded-2xl bg-[#061110]/60 p-3.5 border border-[#FAF7F0]/10 hover:border-[#2DD4BF]/40 transition-all backdrop-blur-md">
                <label className="text-[10px] font-semibold tracking-wider text-[#FAF7F0]/60 uppercase flex items-center gap-1.5 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  Pickup Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[#FAF7F0] focus:outline-none cursor-pointer truncate"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#091A18] text-[#FAF7F0]">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col justify-center rounded-2xl bg-[#061110]/60 p-3.5 border border-[#FAF7F0]/10 hover:border-[#2DD4BF]/40 transition-all backdrop-blur-md">
                <label className="text-[10px] font-semibold tracking-wider text-[#FAF7F0]/60 uppercase flex items-center gap-1.5 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={selectedDate || undefined}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[#FAF7F0] focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Action Button & Minimal Trust Badges */}
            <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1">
              <div className="flex items-center gap-4 text-xs text-[#FAF7F0]/60">
                <span className="flex items-center gap-1.5 text-[#5EEAD4]">
                  <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" /> Comprehensive Coverage
                </span>
                <span className="hidden sm:inline text-[#FAF7F0]/20">•</span>
                <span className="hidden sm:inline text-[#FAF7F0]/70 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-[#2DD4BF]" /> Express FASTag
                </span>
              </div>
              <Button
                onClick={handleQuickBook}
                className="w-full sm:w-auto bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF] hover:from-[#0D9488] hover:to-[#14B8A6] text-[#061110] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all cursor-pointer border-0"
              >
                <span>Reserve Vehicle</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Refined Glass Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            <div className="rounded-2xl border border-[#FAF7F0]/10 bg-[#FAF7F0]/[0.03] p-4 backdrop-blur-xl">
              <span className="text-3xl font-extrabold text-[#FAF7F0] tracking-tight">3.0s</span>
              <span className="text-[11px] text-[#FAF7F0]/50 uppercase tracking-widest block mt-1 font-mono">0 - 100 km/h</span>
            </div>
            <div className="rounded-2xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.05] p-4 backdrop-blur-xl">
              <span className="text-3xl font-extrabold text-[#2DD4BF] tracking-tight">627 HP</span>
              <span className="text-[11px] text-[#5EEAD4]/70 uppercase tracking-widest block mt-1 font-mono">Peak V8 Output</span>
            </div>
            <div className="rounded-2xl border border-[#FAF7F0]/10 bg-[#FAF7F0]/[0.03] p-4 backdrop-blur-xl">
              <span className="text-3xl font-extrabold text-[#FAF7F0] tracking-tight">Curbside</span>
              <span className="text-[11px] text-[#FAF7F0]/50 uppercase tracking-widest block mt-1 font-mono">Doorstep Delivery</span>
            </div>
            <div className="rounded-2xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.05] p-4 backdrop-blur-xl">
              <span className="text-3xl font-extrabold text-[#5EEAD4] tracking-tight">4.98★</span>
              <span className="text-[11px] text-[#5EEAD4]/70 uppercase tracking-widest block mt-1 font-mono">Client Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
