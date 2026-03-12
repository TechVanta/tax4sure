"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Home,
  X,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TAX_YEARS } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  ...TAX_YEARS.map((year) => ({
    href: `/dashboard/${year}`,
    label: `Tax Year ${year}`,
    icon: FolderOpen,
  })),
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
          Navigation
        </p>

        <div className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#C9A84C] text-white shadow-sm"
                    : "text-white/70 hover:bg-[#2B5BA8]/40 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
            Resources
          </p>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Tax Guidelines</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-xs text-white/30 text-center">
          © 2026 Tax4Sure. All rights reserved.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-[#0D1F4E] shrink-0 h-full border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0D1F4E] md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <Image
                  src="/logo-white.svg"
                  alt="Tax4Sure"
                  width={170}
                  height={47}
                />
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
