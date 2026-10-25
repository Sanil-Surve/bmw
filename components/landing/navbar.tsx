"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  X,
  Phone,
  Car,
  Sparkles,
  HelpCircle,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/85 backdrop-blur-2xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-teal-600/30 bg-gradient-to-br from-teal-50 to-white shadow-sm shadow-teal-500/10 group-hover:border-teal-500 transition-all duration-300 shrink-0">
            {/* Minimalist Emblem */}
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 rounded-full overflow-hidden border border-slate-300 grid grid-cols-2 grid-rows-2">
              <div className="bg-teal-600" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-teal-600" />
            </div>
            {/* Subtle Seafoam glow bar */}
            <div className="absolute -bottom-0.5 h-[2px] w-4 sm:w-5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 shadow-sm" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-bold tracking-wider text-slate-900 uppercase">
                KALASH <span className="text-teal-600">BMW</span>
              </span>
              <span className="rounded-full border border-teal-600/25 bg-teal-50 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-widest text-teal-700 uppercase font-semibold">
                Premier
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-500 uppercase font-medium">
              Luxury Fleet • India
            </span>
          </div>
        </Link>

        {/* Clean Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => scrollToSection("fleet")}
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            The Fleet
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("booking")}
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            Reserve
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop & Tablet Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-teal-700 hover:border-teal-500/40 hover:bg-teal-50/70 text-xs h-9 px-3.5 gap-1.5 transition-all font-medium"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-teal-600" />
            <span>Admin</span>
          </Link>

          <Button
            onClick={() => scrollToSection("booking")}
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold text-xs sm:text-sm h-9 px-4 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer border-0"
          >
            <span>Book Now</span>
            <ChevronRight className="h-4 w-4 ml-0.5" />
          </Button>
        </div>

        {/* Mobile Action Buttons + Hamburger Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Button
            onClick={() => scrollToSection("booking")}
            size="sm"
            className="bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-xs h-8 px-3 rounded-lg shadow-sm border-0"
          >
            Reserve
          </Button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:text-teal-600 hover:border-teal-500/40 transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 text-teal-600" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="px-4 pt-3 pb-6 space-y-1.5 max-w-md mx-auto">
            <button
              onClick={() => scrollToSection("fleet")}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-teal-600" />
                <span>The BMW Fleet</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => scrollToSection("experience")}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>The Experience</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => scrollToSection("booking")}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-4 w-4 text-teal-600" />
                <span>Instant Reservation</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => scrollToSection("faq")}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-teal-600" />
                <span>Rental FAQ</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-teal-700 hover:border-teal-500/40 hover:bg-teal-50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4 text-teal-600" />
                  <span>Admin Owner Portal</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
                  Access
                </span>
              </Link>

              <a
                href="tel:+919820154920"
                className="flex items-center justify-center gap-2 rounded-xl border border-teal-600/30 bg-teal-50 px-3.5 py-2.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-all"
              >
                <Phone className="h-3.5 w-3.5 text-teal-600" />
                <span>Call VIP Concierge (+91 98201 54920)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
