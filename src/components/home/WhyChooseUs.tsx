import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    Icon: Truck,
    title: "Fast & Free Delivery",
    description:
      "Get your orders delivered in 1-3 business days. Free shipping on all orders over $50.",
    stat: "24h",
    statLabel: "Express available",
    bg: "from-sky-500/10 to-sky-600/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    border: "hover:border-primary/30",
  },
  {
    Icon: ShieldCheck,
    title: "100% Secure Payment",
    description:
      "Your payment information is always protected. We support all major payment methods.",
    stat: "256-bit",
    statLabel: "SSL Encryption",
    bg: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    border: "hover:border-emerald-300/50",
  },
  {
    Icon: RotateCcw,
    title: "Easy 30-Day Returns",
    description:
      "Not satisfied? Return any product within 30 days for a full refund — no questions asked.",
    stat: "30 Days",
    statLabel: "Return window",
    bg: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    border: "hover:border-secondary/30",
  },
  {
    Icon: Headphones,
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock to help with any issue.",
    stat: "< 2h",
    statLabel: "Avg. response",
    bg: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
    border: "hover:border-violet-300/50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-base-200/40">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge badge-secondary badge-lg mb-4 px-4 py-3 font-semibold">
            Why Deshio?
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-base-content">
            The <span className="text-secondary">Deshio</span> Difference
          </h2>
          <p className="text-base-content/60 mt-3 max-w-xl mx-auto">
            We go above and beyond to make your shopping experience seamless,
            safe, and satisfying.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`
                group relative p-6 rounded-2xl border border-base-200 ${feat.border}
                bg-gradient-to-br ${feat.bg} bg-base-100
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
              `}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${feat.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
              >
                <feat.Icon className={`w-7 h-7 ${feat.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="font-bold text-base-content text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-base-content/60 text-sm leading-relaxed mb-4">
                {feat.description}
              </p>

              {/* Stat chip */}
              <div className="inline-flex items-center gap-1.5 bg-base-100/70 rounded-full px-3 py-1.5 border border-base-200">
                <span className={`font-black text-sm ${feat.iconColor}`}>
                  {feat.stat}
                </span>
                <span className="text-xs text-base-content/50">
                  {feat.statLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
