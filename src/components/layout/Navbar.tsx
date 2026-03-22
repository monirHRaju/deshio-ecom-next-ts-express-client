"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import { cn } from "@/utils/cn";
import { discountedPrice, formatPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryTree {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  children: SubCategory[];
  brands: string[];
}

interface SuggestionProduct {
  _id: string;
  title: string;
  images: string[];
  price: number;
  discount: number;
  brand: string;
}

// ─── Mega Menu ────────────────────────────────────────────────────────────────

function MegaMenu({ cat }: { cat: CategoryTree }) {
  const hasContent = cat.children.length > 0 || cat.brands.length > 0;
  if (!hasContent) return null;

  return (
    <div className="absolute left-0 top-full z-50 hidden group-hover:flex min-w-120 max-w-160 bg-base-100 border border-base-300 shadow-2xl rounded-b-2xl rounded-tr-2xl overflow-hidden pointer-events-auto">
      {cat.children.length > 0 && (
        <div className="flex-1 p-4 border-r border-base-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3 px-1">
            Categories
          </p>
          <ul className="space-y-0.5">
            {cat.children.map((sub) => (
              <li key={sub._id}>
                <Link
                  href={`/products?category=${sub._id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-base-content/70 hover:bg-primary/5 hover:text-primary font-medium transition-colors"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cat.brands.length > 0 && (
        <div className="flex-1 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3 px-1">
            Brands
          </p>
          <ul className="space-y-0.5">
            {cat.brands.map((brand) => (
              <li key={brand}>
                <Link
                  href={`/products?brand=${encodeURIComponent(brand)}&category=${cat._id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-base-content/70 hover:bg-secondary/5 hover:text-secondary font-medium transition-colors"
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Search Box with Suggestions ─────────────────────────────────────────────

function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query for API calls
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch suggestions
  const { data: suggestions = [] } = useQuery<SuggestionProduct[]>({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) return [];
      const res = await api.get("/products", {
        params: { search: debouncedQuery, limit: 8 },
      });
      return res.data.data ?? [];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 0,
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    setQuery("");
    setOpen(false);
  };

  const showDropdown = open && debouncedQuery.length >= 2;

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center rounded-xl border bg-base-200 px-3 py-2 gap-2 transition-colors",
          open
            ? "border-primary bg-base-100 shadow-sm"
            : "border-base-300 hover:border-base-content/30"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-base-content/40" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, brands, categories…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40 min-w-0"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); }}
            className="text-base-content/40 hover:text-base-content transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden">
          {suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-base-content/40">
              {debouncedQuery !== query ? (
                <span className="loading loading-dots loading-sm" />
              ) : (
                `No results for "${debouncedQuery}"`
              )}
            </div>
          ) : (
            <>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                  Products
                </span>
                <button
                  onClick={() => {
                    router.push(`/products?search=${encodeURIComponent(debouncedQuery)}`);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  See all results
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-base-200 pb-2">
                {suggestions.map((p) => {
                  const finalPrice = discountedPrice(p.price, p.discount);
                  return (
                    <li key={p._id}>
                      <button
                        onClick={() => handleSelect(p._id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 transition-colors text-left"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-base-200 shrink-0 border border-base-300">
                          <Image
                            src={
                              p.images?.[0] ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=60"
                            }
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-base-content line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-xs text-base-content/50">{p.brand}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-primary">
                            {formatPrice(finalPrice)}
                          </p>
                          {p.discount > 0 && (
                            <p className="text-xs text-base-content/40 line-through">
                              {formatPrice(p.price)}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  const { data: categoryTree = [] } = useQuery<CategoryTree[]>({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      const res = await api.get("/categories/tree");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await api.post("/auth/resend-verification", { email: user.email });
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Could not send email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-base-100/95 shadow-md backdrop-blur-md"
            : "bg-base-100 shadow-sm"
        )}
      >
        {/* ── Row 1: Logo + Search + Actions ─────────────────────────────── */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-xl font-black text-primary"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
            <span className="tracking-tight hidden sm:block">Deshio</span>
          </Link>

          {/* Search */}
          <SearchBox />

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            {/* Wishlist — only for logged-in users */}
            {user && (
              <Link
                href="/dashboard/wishlist"
                className="btn btn-ghost btn-sm btn-circle indicator"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
                {user.wishlist?.length > 0 && (
                  <span className="badge badge-secondary badge-xs indicator-item">
                    {user.wishlist.length > 99 ? "99+" : user.wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="btn btn-ghost btn-sm btn-circle indicator"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="badge badge-primary badge-xs indicator-item">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Auth — Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle avatar">
                    <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                      <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full object-cover" unoptimized />
                    </div>
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu menu-sm z-50 mt-3 w-52 rounded-xl bg-base-100 p-2 shadow-xl border border-base-300">
                    <li className="menu-title px-4 pt-2 pb-1">
                      <div>
                        <p className="font-semibold text-base-content truncate">{user.name}</p>
                        <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                      </div>
                    </li>
                    <div className="divider my-1" />
                    <li><Link href="/dashboard/profile"><User className="h-4 w-4" /> Profile</Link></li>
                    <li><Link href="/dashboard/orders"><Package className="h-4 w-4" /> My Orders</Link></li>
                    {user.role === "admin" && (
                      <li><Link href="/dashboard/admin"><LayoutDashboard className="h-4 w-4" /> Admin Panel</Link></li>
                    )}
                    <div className="divider my-1" />
                    <li><button onClick={handleLogout} className="text-error"><LogOut className="h-4 w-4" /> Logout</button></li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
                  <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                </>
              )}
            </div>

            {/* Hamburger — Mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn btn-ghost btn-sm btn-circle md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Row 2: Category mega menu ───────────────────────────────────── */}
        {/* NOTE: overflow must be visible so mega menu dropdowns are not clipped */}
        <div className="border-t border-base-200 bg-base-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Desktop — tab row, NO overflow:auto (would clip absolute dropdowns) */}
            <nav className="hidden md:flex items-center">
              <Link
                href="/products"
                className={cn(
                  "shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                  pathname === "/products"
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
                )}
              >
                All Products
              </Link>

              {categoryTree.map((cat) => (
                <div key={cat._id} className="group relative">
                  <Link
                    href={`/products?category=${cat._id}`}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                      "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
                    )}
                  >
                    {cat.name}
                    {(cat.children.length > 0 || cat.brands.length > 0) && (
                      <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180 duration-200" />
                    )}
                  </Link>
                  <MegaMenu cat={cat} />
                </div>
              ))}
            </nav>

            {/* Mobile — horizontal badge strip */}
            {/* <nav className="flex md:hidden items-center gap-2 overflow-x-auto py-2 scrollbar-none">
              <Link href="/products" className="shrink-0 badge badge-outline badge-md hover:badge-primary transition-colors">All</Link>
              {categoryTree.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat._id}`}
                  className="shrink-0 badge badge-outline badge-md hover:badge-primary transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </nav> */}
          </div>
        </div>
      </header>

      {/* ── Verification Banner ────────────────────────────────────────────── */}
      {user && !user.isVerified && !bannerDismissed && (
        <div className="bg-warning/15 border-b border-warning/30 px-4 py-2">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
              <span>
                Please verify your email to unlock order placement.
                <button
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="ml-2 underline font-medium hover:no-underline disabled:opacity-50"
                >
                  {resending ? "Sending…" : "Resend email"}
                </button>
              </span>
            </div>
            <button onClick={() => setBannerDismissed(true)} className="btn btn-ghost btn-xs btn-circle shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      <div className={cn("fixed inset-0 z-50 transition-all duration-300 md:hidden", drawerOpen ? "visible" : "invisible")}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={cn("absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300", drawerOpen ? "opacity-100" : "opacity-0")}
        />

        <div className={cn("absolute right-0 top-0 h-full w-72 bg-base-100 shadow-2xl transition-transform duration-300 ease-out flex flex-col", drawerOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
            <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 text-lg font-bold text-primary">
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} /> Deshio
            </Link>
            <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-sm btn-circle">
              <X className="h-5 w-5" />
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
              <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full ring ring-primary ring-offset-1" unoptimized />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-base-content/50 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <Link href="/products" onClick={() => setDrawerOpen(false)} className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors">
              All Products
            </Link>
            {categoryTree.map((cat) => (
              <Link key={cat._id} href={`/products?category=${cat._id}`} onClick={() => setDrawerOpen(false)} className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors">
                {cat.name}
              </Link>
            ))}

            {user && (
              <>
                <div className="divider text-xs text-base-content/40">My Account</div>
                <Link href="/dashboard/profile" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link href="/dashboard/orders" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors">
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                {user.role === "admin" && (
                  <Link href="/dashboard/admin" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="border-t border-base-300 px-5 py-4 space-y-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            )}
            {user ? (
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-sm flex-1">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link href="/register" onClick={() => setDrawerOpen(false)} className="btn btn-primary btn-sm flex-1">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
