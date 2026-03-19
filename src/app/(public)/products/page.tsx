"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductQueryParams } from "@/types";

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Best Rating", value: "-rating" },
  { label: "Most Popular", value: "-sold" },
  { label: "A – Z", value: "title" },
];

function parseParams(sp: URLSearchParams): ProductQueryParams {
  return {
    search: sp.get("search") || undefined,
    category: sp.get("category") || undefined,
    brand: sp.get("brand") || undefined,
    priceMin: sp.get("priceMin") ? Number(sp.get("priceMin")) : undefined,
    priceMax: sp.get("priceMax") ? Number(sp.get("priceMax")) : undefined,
    rating: sp.get("rating") ? Number(sp.get("rating")) : undefined,
    sort: sp.get("sort") || "-createdAt",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    limit: 12,
  };
}

function buildURL(params: ProductQueryParams): string {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.category) sp.set("category", params.category);
  if (params.brand) sp.set("brand", params.brand);
  if (params.priceMin !== undefined) sp.set("priceMin", String(params.priceMin));
  if (params.priceMax !== undefined) sp.set("priceMax", String(params.priceMax));
  if (params.rating) sp.set("rating", String(params.rating));
  if (params.sort && params.sort !== "-createdAt") sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const str = sp.toString();
  return str ? `/products?${str}` : "/products";
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductQueryParams>(() => parseParams(searchParams));
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync URL → state when back/forward navigation happens
  useEffect(() => {
    const next = parseParams(searchParams);
    setFilters(next);
    setSearchInput(next.search ?? "");
  }, [searchParams.toString()]);

  const pushFilters = useCallback((next: ProductQueryParams) => {
    setFilters(next);
    router.push(buildURL(next), { scroll: false });
  }, [router]);

  const handleFilterChange = useCallback((updates: Partial<ProductQueryParams>) => {
    const next = { ...filters, ...updates, page: updates.page ?? 1 };
    pushFilters(next);
  }, [filters, pushFilters]);

  const handleClear = useCallback(() => {
    const clean: ProductQueryParams = { sort: "-createdAt", page: 1, limit: 12 };
    setSearchInput("");
    pushFilters(clean);
  }, [pushFilters]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushFilters({ ...filters, search: value || undefined, page: 1 });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    pushFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = [
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.rating,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-base-50">
      {/* Page Header */}
      <div className="bg-base-100 border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-base-content">
                Explore Products
              </h1>
              <p className="text-base-content/50 text-sm mt-1">
                Discover our full collection of electronics
              </p>
            </div>
            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products…"
                className="input input-bordered w-full pl-9 pr-9"
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-base-100/95 backdrop-blur-md border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="btn btn-sm btn-outline gap-2 lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="badge badge-primary badge-sm">{activeFilterCount}</span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-base-content/50 hidden sm:inline">Sort:</span>
            <select
              value={filters.sort ?? "-createdAt"}
              onChange={(e) => handleFilterChange({ sort: e.target.value, page: 1 })}
              className="select select-bordered select-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Active filter chips */}
          {filters.search && (
            <div className="flex items-center gap-1 badge badge-outline gap-1.5">
              <span className="text-xs">"{filters.search}"</span>
              <button onClick={() => handleFilterChange({ search: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.category && (
            <div className="flex items-center gap-1 badge badge-outline gap-1.5">
              <span className="text-xs">Category</span>
              <button onClick={() => handleFilterChange({ category: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
            <div className="flex items-center gap-1 badge badge-outline gap-1.5">
              <span className="text-xs">
                ${filters.priceMin ?? 0} – {filters.priceMax ? `$${filters.priceMax}` : "∞"}
              </span>
              <button onClick={() => handleFilterChange({ priceMin: undefined, priceMax: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.rating && (
            <div className="flex items-center gap-1 badge badge-outline gap-1.5">
              <span className="text-xs">★ {filters.rating}+</span>
              <button onClick={() => handleFilterChange({ rating: undefined })}>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {activeFilterCount > 1 && (
            <button onClick={handleClear} className="btn btn-ghost btn-xs text-error">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClear}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid params={filters} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
