"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/toast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Fix hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        showToast("Login successful!", "success");
        // Force redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        showToast("No session returned. Please try again.", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted">Log in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm placeholder-muted focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm placeholder-muted focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#B784A7] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black accent-[#B784A7]" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-[#B784A7] hover:text-[#B784A7]/80 transition">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--bg-card)] text-muted">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                  },
                });
                if (error) showToast(error.message, "error");
              }}
              className="py-2.5 border border-[var(--border-color)] rounded-lg font-medium hover:border-[#B784A7] transition"
            >
              Google
            </button>
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                  },
                });
                if (error) showToast(error.message, "error");
              }}
              className="py-2.5 border border-[var(--border-color)] rounded-lg font-medium hover:border-[#B784A7] transition"
            >
              GitHub
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#B784A7] hover:text-[#B784A7]/80 font-medium transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}