"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2, X, Info } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast("Please enter your email address.", "error");
      return;
    }

    setIsLoading(true);
    
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      showToast("Password reset email sent!", "success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {!isSent ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-gray-400 text-sm">
                Enter your email address and we'll send you a reset link.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-gray-400 text-sm">
                We've sent a reset link to <span className="text-[#B784A7] font-medium">{email}</span>
              </p>
            </>
          )}
        </div>

        {/* Form */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black border border-neutral-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#B784A7] transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsSent(false)}
                  className="w-full py-2.5 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-sm font-medium hover:bg-[#B784A7]/20 transition"
                >
                  Resend Email
                </button>
                <Link
                  href="/login"
                  className="w-full py-2.5 border border-neutral-700 rounded-lg text-white text-sm font-medium hover:border-[#B784A7] transition"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 ${
          toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
        } text-white rounded-xl shadow-2xl`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : toast.type === "error" ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}