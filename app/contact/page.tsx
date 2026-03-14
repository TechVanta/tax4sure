"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeNav } from "@/components/marketing/HomeNav";
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const SUBJECTS = [
  { value: "consultation", label: "Book a Free Consultation" },
  // Tax services
  { value: "personal-tax", label: "Personal Tax Return (T1)" },
  { value: "self-employed", label: "Self-Employed / Sole Proprietor" },
  { value: "corporate-tax", label: "Corporate Tax Return (T2)" },
  { value: "gst-hst", label: "GST / HST Returns" },
  { value: "bookkeeping", label: "Bookkeeping" },
  // Business services
  { value: "incorporation", label: "Corporation Incorporation" },
  { value: "business-registration", label: "Business Registration (Ontario)" },
  { value: "payroll", label: "Payroll & T4 Preparation" },
  // CRA & other
  { value: "cra-audit", label: "CRA Audit / Dispute Resolution" },
  { value: "rental-income", label: "Rental Property Income (T776)" },
  { value: "estate-trust", label: "Estate & Trust Tax (T3)" },
  { value: "non-resident", label: "Non-Resident / Newcomer Tax" },
  { value: "disability-tax-credit", label: "Disability Tax Credit (DTC)" },
  { value: "tax-advisory", label: "Tax Advisory & Planning" },
  { value: "other", label: "General Inquiry" },
];

/* ── Email validation ───────────────────────────────────────────────────────── */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "throwaway.email", "tempmail.com",
  "temp-mail.org", "fakeinbox.com", "maildrop.cc", "yopmail.com",
  "sharklasers.com", "grr.la", "spam4.me", "trashmail.com", "trashmail.net",
  "dispostable.com", "getonemail.com", "discard.email", "spamgourmet.com",
  "getnada.com", "throwam.com", "mintemail.com", "owlpic.com", "spambox.us",
  "mailnesia.com", "incognitomail.com", "tempr.email", "mt2015.com",
  "example.com", "example.net", "example.org", "test.com", "fake.com",
  "noemail.com", "noreply.com", "nobody.com", "mailnull.com",
  "invalid.com", "placeholder.com", "nomail.com",
]);

function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(trimmed)) {
    return "Please enter a valid email address (e.g. yourname@gmail.com).";
  }
  const domain = trimmed.split("@")[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "Disposable or test email addresses are not accepted. Please use your real email address.";
  }
  return "";
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email before submitting
    const emailValidation = validateEmail(form.email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to send message. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Connection error. Please try again or email us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError("");
    setEmailError("");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeNav />

      {/* Hero */}
      <section className="bg-[#0D1F4E] py-14 text-white text-center">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
            <MessageSquare className="h-3.5 w-3.5" />
            Free Consultation — No Obligation
          </div>
          <h1 className="text-3xl font-black md:text-5xl">
            Talk to a tax professional<br />
            <span className="text-[#C9A84C]">today.</span>
          </h1>
          <p className="mt-4 text-base text-white/65 max-w-lg mx-auto">
            Tell us about your situation and we&apos;ll respond within one business day
            with exactly what you need — at a price that makes sense.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#0D1F4E] sm:text-2xl">Contact Information</h2>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                Reach out by email or use the form. We typically respond within one business day.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Us</p>
                  <a
                    href="mailto:tax4sureca@gmail.com"
                    className="mt-0.5 font-semibold text-[#0D1F4E] hover:text-[#C9A84C] transition-colors text-sm break-all"
                  >
                    tax4sureca@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Response Time</p>
                  <p className="mt-0.5 font-semibold text-[#0D1F4E] text-sm">Within 1 business day</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Service Area</p>
                  <p className="mt-0.5 font-semibold text-[#0D1F4E] text-sm">🇨🇦 All across Canada</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0D1F4E] p-5 text-white">
              <h3 className="font-bold text-base">Already a client?</h3>
              <p className="mt-1 text-sm text-white/65">
                Log in to your secure portal to upload documents and track your filing status.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-colors"
              >
                Client Login
              </Link>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-12 text-center h-full min-h-[320px]">
                <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800">Message Sent!</h3>
                <p className="mt-2 text-green-700 text-sm max-w-sm">
                  Thank you for reaching out. We&apos;ll be in touch within one business day at{" "}
                  <span className="font-semibold">{form.email}</span>.
                  <br /><span className="text-xs text-green-600 mt-1 block">A confirmation has been sent to your email.</span>
                </p>
                <button
                  onClick={resetForm}
                  className="mt-6 text-sm text-green-700 underline hover:text-green-900"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => {
                        setForm(f => ({ ...f, email: e.target.value }));
                        if (emailError) setEmailError("");
                      }}
                      onBlur={e => setEmailError(validateEmail(e.target.value))}
                      placeholder="yourname@gmail.com"
                      className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 transition ${
                        emailError
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200 focus:border-[#0D1F4E] focus:ring-[#0D1F4E]/10"
                      }`}
                    />
                    {emailError && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (647) 000-0000"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition bg-white"
                    >
                      <option value="">Select a topic...</option>
                      {SUBJECTS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0D1F4E] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#162d6e] transition-colors shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send Message</>
                  )}
                </button>
                <p className="text-xs text-gray-400">
                  By submitting this form you agree that we may contact you at the email address provided.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#0D1F4E] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-sm font-black tracking-tight">
            <span className="text-white">Tax</span>
            <span className="text-[#C9A84C]">4</span>
            <span className="text-[#7EB3E8]">Sure</span>
          </p>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Tax4Sure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
