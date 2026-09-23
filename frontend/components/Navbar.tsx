"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Shield, LayoutDashboard, User, Settings, LogOut, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import CommandPalette from "@/components/CommandPalette";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Pink to Cyan Gradient + Pink Shield */}
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                <Shield className="w-6 h-6 text-[#B784A7] fill-[#B784A7]/20" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-[#B784A7] to-cyan-400 bg-clip-text text-transparent">
                VoiceGuard
              </span>
            </Link>

            {/* Desktop Menu in CENTER */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link href="/dashboard" className="text-muted hover:text-[#B784A7] transition flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/analyze" className="text-muted hover:text-[#B784A7] transition">
                Analyze
              </Link>
              <Link href="/history" className="text-muted hover:text-[#B784A7] transition">
                History
              </Link>
              <Link href="/pricing" className="text-muted hover:text-[#B784A7] transition">
                Pricing
              </Link>
              <Link href="/about" className="text-muted hover:text-[#B784A7] transition">
                About
              </Link>
            </div>

            {/* Auth + Profile Buttons on RIGHT */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsPaletteOpen(true)}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-300"
                title="Search (Ctrl+K)"
              >
                <Search className="w-5 h-5 text-muted" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-300"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-muted" /> : <Moon className="w-5 h-5 text-muted" />}
              </button>

              {/* REMOVED "Login" text link */}
              
              {/* Get Started - Pink to Cyan Gradient (Same as Browse Files) */}
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition-all duration-300"
              >
                Get Started
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 bg-[#B784A7]/10 rounded-full hover:bg-[#B784A7]/20 transition-all duration-300 group"
                  title="Profile"
                >
                  <User className="w-5 h-5 text-[#B784A7] group-hover:scale-110 transition" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-[var(--border-color)]">
                      <div className="font-semibold text-main text-sm">Giruthiga</div>
                      <div className="text-muted text-xs">giruthi97@hmail.com</div>
                    </div>
                    <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-[var(--bg-secondary)] transition">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-[var(--bg-secondary)] transition">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <div className="border-t border-[var(--border-color)] my-1"></div>
                    <Link href="/login" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition">
                      <LogOut className="w-4 h-4" /> Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-muted">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)]">
            <div className="px-4 py-4 space-y-4">
              <Link href="/dashboard" className="block text-muted hover:text-[#B784A7]">
                Dashboard
              </Link>
              <Link href="/analyze" className="block text-muted hover:text-[#B784A7]">
                Analyze
              </Link>
              <Link href="/history" className="block text-muted hover:text-[#B784A7]">
                History
              </Link>
              <Link href="/pricing" className="block text-muted hover:text-[#B784A7]">
                Pricing
              </Link>
              <Link href="/about" className="block text-muted hover:text-[#B784A7]">
                About
              </Link>

              <div className="pt-4 border-t border-[var(--border-color)]">
                {/* Mobile Get Started - Pink to Cyan Gradient */}
                <Link href="/register" className="block text-center px-4 py-2 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-semibold rounded-lg">
                  Get Started
                </Link>
                <Link href="/profile" className="flex items-center gap-2 mt-4 px-4 py-2 bg-[#B784A7]/10 rounded-lg text-[#B784A7] font-semibold">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Command Palette */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}