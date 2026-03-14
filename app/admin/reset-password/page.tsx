"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminResetRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // Admin reset uses the same reset-password flow as clients
    router.replace(`/reset-password${token ? `?token=${token}` : ""}`);
  }, [router, token]);

  return null;
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense>
      <AdminResetRedirect />
    </Suspense>
  );
}
