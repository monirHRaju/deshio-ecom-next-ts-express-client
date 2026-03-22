"use client";

import { useQuery } from "@tanstack/react-query";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import { Product, Meta, ProductQueryParams } from "@/types";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface Props {
  params: ProductQueryParams;
  onPageChange: (page: number) => void;
}

async function fetchProducts(params: ProductQueryParams) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.priceMin !== undefined) query.set("priceMin", String(params.priceMin));
  if (params.priceMax !== undefined) query.set("priceMax", String(params.priceMax));
  if (params.rating) query.set("rating", String(params.rating));
  if (params.sort) query.set("sort", params.sort);
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 12));

  const res = await api.get(`/products?${query.toString()}`);
  return { products: res.data.data as Product[], meta: res.data.meta as Meta };
}

export default function ProductGrid({ params, onPageChange }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    // No caching when a search term is active — always fetch fresh results
    staleTime: params.search ? 0 : 30_000,
  });

  // Skeleton
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <PackageSearch className="w-14 h-14 text-base-300" />
        <p className="font-semibold text-base-content/60">Failed to load products</p>
        <p className="text-sm text-base-content/40">Please try again later</p>
      </div>
    );
  }

  const { products = [], meta } = data!;

  // Empty
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <PackageSearch className="w-16 h-16 text-base-300" />
        <div>
          <p className="font-semibold text-lg text-base-content/70">No products found</p>
          <p className="text-sm text-base-content/40 mt-1">Try adjusting your filters or search term</p>
        </div>
      </div>
    );
  }

  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Results count */}
      <p className="text-sm text-base-content/50">
        Showing <span className="font-medium text-base-content">{products.length}</span> of{" "}
        <span className="font-medium text-base-content">{meta?.total ?? products.length}</span> products
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost btn-circle"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-base-content/40">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  className={`btn btn-sm btn-circle ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-ghost btn-circle"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
