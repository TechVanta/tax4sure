import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const SITE_URL = "https://d8nnmu6vr11v0.cloudfront.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tax4Sure | Canadian Tax Filing, CPA & Accounting Services",
    template: "%s | Tax4Sure",
  },
  description:
    "Tax4Sure offers professional Canadian tax filing services — T1 personal returns, T2 corporate tax, GST/HST filing, bookkeeping, and year-round tax advisory. Fast, accurate, and secure.",
  keywords: [
    "Canadian tax filing",
    "tax return Canada",
    "T1 tax return",
    "T2 corporate tax",
    "GST HST filing",
    "bookkeeping Canada",
    "CPA tax services",
    "personal tax return Canada",
    "corporate tax filing Canada",
    "tax accountant Canada",
    "small business tax Canada",
    "self employed tax Canada",
    "tax preparation Canada",
    "income tax filing Canada",
    "online tax filing Canada",
    "Tax4Sure",
  ],
  authors: [{ name: "Tax4Sure", url: SITE_URL }],
  creator: "Tax4Sure",
  publisher: "Tax4Sure",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: "Tax4Sure",
    title: "Tax4Sure | Canadian Tax Filing, CPA & Accounting Services",
    description:
      "Professional Canadian tax services — T1, T2, GST/HST, bookkeeping & advisory. Secure online client portal. Fast, accurate, year-round support.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tax4Sure – Canadian Tax Filing & Accounting Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tax4Sure | Canadian Tax Filing, CPA & Accounting Services",
    description:
      "Professional Canadian tax services — T1, T2, GST/HST, bookkeeping & advisory. Secure online client portal.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  other: {
    "theme-color": "#0D1F4E",
    "msapplication-TileColor": "#0D1F4E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0D1F4E" />
        <meta name="msapplication-TileColor" content="#0D1F4E" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
