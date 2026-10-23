import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, LayoutDashboard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900">
                <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/30 grid grid-cols-2 grid-rows-2">
                  <div className="bg-[#0066B1]" />
                  <div className="bg-white" />
                  <div className="bg-white" />
                  <div className="bg-[#0066B1]" />
                </div>
              </div>
              <span className="font-heading text-base font-bold tracking-wider text-white uppercase">
                KALASH <span className="text-blue-500">BMW CARS</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curated luxury Kalash BMW car rentals for discerning executives, track enthusiasts, and travelers. White-glove delivery, zero hidden fees, and pure high-performance engineering.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Official Kalash M-Standard Fleet</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  The BMW Fleet
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">
                  The Experience
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition-colors">
                  Instant Booking Form
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Rental FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & VIP Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              VIP Concierge
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>+1 (800) 555-BMW-DRIVE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>concierge@kalashbmw.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>Executive Terminal 2, Private Aviation</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Rental Owner Portal */}
          <div className="space-y-3 rounded-2xl bg-zinc-900/60 p-5 border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Rental Owner Portal</span>
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Rental administrators can review incoming bookings, track customer contacts, update approval statuses, and verify Google Sheets synchronization.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 shadow transition-colors"
            >
              Access /admin Dashboard
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Kalash BMW Cars. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>BMW® and M-Power are trademarks of Bayerische Motoren Werke AG.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
