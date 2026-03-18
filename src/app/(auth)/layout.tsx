import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex flex-col">
      {/* Top bar */}
      <header className="p-4 sm:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary font-black text-xl hover:opacity-80 transition-opacity"
        >
          <ShoppingBag className="w-6 h-6" />
          Deshio
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Bottom note */}
      <footer className="text-center py-4 text-xs text-base-content/40">
        © {new Date().getFullYear()} Deshio. All rights reserved.
      </footer>
    </div>
  );
}
