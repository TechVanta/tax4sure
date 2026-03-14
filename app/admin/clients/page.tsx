"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Download,
  Loader2,
  FolderOpen,
  Plus,
  Trash2,
  Bell,
  X,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAdminToken, clearAdminToken, adminApiCall } from "@/lib/admin-auth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Button } from "@/components/ui/button";
import {
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  type Case,
  type CaseStatus,
  type PaymentStatus,
} from "@/lib/types";

import { TAX_YEARS as TAX_YEARS_NUM } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TAX_YEARS = [...TAX_YEARS_NUM].sort((a, b) => b - a).map(String);

interface DocFile {
  id: string; name: string; size: string; createdTime: string; url: string;
}

function adminFetch(path: string) {
  const token = getAdminToken();
  return fetch(`${API_BASE}${path}`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
}

function formatBytes(bytes: string) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

const STATUS_OPTIONS: { value: CaseStatus; label: string; color: string }[] = [
  { value: "not_started",      label: "Not Started",      color: "bg-gray-100 text-gray-600"    },
  { value: "in_progress",      label: "In Progress",      color: "bg-blue-100 text-blue-700"    },
  { value: "needs_documents",  label: "Needs Documents",  color: "bg-amber-100 text-amber-700"  },
  { value: "done",             label: "Done",             color: "bg-green-100 text-green-700"  },
];

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-700" },
  { value: "paid",    label: "Paid",    color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700"     },
];

function statusStyle(s: CaseStatus) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.color ?? "";
}
function payStyle(p: PaymentStatus) {
  return PAYMENT_OPTIONS.find((o) => o.value === p)?.color ?? "";
}

// ─── Add Case Modal ────────────────────────────────────────────────────────────

interface AddCaseModalProps {
  username: string;
  onClose: () => void;
  onCreated: (c: Case) => void;
}

