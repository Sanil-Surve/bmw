"use client";

import Link from "next/link";
import { ChevronRight, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#FAF7F0]/10 bg-[#061110]/70 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Modern & Minimalist */}
        <Link href="/" className="group flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-gradient-to-br from-[#0F2825] to-[#061110] shadow-[0_0_20px_rgba(45,212,191,0.15)] group-hover:border-[#2DD4BF]/60 transition-all duration-300">
            {/* Minimalist Emblem */}
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-[#FAF7F0]/30 grid grid-cols-2 grid-rows-2">
              <div className="bg-[#14B8A6]" />
              <div className="bg-[#FAF7F0]" />
              <div className="bg-[#FAF7F0]" />
              <div className="bg-[#14B8A6]" />
            </div>
            {/* Subtle Seafoam glow bar */}
            <div className="absolute -bottom-0.5 h-[2px] w-5 rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#5EEAD4] shadow-[0_0_8px_#2DD4BF]" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-wider text-[#FAF7F0] uppercase">
                KALASH <span className="text-[#2DD4BF]">BMW</span>
              </span>
              <span className="rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-2 py-0.5 text-[9px] font-mono tracking-widest text-[#5EEAD4] uppercase">
                Premier
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-[#FAF7F0]/50 uppercase font-light">
              Luxury Fleet • India
            </span>
          </div>
        </Link>

        {/* Clean Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#FAF7F0]/70">
          <button
            onClick={() => scrollToSection("fleet")}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            The Fleet
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("booking")}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            Reserve
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Clean Glass Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center justify-center rounded-xl border border-[#FAF7F0]/15 bg-[#FAF7F0]/[0.04] text-[#FAF7F0]/80 hover:text-[#FAF7F0] hover:border-[#2DD4BF]/40 hover:bg-[#2DD4BF]/10 text-xs h-9 px-3.5 gap-1.5 transition-all font-medium backdrop-blur-md"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span>Admin</span>
          </Link>

          <Button
            onClick={() => scrollToSection("booking")}
            className="bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF] hover:from-[#0D9488] hover:to-[#14B8A6] text-[#061110] font-semibold text-xs sm:text-sm h-9 px-4 rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all cursor-pointer border-0"
          >
            <span>Book Now</span>
            <ChevronRight className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
