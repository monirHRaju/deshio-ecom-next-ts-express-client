"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-error font-medium">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="btn btn-primary mt-4">Request a new link</Link>
      </div>
    );
  }

  const onSubmit = async ({ password }: FormData) => {
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed. Link may have expired.");
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-2xl border border-base-200">
          <div className="card-body p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-black text-base-content">Password updated!</h2>
            <p className="text-base-content/60 text-sm mt-2">
              Your password has been reset. You can now sign in.
            </p>
            <Link href="/login" className="btn btn-primary mt-6">Sign In</Link>
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
              <KeyRound className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-base-content">Set new password</h1>
            <p className="text-sm text-base-content/50 mt-1">Must be at least 6 characters.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">New Password</span></label>
              <div className="relative">
                <input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <label className="label py-1"><span className="label-text-alt text-error">{errors.password.message}</span></label>}
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-medium">Confirm Password</span></label>
              <div className="relative">
                <input {...register("confirmPassword")} type={showCf ? "text" : "password"} placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? "input-error" : ""}`} />
                <button type="button" onClick={() => setShowCf(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors">
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <label className="label py-1"><span className="label-text-alt text-error">{errors.confirmPassword.message}</span></label>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
