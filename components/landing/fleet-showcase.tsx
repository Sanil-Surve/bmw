"use client";

import Image from "next/image";
import { FLEET_CARS } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import {
  Gauge,
  Timer,
  Users,
  Settings,
  Sparkles,
  Check,
  ChevronRight,
  HeartHandshake,
  Briefcase,
  Plane,
  Crown,
} from "lucide-react";

interface FleetShowcaseProps {
  onSelectCar: (carId: string) => void;
}

export function FleetShowcase({ onSelectCar }: FleetShowcaseProps) {
  const car = FLEET_CARS[0];

  return (
    <section id="vehicle" className="py-10 sm:py-16 md:py-20 relative border-b border-slate-200 bg-slate-50/60 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-600 mb-2 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>The Featured Vehicle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            BMW 520D Luxury Sedan
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-light">
            Munich precision engineering, plush executive rear cabin, and refined highway performance.
          </p>
        </div>

        {/* 2-Column Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Car Image & Key Specs */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-md">
            <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
              <Image
                src={car.image}
                alt={car.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-slate-700">
                  Alpine White
                </span>
                <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-900">
                  Luxury Line
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                  <Gauge className="h-3.5 w-3.5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Power</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">190 HP</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                  <Timer className="h-3.5 w-3.5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">0-100</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">7.2s</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                  <Settings className="h-3.5 w-3.5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Gearbox</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">8-Speed</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                  <Users className="h-3.5 w-3.5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Seats</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">5 Seater</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Service Highlights & Booking Action */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <HeartHandshake className="h-4 w-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Weddings & Grooms</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Pristine white sedan, bridal ribbon dressing ready, and courteous chauffeur in formal attire.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Briefcase className="h-4 w-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Corporate Delegations</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Official 18% GST invoices, quiet expressway travel, laptop/phone charging on board.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Plane className="h-4 w-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">T1 & T2 Airport Transfers</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Curbside nameboard meet & greet with real-time flight tracking and zero wait penalties.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown className="h-4 w-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">VIP Chauffeur Transit</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  Polite English-speaking driver, pre-loaded FASTag, and guaranteed immaculate maintenance.
                </p>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="rounded-xl bg-white border border-slate-200 p-3.5 sm:p-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2 font-bold">
                Cabin & Handover Highlights:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Plush Dakota Leather & Rear Blinds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Dual-Zone Rear Climate Control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Harman Kardon Surround Sound</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Expressway FASTag Included</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <Button
              onClick={() => onSelectCar(car.id)}
              className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-bold text-xs sm:text-sm py-2.5 h-10 sm:h-11 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0"
            >
              <span>Reserve This BMW 520D</span>
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
