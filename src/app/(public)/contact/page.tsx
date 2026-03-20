"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver } from "react-hook-form";
import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(4, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const infoCards = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@deshio.com",
    sub: "We reply within 24 hours",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (555) 000-1234",
    sub: "Mon – Fri, 9 am – 6 pm PST",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Tech Street",
    sub: "Silicon Valley, CA 94025",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24 / 7",
    sub: "Live chat always available",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–7 business days. Express (1–2 days) is available at checkout.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day hassle-free returns policy on all items. Start a return from your dashboard.",
  },
  {
    q: "Are all products genuine?",
    a: "Absolutely. We source directly from authorised distributors and certified brand partners.",
  },
  {
    q: "Can I track my order?",
    a: "Yes! Use the Track Order page or check your dashboard for real-time tracking updates.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_data: unknown) {
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    reset();
  }

  return (
    <div className="bg-base-100">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 page-hero-bg" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 badge badge-primary badge-lg px-4 py-3 mb-6">
            <MessageSquare className="w-4 h-4" />
            We&apos;d love to hear from you
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content leading-tight mb-4">
            Get in <span className="text-primary">touch</span>
          </h1>
          <p className="text-base-content/60 text-lg">
            Have a question, suggestion, or just want to say hello? Fill out
            the form below — our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Info Cards ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 -mt-4 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div
              key={label}
              className="card bg-base-100 border border-base-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-xs text-base-content/50 font-medium mb-1">
                {label}
              </p>
              <p className="font-bold text-base-content text-sm">{value}</p>
              <p className="text-xs text-base-content/40 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + FAQ ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="card bg-base-100 border border-base-200 p-8">
            <h2 className="text-xl font-black text-base-content mb-6">
              Send us a message
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-bold text-xl text-base-content">
                  Message sent!
                </h3>
                <p className="text-base-content/60 text-sm max-w-xs">
                  Thanks for reaching out. We&apos;ll reply to your email
                  within 24 hours.
                </p>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => setSubmitted(false)}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label pb-1">
                      <span className="label-text text-sm font-medium">
                        Your Name
                      </span>
                    </label>
                    <input
                      {...register("name")}
                      className="input input-bordered w-full input-sm"
                      placeholder="Alex Rivera"
                    />
                    {errors.name && (
                      <p className="text-error text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label pb-1">
                      <span className="label-text text-sm font-medium">
                        Email Address
                      </span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="input input-bordered w-full input-sm"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-error text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Subject
                    </span>
                  </label>
                  <input
                    {...register("subject")}
                    className="input input-bordered w-full input-sm"
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="text-error text-xs mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Message
                    </span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    className="textarea textarea-bordered w-full text-sm"
                    placeholder="Tell us what's on your mind…"
                  />
                  {errors.message && (
                    <p className="text-error text-xs mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full gap-2"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-base-content">
              Frequently asked questions
            </h2>
            <p className="text-sm text-base-content/50">
              Quick answers to the questions we hear most.
            </p>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  className="card bg-base-100 border border-base-200 p-5"
                >
                  <h4 className="font-semibold text-base-content text-sm mb-1.5">
                    {q}
                  </h4>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {a}
                  </p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="card bg-base-200 border border-base-300 overflow-hidden h-48 flex items-center justify-center mt-2">
              <div className="text-center space-y-2">
                <MapPin className="w-8 h-8 text-primary mx-auto opacity-60" />
                <p className="text-sm text-base-content/50">
                  123 Tech Street, Silicon Valley, CA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
