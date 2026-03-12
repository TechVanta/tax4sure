"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, TrendingUp, FileText } from "lucide-react";
import { YearFolderCard, YearFolderCardSkeleton } from "@/components/dashboard/YearFolderCard";
import { TAX_YEARS } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { apiCall } from "@/lib/api-client";

interface YearStat {
  year: number;
  count: number;
  lastUpdated: string | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<YearStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiCall("/api/documents/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setStats(TAX_YEARS.map((year) => ({ year, count: 0, lastUpdated: null })));
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalFiles = stats.reduce((sum, s) => sum + s.count, 0);
  const activeYears = stats.filter((s) => s.count > 0).length;
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-navy-700">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Select a tax year to view or upload your documents.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700/10">
            <FolderOpen className="h-5 w-5 text-navy-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-700">{TAX_YEARS.length}</p>
            <p className="text-xs text-muted-foreground font-medium">Tax Years</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-700">{loading ? "—" : totalFiles}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Documents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100">
            <TrendingUp className="h-5 w-5 text-gold-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-700">{loading ? "—" : activeYears}</p>
            <p className="text-xs text-muted-foreground font-medium">Active Years</p>
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Tax Year Folders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? TAX_YEARS.map((year) => <YearFolderCardSkeleton key={year} />)
            : stats.map((stat, i) => (
                <YearFolderCard
                  key={stat.year}
                  year={stat.year}
                  fileCount={stat.count}
                  lastUpdated={stat.lastUpdated}
                  index={i}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
