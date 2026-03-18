"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Users, ShoppingBag, Star } from "lucide-react";

const stats = [
  {
    label: "Products",
    value: 10000,
    suffix: "+",
    Icon: Package,
    description: "Across all categories",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Happy Customers",
    value: 50000,
    suffix: "+",
    Icon: Users,
    description: "Worldwide and growing",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    label: "Orders Delivered",
    value: 100000,
    suffix: "+",
    Icon: ShoppingBag,
    description: "On time, every time",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Top Brands",
    value: 500,
    suffix: "+",
    Icon: Star,
    description: "Trusted partners",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];

function formatStatValue(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
  return String(n);
}

function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function StatCard({
  stat,
  active,
}: {
  stat: (typeof stats)[0];
  active: boolean;
}) {
  const count = useCountUp(stat.value, 2000, active);

  return (
    <div className="flex flex-col items-center text-center group">
      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        <stat.Icon className={`w-8 h-8 ${stat.iconColor}`} />
      </div>

      {/* Count */}
      <div className="text-4xl lg:text-5xl font-black text-base-content tabular-nums">
        {active ? formatStatValue(count) : "0"}
        <span className="text-primary">{stat.suffix}</span>
      </div>

      {/* Label */}
      <h3 className="text-lg font-bold text-base-content mt-2">{stat.label}</h3>
      <p className="text-base-content/50 text-sm mt-0.5">{stat.description}</p>
    </div>
  );
}

export default function StatsSection() {
  const [active, setActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-y border-base-200"
    >
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-base-content">
            Trusted by{" "}
            <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-base-content/60 mt-2 max-w-xl mx-auto">
            Our numbers speak for themselves. Join a growing community of
            satisfied customers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
