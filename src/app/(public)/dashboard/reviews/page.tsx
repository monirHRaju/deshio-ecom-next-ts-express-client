"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Review } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  MessageSquare,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedReview extends Omit<Review, "productId"> {
  productId: {
    _id: string;
    title: string;
    images: string[];
  };
}

// ─── Star Rating Picker ───────────────────────────────────────────────────────

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hover || value)
                ? "fill-secondary text-secondary"
                : "fill-base-300 text-base-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

function EditForm({
  review,
  onDone,
}: {
  review: PopulatedReview;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => api.patch(`/reviews/${review._id}`, { rating, comment }),
    onSuccess: () => {
      toast.success("Review updated!");
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      onDone();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update review"),
  });

  return (
    <div className="mt-3 space-y-3 border-t border-base-200 pt-3">
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={500}
        className="textarea textarea-bordered w-full text-sm resize-none"
        placeholder="Update your review…"
      />
      <div className="flex gap-2">
        <button
          onClick={() => save()}
          disabled={isPending || !comment.trim() || rating === 0}
          className="btn btn-primary btn-sm gap-1.5"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save
        </button>
        <button onClick={onDone} className="btn btn-ghost btn-sm gap-1.5">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery<PopulatedReview[]>({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const res = await api.get("/reviews/my");
      return res.data.data ?? [];
    },
    enabled: !!user,
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete review"),
  });

  const confirmDelete = (id: string) => {
    if (confirm("Delete this review? This cannot be undone.")) {
      deleteReview(id);
    }
  };

  // ── Loading skeletons ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-36 rounded-lg bg-base-200 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-base-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black">
        My Reviews
        {reviews.length > 0 && (
          <span className="text-base-content/40 font-normal text-base ml-2">
            ({reviews.length})
          </span>
        )}
      </h1>

      {/* Empty state */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <MessageSquare className="w-14 h-14 text-base-content/20" />
          <p className="font-semibold text-base-content/50">No reviews yet</p>
          <p className="text-sm text-base-content/40">
            Purchase products and share your experience!
          </p>
          <Link href="/products" className="btn btn-primary btn-sm">
            Browse Products
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => {
            const product = review.productId;
            const isEditing = editingId === review._id;
            const date = new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <li
                key={review._id}
                className="card bg-base-100 border border-base-300 shadow-sm p-4"
              >
                <div className="flex gap-3">
                  {/* Product thumbnail */}
                  <Link
                    href={`/products/${product._id}`}
                    className="shrink-0"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-base-200 border border-base-200">
                      <Image
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=60"
                        }
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    </div>
                  </Link>

                  {/* Review body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product._id}`}
                        className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors"
                      >
                        {product.title}
                      </Link>

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setEditingId(review._id)}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Edit review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(review._id)}
                            className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                            title="Delete review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stars + date */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= review.rating
                                ? "fill-secondary text-secondary"
                                : "fill-base-300 text-base-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-base-content/40">{date}</span>
                    </div>

                    {/* Comment */}
                    {!isEditing && (
                      <p className="text-sm text-base-content/70 mt-1.5 leading-relaxed">
                        {review.comment}
                      </p>
                    )}

                    {/* Edit form */}
                    {isEditing && (
                      <EditForm
                        review={review}
                        onDone={() => setEditingId(null)}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
