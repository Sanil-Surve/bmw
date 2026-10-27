"use client";

import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { CONTACT_INFO } from "@/lib/fleet";

export function MobileActionBar() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 shadow-2xl flex items-center justify-between gap-2">
      <a
        href={CONTACT_INFO.phoneTel}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/40 bg-slate-900 py-2.5 text-xs font-bold text-amber-300 active:bg-slate-800 transition-colors"
      >
        <Phone className="h-3.5 w-3.5 text-amber-400" />
        <span>Call</span>
      </a>

      <a
        href={CONTACT_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white active:bg-emerald-700 transition-colors shadow-xs"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={scrollToBooking}
        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2.5 text-xs font-black text-slate-950 active:bg-amber-300 transition-colors cursor-pointer"
      >
        <CalendarCheck className="h-3.5 w-3.5" />
        <span>Reserve</span>
      </button>
    </div>
  );
}
