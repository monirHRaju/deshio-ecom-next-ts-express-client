"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface Props {
  categoryId: string;
  excludeId: string;
}

export default function RelatedProducts({ categoryId, excludeId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["related", categoryId, excludeId],
    queryFn: async () => {
      const res = await api.get(`/products?category=${categoryId}&limit=8`);
      return (res.data.data as Product[]).filter((p) => p._id !== excludeId);
    },
    enabled: !!categoryId,
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-base-content">Related Products</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="btn btn-sm btn-ghost btn-circle border border-base-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="btn btn-sm btn-ghost btn-circle border border-base-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
      >
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="w-56 shrink-0 snap-start">
                <ProductSkeleton />
              </div>
            ))
          : data!.map((product) => (
              <div key={product._id} className="w-56 shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}
