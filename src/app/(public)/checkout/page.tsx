"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { formatPrice } from "@/utils/formatPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(3, "ZIP / Postal code is required"),
  paymentMethod: z.enum(["cash_on_delivery", "credit_card", "paypal"]),
});

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      street: user?.address?.street ?? "",
      city: user?.address?.city ?? "",
      country: user?.address?.country ?? "",
      zip: user?.address?.zip ?? "",
      paymentMethod: "cash_on_delivery",
    },
  });

  // Guard — must be logged in
  if (!user) {
    router.replace("/login?redirect=/checkout");
    return null;
  }

  // Guard — cart must not be empty
  if (items.length === 0 && !orderNumber) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-14 h-14 text-base-content/20" />
        <p className="text-base-content/50 font-medium">Your cart is empty</p>
        <Link href="/products" className="btn btn-primary btn-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  if (orderNumber) return <OrderSuccess orderNumber={orderNumber} />;

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const grandTotal = totalPrice + shipping;

  const onSubmit = async (data: FormValues) => {
    if (!user.isVerified) {
      toast.error("Please verify your email before placing an order.");
      return;
    }

    setPlacing(true);
    try {
      const res = await api.post("/orders", {
        shippingAddress: {
          street: data.street,
          city: data.city,
          country: data.country,
          zip: data.zip,
        },
        paymentMethod: data.paymentMethod,
      });
      const order = res.data.data;
      clearCart();
      setOrderNumber(order.orderNumber);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(msg);
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
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content">Checkout</span>
      </nav>

      <h1 className="text-2xl font-black text-base-content">Checkout</h1>

      {/* Email verification warning */}
      {!user.isVerified && (
        <div className="alert alert-warning text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Your email is not verified. You must verify it before placing an order.{" "}
            <Link href="/dashboard/profile" className="font-semibold underline">
              Verify now
            </Link>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-base-content">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-medium">Street Address</span>
                  </label>
                  <input
                    {...register("street")}
                    placeholder="123 Main St, Apt 4B"
                    className={`input input-bordered w-full ${
                      errors.street ? "input-error" : ""
                    }`}
                  />
                  {errors.street && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">
                        {errors.street.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-medium">City</span>
                    </label>
                    <input
                      {...register("city")}
                      placeholder="New York"
                      className={`input input-bordered w-full ${
                        errors.city ? "input-error" : ""
                      }`}
                    />
                    {errors.city && (
                      <label className="label pt-1">
                        <span className="label-text-alt text-error">
                          {errors.city.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-medium">Country</span>
                    </label>
                    <input
                      {...register("country")}
                      placeholder="United States"
                      className={`input input-bordered w-full ${
                        errors.country ? "input-error" : ""
                      }`}
                    />
                    {errors.country && (
                      <label className="label pt-1">
                        <span className="label-text-alt text-error">
                          {errors.country.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control w-full sm:w-1/2">
                  <label className="label pb-1">
                    <span className="label-text font-medium">ZIP / Postal Code</span>
                  </label>
                  <input
                    {...register("zip")}
                    placeholder="10001"
                    className={`input input-bordered w-full ${
                      errors.zip ? "input-error" : ""
                    }`}
                  />
                  {errors.zip && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">
                        {errors.zip.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-base-content">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "cash_on_delivery",
                    label: "Cash on Delivery",
                    sub: "Pay when your order arrives",
                    icon: "💵",
                  },
                  {
                    value: "credit_card",
                    label: "Credit / Debit Card",
                    sub: "Visa, Mastercard, Amex (demo)",
                    icon: "💳",
                  },
                  {
                    value: "paypal",
                    label: "PayPal",
                    sub: "Pay with your PayPal account (demo)",
                    icon: "🅿️",
                  },
                ].map(({ value, label, sub, icon }) => (
                  <label
                    key={value}
                    className="flex items-center gap-4 cursor-pointer p-4 rounded-xl border border-base-300 hover:border-primary/50 hover:bg-primary/5 transition-colors has-checked:border-primary has-checked:bg-primary/5"
                  >
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value={value}
                      className="radio radio-primary radio-sm"
                    />
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-base-content">{label}</p>
                      <p className="text-xs text-base-content/50">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              {errors.paymentMethod && (
                <p className="text-error text-sm">{errors.paymentMethod.message}</p>
              )}
            </div>

            {/* Secure badge */}
            <div className="flex items-center gap-2 text-sm text-base-content/40">
              <Lock className="w-4 h-4" />
              <span>Your information is encrypted and secure</span>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="space-y-5">
            <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-4 sticky top-24">
              <h2 className="font-bold text-base-content">
                Order Summary
                <span className="text-base-content/50 font-normal text-sm ml-2">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h2>

              {/* Items */}
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item._id} className="flex gap-3 items-start">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-base-200 border border-base-200 shrink-0">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-base-content line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-base-content/50 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-base-content shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="divider my-0" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Shipping</span>
                  <span className={shipping === 0 ? "text-success font-medium" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-base-content/40">
                    Free shipping on orders over $50
                  </p>
                )}
              </div>

              <div className="divider my-0" />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-lg">{formatPrice(grandTotal)}</span>
              </div>

              <button
                type="submit"
                disabled={placing || !user.isVerified}
                className="btn btn-primary w-full"
              >
                {placing ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
