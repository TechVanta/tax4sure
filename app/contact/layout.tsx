import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Tax4Sure",
  description:
    "Get in touch with Tax4Sure. We offer professional Canadian tax filing and accounting services. Send us a message and we'll respond within one business day.",
  alternates: {
    canonical: "https://d8nnmu6vr11v0.cloudfront.net/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
