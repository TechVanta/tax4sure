"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, CheckCheck, FileUp, RefreshCw, CreditCard, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "@/lib/api-client";
import { adminApiCall } from "@/lib/admin-auth";
import type { Notification } from "@/lib/types";

interface Props {
  isAdmin?: boolean;
}

function notifIcon(type: Notification["type"]) {
  switch (type) {
    case "document_request": return <RefreshCw className="h-4 w-4 text-amber-500" />;
    case "new_upload":       return <FileUp className="h-4 w-4 text-blue-500" />;
    case "payment_update":   return <CreditCard className="h-4 w-4 text-green-500" />;
    case "status_update":    return <Info className="h-4 w-4 text-purple-500" />;
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell({ isAdmin = false }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = isAdmin
        ? await adminApiCall("/api/notifications")
        : await apiCall("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      }
    } catch {
      // silently fail — bell is non-critical
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const body = JSON.stringify({ notificationIds: [] });
    if (isAdmin) {
      await adminApiCall("/api/notifications/read", { method: "PUT", body });
    } else {
      await apiCall("/api/notifications/read", { method: "PUT", body });
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#C9A84C] text-[10px] font-bold text-white flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-[#091429]">
                  Notifications
                  {unread > 0 && (
                    <span className="ml-2 text-xs font-medium text-[#C9A84C]">
                      {unread} new
                    </span>
                  )}
                </span>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[#091429] transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Bell className="h-8 w-8 text-gray-200 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notificationId}
                      className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${
                        n.read ? "opacity-60" : "bg-blue-50/40"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-700 leading-snug">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-[#C9A84C] shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