function AddCaseModal({ username, onClose, onCreated }: AddCaseModalProps) {
  const [serviceType, setServiceType] = useState("personal-tax");
  const [year, setYear] = useState(TAX_YEARS[1]);
  const [status, setStatus] = useState<CaseStatus>("not_started");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await adminApiCall("/api/cases", {
        method: "POST",
        body: JSON.stringify({ username, serviceType, year, status, paymentStatus, adminNotes }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success("Case created");
      onCreated(data.case);
    } catch {
      toast.error("Failed to create case");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-navy-700">Add New Case</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
            >
              {TAX_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
              >
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
              >
                {PAYMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes (not visible to client)"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 bg-[#091429] hover:bg-[#0D1F4E] text-white"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Case"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Case Card ────────────────────────────────────────────────────────────────

interface CaseCardProps {
  theCase: Case;
  onUpdate: (updated: Case) => void;
  onDelete: (caseId: string) => void;
}

function CaseCard({ theCase, onUpdate, onDelete }: CaseCardProps) {
  const [status, setStatus] = useState<CaseStatus>(theCase.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(theCase.paymentStatus);
  const [adminNotes, setAdminNotes] = useState(theCase.adminNotes);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const isDirty =
    status !== theCase.status ||
    paymentStatus !== theCase.paymentStatus ||
    adminNotes !== theCase.adminNotes;

  const handleRequestDocuments = async () => {
    setRequesting(true);
    try {
      const res = await adminApiCall(`/api/cases/${theCase.caseId}/request-documents`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      toast.success(`Document request sent to ${theCase.username}`);
    } catch {
      toast.error("Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this case?")) return;
    try {
      const res = await adminApiCall(`/api/cases/${theCase.caseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      onDelete(theCase.caseId);
      toast.success("Case deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Also send a status_update notification when status changes on save
  const handleSaveWithNotify = async () => {
    setSaving(true);
    try {
      const res = await adminApiCall(`/api/cases/${theCase.caseId}`, {
        method: "PUT",
        body: JSON.stringify({ status, paymentStatus, adminNotes }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onUpdate(data.case);

      // Send notification if status changed
      if (status !== theCase.status) {
        const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
        const serviceLabel = SERVICE_TYPE_LABELS[theCase.serviceType] ?? theCase.serviceType;
        await adminApiCall("/api/notifications", {
          method: "POST",
          body: JSON.stringify({
            recipientUsername: theCase.username,
            type: "status_update",
            message: `Your ${serviceLabel} (${theCase.year}) has been updated to: ${statusLabel}.`,
            caseId: theCase.caseId,
          }),
        });
      }

      // Send notification if payment status changed
      if (paymentStatus !== theCase.paymentStatus) {
        const payLabel = PAYMENT_OPTIONS.find((o) => o.value === paymentStatus)?.label ?? paymentStatus;
        const serviceLabel = SERVICE_TYPE_LABELS[theCase.serviceType] ?? theCase.serviceType;
        await adminApiCall("/api/notifications", {
          method: "POST",
          body: JSON.stringify({
            recipientUsername: theCase.username,
            type: "payment_update",
            message: `Payment status for your ${serviceLabel} (${theCase.year}) is now: ${payLabel}.`,
            caseId: theCase.caseId,
          }),
        });
      }

      toast.success("Case updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50/60 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-navy-700 text-sm">
            {SERVICE_TYPE_LABELS[theCase.serviceType] ?? theCase.serviceType}
          </span>
          <span className="text-xs text-muted-foreground bg-gray-200 px-2 py-0.5 rounded-full">
            {theCase.year}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle(status)}`}>
            {STATUS_OPTIONS.find((o) => o.value === status)?.label}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${payStyle(paymentStatus)}`}>
            {PAYMENT_OPTIONS.find((o) => o.value === paymentStatus)?.label}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-300 hover:text-red-400 transition-colors"
          title="Delete case"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              File Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Payment Status
            </label>
            <div className="flex gap-2">
              {PAYMENT_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setPaymentStatus(o.value)}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${
                    paymentStatus === o.value
                      ? `${o.color} border-transparent ring-2 ring-offset-1 ring-current`
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes (collapsible) */}
        <div>
          <button
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-navy-700 transition-colors"
            onClick={() => setNotesExpanded((v) => !v)}
          >
            Admin Notes
            {notesExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {notesExpanded && (
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes (not visible to client)"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 resize-none"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50"
            onClick={handleRequestDocuments}
            disabled={requesting}
          >
            {requesting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
            Request Documents
          </Button>

          {isDirty && (
            <Button
              size="sm"
              className="gap-1.5 bg-[#091429] hover:bg-[#0D1F4E] text-white"
              onClick={handleSaveWithNotify}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ClientDocuments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const [files, setFiles] = useState<Record<string, DocFile[]>>({});
  const [loadingYears, setLoadingYears] = useState<Set<string>>(new Set(TAX_YEARS));
  const [cases, setCases] = useState<Case[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [showAddCase, setShowAddCase] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) { router.replace("/admin/login"); return; }
    if (!username) { router.replace("/admin/dashboard"); return; }

    // Load files
    TAX_YEARS.forEach((year) => {
      adminFetch(`/api/admin/files?username=${encodeURIComponent(username)}&year=${year}`)
        .then((res) => {
          if (res.status === 401) { clearAdminToken(); router.replace("/admin/login"); return null; }
          return res.json();
        })
        .then((data) => { if (data) setFiles((prev) => ({ ...prev, [year]: data.files ?? [] })); })
        .catch(() => toast.error(`Failed to load ${year} files`))
        .finally(() => setLoadingYears((prev) => { const next = new Set(prev); next.delete(year); return next; }));
    });

    // Load cases
    adminApiCall(`/api/cases?username=${encodeURIComponent(username)}`)
      .then((res) => res.ok ? res.json() : { cases: [] })
      .then((data) => setCases(data.cases ?? []))
      .catch(() => {})
      .finally(() => setLoadingCases(false));
  }, [router, username]);

  const totalDocs = Object.values(files).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            All Clients
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-navy-700">{username}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-700">{username}</h1>
          <p className="text-muted-foreground text-sm">
            {totalDocs} document{totalDocs !== 1 ? "s" : ""} · {cases.length} case{cases.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Cases Section ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy-700">Cases</h2>
            <Button
              size="sm"
              className="gap-1.5 bg-[#091429] hover:bg-[#0D1F4E] text-white"
              onClick={() => setShowAddCase(true)}
            >
              <Plus className="h-4 w-4" />
              Add Case
            </Button>
          </div>

          {loadingCases ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-navy-700" />
            </div>
          ) : cases.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-10 text-center">
              <FolderOpen className="h-10 w-10 text-gray-200 mb-2" />
              <p className="text-sm text-muted-foreground">No cases yet.</p>
              <button
                className="mt-2 text-sm text-[#2B5BA8] hover:text-navy-700 font-medium"
                onClick={() => setShowAddCase(true)}
              >
                Add the first case →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cases.map((c) => (
                <CaseCard
                  key={c.caseId}
                  theCase={c}
                  onUpdate={(updated) =>
                    setCases((prev) => prev.map((x) => (x.caseId === updated.caseId ? updated : x)))
                  }
                  onDelete={(id) => setCases((prev) => prev.filter((x) => x.caseId !== id))}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Documents by Year Section ── */}
        <div>
          <h2 className="text-lg font-bold text-navy-700 mb-4">Uploaded Documents</h2>
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
                    <p className="text-sm text-muted-foreground text-center py-6">No documents for {year}</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {yearFiles.map((file) => (
                        <li key={file.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
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
        </div>
      </main>

      {showAddCase && (
        <AddCaseModal
          username={username}
          onClose={() => setShowAddCase(false)}
          onCreated={(c) => { setCases((prev) => [...prev, c]); setShowAddCase(false); }}
        />
      )}
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
