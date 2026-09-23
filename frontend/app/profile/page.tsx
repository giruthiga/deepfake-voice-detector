"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Mail, Camera, Globe, Share2, MessageCircle, Link2, CreditCard, Activity,
  FileAudio, CheckCircle, Zap, Check, X, Info, MapPin, Briefcase, Loader2, Lock, LogOut
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { showToast } = useToast();

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // State
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("Bangalore, India");
  const [company, setCompany] = useState("VoiceGuard Inc.");
  const [website, setWebsite] = useState("");
  
  // Social Links
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  // Loading state for saving
  const [isSaving, setIsSaving] = useState(false);

  // Real usage stats
  const [totalScans, setTotalScans] = useState(0);
  const [scansThisMonth, setScansThisMonth] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load user data from Supabase on mount
  useEffect(() => {
    if (!authLoading && user) {
      setName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      setUsername(user.user_metadata?.username || user.email?.split('@')[0] || "");
      setBio(user.user_metadata?.bio || "");
      setLocation(user.user_metadata?.location || "Bangalore, India");
      setCompany(user.user_metadata?.company || "VoiceGuard Inc.");
      setWebsite(user.user_metadata?.website || "https://github.com/giruthiga");
      setTwitterUrl(user.user_metadata?.twitter || "");
      setGithubUrl(user.user_metadata?.github || "https://github.com/giruthiga");
      setLinkedinUrl(user.user_metadata?.linkedin || "");
      
      // Fetch real stats
      fetchStats();
    }
  }, [user, authLoading]);

  // Fetch real scan stats
  const fetchStats = async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      // Total scans
      const { count: totalCount, error: totalError } = await supabase
        .from("scans")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

      if (totalError) throw totalError;

      // Scans this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { count: monthCount, error: monthError } = await supabase
        .from("scans")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .gte("created_at", firstDayOfMonth.toISOString());

      if (monthError) throw monthError;

      setTotalScans(totalCount || 0);
      setScansThisMonth(monthCount || 0);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      // Don't show toast for background stats fetch, just silently set to 0
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const filePath = `avatars/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      
      setAvatar(urlData.publicUrl);

      // Update user metadata with new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl }
      });

      if (updateError) throw updateError;
      showToast("Profile picture updated!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to upload avatar", "error");
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          username,
          bio,
          location,
          company,
          website,
          twitter: twitterUrl,
          github: githubUrl,
          linkedin: linkedinUrl,
        },
      });

      if (error) throw error;
      showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    showToast("Logged out successfully!", "info");
    router.push("/login");
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#B784A7] animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading profile...</p>
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
          <p className="text-muted mb-6">You need to be logged in to view your profile.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted">Your personal information and identity</p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/15 text-[#B784A7] text-sm font-medium rounded-lg hover:bg-[#B784A7]/25 hover:shadow-[0_0_10px_rgba(183,132,167,0.3)] transition disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
        
        {/* Profile Card Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#B784A7] to-cyan-400 p-1">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--bg-main)] flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#B784A7]">{name.charAt(0) || "U"}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#B784A7] rounded-full text-black hover:shadow-[0_0_15px_rgba(183,132,167,0.5)] transition"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{name || "User"}</h2>
              <p className="text-muted">@{username}</p>
              <p className="text-muted text-sm mt-1">{bio}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#B784A7]/10 text-[#B784A7] text-xs rounded-full">
                  <MapPin className="w-3 h-3" /> {location}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#B784A7]/10 text-[#B784A7] text-xs rounded-full">
                  <Briefcase className="w-3 h-3" /> {company}
                </span>
              </div>
            </div>
            
            {/* Quick Stats (REAL DATA) */}
            <div className="flex flex-row gap-8 justify-center sm:justify-end">
              <div className="text-center">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 text-[#B784A7] animate-spin mx-auto" />
                ) : (
                  <div className="text-2xl font-bold text-[#B784A7]">{scansThisMonth}</div>
                )}
                <div className="text-xs text-muted mt-1">Scans (Month)</div>
              </div>
              <div className="text-center">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto" />
                ) : (
                  <div className="text-2xl font-bold text-green-500">{totalScans}</div>
                )}
                <div className="text-xs text-muted mt-1">Total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Personal Information Form */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Location</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Company</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-muted mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition resize-none"
            />
          </div>
        </div>
        
        {/* Social Links */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted mb-2">X / Twitter</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/giruthiga"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">GitHub</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/giruthiga"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">LinkedIn</label>
              <div className="relative">
                <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/giruthiga"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-sm focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards (REAL DATA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
            <div className="flex gap-4">
              <div className="bg-[var(--bg-main)] rounded-xl p-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileAudio className="w-4 h-4 text-[#B784A7]" />
                  <span className="text-sm text-muted">Total Scans</span>
                </div>
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 text-[#B784A7] animate-spin" />
                ) : (
                  <div className="text-3xl font-bold">{totalScans}</div>
                )}
              </div>
              <div className="bg-[var(--bg-main)] rounded-xl p-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted">Scans (Month)</span>
                </div>
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                ) : (
                  <div className="text-3xl font-bold">{scansThisMonth}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Link to Settings */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <p className="text-muted text-sm mb-4">Manage your billing, security, API keys, and notifications.</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-sm font-medium hover:bg-[#B784A7]/20 transition"
              >
                Go to Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}