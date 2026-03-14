"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ShieldCheck,
  User,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { apiCall } from "@/lib/api-client";
import { storeAdminToken } from "@/lib/admin-auth";

const clientSchema = z.object({
  usernameOrEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

const adminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

type ClientForm = z.infer<typeof clientSchema>;
type AdminForm = z.infer<typeof adminSchema>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function LoginPage() {
  const [mode, setMode] = useState<"client" | "admin">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const clientForm = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: { rememberMe: false },
  });

  const adminForm = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
  });

  const onClientSubmit = async (data: ClientForm) => {
    setIsLoading(true);
    try {
      const res = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ usernameOrEmail: data.usernameOrEmail, password: data.password }),
        auth: false,
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Invalid email or password");
      } else {
        signIn(result.token, result.user);
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onAdminSubmit = async (data: AdminForm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Invalid admin credentials");
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl auth-card grid lg:grid-cols-2 min-h-[580px]"
    >
      <BrandPanel />

      <div className="flex flex-col justify-center px-6 py-8 md:px-12">
        {/* Mobile logo */}
        <div className="flex justify-center mb-6 lg:hidden">
          <Image src="/logo.svg" alt="Tax4Sure" width={140} height={40} priority />
        </div>

        {/* Toggle */}
        <div className="mb-8 flex items-center rounded-xl bg-gray-100 p-1 gap-1">
          <button
            onClick={() => { setMode("client"); setShowPassword(false); clientForm.clearErrors(); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              mode === "client"
                ? "bg-white text-[#0D1F4E] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="h-4 w-4" />
            Client Login
          </button>
          <button
            onClick={() => { setMode("admin"); setShowPassword(false); adminForm.clearErrors(); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              mode === "admin"
                ? "bg-[#0D1F4E] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin Login
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "client" ? (
            <motion.div
              key="client"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0D1F4E]">Welcome back</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Sign in to access your documents and filing status.
                </p>
              </div>

              <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...clientForm.register("usernameOrEmail")}
                    disabled={isLoading}
                    className={clientForm.formState.errors.usernameOrEmail ? "border-red-400" : ""}
                  />
                  {clientForm.formState.errors.usernameOrEmail && (
                    <p className="text-xs text-red-500">{clientForm.formState.errors.usernameOrEmail.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#2B5BA8] hover:text-[#0D1F4E] font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...clientForm.register("password")}
                      disabled={isLoading}
                      className={`pr-10 ${clientForm.formState.errors.password ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {clientForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{clientForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...clientForm.register("rememberMe")}
                    className="h-4 w-4 rounded border-gray-300 accent-[#0D1F4E] cursor-pointer"
                  />
                  <Label htmlFor="rememberMe" className="font-normal cursor-pointer text-gray-500 text-sm">
                    Remember me for 30 days
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0D1F4E] hover:bg-[#1B3A7A] text-white font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    <><LogIn className="h-4 w-4" /> Sign In</>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-[#0D1F4E] hover:text-[#C9A84C] transition-colors">
                  Create account
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D1F4E]">
                    <ShieldCheck className="h-4 w-4 text-[#C9A84C]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#0D1F4E]">Administrator</h1>
                </div>
                <p className="text-sm text-gray-500">
                  Restricted access — admin credentials required.
                </p>
              </div>

              <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@tax4sure.ca"
                    {...adminForm.register("email")}
                    disabled={isLoading}
                    className={adminForm.formState.errors.email ? "border-red-400" : ""}
                  />
                  {adminForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{adminForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Link
                      href="/forgot-password?admin=1"
                      className="text-xs text-[#2B5BA8] hover:text-[#0D1F4E] font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="adminPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      {...adminForm.register("password")}
                      disabled={isLoading}
                      className={`pr-10 ${adminForm.formState.errors.password ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {adminForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{adminForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0D1F4E] hover:bg-[#1B3A7A] text-white font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> Admin Sign In</>
                  )}
                </Button>
              </form>

              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                  This area is restricted to authorized Tax4Sure staff only.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
