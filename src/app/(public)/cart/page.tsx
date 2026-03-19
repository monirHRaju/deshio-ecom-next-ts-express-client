"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/formatPrice";
import {
  ChevronRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, updateItem, removeItem, isSyncing } =
    useCart();
  const router = useRouter();

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const grandTotal = totalPrice + shipping;

  const handleProceed = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
            <ShoppingBag className="w-11 h-11 text-base-content/25" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-base-content">
              Your cart is empty
            </h1>
            <p className="text-base-content/50 mt-2">
              Looks like you haven&apos;t added anything yet.
            </p>
          </div>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-base-content/50">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content">Cart</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-base-content">
          Shopping Cart
          <span className="ml-3 text-base font-normal text-base-content/50">
            ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </h1>
        {isSyncing && (
          <span className="text-sm text-base-content/50 flex items-center gap-2">
            <span className="loading loading-spinner loading-xs" />
            Syncing cart…
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="card bg-base-100 border border-base-200 shadow-sm p-4"
            >
              <div className="flex gap-4">
                {/* Image */}
                <Link href={`/products/${item.productId}`} className="shrink-0">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-base-200 border border-base-200">
                    <Image
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.brand && (
                    <p className="text-xs text-base-content/40 uppercase tracking-wider font-medium">
                      {item.brand}
                    </p>
                  )}
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-semibold text-sm text-base-content line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-base font-bold text-primary">
                    {formatPrice(item.price)}
                  </p>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                    {/* Qty Stepper */}
                    <div className="flex items-center border border-base-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item._id).catch(() =>
                              toast.error("Failed to remove item")
                            );
                          } else {
                            updateItem(item._id, item.quantity - 1).catch(() =>
                              toast.error("Failed to update")
                            );
                          }
                        }}
                        className="btn btn-ghost btn-sm btn-square rounded-none"
                      >
                        {item.quantity <= 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-error" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="w-10 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.quantity >= item.stock) {
                            toast.error("Not enough stock");
                            return;
                          }
                          updateItem(item._id, item.quantity + 1).catch(() =>
                            toast.error("Failed to update")
                          );
                        }}
                        disabled={item.quantity >= item.stock}
                        className="btn btn-ghost btn-sm btn-square rounded-none disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-base-content">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() =>
                          removeItem(item._id).catch(() =>
                            toast.error("Failed to remove item")
                          )
                        }
                        className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="btn btn-ghost btn-sm mt-2 gap-2"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-4 sticky top-24">
          <h2 className="font-bold text-base-content text-lg">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/60">
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
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
                Add {formatPrice(50 - totalPrice)} more for free shipping
              </p>
            )}
          </div>

          <div className="divider my-0" />

          <div className="flex justify-between font-bold text-base">
            <span>Estimated Total</span>
            <span className="text-primary text-lg">{formatPrice(grandTotal)}</span>
          </div>

          <button
            onClick={handleProceed}
            className="btn btn-primary w-full gap-2"
          >
            <Lock className="w-4 h-4" />
            {user ? "Proceed to Checkout" : "Sign In to Checkout"}
          </button>

          {!user && (
            <p className="text-xs text-center text-base-content/40">
              You&apos;ll be asked to sign in before payment
            </p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-base-content/50">
            <div className="space-y-1">
              <div className="text-lg">🔒</div>
              <p>Secure</p>
            </div>
            <div className="space-y-1">
              <div className="text-lg">🚚</div>
              <p>Fast Delivery</p>
            </div>
            <div className="space-y-1">
              <div className="text-lg">↩️</div>
              <p>Easy Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
