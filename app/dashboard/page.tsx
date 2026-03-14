"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen, TrendingUp, FileText,
  Clock, CheckCircle2, AlertCircle, HelpCircle, CreditCard,
} from "lucide-react";
import { YearFolderCard, YearFolderCardSkeleton } from "@/components/dashboard/YearFolderCard";
import { TAX_YEARS } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { apiCall } from "@/lib/api-client";
import {
  SERVICE_TYPE_LABELS,
  type Case,
  type CaseStatus,
  type PaymentStatus,
} from "@/lib/types";

interface YearStat {
  year: number;
  count: number;
  lastUpdated: string | null;
}

const STATUS_CONFIG: Record<CaseStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  not_started:     { label: "Not Started",     icon: HelpCircle,    color: "text-gray-500",  bg: "bg-gray-50 border-gray-200"    },
  in_progress:     { label: "In Progress",     icon: Clock,         color: "text-blue-600",  bg: "bg-blue-50 border-blue-200"    },
  needs_documents: { label: "Needs Documents", icon: AlertCircle,   color: "text-amber-600", bg: "bg-amber-50 border-amber-200"  },
  done:            { label: "Done",            icon: CheckCircle2,  color: "text-green-600", bg: "bg-green-50 border-green-200"  },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Payment Pending", color: "text-amber-600" },
  paid:    { label: "Paid",            color: "text-green-600" },
  overdue: { label: "Payment Overdue", color: "text-red-600"   },
};

function CaseStatusCard({ c }: { c: Case }) {
  const status = STATUS_CONFIG[c.status];
  const payment = PAYMENT_CONFIG[c.paymentStatus];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${status.bg}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 shrink-0 ${status.color}`} />
          <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
        </div>
        <span className="text-xs text-muted-foreground bg-white/70 px-2 py-0.5 rounded-full border border-white/50">
          {c.year}
        </span>
      </div>

      <p className="text-sm font-semibold text-navy-700 leading-tight">
        {SERVICE_TYPE_LABELS[c.serviceType] ?? c.serviceType}
      </p>

      <div className="mt-2 flex items-center gap-1">
        <CreditCard className={`h-3 w-3 ${payment.color}`} />
        <span className={`text-xs font-medium ${payment.color}`}>{payment.label}</span>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<YearStat[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statsRes, casesRes] = await Promise.all([
          apiCall("/api/documents/stats"),
          apiCall("/api/cases"),
        ]);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }
        if (casesRes.ok) {
          const data = await casesRes.json();
          setCases(data.cases ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setStats(TAX_YEARS.map((year) => ({ year, count: 0, lastUpdated: null })));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const totalFiles = stats.reduce((sum, s) => sum + s.count, 0);
  const activeYears = stats.filter((s) => s.count > 0).length;
  const firstName = user?.name?.split(" ")[0] || "there";

  // Highlight if any case needs attention
  const needsAction = cases.filter((c) => c.status === "needs_documents").length;

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
          Here's a summary of your tax files and service status.
        </p>
      </motion.div>

      {/* Alert banner if documents are needed */}
      {needsAction > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3"
        >
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Additional documents are required for {needsAction} service{needsAction !== 1 ? "s" : ""}.
            Please upload them below.
          </p>
        </motion.div>
      )}

      {/* Stats row */}
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

      {/* My Services */}
      {cases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            My Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cases.map((c) => (
              <CaseStatusCard key={c.caseId} c={c} />
            ))}
          </div>
        </div>
      )}

      {/* Tax Year Folders */}
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
