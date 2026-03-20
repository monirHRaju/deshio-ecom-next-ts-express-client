"use client";

import ProductForm, { FormPayload } from "@/components/admin/ProductForm";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      api
        .get<{ success: boolean; data: Product }>(`/products/${id}`)
        .then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (payload: FormPayload) =>
      api.patch(`/products/${id}`, payload),
    onSuccess: () => {
      toast.success("Product updated!");
      qc.invalidateQueries({ queryKey: ["product", id] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/dashboard/admin/products");
    },
    onError: () => toast.error("Failed to update product"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin/products"
          className="btn btn-ghost btn-sm gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div>
          <h2 className="font-bold text-base-content">Edit Product</h2>
          {product && (
            <p className="text-xs text-base-content/50 truncate max-w-xs">
              {product.title}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : product ? (
        <ProductForm
          defaultValues={product}
          onSubmit={async (data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
          submitLabel="Save Changes"
        />
      ) : (
        <div className="text-center py-16 text-base-content/40">
          Product not found
        </div>
      )}
    </div>
  );
}
