"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-client";
import { Eye, EyeOff, UserPlus, Loader2, Check, X } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    mobile: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Contains number", pass: /[0-9]/.test(password) },
    { label: "Contains special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500", "bg-green-600"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? strengthColors[score] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: <span className="font-medium">{strengthLabels[score]}</span>
      </p>
      <div className="space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {check.pass ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-gray-300" />
            )}
            <span className={`text-xs ${check.pass ? "text-green-600" : "text-gray-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const res = await apiCall("/api/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          username: data.username,
          password: data.password,
          mobile: data.mobile,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login");
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
      className="w-full max-w-5xl auth-card grid lg:grid-cols-2 min-h-[680px]"
    >
      <BrandPanel />

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 py-10 md:px-12 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-700">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join Tax4Sure for secure document management
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName")}
              disabled={isLoading}
              className={errors.fullName ? "border-red-400" : ""}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              disabled={isLoading}
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="john_doe"
              {...register("username")}
              disabled={isLoading}
              className={errors.username ? "border-red-400" : ""}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
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
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                {...register("confirmPassword")}
                disabled={isLoading}
                className={`pr-10 ${errors.confirmPassword ? "border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register("mobile")}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-navy-700 hover:text-gold-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
