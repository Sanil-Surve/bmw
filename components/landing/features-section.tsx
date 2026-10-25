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
    <section id="experience" className="py-24 relative border-b border-[#FAF7F0]/10 overflow-hidden">
      {/* Subtle Seafoam Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#2DD4BF]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#2DD4BF] mb-2.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Kalash Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FAF7F0]">
            Engineered for Luxury
          </h2>
          <p className="mt-2.5 text-[#FAF7F0]/65 text-sm sm:text-base font-light">
            Bespoke automotive excellence tailored for discerning drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-[#FAF7F0]/10 bg-[#091A18]/50 p-7 backdrop-blur-xl hover:border-[#2DD4BF]/40 hover:bg-[#0A201E]/65 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(45,212,191,0.12)] hover:-translate-y-1 shadow-[inset_0_1px_0_rgba(250,247,240,0.1)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2DD4BF]/12 text-[#2DD4BF] border border-[#2DD4BF]/25 mb-5 group-hover:scale-105 group-hover:bg-[#2DD4BF] group-hover:text-[#061110] transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FAF7F0] mb-2 group-hover:text-[#2DD4BF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF7F0]/65 leading-relaxed font-light">
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
