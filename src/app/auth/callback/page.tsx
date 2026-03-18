"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (error) {
      const messages: Record<string, string> = {
        google_not_configured: "Google login is not configured yet.",
        google_failed: "Google login failed. Please try again.",
        facebook_not_configured: "Facebook login is not configured yet.",
        facebook_failed: "Facebook login failed. Please try again.",
      };
      toast.error(messages[error] || "Social login failed.");
      router.replace("/login");
      return;
    }

    if (!accessToken || !refreshToken) {
      toast.error("Authentication failed. Please try again.");
      router.replace("/login");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    api
      .get("/users/me")
      .then((res) => {
        login(accessToken, refreshToken, res.data.data);
        toast.success(`Welcome, ${res.data.data.name}!`);
        router.replace("/");
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Could not load your profile. Please try again.");
        router.replace("/login");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-base-content/60 font-medium">Completing sign-in…</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
