import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Rss, User } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tech insights, buying guides, and product news from the Deshio team.",
  openGraph: {
    title: "Deshio Blog — Tech Insights & Buying Guides",
    description:
      "Stay up to date with the latest in consumer electronics, tips, and product reviews.",
  },
};

interface Article {
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    slug: "best-wireless-earbuds-2025",
    category: "Buying Guide",
    categoryColor: "badge-primary",
    title: "The 10 Best Wireless Earbuds of 2025 — Tested & Ranked",
    excerpt:
      "We spent three weeks testing 24 pairs of wireless earbuds across every price range. Here are the ones that genuinely impressed us — and the ones to skip.",
    author: "Jordan Kim",
    date: "March 15, 2025",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    featured: true,
  },
  {
    slug: "budget-laptop-guide-2025",
    category: "Buying Guide",
    categoryColor: "badge-primary",
    title: "Best Budget Laptops Under $500 That Don't Feel Cheap",
    excerpt:
      "You don't have to spend a fortune to get a reliable, fast laptop. These five picks deliver premium feel at half the price of the competition.",
    author: "Priya Nair",
    date: "March 8, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  },
  {
    slug: "smart-home-setup-beginners",
    category: "How-To",
    categoryColor: "badge-secondary",
    title: "How to Build a Smart Home on a Budget (Complete Starter Guide)",
    excerpt:
      "Smart lighting, voice assistants, and automated thermostats don't require a six-figure renovation. Start here with our step-by-step beginner guide.",
    author: "Marcus Lee",
    date: "February 28, 2025",
    readTime: "11 min read",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
  },
  {
    slug: "iphone-vs-android-2025",
    category: "Opinion",
    categoryColor: "badge-info",
    title: "iPhone vs Android in 2025: The Honest, Unbiased Take",
    excerpt:
      "After daily-driving both flagships for 60 days, here's what the specs sheets won't tell you — and which one you should actually buy.",
    author: "Alex Rivera",
    date: "February 20, 2025",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  },
  {
    slug: "mechanical-keyboard-beginners",
    category: "Deep Dive",
    categoryColor: "badge-warning",
    title: "Mechanical Keyboards: Everything You Need to Know Before Buying",
    excerpt:
      "Linear, tactile, clicky — the switch world is overwhelming. We break down every type, the best boards at each price, and why it all matters.",
    author: "Sofia Chen",
    date: "February 12, 2025",
    readTime: "13 min read",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
  },
  {
    slug: "4k-monitor-comparison",
    category: "Comparison",
    categoryColor: "badge-success",
    title: "5 Best 4K Monitors for Work and Gaming (2025 Edition)",
    excerpt:
      "From colour-accurate IPS panels for designers to 144 Hz VA screens for gamers — we've tested the monitors worth spending money on this year.",
    author: "Aisha Osman",
    date: "January 30, 2025",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  },
];

const featured = articles.find((a) => a.featured)!;
const rest = articles.filter((a) => !a.featured);

export default function BlogPage() {
  return (
    <div className="bg-base-100">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 page-hero-bg" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 badge badge-primary badge-lg px-4 py-3 mb-6">
            <Rss className="w-4 h-4" />
            Deshio Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content leading-tight mb-4">
            Tech insights &amp;{" "}
            <span className="text-primary">buying guides</span>
          </h1>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Honest reviews, in-depth comparisons, and practical guides to help
            you buy smarter and use your tech better.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24 space-y-12">
        {/* ── Featured Article ─────────────────────────────────────── */}
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-base-content/50 uppercase tracking-widest mb-5">
            <BookOpen className="w-4 h-4" />
            Featured
          </h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="group card bg-base-100 border border-base-200 overflow-hidden hover:shadow-xl transition-shadow lg:flex-row flex flex-col"
          >
            <div className="lg:w-1/2 h-56 lg:h-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2 p-8 flex flex-col justify-center space-y-4">
              <span className={`badge ${featured.categoryColor} badge-sm w-fit`}>
                {featured.category}
              </span>
              <h3 className="text-2xl font-black text-base-content group-hover:text-primary transition-colors leading-tight">
                {featured.title}
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-base-content/40 pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {featured.author}
                </span>
                <span>{featured.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-1">
                Read article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── Article Grid ─────────────────────────────────────────── */}
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-base-content/50 uppercase tracking-widest mb-5">
            <Rss className="w-4 h-4" />
            Latest Articles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group card bg-base-100 border border-base-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <span
                    className={`badge ${article.categoryColor} badge-sm`}
                  >
                    {article.category}
                  </span>
                  <h3 className="font-bold text-base-content leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-base-content/55 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-base-content/40 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Newsletter CTA ───────────────────────────────────────── */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 text-center">
          <h3 className="text-xl font-black text-base-content mb-2">
            Get new articles in your inbox
          </h3>
          <p className="text-base-content/60 text-sm mb-5 max-w-sm mx-auto">
            No spam — just our best tech guides, once a week.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input input-bordered input-sm flex-1"
            />
            <button className="btn btn-primary btn-sm">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
