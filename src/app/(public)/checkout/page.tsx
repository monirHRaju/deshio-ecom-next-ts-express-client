"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { formatPrice } from "@/utils/formatPrice";
import { AppliedCoupon, DeliveryZone, PaymentMethod } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
  Smartphone,
  Tag,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    zip: z.string().min(3, "ZIP / Postal code is required"),
    deliveryZoneId: z.string().min(1, "Please select a delivery option"),
    paymentMethod: z.enum(["cash_on_delivery", "credit_card", "mobile_banking"] as const, {
      error: "Select a payment method",
    }),
    orderNote: z.string().max(300).optional(),
    // Mobile banking fields
    selectedPaymentMethodId: z.string().optional(),
    mobileLast4: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .refine(
    (d) =>
      d.paymentMethod !== "mobile_banking" || (d.selectedPaymentMethodId && d.selectedPaymentMethodId.length > 0),
    { message: "Please select a payment method", path: ["selectedPaymentMethodId"] }
  )
  .refine(
    (d) =>
      d.paymentMethod !== "mobile_banking" || (d.mobileLast4 && /^\d{4}$/.test(d.mobileLast4)),
    { message: "Enter the last 4 digits of your mobile number", path: ["mobileLast4"] }
  )
  .refine(
    (d) =>
      d.paymentMethod !== "mobile_banking" || (d.transactionId && d.transactionId.trim().length > 0),
    { message: "Transaction ID is required", path: ["transactionId"] }
  );

type FormValues = z.infer<typeof schema>;

