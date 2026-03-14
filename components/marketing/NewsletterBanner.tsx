"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function NewsletterBanner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: "newsletter",
          message:
            "Newsletter subscription — please send me the free 2024 Canadian Tax Deductions Checklist.",
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-[#C9A84C]" />
        <h3 className="text-lg font-bold text-white">You&apos;re on the list!</h3>
        <p className="text-sm text-white/65 max-w-sm">
          We&apos;ll send your free Canadian Tax Checklist shortly. Keep an eye on your inbox!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/20 transition"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/20 transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-all disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send Me the Checklist"
          )}
        </button>
      </div>
      {status === "error" && <p className="text-red-300 text-xs">{errorMsg}</p>}
      <p className="text-xs text-white/40">No spam — just practical tax tips. Unsubscribe anytime.</p>
    </form>
  );
}
