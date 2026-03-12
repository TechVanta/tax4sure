"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const loginSchema = z.object({
  usernameOrEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ usernameOrEmail: data.usernameOrEmail, password: data.password }),
        auth: false,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Invalid username or password");
      } else {
        signIn(result.token, result.user);
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
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

      <div className="flex flex-col justify-center px-8 py-10 md:px-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-700">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to access your documents
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail">Email Address</Label>
            <Input
              id="usernameOrEmail"
              type="email"
              placeholder="john@example.com"
              {...register("usernameOrEmail")}
              disabled={isLoading}
              className={errors.usernameOrEmail ? "border-red-400 focus-visible:ring-red-400" : ""}
            />
            {errors.usernameOrEmail && (
              <p className="text-xs text-red-500">{errors.usernameOrEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading}
                className={`pr-10 ${errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 text-navy-700 focus:ring-navy-700 cursor-pointer"
            />
            <Label htmlFor="rememberMe" className="font-normal cursor-pointer text-muted-foreground">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</>
            ) : (
              <><LogIn className="h-4 w-4" />Sign In</>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-navy-700 hover:text-gold-500 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
