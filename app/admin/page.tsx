"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/admin-auth";

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    const token = getAdminToken();
    router.replace(token ? "/admin/dashboard" : "/admin/login");
  }, [router]);
  return null;
}
