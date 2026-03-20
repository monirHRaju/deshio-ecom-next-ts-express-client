import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Deshio team. We reply within 24 hours. Find our email, phone, and office address.",
  openGraph: {
    title: "Contact Deshio",
    description:
      "Questions, feedback, or support — our team is here to help.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
