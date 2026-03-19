"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Star, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Review } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  productId: string;
  rating: number;
  reviewCount: number;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors",
              s <= (hover || value) ? "fill-secondary text-secondary" : "fill-base-300 text-base-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-base-content/60">{star}</span>
      <Star className="w-3.5 h-3.5 fill-secondary text-secondary shrink-0" />
      <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-base-content/40 text-xs">{pct}%</span>
    </div>
  );
}

// ─── AI Summary Card ──────────────────────────────────────────────────────────
function AISummaryCard({ summary, onClose }: { summary: string; onClose: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-violet-400/30 bg-gradient-to-br from-violet-500/10 via-base-100 to-primary/5 p-5 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 btn btn-ghost btn-xs btn-circle"
        aria-label="Close summary"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20">
          <Sparkles className="w-4 h-4 text-violet-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-base-content">AI Review Summary</p>
          <p className="text-xs text-base-content/40">Powered by Gemini AI</p>
        </div>
      </div>

      <p className="text-sm text-base-content/80 leading-relaxed">{summary}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewSection({ productId, rating, reviewCount }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get(`/reviews/product/${productId}`);
      return res.data.data;
    },
  });

  const { mutate: addReview, isPending } = useMutation({
    mutationFn: () => api.post("/reviews", { productId, rating: newRating, comment }),
    onSuccess: () => {
      toast.success("Review submitted!");
      setNewRating(0);
      setComment("");
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
      qc.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to submit review"),
  });

  const { mutate: generateSummary, isPending: summaryLoading } = useMutation({
    mutationFn: () => api.post("/ai/summarize-reviews", { productId }),
    onSuccess: (res) => setAiSummary(res.data.data.summary),
    onError: (err: any) => {
      const msg = err?.response?.data?.debug || err?.response?.data?.message || "Could not generate summary. Please try again.";
      toast.error(msg);
    },
  });

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const alreadyReviewed =
    user &&
    reviews.some(
      (r) => (typeof r.userId === "object" ? (r.userId as any)._id : r.userId) === user._id
    );

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-black text-base-content">Customer Reviews</h2>

      {/* Rating summary + AI button */}
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Overall score */}
        <div className="text-center shrink-0">
          <p className="text-6xl font-black text-base-content">{rating.toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "w-4 h-4",
                  s <= Math.round(rating) ? "fill-secondary text-secondary" : "fill-base-300 text-base-300"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-base-content/50">{reviewCount} reviews</p>

          {/* AI Summary button */}
          <button
            onClick={() => {
              if (aiSummary) { setAiSummary(null); return; }
              generateSummary();
            }}
            disabled={summaryLoading}
            className={cn(
              "btn btn-sm mt-3 gap-1.5 transition-all",
              aiSummary
                ? "btn-ghost border border-violet-400/40 text-violet-500"
                : "bg-violet-500/10 text-violet-600 border border-violet-400/30 hover:bg-violet-500/20"
            )}
          >
            {summaryLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {summaryLoading ? "Analyzing…" : aiSummary ? "Hide Summary" : "AI Summary"}
          </button>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 w-full space-y-1.5">
          {dist.map(({ star, count }) => (
            <RatingBar key={star} star={star} count={count} total={reviewCount} />
          ))}
        </div>
      </div>

      {/* AI Summary card */}
      {aiSummary && (
        <AISummaryCard summary={aiSummary} onClose={() => setAiSummary(null)} />
      )}

      {/* Add review */}
      {user && !alreadyReviewed && (
        <div className="card bg-base-200/50 border border-base-300 p-5 space-y-4">
          <h3 className="font-semibold text-base-content">Write a Review</h3>
          <StarPicker value={newRating} onChange={setNewRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product…"
            rows={3}
            className="textarea textarea-bordered w-full resize-none"
          />
          <button
            onClick={() => {
              if (!newRating) return toast.error("Please select a rating");
              if (!comment.trim()) return toast.error("Please write a comment");
              addReview();
            }}
            disabled={isPending}
            className="btn btn-primary btn-sm"
          >
            {isPending && <span className="loading loading-spinner loading-xs" />}
            Submit Review
          </button>
        </div>
      )}

      {alreadyReviewed && (
        <div className="alert alert-success text-sm">
          You&apos;ve already reviewed this product.
        </div>
      )}

      {!user && (
        <div className="alert bg-base-200 border border-base-300 text-sm">
          <span>
            Please{" "}
            <a href="/login" className="text-primary font-semibold hover:underline">
              sign in
            </a>{" "}
            to leave a review.
          </span>
        </div>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-base-300" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-24 bg-base-300 rounded" />
                  <div className="h-3 w-16 bg-base-300 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-base-300 rounded" />
              <div className="h-3 w-3/4 bg-base-300 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-base-content/50 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-5 divide-y divide-base-200">
          {reviews.map((review) => {
            const reviewer =
              typeof review.userId === "object" ? (review.userId as any) : null;
            return (
              <div key={review._id} className="pt-5 first:pt-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {reviewer?.avatar ? (
                      <img
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle2 className="w-9 h-9 text-base-content/30" />
                    )}
                    <div>
                      <p className="font-semibold text-sm text-base-content">
                        {reviewer?.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-3.5 h-3.5",
                          s <= review.rating
                            ? "fill-secondary text-secondary"
                            : "fill-base-300 text-base-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-base-content/80 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
