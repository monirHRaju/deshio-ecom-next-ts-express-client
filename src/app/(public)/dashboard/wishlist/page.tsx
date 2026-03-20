"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";

export default function WishlistPage() {
  const { user } = useAuth();
  const wishlistIds = user?.wishlist ?? [];

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["wishlist-products", wishlistIds],
    queryFn: async () => {
      if (wishlistIds.length === 0) return [];
      const res = await Promise.all(
        wishlistIds.map((id) => api.get(`/products/${id}`).then((r) => r.data.data))
      );
      return res.filter(Boolean);
    },
    enabled: wishlistIds.length > 0,
    staleTime: 2 * 60_000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-base-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">
        Wishlist
        {wishlistIds.length > 0 && (
          <span className="text-base-content/40 font-normal text-base ml-2">
            ({wishlistIds.length} {wishlistIds.length === 1 ? "item" : "items"})
          </span>
        )}
      </h1>

      {wishlistIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Heart className="w-14 h-14 text-base-content/20" />
          <p className="font-semibold text-base-content/50">Your wishlist is empty</p>
          <Link href="/products" className="btn btn-primary btn-sm">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
