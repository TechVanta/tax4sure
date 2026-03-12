"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif" },
        }}
      />
    </AuthProvider>
  );
}
