"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What documents are required to rent a BMW?",
    a: "A valid driver's license (held for at least 1 year) and government-issued ID (Aadhaar or Passport). International visitors can use an International Driving Permit or English-language domestic license.",
  },
  {
    q: "Can the vehicle be delivered directly to my hotel or airport?",
    a: "Yes. We provide white-glove curbside delivery at major airports (CSMI Mumbai T2, IGI Delhi T3, BLR Terminal), luxury hotels, or your private residence.",
  },
  {
    q: "Are toll fees included via FASTag?",
    a: "Every BMW is equipped with an active expressway FASTag. Toll crossings are logged transparently with zero highway stoppages.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We offer complimentary cancellation and date modifications up to 24 hours prior to your scheduled delivery with zero penalties.",
  },
  {
    q: "What is the insurance policy?",
    a: "Every rental includes comprehensive zero-deductible insurance protection covering third-party liability and comprehensive damage.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 md:py-24 relative border-b border-slate-200 bg-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[250px] sm:h-[350px] bg-teal-500/6 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-teal-600 mb-2 sm:mb-2.5 font-semibold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Assistance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-1.5 sm:mt-2 text-slate-600 text-xs sm:text-sm font-light">
            Essential information regarding policies and vehicle handover.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-teal-500/40 bg-teal-50/40 shadow-sm"
                    : "border-slate-200/90 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-medium text-xs sm:text-base text-slate-900 transition-colors cursor-pointer gap-3"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-teal-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-200/80 leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
