"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import { Heart, LayoutDashboard, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const sidebarLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col gap-1 w-52 shrink-0">
          <div className="flex items-center gap-3 px-3 py-4 mb-2">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.name} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-base-content/50 capitalize">{user.role}</p>
            </div>
          </div>

          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {user.role === "admin" && (
            <Link
              href="/dashboard/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/dashboard/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Admin Panel
            </Link>
          )}
        </aside>

        {/* Mobile tab strip */}
        <div className="flex md:hidden overflow-x-auto scrollbar-none gap-1 border-b border-base-300 pb-3 mb-1">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/60 hover:bg-base-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
