"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";
import {
  BarChart2,
  FolderOpen,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const adminNavLinks = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/admin/users", label: "Users", icon: Users, exact: false },
  {
    href: "/dashboard/admin/products",
    label: "Products",
    icon: Package,
    exact: false,
  },
  {
    href: "/dashboard/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    exact: false,
  },
  {
    href: "/dashboard/admin/categories",
    label: "Categories",
    icon: FolderOpen,
    exact: false,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/dashboard/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <BarChart2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-black text-base-content">Admin Panel</h1>
          <p className="text-xs text-base-content/50">
            Manage your store data
          </p>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-0 overflow-x-auto scrollbar-none border-b border-base-300">
        {adminNavLinks.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-300"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
}
