"use client";

import {
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Track Order", href: "/track-order" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const categories = [
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Headphones", href: "/products?category=headphones" },
  { label: "Cameras", href: "/products?category=cameras" },
  { label: "Accessories", href: "/products?category=accessories" },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <img src="/deshio_logo.svg" alt="Deshio" className="h-25" />
            </Link>
            <p className="text-sm leading-relaxed text-base-content/60">
              Your one-stop destination for the latest electronics and tech
              gadgets. Quality products at unbeatable prices.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-base-300 text-base-content/60 transition-all hover:bg-primary hover:text-white hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-base-content">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-base-content">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-base-content/60 transition-colors hover:text-primary"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-base-content">
              Stay Connected
            </h3>

            {/* Contact Info */}
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-base-content/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                123 Tech Street, Silicon Valley, CA
              </li>
              <li className="flex items-center gap-2.5 text-sm text-base-content/60">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +1 (555) 000-1234
              </li>
              <li className="flex items-center gap-2.5 text-sm text-base-content/60">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                hello@deshio.com
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="mb-2 text-xs text-base-content/50">
                Subscribe for deals & updates
              </p>
              {subscribed ? (
                <div className="rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-medium text-primary">
                  Thanks for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input input-sm input-bordered flex-1 min-w-0 focus:input-primary"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm btn-square"
                    aria-label="Subscribe"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 py-5 sm:flex-row">
          <p className="text-xs text-base-content/50">
            &copy; {new Date().getFullYear()} Deshio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-base-content/50 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-base-content/50 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
