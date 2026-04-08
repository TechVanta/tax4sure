import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const SITE_URL = "https://www.tax4sure.ca";

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
    "tax accountant Ontario",
    "CPA Ontario",
    "tax filing near me",
    "file taxes online Canada",
    "best tax accountant Ontario",
    "affordable tax services Canada",
    "Tax4Sure",
  ],
  authors: [{ name: "Tax4Sure", url: SITE_URL }],
  creator: "Tax4Sure",
  publisher: "Tax4Sure",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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
        type: "image/png",
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
    languages: {
      "en-CA": SITE_URL,
      "en": SITE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  other: {
    "theme-color": "#0D1F4E",
    "msapplication-TileColor": "#0D1F4E",
    "geo.region": "CA-ON",
    "geo.placename": "Ontario, Canada",
    "rating": "general",
    "revisit-after": "7 days",
  },
  verification: {
    google: "JE-pD-BPxZ5RY-JnXL7HmBVpA6W60gCtO58R909crIg",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
  category: "finance",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D1F4E" />
        <meta name="msapplication-TileColor" content="#0D1F4E" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
