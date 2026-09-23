"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Upload, FileAudio, CheckCircle, XCircle, AlertTriangle, Clock, Activity, BarChart3,
  Mic, Search, Filter, Download, Trash2, Eye, ChevronDown, RefreshCw, Calendar, TrendingUp,
  Bell, User, Settings, LogOut, Moon, Sun, Copy, Share2, MoreVertical, CheckSquare, Square,
  ArrowUpDown, X, Check, Info, Loader2, FileText, Zap, Shield, Plus, ChevronLeft, ChevronRight,
  LayoutDashboard, History, ExternalLink, Lock
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/toast";
import { useTheme } from "@/components/ThemeProvider";

// --- Toast Component ---
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const icon = type === "success" ? <Check className="w-4 h-4" /> : type === "error" ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />;

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 ${bgColor} text-white rounded-xl shadow-2xl`}>
      {icon}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- User Dropdown ---
const UserDropdown = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-800 transition">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B784A7] to-cyan-400 flex items-center justify-center">
          <span className="text-black font-bold text-sm">{user.name[0]}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-[#111111] border border-neutral-800 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-neutral-800">
            <div className="font-semibold text-white text-sm">{user.name}</div>
            <div className="text-gray-400 text-xs">{user.email}</div>
          </div>
          <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-neutral-800 transition">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-neutral-800 transition">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <div className="border-t border-neutral-800 my-1"></div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

// --- Notifications Panel ---
const NotificationsPanel = ({ notifications }: { notifications: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-neutral-800 transition">
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-[#111111] border border-neutral-800 rounded-xl shadow-2xl z-50">
          <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
            <span className="font-semibold text-white text-sm">Notifications</span>
            <span className="text-xs text-gray-400">{unreadCount} unread</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notif, i) => (
              <div key={i} className={`px-4 py-3 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/50 transition ${notif.read ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${notif.type === "success" ? "bg-green-500/10" : notif.type === "error" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                    {notif.type === "success" ? <CheckCircle className="w-4 h-4 text-green-500" /> : notif.type === "error" ? <XCircle className="w-4 h-4 text-red-500" /> : <Info className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div>
                    <div className="text-sm text-white">{notif.message}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{notif.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 text-center text-sm text-[#B784A7] hover:bg-neutral-800 transition">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

// --- Custom Tooltip for Charts ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] border border-neutral-700 rounded-lg px-3 py-2 text-xs">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-gray-400">
            {entry.name}: <span className="text-white font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // Real data state
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notifications (Mock - since we don't have a notifications table yet)
  const [notifications, setNotifications] = useState([
    { type: "success", message: "Scan completed: interview_001.mp3", time: "2 min ago", read: false },
    { type: "error", message: "Deepfake detected: voice_note_042.wav", time: "1 hour ago", read: false },
    { type: "info", message: "New feature available: Batch scanning", time: "3 hours ago", read: true },
    { type: "success", message: "Scan completed: podcast_ep12.mp3", time: "5 hours ago", read: true },
  ]);

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToastLocal = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  // State for filtering
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedScans, setSelectedScans] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State for selected scan (for detail modal)
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for refreshing data
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real scans from Supabase
  const fetchScans = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error: any) {
      showToast(error.message || "Failed to fetch scans", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchScans();
  }, [user, authLoading]);

  // Stats (REAL)
  const totalScans = scans.length;
  const realScans = scans.filter(s => s.verdict === "REAL").length;
  const fakeScans = scans.filter(s => s.verdict === "FAKE").length;
  const suspiciousScans = scans.filter(s => s.verdict === "SUSPICIOUS").length;

  const stats = [
    { label: "Total Scans", value: totalScans, icon: FileAudio, color: "text-[#B784A7]", bg: "bg-[#B784A7]/10" },
    { label: "Real Voices", value: realScans, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Fake Voices", value: fakeScans, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Suspicious", value: suspiciousScans, icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  // Chart data (Derived from real scans)
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => {
      const dayScans = scans.filter((s) => new Date(s.created_at).toLocaleDateString('en-US', { weekday: 'short' }) === day);
      return {
        day,
        scans: dayScans.length,
        real: dayScans.filter((s) => s.verdict === "REAL").length,
        fake: dayScans.filter((s) => s.verdict === "FAKE").length,
        suspicious: dayScans.filter((s) => s.verdict === "SUSPICIOUS").length,
      };
    });
  }, [scans]);

  const detectionData = [
    { name: "Real", value: realScans, color: "#22C55E" },
    { name: "Fake", value: fakeScans, color: "#EF4444" },
    { name: "Suspicious", value: suspiciousScans, color: "#EAB308" },
  ];

  const confidenceData = useMemo(() => {
    const low = scans.filter((s) => s.confidence < 70).length;
    const medium = scans.filter((s) => s.confidence >= 70 && s.confidence < 85).length;
    const high = scans.filter((s) => s.confidence >= 85 && s.confidence < 95).length;
    const veryHigh = scans.filter((s) => s.confidence >= 95).length;
    return [
      { name: "Low", value: low },
      { name: "Medium", value: medium },
      { name: "High", value: high },
      { name: "Very High", value: veryHigh },
    ];
  }, [scans]);

  // Filtered and sorted scans
  const filteredScans = useMemo(() => {
    let result = scans.filter((scan: any) => {
      const matchesFilter = filter === "ALL" || scan.verdict === filter;
      const matchesSearch = (scan.file_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    result.sort((a: any, b: any) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "confidence") {
        return sortOrder === "asc" ? a.confidence - b.confidence : b.confidence - a.confidence;
      }
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.file_name.localeCompare(b.file_name) : b.file_name.localeCompare(a.file_name);
      }
      return 0;
    });

    return result;
  }, [scans, filter, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);
  const paginatedScans = filteredScans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      fetchScans();
      showToastLocal("Data refreshed successfully", "success");
    }, 1000);
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("scans").delete().eq("id", id);
      if (error) throw error;
      setScans(scans.filter((scan: any) => scan.id !== id));
      setIsModalOpen(false);
      showToastLocal("Scan deleted successfully", "success");
    } catch (error: any) {
      showToastLocal(error.message || "Failed to delete", "error");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedScans.length === 0) return;
    try {
      const { error } = await supabase.from("scans").delete().in("id", selectedScans);
      if (error) throw error;
      setScans(scans.filter((scan: any) => !selectedScans.includes(scan.id)));
      setSelectedScans([]);
      showToastLocal(`Deleted ${selectedScans.length} scans`, "success");
    } catch (error: any) {
      showToastLocal(error.message || "Failed to delete", "error");
    }
  };

  // Handle Sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Filename", "Date", "Verdict", "Confidence", "Duration", "Size"];
    const rows = filteredScans.map((scan: any) => [scan.file_name, new Date(scan.created_at).toLocaleDateString(), scan.verdict, `${scan.confidence}%`, scan.duration, scan.file_size]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceguard_dashboard.csv";
    a.click();
    showToastLocal("CSV exported successfully", "success");
  };

  // Copy API Key (Mock)
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("vg_live_1234567890abcdef");
    showToastLocal("API Key copied to clipboard", "success");
  };

  // Share Scan Link
  const handleShare = (scanName: string) => {
    navigator.clipboard.writeText(`https://voiceguard.ai/scan/${scanName}`);
    showToastLocal(`Share link for "${scanName}" copied`, "success");
  };

  // Time range buttons
  const timeRanges = ["24h", "7d", "30d", "90d"];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#B784A7] animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading your dashboard...</p>
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
          <p className="text-muted mb-6">You need to be logged in to view your dashboard.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Welcome back! Here&apos;s your overview.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${isDarkMode ? "border-neutral-700 hover:border-[#B784A7]" : "border-gray-300 hover:border-[#B784A7]"} transition`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* Notifications */}
            <NotificationsPanel notifications={notifications} />
            
            {/* User Dropdown */}
            <UserDropdown user={{ name: user.email?.charAt(0).toUpperCase() || "U", email: user.email }} onLogout={() => showToastLocal("Logged out successfully", "info")} />
            
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition"
            >
              <Upload className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button onClick={handleCopyApiKey} className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} hover:border-[#B784A7] transition`}>
            <div className="p-2 bg-[#B784A7]/10 rounded-lg">
              <Copy className="w-5 h-5 text-[#B784A7]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Copy API Key</div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>vg_live_1234...</div>
            </div>
          </button>
          
          <button onClick={() => showToastLocal("Report generated successfully", "success")} className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} hover:border-[#B784A7] transition`}>
            <div className="p-2 bg-[#B784A7]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[#B784A7]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Generate Report</div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>PDF export</div>
            </div>
          </button>
          
          <button onClick={() => showToastLocal("API Access enabled", "success")} className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} hover:border-[#B784A7] transition`}>
            <div className="p-2 bg-[#B784A7]/10 rounded-lg">
              <Zap className="w-5 h-5 text-[#B784A7]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Enable API Access</div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Full integration</div>
            </div>
          </button>
          
          <button onClick={() => setCurrentPage(1)} className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} hover:border-[#B784A7] transition`}>
            <div className="p-2 bg-[#B784A7]/10 rounded-lg">
              <Shield className="w-5 h-5 text-[#B784A7]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">View Reports</div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>All analyses</div>
            </div>
          </button>
        </div>

        {/* Time Range Selector + Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
            <div className={`flex ${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-lg p-1`}>
              {timeRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 text-sm rounded-md transition ${
                    timeRange === range
                      ? "bg-[#B784A7]/20 text-[#B784A7]"
                      : `${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-2 px-4 py-2 border ${isDarkMode ? "border-neutral-700" : "border-gray-300"} rounded-xl text-sm transition`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6 card-hover cursor-pointer group`}
              onClick={() => setFilter(stat.label === "Total Scans" ? "ALL" : stat.label.replace(" Voices", "").toUpperCase())}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${stat.bg} rounded-lg group-hover:scale-110 transition`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500/50" />
              </div>
              <div className="text-3xl font-bold mb-1 group-hover:text-[#B784A7] transition">{stat.value}</div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Scan Trends</h2>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Activity className="w-3 h-3" />
                <span>Last 7 days</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#27272A" : "#E5E7EB"} />
                  <XAxis dataKey="day" stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={12} />
                  <YAxis stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="scans" stroke="#B784A7" strokeWidth={2} dot={{ r: 4 }} name="Total Scans" />
                  <Line type="monotone" dataKey="real" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} name="Real" />
                  <Line type="monotone" dataKey="fake" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Fake" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
            <h2 className="text-lg font-semibold mb-4">Usage Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#27272A" : "#E5E7EB"} />
                  <XAxis dataKey="day" stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={12} />
                  <YAxis stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="scans" stroke="#B784A7" fill="#B784A7" fillOpacity={0.2} name="Scans" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pie Chart */}
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
            <h2 className="text-lg font-semibold mb-4">Detection Breakdown</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={detectionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={5}>
                    {detectionData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              {detectionData.map((item) => (
                <button key={item.name} onClick={() => setFilter(item.name.toUpperCase())} className="flex items-center gap-2 hover:opacity-80 transition">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{item.name} ({Math.round((item.value/totalScans)*100)}%)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Radar Chart (FIXED - No overlapping numbers) */}
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
            <h2 className="text-lg font-semibold mb-4">Feature Analysis</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { feature: "Pitch", value: 85 },
                  { feature: "Tone", value: 72 },
                  { feature: "Rhythm", value: 90 },
                  { feature: "Noise", value: 65 },
                  { feature: "Breath", value: 78 },
                  { feature: "Frequency", value: 92 },
                ]}>
                  <PolarGrid stroke={isDarkMode ? "#27272A" : "#E5E7EB"} />
                  <PolarAngleAxis dataKey="feature" tick={{ fill: isDarkMode ? "#A1A1AA" : "#6B7280", fontSize: 12 }} />
                  <PolarRadiusAxis tick={false} stroke={isDarkMode ? "#27272A" : "#E5E7EB"} />
                  <Radar dataKey="value" stroke="#B784A7" fill="#B784A7" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
            <h2 className="text-lg font-semibold mb-4">Confidence Distribution</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#27272A" : "#E5E7EB"} />
                  <XAxis dataKey="name" stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={10} />
                  <YAxis stroke={isDarkMode ? "#A1A1AA" : "#6B7280"} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#B784A7" radius={[4, 4, 0, 0]} name="Scans" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Scan History Section with Filters */}
        <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold">Scan History</h2>
            
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-9 pr-4 py-2 ${isDarkMode ? "bg-black border-neutral-700" : "bg-gray-50 border-gray-300"} border rounded-lg text-sm placeholder-gray-500 focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition w-full sm:w-64`}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`pl-9 pr-8 py-2 ${isDarkMode ? "bg-black border-neutral-700" : "bg-gray-50 border-gray-300"} border rounded-lg text-sm appearance-none focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition cursor-pointer`}
                  >
                    <option value="ALL">All Verdicts</option>
                    <option value="REAL">Real</option>
                    <option value="FAKE">Fake</option>
                    <option value="SUSPICIOUS">Suspicious</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"} pointer-events-none`} />
                </div>

                <button
                  onClick={exportCSV}
                  className={`inline-flex items-center gap-2 px-3 py-2 ${isDarkMode ? "bg-black border-neutral-700" : "bg-gray-50 border-gray-300"} border rounded-lg text-sm transition`}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedScans.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-lg">
              <span className="text-sm text-[#B784A7] font-medium">{selectedScans.length} selected</span>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition">
                <Trash2 className="w-3 h-3" /> Delete Selected
              </button>
              <button onClick={() => setSelectedScans([])} className="text-gray-400 text-sm hover:text-white transition">Clear</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-neutral-800" : "border-gray-200"} text-sm`}>
                  <th className="pb-3 pr-4 font-medium">
                    <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-[#B784A7] transition">
                      <ArrowUpDown className="w-3 h-3" /> Filename
                    </button>
                  </th>
                  <th className="pb-3 pr-4 font-medium">
                    <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-[#B784A7] transition">
                      <ArrowUpDown className="w-3 h-3" /> Date
                    </button>
                  </th>
                  <th className="pb-3 pr-4 font-medium">Duration</th>
                  <th className="pb-3 pr-4 font-medium">Size</th>
                  <th className="pb-3 pr-4 font-medium">Verdict</th>
                  <th className="pb-3 pr-4 font-medium">
                    <button onClick={() => handleSort("confidence")} className="flex items-center gap-1 hover:text-[#B784A7] transition">
                      <ArrowUpDown className="w-3 h-3" /> Confidence
                    </button>
                  </th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedScans.length > 0 ? (
                  paginatedScans.map((scan: any) => (
                    <tr key={scan.id} className={`border-b ${isDarkMode ? "border-neutral-800/50" : "border-gray-200"} last:border-0 hover:bg-neutral-900/50 transition group`}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedScans.includes(scan.id)}
                            onChange={() => {
                              if (selectedScans.includes(scan.id)) {
                                setSelectedScans(selectedScans.filter((id) => id !== scan.id));
                              } else {
                                setSelectedScans([...selectedScans, scan.id]);
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-600 accent-[#B784A7]"
                          />
                          <FileAudio className={`w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"} group-hover:text-[#B784A7] transition`} />
                          <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{scan.file_name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-3 h-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                          <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{new Date(scan.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{scan.duration || "N/A"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{scan.file_size || "N/A"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          scan.verdict === "REAL" ? "bg-green-500/10 text-green-500" :
                          scan.verdict === "FAKE" ? "bg-red-500/10 text-red-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {scan.verdict === "REAL" && <CheckCircle className="w-3 h-3" />}
                          {scan.verdict === "FAKE" && <XCircle className="w-3 h-3" />}
                          {scan.verdict === "SUSPICIOUS" && <AlertTriangle className="w-3 h-3" />}
                          {scan.verdict}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-1.5 ${isDarkMode ? "bg-neutral-800" : "bg-gray-200"} rounded-full overflow-hidden`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                scan.confidence > 90 ? "bg-green-500" :
                                scan.confidence > 80 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${scan.confidence}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{scan.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedScan(scan); setIsModalOpen(true); }}
                            className={`p-1.5 rounded-lg ${isDarkMode ? "text-gray-400 hover:text-[#B784A7]" : "text-gray-600 hover:text-[#B784A7]"} hover:bg-[#B784A7]/10 transition`}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(scan.file_name)}
                            className={`p-1.5 rounded-lg ${isDarkMode ? "text-gray-400 hover:text-[#B784A7]" : "text-gray-600 hover:text-[#B784A7]"} hover:bg-[#B784A7]/10 transition`}
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(scan.id)}
                            className={`p-1.5 rounded-lg ${isDarkMode ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500"} hover:bg-red-500/10 transition`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className={`text-4xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
                        <FileAudio className="w-12 h-12 mx-auto" />
                      </div>
                      <div className={`text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No scans found</div>
                      <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Try adjusting your filters or search term.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredScans.length)} of {filteredScans.length} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${isDarkMode ? "border-neutral-700" : "border-gray-300"} disabled:opacity-50 hover:border-[#B784A7] transition`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-[#B784A7] text-black"
                        : `${isDarkMode ? "bg-neutral-800 text-gray-300" : "bg-gray-200 text-gray-700"} hover:bg-[#B784A7]/20 hover:text-[#B784A7]`
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${isDarkMode ? "border-neutral-700" : "border-gray-300"} disabled:opacity-50 hover:border-[#B784A7] transition`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedScan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? "bg-[#111111] border-neutral-800" : "bg-white border-gray-200"} border rounded-2xl p-6 max-w-md w-full`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Scan Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileAudio className="w-8 h-8 text-[#B784A7]" />
                <div>
                  <div className="font-medium">{selectedScan.file_name}</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{new Date(selectedScan.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`${isDarkMode ? "bg-black" : "bg-gray-50"} rounded-lg p-3`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Verdict</div>
                  <div className={`font-bold ${
                    selectedScan.verdict === "REAL" ? "text-green-500" :
                    selectedScan.verdict === "FAKE" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {selectedScan.verdict}
                  </div>
                </div>
                <div className={`${isDarkMode ? "bg-black" : "bg-gray-50"} rounded-lg p-3`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Confidence</div>
                  <div className="font-bold">{selectedScan.confidence}%</div>
                </div>
                <div className={`${isDarkMode ? "bg-black" : "bg-gray-50"} rounded-lg p-3`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Duration</div>
                  <div className="font-bold">{selectedScan.duration || "N/A"}</div>
                </div>
                <div className={`${isDarkMode ? "bg-black" : "bg-gray-50"} rounded-lg p-3`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Size</div>
                  <div className="font-bold">{selectedScan.file_size || "N/A"}</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-neutral-700 rounded-lg text-sm hover:border-[#B784A7] transition">Close</button>
                <button onClick={() => handleDelete(selectedScan.id)} className="flex-1 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition">Delete</button>
                <button onClick={() => handleShare(selectedScan.file_name)} className="flex-1 py-2 bg-[#B784A7]/10 text-[#B784A7] rounded-lg text-sm hover:bg-[#B784A7]/20 transition">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}