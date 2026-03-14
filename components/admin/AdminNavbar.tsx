"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { clearAdminToken } from "@/lib/admin-auth";

export function AdminNavbar() {
  const router = useRouter();

  const handleSignOut = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  return (
    <header className="bg-[#091429] shadow-lg border-b border-white/10">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Image src="/logo-white.svg" alt="Tax4Sure" width={160} height={44} priority />
          <span className="text-white/40 text-sm font-medium border-l border-white/20 pl-4">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell isAdmin />
          <Button
            variant="ghost"
            className="text-white/70 hover:bg-white/10 hover:text-white gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
