"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, LogIn } from "lucide-react";

export function HomeNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        scrolled ? "bg-[#091429]/98 shadow-lg backdrop-blur-sm" : "bg-[#091429]/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/logo-white.svg" alt="Tax4Sure" width={160} height={44} priority className="h-9 w-auto sm:h-11" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/70">
            <a href="/#services" className="hover:text-white transition-colors py-1">Services</a>
            <a href="/#why-us" className="hover:text-white transition-colors py-1">Why Us</a>
            <a href="/#tax-tips" className="hover:text-white transition-colors py-1">Tax Tips</a>
            <Link href="/contact" className="hover:text-white transition-colors py-1">Contact</Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              Client Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-all shadow"
            >
              Free Consultation <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile: compact login + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 bg-[#060e1f] px-4 py-3 space-y-0.5">
          {[
            { href: "/#services", label: "Services", isAnchor: true },
            { href: "/#why-us", label: "Why Us", isAnchor: true },
            { href: "/#tax-tips", label: "Tax Tips", isAnchor: true },
            { href: "/contact", label: "Contact", isAnchor: false },
          ].map((item) =>
            item.isAnchor ? (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
            )
          )}

          <div className="pt-3 pb-2 space-y-2 border-t border-white/10 mt-1">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-colors shadow"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
