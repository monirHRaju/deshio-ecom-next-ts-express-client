"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import api from "@/lib/axios";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }
    api
      .get(`/auth/verify-email?token=${token}`)
      .then((res) => { setMessage(res.data.message); setStatus("success"); })
      .catch((err) => {
        setMessage(err?.response?.data?.message || "Verification failed. The link may have expired.");
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="card bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body p-8 sm:p-10 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-base-content">Verifying your email…</h2>
            </>
          )}
          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-black text-base-content">Email verified!</h2>
              <p className="text-base-content/60 text-sm mt-2">{message}</p>
              <Link href="/" className="btn btn-primary mt-6">Start Shopping</Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mx-auto mb-4">
                <XCircle className="w-8 h-8 text-error" />
              </div>
              <h2 className="text-2xl font-black text-base-content">Verification failed</h2>
              <p className="text-base-content/60 text-sm mt-2">{message}</p>
              <Link href="/login" className="btn btn-primary mt-6">Back to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
