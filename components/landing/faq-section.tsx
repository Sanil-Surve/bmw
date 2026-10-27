"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/fleet";

const FAQS = [
  {
    q: "What rental packages and duties are available for the BMW 520D?",
    a: "We offer tailored duty packages designed for every itinerary: Mini Duty (2 Hrs / 20 KM — ₹3,500), Short Duty (3 Hrs / 30 KM — ₹4,500), Half Day (4 Hrs / 40 KM — ₹6,500), Full Day (8 Hrs / 80 KM — ₹12,000), and Extended Day (12 Hrs / 120 KM — ₹15,500).",
  },
  {
    q: "How does the Mumbai Airport (T1 & T2) pickup and drop service work?",
    a: "We offer dedicated one-way curbside airport transfers at ₹5,000 for both Domestic Terminal 1 (T1) and International Terminal 2 (T2) of Mumbai CSMI Airport. Our uniformed chauffeur tracks your flight in real time and welcomes you at the curbside.",
  },
  {
    q: "Is Navi Mumbai pickup and drop available?",
    a: "Yes, we offer direct one-way transit between Mumbai and Navi Mumbai (Vashi, Belapur, Kharghar, Panvel) for ₹3,500.",
  },
  {
    q: "What are the extra charges if my journey exceeds package limits?",
    a: "Any additional usage beyond the allocated package duration or distance is billed transparently: Extra KM is ₹140/Km, Extra Hour is ₹1,500/hour, Night Allowance is ₹2,000 (applicable between 10:00 PM and 6:00 AM), and Toll / Parking fees are payable at actuals.",
  },
  {
    q: "Can I book the BMW 520D for weddings or corporate VIP events?",
    a: "Absolutely. The pristine alpine white BMW 520D is highly sought-after for weddings (groom and bridal entry, floral/ribbon dressing ready) and corporate executive delegations. We provide official 18% GST tax invoices for corporate expense filings.",
  },
  {
    q: "How fast can I confirm a reservation?",
    a: "You can book instantly by submitting the reservation form on this website or by directly calling or messaging on WhatsApp at 9594781000 for immediate booking confirmation.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-10 sm:py-16 md:py-20 relative border-b border-slate-200 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[250px] sm:h-[350px] bg-amber-500/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-600 mb-2 sm:mb-2.5 font-bold">
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Assistance & Policies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-1.5 sm:mt-2 text-slate-600 text-xs sm:text-sm font-light">
            Essential information regarding packages, airport transfers, and booking policies.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/70 overflow-hidden transition-all duration-200 hover:border-amber-400/50"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-amber-50 text-amber-700 border-amber-300" : ""
                    }`}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-slate-200/60 mt-1">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Contact Help Box */}
        <div className="mt-8 sm:mt-12 text-center p-4 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-300/60">
          <p className="text-xs text-slate-700 font-medium mb-3">
            Have a custom requirement or need an outstation package quote?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT_INFO.phoneTel}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-slate-800"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call: {CONTACT_INFO.phone}</span>
            </a>
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
