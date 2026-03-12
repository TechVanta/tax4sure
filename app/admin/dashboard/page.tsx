"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  FileText,
  LogOut,
  ChevronRight,
  Loader2,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { getAdminToken, clearAdminToken } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

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
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    adminFetch("/api/admin/clients")
      .then((res) => {
        if (res.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setClients(data.clients ?? []);
      })
      .catch(() => toast.error("Failed to load clients"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleSignOut = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
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
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-navy-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-700">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gold-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-700">
                {clients.reduce((sum, c) => sum + c.totalDocs, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-700">
                {clients.filter((c) => c.totalDocs > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
          </div>
        </div>

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
                .map((client, i) => (
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
                        <div className="h-10 w-10 rounded-full bg-[#0D1F4E] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {client.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-navy-700">{client.fullName}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="text-sm font-semibold text-navy-700">
                            {client.totalDocs} doc{client.totalDocs !== 1 ? "s" : ""}
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
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
