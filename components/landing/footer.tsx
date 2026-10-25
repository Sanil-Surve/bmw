import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, LayoutDashboard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#040C0B] text-[#FAF7F0] border-t border-[#FAF7F0]/10 pt-12 sm:pt-16 pb-8 sm:pb-12">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-gradient-to-br from-[#0F2825] to-[#061110] shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                <div className="relative h-4 w-4 sm:h-5 sm:w-5 rounded-full overflow-hidden border border-[#FAF7F0]/30 grid grid-cols-2 grid-rows-2">
                  <div className="bg-[#14B8A6]" />
                  <div className="bg-[#FAF7F0]" />
                  <div className="bg-[#FAF7F0]" />
                  <div className="bg-[#14B8A6]" />
                </div>
              </div>
              <span className="font-heading text-sm sm:text-base font-bold tracking-wider text-[#FAF7F0] uppercase">
                KALASH <span className="text-[#2DD4BF]">BMW CARS</span>
              </span>
            </div>
            <p className="text-xs text-[#FAF7F0]/60 leading-relaxed">
              Curated luxury Kalash BMW car rentals for discerning executives, track enthusiasts, and travelers. White-glove delivery, zero hidden fees, and pure high-performance engineering.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#5EEAD4] font-mono">
              <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />
              <span>Official Kalash M-Standard Fleet</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F0]/80">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/60">
              <li>
                <a href="#fleet" className="hover:text-[#2DD4BF] transition-colors py-0.5 inline-block">
                  The BMW Fleet
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#2DD4BF] transition-colors py-0.5 inline-block">
                  The Experience
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#2DD4BF] transition-colors py-0.5 inline-block">
                  Instant Booking Form
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#2DD4BF] transition-colors py-0.5 inline-block">
                  Rental FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & VIP Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F0]/80">
              VIP Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F0]/60">
              <li>
                <a href="tel:+919820154920" className="flex items-center gap-2 hover:text-[#2DD4BF] transition-colors">
                  <Phone className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                  <span>+91 98201 54920</span>
                </a>
              </li>
              <li>
                <a href="mailto:concierge@kalashbmw.com" className="flex items-center gap-2 hover:text-[#2DD4BF] transition-colors">
                  <Mail className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                  <span>concierge@kalashbmw.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                <span>Executive Terminal 2, CSMI Airport, Mumbai</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Rental Owner Portal */}
          <div className="space-y-2.5 sm:space-y-3 rounded-2xl bg-[#091A18]/60 p-4 sm:p-5 border border-[#FAF7F0]/10 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF] flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Rental Owner Portal</span>
            </h4>
            <p className="text-[11px] text-[#FAF7F0]/60 leading-relaxed">
              Review incoming bookings, track customer contacts, update approval statuses, and verify Google Sheets synchronization.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#2DD4BF] hover:from-[#0D9488] hover:to-[#14B8A6] text-[#061110] text-xs font-bold py-2.5 px-3 shadow transition-all"
            >
              Access /admin Dashboard
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#FAF7F0]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#FAF7F0]/40 gap-3 text-center sm:text-left">
          <p>© 2026 Kalash BMW Cars. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>BMW® and M-Power are trademarks of Bayerische Motoren Werke AG.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
