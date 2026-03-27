"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Headphones,
  Cpu,
  Zap,
  Shield,
  Truck,
} from "lucide-react";

const slides = [
  {
    badge: "New Arrivals 2025",
    title: "Next-Gen Electronics",
    highlight: "At Your Fingertips",
    subtitle:
      "Discover cutting-edge technology at unbeatable prices. Quality guaranteed on every purchase.",
    cta: "Shop Now",
    ctaLink: "/products",
    secondaryCta: "View Deals",
    secondaryLink: "/products?sort=-discount",
    slideClass: "hero-slide-0",
    Icon: ShoppingBag,
    iconColor: "text-primary",
    badge2: "Free Shipping",
    badge3: "Top Brands",
    accentClass: "text-primary",
  },
  {
    badge: "Top Rated",
    title: "Premium Audio",
    highlight: "For Every Moment",
    subtitle:
      "Headphones, earbuds & speakers — immersive sound that transforms your world.",
    cta: "Explore Audio",
    ctaLink: "/products",
    secondaryCta: "Best Sellers",
    secondaryLink: "/products?sort=-sold",
    slideClass: "hero-slide-1",
    Icon: Headphones,
    iconColor: "text-secondary",
    badge2: "Up to 40% Off",
    badge3: "4.8★ Rated",
    accentClass: "text-secondary",
  },
  {
    badge: "Best Sellers",
    title: "Smart Devices,",
    highlight: "Smarter Living",
    subtitle:
      "Transform your home with the latest smart technology. Free delivery on orders over ৳50.",
    cta: "Shop Smart",
    ctaLink: "/products",
    secondaryCta: "Learn More",
    secondaryLink: "/about",
    slideClass: "hero-slide-2",
    Icon: Cpu,
    iconColor: "text-primary",
    badge2: "Warranty Included",
    badge3: "Easy Returns",
    accentClass: "text-primary",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`hero-slide ${slide.slideClass} min-h-[90vh] lg:min-h-[80vh] flex items-center transition-colors duration-500`}
            >
              <div className="container mx-auto px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Content */}
                  <div className="space-y-6 text-center lg:text-left">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 badge badge-primary badge-lg px-4 py-3 text-sm font-semibold shadow-sm">
                      <Zap className="w-4 h-4" />
                      {slide.badge}
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-tight">
                        {slide.title}
                      </h1>
                      <h1
                        className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${slide.accentClass}`}
                      >
                        {slide.highlight}
                      </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-base-content/60 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                      {slide.subtitle}
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {[
                        { icon: Truck, text: "Free Delivery" },
                        { icon: Shield, text: "Secure Payment" },
                      ].map(({ icon: Icon, text }) => (
                        <div
                          key={text}
                          className="flex items-center gap-2 bg-base-100/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-base-content/70 border border-base-200"
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          {text}
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <Link
                        href={slide.ctaLink}
                        className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-primary/30 transition-shadow"
                      >
                        {slide.cta}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link
                        href={slide.secondaryLink}
                        className="btn btn-ghost btn-lg border border-base-300 hover:border-primary hover:text-primary"
                      >
                        {slide.secondaryCta}
                      </Link>
                    </div>
                  </div>

                  {/* Right: Visual */}
                  <div className="hidden lg:flex items-center justify-center relative h-96">
                    {/* Background circles */}
                    <div className="absolute w-80 h-80 rounded-full bg-primary/10 animate-pulse" />
                    <div className="absolute w-60 h-60 rounded-full bg-secondary/10" />
                    <div className="absolute w-40 h-40 rounded-full bg-primary/5" />

                    {/* Main icon card */}
                    <div className="relative z-10 p-10 rounded-3xl bg-base-100/90 backdrop-blur-sm shadow-2xl border border-base-200">
                      <slide.Icon className={`w-28 h-28 ${slide.iconColor}`} />
                    </div>

                    {/* Floating badges */}
                    <div className="absolute top-8 right-4 badge badge-primary badge-lg shadow-lg font-semibold py-3 px-4">
                      {slide.badge2}
                    </div>
                    <div className="absolute bottom-8 left-4 badge badge-secondary badge-lg shadow-lg font-semibold py-3 px-4">
                      {slide.badge3}
                    </div>
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-base-100 rounded-2xl shadow-lg p-3 border border-base-200">
                      <div className="text-center">
                        <div className="text-2xl font-black text-primary">
                          50K+
                        </div>
                        <div className="text-xs text-base-content/50">
                          Happy Customers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* ── Slide backgrounds: light theme (default) ── */
        .hero-slide-0 { background-image: linear-gradient(to bottom right, #f0f9ff, #ffffff, #fff7ed); }
        .hero-slide-1 { background-image: linear-gradient(to bottom right, #fff7ed, #ffffff, #f0f9ff); }
        .hero-slide-2 { background-image: linear-gradient(to bottom right, #f0f9ff, #ffffff, #f1f5f9); }

        /* ── Slide backgrounds: dark theme via data-theme attribute ── */
        [data-theme='dark'] .hero-slide-0 { background-image: linear-gradient(to bottom right, oklch(18% 0.04 238), oklch(22% 0.01 240), oklch(18% 0.03 30)); }
        [data-theme='dark'] .hero-slide-1 { background-image: linear-gradient(to bottom right, oklch(18% 0.03 47), oklch(22% 0.01 240), oklch(18% 0.04 238)); }
        [data-theme='dark'] .hero-slide-2 { background-image: linear-gradient(to bottom right, oklch(18% 0.04 238), oklch(22% 0.01 240), oklch(20% 0.005 240)); }

        /* ── Swiper pagination ── */
        .hero-swiper .swiper-pagination-bullet {
          background: oklch(60.7% 0.213 238.04);
          opacity: 0.4;
          width: 10px;
          height: 10px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 28px;
          border-radius: 9999px;
        }

        /* ── Swiper nav buttons ── */
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: oklch(60.7% 0.213 238.04);
          background: var(--color-base-100, white);
          opacity: 0.9;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          border: 1px solid var(--color-base-200, #e5e7eb);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 900;
        }
      `}</style>
    </section>
  );
}
