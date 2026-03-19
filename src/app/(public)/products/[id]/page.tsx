"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// useMutation kept for wishlist
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Minus,
  Package,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageGallery from "@/components/products/ImageGallery";
import RelatedProducts from "@/components/products/RelatedProducts";
import ReviewSection from "@/components/products/ReviewSection";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import { Category, Product } from "@/types";
import { cn } from "@/utils/cn";
import { discountedPrice, formatPrice } from "@/utils/formatPrice";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-48 bg-base-300 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-base-300 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-3 w-24 bg-base-300 rounded" />
          <div className="h-8 w-3/4 bg-base-300 rounded" />
          <div className="h-4 w-32 bg-base-300 rounded" />
          <div className="h-10 w-40 bg-base-300 rounded" />
          <div className="space-y-2 mt-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-3 bg-base-300 rounded" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = "description" | "specs" | "reviews";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const qc = useQueryClient();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [wishlisted, setWishlisted] = useState(false);

  // Fetch product
  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  // Set wishlist state from user data
  useState(() => {
    if (user && product) {
      setWishlisted(user.wishlist?.includes(product._id) ?? false);
    }
  });

  // Add to cart
  const [cartLoading, setCartLoading] = useState(false);
  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      await addItem(product, qty);
      toast.success(`${product.title} added to cart!`);
      openCart();
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  // Wishlist toggle mutation
  const { mutate: toggleWishlist, isPending: wishlistLoading } = useMutation({
    mutationFn: () => api.post(`/products/${product!._id}/wishlist`),
    onSuccess: (res) => {
      const added = res.data.message?.toLowerCase().includes("added");
      setWishlisted(added);
      toast.success(res.data.message);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update wishlist"),
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-base-content/60 font-medium text-lg">Product not found</p>
        <Link href="/products" className="btn btn-primary btn-sm">
          <ArrowLeft className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    );
  }

  const finalPrice = discountedPrice(product.price, product.discount ?? 0);
  const categoryId = typeof product.category === "object"
    ? (product.category as Category)._id
    : product.category;

  const stockStatus =
    product.stock === 0 ? "out"
    : product.stock <= 5 ? "low"
    : "in";

  return (
    <div className="min-h-screen bg-base-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-base-content/50">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-base-content truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Left — Image Gallery */}
          <ImageGallery images={product.images} title={product.title} />

          {/* Right — Product Info */}
          <div className="space-y-5">
            {/* Brand + badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && (
                <span className="badge badge-ghost border-base-300 text-xs font-semibold uppercase tracking-wider">
                  {product.brand}
                </span>
              )}
              {product.isFeatured && (
                <span className="badge badge-primary badge-sm">Featured</span>
              )}
              {product.discount > 0 && (
                <span className="badge badge-secondary badge-sm font-bold">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-base-content leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-4 h-4",
                      s <= Math.round(product.rating ?? 0)
                        ? "fill-secondary text-secondary"
                        : "fill-base-300 text-base-300"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => setTab("reviews")}
                className="text-sm text-primary hover:underline"
              >
                {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
              </button>
              <span className="text-base-content/30">|</span>
              <span className="text-sm text-base-content/50">{product.sold} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-primary">
                {formatPrice(finalPrice)}
              </span>
              {product.discount > 0 && (
                <div className="flex flex-col">
                  <span className="text-base-content/40 line-through text-lg">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-success text-xs font-semibold">
                    You save {formatPrice(product.price - finalPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={cn(
              "flex items-center gap-2 text-sm font-medium",
              stockStatus === "out" ? "text-error"
              : stockStatus === "low" ? "text-warning"
              : "text-success"
            )}>
              {stockStatus === "out" ? (
                <><Package className="w-4 h-4" /> Out of Stock</>
              ) : stockStatus === "low" ? (
                <><Package className="w-4 h-4" /> Only {product.stock} left!</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} available)</>
              )}
            </div>

            <div className="divider my-1" />

            {/* Quantity + Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-base-content/70 w-20">Quantity</span>
                <div className="flex items-center border border-base-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="btn btn-ghost btn-sm btn-square rounded-none"
                    disabled={qty <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="btn btn-ghost btn-sm btn-square rounded-none"
                    disabled={qty >= product.stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={stockStatus === "out" || cartLoading}
                  className="btn btn-primary flex-1 gap-2"
                >
                  {cartLoading
                    ? <span className="loading loading-spinner loading-sm" />
                    : <ShoppingCart className="w-4 h-4" />}
                  {stockStatus === "out" ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={() => {
                    if (!user) { router.push("/login"); return; }
                    toggleWishlist();
                  }}
                  disabled={wishlistLoading}
                  className={cn(
                    "btn btn-square",
                    wishlisted ? "btn-error" : "btn-outline border-base-300 hover:btn-error"
                  )}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
                </button>

                <button
                  onClick={handleShare}
                  className="btn btn-square btn-outline border-base-300"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust badges — card row */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over $50" },
                { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit SSL" },
                { icon: Package, label: "Easy Returns", sub: "30-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl border border-base-300 bg-base-200/40 hover:bg-base-200/70 transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <p className="text-xs font-bold text-base-content leading-tight">{label}</p>
                  <p className="text-xs text-base-content/50">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Tag className="w-3.5 h-3.5 text-base-content/40" />
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?search=${tag}`}
                    className="badge badge-ghost badge-sm hover:badge-primary transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs — Description / Specs / Reviews */}
        <div className="space-y-6">
          {/* Custom tab bar */}
          <div className="flex border-b-2 border-base-200 gap-1">
            {(
              [
                { key: "description", label: "Description" },
                {
                  key: "specs",
                  label: "Specifications",
                  count: product.specifications
                    ? Object.keys(product.specifications).length
                    : 0,
                },
                { key: "reviews", label: "Reviews", count: product.reviewCount },
              ] as { key: Tab; label: string; count?: number }[]
            ).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold border-b-2 -mb-0.5 transition-colors whitespace-nowrap flex items-center gap-1.5",
                  tab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/50 hover:text-base-content hover:border-base-300"
                )}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "badge badge-sm",
                      tab === key ? "badge-primary" : "badge-ghost"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {tab === "description" && (
              <div className="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
                {product.description
                  ? product.description.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  : <p className="text-base-content/40">No description available.</p>}
              </div>
            )}

            {tab === "specs" && (
              <div className="rounded-xl border border-base-200 overflow-hidden">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="bg-base-200 text-base-content/60 text-xs uppercase tracking-wider">
                        <th className="w-40 font-semibold py-3 pl-4">Specification</th>
                        <th className="font-semibold py-3 pl-4">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], i) => (
                        <tr
                          key={key}
                          className={cn(
                            "transition-colors hover:bg-primary/5",
                            i % 2 === 0 ? "bg-base-100" : "bg-base-200/30"
                          )}
                        >
                          <td className="font-semibold text-base-content/60 py-3 pl-4 text-sm">{key}</td>
                          <td className="text-base-content py-3 pl-4 text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-base-content/40 text-sm">
                    No specifications available for this product.
                  </div>
                )}
              </div>
            )}

            {tab === "reviews" && (
              <ReviewSection
                productId={product._id}
                rating={product.rating ?? 0}
                reviewCount={product.reviewCount ?? 0}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts categoryId={categoryId as string} excludeId={product._id} />
      </div>
    </div>
  );
}
