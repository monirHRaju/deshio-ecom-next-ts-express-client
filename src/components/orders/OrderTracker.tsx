"use client";

import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatPrice";
import {
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackingData {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryCharge?: number;
  couponDiscount?: number;
  orderNote?: string;
  deliveryZone?: { name: string; estimatedDays: string } | null;
  items: { title: string; quantity: number; image?: string; price: number }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { key: "pending",    label: "Order Placed", icon: Clock,        description: "Your order has been received" },
  { key: "processing", label: "Processing",   icon: Package,      description: "We're preparing your items" },
  { key: "shipped",    label: "Shipped",       icon: Truck,        description: "Your order is on the way" },
  { key: "delivered",  label: "Delivered",     icon: PackageCheck, description: "Package delivered successfully" },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};

// ─── Timeline events derived from status ─────────────────────────────────────

function buildTimeline(status: string, createdAt: string, updatedAt: string) {
  const idx = STATUS_ORDER[status] ?? -1;
  const events: { label: string; sub: string; date: string; active: boolean }[] = [];

  const fmt = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (idx >= 0) events.push({ label: "Order Placed", sub: "Your order was received and confirmed.", date: fmt(createdAt), active: true });
  if (idx >= 1) events.push({ label: "Processing", sub: "Seller is preparing your package.", date: fmt(updatedAt), active: true });
  if (idx >= 2) events.push({ label: "Shipped", sub: "Package handed to delivery partner.", date: fmt(updatedAt), active: true });
  if (idx >= 3) events.push({ label: "Delivered", sub: "Package delivered successfully.", date: fmt(updatedAt), active: true });

  return events.reverse(); // newest first
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderTracker({ data }: { data: TrackingData }) {
  const isCancelled = data.orderStatus === "cancelled";
  const currentStep = STATUS_ORDER[data.orderStatus] ?? 0;
  const timeline = buildTimeline(data.orderStatus, data.createdAt, data.updatedAt);

  const paymentBadge = data.paymentStatus === "paid"
    ? "badge-success"
    : data.paymentStatus === "failed"
    ? "badge-error"
    : "badge-warning";

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-base-content/50 uppercase tracking-widest mb-1">Order Number</p>
            <p className="font-black text-lg font-mono text-primary">{data.orderNumber}</p>
            <p className="text-xs text-base-content/40 mt-1">
              Placed on {new Date(data.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {isCancelled ? (
              <span className="badge badge-error gap-1">
                <XCircle className="w-3 h-3" /> Cancelled
              </span>
            ) : (
              <span className={`badge badge-sm capitalize ${
                data.orderStatus === "delivered" ? "badge-success" :
                data.orderStatus === "shipped"   ? "badge-primary" :
                data.orderStatus === "processing"? "badge-info" : "badge-warning"
              }`}>
                {data.orderStatus}
              </span>
            )}
            <span className={`badge badge-sm ${paymentBadge}`}>
              Payment: {data.paymentStatus}
            </span>
          </div>
        </div>

        {data.deliveryZone && (
          <p className="mt-3 text-sm text-base-content/60 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 shrink-0 text-primary" />
            {data.deliveryZone.name} · Est. {data.deliveryZone.estimatedDays}
          </p>
        )}
      </div>

      {/* ── Progress Stepper ────────────────────────────────────────────── */}
      {!isCancelled && (
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 sm:p-6">
          <div className="flex items-start justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-base-300 z-0 mx-[10%]" />

            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      done && !active
                        ? "bg-primary border-primary text-primary-content"
                        : active
                        ? "bg-secondary border-secondary text-secondary-content ring-4 ring-secondary/20"
                        : "bg-base-100 border-base-300 text-base-content/30"
                    )}
                  >
                    {done && !active
                      ? <CheckCircle2 className="w-5 h-5" />
                      : <Icon className="w-5 h-5" />
                    }
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xs font-semibold", done ? "text-base-content" : "text-base-content/40")}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-base-content/40 hidden sm:block mt-0.5 max-w-[80px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      {timeline.length > 0 && (
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5">
          <h3 className="font-bold text-sm mb-4 text-base-content">Tracking Timeline</h3>
          <ul className="space-y-0">
            {timeline.map((event, i) => (
              <li key={i} className="flex gap-4">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full shrink-0 mt-1",
                    i === 0 ? "bg-secondary ring-4 ring-secondary/20" : "bg-base-300"
                  )} />
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-base-200 my-1 min-h-[24px]" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-4">
                  <p className={cn("text-sm font-semibold", i === 0 ? "text-base-content" : "text-base-content/60")}>
                    {event.label}
                  </p>
                  <p className="text-xs text-base-content/50 mt-0.5">{event.sub}</p>
                  <p className="text-xs text-base-content/40 mt-1">{event.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Order Items ─────────────────────────────────────────────────── */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-5">
        <h3 className="font-bold text-sm mb-4">Items Ordered</h3>
        <ul className="divide-y divide-base-200">
          {data.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-base-200 border border-base-200 shrink-0">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=60"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-base-content/50 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        {/* Price summary */}
        <div className="border-t border-base-200 mt-4 pt-4 space-y-1.5 text-sm">
          {(data.deliveryCharge ?? 0) > 0 && (
            <div className="flex justify-between text-base-content/60">
              <span>Delivery</span>
              <span>Tk. {data.deliveryCharge}</span>
            </div>
          )}
          {(data.couponDiscount ?? 0) > 0 && (
            <div className="flex justify-between text-success">
              <span>Coupon Discount</span>
              <span>−{formatPrice(data.couponDiscount!)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-primary">{formatPrice(data.totalAmount)}</span>
          </div>
          <p className="text-xs text-base-content/40 capitalize">
            Payment: {data.paymentMethod.replace(/_/g, " ")} · {data.paymentStatus}
          </p>
        </div>

        {data.orderNote && (
          <div className="mt-4 p-3 rounded-xl bg-base-200 text-sm text-base-content/60">
            <span className="font-medium text-base-content">Note: </span>
            {data.orderNote}
          </div>
        )}
      </div>
    </div>
  );
}
