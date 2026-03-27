import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "Deshio — Modern Electronics Store",
  description:
    "Discover the latest electronics, gadgets, and tech accessories at unbeatable prices. Free delivery on orders over ৳50.",
  openGraph: {
    title: "Deshio — Modern Electronics Store",
    description:
      "Shop 5,000+ genuine electronics products. Fast shipping, easy returns, best prices.",
    type: "website",
  },
};
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashSale from "@/components/home/FlashSale";
import StatsSection from "@/components/home/StatsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero — Swiper slider with 3 slides */}
      <HeroSection />

      {/* 2. Category Cards — 6 animated category cards */}
      <CategorySection />

      {/* 3. Featured Products — API-powered product grid */}
      <FeaturedProducts />

      {/* 4. Flash Sale — Countdown timer + horizontal scroll */}
      <FlashSale />

      {/* 5. Stats — Animated counters on scroll */}
      <StatsSection />

      {/* 6. Why Choose Us — 4 feature cards */}
      <WhyChooseUs />

      {/* 7. Testimonials — 3 customer reviews */}
      <Testimonials />

      {/* 8. Newsletter — Email subscription */}
      <Newsletter />

      {/* 9. FAQ — DaisyUI accordion */}
      <FAQSection />

      {/* 10. CTA Banner — Full-width gradient call-to-action */}
      <CTABanner />
    </main>
  );
}
