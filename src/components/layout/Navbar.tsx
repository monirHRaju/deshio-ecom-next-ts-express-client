"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Package,
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
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-base-100/95 shadow-sm backdrop-blur-md"
            : "bg-base-100"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
            <span className="tracking-tight">Deshio</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="btn btn-ghost btn-sm btn-circle indicator"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {/* Badge will be populated in Module F7 */}
            </Link>

            {/* Auth — Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm btn-circle avatar"
                  >
                    <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu menu-sm z-50 mt-3 w-52 rounded-xl bg-base-100 p-2 shadow-xl border border-base-300"
                  >
                    <li className="menu-title px-4 pt-2 pb-1">
                      <div>
                        <p className="font-semibold text-base-content truncate">{user.name}</p>
                        <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                      </div>
                    </li>
                    <div className="divider my-1" />
                    <li>
                      <Link href="/dashboard/profile">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/orders">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                    </li>
                    {user.role === "admin" && (
                      <li>
                        <Link href="/dashboard/admin">
                          <LayoutDashboard className="h-4 w-4" /> Admin Panel
                        </Link>
                      </li>
                    )}
                    <div className="divider my-1" />
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost btn-sm">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — Mobile */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn btn-ghost btn-sm btn-circle md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300 md:hidden",
          drawerOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 bg-base-100 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
            drawerOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 text-lg font-bold text-primary"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
              Deshio
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full ring ring-primary ring-offset-1"
                unoptimized
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-base-content truncate">{user.name}</p>
                <p className="text-xs text-base-content/50 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Dashboard links for logged-in users */}
            {user && (
              <>
                <div className="divider text-xs text-base-content/40">My Account</div>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    </li>
                  )}
                </ul>
              </>
            )}
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-base-300 px-5 py-4 space-y-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-base-content/70 hover:bg-base-200 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="btn btn-ghost btn-sm flex-1"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setDrawerOpen(false)}
                  className="btn btn-primary btn-sm flex-1"
                >
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
