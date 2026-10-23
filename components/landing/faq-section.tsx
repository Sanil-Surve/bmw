"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What documents do I need to rent a BMW?",
    a: "You will need a valid driver's license (held for at least 1 year) and a government-issued photo ID or passport. International travelers can use a valid international driving permit or original domestic license in English/Latin characters.",
  },
  {
    q: "How does the Google Sheets integration work for bookings?",
    a: "Every booking submitted through the platform is instantly dispatched to the rental owner's connected Google Sheet via Google Apps Script and shown in real-time on the /admin dashboard. You receive an instant reference number upon submission.",
  },
  {
    q: "Is there a minimum age requirement?",
    a: "Drivers must be at least 21 years of age for our standard luxury sedans and SUVs, and at least 25 years of age for our high-output M Performance models (such as the M4 Competition, M5 CS, and i8 Roadster).",
  },
  {
    q: "Can the car be delivered directly to my airport or hotel?",
    a: "Yes! We specialize in white-glove delivery. Simply choose your airport terminal, hotel, or private address during booking, and our concierge team will meet you curbside with the vehicle and keys ready.",
  },
  {
    q: "What is your fuel and mileage policy?",
    a: "All vehicles are delivered with a 100% full tank of 98-octane premium fuel and should be returned at the same level. Our standard daily rentals include 150 miles (250 km) per day, with unlimited mileage packages available upon request.",
  },
  {
    q: "What happens if I need to cancel or modify my booking?",
    a: "We offer complimentary cancellation and date modifications up to 24 hours prior to your scheduled delivery time with zero cancellation penalties.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-black text-white relative border-b border-white/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Everything you need to know about our BMW rental policies and service.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-950/70 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-blue-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 border-t border-white/5 leading-relaxed">
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
