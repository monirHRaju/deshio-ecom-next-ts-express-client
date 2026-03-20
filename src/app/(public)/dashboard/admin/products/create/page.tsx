"use client";

import ProductForm, {
  FormPayload,
} from "@/components/admin/ProductForm";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateProductPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: FormPayload) => api.post("/products", payload),
    onSuccess: () => {
      toast.success("Product created!");
      router.push("/dashboard/admin/products");
    },
    onError: () => toast.error("Failed to create product"),
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
          <h2 className="font-bold text-base-content">Create Product</h2>
          <p className="text-xs text-base-content/50">
            Add a new product to the store
          </p>
        </div>
      </div>

      <ProductForm
        onSubmit={async (data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
        submitLabel="Create Product"
      />
    </div>
  );
}
