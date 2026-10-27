"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Menu,
  X,
  Phone,
  Sparkles,
  HelpCircle,
  CalendarCheck,
  Receipt,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/fleet";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-14 sm:h-18 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-white shadow-sm shrink-0">
            <div className="relative h-4 w-4 sm:h-5 sm:w-5 rounded-full overflow-hidden border border-slate-300 grid grid-cols-2 grid-rows-2">
              <div className="bg-slate-900" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-slate-900" />
            </div>
            <div className="absolute -bottom-0.5 h-[2px] w-3.5 sm:w-4 rounded-full bg-amber-500" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base font-black tracking-wider text-slate-900 uppercase">
                KALASH <span className="text-amber-600">BMW</span>
              </span>
              <span className="rounded-full bg-amber-50 border border-amber-300/80 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-mono font-bold text-amber-800 uppercase">
                520D
              </span>
            </div>
            <span className="text-[8px] sm:text-[10px] tracking-widest text-slate-500 uppercase font-medium">
              Mumbai & Navi Mumbai
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium text-slate-600">
          <button
            onClick={() => scrollToSection("pricing")}
            className="hover:text-amber-600 transition-colors cursor-pointer font-semibold text-slate-900"
          >
            Tariff & Packages
          </button>
          <button
            onClick={() => scrollToSection("vehicle")}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            The BMW 520D
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("booking")}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Reserve
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs h-8 sm:h-9 px-3 gap-1.5 transition-all font-bold"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href={CONTACT_INFO.phoneTel}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:text-amber-700 hover:border-amber-400 text-xs h-8 sm:h-9 px-3 gap-1.5 transition-all font-semibold"
          >
            <Phone className="h-3.5 w-3.5 text-amber-600" />
            <span>{CONTACT_INFO.phone}</span>
          </a>

          <Button
            onClick={() => scrollToSection("booking")}
            className="bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-300 font-bold text-xs h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl shadow-sm transition-all cursor-pointer border-0"
          >
            <span>Book Now</span>
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </div>

        {/* Mobile Actions: Clean & Compact */}
        <div className="flex sm:hidden items-center gap-1.5">
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Us"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          <a
            href={CONTACT_INFO.phoneTel}
            aria-label="Call Now"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 text-amber-800"
          >
            <Phone className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 text-amber-600" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="px-4 pt-3 pb-5 space-y-1.5 max-w-md mx-auto">
            <button
              onClick={() => scrollToSection("pricing")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-amber-50/70 hover:bg-amber-100 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="h-4 w-4 text-amber-600" />
                <span>Tariff & Duty Packages</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
            </button>

            <button
              onClick={() => scrollToSection("vehicle")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>The BMW 520D</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => scrollToSection("booking")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="h-4 w-4 text-amber-600" />
                <span>Instant Reservation</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => scrollToSection("faq")}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>Rental FAQ</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={CONTACT_INFO.phoneTel}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-400 bg-amber-50 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
              >
                <Phone className="h-3.5 w-3.5 text-amber-600" />
                <span>Call Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
