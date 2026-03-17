import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Deshio — Modern Electronics Store",
    template: "%s | Deshio",
  },
  description:
    "Discover the latest electronics, gadgets, and tech accessories at unbeatable prices.",
  keywords: ["electronics", "gadgets", "smartphones", "laptops", "ecommerce"],
  openGraph: {
    title: "Deshio — Modern Electronics Store",
    description: "Discover the latest electronics at unbeatable prices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
