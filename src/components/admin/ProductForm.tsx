"use client";

import AIDescriptionGenerator from "@/components/ai/AIDescriptionGenerator";
import api from "@/lib/axios";
import { Category, Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be > 0"),
  discount: z.number().min(0).max(100),
  stock: z.number().int().min(0),
  isFeatured: z.boolean(),
  images: z
    .array(z.object({ url: z.string().url("Must be a valid URL") }))
    .min(1, "At least one image URL required"),
  tags: z.string(),
  specKeys: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Product>;
  onSubmit: (data: FormPayload) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export interface FormPayload {
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  isFeatured: boolean;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: Props) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      api
        .get<{ success: boolean; data: Category[] }>("/categories")
        .then((r) => r.data.data),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      brand: defaultValues?.brand ?? "",
      category:
        typeof defaultValues?.category === "object"
          ? (defaultValues.category as Category)._id
          : (defaultValues?.category ?? ""),
      price: defaultValues?.price ?? 0,
      discount: defaultValues?.discount ?? 0,
      stock: defaultValues?.stock ?? 0,
      isFeatured: defaultValues?.isFeatured ?? false,
      images:
        defaultValues?.images?.map((url) => ({ url })) ?? [{ url: "" }],
      tags: defaultValues?.tags?.join(", ") ?? "",
      specKeys: defaultValues?.specifications
        ? Object.entries(defaultValues.specifications).map(([key, value]) => ({
            key,
            value,
          }))
        : [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specKeys" });

  const watchedTitle = watch("title");
  const watchedCategory = watch("category");
  const watchedBrand = watch("brand");
  const watchedSpecs = watch("specKeys");

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const cat = categories?.find((c) => c._id === watchedCategory);
    setCategoryName(cat?.name ?? "");
  }, [watchedCategory, categories]);

  function handleDescriptionGenerated(desc: string) {
    setValue("description", desc, { shouldValidate: true });
  }

  function handleTagsGenerated(tags: string[]) {
    setValue("tags", tags.join(", "), { shouldValidate: true });
  }

  async function handleFormSubmit(values: FormValues) {
    const payload: FormPayload = {
      title: values.title,
      description: values.description,
      brand: values.brand,
      category: values.category,
      price: values.price,
      discount: values.discount,
      stock: values.stock,
      isFeatured: values.isFeatured,
      images: values.images.map((i) => i.url).filter(Boolean),
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      specifications: Object.fromEntries(
        values.specKeys
          .filter((s) => s.key.trim())
          .map((s) => [s.key.trim(), s.value.trim()])
      ),
    };
    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="card bg-base-100 border border-base-200 p-5 space-y-4">
        <h3 className="font-bold text-base-content">Basic Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Title *</span>
            </label>
            <input
              {...register("title")}
              className="input input-bordered w-full input-sm"
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-error text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Brand *</span>
            </label>
            <input
              {...register("brand")}
              className="input input-bordered w-full input-sm"
              placeholder="e.g. Samsung"
            />
            {errors.brand && (
              <p className="text-error text-xs mt-1">{errors.brand.message}</p>
            )}
          </div>

          <div>
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Category *
              </span>
            </label>
            <select
              {...register("category")}
              className="select select-bordered w-full select-sm"
            >
              <option value="">Select category…</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* AI Generators */}
        <div className="pt-1">
          <p className="text-xs text-base-content/50 mb-2">
            AI Generate:
          </p>
          <AIDescriptionGenerator
            title={watchedTitle}
            category={categoryName}
            brand={watchedBrand}
            specs={watchedSpecs
              .filter((s) => s.key)
              .map((s) => `${s.key}: ${s.value}`)}
            onDescriptionGenerated={handleDescriptionGenerated}
            onTagsGenerated={handleTagsGenerated}
          />
        </div>

        <div>
          <label className="label pb-1">
            <span className="label-text text-sm font-medium">
              Description *
            </span>
          </label>
          <textarea
            {...register("description")}
            rows={6}
            className="textarea textarea-bordered w-full text-sm"
            placeholder="Product description…"
          />
          {errors.description && (
            <p className="text-error text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="card bg-base-100 border border-base-200 p-5 space-y-4">
        <h3 className="font-bold text-base-content">Pricing &amp; Inventory</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Price ($) *</span>
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="input input-bordered w-full input-sm"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-error text-xs mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">
                Discount (%)
              </span>
            </label>
            <input
              {...register("discount", { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              className="input input-bordered w-full input-sm"
              placeholder="0"
            />
            {errors.discount && (
              <p className="text-error text-xs mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>
          <div>
            <label className="label pb-1">
              <span className="label-text text-sm font-medium">Stock *</span>
            </label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              min="0"
              className="input input-bordered w-full input-sm"
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-error text-xs mt-1">{errors.stock.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-end pb-1">
            <label className="label cursor-pointer justify-start gap-3 pb-0">
              <input
                {...register("isFeatured")}
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="label-text text-sm font-medium">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="card bg-base-100 border border-base-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base-content">Images</h3>
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1 text-primary"
            onClick={() => appendImage({ url: "" })}
          >
            <Plus className="w-3.5 h-3.5" />
            Add URL
          </button>
        </div>
        {errors.images?.root && (
          <p className="text-error text-xs">{errors.images.root.message}</p>
        )}
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`images.${index}.url`)}
              className="input input-bordered input-sm flex-1"
              placeholder="https://example.com/image.jpg"
            />
            {imageFields.length > 1 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square text-error"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {errors.images?.map &&
          errors.images.map(
            (err, i) =>
              err?.url && (
                <p key={i} className="text-error text-xs">
                  Image {i + 1}: {err.url.message}
                </p>
              )
          )}
      </div>

      {/* Tags */}
      <div className="card bg-base-100 border border-base-200 p-5 space-y-3">
        <h3 className="font-bold text-base-content">Tags</h3>
        <div>
          <input
            {...register("tags")}
            className="input input-bordered w-full input-sm"
            placeholder="e.g. wireless, bluetooth, audio (comma-separated)"
          />
          <p className="text-xs text-base-content/40 mt-1">
            Separate tags with commas
          </p>
        </div>
      </div>

      {/* Specifications */}
      <div className="card bg-base-100 border border-base-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base-content">Specifications</h3>
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1 text-primary"
            onClick={() => appendSpec({ key: "", value: "" })}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Spec
          </button>
        </div>
        {specFields.length === 0 && (
          <p className="text-xs text-base-content/40">
            No specifications added yet
          </p>
        )}
        {specFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`specKeys.${index}.key`)}
              className="input input-bordered input-sm w-36 shrink-0"
              placeholder="Key (e.g. Weight)"
            />
            <input
              {...register(`specKeys.${index}.value`)}
              className="input input-bordered input-sm flex-1"
              placeholder="Value (e.g. 250g)"
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square text-error"
              onClick={() => removeSpec(index)}
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
