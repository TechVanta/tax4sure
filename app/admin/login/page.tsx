"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeAdminToken } from "@/lib/admin-auth";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

type FormData = z.infer<typeof schema>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#091429] via-[#0D1F4E] to-[#091429] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-7">
          <Image src="/logo.svg" alt="Tax4Sure" width={140} height={40} priority />
          <div className="mt-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#091429]">
              <ShieldCheck className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#091429] leading-none">Administrator</h1>
              <p className="text-xs text-gray-400 mt-0.5">Restricted access</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tax4sure.ca"
              {...form.register("email")}
              disabled={isLoading}
              className={form.formState.errors.email ? "border-red-400" : ""}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password?admin=1"
                className="text-xs text-[#2B5BA8] hover:text-[#091429] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                {...form.register("password")}
                disabled={isLoading}
                className={`pr-10 ${form.formState.errors.password ? "border-red-400" : ""}`}
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
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-[#091429] hover:bg-[#0D1F4E] text-white font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              <><ShieldCheck className="h-4 w-4" /> Sign In</>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Client portal?{" "}
          <Link href="/login" className="text-[#2B5BA8] font-medium hover:text-[#091429] transition-colors">
            Client login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
