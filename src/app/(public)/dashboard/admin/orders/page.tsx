"use client";

import api from "@/lib/axios";
import { ApiResponse, Meta, Order, OrderStatus } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusBadge: Record<OrderStatus, string> = {
  pending: "badge-warning",
  processing: "badge-info",
  shipped: "badge-secondary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", search, page, statusFilter],
    queryFn: () =>
      api
        .get<ApiResponse<Order[]> & { meta: Meta }>("/orders", {
          params: {
            search,
            page,
            limit: 12,
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      orderStatus,
    }: {
      id: string;
      orderStatus: OrderStatus;
    }) => api.patch(`/orders/${id}/status`, { orderStatus }),
    onSuccess: () => {
      toast.success("Order status updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-bold text-base-content flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          Orders
          {meta && (
            <span className="badge badge-ghost badge-sm ml-1">
              {meta.total}
            </span>
          )}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="select select-sm select-bordered"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <label className="input input-sm input-bordered flex items-center gap-2 flex-1 sm:w-56">
            <Search className="w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Order # or customer…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="grow"
            />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50 bg-base-200/50">
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
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-base-200/30">
                    <td className="font-mono text-xs text-primary font-semibold">
                      {order.orderNumber}
                    </td>
                    <td className="text-sm">
                      <div>
                        <p className="font-medium">
                          {typeof order.userId === "object"
                            ? order.userId.name
                            : "—"}
                        </p>
                        {typeof order.userId === "object" && (
                          <p className="text-xs text-base-content/40">
                            {order.userId.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="text-sm">{order.items.length} item(s)</td>
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
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: order._id,
                            orderStatus: e.target.value as OrderStatus,
                          })
                        }
                        className={`select select-xs border-0 font-semibold capitalize px-1 ${
                          statusBadge[order.orderStatus] ?? ""
                        }`}
                        style={{ minWidth: 110 }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s} className="font-normal">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && orders.length === 0 && (
              <p className="text-center py-10 text-base-content/40 text-sm">
                No orders found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            className="btn btn-sm btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from(
            { length: Math.min(meta.totalPages, 10) },
            (_, i) => i + 1
          ).map((p) => (
            <button
              key={p}
              className={`btn btn-sm ${
                p === page ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="btn btn-sm btn-ghost"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