// ─── Success Screen ────────────────────────────────────────────────────────────
function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>
      <div>
        <h1 className="text-2xl font-black text-base-content">Order Placed!</h1>
        <p className="text-base-content/60 mt-2">
          Thank you for your purchase. We&apos;ll get it to you soon.
        </p>
        <p className="mt-3 text-sm font-mono bg-base-200 inline-block px-4 py-2 rounded-xl border border-base-300">
          Order #{orderNumber}
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard/orders" className="btn btn-primary btn-sm">
          <Package className="w-4 h-4" /> Track Order
        </Link>
        <Link href="/products" className="btn btn-ghost btn-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const { data: mobileMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const res = await api.get("/payment-methods");
      return res.data.data ?? [];
    },
    staleTime: 5 * 60_000,
  });

  const { data: deliveryZones = [] } = useQuery<DeliveryZone[]>({
    queryKey: ["delivery-zones"],
    queryFn: async () => {
      const res = await api.get("/delivery-zones");
      return res.data.data ?? [];
    },
    staleTime: 5 * 60_000,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      street: user?.address?.street ?? "",
      city: user?.address?.city ?? "",
      country: user?.address?.country ?? "",
      zip: user?.address?.zip ?? "",
      paymentMethod: "cash_on_delivery",
      deliveryZoneId: "",
      orderNote: "",
      selectedPaymentMethodId: "",
      mobileLast4: "",
      transactionId: "",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const selectedMobileMethodId = watch("selectedPaymentMethodId");
  const selectedMobileMethod = mobileMethods.find((m) => m._id === selectedMobileMethodId);

  const selectedZoneId = watch("deliveryZoneId");
  const selectedZone = deliveryZones.find((z) => z._id === selectedZoneId);
  const deliveryCharge = selectedZone?.charge ?? 0;
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const grandTotal = Math.max(0, totalPrice + deliveryCharge - couponDiscount);

  // Guards
  if (!user) { router.replace("/login?redirect=/checkout"); return null; }
  if (items.length === 0 && !orderNumber) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-14 h-14 text-base-content/20" />
        <p className="text-base-content/50 font-medium">Your cart is empty</p>
        <Link href="/products" className="btn btn-primary btn-sm">Browse Products</Link>
      </div>
    );
  }
  if (orderNumber) return <OrderSuccess orderNumber={orderNumber} />;

  // ── Coupon handlers ────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await api.post("/coupons/validate", {
        code: couponInput.trim(),
        orderTotal: totalPrice,
      });
      setAppliedCoupon(res.data.data);
      toast.success(res.data.message);
      setCouponInput("");
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    if (!user.isVerified) {
      toast.error("Please verify your email before placing an order.");
      return;
    }
    setPlacing(true);
    try {
      const payload: Record<string, unknown> = {
        shippingAddress: { street: data.street, city: data.city, country: data.country, zip: data.zip },
        paymentMethod: data.paymentMethod,
        deliveryZoneId: data.deliveryZoneId,
        couponCode: appliedCoupon?.code,
        orderNote: data.orderNote || undefined,
      };
      if (data.paymentMethod === "mobile_banking") {
        payload.mobilePayment = {
          paymentMethodId: data.selectedPaymentMethodId,
          mobileLast4: data.mobileLast4,
          transactionId: data.transactionId,
        };
      }
      const res = await api.post("/orders", payload);
      clearCart();
      setOrderNumber(res.data.data.orderNumber);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-base-content/50">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <button type="button" onClick={() => router.back()} className="hover:text-primary transition-colors">Cart</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content">Checkout</span>
      </nav>

      <h1 className="text-2xl font-black text-base-content">Checkout</h1>

      {!user.isVerified && (
        <div className="alert alert-warning text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Your email is not verified. You must verify it before placing an order.{" "}
            <Link href="/dashboard/profile" className="font-semibold underline">Verify now</Link>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── Left ───────────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Shipping Address */}
            <section className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label pb-1"><span className="label-text font-medium">Street Address</span></label>
                  <input {...register("street")} placeholder="House 12, Road 5, Dhanmondi" className={`input input-bordered w-full ${errors.street ? "input-error" : ""}`} />
                  {errors.street && <p className="text-error text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-medium">City</span></label>
                    <input {...register("city")} placeholder="Dhaka" className={`input input-bordered w-full ${errors.city ? "input-error" : ""}`} />
                    {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="form-control">
                    <label className="label pb-1"><span className="label-text font-medium">Country</span></label>
                    <input {...register("country")} placeholder="Bangladesh" className={`input input-bordered w-full ${errors.country ? "input-error" : ""}`} />
                    {errors.country && <p className="text-error text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>
                <div className="form-control w-full sm:w-1/2">
                  <label className="label pb-1"><span className="label-text font-medium">ZIP / Area Code</span></label>
                  <input {...register("zip")} placeholder="1000" className={`input input-bordered w-full ${errors.zip ? "input-error" : ""}`} />
                  {errors.zip && <p className="text-error text-xs mt-1">{errors.zip.message}</p>}
                </div>
              </div>
            </section>

            {/* Delivery Zone */}
            <section className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Delivery Option</h2>
              </div>
              {deliveryZones.length === 0 ? (
                <p className="text-sm text-base-content/40 italic">Loading delivery options…</p>
              ) : (
                <div className="space-y-2">
                  {deliveryZones.map((zone) => (
                    <label
                      key={zone._id}
                      className="flex items-center gap-4 cursor-pointer p-3.5 rounded-xl border border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input {...register("deliveryZoneId")} type="radio" value={zone._id} className="radio radio-primary radio-sm" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{zone.name}</p>
                        <p className="text-xs text-base-content/50">Est. delivery: {zone.estimatedDays}</p>
                      </div>
                      <span className="font-bold text-sm text-primary">Tk. {zone.charge}</span>
                    </label>
                  ))}
                </div>
              )}
              {errors.deliveryZoneId && <p className="text-error text-xs">{errors.deliveryZoneId.message}</p>}
            </section>

            {/* Coupon Code */}
            <section className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Coupon Code</h2>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-success">
                      {appliedCoupon.code} —{" "}
                      {appliedCoupon.type === "percent" ? `${appliedCoupon.value}% off` : `Tk. ${appliedCoupon.value} off`}
                    </p>
                    <p className="text-xs text-success/70">You save {formatPrice(appliedCoupon.discount)}</p>
                  </div>
                  <button type="button" onClick={() => { setAppliedCoupon(null); setCouponError(""); }} className="btn btn-ghost btn-xs btn-circle text-error">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                      placeholder="Enter coupon code"
                      className="input input-bordered flex-1 uppercase placeholder:normal-case"
                      maxLength={20}
                    />
                    <button type="button" onClick={handleApplyCoupon} disabled={validatingCoupon || !couponInput.trim()} className="btn btn-outline btn-primary px-5">
                      {validatingCoupon ? <span className="loading loading-spinner loading-sm" /> : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-error text-xs">{couponError}</p>}
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-bold">Payment Method</h2>
              </div>
              <div className="space-y-2">
                {[
                  { value: "cash_on_delivery", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: "💵" },
                  { value: "credit_card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex (demo)", icon: "💳" },
                  { value: "mobile_banking", label: "Mobile Banking", sub: "bKash, Rocket, Nagad", icon: <Smartphone className="w-5 h-5" /> },
                ].map(({ value, label, sub, icon }) => (
                  <label
                    key={value}
                    className="flex items-center gap-4 cursor-pointer p-3.5 rounded-xl border border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value={value}
                      className="radio radio-primary radio-sm"
                      onChange={(e) => {
                        setValue("paymentMethod", e.target.value as FormValues["paymentMethod"]);
                        if (e.target.value !== "mobile_banking") {
                          setValue("selectedPaymentMethodId", "");
                          setValue("mobileLast4", "");
                          setValue("transactionId", "");
                        }
                      }}
                    />
                    <span className="text-xl">{typeof icon === "string" ? icon : icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-base-content/50">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <p className="text-error text-xs">{errors.paymentMethod.message}</p>}

              {/* Mobile Banking Details */}
              {selectedPaymentMethod === "mobile_banking" && (
                <div className="mt-4 space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  {/* Select method */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-medium">Select Payment Method</span>
                    </label>
                    {mobileMethods.length === 0 ? (
                      <p className="text-sm text-base-content/40 italic">No payment methods available</p>
                    ) : (
                      <select
                        {...register("selectedPaymentMethodId")}
                        className={`select select-bordered w-full ${errors.selectedPaymentMethodId ? "select-error" : ""}`}
                      >
                        <option value="">Choose one…</option>
                        {mobileMethods.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.selectedPaymentMethodId && (
                      <p className="text-error text-xs mt-1">{errors.selectedPaymentMethodId.message}</p>
                    )}
                  </div>

                  {/* Instructions + QR */}
                  {selectedMobileMethod && (
                    <div className="space-y-3 rounded-lg bg-base-100 border border-base-300 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">{selectedMobileMethod.name}</h3>
                        <span className="text-lg font-black text-primary">{formatPrice(grandTotal)}</span>
                      </div>

                      {selectedMobileMethod.phoneNumber && (
                        <p className="text-sm">
                          Send money to: <span className="font-bold text-primary">{selectedMobileMethod.phoneNumber}</span>
                        </p>
                      )}

                      {selectedMobileMethod.qrImage && (
                        <div className="flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedMobileMethod.qrImage}
                            alt="Payment QR Code"
                            className="w-40 h-40 object-contain rounded-lg border border-base-300"
                          />
                        </div>
                      )}

                      <div className="text-sm text-base-content/70 whitespace-pre-line leading-relaxed">
                        {selectedMobileMethod.instructions}
                      </div>
                    </div>
                  )}

                  {/* Last 4 digits + TrxID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label pb-1">
                        <span className="label-text font-medium">Last 4 Digits</span>
                      </label>
                      <input
                        {...register("mobileLast4")}
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 3378"
                        className={`input input-bordered w-full ${errors.mobileLast4 ? "input-error" : ""}`}
                        onInput={(e) => {
                          const el = e.target as HTMLInputElement;
                          el.value = el.value.replace(/\D/g, "").slice(0, 4);
                        }}
                      />
                      {errors.mobileLast4 && (
                        <p className="text-error text-xs mt-1">{errors.mobileLast4.message}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label pb-1">
                        <span className="label-text font-medium">Transaction ID (TrxID)</span>
                      </label>
                      <input
                        {...register("transactionId")}
                        type="text"
                        placeholder="e.g. TXN1234ABCD"
                        className={`input input-bordered w-full ${errors.transactionId ? "input-error" : ""}`}
                      />
                      {errors.transactionId && (
                        <p className="text-error text-xs mt-1">{errors.transactionId.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Order Note */}
            <section className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-3">
              <h2 className="font-bold">
                Order Note <span className="text-base-content/40 font-normal text-sm">(optional)</span>
              </h2>
              <textarea
                {...register("orderNote")}
                rows={3}
                placeholder="Special instructions, preferred delivery time, gate code…"
                className="textarea textarea-bordered w-full resize-none text-sm"
                maxLength={300}
              />
            </section>

            <div className="flex items-center gap-2 text-sm text-base-content/40">
              <Lock className="w-4 h-4" />
              <span>Your information is encrypted and secure</span>
            </div>
          </div>

          {/* ── Right: Order Summary ─────────────────────────────────────── */}
          <div>
            <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-4 sticky top-28">
              <h2 className="font-bold">
                Order Summary
                <span className="text-base-content/50 font-normal text-sm ml-2">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h2>

              <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item._id} className="flex gap-3 items-start">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-base-200 border border-base-200 shrink-0">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                      <p className="text-xs text-base-content/50 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>

              <div className="divider my-0" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">
                    Delivery {selectedZone ? `(${selectedZone.name})` : ""}
                  </span>
                  <span>
                    {selectedZone
                      ? <span className="font-medium">Tk. {deliveryCharge}</span>
                      : <span className="text-base-content/40 italic text-xs">select zone</span>}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-success font-medium">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="divider my-0" />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-lg">{formatPrice(grandTotal)}</span>
              </div>

              <button type="submit" disabled={placing || !user.isVerified} className="btn btn-primary w-full">
                {placing ? <span className="loading loading-spinner loading-sm" /> : <Lock className="w-4 h-4" />}
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
