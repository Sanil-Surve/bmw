"use client";

import { useState } from "react";
import Image from "next/image";
import { FLEET_CARS } from "@/lib/fleet";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Gauge,
  Timer,
  Users,
  Settings,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";

interface FleetShowcaseProps {
  onSelectCar: (carId: string) => void;
}

const CATEGORIES = [
  "All",
  "M Performance",
  "Supercar / Hybrid",
  "Luxury Sedan",
  "Performance SUV",
];

export function FleetShowcase({ onSelectCar }: FleetShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCars =
    activeCategory === "All"
      ? FLEET_CARS
      : FLEET_CARS.filter((car) => car.category === activeCategory);

  return (
    <section id="fleet" className="py-14 sm:py-20 md:py-24 relative border-b border-slate-200 bg-slate-50/60 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-48 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/8 blur-[120px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/8 blur-[120px] sm:blur-[140px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-teal-600 mb-2 sm:mb-2.5 font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              The BMW Fleet
            </h2>
            <p className="mt-1.5 sm:mt-2.5 max-w-lg text-slate-600 text-xs sm:text-base font-light">
              M-engineered performance and refined luxury, prepared for seamless curbside handover.
            </p>
          </div>

          {/* Category Tabs (Scrollable on mobile with touch swiping) */}
          <div className="flex overflow-x-auto pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap gap-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                    isActive
                      ? "bg-teal-600 text-white font-bold shadow-teal-600/20"
                      : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-300 hover:border-teal-500/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 shadow-md shadow-slate-200/40"
            >
              {/* Car Image with Badges */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-1.5 sm:gap-2">
                  <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-slate-800 border border-slate-200 shadow-sm">
                    {car.category}
                  </span>
                  {car.badge && (
                    <span className="rounded-full bg-teal-600 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-sm">
                      {car.badge}
                    </span>
                  )}
                </div>

                {/* Price pill */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 px-3 py-1 sm:px-3.5 sm:py-1.5 text-right shadow-md">
                  <span className="text-lg sm:text-xl font-black text-slate-900">{formatINR(car.pricePerDay)}</span>
                  <span className="text-[11px] sm:text-xs text-teal-600 font-semibold"> / day</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-6 bg-white">
                <div className="mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-[11px] font-mono text-teal-600 font-bold uppercase tracking-widest block mb-0.5 sm:mb-1">
                    {car.modelCode}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {car.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 font-light">
                    {car.tagline}
                  </p>
                </div>

                {/* Minimal Specs Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-slate-50 p-2.5 sm:p-3 border border-slate-200/80 mb-4 sm:mb-5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Gauge className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                    <span className="truncate">{car.specs.power}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Timer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                    <span className="truncate">{car.specs.acceleration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                    <span className="truncate">{car.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                    <span className="truncate">{car.specs.seats} Seats</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-5 sm:mb-6 text-xs text-slate-600 flex-1">
                  {car.features.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button
                  onClick={() => onSelectCar(car.id)}
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 h-10 sm:h-11 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 group/btn border-0"
                >
                  <span>Select & Reserve</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
