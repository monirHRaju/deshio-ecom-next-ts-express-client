"use client";

import api from "@/lib/axios";
import { ApiResponse, Meta, User } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Shield, Trash2, UserIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () =>
      api
        .get<ApiResponse<User[]> & { meta: Meta }>("/users", {
          params: { search, page, limit: 10 },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-bold text-base-content flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-primary" />
          Users
          {meta && (
            <span className="badge badge-ghost badge-sm ml-1">
              {meta.total}
            </span>
          )}
        </h2>
        <label className="input input-sm input-bordered flex items-center gap-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="grow"
          />
        </label>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50 bg-base-200/50">
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/30">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={user.avatar} alt={user.name} />
                          </div>
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {user.email}
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs capitalize ${
                          user.role === "admin"
                            ? "badge-primary"
                            : "badge-ghost"
                        }`}
                      >
                        {user.role === "admin" && (
                          <Shield className="w-2.5 h-2.5 mr-0.5" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs ${
                          user.isVerified ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/50">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        onClick={() => setDeleteTarget(user)}
                        disabled={user.role === "admin"}
                        title={
                          user.role === "admin"
                            ? "Cannot delete admin"
                            : "Delete user"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && users.length === 0 && (
              <p className="text-center py-10 text-base-content/40 text-sm">
                No users found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            className="btn btn-sm btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
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
            <h3 className="font-bold text-lg">Delete User</h3>
            <p className="py-4 text-base-content/70">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-base-content">
                {deleteTarget.name}
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
