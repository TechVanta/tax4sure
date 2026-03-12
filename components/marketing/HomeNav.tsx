"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function HomeNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0D1F4E]/95 backdrop-blur border-b border-white/10 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 flex h-18 items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo-white.svg" alt="Tax4Sure" width={190} height={53} priority />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#why-us"   className="hover:text-white transition-colors">Why Us</a>
          <a href="#contact"  className="hover:text-white transition-colors">Contact</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            Client Login
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2 text-sm font-bold text-[#0D1F4E] hover:bg-[#E8C060] transition-all shadow"
          >
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0D1F4E] px-6 py-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white py-1">Services</a>
          <a href="#why-us"   onClick={() => setOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white py-1">Why Us</a>
          <a href="#contact"  onClick={() => setOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white py-1">Contact</a>
          <Link href="/login" onClick={() => setOpen(false)} className="block text-sm font-semibold text-white/70 hover:text-white py-1">Client Login</Link>
        </div>
      )}
    </header>
  );
}
