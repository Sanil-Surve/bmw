"use client";

import {
  Clock,
  Plane,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { RENTAL_PACKAGES, EXTRA_CHARGES } from "@/lib/fleet";
import { formatINR } from "@/lib/utils";

interface TariffSectionProps {
  onSelectPackage: (packageId: string) => void;
}

export function TariffSection({ onSelectPackage }: TariffSectionProps) {
  const dutyPackages = RENTAL_PACKAGES.filter((p) => p.category === "duty");
  const transferPackages = RENTAL_PACKAGES.filter((p) => p.category === "transfer");

  return (
    <section id="pricing" className="py-10 sm:py-16 md:py-20 relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl mb-3 shadow-2xs">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="tracking-widest uppercase font-mono text-[10px] sm:text-[11px] font-bold">
              Transparent Tariff Card
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            Rental Packages & Rates
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-light">
            Guaranteed white-glove chauffeur service with zero hidden charges.
          </p>
        </div>

        {/* 5 Main Duty Packages (Responsive 2-col on mobile, 5-col on desktop) */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Hourly & Kilometer Duties</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono hidden sm:inline">
              Tap package to book
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {dutyPackages.map((pkg) => {
              const isBest = pkg.id === "full-day";
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                    isBest
                      ? "border-amber-400 bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-2.5 right-2 sm:right-3">
                      <span
                        className={`rounded-full px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                          isBest
                            ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs sm:text-base font-bold text-white mb-0.5">
                      {pkg.name}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-mono text-amber-300/90 font-medium block mb-2">
                      {pkg.durationText}
                    </span>

                    <div className="mb-2">
                      <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                        {formatINR(pkg.price)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-amber-400">
                    <span>Reserve</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Airport & Navi Mumbai Transfers */}
        <div className="mb-8 sm:mb-10 rounded-xl sm:rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900 to-amber-950/20 p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm sm:text-lg font-bold text-white">
                Airport & Navi Mumbai Express Transfers
              </h3>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-amber-300 font-semibold">
              COMFORTABLE • SAFE • ON TIME
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transferPackages.map((trans) => (
              <button
                key={trans.id}
                type="button"
                onClick={() => onSelectPackage(trans.id)}
                className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-left hover:border-amber-400/50 transition-all cursor-pointer"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {trans.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    One-Way Curbside Handover
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <span className="text-base sm:text-xl font-black text-amber-400 block">
                      {formatINR(trans.price)}
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Extra Charges Strip */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
              Transparent Extra Charges:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 sm:p-2.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Extra KM</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                ₹{EXTRA_CHARGES.extraKmRate}/Km
              </span>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 sm:p-2.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Extra Hour</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                ₹{EXTRA_CHARGES.extraHourRate.toLocaleString("en-IN")}/hr
              </span>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 sm:p-2.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Night Allowance</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                ₹{EXTRA_CHARGES.nightAllowance.toLocaleString("en-IN")}
              </span>
              <span className="text-[8px] text-slate-500 font-mono block">10 PM – 6 AM</span>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 sm:p-2.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Toll / Parking</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                Actuals
              </span>
              <span className="text-[8px] text-slate-500 font-mono block">As per receipt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
