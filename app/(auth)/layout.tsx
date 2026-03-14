import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1F4E] via-[#1B3A7A] to-[#0D1F4E] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Back to home link */}
      <div className="w-full max-w-5xl mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
      {children}
    </div>
  );
}
