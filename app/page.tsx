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
  TrendingUp,
  PiggyBank,
  CalendarCheck,
  DollarSign,
  Quote,
  Building,
  FileText,
  Users,
  Shield,
  Home,
  Globe,
  Heart,
  FolderOpen,
  Gift,
} from "lucide-react";
import { HomeNav } from "@/components/marketing/HomeNav";
import { NewsletterBanner } from "@/components/marketing/NewsletterBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax4Sure | Canadian Tax Filing, Business Registration & CPA Services in Ontario",
  description:
    "Tax4Sure — Ontario's trusted tax & accounting firm. T1 personal returns, T2 corporate tax, GST/HST filing, corporation incorporation, business registration, CRA audit support, bookkeeping & payroll. Free consultation. Secure client portal.",
  keywords: [
    "Canadian tax filing",
    "T1 personal tax return",
    "T2 corporate tax return",
    "GST HST returns Canada",
    "business registration Ontario",
    "corporation incorporation Ontario",
    "incorporate business Canada",
    "CRA audit help Ontario",
    "CPA Ontario",
    "tax accountant Ontario",
    "bookkeeping Ontario",
    "payroll services Ontario",
    "self-employed tax Canada",
    "rental income tax Canada",
    "non-resident tax Canada",
    "estate tax T3 Canada",
    "disability tax credit Canada",
    "tax advisor Ontario",
    "tax filing near me Ontario",
    "best tax accountant Canada",
    "affordable tax filing Ontario",
    "online tax filing Canada 2026",
    "small business tax accountant Ontario",
    "RRSP tax deduction Canada",
    "tax4sure",
    "tax4sure.ca",
  ],
  alternates: { canonical: "https://www.tax4sure.ca/" },
  openGraph: {
    title: "Tax4Sure | Canadian Tax Filing, Business Registration & CPA Services",
    description:
      "Ontario's trusted tax & accounting firm — T1, T2, GST/HST, corporation incorporation, business registration, CRA audit support, bookkeeping & more. Free consultation.",
    url: "https://www.tax4sure.ca/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tax4Sure – Canadian Tax Filing & Accounting Services in Ontario",
      },
    ],
  },
};

/* ── Featured Services ──────────────────────────────────────────────────────── */
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

