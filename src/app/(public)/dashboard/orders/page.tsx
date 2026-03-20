"use client";

import OrderTracker, { TrackingData } from "@/components/orders/OrderTracker";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { formatPrice } from "@/utils/formatPrice";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Package, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

// ─── Order Card with expandable tracking ──────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  const { data: trackingData, isLoading: loadingTrack } = useQuery<TrackingData>({
    queryKey: ["order-track", order._id],
    queryFn: async () => {
      const res = await api.get(`/orders/track/${order.orderNumber}`);
      return res.data.data;
    },
    enabled: expanded,
    staleTime: 30_000,
  });

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
      {/* Summary row */}
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold text-sm font-mono text-primary">{order.orderNumber}</p>
            <p className="text-xs text-base-content/50 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" · "}{order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge badge-sm capitalize ${statusColors[order.orderStatus] ?? "badge-ghost"}`}>
              {order.orderStatus}
            </span>
            <span className="font-bold text-primary text-sm">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Item preview */}
        <div className="mt-2 space-y-0.5">
          {order.items.slice(0, 2).map((item, i) => (
            <p key={i} className="text-xs text-base-content/50 line-clamp-1">
              {item.title} × {item.quantity}
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-base-content/40">+{order.items.length - 2} more</p>
          )}
        </div>

        {/* Track button */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="btn btn-ghost btn-xs gap-1 mt-3 text-primary hover:bg-primary/10"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Hide Tracking" : "Track Order"}
        </button>
      </div>

      {/* Expandable tracking panel */}
      {expanded && (
        <div className="border-t border-base-200 bg-base-50 p-4">
          {loadingTrack ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-base-200 animate-pulse" />
              ))}
            </div>
          ) : trackingData ? (
            <OrderTracker data={trackingData} />
          ) : (
            <p className="text-sm text-base-content/50 text-center py-6">
              Could not load tracking info. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/orders", { params: { limit: 50 } });
      return res.data.data ?? [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-base-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">My Orders</h1>
        <button onClick={() => refetch()} className="btn btn-ghost btn-sm gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Package className="w-14 h-14 text-base-content/20" />
          <p className="font-semibold text-base-content/50">No orders yet</p>
          <Link href="/products" className="btn btn-primary btn-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
