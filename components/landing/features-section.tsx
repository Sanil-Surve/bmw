import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  Award,
  KeyRound,
  Headphones,
} from "lucide-react";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Guaranteed Specific Model",
    description:
      "When you book an M4 Competition or M5 CS, you receive that exact model—not a vague 'or similar' class substitution.",
  },
  {
    icon: MapPin,
    title: "White-Glove Delivery",
    description:
      "We deliver your BMW directly to your private airport terminal, luxury hotel lobby, or residence, fully fueled and detailed.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Coverage Included",
    description:
      "Drive with complete peace of mind. Every rental includes zero-deductible premium insurance protection at no extra surcharge.",
  },
  {
    icon: Headphones,
    title: "24/7 VIP Concierge Support",
    description:
      "A personal concierge is assigned to you via WhatsApp or phone throughout your journey for route suggestions or assistance.",
  },
  {
    icon: Zap,
    title: "Chauffeur or Self-Drive",
    description:
      "Choose the thrill of taking the wheel yourself, or let our professional, multi-lingual executive chauffeurs pilot you in comfort.",
  },
  {
    icon: Sparkles,
    title: "Factory M-Performance Specs",
    description:
      "All vehicles feature original BMW M-Sport exhaust packages, premium sound systems, and adaptive suspension tuning.",
  },
];

export function FeaturesSection() {
  return (
    <section id="experience" className="py-20 bg-zinc-950 text-white border-b border-white/10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-2">
            The Kalash Standard
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineered for Pure Luxury
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            We don’t just rent cars. Kalash BMW Cars delivers an uncompromising high-performance driving experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-blue-500/40 hover:bg-zinc-900/70 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
