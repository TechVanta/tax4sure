import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const features = [
  "Personal & corporate tax filing (T1, T2)",
  "GST / HST returns & bookkeeping",
  "Year-round tax advisory support",
  "Secure client portal — access anywhere",
  "Managed by experienced tax professionals",
];

export function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#091429] p-10 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
      <div className="absolute top-1/2 right-8 h-40 w-40 rounded-full bg-gold-500/10" />

      {/* Top: Logo */}
      <div className="relative z-10">
        <Image
          src="/logo-white.svg"
          alt="Tax4Sure"
          width={200}
          height={56}
          priority
        />

        <div className="mt-10">
          <h2 className="text-4xl font-bold leading-tight">
            Your one-stop<br />
            <span className="text-gold-400">tax solution.</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed">
            From personal returns to corporate filings — we handle it all.
          </p>
        </div>

        {/* Features */}
        <ul className="mt-10 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/20 shrink-0">
                <CheckCircle2 className="h-4 w-4 text-gold-400" />
              </div>
              <span className="text-white/80 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: copyright */}
      <div className="relative z-10 mt-10">
        <p className="text-xs text-white/30 text-center">
          © 2026 Tax4Sure. All rights reserved.
        </p>
      </div>
    </div>
  );
}
