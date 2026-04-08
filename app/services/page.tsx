// Services page – server component for SEO metadata + rich content
import Link from "next/link";
import {
  User,
  Briefcase,
  Building2,
  Receipt,
  BookOpen,
  GraduationCap,
  Building,
  FileText,
  Users,
  Shield,
  Home,
  FolderOpen,
  Globe,
  Heart,
  ChevronRight,
  Mail,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { HomeNav } from "@/components/marketing/HomeNav";
import type { Metadata } from "next";

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title:
    "Our Services | Tax4Sure — Tax Filing, Bookkeeping & Business Services in Ontario",
  description:
    "Tax4Sure offers comprehensive tax services in Ontario — personal tax (T1), corporate tax (T2), GST/HST returns, bookkeeping, corporation incorporation, business registration, payroll, CRA audit representation, and tax advisory. Book a free consultation today.",
  keywords: [
    "tax services Ontario",
    "tax filing services Canada",
    "bookkeeping Ontario",
    "personal tax return Ontario",
    "corporate tax filing Ontario",
    "T1 tax return services",
    "T2 corporate tax preparation",
    "GST HST filing Ontario",
    "self-employed tax Canada",
    "corporation incorporation Ontario",
    "business registration Ontario",
    "payroll services Ontario",
    "CRA audit representation",
    "rental income tax filing",
    "estate trust T3 tax Canada",
    "non-resident tax filing Canada",
    "disability tax credit application",
    "tax advisory Ontario",
    "bookkeeping services Canada",
    "tax accountant near me Ontario",
  ],
  alternates: {
    canonical: "https://www.tax4sure.ca/services",
  },
  openGraph: {
    title:
      "Our Services | Tax4Sure — Tax Filing, Bookkeeping & Business Services",
    description:
      "Explore Tax4Sure's full range of tax and business services — T1 personal tax, T2 corporate tax, GST/HST, bookkeeping, incorporation, business registration, payroll, CRA audit support, and more.",
    url: "https://www.tax4sure.ca/services",
    type: "website",
    locale: "en_CA",
    siteName: "Tax4Sure",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tax4Sure Services — Tax Filing, Bookkeeping & Business Services in Ontario",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Our Services | Tax4Sure — Tax Filing, Bookkeeping & Business Services",
    description:
      "Personal tax, corporate tax, GST/HST, bookkeeping, incorporation & more. Ontario's trusted tax professionals.",
    images: ["/og-image.png"],
  },
};

