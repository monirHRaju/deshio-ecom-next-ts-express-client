"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

const schema = z.object({
  email: z.email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: FormData) => {
    try {
      await api.post("/auth/forgot-password", { email });
      setSentTo(email);
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-2xl border border-base-200">
          <div className="card-body p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-black text-base-content">Check your inbox</h2>
            <p className="text-base-content/60 mt-2 text-sm">
              We sent a reset link to{" "}
              <span className="font-semibold text-base-content">{sentTo}</span>.
              It expires in 1 hour.
            </p>
            <Link href="/login" className="btn btn-primary mt-6">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-base-content">Forgot password?</h1>
            <p className="text-sm text-base-content/50 mt-1">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                autoComplete="email"
              />
              {errors.email && (
                <label className="label py-1">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-2">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-base-content/50 hover:text-base-content mt-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
