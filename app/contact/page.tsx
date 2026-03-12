"use client";

import { useState } from "react";
import Link from "next/link";
import { HomeNav } from "@/components/marketing/HomeNav";
import { Mail, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — email integration to be connected later
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeNav />

      {/* Hero */}
      <section className="bg-[#0D1F4E] py-16 text-white text-center">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
            <MessageSquare className="h-3.5 w-3.5" />
            Get In Touch
          </div>
          <h1 className="text-4xl font-black md:text-5xl">
            We&apos;d love to hear<br />
            <span className="text-[#C9A84C]">from you.</span>
          </h1>
          <p className="mt-4 text-lg text-white/65">
            Have a question about your taxes or our services? Send us a message
            and we&apos;ll get back to you promptly.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">

          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0D1F4E]">Contact Information</h2>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                Reach out by email or use the form. We typically respond within one business day.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Us</p>
                  <a
                    href="mailto:tax4sure@gmail.com"
                    className="mt-0.5 font-semibold text-[#0D1F4E] hover:text-[#C9A84C] transition-colors"
                  >
                    tax4sure@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Response Time</p>
                  <p className="mt-0.5 font-semibold text-[#0D1F4E]">Within 1 business day</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0D1F4E] p-6 text-white">
              <h3 className="font-bold text-lg">Already a client?</h3>
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
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-16 text-center h-full">
                <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800">Message Sent!</h3>
                <p className="mt-2 text-green-700 text-sm max-w-sm">
                  Thank you for reaching out. We&apos;ll be in touch within one business day at{" "}
                  <span className="font-semibold">{form.email}</span>.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="mt-6 text-sm text-green-700 underline hover:text-green-900"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition bg-white"
                    >
                      <option value="">Select a topic...</option>
                      <option value="personal-tax">Personal Tax (T1)</option>
                      <option value="self-employed">Self-Employed / Sole Proprietor</option>
                      <option value="corporate-tax">Corporate Tax (T2)</option>
                      <option value="gst-hst">GST / HST Returns</option>
                      <option value="bookkeeping">Bookkeeping</option>
                      <option value="other">General Inquiry</option>
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
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0D1F4E] focus:ring-2 focus:ring-[#0D1F4E]/10 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D1F4E] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#162d6e] transition-colors shadow"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
                <p className="text-xs text-gray-400">
                  By submitting this form you agree that we may contact you at the email address provided.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

// Re-use the same footer component inline for now
function SiteFooter() {
  return (
    <footer className="bg-[#0D1F4E] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
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
