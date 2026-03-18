import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-16 bg-base-200/40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-sky-500 to-secondary p-1 shadow-2xl shadow-primary/20">
          <div className="relative rounded-[22px] bg-gradient-to-br from-primary to-sky-600 px-8 py-16 lg:px-16 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              {/* Left */}
              <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-semibold border border-white/20">
                  <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  Exclusive Member Deals
                </div>

                {/* Headline */}
                <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                  Get the Best Deals
                  <br />
                  <span className="text-yellow-300">Before They're Gone!</span>
                </h2>

                {/* Subtext */}
                <p className="text-sky-100 max-w-lg text-lg">
                  Sign up today and unlock exclusive discounts, early access to
                  sales, and free shipping on your first order.
                </p>

                {/* Perks */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {[
                    "Free first delivery",
                    "Early sale access",
                    "Member-only prices",
                  ].map((perk) => (
                    <div
                      key={perk}
                      className="flex items-center gap-1.5 text-sky-100 text-sm"
                    >
                      <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {perk}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-shrink-0">
                <Link
                  href="/products"
                  className="btn btn-lg bg-white text-primary hover:bg-sky-50 border-none gap-2 shadow-lg font-bold min-w-48"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="btn btn-lg bg-secondary hover:bg-orange-600 text-white border-none gap-2 shadow-lg font-bold min-w-48"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
