"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatPrice";
import {
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CartSidebar() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, isOpen, closeCart, updateItem, removeItem } =
    useCart();
  const router = useRouter();

  const handleProceed = () => {
    if (!user) {
      closeCart();
      router.push("/login?redirect=/checkout");
      return;
    }
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-base-100 shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-base-content">
              My Cart
              {totalItems > 0 && (
                <span className="ml-2 badge badge-primary badge-sm">{totalItems}</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-base-content/30" />
              </div>
              <div>
                <p className="font-semibold text-base-content">Your cart is empty</p>
                <p className="text-sm text-base-content/50 mt-1">
                  Add items to start shopping
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="btn btn-primary btn-sm"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-base-200 px-4 py-3">
              {items.map((item) => (
                <li key={item._id} className="py-4 flex gap-3">
                  {/* Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={closeCart}
                    className="shrink-0"
                  >
                    <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-base-200 border border-base-300 w-[72px] h-[72px]">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="72px"
                        unoptimized
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={closeCart}
                      className="text-sm font-semibold text-base-content line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.brand && (
                      <p className="text-xs text-base-content/40 uppercase tracking-wide">
                        {item.brand}
                      </p>
                    )}
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(item.price)}
                    </p>

                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-base-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem(item._id).catch(() =>
                                toast.error("Failed to remove item")
                              );
                            } else {
                              updateItem(item._id, item.quantity - 1).catch(() =>
                                toast.error("Failed to update quantity")
                              );
                            }
                          }}
                          className="btn btn-ghost btn-xs btn-square rounded-none"
                        >
                          {item.quantity <= 1 ? (
                            <Trash2 className="w-3 h-3 text-error" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity >= item.stock) {
                              toast.error("Not enough stock");
                              return;
                            }
                            updateItem(item._id, item.quantity + 1).catch(() =>
                              toast.error("Failed to update quantity")
                            );
                          }}
                          disabled={item.quantity >= item.stock}
                          className="btn btn-ghost btn-xs btn-square rounded-none"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item._id).catch(() =>
                            toast.error("Failed to remove item")
                          )
                        }
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-base-300 px-5 py-4 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/60">
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className="font-bold text-base-content text-base">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="text-xs text-base-content/40">
              Shipping & taxes calculated at checkout
            </p>

            {/* CTA */}
            <button
              onClick={handleProceed}
              className="btn btn-primary w-full"
            >
              {user ? "Proceed to Checkout" : "Sign In to Checkout"}
            </button>

            <Link
              href="/products"
              onClick={closeCart}
              className="btn btn-ghost btn-sm w-full"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
