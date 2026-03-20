"use client";

import { ArrowLeft, Home, Package, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-6">
      <div className="text-center max-w-lg w-full">
        {/* Animated 404 */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="text-[10rem] sm:text-[14rem] font-black leading-none select-none">
            <span className="text-primary/20">4</span>
            <span className="relative">
              <span className="text-primary/20">0</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                  <Package className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                </div>
              </div>
            </span>
            <span className="text-primary/20">4</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-black text-base-content mb-3">
          Oops — page not found
        </h1>
        <p className="text-base-content/60 leading-relaxed mb-8">
          The page you&apos;re looking for has been moved, deleted, or never
          existed. Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/products" className="btn btn-ghost border border-base-300 gap-2">
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-base-200">
          <p className="text-xs text-base-content/40 mb-4 uppercase tracking-widest font-semibold">
            Or try one of these
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Products", href: "/products" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Blog", href: "/blog" },
              { label: "Track Order", href: "/track-order" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="badge badge-ghost badge-lg hover:badge-primary transition-colors cursor-pointer"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm gap-1 text-base-content/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
