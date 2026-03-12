"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeAdminToken } from "@/lib/admin-auth";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

type Form = z.infer<typeof schema>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Invalid password");
      } else {
        storeAdminToken(result.token);
        toast.success("Welcome, Administrator");
        router.push("/admin/dashboard");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-700 to-navy-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="Tax4Sure" width={160} height={44} priority />
          <div className="mt-4 flex items-center gap-2 text-navy-700">
            <ShieldCheck className="h-5 w-5 text-gold-500" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-navy-700 mb-1">Administrator Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your admin password to access the client portal.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Admin Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                {...register("password")}
                disabled={isLoading}
                className={`pr-10 ${errors.password ? "border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>
            ) : (
              <><ShieldCheck className="h-4 w-4" />Sign In</>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Client login?{" "}
          <a href="/login" className="font-semibold text-navy-700 hover:text-gold-500 transition-colors">
            Go to client portal
          </a>
        </p>
      </motion.div>
    </div>
  );
}
