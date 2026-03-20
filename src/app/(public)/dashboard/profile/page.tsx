"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ?? "");

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    setValue,
    watch,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
      street: user?.address?.street ?? "",
      city: user?.address?.city ?? "",
      country: user?.address?.country ?? "",
      zip: user?.address?.zip ?? "",
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const avatarValue = watch("avatar");

  const regenerateAvatar = () => {
    const seed = Math.random().toString(36).slice(2, 8);
    const url = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
    setValue("avatar", url);
    setAvatarPreview(url);
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    setSavingProfile(true);
    try {
      const res = await api.patch("/users/me", {
        name: data.name,
        phone: data.phone || undefined,
        avatar: data.avatar || undefined,
        address: {
          street: data.street || undefined,
          city: data.city || undefined,
          country: data.country || undefined,
          zip: data.zip || undefined,
        },
      });
      updateUser(res.data.data);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setSavingPassword(true);
    try {
      await api.patch("/users/me", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      resetPassword();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black text-base-content">My Profile</h1>

      {/* ── Account Info (read-only) ────────────────────────────────────── */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-5">
        <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider mb-4">Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Role</p>
            <span className={`badge badge-sm ${user.role === "admin" ? "badge-warning" : "badge-info"}`}>
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Member since</p>
            <p className="font-medium">{joinDate}</p>
          </div>
          <div>
            <p className="text-base-content/50 text-xs mb-0.5">Email Verification</p>
            {user.isVerified ? (
              <span className="flex items-center gap-1.5 text-success text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-warning text-sm font-medium">
                <ShieldX className="w-4 h-4" /> Not verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Profile Form ────────────────────────────────────────────────── */}
      <form onSubmit={handleProfile(onProfileSubmit)}>
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-5">
          <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider">Personal Information</h2>

          {/* Avatar */}
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-base-300 bg-base-200 shrink-0">
              <Image
                src={avatarValue || avatarPreview || user.avatar}
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
                onError={() => setAvatarPreview(user.avatar)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="label pb-0.5"><span className="label-text text-xs font-medium">Avatar URL</span></label>
              <div className="flex gap-2">
                <input
                  {...regProfile("avatar")}
                  type="url"
                  placeholder="https://example.com/avatar.png"
                  className={`input input-bordered input-sm flex-1 ${profileErrors.avatar ? "input-error" : ""}`}
                  onChange={(e) => { regProfile("avatar").onChange(e); setAvatarPreview(e.target.value); }}
                />
                <button
                  type="button"
                  onClick={regenerateAvatar}
                  className="btn btn-ghost btn-sm btn-square"
                  title="Generate random avatar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              {profileErrors.avatar && <p className="text-error text-xs">{profileErrors.avatar.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1"><span className="label-text font-medium">Full Name</span></label>
              <input
                {...regProfile("name")}
                placeholder="John Doe"
                className={`input input-bordered w-full ${profileErrors.name ? "input-error" : ""}`}
              />
              {profileErrors.name && <p className="text-error text-xs mt-1">{profileErrors.name.message}</p>}
            </div>
            <div className="form-control">
              <label className="label pb-1"><span className="label-text font-medium">Phone</span></label>
              <input
                {...regProfile("phone")}
                type="tel"
                placeholder="+880 1700 000000"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-semibold text-base-content/70 mb-3">Address</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 form-control">
                <label className="label pb-1"><span className="label-text font-medium">Street</span></label>
                <input {...regProfile("street")} placeholder="House 12, Road 5, Dhanmondi" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text font-medium">City</span></label>
                <input {...regProfile("city")} placeholder="Dhaka" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text font-medium">Country</span></label>
                <input {...regProfile("country")} placeholder="Bangladesh" className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label pb-1"><span className="label-text font-medium">ZIP / Area Code</span></label>
                <input {...regProfile("zip")} placeholder="1207" className="input input-bordered w-full" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={savingProfile} className="btn btn-primary gap-2">
              {savingProfile ? <span className="loading loading-spinner loading-sm" /> : <Save className="w-4 h-4" />}
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* ── Change Password ─────────────────────────────────────────────── */}
      <form onSubmit={handlePassword(onPasswordSubmit)}>
        <div className="card bg-base-100 border border-base-300 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm text-base-content/50 uppercase tracking-wider">Change Password</h2>
          </div>

          <div className="space-y-4 max-w-sm">
            <div className="form-control">
              <label className="label pb-1"><span className="label-text font-medium">Current Password</span></label>
              <div className="relative">
                <input
                  {...regPassword("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  placeholder="Your current password"
                  className={`input input-bordered w-full pr-10 ${passwordErrors.currentPassword ? "input-error" : ""}`}
                />
                <button type="button" onClick={() => setShowCurrent((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && <p className="text-error text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
            </div>

            <div className="form-control">
              <label className="label pb-1"><span className="label-text font-medium">New Password</span></label>
              <div className="relative">
                <input
                  {...regPassword("newPassword")}
                  type={showNew ? "text" : "password"}
                  placeholder="At least 6 characters"
                  className={`input input-bordered w-full pr-10 ${passwordErrors.newPassword ? "input-error" : ""}`}
                />
                <button type="button" onClick={() => setShowNew((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="text-error text-xs mt-1">{passwordErrors.newPassword.message}</p>}
            </div>

            <div className="form-control">
              <label className="label pb-1"><span className="label-text font-medium">Confirm New Password</span></label>
              <input
                {...regPassword("confirmPassword")}
                type="password"
                placeholder="Repeat new password"
                className={`input input-bordered w-full ${passwordErrors.confirmPassword ? "input-error" : ""}`}
              />
              {passwordErrors.confirmPassword && <p className="text-error text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="pt-1">
            <button type="submit" disabled={savingPassword} className="btn btn-outline btn-primary gap-2">
              {savingPassword ? <span className="loading loading-spinner loading-sm" /> : <ShieldCheck className="w-4 h-4" />}
              {savingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
