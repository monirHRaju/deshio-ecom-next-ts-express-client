"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { discountedPrice, formatPrice } from "@/utils/formatPrice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const finalPrice = discountedPrice(product.price, product.discount);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // TODO F7: integrate with cart mutation
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted((prev) => !prev);
    // TODO F8: integrate with wishlist API
  };

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
        {/* Image */}
        <figure className="relative aspect-square overflow-hidden bg-base-200">
          <Image
            src={product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Discount badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 badge badge-secondary text-xs font-bold shadow">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 btn btn-circle btn-xs opacity-0 group-hover:opacity-100 transition-all duration-200 ${
              isWishlisted
                ? "btn-error text-white"
                : "btn-ghost bg-base-100/80 backdrop-blur-sm"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-base-100/70 backdrop-blur-sm flex items-center justify-center">
              <span className="badge badge-error badge-lg">Out of Stock</span>
            </div>
          )}
        </figure>

        <div className="card-body p-4 gap-1.5 flex-1">
          {/* Brand */}
          <p className="text-xs text-base-content/50 uppercase tracking-wider font-medium">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-base-content">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(product.rating)
                      ? "fill-secondary text-secondary"
                      : "fill-base-300 text-base-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-base-content/40">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="text-base font-bold text-primary">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-base-content/40 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`btn btn-sm w-full mt-2 gap-1.5 transition-all duration-300 ${
              addedToCart ? "btn-success" : "btn-primary"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
