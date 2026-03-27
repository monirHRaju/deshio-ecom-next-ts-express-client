"use client";

import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category, ProductQueryParams } from "@/types";

interface Props {
  filters: ProductQueryParams;
  onChange: (updates: Partial<ProductQueryParams>) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_PRESETS = [
  { label: "Under ৳100", min: 0, max: 100 },
  { label: "৳100 – ৳500", min: 100, max: 500 },
  { label: "৳500 – ৳1000", min: 500, max: 1000 },
  { label: "Over ৳1000", min: 1000, max: undefined },
];

function FiltersContent({ filters, onChange, onClear }: Omit<Props, "isOpen" | "onClose">) {
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() ?? "");

  // Sync external clear
  useEffect(() => {
    setPriceMin(filters.priceMin?.toString() ?? "");
    setPriceMax(filters.priceMax?.toString() ?? "");
  }, [filters.priceMin, filters.priceMax]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data;
    },
    staleTime: 5 * 60_000,
  });

  const applyPrice = () => {
    onChange({
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      page: 1,
    });
  };

  const activeCount = [
    filters.category,
    filters.priceMin,
    filters.priceMax,
    filters.rating,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base-content">
          Filters{activeCount > 0 && (
            <span className="ml-2 badge badge-primary badge-sm">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={onClear} className="btn btn-ghost btn-xs gap-1 text-error">
            <RotateCcw className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">Category</p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onChange({ category: undefined, page: 1 })}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                !filters.category ? "bg-primary/10 text-primary font-medium" : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => onChange({ category: cat._id, page: 1 })}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  filters.category === cat._id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="divider my-0" />

      {/* Price Range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">Price Range</p>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((p) => {
            const active = filters.priceMin === p.min && filters.priceMax === p.max;
            return (
              <button
                key={p.label}
                onClick={() => {
                  setPriceMin(p.min.toString());
                  setPriceMax(p.max?.toString() ?? "");
                  onChange({ priceMin: p.min, priceMax: p.max, page: 1 });
                }}
                className={`badge badge-sm cursor-pointer transition-colors ${
                  active ? "badge-primary" : "badge-ghost border-base-300 hover:badge-primary"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="input input-bordered input-sm w-full"
            min={0}
          />
          <span className="text-base-content/40 shrink-0">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="input input-bordered input-sm w-full"
            min={0}
          />
        </div>
        <button onClick={applyPrice} className="btn btn-outline btn-sm w-full">
          Apply Price
        </button>
      </div>

      <div className="divider my-0" />

      {/* Rating */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">Min. Rating</p>
        <div className="flex flex-col gap-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ rating: filters.rating === r ? undefined : r, page: 1 })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.rating === r ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= r ? "fill-secondary text-secondary" : "fill-base-300 text-base-300"}`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductFilters({ filters, onChange, onClear, isOpen, onClose }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24 bg-base-100 rounded-2xl border border-base-200 p-5">
          <FiltersContent filters={filters} onChange={onChange} onClear={onClear} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        {/* Panel */}
        <div className={`absolute left-0 top-0 h-full w-72 bg-base-100 shadow-2xl transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
            <span className="font-bold text-base-content">Filters</span>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <FiltersContent filters={filters} onChange={(u) => { onChange(u); onClose(); }} onClear={() => { onClear(); onClose(); }} />
          </div>
        </div>
      </div>
    </>
  );
}
