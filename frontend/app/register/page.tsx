"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Fix hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        showToast("Account created successfully!", "success");
        router.push("/dashboard");
        router.refresh();
      } else {
        showToast("Account created! Check your email to verify.", "success");
        router.push("/login");
      }
    } catch (error: any) {
      showToast(error.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted mt-2 text-sm">Start detecting deepfakes in minutes</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm placeholder-muted focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
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
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm placeholder-muted focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#B784A7] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted mt-1.5">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2 text-sm text-muted">
              <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 rounded border-gray-600 bg-black accent-[#B784A7]" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-[#B784A7] hover:text-[#B784A7]/80 transition">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#B784A7] hover:text-[#B784A7]/80 transition">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-lg text-sm hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--bg-card)] text-muted">Or sign up with</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-3">
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
              className="py-2 border border-[var(--border-color)] rounded-lg font-medium text-sm hover:border-[#B784A7] transition"
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
              className="py-2 border border-[var(--border-color)] rounded-lg font-medium text-sm hover:border-[#B784A7] transition"
            >
              GitHub
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-muted mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#B784A7] hover:text-[#B784A7]/80 font-medium transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}