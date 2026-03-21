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
    "book tax appointment Ontario",
    "tax4sure contact",
    "free tax advice Canada",
    "Ontario accountant consultation",
  ],
  alternates: {
    canonical: "https://www.tax4sure.ca/contact",
  },
  openGraph: {
    title: "Contact Tax4Sure — Free Tax Consultation in Ontario",
    description:
      "Book a free no-obligation consultation with Tax4Sure. Personal tax, corporate tax, GST/HST, business registration, CRA audit support and more.",
    url: "https://www.tax4sure.ca/contact",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Tax4Sure for a Free Tax Consultation",
      },
    ],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
