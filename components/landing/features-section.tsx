import {
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  KeyRound,
  Headphones,
  Receipt,
} from "lucide-react";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Guaranteed Exact Model",
    description: "You receive the exact BMW M or 7-Series specified—never a substitute class.",
  },
  {
    icon: MapPin,
    title: "Curbside Metro Handover",
    description: "Curbside delivery at VIP airport terminals, five-star suites, or your private address.",
  },
  {
    icon: Zap,
    title: "Expressway FASTag Included",
    description: "Pre-installed FASTag for seamless, non-stop transit across all national expressways.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Coverage",
    description: "Zero-deductible premium insurance protection included with every reservation.",
  },
  {
    icon: Headphones,
    title: "24/7 VIP Concierge",
    description: "Dedicated WhatsApp concierge for route planning and 24/7 pan-India assistance.",
  },
  {
    icon: Receipt,
    title: "Corporate GST Compliant",
    description: "Official 18% GST tax invoices generated for seamless corporate expense filings.",
  },
];

export function FeaturesSection() {
  return (
    <section id="experience" className="py-14 sm:py-20 md:py-24 relative border-b border-slate-200 bg-slate-50/60 overflow-hidden">
      {/* Subtle Seafoam Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/8 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-teal-600 mb-2 sm:mb-2.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Kalash Standard</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Engineered for Luxury
          </h2>
          <p className="mt-1.5 sm:mt-2.5 text-slate-600 text-xs sm:text-base font-light">
            Bespoke automotive excellence tailored for discerning drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm hover:border-teal-500/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 mb-4 sm:mb-5 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-teal-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
