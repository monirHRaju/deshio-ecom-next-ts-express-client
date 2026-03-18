"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  return (
    <section className="py-16 bg-base-200/40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Header */}
          <div className="badge badge-primary badge-lg mb-4 px-4 py-3 font-semibold">
            Newsletter
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-base-content mb-3">
            Stay in the{" "}
            <span className="text-primary">Loop</span>
          </h2>
          <p className="text-base-content/60 mb-8 max-w-md mx-auto">
            Subscribe for exclusive deals, new arrivals, and tech news delivered
            straight to your inbox. No spam — ever.
          </p>

          {status === "success" ? (
            /* Success State */
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-base-content text-lg">
                  You're subscribed!
                </h3>
                <p className="text-base-content/60 text-sm mt-1">
                  Welcome aboard. Check your inbox for a confirmation email.
                </p>
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="btn btn-ghost btn-sm"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your email address"
                    className={`input input-bordered w-full pl-12 focus:input-primary ${
                      status === "error" ? "input-error" : ""
                    }`}
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary gap-2 min-w-36"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>

              {/* Error message */}
              {status === "error" && errorMsg && (
                <p className="text-error text-sm text-left flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorMsg}
                </p>
              )}

              <p className="text-xs text-base-content/40">
                By subscribing, you agree to our{" "}
                <a href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </a>
                . Unsubscribe at any time.
              </p>
            </form>
          )}

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {["Alice", "Bob", "Carol", "Dave"].map((name) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={name}
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`}
                  alt={name}
                  className="w-8 h-8 rounded-full border-2 border-base-100 bg-base-200"
                />
              ))}
            </div>
            <p className="text-sm text-base-content/60">
              Join <span className="font-bold text-primary">8,500+</span>{" "}
              subscribers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
