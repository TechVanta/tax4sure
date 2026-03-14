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
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { apiCall } from "@/lib/api-client";

const schema = z.object({
  usernameOrEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: FormData) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl auth-card grid lg:grid-cols-2 min-h-[520px]"
    >
      <BrandPanel />

      <div className="flex flex-col justify-center px-6 py-10 md:px-12">
        {/* Mobile logo */}
        <div className="flex justify-center mb-6 lg:hidden">
          <Image src="/logo.svg" alt="Tax4Sure" width={140} height={40} priority />
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-[#091429]">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to access your documents and filing status.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...form.register("usernameOrEmail")}
              disabled={isLoading}
              className={form.formState.errors.usernameOrEmail ? "border-red-400" : ""}
            />
            {form.formState.errors.usernameOrEmail && (
              <p className="text-xs text-red-500">{form.formState.errors.usernameOrEmail.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#2B5BA8] hover:text-[#091429] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              {...form.register("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 accent-[#091429] cursor-pointer"
            />
            <Label htmlFor="rememberMe" className="font-normal cursor-pointer text-gray-500 text-sm">
              Remember me for 30 days
            </Label>
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
              <><LogIn className="h-4 w-4" /> Sign In</>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#091429] hover:text-[#C9A84C] transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
