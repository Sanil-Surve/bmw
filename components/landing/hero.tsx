"use client";

import Image from "next/image";
import { CONTACT_INFO } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Phone,
  MessageCircle,
  Crown,
  Plane,
  HeartHandshake,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

interface HeroProps {
  onSelectCarAndScroll: (carId: string) => void;
  onSelectPackageAndScroll?: (packageId: string) => void;
}

export function Hero({ onSelectPackageAndScroll }: HeroProps) {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else if (onSelectPackageAndScroll) {
      onSelectPackageAndScroll("full-day");
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-16 md:pt-18 md:pb-20 border-b border-slate-200 bg-white">
      {/* Subtle Luminous Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[650px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-300/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 mb-3 sm:mb-4 shadow-2xs">
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            <span className="tracking-wider uppercase font-mono text-[10px] sm:text-[11px] font-bold">
              BMW 520D • LUXURY CAR ON RENT
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-2 uppercase">
            BMW 520D <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-slate-900 bg-clip-text text-transparent">
              Luxury Car On Rent
            </span>
          </h1>

          {/* Slogan */}
          <p className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-700 font-mono mb-4">
            {CONTACT_INFO.tagline}
          </p>

          {/* Occasions Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-semibold text-slate-700 mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200/80">
              <HeartHandshake className="h-3 w-3 text-amber-600" /> Weddings
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200/80">
              <Briefcase className="h-3 w-3 text-amber-600" /> Corporate
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200/80">
              <Plane className="h-3 w-3 text-amber-600" /> Airport (T1 & T2)
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200/80">
              <Crown className="h-3 w-3 text-amber-600" /> VIP Travel
            </span>
          </div>

          {/* Subtitle */}
          <p className="max-w-xl text-xs sm:text-base text-slate-600 leading-relaxed mb-5 sm:mb-7 font-light px-2 sm:px-0">
            Pristine alpine white BMW 520D with white-glove chauffeur service. Curbside delivery across Mumbai, Navi Mumbai, Airport T1 & T2, weddings, and executive delegations.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-7 sm:mb-10 w-full sm:w-auto">
            <Button
              onClick={scrollToPricing}
              className="bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-bold text-xs sm:text-sm px-5 py-2.5 h-10 rounded-xl shadow-md transition-all cursor-pointer border-0 w-full sm:w-auto"
            >
              <span>View Tariff & Book</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 h-10 shadow-sm transition-all flex-1 sm:flex-initial"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={CONTACT_INFO.phoneTel}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 h-10 shadow-xs transition-all flex-1 sm:flex-initial"
            >
              <Phone className="h-3.5 w-3.5 text-amber-600" />
              <span>{CONTACT_INFO.phone}</span>
            </a>
          </div>

          {/* Clean Car Visual Card (Uncluttered, No Overlapping Mess) */}
          <div className="w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white overflow-hidden shadow-lg shadow-slate-200/40 p-3 sm:p-5">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[320px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <Image
                src="/bmw.webp"
                alt="BMW 520D Luxury Car On Rent - Mumbai & Navi Mumbai"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-center"
              />
            </div>

            {/* Subtle Feature Strip Under Image */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-left sm:text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Starting At</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm">₹3,500</span>
                <span className="text-[10px] text-slate-400 block">Mini Duty (2h/20km)</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-[10px] text-amber-800 uppercase font-mono block font-semibold">Full Day</span>
                <span className="font-black text-amber-700 text-xs sm:text-sm">₹12,000</span>
                <span className="text-[10px] text-amber-800 block">8 HRS / 80 KM</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Airport T1 & T2</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm">₹5,000</span>
                <span className="text-[10px] text-slate-400 block">One-Way Curbside</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Chauffeur</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm flex items-center justify-start sm:justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Included
                </span>
                <span className="text-[10px] text-slate-400 block">Professional & Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
