import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Tax4Sure — Free Tax & Business Consultation in Ontario",
  description:
    "Contact Tax4Sure for a free consultation on personal tax (T1), corporate tax (T2), GST/HST, corporation incorporation, Ontario business registration, CRA audit support, and more. We respond within one business day.",
  keywords: [
    "contact tax accountant Ontario",
    "free tax consultation Canada",
    "tax filing help Ontario",
    "corporation incorporation consultation",
    "business registration Ontario",
    "CRA audit help",
    "tax4sure contact",
  ],
  alternates: {
    canonical: "https://d8nnmu6vr11v0.cloudfront.net/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
