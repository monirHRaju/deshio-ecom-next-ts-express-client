"use client";

import api from "@/lib/axios";
import { ApiResponse, Category, Meta, Product } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, page],
    queryFn: () =>
      api
        .get<ApiResponse<Product[]> & { meta: Meta }>("/products", {
          params: { search, page, limit: 10 },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-bold text-base-content flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Products
          {meta && (
            <span className="badge badge-ghost badge-sm ml-1">
              {meta.total}
            </span>
          )}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <label className="input input-sm input-bordered flex items-center gap-2 flex-1 sm:w-64">
            <Search className="w-4 h-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="grow"
            />
          </label>
          <Link
            href="/dashboard/admin/products/create"
            className="btn btn-primary btn-sm gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50 bg-base-200/50">
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Sold</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-base-200/30">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-200 shrink-0">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-base-content/30" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate max-w-40">
                            {product.title}
                          </p>
                          <p className="text-xs text-base-content/50">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {typeof product.category === "object"
                        ? (product.category as Category).name
                        : "—"}
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold text-sm">
                          {formatPrice(
                            product.price * (1 - product.discount / 100)
                          )}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-base-content/40 line-through ml-1">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs ${
                          product.stock === 0
                            ? "badge-error"
                            : product.stock < 10
                            ? "badge-warning"
                            : "badge-success"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        {product.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-sm">{product.sold}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/admin/products/${product._id}/edit`}
                          className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && products.length === 0 && (
              <p className="text-center py-10 text-base-content/40 text-sm">
                No products found
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
          {Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                className={`btn btn-sm ${
                  p === page ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className="btn btn-sm btn-ghost"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Delete Product</h3>
            <p className="py-4 text-base-content/70">
              Delete{" "}
              <span className="font-semibold text-base-content">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => deleteMutation.mutate(deleteTarget._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setDeleteTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
