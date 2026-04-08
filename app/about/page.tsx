// About page – server component for SEO metadata
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  BadgeCheck,
  FileCheck,
  ArrowRight,
  ChevronRight,
  Mail,
  Users,
  Target,
  HeartHandshake,
  DollarSign,
  Star,
  Briefcase,
  Building2,
  Receipt,
  BookOpen,
  GraduationCap,
  Building,
  Shield,
  Home,
  Globe,
  Heart,
  FolderOpen,
  User,
} from "lucide-react";
import { HomeNav } from "@/components/marketing/HomeNav";
import type { Metadata } from "next";

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "About Tax4Sure — Trusted Canadian Tax & Accounting Professionals",
  description:
    "Learn about Tax4Sure — experienced Canadian tax professionals and Ontario tax accountants providing accurate, CRA-compliant personal and corporate tax filing, bookkeeping, and year-round advisory services.",
  keywords: [
    "about tax4sure",
    "Canadian tax professionals",
    "Ontario tax accountant",
    "trusted tax firm Canada",
    "Canadian accounting firm",
    "CRA compliant tax service",
    "experienced tax preparers Ontario",
    "tax filing experts Canada",
    "tax4sure team",
    "Ontario CPA tax services",
    "year-round tax support Canada",
    "affordable tax accountant Ontario",
    "secure tax filing Canada",
    "personal and corporate tax Ontario",
  ],
  alternates: {
    canonical: "https://www.tax4sure.ca/about",
  },
  openGraph: {
    title: "About Tax4Sure — Trusted Canadian Tax & Accounting Professionals",
    description:
      "Tax4Sure is a Canadian tax and accounting firm based in Ontario. We deliver CRA-compliant personal tax (T1), corporate tax (T2), GST/HST, bookkeeping, and year-round advisory with a secure online client portal.",
    url: "https://www.tax4sure.ca/about",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Tax4Sure — Canadian Tax & Accounting Professionals",
      },
    ],
  },
};

/* ── Why Choose Us Pillars ─────────────────────────────────────────────────── */
const whyChoosePillars = [
  {
    icon: ShieldCheck,
    title: "CRA Compliant",
    description:
      "Every return is prepared and reviewed against the latest CRA rules, guidelines, and legislative updates. We e-file directly with CRA so your submission is accurate, timely, and fully compliant — no surprises, no reassessments.",
    accent: "#2B5BA8",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Most personal tax returns are completed within 2-3 business days. Corporate and complex filings are handled well before deadlines. We respect your time and never keep you waiting unnecessarily.",
    accent: "#C9A84C",
  },
  {
    icon: FileCheck,
    title: "Secure Client Portal",
    description:
      "Upload your tax documents through our encrypted, 24/7 online portal. No email attachments, no insecure file-sharing. Your financial data is protected with bank-level security from the moment you upload to the moment we file.",
    accent: "#0D1F4E",
  },
  {
    icon: BadgeCheck,
    title: "Experienced Team",
    description:
      "Our professionals bring years of hands-on Canadian tax expertise. From straightforward T1 returns to complex corporate structures, we have the depth of knowledge needed to handle your file confidently and correctly.",
    accent: "#4A7DB8",
  },
  {
    icon: HeartHandshake,
    title: "Year-Round Support",
    description:
      "Tax questions do not follow a calendar. We are available throughout the year for tax planning, CRA correspondence, mid-year bookkeeping, and any financial questions that arise between filing seasons.",
    accent: "#2B5BA8",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description:
      "Professional tax services should not break the bank. Our pricing is transparent, competitive, and fair — no hidden fees, no surprise charges. You always know what you are paying for before we begin.",
    accent: "#C9A84C",
  },
];