/* ── Additional Services ────────────────────────────────────────────────────── */
const additionalServices = [
  {
    icon: Building,
    title: "Corporation Incorporation",
    description:
      "Federal (CBCA) or Ontario (OBCA) incorporation, NUANS name search, articles of incorporation, and corporate minute book setup.",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/10 to-[#0D1F4E]/5",
  },
  {
    icon: FileText,
    title: "Business Registration (Ontario)",
    description:
      "Ontario Master Business Licence for sole proprietors, partnerships, and operating names. Fast, accurate ServiceOntario registration.",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-[#C9A84C]/5",
  },
  {
    icon: Users,
    title: "Payroll & T4 Preparation",
    description:
      "Full payroll setup, source deduction remittances, T4/T4 Summary filing, ROE preparation, and CRA payroll account registration.",
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
  },
  {
    icon: Shield,
    title: "CRA Audit Representation",
    description:
      "Professional representation during CRA audits, reviews, and appeals. We communicate with CRA on your behalf to protect your interests.",
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/10 to-[#2B5BA8]/5",
  },
  {
    icon: Home,
    title: "Rental Property Income",
    description:
      "T776 rental income returns, principal residence exemptions, capital cost allowance on rental properties, and HST on new builds.",
    accent: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-[#C9A84C]/5",
  },
  {
    icon: FolderOpen,
    title: "Estate & Trust Tax (T3)",
    description:
      "T3 trust returns for estates, testamentary trusts, and inter vivos trusts. Estate administration and post-death tax planning.",
    accent: "#2B5BA8",
    bg: "from-[#2B5BA8]/10 to-[#0D1F4E]/5",
  },
  {
    icon: Globe,
    title: "Non-Resident & Newcomer Tax",
    description:
      "Section 116 non-resident withholding, NR4 reporting, departure returns, and first-year Canadian tax filing for newcomers to Canada.",
    accent: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
  },
  {
    icon: Heart,
    title: "Disability Tax Credit (DTC)",
    description:
      "DTC applications, retroactive claims, Child Disability Benefit optimization, and Registered Disability Savings Plan (RDSP) advice.",
    accent: "#4A7DB8",
    bg: "from-[#4A7DB8]/10 to-[#2B5BA8]/5",
  },
];

/* ── Trust pillars ──────────────────────────────────────────────────────────── */
const pillars = [
  {
    icon: ShieldCheck,
    title: "CRA Compliant & Accurate",
    description:
      "Every return reviewed for accuracy before filing. We stay current with the latest CRA rules so you never pay more than you owe.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Most personal returns completed within 2–3 business days. Corporate filings handled well ahead of deadlines.",
  },
  {
    icon: BadgeCheck,
    title: "Experienced Tax Experts",
    description:
      "Years of hands-on Canadian tax expertise on every file, big or small — your return is always in knowledgeable hands.",
  },
  {
    icon: FileCheck,
    title: "Secure Client Portal",
    description:
      "Share documents safely through our encrypted portal. No email attachments — just peace of mind from upload to filing.",
  },
];

/* ── Canadian Tax Knowledge Blocks ─────────────────────────────────────────── */
const taxTips = [
  {
    icon: PiggyBank,
    color: "#2B5BA8",
    bg: "from-[#2B5BA8]/10 to-[#0D1F4E]/5",
    tag: "RRSP",
    title: "RRSP: Your Most Powerful Tax Tool",
    bullets: [
      "Contributions reduce your taxable income dollar-for-dollar",
      "2024 contribution limit: 18% of prior year earned income, up to $31,560",
      "Deadline for 2024 tax year: March 3, 2025",
      "Unused room carries forward indefinitely — it's never too late to catch up",
      "Spousal RRSP can reduce your family's combined tax bill in retirement",
    ],
    cta: "Learn how RRSP contributions maximize your refund",
  },
  {
    icon: CalendarCheck,
    color: "#C9A84C",
    bg: "from-[#C9A84C]/10 to-[#C9A84C]/5",
    tag: "Deadlines",
    title: "Key Canadian Tax Deadlines",
    bullets: [
      "April 30 — Personal tax (T1) filing & payment deadline",
      "June 15 — Extended filing for self-employed (but taxes owed still due April 30)",
      "6 months after fiscal year-end — Corporate tax (T2) return due",
      "3 months after fiscal year-end — Corporate taxes owed",
      "Quarterly or annually — GST/HST remittance depending on your filing frequency",
    ],
    cta: "Never miss a deadline — we track them for you",
  },
  {
    icon: TrendingUp,
    color: "#0D1F4E",
    bg: "from-[#0D1F4E]/10 to-[#2B5BA8]/5",
    tag: "Investments",
    title: "Investment Income & Capital Gains",
    bullets: [
      "Only 50% of capital gains are included in taxable income (inclusion rate)",
      "TFSA withdrawals are 100% tax-free — always maximize your annual room ($7,000 in 2024)",
      "Dividend income from Canadian corporations gets a tax credit — more efficient than interest",
      "Capital losses can offset capital gains — don't let losses go to waste",
      "Foreign income must be reported — but foreign tax credits prevent double taxation",
    ],
    cta: "Optimize your investment tax strategy",
  },
  {
    icon: DollarSign,
    color: "#4A7DB8",
    bg: "from-[#4A7DB8]/10 to-[#2B5BA8]/5",
    tag: "Self-Employed",
    title: "Self-Employed Tax Deductions",
    bullets: [
      "Home office expenses: dedicated workspace = deductible proportion of rent/utilities",
      "Vehicle expenses: track business km — deduct the business-use percentage",
      "Professional development, tools, software, and subscriptions are all deductible",
      "Health & dental premiums can be deducted as business expenses",
      "Register for GST/HST once revenue exceeds $30,000 — and collect input tax credits",
    ],
    cta: "Keep more of what you earn as a self-employed professional",
  },
];

/* ── Testimonials ───────────────────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Sarah M.",
    location: "Toronto, ON",
    text: "Tax4Sure made filing my T1 incredibly easy. They found deductions I didn't even know existed and got me a much bigger refund than I expected. Highly recommend!",
    rating: 5,
  },
  {
    name: "Raj P.",
    location: "Brampton, ON",
    text: "As a self-employed consultant, taxes were always stressful. Tax4Sure handles everything — GST, T2125, quarterly remittances. I can focus on my business knowing taxes are covered.",
    rating: 5,
  },
  {
    name: "Linda K.",
    location: "Mississauga, ON",
    text: "The secure portal is so convenient. I uploaded all my documents from my phone and everything was handled quickly. Professional, fast, and great value for the price.",
    rating: 5,
  },
];

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* JSON-LD: AccountingService + Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AccountingService",
            "@id": "https://www.tax4sure.ca/#business",
            name: "Tax4Sure",
            alternateName: "Tax4Sure Canada",
            description:
              "Professional Canadian tax filing and accounting services including T1 personal tax, T2 corporate tax, GST/HST filing, corporation incorporation, Ontario business registration, CRA audit support, bookkeeping, payroll, and tax advisory.",
            url: "https://www.tax4sure.ca",
            logo: "https://www.tax4sure.ca/logo.svg",
            image: "https://www.tax4sure.ca/og-image.png",
            email: "tax4sureca@gmail.com",
            priceRange: "$$",
            currenciesAccepted: "CAD",
            paymentAccepted: "E-Transfer, Credit Card",
            areaServed: [
              { "@type": "Country", name: "Canada" },
              {
                "@type": "AdministrativeArea",
                name: "Ontario",
                containedInPlace: { "@type": "Country", name: "Canada" },
              },
            ],
            serviceType: [
              "Personal Tax Return (T1)",
              "Corporate Tax Return (T2)",
              "GST/HST Filing",
              "Bookkeeping",
              "Tax Advisory",
              "Self-Employed Tax Filing",
              "Corporation Incorporation",
              "Business Registration Ontario",
              "Payroll and T4 Preparation",
              "CRA Audit Representation",
              "Rental Property Income T776",
              "Estate and Trust Tax T3",
              "Non-Resident Tax Filing",
              "Disability Tax Credit Application",
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Tax & Accounting Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Personal Tax Return (T1)",
                    description: "Complete T1 personal income tax preparation and e-filing for Canadian individuals.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Corporate Tax Return (T2)",
                    description: "T2 corporate income tax filing for Canadian corporations, including financial statements.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Corporation Incorporation",
                    description: "Federal (CBCA) and Ontario (OBCA) corporation incorporation services with NUANS name search.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Free Tax Consultation",
                    description: "Complimentary no-obligation tax consultation for individuals and businesses.",
                    price: "0",
                    priceCurrency: "CAD",
                  },
                },
              ],
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5.0",
              reviewCount: "3",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Sarah M." },
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                reviewBody: "Tax4Sure made filing my T1 incredibly easy. They found deductions I didn't even know existed and got me a much bigger refund than I expected. Highly recommend!",
              },
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Raj P." },
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                reviewBody: "As a self-employed consultant, taxes were always stressful. Tax4Sure handles everything — GST, T2125, quarterly remittances. I can focus on my business knowing taxes are covered.",
              },
              {
                "@type": "Review",
                author: { "@type": "Person", name: "Linda K." },
                reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                reviewBody: "The secure portal is so convenient. I uploaded all my documents from my phone and everything was handled quickly. Professional, fast, and great value for the price.",
              },
            ],
            sameAs: [],
          }),
        }}
      />

      {/* JSON-LD: FAQPage (enables Google FAQ rich snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the deadline for filing taxes in Canada?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For most individuals, the personal tax (T1) filing deadline is April 30. Self-employed individuals have until June 15 to file, though any taxes owed are still due April 30. Corporate tax (T2) returns are due 6 months after the end of the corporation's fiscal year.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between a T1 and T2 tax return?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A T1 is the personal income tax return filed by individuals — employees, retirees, and self-employed people. A T2 is the corporate income tax return filed annually by all resident corporations in Canada.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to register for GST/HST?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You must register if your business revenues exceed $30,000 in a single calendar quarter or over four consecutive quarters. Voluntary registration is also available. Once registered, you collect and remit GST/HST to the CRA periodically.",
                },
              },
              {
                "@type": "Question",
                name: "What documents do I need for my personal tax return?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Commonly needed: T4 slips (employment income), T3/T5 slips (investment income), RRSP contribution receipts, medical expense receipts, charitable donation receipts, tuition slips (T2202), and business income/expense records if self-employed.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between federal and Ontario provincial incorporation?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Federal incorporation under the Canada Business Corporations Act (CBCA) lets your corporation operate across all provinces under one name, but requires extra-provincial registration in each province where you do business. Ontario incorporation under the Business Corporations Act (OBCA) is simpler and lower cost if you only operate in Ontario. Tax4Sure helps you choose the right structure and handles all the paperwork.",
                },
              },
              {
                "@type": "Question",
                name: "How do I register a business name in Ontario?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sole proprietors and partnerships operating under a name other than their own legal name must register a Master Business Licence with ServiceOntario. Registration is valid for 5 years. If you are incorporating, you'll also need a NUANS name search. Tax4Sure handles Ontario business registrations quickly and accurately.",
                },
              },
              {
                "@type": "Question",
                name: "Can Tax4Sure help me if I receive a letter from CRA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely. CRA letters range from simple information requests to full audits. We review the notice, gather required documentation, and respond to CRA on your behalf. Our goal is to resolve CRA matters quickly and protect your interests.",
                },
              },
              {
                "@type": "Question",
                name: "How does the secure client portal work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Create a free account, log in, and upload your documents directly to your private vault. Documents are organized by tax year and encrypted — only you and your Tax4Sure professional can access them.",
                },
              },
              {
                "@type": "Question",
                name: "Can I claim home office expenses as an employee?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, if you were required to work from home and your employer certified this with a T2200. You can deduct a portion of rent, utilities, internet, and other expenses proportional to your workspace area.",
                },
              },
            ],
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
                item: "https://www.tax4sure.ca",
              },
            ],
          }),
        }}
      />

      {/* JSON-LD: WebSite (enables sitelinks search box in Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Tax4Sure",
            url: "https://www.tax4sure.ca",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.tax4sure.ca/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
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

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
              <Star className="h-3.5 w-3.5 fill-[#C9A84C]" />
              Canadian Tax Professionals
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Tax, Accounting &amp;<br />
              <span className="text-[#C9A84C]">Business Services.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
              From personal tax returns to incorporating your business — Tax4Sure handles
              every aspect of your Canadian tax and business obligations, all year round.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-4 text-base font-bold text-[#0D1F4E] shadow-lg hover:bg-[#E8C060] transition-all hover:scale-[1.02] active:scale-95"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                Client Login <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <div className="border-y border-gray-100 bg-white py-5">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { Icon: BadgeCheck, text: "Canadian Tax Experts" },
              { Icon: ShieldCheck, text: "Secure Encrypted Portal" },
              { Icon: Building, text: "Incorporation & Business Registration" },
              { Icon: FileCheck, text: "T1 · T2 · GST/HST · Payroll" },
              { Icon: Clock, text: "Year-Round Support" },
              { Icon: BadgeCheck, text: "CRA-Compliant E-Filing" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-xs font-medium text-gray-500 sm:text-sm">
                <item.Icon className="h-4 w-4 text-[#2B5BA8]" strokeWidth={2} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED SERVICES ─────────────────────────────────────────────── */}
      <section id="services" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">
              What We Do
            </p>
            <h2 className="text-3xl font-black text-[#0D1F4E] sm:text-4xl md:text-5xl">
              Full-Service Tax &amp; Accounting
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
              From personal returns to corporate filings, we handle every aspect
              of your Canadian tax obligations with precision and care.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:p-8"
                >
                  {svc.badge && (
                    <span className="absolute top-5 right-5 rounded-full bg-[#C9A84C]/15 px-3 py-1 text-xs font-bold text-[#C9A84C]">
                      {svc.badge}
                    </span>
                  )}
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${svc.bg}`}>
                    <Icon className="h-7 w-7" style={{ color: svc.accent }} strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#0D1F4E] sm:text-xl">{svc.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-500">{svc.description}</p>
                  <Link
                    href="/contact"
                    className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#2B5BA8] group-hover:gap-2 transition-all duration-200"
                  >
                    Get started <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ───────────────────────────────────────────── */}
      <section id="more-services" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">
              Full-Service Firm
            </p>
            <h2 className="text-2xl font-black text-[#0D1F4E] sm:text-3xl md:text-4xl">
              More Services We Offer
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              From incorporating your corporation to resolving CRA disputes — we handle the full spectrum.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="group flex flex-col rounded-xl border border-gray-100 bg-gray-50 p-5 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${svc.bg}`}>
                    <Icon className="h-5 w-5" style={{ color: svc.accent }} strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-[#0D1F4E]">{svc.title}</h3>
                  <p className="flex-1 text-xs leading-relaxed text-gray-500">{svc.description}</p>
                  <Link
                    href="/contact"
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#2B5BA8] group-hover:gap-2 transition-all"
                  >
                    Enquire <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section id="why-us" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">
                Why Tax4Sure
              </p>
              <h2 className="text-3xl font-black leading-tight text-[#0D1F4E] sm:text-4xl md:text-5xl">
                Your taxes &amp; business.<br />
                <span className="text-[#2B5BA8]">Our expertise.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-500 sm:text-lg">
                We combine deep Canadian tax knowledge with a modern, secure client
                experience. No waiting rooms, no paper piles — just accurate returns,
                smooth incorporations, and a team that has your back every step of the way.
              </p>

              <ul className="mt-7 space-y-3.5">
                {[
                  "T1, T2, HST/GST, payroll — all in one firm",
                  "Incorporation & business registration in Ontario",
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
                href="/contact"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#0D1F4E] px-7 py-4 text-sm font-bold text-white hover:bg-[#1B3A7A] transition-all"
              >
                Book a Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all sm:p-6"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D1F4E]">
                      <Icon className="h-5 w-5 text-[#C9A84C]" />
                    </div>
                    <h4 className="mb-2 text-sm font-bold text-[#0D1F4E] sm:text-base">{p.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">{p.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CANADIAN TAX KNOWLEDGE BLOCKS ────────────────────────────────── */}
      <section id="tax-tips" className="bg-[#f5f7fb] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">
              Canadian Tax Insights
            </p>
            <h2 className="text-3xl font-black text-[#0D1F4E] sm:text-4xl md:text-5xl">
              What Every Canadian Should Know
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 sm:text-lg">
              Essential tax knowledge to help you make smarter financial decisions year-round.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {taxTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 sm:p-8"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tip.bg}`}>
                      <Icon className="h-6 w-6" style={{ color: tip.color }} strokeWidth={1.8} />
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${tip.color}18`, color: tip.color }}
                    >
                      {tip.tag}
                    </span>
                  </div>

                  <h3 className="mb-4 text-lg font-bold text-[#0D1F4E] sm:text-xl">{tip.title}</h3>

                  <ul className="space-y-2.5">
                    {tip.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                        <span className="text-sm leading-relaxed text-gray-600">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <Link
                      href="/contact"
                      className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200"
                      style={{ color: tip.color }}
                    >
                      {tip.cta} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">
              Client Stories
            </p>
            <h2 className="text-3xl font-black text-[#0D1F4E] sm:text-4xl">
              Trusted by Canadians Across the Country
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-[#C9A84C]/30 hover:shadow-md transition-all sm:p-7"
              >
                <Quote className="absolute top-5 right-5 h-8 w-8 text-[#C9A84C]/20" />
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D1F4E] text-xs font-bold text-[#C9A84C]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D1F4E]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / LEAD MAGNET ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#091429] py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#C9A84C]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
            <Gift className="h-3.5 w-3.5" />
            Free Resource
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl md:text-4xl">
            Get Your Free 2024 Canadian<br />
            <span className="text-[#C9A84C]">Tax Deductions Checklist</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/65 sm:text-base">
            Over 40 often-missed deductions for individuals, self-employed, and small
            business owners — straight to your inbox, no obligation.
          </p>
          <div className="mt-8">
            <NewsletterBanner />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] sm:text-sm">Common Questions</p>
            <h2 className="text-3xl font-black text-[#0D1F4E] sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "What is the deadline for filing taxes in Canada?",
                a: "For most individuals, the personal tax (T1) filing deadline is April 30. Self-employed individuals have until June 15 to file, though any taxes owed are still due April 30. Corporate tax (T2) returns are due 6 months after the end of the corporation's fiscal year.",
              },
              {
                q: "What is the difference between a T1 and T2 tax return?",
                a: "A T1 is the personal income tax return filed by individuals — employees, retirees, and self-employed people. A T2 is the corporate income tax return filed annually by all resident corporations in Canada.",
              },
              {
                q: "Do I need to register for GST/HST?",
                a: "You must register if your business revenues exceed $30,000 in a single calendar quarter or over four consecutive quarters. Voluntary registration is also available. Once registered, you collect and remit GST/HST to the CRA periodically.",
              },
              {
                q: "What documents do I need for my personal tax return?",
                a: "Commonly needed: T4 slips (employment income), T3/T5 slips (investment income), RRSP contribution receipts, medical expense receipts, charitable donation receipts, tuition slips (T2202), and business income/expense records if self-employed.",
              },
              {
                q: "What is the difference between federal and Ontario provincial incorporation?",
                a: "Federal incorporation under the Canada Business Corporations Act (CBCA) lets your corporation operate across all provinces under one name, but requires extra-provincial registration in each province where you do business. Ontario incorporation under the Business Corporations Act (OBCA) is simpler and lower cost if you only operate in Ontario. Tax4Sure helps you choose the right structure and handles all the paperwork.",
              },
              {
                q: "How do I register a business name in Ontario?",
                a: "Sole proprietors and partnerships operating under a name other than their own legal name must register a Master Business Licence with ServiceOntario. Registration is valid for 5 years. If you are incorporating, you'll also need a NUANS name search. Tax4Sure handles Ontario business registrations quickly and accurately.",
              },
              {
                q: "Can Tax4Sure help me if I receive a letter from CRA?",
                a: "Absolutely. CRA letters range from simple information requests to full audits. We review the notice, gather required documentation, and respond to CRA on your behalf. Our goal is to resolve CRA matters quickly and protect your interests — no need to deal with CRA alone.",
              },
              {
                q: "How does the secure client portal work?",
                a: "Create a free account, log in, and upload your documents directly to your private vault. Documents are organized by tax year and encrypted — only you and your Tax4Sure professional can access them.",
              },
              {
                q: "Can I claim home office expenses as an employee?",
                a: "Yes, if you were required to work from home and your employer certified this with a T2200. You can deduct a portion of rent, utilities, internet, and other expenses proportional to your workspace area.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-100 bg-white open:shadow-sm transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-[#0D1F4E] list-none sm:px-6 sm:text-base">
                  {item.q}
                  <span className="ml-4 shrink-0 text-[#C9A84C] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-5 pb-5 pt-1 text-sm leading-relaxed text-gray-500 sm:px-6">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section id="contact" className="relative overflow-hidden bg-[#091429] py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-[#C9A84C]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[260px] w-[260px] rounded-full bg-[#2B5BA8]/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/15 px-4 py-1.5 text-sm font-semibold text-[#C9A84C]">
            <PhoneCall className="h-3.5 w-3.5" />
            Free Consultation — No Obligation
          </div>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Ready to get started?<br />
            <span className="text-[#C9A84C]">We&apos;re here to help.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/65 sm:text-lg">
            Talk to a Tax4Sure professional today — no commitment, no pressure.
            Whether it&apos;s taxes, bookkeeping, or incorporating your business,
            we&apos;ll assess your situation and tell you exactly what you need.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-8 py-4 text-base font-bold text-[#0D1F4E] shadow-lg hover:bg-[#E8C060] transition-all hover:scale-[1.02]"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
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
              © {new Date().getFullYear()} Tax4Sure. All rights reserved.
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
