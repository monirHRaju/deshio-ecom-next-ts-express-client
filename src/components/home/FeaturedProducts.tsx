"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse, Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

function SkeletonCard() {
  return (
    <div className="card bg-base-100 border border-base-200 overflow-hidden">
      <div className="skeleton aspect-square w-full rounded-none" />
      <div className="card-body p-4 gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-3 w-20 rounded mt-1" />
        <div className="skeleton h-9 w-full rounded mt-2" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>(
        "/products?isFeatured=true&limit=8&sort=-rating"
      );
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <section className="py-16 bg-base-200/40">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="badge badge-primary badge-lg mb-3 px-4 py-3 font-semibold">
              Hand-Picked
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-base-content">
              Featured{" "}
              <span className="text-primary">Products</span>
            </h2>
            <p className="text-base-content/60 mt-2">
              Curated picks loved by thousands of customers.
            </p>
          </div>
          <Link
            href="/products?isFeatured=true"
            className="btn btn-outline btn-primary gap-2 flex-shrink-0"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Error state */}
        {isError && (
          <div className="alert alert-warning mb-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">Could not load products. Is the server running?</span>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && !isError && data?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-base-content mb-2">
              No featured products yet
            </h3>
            <p className="text-base-content/60 mb-6">
              Check back soon for our curated picks.
            </p>
            <Link href="/products" className="btn btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
