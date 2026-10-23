"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FLEET_CARS, POPULAR_LOCATIONS } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Car,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
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
    <section className="relative overflow-hidden bg-black text-white py-16 md:py-24 border-b border-white/10">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-md mb-6 shadow-sm shadow-blue-500/20">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="tracking-wide uppercase font-mono text-[11px]">
              2026 Premier BMW Fleet Available
            </span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Sparkles className="h-3 w-3 text-blue-400" /> Instant Reservation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            The Ultimate <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">
              Driving Experience,
            </span>{" "}
            Delivered.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
            Rent Munich’s finest engineering. From track-ready <span className="text-white font-medium">BMW M4 & M5 Competition</span> models to executive <span className="text-white font-medium">7-Series Limousines</span>. Delivered directly to your hotel, airport terminal, or residence.
          </p>

          {/* Quick Booking Filter Bar */}
          <div className="w-full max-w-4xl rounded-2xl border border-white/15 bg-zinc-950/90 p-3 sm:p-4 backdrop-blur-xl shadow-2xl shadow-black/80 mb-12">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
              {/* Car Selection */}
              <div className="flex flex-col justify-center rounded-xl bg-zinc-900/90 p-3 border border-white/5 hover:border-blue-500/30 transition-colors">
                <label className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5 mb-1.5">
                  <Car className="h-3.5 w-3.5 text-blue-400" />
                  Select BMW Model
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
                >
                  {FLEET_CARS.map((car) => (
                    <option key={car.id} value={car.id} className="bg-zinc-900 text-white">
                      {car.name} (${car.pricePerDay}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Selection */}
              <div className="flex flex-col justify-center rounded-xl bg-zinc-900/90 p-3 border border-white/5 hover:border-blue-500/30 transition-colors">
                <label className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  Pickup Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer truncate"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-zinc-900 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Date */}
              <div className="flex flex-col justify-center rounded-xl bg-zinc-900/90 p-3 border border-white/5 hover:border-blue-500/30 transition-colors">
                <label className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={selectedDate || undefined}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-1">
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" /> Full Comprehensive Insurance
                </span>
                <span className="hidden sm:inline text-zinc-600">•</span>
                <span className="hidden sm:inline">24/7 Roadside VIP Concierge</span>
              </div>
              <Button
                onClick={handleQuickBook}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Reserve Selected BMW</span>
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl border-t border-white/10 pt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">2.9s</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider mt-1">0 - 60 mph Peak</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-blue-400 tracking-tight">627 HP</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Max V8 Output</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">100%</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Guaranteed Model</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">4.98★</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Driver Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
