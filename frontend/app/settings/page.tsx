"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Lock, Bell, Key, CreditCard, Globe, Moon, Sun, Check, X, Info,
  Shield, Zap, Mail, Smartphone, Monitor, Save, RefreshCw, LogOut,
  AlertTriangle, Download, Trash2, Eye, EyeOff, Copy, CheckCircle, FileText,
  Settings as SettingsIcon, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/toast";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // State
  const [activeTab, setActiveTab] = useState("billing");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("vg_live_1234567890abcdef");
  const [keyCopied, setKeyCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    browserNotifications: true,
    scanComplete: true,
    deepfakeDetected: true,
    weeklyReport: false,
    productUpdates: false,
    securityAlerts: true,
  });

  // Copy API Key
  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
    showToast("API key copied to clipboard!", "success");
  };

  // Generate new API key
  const handleGenerateKey = () => {
    const newKey = "vg_live_" + Math.random().toString(36).substring(2, 20);
    setApiKey(newKey);
    showToast("New API key generated!", "success");
  };

  // Revoke API key
  const handleRevokeKey = () => {
    setApiKey("");
    showToast("API key revoked successfully!", "info");
  };

  // Change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords don't match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showToast(error.message || "Failed to change password", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Save settings
  const handleSaveSettings = () => {
    showToast("Settings saved successfully!", "success");
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    showToast("Logged out successfully!", "info");
    window.location.href = "/login";
  };

  // Tabs
  const tabs = [
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Access", icon: Key },
    { id: "appearance", label: "Appearance", icon: SettingsIcon },
  ];

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#B784A7] animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-[#B784A7] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please Log In</h1>
          <p className="text-muted mb-6">You need to be logged in to view settings.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted">Manage your account preferences and configurations</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#B784A7]/15 text-[#B784A7] text-sm font-medium rounded-lg hover:bg-[#B784A7]/25 hover:shadow-[0_0_10px_rgba(183,132,167,0.3)] transition"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                  : "bg-[var(--bg-card)] text-muted hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* ========== BILLING TAB ========== */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Current Plan</h3>
                    <p className="text-muted text-sm">You're on the Pro plan</p>
                  </div>
                  <span className="px-3 py-1 bg-[#B784A7]/10 text-[#B784A7] rounded-full text-xs font-bold">
                    PRO
                  </span>
                </div>

                <div className="bg-[var(--bg-main)] rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted text-sm">Next billing date</span>
                    <span className="text-sm font-medium">September 21, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Amount due</span>
                    <span className="text-sm font-bold">${billingCycle === "monthly" ? "29" : "290"}/ {billingCycle}</span>
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-1">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                        billingCycle === "monthly"
                          ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                          : "text-muted hover:text-white"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("yearly")}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                        billingCycle === "yearly"
                          ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                          : "text-muted hover:text-white"
                      }`}
                    >
                      Yearly
                      <span className="ml-2 text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                        Save 20%
                      </span>
                    </button>
                  </div>
                </div>

                {/* FIXED BUTTONS */}
                <div className="flex gap-3 mt-2">
                  <Link
                    href="/pricing"
                    className="flex-1 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-lg text-center text-sm hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition"
                  >
                    Upgrade Plan
                  </Link>
                  <button
                    onClick={() => showToast("Downgrade request submitted!", "info")}
                    className="flex-1 py-3 bg-[var(--bg-secondary)] text-main rounded-lg text-sm font-medium hover:bg-neutral-700 transition"
                  >
                    Downgrade
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center justify-between bg-[var(--bg-main)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                      <CreditCard className="w-5 h-5 text-[#B784A7]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Visa ending in 4242</div>
                      <div className="text-muted text-xs">Expires 12/2028</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Payment method updated!", "success")}
                    className="px-3 py-1.5 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-xs font-medium hover:bg-[#B784A7]/20 transition"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                <div className="space-y-3">
                  {[
                    { date: "August 21, 2026", amount: "$29.00", invoice: "INV-2026-0892", status: "Paid" },
                    { date: "July 21, 2026", amount: "$29.00", invoice: "INV-2026-0741", status: "Paid" },
                    { date: "June 21, 2026", amount: "$29.00", invoice: "INV-2026-0633", status: "Paid" },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between bg-[var(--bg-main)] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted" />
                        <div>
                          <div className="text-sm">{invoice.invoice}</div>
                          <div className="text-muted text-xs">{invoice.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xs font-semibold">{invoice.status}</span>
                        <span className="text-sm font-bold">{invoice.amount}</span>
                        <button
                          onClick={() => showToast("Invoice downloaded!", "success")}
                          className="p-1.5 text-muted hover:text-[#B784A7] transition"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========== SECURITY TAB ========== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#B784A7] transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#B784A7] transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#B784A7] transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={isSavingPassword}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition disabled:opacity-50"
                  >
                    {isSavingPassword ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Two-Factor Authentication</h3>
                    <p className="text-muted text-sm">Add an extra layer of security to your account.</p>
                  </div>
                  <button
                    onClick={() => showToast("2FA setup initiated!", "info")}
                    className="px-4 py-2 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-sm font-medium hover:bg-[#B784A7]/20 transition"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[var(--bg-main)] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Monitor className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Chrome on Windows</div>
                        <div className="text-muted text-xs">Bangalore, India • Current session</div>
                      </div>
                    </div>
                    <span className="text-xs text-green-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between bg-[var(--bg-main)] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-800 rounded-lg">
                        <Smartphone className="w-4 h-4 text-muted" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Safari on iPhone</div>
                        <div className="text-muted text-xs">Bangalore, India • 2 days ago</div>
                      </div>
                    </div>
                    <button className="text-xs text-red-500 hover:text-red-400 transition">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== NOTIFICATIONS TAB ========== */}
          {activeTab === "notifications" && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: "emailAlerts", label: "Email Alerts", desc: "Receive alerts via email", icon: Mail },
                  { key: "browserNotifications", label: "Browser Notifications", desc: "Get notified in your browser", icon: Globe },
                  { key: "scanComplete", label: "Scan Complete", desc: "When an analysis finishes", icon: CheckCircle },
                  { key: "deepfakeDetected", label: "Deepfake Detected", desc: "Immediate alert on detection", icon: AlertTriangle },
                  { key: "securityAlerts", label: "Security Alerts", desc: "Account security notifications", icon: Shield },
                  { key: "weeklyReport", label: "Weekly Report", desc: "Summary of your activity", icon: FileText },
                  { key: "productUpdates", label: "Product Updates", desc: "News about new features", icon: Info },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between bg-[var(--bg-main)] rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                        <pref.icon className="w-4 h-4 text-[#B784A7]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{pref.label}</div>
                        <div className="text-muted text-xs">{pref.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [pref.key]: !notifications[pref.key as keyof typeof notifications] })}
                      className={`w-11 h-6 rounded-full transition ${
                        notifications[pref.key as keyof typeof notifications] ? "bg-[#B784A7]" : "bg-neutral-700"
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                        notifications[pref.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== API ACCESS TAB ========== */}
          {activeTab === "api" && (
            <div className="space-y-6">
              {/* Current API Key */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">API Key</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateKey}
                      className="px-3 py-1.5 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-xs font-medium hover:bg-[#B784A7]/20 transition"
                    >
                      <RefreshCw className="w-3 h-3 inline mr-1" />
                      Generate New
                    </button>
                    <button
                      onClick={handleRevokeKey}
                      className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20 transition"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-main)] rounded-xl p-4">
                  <Key className="w-5 h-5 text-[#B784A7]" />
                  <code className="flex-1 text-sm">
                    {showApiKey ? apiKey : "•".repeat(apiKey.length)}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-muted hover:text-[#B784A7] transition"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-1 text-muted hover:text-[#B784A7] transition"
                  >
                    {keyCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted mt-2">
                  Keep this key secret. It grants full access to your account's API.
                </p>
              </div>

              {/* API Usage */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">API Usage</h3>
                <div className="bg-[var(--bg-main)] rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Calls this month</span>
                    <span className="font-bold">1,240 / 2,000</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#B784A7] to-cyan-400 rounded-full" style={{ width: "62%" }} />
                  </div>
                </div>
              </div>

              {/* API Documentation Link */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 text-center">
                <Shield className="w-8 h-8 text-[#B784A7] mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Need help with the API?</h3>
                <p className="text-muted text-sm mb-4">Check out our comprehensive documentation with code examples.</p>
                <Link href="/api/docs" className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-sm font-medium hover:bg-[#B784A7]/20 transition">
                  View API Docs
                </Link>
              </div>
            </div>
          )}

          {/* ========== APPEARANCE TAB ========== */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-4 rounded-xl border transition ${
                      theme === "dark"
                        ? "border-[#B784A7] bg-[#B784A7]/5"
                        : "border-[var(--border-color)] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Moon className={`w-6 h-6 ${theme === "dark" ? "text-[#B784A7]" : "text-muted"}`} />
                    </div>
                    <div className="text-sm font-medium">Dark Mode</div>
                    <div className="text-muted text-xs">Default theme</div>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className={`p-4 rounded-xl border transition ${
                      theme === "light"
                        ? "border-[#B784A7] bg-[#B784A7]/5"
                        : "border-[var(--border-color)] hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Sun className={`w-6 h-6 ${theme === "light" ? "text-[#B784A7]" : "text-muted"}`} />
                    </div>
                    <div className="text-sm font-medium">Light Mode</div>
                    <div className="text-muted text-xs">Coming soon</div>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Language</h3>
                <select className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition">
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}