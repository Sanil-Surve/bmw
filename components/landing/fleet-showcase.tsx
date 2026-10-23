"use client";

import { useState } from "react";
import Image from "next/image";
import { FLEET_CARS } from "@/lib/fleet";
import { CarModel } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Timer,
  Users,
  Settings,
  Sparkles,
  Check,
  ChevronRight,
  Shield,
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
    <section id="fleet" className="py-20 bg-zinc-950 text-white border-b border-white/10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Exclusive Munich Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              The BMW Fleet
            </h2>
            <p className="mt-3 max-w-xl text-zinc-400 text-sm sm:text-base">
              Every vehicle in our collection is maintained to factory M-specifications, detailed before each handover, and backed by comprehensive coverage.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              {/* Car Image with Badge */}
              <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-black/80 backdrop-blur-md text-white border-white/20 text-xs">
                    {car.category}
                  </Badge>
                  {car.badge && (
                    <Badge className="bg-blue-600/90 text-white border-none text-xs font-semibold">
                      {car.badge}
                    </Badge>
                  )}
                </div>

                {/* Price pill */}
                <div className="absolute bottom-4 right-4 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 text-right shadow-lg">
                  <span className="text-xl font-black text-white">${car.pricePerDay}</span>
                  <span className="text-xs text-zinc-400"> / day</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                    {car.modelCode}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {car.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {car.tagline}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-black/50 p-3 border border-white/5 mb-5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-400" />
                    <span>{car.specs.power}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-400" />
                    <span>{car.specs.acceleration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-400" />
                    <span className="truncate">{car.specs.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>{car.specs.seats} Passengers</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-1.5 mb-6 text-xs text-zinc-400 flex-1">
                  {car.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button
                  onClick={() => onSelectCar(car.id)}
                  className="w-full bg-zinc-800 hover:bg-blue-600 text-white font-medium text-xs sm:text-sm py-2.5 rounded-xl border border-white/10 group-hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Select & Book This BMW</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