/* ── Services at a Glance ──────────────────────────────────────────────────── */
const servicesGlance = [
  { icon: User, label: "Personal Tax Returns (T1)" },
  { icon: Briefcase, label: "Self-Employed & Freelancer Tax" },
  { icon: Building2, label: "Corporate Tax Returns (T2)" },
  { icon: Receipt, label: "GST / HST Filing" },
  { icon: BookOpen, label: "Bookkeeping & Financial Reporting" },
  { icon: GraduationCap, label: "Tax Advisory & Planning" },
  { icon: Building, label: "Corporation Incorporation (Federal & Ontario)" },
  { icon: Users, label: "Payroll & T4 Preparation" },
  { icon: Shield, label: "CRA Audit Representation" },
  { icon: Home, label: "Rental Property Income (T776)" },
  { icon: FolderOpen, label: "Estate & Trust Tax (T3)" },
  { icon: Globe, label: "Non-Resident & Newcomer Tax" },
  { icon: Heart, label: "Disability Tax Credit (DTC)" },
];

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* JSON-LD: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://www.tax4sure.ca/#organization",
            name: "Tax4Sure",
            url: "https://www.tax4sure.ca",
            email: "tax4sureca@gmail.com",
            logo: "https://www.tax4sure.ca/logo.svg",
            image: "https://www.tax4sure.ca/og-image.png",
            description:
              "Tax4Sure is a Canadian tax and accounting firm based in Ontario, offering personal tax (T1), corporate tax (T2), GST/HST, bookkeeping, incorporation, payroll, CRA audit support, and year-round tax advisory services.",
            foundingDate: "2024",
            areaServed: [
              { "@type": "Country", name: "Canada" },
              {
                "@type": "AdministrativeArea",
                name: "Ontario",
                containedInPlace: { "@type": "Country", name: "Canada" },
              },
            ],
            sameAs: [],
          }),
        }}
      />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.tax4sure.ca/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://www.tax4sure.ca/about",
              },
            ],
          }),
        }}
      />

      <HomeNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#091429] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-[#2B5BA8]/25 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-[420px] w-[420px] rounded-full bg-[#C9A84C]/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#1B3A7A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li className="text-[#C9A84C] font-medium">About</li>
              </ol>
            </nav>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
              <Star className="h-3.5 w-3.5 fill-[#C9A84C]" />
              About Tax4Sure
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Your Trusted Canadian<br />
              <span className="text-[#C9A84C]">Tax Professionals.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
              Tax4Sure is a Canadian tax and accounting firm based in Ontario. We help
              individuals, families, and businesses navigate the Canadian tax system
              with confidence — from your very first return to your most complex
              corporate filing.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2B5BA8] mb-3">
                Who We Are
              </p>
              <h2 className="text-3xl font-black tracking-tight text-[#091429] sm:text-4xl">
                A Canadian Firm Built on Accuracy, Trust &amp; Client Care
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
                <p>
                  Tax4Sure was founded with a clear purpose: to make professional tax
                  and accounting services accessible to every Canadian. Based in Ontario,
                  we serve clients across the province and across Canada — from salaried
                  employees filing their first T1 to established corporations managing
                  complex T2 filings, GST/HST obligations, and multi-entity structures.
                </p>
                <p>
                  Unlike seasonal tax preparation chains, Tax4Sure operates year-round.
                  We believe that meaningful tax advice should not be limited to a few
                  weeks before the April 30 deadline. Whether you need help responding to
                  a CRA notice in July, incorporating your business in September, or
                  planning RRSP contributions in December, our team is here for you every
                  step of the way.
                </p>
                <p>
                  Our client-first approach means we take the time to understand your
                  financial situation before we prepare a single form. We ask questions,
                  review your prior returns, and identify credits and deductions that
                  others might miss. The result is a return that is not just compliant,
                  but optimized — and a client who understands exactly where they stand
                  with CRA.
                </p>
              </div>
            </div>

            {/* Visual trust panel */}
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#091429]/[0.03] to-[#2B5BA8]/[0.06] p-8 md:p-10">
              <h3 className="text-lg font-bold text-[#091429] mb-6">
                What Sets Us Apart
              </h3>
              <ul className="space-y-5">
                {[
                  {
                    title: "Deep Canadian Tax Expertise",
                    desc: "We specialize exclusively in Canadian federal and provincial tax law. Every nuance of the Income Tax Act, Excise Tax Act, and CRA administrative policies is part of our daily practice.",
                  },
                  {
                    title: "Technology-Forward Workflow",
                    desc: "Our secure client portal, digital document management, and CRA-authorized e-filing mean faster processing, fewer errors, and a paperless experience for you.",
                  },
                  {
                    title: "Transparent Communication",
                    desc: "No jargon, no surprises. We explain your return in plain language, walk you through every number, and ensure you are comfortable before we file.",
                  },
                  {
                    title: "Accessible to All Canadians",
                    desc: "Whether you are a first-time filer, a new immigrant to Canada, a small business owner, or a seasoned corporation, we tailor our services to your needs and budget.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2B5BA8]/10">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#2B5BA8]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#091429]">{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ───────────────────────────────────────────────────── */}
      <section className="bg-[#091429] text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              <Target className="h-3.5 w-3.5" />
              Our Mission
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Making Tax Filing{" "}
              <span className="text-[#C9A84C]">Simple, Accurate &amp; Stress-Free</span>{" "}
              for Every Canadian
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg md:text-xl max-w-2xl mx-auto">
              We founded Tax4Sure because we believe no Canadian should dread tax season.
              Whether you earn employment income, run a side hustle, own rental property,
              or lead a growing corporation, you deserve an accounting partner who
              simplifies the process, maximizes your entitled credits and deductions, and
              gives you peace of mind that everything is filed correctly with CRA.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  stat: "Year-Round",
                  label: "Availability",
                  desc: "Not just at tax time — we are here for you 365 days a year",
                },
                {
                  stat: "100%",
                  label: "CRA E-Filing",
                  desc: "Direct electronic filing with the Canada Revenue Agency",
                },
                {
                  stat: "All of Canada",
                  label: "Clients Served",
                  desc: "Ontario-based, serving individuals and businesses nationwide",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-2xl font-black text-[#C9A84C]">{item.stat}</p>
                  <p className="mt-1 text-sm font-bold text-white/90">{item.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE TAX4SURE ───────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2B5BA8] mb-3">
              Why Choose Tax4Sure
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#091429] sm:text-4xl">
              Six Reasons Canadians Trust Us With Their Taxes
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500 leading-relaxed">
              Choosing a tax professional is a decision that affects your finances, your
              compliance with CRA, and your peace of mind. Here is why thousands of
              Canadians choose Tax4Sure.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoosePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{ backgroundColor: `${pillar.accent}15` }}
                >
                  <pillar.icon
                    className="h-6 w-6"
                    style={{ color: pillar.accent }}
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-lg font-bold text-[#091429]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES AT A GLANCE ──────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
              Our Services at a Glance
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[#091429] sm:text-4xl">
              Comprehensive Tax &amp; Accounting Services
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500 leading-relaxed">
              Tax4Sure covers every aspect of Canadian tax compliance and business
              registration. Below is a summary of what we offer — visit our services
              page for complete details.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicesGlance.map((svc) => (
              <div
                key={svc.label}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 px-5 py-4 hover:bg-[#2B5BA8]/[0.04] transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2B5BA8]/10">
                  <svc.icon className="h-5 w-5 text-[#2B5BA8]" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold text-[#091429]">{svc.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2B5BA8] px-7 py-3.5 text-sm font-bold text-[#2B5BA8] hover:bg-[#2B5BA8] hover:text-white transition-all"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0D1F4E] to-[#091429] text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Ready to Experience the{" "}
            <span className="text-[#C9A84C]">Tax4Sure Difference?</span>
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Whether you need to file a personal tax return, incorporate a business, or
            get expert advice on a CRA matter, our team is ready to help. Book a free
            consultation today — no obligation, no pressure, just honest answers from
            experienced Canadian tax professionals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-4 text-base font-bold text-[#0D1F4E] shadow-lg hover:bg-[#E8C060] transition-all hover:scale-[1.02] active:scale-95"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Client Login <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#091429] text-white">
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-2xl font-black tracking-tight">
                <span className="text-white">Tax</span>
                <span className="text-[#C9A84C]">4</span>
                <span className="text-[#7EB3E8]">Sure</span>
              </p>
              <p className="mt-1 text-xs tracking-widest text-[#C9A84C]/60 uppercase">
                Canadian Tax Professionals
              </p>
              <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-[220px]">
                Your one-stop solution for personal tax, corporate tax, and business services across Canada.
              </p>
              <a
                href="mailto:tax4sureca@gmail.com"
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#E8C060] transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                tax4sureca@gmail.com
              </a>
            </div>

            {/* Tax Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Tax Services</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><a href="/#services" className="hover:text-white transition-colors">Personal Tax (T1)</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Self-Employed</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Corporate Tax (T2)</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">GST / HST Returns</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Bookkeeping</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Tax Advisory</a></li>
              </ul>
            </div>

            {/* Business Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Business Services</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><a href="/#more-services" className="hover:text-white transition-colors">Corporation Incorporation</a></li>
                <li><a href="/#more-services" className="hover:text-white transition-colors">Business Registration</a></li>
                <li><a href="/#more-services" className="hover:text-white transition-colors">Payroll &amp; T4</a></li>
                <li><a href="/#more-services" className="hover:text-white transition-colors">CRA Audit Support</a></li>
                <li><a href="/#more-services" className="hover:text-white transition-colors">Rental Income (T776)</a></li>
                <li><a href="/#more-services" className="hover:text-white transition-colors">Estate &amp; Trust (T3)</a></li>
              </ul>
            </div>

            {/* Portal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Client Portal</h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li><Link href="/login" className="hover:text-white transition-colors">Client Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/about" className="text-white font-medium">About Us</Link></li>
              </ul>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50 leading-relaxed">
                  Securely upload and manage your tax documents online — available 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Tax4Sure. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Tax &amp; business services for individuals and corporations across Canada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
