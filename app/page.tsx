// Homepage – public marketing page
import Link from "next/link";
import {
  User,
  Briefcase,
  Building2,
  Receipt,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Clock,
  BadgeCheck,
  ArrowRight,
  PhoneCall,
  Star,
  FileCheck,
  ChevronRight,
  Mail,
} from "lucide-react";
import { HomeNav } from "@/components/marketing/HomeNav";

/* ── Services ───────────────────────────────────────────────────────────────── */

const services = [
  {
    icon: User,
    title: "Personal Tax Return (T1)",
    description:
      "Maximize your refund with expert T1 filing for individuals and families. We handle employment income, RRSP, investments, medical expenses, and every eligible credit.",
    badge: "Most Popular",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/15 to-[#0D1F4E]/5",
  },
  {
    icon: Briefcase,
    title: "Self-Employed & Freelancers",
    description:
      "Running your own business? We handle T2125 (business income), expense deductions, home-office claims, and HST/GST remittances so you keep more of what you earn.",
    badge: null,
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/15 to-[#C9A84C]/5",
  },
  {
    icon: Building2,
    title: "Corporate Tax Return (T2)",
    description:
      "Full T2 preparation for Canadian corporations — small business deduction, capital cost allowance, shareholder loans, and year-end financial statements.",
    badge: null,
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
  },
  {
    icon: Receipt,
    title: "GST / HST Returns",
    description:
      "Accurate quarterly and annual GST/HST filing for businesses. We reconcile input tax credits (ITCs), handle remittances, and keep you compliant with CRA.",
    badge: null,
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/15 to-[#2B5BA8]/5",
  },
  {
    icon: BookOpen,
    title: "Bookkeeping",
    description:
      "Monthly and annual bookkeeping using QuickBooks and other platforms. Clean books mean clean returns — and confident business decisions all year round.",
    badge: null,
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/15 to-[#C9A84C]/5",
  },
  {
    icon: GraduationCap,
    title: "Tax Advisory & Planning",
    description:
      "Strategic tax planning, incorporation advice, estate planning, and financial reviews. Get expert perspective before you make your next big financial move.",
    badge: null,
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/15 to-[#0D1F4E]/5",
  },
];

/* ── Trust pillars ─────────────────────────────────────────────────────────── */

const pillars = [
  {
    icon: ShieldCheck,
    title: "CRA Compliant & Accurate",
    description:
      "Every return reviewed for accuracy before filing. We stay current with the latest CRA rules and tax law changes so you never pay more than you owe.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Most personal returns completed within 2–3 business days. Corporate filings handled well ahead of deadlines — no last-minute stress.",
  },
  {
    icon: BadgeCheck,
    title: "Experienced Tax Experts",
    description:
      "Our team brings years of hands-on Canadian tax expertise to every file, big or small — so your return is always in knowledgeable hands.",
  },
  {
    icon: FileCheck,
    title: "Secure Client Portal",
    description:
      "Share documents safely through our encrypted portal. No email attachments, no risk — just peace of mind from upload to filing.",
  },
];

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax4Sure | Canadian Tax Filing, CPA & Accounting Services",
  description:
    "Tax4Sure offers professional Canadian tax services — T1 personal returns, T2 corporate tax, GST/HST filing, bookkeeping and year-round advisory. Secure online client portal.",
  alternates: {
    canonical: "https://d8nnmu6vr11v0.cloudfront.net/",
  },
  openGraph: {
    title: "Tax4Sure | Canadian Tax Filing, CPA & Accounting Services",
    description:
      "Professional Canadian tax services — T1, T2, GST/HST, bookkeeping & advisory. Secure online client portal.",
    url: "https://d8nnmu6vr11v0.cloudfront.net/",
  },
};

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AccountingService",
            name: "Tax4Sure",
            description:
              "Professional Canadian tax filing and accounting services including T1 personal tax, T2 corporate tax, GST/HST filing, bookkeeping, and tax advisory.",
            url: "https://d8nnmu6vr11v0.cloudfront.net",
            email: "tax4sureca@gmail.com",
            areaServed: {
              "@type": "Country",
              name: "Canada",
            },
            serviceType: [
              "Personal Tax Return (T1)",
              "Corporate Tax Return (T2)",
              "GST/HST Filing",
              "Bookkeeping",
              "Tax Advisory",
              "Self-Employed Tax Filing",
            ],
            offers: {
              "@type": "Offer",
              description: "Professional tax filing and accounting services for individuals and businesses in Canada.",
            },
          }),
        }}
      />
      <HomeNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0D1F4E] text-white">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[#2B5BA8]/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-[380px] w-[380px] rounded-full bg-[#C9A84C]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
              <Star className="h-3.5 w-3.5 fill-[#C9A84C]" />
              Trusted Canadian Tax Firm
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Tax &amp; Accounting<br />
              <span className="text-[#C9A84C]">Done Right.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              Trusted tax services for individuals, self-employed, and corporations.
              Personal tax, corporate returns, GST/HST filing, and bookkeeping —
              all under one roof, all year round.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-4 text-base font-bold text-[#0D1F4E] shadow-lg hover:bg-[#E8C060] transition-all hover:scale-[1.02] active:scale-95"
              >
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                Our Services <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <div className="border-y border-gray-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { icon: "🇨🇦", text: "Canadian Tax Experts" },
              { icon: "🔒", text: "Secure Encrypted Portal" },
              { icon: "📋", text: "T1 · T2 · GST/HST · Bookkeeping" },
              { icon: "📅", text: "Year-Round Support" },
              { icon: "✅", text: "CRA-Compliant E-Filing" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="text-base">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#C9A84C]">
              What We Do
            </p>
            <h2 className="text-4xl font-black text-[#0D1F4E] md:text-5xl">
              Full-Service Tax &amp; Accounting
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              From personal returns to corporate filings, we handle every aspect
              of your Canadian tax obligations with precision and care.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {svc.badge && (
                    <span className="absolute top-5 right-5 rounded-full bg-[#C9A84C]/15 px-3 py-1 text-xs font-bold text-[#C9A84C]">
                      {svc.badge}
                    </span>
                  )}

                  {/* Icon card */}
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${svc.bg}`}>
                    <Icon className="h-8 w-8" style={{ color: svc.accent }} strokeWidth={1.8} />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#0D1F4E]">{svc.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-500">{svc.description}</p>

                  <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#2B5BA8] group-hover:gap-2 transition-all duration-200">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section id="why-us" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            {/* Left: copy */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#C9A84C]">
                Why Tax4Sure
              </p>
              <h2 className="text-4xl font-black leading-tight text-[#0D1F4E] md:text-5xl">
                Your taxes.<br />
                <span className="text-[#2B5BA8]">Our expertise.</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
                We combine deep Canadian tax knowledge with a modern, secure client
                experience. No waiting rooms, no paper piles — just accurate returns
                and a team that has your back every step of the way.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "T1, T2, HST/GST, payroll — all in one firm",
                  "Year-round availability, not just tax season",
                  "Transparent flat-fee pricing, no surprises",
                  "CRA audit support included with every filing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/15">
                      <svg className="h-3 w-3 text-[#C9A84C]" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[#0D1F4E] px-8 py-4 text-sm font-bold text-white hover:bg-[#1B3A7A] transition-all"
              >
                Access Client Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: pillars grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D1F4E]">
                      <Icon className="h-5 w-5 text-[#C9A84C]" />
                    </div>
                    <h4 className="mb-2 text-base font-bold text-[#0D1F4E]">{p.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-500">{p.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Common Questions</p>
            <h2 className="text-4xl font-black text-[#0D1F4E]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What is the deadline for filing taxes in Canada?",
                a: "For most individuals, the Canadian personal tax (T1) filing deadline is April 30. Self-employed individuals and their spouses have until June 15 to file, though any taxes owed are still due April 30. Corporate tax (T2) returns are due 6 months after the end of the corporation's fiscal year.",
              },
              {
                q: "What is the difference between a T1 and T2 tax return?",
                a: "A T1 is the personal income tax return filed by individuals, including employees, retirees, and self-employed people. A T2 is the corporate income tax return filed annually by all resident corporations in Canada, regardless of whether they earned income.",
              },
              {
                q: "Do I need to register for GST/HST?",
                a: "You must register for GST/HST if your business revenues exceed $30,000 in a single calendar quarter or over four consecutive quarters. Voluntary registration is also available. Once registered, you collect GST/HST from clients and remit it to the CRA on a monthly, quarterly, or annual basis.",
              },
              {
                q: "What documents do I need to file my personal tax return?",
                a: "Commonly required documents include: T4 slips (employment income), T3/T5 slips (investment income), RRSP contribution receipts, medical expense receipts, charitable donation receipts, tuition slips (T2202), and any business income/expense records if self-employed.",
              },
              {
                q: "How do I upload my documents to Tax4Sure?",
                a: "Simply create a free account on our secure client portal, log in, and upload your documents directly. Documents are organized by tax year and kept in an encrypted, private vault that only you and your tax professional can access.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-100 bg-gray-50 open:bg-white open:shadow-sm transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-semibold text-[#0D1F4E] list-none">
                  {item.q}
                  <span className="ml-4 shrink-0 text-[#C9A84C] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-5 pt-1 text-sm leading-relaxed text-gray-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section id="contact" className="relative overflow-hidden bg-[#0D1F4E] py-20 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-[#C9A84C]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-[#2B5BA8]/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
            <PhoneCall className="h-3.5 w-3.5" />
            Ready to File?
          </div>
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            Let&apos;s get your taxes filed<br />
            <span className="text-[#C9A84C]">with confidence.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
            Join hundreds of Canadians who trust Tax4Sure for accurate, on-time tax
            filing. Create your account or log in to your secure portal today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-4 text-base font-bold text-[#0D1F4E] shadow-lg hover:bg-[#E8C060] transition-all hover:scale-[1.02]"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Client Login
            </Link>
          </div>
          <p className="mt-8 text-white/50 text-sm">
            Have a question?{" "}
            <a
              href="mailto:tax4sureca@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#C9A84C] font-semibold hover:text-[#E8C060] transition-colors"
            >
              <Mail className="h-4 w-4" />
              tax4sureca@gmail.com
            </a>
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0D1F4E] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-8">

          {/* Top grid */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 mb-12">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-2xl font-black tracking-tight">
                <span className="text-white">Tax</span>
                <span className="text-[#C9A84C]">4</span>
                <span className="text-[#7EB3E8]">Sure</span>
              </p>
              <p className="mt-1 text-xs tracking-widest text-white/40 uppercase">
                CPA · TAX · HST · GST · BOOKKEEPING
              </p>
              <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-[220px]">
                Your one-stop solution for personal and business tax filing in Canada.
              </p>
              <a
                href="mailto:tax4sureca@gmail.com"
                className="mt-5 inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#E8C060] transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                tax4sureca@gmail.com
              </a>
            </div>

            {/* Services column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Services</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><a href="#services" className="hover:text-white transition-colors">Personal Tax (T1)</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Self-Employed</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Corporate Tax (T2)</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">GST / HST Returns</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Bookkeeping</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Tax Advisory</a></li>
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Company</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#why-us" className="hover:text-white transition-colors">Why Us</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Client portal column */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Client Portal</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><Link href="/login" className="hover:text-white transition-colors">Client Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              </ul>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50 leading-relaxed">
                  Securely upload and manage your tax documents online — available 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Divider + bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Tax4Sure. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Tax services for individuals &amp; businesses across Canada.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
