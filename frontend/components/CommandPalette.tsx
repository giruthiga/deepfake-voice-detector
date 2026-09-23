"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Upload, History, User, Settings, CreditCard, BookOpen,
  FileText, HelpCircle, Mail, X, Search, ArrowRight, FileAudio, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [scans, setScans] = useState<any[]>([]);
  const [scansLoading, setScansLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Fetch scans when opened
  useEffect(() => {
    if (isOpen && user) {
      fetchScans();
    }
  }, [isOpen, user]);

  // Fetch recent scans
  const fetchScans = async () => {
    setScansLoading(true);
    try {
      const { data, error } = await supabase
        .from("scans")
        .select("id, file_name, verdict")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      setScans([]);
    } finally {
      setScansLoading(false);
    }
  };

  // Navigation items
  const pages = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, desc: "View your stats" },
    { name: "Analyze Audio", href: "/analyze", icon: Upload, desc: "Upload & detect" },
    { name: "History", href: "/history", icon: History, desc: "Past analyses" },
    { name: "Profile", href: "/profile", icon: User, desc: "Your personal info" },
    { name: "Settings", href: "/settings", icon: Settings, desc: "Account settings" },
    { name: "Pricing", href: "/pricing", icon: CreditCard, desc: "Plans & features" },
    { name: "API Docs", href: "/api/docs", icon: BookOpen, desc: "Developer docs" },
    { name: "FAQ", href: "/faq", icon: HelpCircle, desc: "Help center" },
    { name: "Contact", href: "/contact", icon: Mail, desc: "Get in touch" },
    { name: "About", href: "/about", icon: FileText, desc: "Our mission" },
  ];

  // Filter pages
  const filteredPages = pages.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter scans
  const filteredScans = scans.filter((scan) =>
    scan.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate
  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (filteredPages.length > 0) {
        handleNavigate(filteredPages[0].href);
      } else if (filteredScans.length > 0) {
        router.push(`/history`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages or scans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-lg outline-none placeholder-muted"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {/* Pages Section */}
          {filteredPages.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
                Pages
              </div>
              {filteredPages.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition group"
                >
                  <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                    <item.icon className="w-4 h-4 text-[#B784A7]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted">{item.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </>
          )}

          {/* Scans Section */}
          {filteredScans.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
                Recent Scans
              </div>
              {filteredScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => router.push(`/history`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition group"
                >
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <FileAudio className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{scan.file_name}</div>
                    <div className="text-xs text-muted">
                      Verdict: <span className={scan.verdict === "REAL" ? "text-green-500" : scan.verdict === "FAKE" ? "text-red-500" : "text-yellow-500"}>{scan.verdict}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </>
          )}

          {/* Loading state */}
          {scansLoading && (
            <div className="px-4 py-4 text-center text-muted">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Loading scans...
            </div>
          )}

          {/* No results */}
          {filteredPages.length === 0 && filteredScans.length === 0 && !scansLoading && (
            <div className="px-4 py-8 text-center text-muted">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs text-muted">Press <kbd className="px-1.5 py-0.5 bg-neutral-700 rounded text-[10px]">ESC</kbd> to close</span>
          <span className="text-xs text-muted">VoiceGuard Quick Nav</span>
        </div>
      </div>
    </div>
  );
}