"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  LogOut,
  FileText,
  Download,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { getAdminToken, clearAdminToken } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TAX_YEARS = ["2026", "2025", "2024", "2023", "2022"];

interface DocFile {
  id: string;
  name: string;
  size: string;
  createdTime: string;
  url: string;
}

function adminFetch(path: string) {
  const token = getAdminToken();
  return fetch(`${API_BASE}${path}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
}

function formatBytes(bytes: string) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function ClientDocuments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const [files, setFiles] = useState<Record<string, DocFile[]>>({});
  const [loadingYears, setLoadingYears] = useState<Set<string>>(new Set(TAX_YEARS));

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    if (!username) {
      router.replace("/admin/dashboard");
      return;
    }

    TAX_YEARS.forEach((year) => {
      adminFetch(`/api/admin/files?username=${encodeURIComponent(username)}&year=${year}`)
        .then((res) => {
          if (res.status === 401) {
            clearAdminToken();
            router.replace("/admin/login");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data) setFiles((prev) => ({ ...prev, [year]: data.files ?? [] }));
        })
        .catch(() => toast.error(`Failed to load ${year} files`))
        .finally(() =>
          setLoadingYears((prev) => {
            const next = new Set(prev);
            next.delete(year);
            return next;
          })
        );
    });
  }, [router, username]);

  const handleSignOut = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  const totalDocs = Object.values(files).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0D1F4E] shadow-lg border-b border-white/10">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Image src="/logo-white.svg" alt="Tax4Sure" width={160} height={44} priority />
            <span className="text-white/40 text-sm font-medium border-l border-white/20 pl-4">
              Admin Portal
            </span>
          </div>
          <Button
            variant="ghost"
            className="text-white/70 hover:bg-white/10 hover:text-white gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Clients
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-navy-700">{username}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-700">{username}</h1>
          <p className="text-muted-foreground text-sm">
            {totalDocs} document{totalDocs !== 1 ? "s" : ""} across all tax years
          </p>
        </div>

        <div className="space-y-4">
          {TAX_YEARS.map((year) => {
            const yearFiles = files[year] ?? [];
            const isYearLoading = loadingYears.has(year);

            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-navy-700" />
                    <span className="font-semibold text-navy-700">Tax Year {year}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                    {isYearLoading ? "..." : `${yearFiles.length} file${yearFiles.length !== 1 ? "s" : ""}`}
                  </span>
                </div>

                {isYearLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : yearFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No documents for {year}
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {yearFiles.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy-700 truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatBytes(file.size)} · {new Date(file.createdTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-navy-700 hover:text-gold-500 transition-colors shrink-0 ml-4"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AdminClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-700" />
      </div>
    }>
      <ClientDocuments />
    </Suspense>
  );
}
