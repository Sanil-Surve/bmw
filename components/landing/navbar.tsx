"use client";

import Link from "next/link";
import { Shield, PhoneCall, ChevronRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with BMW M-Power tricolor styling */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-zinc-900 to-black shadow-inner shadow-blue-500/20">
            {/* Iconic BMW Roundel stylized representation */}
            <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/30 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#0066B1]" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-[#0066B1]" />
            </div>
            {/* BMW M Tricolor Bar indicator */}
            <div className="absolute -bottom-1 flex h-1 w-6 overflow-hidden rounded-full">
              <div className="w-1/3 bg-[#0066B1]" />
              <div className="w-1/3 bg-[#262846]" />
              <div className="w-1/3 bg-[#E31B23]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-wider text-white uppercase group-hover:text-blue-400 transition-colors">
                KALASH <span className="text-blue-500">BMW CARS</span>
              </span>
              <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-[10px] text-blue-400 font-mono py-0 px-1.5 uppercase">
                Rental
              </Badge>
            </div>
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase">
              The Ultimate Driving Machine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <button
            onClick={() => scrollToSection("fleet")}
            className="hover:text-white transition-colors"
          >
            The Fleet
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="hover:text-white transition-colors"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("booking")}
            className="hover:text-white transition-colors"
          >
            Instant Booking
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-white transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard shortcut for owner */}
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white text-xs h-9 px-3 gap-1.5 transition-colors font-medium"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-blue-400" />
            <span>Owner Admin</span>
          </Link>

          {/* Book Now Button */}
          <Button
            onClick={() => scrollToSection("booking")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40"
          >
            <span>Book Now</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </header>
  );
}
