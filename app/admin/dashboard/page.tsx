"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  FileText,
  ChevronRight,
  Loader2,
  Calendar,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { getAdminToken, clearAdminToken, adminApiCall } from "@/lib/admin-auth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import type { Case, PaymentStatus } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface Client {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
  totalDocs: number;
  lastUpload: string | null;
}

function adminFetch(path: string) {
  const token = getAdminToken();
  return fetch(`${API_BASE}${path}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
}

const paymentBadge: Record<PaymentStatus, { label: string; className: string }> = {
  paid:     { label: "Paid",     className: "bg-green-100 text-green-700" },
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700" },
  overdue:  { label: "Overdue",  className: "bg-red-100   text-red-700"   },
};

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin/login"); return; }

    Promise.all([
      adminFetch("/api/admin/clients")
        .then((res) => {
          if (res.status === 401) { clearAdminToken(); router.replace("/admin/login"); return null; }
          return res.json();
        }),
      adminApiCall("/api/cases")
        .then((res) => res.ok ? res.json() : { cases: [] }),
    ])
      .then(([clientData, caseData]) => {
        if (clientData) setClients(clientData.clients ?? []);
        setCases(caseData?.cases ?? []);
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  }, [router]);

  // Case stats
  const inProgress   = cases.filter((c) => c.status === "in_progress").length;
  const needsDocs    = cases.filter((c) => c.status === "needs_documents").length;
  const done         = cases.filter((c) => c.status === "done").length;
  const pendingPay   = cases.filter((c) => c.paymentStatus === "pending" || c.paymentStatus === "overdue").length;

  // Map username → worst payment status for that client
  const clientPayment: Record<string, PaymentStatus> = {};
  cases.forEach((c) => {
    const cur = clientPayment[c.username];
    if (c.paymentStatus === "overdue") clientPayment[c.username] = "overdue";
    else if (c.paymentStatus === "pending" && cur !== "overdue") clientPayment[c.username] = "pending";
    else if (!cur) clientPayment[c.username] = c.paymentStatus;
  });

  // Map username → case count
  const clientCaseCount: Record<string, number> = {};
  cases.forEach((c) => {
    clientCaseCount[c.username] = (clientCaseCount[c.username] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: Users,        color: "bg-navy-100",  iconColor: "text-navy-700", value: clients.length, label: "Total Clients" },
            { icon: FileText,     color: "bg-gold-100",  iconColor: "text-gold-600", value: clients.reduce((s, c) => s + c.totalDocs, 0), label: "Total Docs" },
            { icon: FolderOpen,   color: "bg-blue-50",   iconColor: "text-blue-600", value: clients.filter((c) => c.totalDocs > 0).length, label: "Active Clients" },
            { icon: Clock,        color: "bg-amber-50",  iconColor: "text-amber-600", value: inProgress, label: "In Progress" },
            { icon: AlertCircle,  color: "bg-orange-50", iconColor: "text-orange-500", value: needsDocs, label: "Needs Docs" },
            { icon: CheckCircle2, color: "bg-green-50",  iconColor: "text-green-600", value: done, label: "Completed" },
          ].map(({ icon: Icon, color, iconColor, value, label }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-navy-700">{isLoading ? "—" : value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending payments banner */}
        {!isLoading && pendingPay > 0 && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
            <CreditCard className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {pendingPay} case{pendingPay !== 1 ? "s" : ""} have pending or overdue payments.
            </p>
          </div>
        )}

        {/* Clients table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-navy-700">All Clients</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-navy-700" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-muted-foreground">No clients registered yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {clients
                .sort((a, b) => (b.lastUpload ?? "").localeCompare(a.lastUpload ?? ""))
                .map((client, i) => {
                  const pay = clientPayment[client.username];
                  const badge = pay ? paymentBadge[pay] : null;
                  const caseCount = clientCaseCount[client.username] ?? 0;

                  return (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/admin/clients?username=${encodeURIComponent(client.username)}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-[#091429] flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {client.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-navy-700">{client.fullName}</p>
                              {badge && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
                                  {badge.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="hidden sm:flex flex-col items-end gap-0.5">
                            <span className="text-sm font-semibold text-navy-700">
                              {client.totalDocs} doc{client.totalDocs !== 1 ? "s" : ""}
                              {caseCount > 0 && (
                                <span className="ml-2 text-xs text-muted-foreground font-normal">
                                  · {caseCount} case{caseCount !== 1 ? "s" : ""}
                                </span>
                              )}
                            </span>
                            {client.lastUpload ? (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(client.lastUpload).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">No uploads</span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-navy-700 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