/* ── Service Data ──────────────────────────────────────────────────────────── */
const taxServices = [
  {
    id: "personal-tax",
    icon: User,
    title: "Personal Tax Return (T1)",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/15 to-[#0D1F4E]/5",
    description:
      "Whether you are an employee, retiree, or have investment income, our experts ensure every eligible deduction and credit is claimed on your T1 return. We handle employment income, RRSP contributions, medical expenses, tuition credits, and more to maximize your refund.",
    bullets: [
      "Employment, pension & investment income",
      "RRSP, medical & tuition deductions",
      "NETFILE e-filing for fast refunds",
    ],
  },
  {
    id: "self-employed",
    icon: Briefcase,
    title: "Self-Employed & Freelancers",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/15 to-[#C9A84C]/5",
    description:
      "Running your own business means navigating complex tax obligations. We prepare your T2125 statement of business income, claim legitimate home-office expenses, vehicle costs, and subcontractor payments. We also handle your GST/HST remittances so you stay compliant and keep more of what you earn.",
    bullets: [
      "T2125 business income statement",
      "Home-office & vehicle expense claims",
      "GST/HST registration & remittance",
    ],
  },
  {
    id: "corporate-tax",
    icon: Building2,
    title: "Corporate Tax Return (T2)",
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
    description:
      "Every Canadian-resident corporation must file a T2 return within six months of its fiscal year end. Our team prepares complete T2 filings including financial statements, GIFI schedules, small business deduction optimization, capital cost allowance, and shareholder loan tracking to ensure full CRA compliance.",
    bullets: [
      "Year-end financial statements & GIFI",
      "Small business deduction optimization",
      "Shareholder loan & CCA tracking",
    ],
  },
  {
    id: "gst-hst",
    icon: Receipt,
    title: "GST / HST Returns",
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/15 to-[#2B5BA8]/5",
    description:
      "Businesses registered for GST/HST must file returns quarterly or annually with the CRA. We reconcile all sales and input tax credits (ITCs), prepare accurate returns, and ensure timely remittance. Whether you use the regular or quick method, we choose the approach that saves you the most money.",
    bullets: [
      "ITC reconciliation & optimization",
      "Quarterly & annual filing",
      "Quick method vs. regular method analysis",
    ],
  },
  {
    id: "bookkeeping",
    icon: BookOpen,
    title: "Bookkeeping",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/15 to-[#C9A84C]/5",
    description:
      "Clean, up-to-date books are the foundation of accurate tax returns and smart business decisions. We provide monthly and annual bookkeeping using QuickBooks, Xero, and other leading platforms. From bank reconciliations to financial reporting, we keep your records CRA-ready year-round.",
    bullets: [
      "Monthly & annual bookkeeping",
      "QuickBooks & Xero setup and support",
      "Bank reconciliation & financial reports",
    ],
  },
  {
    id: "tax-advisory",
    icon: GraduationCap,
    title: "Tax Advisory & Planning",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/15 to-[#0D1F4E]/5",
    description:
      "Proactive tax planning can save you thousands of dollars every year. Our advisory services cover incorporation strategy, income-splitting techniques, RRSP vs. TFSA optimization, estate planning, and year-round financial reviews. Get expert guidance before you make your next big financial decision.",
    bullets: [
      "Incorporation & restructuring advice",
      "RRSP, TFSA & income-splitting strategy",
      "Year-round tax planning reviews",
    ],
  },
];

const businessServices = [
  {
    id: "incorporation",
    icon: Building,
    title: "Corporation Incorporation",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/10 to-[#0D1F4E]/5",
    description:
      "Ready to incorporate? We handle both federal (CBCA) and Ontario (OBCA) incorporations from start to finish. Our service includes the NUANS name search, articles of incorporation, corporate minute book setup, CRA business number registration, and HST account opening. We guide you on the best structure for your situation.",
    bullets: [
      "Federal (CBCA) or Ontario (OBCA)",
      "NUANS name search & articles of incorporation",
      "Corporate minute book & CRA account setup",
    ],
  },
  {
    id: "business-registration",
    icon: FileText,
    title: "Business Registration (Ontario)",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-[#C9A84C]/5",
    description:
      "Sole proprietors, partnerships, and businesses operating under a trade name in Ontario must register a Master Business Licence with ServiceOntario. We handle the full registration process quickly and accurately, ensuring your business is legally compliant from day one. Registration is valid for five years.",
    bullets: [
      "Master Business Licence registration",
      "Sole proprietor & partnership setup",
      "Trade name registration & renewals",
    ],
  },
  {
    id: "payroll",
    icon: Users,
    title: "Payroll & T4 Preparation",
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
    description:
      "Managing payroll in Canada involves CPP, EI, and income tax source deductions, remittances to CRA, and year-end T4/T4 Summary filing. We set up your payroll from scratch or take over existing payroll, prepare Records of Employment (ROE), and ensure every remittance is accurate and on time.",
    bullets: [
      "Full payroll setup & processing",
      "T4, T4 Summary & ROE preparation",
      "CPP, EI & source deduction remittances",
    ],
  },
  {
    id: "cra-audit",
    icon: Shield,
    title: "CRA Audit Representation",
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/10 to-[#2B5BA8]/5",
    description:
      "Receiving a letter from the CRA can be stressful. Whether it is a simple information request, a desk review, or a full audit, we act as your authorized representative. We review the notice, gather all required documentation, communicate with CRA on your behalf, and work to resolve matters quickly while protecting your interests.",
    bullets: [
      "Authorized CRA representative",
      "Audit response & documentation",
      "Objections, appeals & penalty relief",
    ],
  },
  {
    id: "rental-income",
    icon: Home,
    title: "Rental Property Income",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-[#C9A84C]/5",
    description:
      "Canadian rental property owners must report income and expenses on Form T776. We calculate capital cost allowance (CCA), claim eligible repairs and maintenance, handle principal residence exemptions, and address HST considerations on new builds. Whether you own one unit or a portfolio, we optimize your rental tax position.",
    bullets: [
      "T776 rental income reporting",
      "CCA & expense optimization",
      "Principal residence exemption guidance",
    ],
  },
  {
    id: "estate-trust",
    icon: FolderOpen,
    title: "Estate & Trust Tax (T3)",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/10 to-[#0D1F4E]/5",
    description:
      "Estates and trusts in Canada are taxed as separate entities and require a T3 return. We prepare returns for testamentary trusts, inter vivos trusts, and graduated rate estates. Our services include post-death tax planning, clearance certificate applications, and trust distribution planning to minimize the overall tax burden on beneficiaries.",
    bullets: [
      "T3 returns for estates & trusts",
      "Post-death tax planning",
      "Clearance certificate applications",
    ],
  },
  {
    id: "non-resident",
    icon: Globe,
    title: "Non-Resident & Newcomer Tax",
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
    description:
      "Non-residents with Canadian income and newcomers to Canada face unique tax obligations. We handle Section 116 certificates for property dispositions, NR4 reporting, departure returns, Treaty-based elections, and first-year Canadian tax filing for immigrants. We ensure you meet all CRA requirements and claim available credits.",
    bullets: [
      "Section 116 & NR4 compliance",
      "Departure & first-year returns",
      "Treaty-based election filing",
    ],
  },
  {
    id: "disability-tax-credit",
    icon: Heart,
    title: "Disability Tax Credit (DTC)",
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/10 to-[#2B5BA8]/5",
    description:
      "The Disability Tax Credit provides significant tax relief to eligible Canadians. We assist with the initial T2201 application, coordinate with your medical practitioner, and file retroactive claims for up to ten years of missed credits. We also optimize the Child Disability Benefit and advise on the Registered Disability Savings Plan (RDSP).",
    bullets: [
      "T2201 DTC application assistance",
      "Retroactive claims up to 10 years",
      "RDSP & Child Disability Benefit advice",
    ],
  },
];

/* ── Page Component ────────────────────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── JSON-LD: Service schemas ─────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              ...taxServices.map((s) => ({
                "@type": "Service",
                name: s.title,
                description: s.description,
                provider: {
                  "@type": "AccountingService",
                  name: "Tax4Sure",
                  url: "https://www.tax4sure.ca",
                },
                areaServed: {
                  "@type": "AdministrativeArea",
                  name: "Ontario, Canada",
                },
                url: `https://www.tax4sure.ca/services#${s.id}`,
              })),
              ...businessServices.map((s) => ({
                "@type": "Service",
                name: s.title,
                description: s.description,
                provider: {
                  "@type": "AccountingService",
                  name: "Tax4Sure",
                  url: "https://www.tax4sure.ca",
                },
                areaServed: {
                  "@type": "AdministrativeArea",
                  name: "Ontario, Canada",
                },
                url: `https://www.tax4sure.ca/services#${s.id}`,
              })),
            ],
          }),
        }}
      />

      {/* ── JSON-LD: BreadcrumbList ──────────────────────────────────────── */}
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
                item: "https://www.tax4sure.ca",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://www.tax4sure.ca/services",
              },
            ],
          }),
        }}
      />

      <HomeNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#091429] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-[#2B5BA8]/25 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-[420px] w-[420px] rounded-full bg-[#C9A84C]/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#1B3A7A]/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 text-sm text-white/50"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[#C9A84C]">Services</span>
            </nav>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
              <CheckCircle2 className="h-4 w-4" />
              Full-Service Tax &amp; Accounting Firm
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Tax Filing, Bookkeeping &amp;{" "}
              <span className="text-[#C9A84C]">Business Services</span>{" "}
              in Ontario
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-white/70 leading-relaxed sm:text-xl">
              From personal T1 returns and corporate T2 filings to corporation
              incorporation and CRA audit representation, Tax4Sure provides
              comprehensive, year-round tax and accounting services across
              Ontario and all of Canada.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3.5 text-base font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-all shadow-lg"
              >
                <PhoneCall className="h-4.5 w-4.5" />
                Book Free Consultation
              </Link>
              <a
                href="#tax-services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                Explore Our Services
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAX SERVICES ─────────────────────────────────────────────────── */}
      <section
        id="tax-services"
        className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
              Tax Services
            </p>
            <h2 className="text-3xl font-extrabold text-[#091429] sm:text-4xl">
              Personal &amp; Corporate Tax Filing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 leading-relaxed">
              Expert tax preparation for individuals, self-employed
              professionals, and Canadian corporations. Every return is
              reviewed for accuracy and filed electronically for fast
              processing.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {taxServices.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-lg hover:border-[#2B5BA8]/30 transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${service.bg} p-3 mb-5`}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: service.accent }}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#091429] mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: service.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B5BA8] hover:text-[#C9A84C] transition-colors"
                  >
                    Book Free Consultation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BUSINESS SERVICES ────────────────────────────────────────────── */}
      <section
        id="business-services"
        className="bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-3">
              Business Services
            </p>
            <h2 className="text-3xl font-extrabold text-[#091429] sm:text-4xl">
              Incorporation, Payroll &amp; Specialized Tax Services
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 leading-relaxed">
              Beyond annual returns, we help businesses and individuals with
              incorporation, payroll setup, CRA audit defence, rental income
              optimization, estate planning, and more.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {businessServices.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg hover:border-[#2B5BA8]/30 transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${service.bg} p-3 mb-4`}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: service.accent }}
                    />
                  </div>

                  <h3 className="text-base font-bold text-[#091429] mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {service.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-xs text-slate-500"
                      >
                        <CheckCircle2
                          className="h-3.5 w-3.5 mt-0.5 shrink-0"
                          style={{ color: service.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B5BA8] hover:text-[#C9A84C] transition-colors"
                  >
                    Book Free Consultation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE TAX4SURE ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#091429] sm:text-4xl">
              Why Clients Choose Tax4Sure
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 leading-relaxed">
              We combine deep Canadian tax expertise with a secure, modern
              client experience. Every engagement starts with a free
              consultation and ends with complete peace of mind.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "CRA Compliant & Accurate",
                text: "Every return is reviewed for accuracy before filing. We stay current with the latest CRA rules so you never pay more than you owe.",
              },
              {
                icon: CheckCircle2,
                title: "Fast Turnaround",
                text: "Most personal returns completed within 2-3 business days. Corporate filings handled well ahead of deadlines.",
              },
              {
                icon: GraduationCap,
                title: "Experienced Professionals",
                text: "Years of hands-on Canadian tax expertise on every file, big or small. Your return is always in knowledgeable hands.",
              },
              {
                icon: PhoneCall,
                title: "Free Consultation",
                text: "Every client starts with a no-obligation consultation. We listen, assess your needs, and recommend the right services.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center"
                >
                  <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl bg-[#2B5BA8]/10 p-3">
                    <Icon className="h-6 w-6 text-[#2B5BA8]" />
                  </div>
                  <h3 className="text-base font-bold text-[#091429] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#091429] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-[#2B5BA8]/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-[300px] w-[300px] rounded-full bg-[#C9A84C]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-20 md:py-28 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight">
            Ready to Get Started?
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            Whether you need help with a personal tax return, a corporate
            filing, or want to incorporate a new business, our team is here to
            help. Book a free, no-obligation consultation and let us take the
            stress out of your taxes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-4 text-base font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-all shadow-lg"
            >
              <PhoneCall className="h-5 w-5" />
              Book Free Consultation
            </Link>
            <a
              href="mailto:tax4sureca@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <Mail className="h-4.5 w-4.5" />
              Email Us Directly
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
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
                Your one-stop solution for personal tax, corporate tax, and
                business services across Canada.
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                Tax Services
              </h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li>
                  <a
                    href="#personal-tax"
                    className="hover:text-white transition-colors"
                  >
                    Personal Tax (T1)
                  </a>
                </li>
                <li>
                  <a
                    href="#self-employed"
                    className="hover:text-white transition-colors"
                  >
                    Self-Employed
                  </a>
                </li>
                <li>
                  <a
                    href="#corporate-tax"
                    className="hover:text-white transition-colors"
                  >
                    Corporate Tax (T2)
                  </a>
                </li>
                <li>
                  <a
                    href="#gst-hst"
                    className="hover:text-white transition-colors"
                  >
                    GST / HST Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#bookkeeping"
                    className="hover:text-white transition-colors"
                  >
                    Bookkeeping
                  </a>
                </li>
                <li>
                  <a
                    href="#tax-advisory"
                    className="hover:text-white transition-colors"
                  >
                    Tax Advisory
                  </a>
                </li>
              </ul>
            </div>

            {/* Business Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                Business Services
              </h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li>
                  <a
                    href="#incorporation"
                    className="hover:text-white transition-colors"
                  >
                    Corporation Incorporation
                  </a>
                </li>
                <li>
                  <a
                    href="#business-registration"
                    className="hover:text-white transition-colors"
                  >
                    Business Registration
                  </a>
                </li>
                <li>
                  <a
                    href="#payroll"
                    className="hover:text-white transition-colors"
                  >
                    Payroll &amp; T4
                  </a>
                </li>
                <li>
                  <a
                    href="#cra-audit"
                    className="hover:text-white transition-colors"
                  >
                    CRA Audit Support
                  </a>
                </li>
                <li>
                  <a
                    href="#rental-income"
                    className="hover:text-white transition-colors"
                  >
                    Rental Income (T776)
                  </a>
                </li>
                <li>
                  <a
                    href="#estate-trust"
                    className="hover:text-white transition-colors"
                  >
                    Estate &amp; Trust (T3)
                  </a>
                </li>
              </ul>
            </div>

            {/* Portal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                Client Portal
              </h3>
              <ul className="space-y-2.5 text-sm text-white/65">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Client Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-white transition-colors"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50 leading-relaxed">
                  Securely upload and manage your tax documents online —
                  available 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Tax4Sure. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Tax &amp; business services for individuals and corporations
              across Canada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
