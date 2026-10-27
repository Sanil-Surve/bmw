import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Crown, Lock } from "lucide-react";
import { CONTACT_INFO } from "@/lib/fleet";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 sm:pt-16 pb-20 sm:pb-12">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-amber-400/40 bg-slate-950 shadow-sm">
                <Crown className="h-4 w-4 text-amber-400" />
              </div>
              <span className="font-heading text-sm sm:text-base font-black tracking-wider text-white uppercase">
                BMW 520D <span className="text-amber-400">LUXURY RENT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Premium BMW 520D luxury car rentals across Mumbai and Navi Mumbai. Dedicated white-glove chauffeur service for weddings, corporate executives, T1 & T2 airport transfers, and VIP delegations.
            </p>
            <div className="text-xs font-mono font-bold text-amber-300 tracking-wider">
              {CONTACT_INFO.tagline}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-100">
              Tariff & Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors py-0.5 inline-block">
                  Official Tariff Card
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-amber-400 transition-colors py-0.5 inline-block">
                  BMW 520D Fleet
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-amber-400 transition-colors py-0.5 inline-block">
                  Reserve Vehicle
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-amber-400 transition-colors py-0.5 inline-block">
                  Curbside Handover
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors py-0.5 inline-block">
                  Rental FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Booking Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-100">
              Contact & Booking
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href={CONTACT_INFO.phoneTel} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-bold text-sm text-white">
                  <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{CONTACT_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors text-emerald-400 font-semibold"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp: {CONTACT_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@kalashbmw.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>info@kalashbmw.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>T1 & T2 Mumbai Airport & Navi Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with small Admin button at base */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© 2026 Kalash BMW Cars • BMW 520D Luxury Rentals. All rights reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <span>BMW® is a registered trademark of Bayerische Motoren Werke AG.</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-slate-500 hover:text-amber-400 border border-slate-800 hover:border-slate-700 bg-slate-950/80 px-2 py-0.5 rounded transition-colors"
              title="Admin Portal"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
