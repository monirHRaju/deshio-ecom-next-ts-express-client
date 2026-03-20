"use client";

import api from "@/lib/axios";
import {
  DashboardChartData,
  DashboardStats,
  MonthlyDataPoint,
  Order,
} from "@/types";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

function formatMonthLabel(p: MonthlyDataPoint) {
  return `${MONTHS[p._id.month - 1]} ${String(p._id.year).slice(2)}`;
}

const statCards = (stats: DashboardStats) => [
  {
    label: "Total Revenue",
    value: formatPrice(stats.totalRevenue),
    icon: DollarSign,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Total Orders",
    value: stats.totalOrders.toLocaleString(),
    icon: ShoppingCart,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Total Products",
    value: stats.totalProducts.toLocaleString(),
    icon: Package,
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    label: "Total Users",
    value: stats.totalUsers.toLocaleString(),
    icon: Users,
    color: "text-success",
    bg: "bg-success/10",
  },
];

const orderStatusBadge: Record<string, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-secondary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

export default function AdminOverviewPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () =>
      api
        .get<{ success: boolean; data: DashboardStats }>("/dashboard/stats")
        .then((r) => r.data.data),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["admin-charts"],
    queryFn: () =>
      api
        .get<{ success: boolean; data: DashboardChartData }>(
          "/dashboard/chart-data"
        )
        .then((r) => r.data.data),
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: () =>
      api
        .get<{ success: boolean; data: Order[] }>("/dashboard/recent-orders")
        .then((r) => r.data.data),
  });

  const monthlyChartData =
    chartData?.monthlyData.map((p) => ({
      name: formatMonthLabel(p),
      revenue: p.revenue,
      orders: p.orders,
    })) ?? [];

  const pieData =
    chartData?.ordersByStatus.map((p) => ({
      name: p._id,
      value: p.count,
      color: STATUS_COLORS[p._id] ?? "#94a3b8",
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border border-base-200 p-5">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      ) : statsData ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards(statsData).map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="card bg-base-100 border border-base-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-base-content/50 font-medium">
                    {label}
                  </p>
                  <p className="text-2xl font-black text-base-content mt-1">
                    {value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* ── Charts ── */}
      {chartLoading ? (
        <div className="grid lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border border-base-200 p-5">
              <div className="skeleton h-4 w-32 mb-4" />
              <div className="skeleton h-48 w-full" />
            </div>
          ))}
        </div>
      ) : chartData ? (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Revenue Line Chart */}
          <div className="lg:col-span-2 card bg-base-100 border border-base-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-base-content text-sm">
                Monthly Revenue
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(60.7% 0.213 238.04)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Pie */}
          <div className="card bg-base-100 border border-base-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-4 h-4 text-secondary" />
              <h3 className="font-bold text-base-content text-sm">
                Orders by Status
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [Number(v ?? 0), "Orders"]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span className="text-xs capitalize">{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Orders Bar Chart */}
          <div className="lg:col-span-3 card bg-base-100 border border-base-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-4 h-4 text-secondary" />
              <h3 className="font-bold text-base-content text-sm">
                Monthly Orders
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [Number(v ?? 0), "Orders"]} />
                <Bar
                  dataKey="orders"
                  fill="oklch(70.45% 0.187 47.6)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      {/* ── Recent Orders ── */}
      <div className="card bg-base-100 border border-base-200">
        <div className="p-5 border-b border-base-200 flex items-center justify-between">
          <h3 className="font-bold text-base-content flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Recent Orders
          </h3>
        </div>
        {ordersLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50">
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).map((order) => (
                  <tr key={order._id} className="hover:bg-base-200/50">
                    <td className="font-mono text-xs text-primary font-semibold">
                      {order.orderNumber}
                    </td>
                    <td className="text-sm">
                      {typeof order.userId === "object"
                        ? order.userId.name
                        : "—"}
                    </td>
                    <td className="text-xs text-base-content/60">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="text-sm">{order.items.length}</td>
                    <td className="font-semibold text-sm">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs ${
                          order.paymentStatus === "paid"
                            ? "badge-success"
                            : order.paymentStatus === "failed"
                            ? "badge-error"
                            : "badge-warning"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs capitalize ${
                          orderStatusBadge[order.orderStatus] ?? "badge-ghost"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!ordersLoading && !recentOrders?.length && (
              <p className="text-center py-8 text-base-content/40 text-sm">
                No recent orders
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
