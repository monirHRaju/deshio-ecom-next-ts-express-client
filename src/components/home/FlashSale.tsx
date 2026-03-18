"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Zap, ArrowRight } from "lucide-react";
import { discountedPrice, formatPrice } from "@/utils/formatPrice";

// Flash sale end date — update as needed
const SALE_END = new Date("2026-03-21T23:59:59Z");

interface SaleProduct {
  id: string;
  title: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  stock: number;
  sold: number;
}

const SALE_PRODUCTS: SaleProduct[] = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    price: 399,
    discount: 30,
    rating: 4.8,
    reviewCount: 1205,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    stock: 15,
    sold: 340,
  },
  {
    id: "2",
    title: "Apple MacBook Air M2 Laptop",
    brand: "Apple",
    price: 1299,
    discount: 15,
    rating: 4.9,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    stock: 8,
    sold: 210,
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra Smartphone",
    brand: "Samsung",
    price: 1199,
    discount: 20,
    rating: 4.7,
    reviewCount: 654,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    stock: 22,
    sold: 178,
  },
  {
    id: "4",
    title: "Canon EOS R6 Mark II Camera",
    brand: "Canon",
    price: 2499,
    discount: 25,
    rating: 4.8,
    reviewCount: 423,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    stock: 5,
    sold: 89,
  },
  {
    id: "5",
    title: "iPad Pro 12.9-inch M2 Chip",
    brand: "Apple",
    price: 1099,
    discount: 18,
    rating: 4.9,
    reviewCount: 731,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    stock: 12,
    sold: 265,
  },
  {
    id: "6",
    title: "Sony WF-1000XM5 Wireless Earbuds",
    brand: "Sony",
    price: 299,
    discount: 22,
    rating: 4.7,
    reviewCount: 988,
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&q=80",
    stock: 30,
    sold: 412,
  },
];

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      const hours = Math.floor(diff / 1000 / 3600);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-base-100/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[56px] text-center border border-white/20">
        <span className="text-2xl font-black text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-orange-200 mt-1 font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function FlashSale() {
  const timeLeft = useCountdown(SALE_END);

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 mb-8 shadow-xl shadow-orange-500/25 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="text-orange-100 font-semibold text-sm uppercase tracking-wider">
                  Limited Time Offer
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-1">
                Flash Sale!
              </h2>
              <p className="text-orange-100 text-sm">
                Incredible deals — grab them before they're gone
              </p>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className="text-orange-100 text-sm font-medium">
                Ends in:
              </span>
              <div className="flex items-center gap-3">
                <TimerBlock value={timeLeft.hours} label="HRS" />
                <span className="text-2xl font-black text-white/60 mb-4">:</span>
                <TimerBlock value={timeLeft.minutes} label="MIN" />
                <span className="text-2xl font-black text-white/60 mb-4">:</span>
                <TimerBlock value={timeLeft.seconds} label="SEC" />
              </div>
            </div>
          </div>
        </div>

        {/* Products — horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {SALE_PRODUCTS.map((product) => {
            const finalPrice = discountedPrice(product.price, product.discount);
            const stockPercent = Math.min(Math.round((product.sold / (product.sold + product.stock)) * 100), 95);

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-56 snap-start"
              >
                <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                  {/* Image */}
                  <figure className="relative aspect-square bg-base-200 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="224px"
                    />
                    <div className="absolute top-2 left-2 badge badge-secondary text-xs font-bold shadow">
                      -{product.discount}%
                    </div>
                  </figure>

                  <div className="card-body p-4 gap-2">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide font-medium">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-base-content line-clamp-2 leading-snug">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= Math.round(product.rating)
                              ? "fill-secondary text-secondary"
                              : "fill-base-300 text-base-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-base-content/40">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-primary text-base">
                          {formatPrice(finalPrice)}
                        </span>
                        <span className="text-xs text-base-content/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    {/* Stock progress */}
                    <div>
                      <div className="flex justify-between text-xs text-base-content/50 mb-1">
                        <span>Sold: {product.sold}</span>
                        <span className={product.stock < 10 ? "text-error font-semibold" : ""}>
                          {product.stock < 10 ? `Only ${product.stock} left!` : `${product.stock} left`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all"
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-secondary btn-sm w-full mt-1"
                    >
                      Grab Deal
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link
            href="/products?sort=-discount"
            className="btn btn-secondary gap-2"
          >
            View All Flash Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
