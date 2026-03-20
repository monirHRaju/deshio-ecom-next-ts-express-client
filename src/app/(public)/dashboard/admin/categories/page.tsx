"use client";

import api from "@/lib/axios";
import { Category } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  parentCategory: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type ModalMode = "create" | "edit";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () =>
      api
        .get<{ success: boolean; data: Category[] }>("/categories")
        .then((r) => r.data.data),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (modalOpen) {
      if (mode === "edit" && editTarget) {
        reset({
          name: editTarget.name,
          description: editTarget.description ?? "",
          image: editTarget.image ?? "",
          parentCategory:
            typeof editTarget.parentCategory === "object"
              ? (editTarget.parentCategory as Category)._id
              : (editTarget.parentCategory ?? ""),
        });
      } else {
        reset({ name: "", description: "", image: "", parentCategory: "" });
      }
    }
  }, [modalOpen, mode, editTarget, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) =>
      api.post("/categories", {
        ...data,
        parentCategory: data.parentCategory || undefined,
        image: data.image || undefined,
      }),
    onSuccess: () => {
      toast.success("Category created");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CategoryFormValues;
    }) =>
      api.patch(`/categories/${id}`, {
        ...data,
        parentCategory: data.parentCategory || undefined,
        image: data.image || undefined,
      }),
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete category"),
  });

  function openCreate() {
    setMode("create");
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setMode("edit");
    setEditTarget(cat);
    setModalOpen(true);
  }

  function onFormSubmit(data: CategoryFormValues) {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (editTarget) {
      updateMutation.mutate({ id: editTarget._id, data });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base-content flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          Categories
          {categories && (
            <span className="badge badge-ghost badge-sm ml-1">
              {categories.length}
            </span>
          )}
        </h2>
        <button
          className="btn btn-primary btn-sm gap-1"
          onClick={openCreate}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs text-base-content/50 bg-base-200/50">
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(categories ?? []).map((cat) => (
                  <tr key={cat._id} className="hover:bg-base-200/30">
                    <td>
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-base-200 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-base-content/40 truncate max-w-40">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-base-content/50">
                      {cat.slug}
                    </td>
                    <td className="text-sm text-base-content/60">
                      {typeof cat.parentCategory === "object"
                        ? (cat.parentCategory as Category).name
                        : cat.parentCategory
                        ? "—"
                        : (
                          <span className="badge badge-ghost badge-xs">
                            Root
                          </span>
                        )}
                    </td>
                    <td className="text-xs text-base-content/50">
                      {formatDate(cat.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                          onClick={() => openEdit(cat)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && !categories?.length && (
              <p className="text-center py-10 text-base-content/40 text-sm">
                No categories yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                {mode === "create" ? "Add Category" : "Edit Category"}
              </h3>
              <button
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm font-medium">
                    Name *
                  </span>
                </label>
                <input
                  {...register("name")}
                  className="input input-bordered w-full input-sm"
                  placeholder="Category name"
                />
                {errors.name && (
                  <p className="text-error text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm font-medium">
                    Description
                  </span>
                </label>
                <textarea
                  {...register("description")}
                  rows={2}
                  className="textarea textarea-bordered w-full text-sm"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm font-medium">
                    Image URL
                  </span>
                </label>
                <input
                  {...register("image")}
                  className="input input-bordered w-full input-sm"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-error text-xs mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label pb-1">
                  <span className="label-text text-sm font-medium">
                    Parent Category
                  </span>
                </label>
                <select
                  {...register("parentCategory")}
                  className="select select-bordered w-full select-sm"
                >
                  <option value="">None (root category)</option>
                  {categories
                    ?.filter((c) => c._id !== editTarget?._id)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal-action mt-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : null}
                  {mode === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setModalOpen(false)}
          />
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Delete Category</h3>
            <p className="py-4 text-base-content/70">
              Delete{" "}
              <span className="font-semibold text-base-content">
                {deleteTarget.name}
              </span>
              ? Products in this category may be affected.
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
