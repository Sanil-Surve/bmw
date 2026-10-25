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
    <section id="faq" className="py-24 relative border-b border-[#FAF7F0]/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#14B8A6]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#2DD4BF] mb-2.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Assistance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FAF7F0]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[#FAF7F0]/65 text-sm font-light">
            Essential information regarding policies and vehicle handover.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                  isOpen
                    ? "border-[#2DD4BF]/40 bg-[#0A201E]/65 shadow-[0_10px_30px_rgba(45,212,191,0.1)]"
                    : "border-[#FAF7F0]/10 bg-[#091A18]/50 hover:border-[#FAF7F0]/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-medium text-sm sm:text-base text-[#FAF7F0] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#2DD4BF] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#FAF7F0]/70 border-t border-[#FAF7F0]/10 leading-relaxed font-light">
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
