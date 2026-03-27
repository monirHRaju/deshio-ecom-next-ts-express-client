import type { Metadata } from "next";
import {
  Award,
  Globe,
  Heart,
  Headphones,
  Lightbulb,
  Package,
  ShieldCheck,
  Star,
  Target,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Deshio — our story, mission, values, and the team behind your favourite electronics store.",
  openGraph: {
    title: "About Deshio",
    description:
      "Your trusted partner for the latest electronics and tech gadgets.",
  },
};

const stats = [
  { value: "50K+", label: "Happy Customers", icon: Users },
  { value: "5K+", label: "Products Listed", icon: Package },
  { value: "120+", label: "Brands Partnered", icon: Award },
  { value: "99%", label: "Satisfaction Rate", icon: Star },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "Every product is vetted for quality and authenticity before it reaches your hands. We only partner with trusted manufacturers.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We stay ahead of the curve, bringing you the latest tech as soon as it hits the market — from concept to your doorstep.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Heart,
    title: "Customer Love",
    description:
      "Our 24/7 support team is always on standby. Your satisfaction isn't just a goal — it's our obsession.",
    color: "text-error",
    bg: "bg-error/10",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Shipping to over 50 countries, we connect you with the world's best tech no matter where you are.",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Lightning-fast logistics ensure your order arrives on time, every time — with real-time tracking all the way.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Target,
    title: "Best Prices",
    description:
      "We negotiate directly with brands so you always get fair, competitive prices with transparent no-hidden-fee billing.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "10+ years in consumer electronics. Former product lead at a Fortune 500 tech company.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
  },
  {
    name: "Priya Nair",
    role: "Head of Product",
    bio: "Design thinker & UX obsessive. Believes great products should feel effortless.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc",
  },
  {
    name: "Jordan Kim",
    role: "CTO",
    bio: "Full-stack engineer with a love for performance and developer experience.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan&backgroundColor=c0aede",
  },
  {
    name: "Sofia Chen",
    role: "Head of Partnerships",
    bio: "Built relationships with 120+ global brands. Fluent in five languages.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sofia&backgroundColor=d1f4d1",
  },
  {
    name: "Marcus Lee",
    role: "Lead Designer",
    bio: "Crafts pixel-perfect interfaces and occasionally obsesses over color palettes.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus&backgroundColor=ffdfbf",
  },
  {
    name: "Aisha Osman",
    role: "Customer Success",
    bio: "Champion of the customer. Resolves problems before they become problems.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha&backgroundColor=b6e3f4",
  },
];

const milestones = [
  { year: "2019", event: "Deshio founded in a small garage with 50 products" },
  { year: "2020", event: "Expanded to 1,000 SKUs and launched mobile-first website" },
  { year: "2021", event: "Crossed 10,000 customers and partnered with 30 brands" },
  { year: "2022", event: "Opened first fulfilment centre and hit ৳1M revenue" },
  { year: "2023", event: "Launched international shipping to 50+ countries" },
  { year: "2024", event: "50,000+ happy customers and 5,000+ products and counting" },
];

export default function AboutPage() {
  return (
    <div className="bg-base-100">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 page-hero-bg" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 badge badge-primary badge-lg px-4 py-3 mb-6 shadow-sm">
            <Zap className="w-4 h-4" />
            Est. 2019 · Silicon Valley
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-base-content leading-tight mb-6">
            We&apos;re on a mission to make{" "}
            <span className="text-primary">great tech</span> accessible to
            everyone
          </h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            Deshio started with a simple belief: buying electronics online
            should be fast, trustworthy, and enjoyable. Today, we serve 50,000+
            customers across 50+ countries.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-base-200 bg-base-200/40">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-black text-base-content">
                  {value}
                </div>
                <div className="text-sm text-base-content/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────────── */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
              <span className="h-px w-8 bg-primary" />
              Our Story
            </div>
            <h2 className="text-4xl font-black text-base-content leading-tight">
              From a garage startup to a global electronics marketplace
            </h2>
            <div className="space-y-4 text-base-content/60 leading-relaxed">
              <p>
                It started in 2019 when our founder Alex Rivera got tired of
                navigating dozens of sketchy reseller sites just to find a
                decent pair of headphones. He built a better alternative — a
                clean, curated store focused on genuine products and honest
                pricing.
              </p>
              <p>
                Word spread fast. Within a year Deshio had grown from 50
                products to over a thousand, and from one fulfilment shelf to a
                dedicated warehouse. We brought on people who care about the
                same things we do: quality, speed, and customers who actually
                come back.
              </p>
              <p>
                Today we partner with 120+ brands worldwide and ship to 50+
                countries — but we still believe every order matters, and every
                customer deserves to feel like they got the best deal.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-base-300 my-1" />
                  )}
                </div>
                <div className="pb-6 pt-2 min-w-0">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    {m.year}
                  </p>
                  <p className="text-sm text-base-content/70 mt-0.5">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-base-200/40 border-y border-base-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              <span className="h-px w-8 bg-primary" />
              What Drives Us
              <span className="h-px w-8 bg-primary" />
            </div>
            <h2 className="text-3xl font-black text-base-content">
              Our core values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="card bg-base-100 border border-base-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-base-content mb-2">{title}</h3>
                <p className="text-sm text-base-content/60 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-4">
            <span className="h-px w-8 bg-primary" />
            The People
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl font-black text-base-content">
            Meet the team
          </h2>
          <p className="text-base-content/50 mt-2 max-w-xl mx-auto text-sm">
            A small, passionate group of humans who obsess over products,
            customers, and really good coffee.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="card bg-base-100 border border-base-200 p-6 text-center hover:shadow-md transition-shadow group"
            >
              <div className="avatar mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100 group-hover:ring-primary transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar} alt={member.name} />
                </div>
              </div>
              <h3 className="font-bold text-base-content">{member.name}</h3>
              <p className="text-xs text-primary font-semibold mt-0.5 mb-2">
                {member.role}
              </p>
              <p className="text-sm text-base-content/55 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary to-sky-400">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Headphones className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">
            Ready to shop the best in tech?
          </h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">
            Join 50,000+ customers who trust Deshio for their electronics needs.
            Fast shipping, genuine products, unbeatable prices.
          </p>
          <Link
            href="/products"
            className="btn btn-lg bg-white text-primary hover:bg-white/90 border-0 shadow-lg"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
}
