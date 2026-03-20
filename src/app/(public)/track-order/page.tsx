"use client";

import OrderTracker, { TrackingData } from "@/components/orders/OrderTracker";
import api from "@/lib/axios";
import { MapPin, Search } from "lucide-react";
import { FormEvent, useState } from "react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setTracking(null);

    try {
      const res = await api.get(`/orders/track/${trimmed}`);
      setTracking(res.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Order not found. Please check your order number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <MapPin className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Track Your Order</h1>
        <p className="text-base-content/50 mt-2 text-sm">
          Enter your order number to see real-time tracking information.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. ORD-1234567890"
          className="input input-bordered flex-1 font-mono uppercase tracking-wider focus:input-primary"
        />
        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="btn btn-primary gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Track
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-6">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Tracking result */}
      {tracking && <OrderTracker data={tracking} />}

      {/* Empty hint */}
      {!tracking && !error && !loading && (
        <div className="text-center text-base-content/30 text-sm mt-6 space-y-1">
          <p>Your order number was sent to your email after purchase.</p>
          <p>It looks like <span className="font-mono">ORD-XXXXXXXXXX</span></p>
        </div>
      )}
    </div>
  );
}
