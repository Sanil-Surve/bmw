import {
  ShieldCheck,
  Plane,
  Receipt,
  Sparkles,
} from "lucide-react";

const VALUE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "White-Glove Executive Chauffeur",
    description: "Courteous, uniformed, and verified professional drivers trained for VIP protocol and smooth transit.",
  },
  {
    icon: Plane,
    title: "Flight-Tracked Curbside Punctuality",
    description: "Zero waiting charges on flight delays. Real-time tracking at Mumbai Airport T1 & T2 terminals.",
  },
  {
    icon: Receipt,
    title: "Transparent & 18% GST Compliant",
    description: "Pre-installed electronic FASTag with clear receipts and official GST tax invoices for corporate filing.",
  },
];

export function FeaturesSection() {
  return (
    <section id="experience" className="py-10 sm:py-16 md:py-20 relative border-b border-slate-200 bg-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-600 mb-2 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>The Kalash Standard</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Comfortable • Safe • On Time
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-light">
            Bespoke automotive excellence designed around your comfort and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {VALUE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-6 transition-all duration-200 hover:border-amber-400/60 hover:bg-white shadow-2xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 mb-3.5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
