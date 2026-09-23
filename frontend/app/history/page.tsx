"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileAudio, Search, Filter, Download, Trash2, Eye, ChevronDown, Clock,
  CheckCircle, XCircle, AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight,
  Calendar, Upload, X, Check, Info, Share2, Loader2, Lock,
  RefreshCw, Pin, PinOff, LayoutGrid, List, DownloadCloud, FileText,
  MoreVertical, Play, Pause, Scissors, Copy, ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/toast";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedScans, setSelectedScans] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedScan, setSelectedScan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch real scans
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
      console.error("Error fetching scans:", error);
      showToast(error.message || "Failed to fetch scans", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchScans();
  }, [user, authLoading]);

  // Real stats
  const totalScans = scans.length;
  const realScans = scans.filter((s) => s.verdict === "REAL").length;
  const fakeScans = scans.filter((s) => s.verdict === "FAKE").length;
  const suspiciousScans = scans.filter((s) => s.verdict === "SUSPICIOUS").length;

  // Filtered & sorted
  const filteredScans = useMemo(() => {
    let result = scans.filter((scan) => {
      const matchesFilter = filter === "ALL" || scan.verdict === filter;
      const matchesSearch = scan.file_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = new Date(scan.created_at).toDateString() === new Date().toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(scan.created_at) >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(scan.created_at) >= monthAgo;
      }
      
      return matchesFilter && matchesSearch && matchesDate;
    });

    result.sort((a: any, b: any) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "confidence") {
        return sortOrder === "asc" ? a.confidence - b.confidence : b.confidence - a.confidence;
      }
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.file_name.localeCompare(b.file_name)
          : b.file_name.localeCompare(a.file_name);
      }
      return 0;
    });

    return result;
  }, [scans, filter, searchTerm, dateFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);
  const paginatedScans = filteredScans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Delete scan
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("scans").delete().eq("id", id);
      if (error) throw error;
      setScans(scans.filter((scan) => scan.id !== id));
      setIsModalOpen(false);
      showToast("Scan deleted successfully!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to delete", "error");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedScans.length === 0) return;
    try {
      const { error } = await supabase.from("scans").delete().in("id", selectedScans);
      if (error) throw error;
      setScans(scans.filter((scan) => !selectedScans.includes(scan.id)));
      setSelectedScans([]);
      showToast(`Deleted ${selectedScans.length} scans`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to delete scans", "error");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Filename", "Date", "Verdict", "Confidence", "Duration", "Size"];
    const rows = filteredScans.map((scan: any) => [
      scan.file_name,
      new Date(scan.created_at).toLocaleDateString(),
      scan.verdict,
      `${scan.confidence}%`,
      scan.duration,
      scan.file_size,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceguard_history.csv";
    a.click();
    showToast("CSV exported successfully!", "success");
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Play/Pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#B784A7] animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading your scans...</p>
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
          <p className="text-muted mb-6">You need to be logged in to view your scan history.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scan History</h1>
            <p className="text-muted">View all your past voice analyses</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={exportCSV} 
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm hover:border-[#B784A7] transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => { showToast("Scans refreshed successfully!", "success"); fetchScans(); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm hover:border-[#B784A7] transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link 
              href="/analyze" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B784A7] text-white font-bold rounded-xl hover:bg-[#A06A8F] hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition-all duration-300"
            >
              <Upload className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 hover:border-[#B784A7]/50 transition-all duration-300">
            <span className="text-2xl font-bold text-[#B784A7]">{totalScans}</span>
            <span className="text-sm text-muted">Total</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 hover:border-green-500/50 transition-all duration-300 cursor-pointer" onClick={() => setFilter("REAL")}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-2xl font-bold text-green-500">{realScans}</span>
            <span className="text-sm text-muted">Real</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 hover:border-red-500/50 transition-all duration-300 cursor-pointer" onClick={() => setFilter("FAKE")}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-2xl font-bold text-red-500">{fakeScans}</span>
            <span className="text-sm text-muted">Fake</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-5 py-3 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer" onClick={() => setFilter("SUSPICIOUS")}>
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            <span className="text-2xl font-bold text-yellow-500">{suspiciousScans}</span>
            <span className="text-sm text-muted">Suspicious</span>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm placeholder-muted focus:border-[#B784A7] focus:outline-none focus:ring-1 focus:ring-[#B784A7] transition-all duration-300"
            />
          </div>

          <div className="flex gap-3">
            {/* Verdict Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-8 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm appearance-none focus:border-[#B784A7] focus:outline-none transition-all duration-300 cursor-pointer"
              >
                <option value="ALL">All Verdicts</option>
                <option value="REAL">Real</option>
                <option value="FAKE">Fake</option>
                <option value="SUSPICIOUS">Suspicious</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-8 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm appearance-none focus:border-[#B784A7] focus:outline-none transition-all duration-300 cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === "table" ? "bg-[#B784A7] text-black shadow-lg" : "text-muted hover:bg-neutral-700"}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === "grid" ? "bg-[#B784A7] text-black shadow-lg" : "text-muted hover:bg-neutral-700"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedScans.length > 0 && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-xl animate-slide-in">
            <span className="text-sm text-[#B784A7] font-semibold">{selectedScans.length} selected</span>
            <button onClick={handleBulkDelete} className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition-all duration-300">
              <Trash2 className="w-3 h-3" /> Delete Selected
            </button>
            <button onClick={() => setSelectedScans([])} className="text-muted text-sm hover:text-main transition">Clear</button>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-muted">
                    <th className="px-5 py-4 font-medium">
                      <button
                        onClick={() => {
                          if (selectedScans.length === paginatedScans.length) {
                            setSelectedScans([]);
                          } else {
                            setSelectedScans(paginatedScans.map((scan: any) => scan.id));
                          }
                        }}
                        className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-300 ${
                          selectedScans.length === paginatedScans.length
                            ? "bg-[#B784A7] border-[#B784A7]"
                            : "border-[var(--border-color)] hover:border-[#B784A7]"
                        }`}
                      >
                        {selectedScans.length === paginatedScans.length ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs text-muted">{paginatedScans.length}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-5 py-4 font-medium">
                      <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-[#B784A7] transition-all duration-300">
                        <ArrowUpDown className="w-3 h-3" /> Filename
                      </button>
                    </th>
                    <th className="px-5 py-4 font-medium">
                      <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-[#B784A7] transition-all duration-300">
                        <ArrowUpDown className="w-3 h-3" /> Date
                      </button>
                    </th>
                    <th className="px-5 py-4 font-medium">Verdict</th>
                    <th className="px-5 py-4 font-medium">
                      <button onClick={() => handleSort("confidence")} className="flex items-center gap-1 hover:text-[#B784A7] transition-all duration-300">
                        <ArrowUpDown className="w-3 h-3" /> Confidence
                      </button>
                    </th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedScans.length > 0 ? (
                    paginatedScans.map((scan: any, index: number) => (
                      <tr 
                        key={scan.id} 
                        className="border-b border-[var(--border-color)]/50 last:border-0 hover:bg-[#B784A7]/5 transition-all duration-300 group"
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              if (selectedScans.includes(scan.id)) {
                                setSelectedScans(selectedScans.filter((id) => id !== scan.id));
                              } else {
                                setSelectedScans([...selectedScans, scan.id]);
                              }
                            }}
                            className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-300 ${
                              selectedScans.includes(scan.id)
                                ? "bg-[#B784A7] border-[#B784A7]"
                                : "border-[var(--border-color)] hover:border-[#B784A7]"
                            }`}
                          >
                            {selectedScans.includes(scan.id) ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-xs text-muted">{index + 1}</span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#B784A7]/10 rounded-lg group-hover:scale-110 transition-all duration-300">
                              <FileAudio className="w-4 h-4 text-[#B784A7]" />
                            </div>
                            <span className="text-sm font-medium">{scan.file_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted" />
                            <span className="text-sm">{new Date(scan.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            scan.verdict === "REAL" ? "bg-green-500/10 text-green-500" :
                            scan.verdict === "FAKE" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                            {scan.verdict === "REAL" && <CheckCircle className="w-3 h-3" />}
                            {scan.verdict === "FAKE" && <XCircle className="w-3 h-3" />}
                            {scan.verdict === "SUSPICIOUS" && <AlertTriangle className="w-3 h-3" />}
                            {scan.verdict}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  scan.confidence > 90 ? "bg-green-500" : scan.confidence > 80 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${scan.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">{scan.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setSelectedScan(scan); setIsModalOpen(true); }} 
                              className="p-2 rounded-lg text-muted hover:text-[#B784A7] hover:bg-[#B784A7]/10 transition-all duration-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(scan.id)} 
                              className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
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
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-[#B784A7]/10 rounded-full mb-4">
                            <FileAudio className="w-12 h-12 text-[#B784A7]" />
                          </div>
                          <div className="text-lg font-medium text-muted mb-2">No scans found</div>
                          <div className="text-sm text-muted mb-6">Start by analyzing your first audio file!</div>
                          <Link href="/analyze" className="inline-flex items-center gap-2 px-6 py-3 bg-[#B784A7] text-white font-bold rounded-xl hover:bg-[#A06A8F] hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition-all duration-300">
                            <Upload className="w-4 h-4" /> Analyze Audio
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedScans.map((scan: any) => (
              <div 
                key={scan.id} 
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 hover:border-[#B784A7] hover:shadow-[0_10px_40px_rgba(183,132,167,0.15)] transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${scan.verdict === "REAL" ? "bg-green-500/10" : scan.verdict === "FAKE" ? "bg-red-500/10" : "bg-yellow-500/10"}`}>
                      <FileAudio className={`w-5 h-5 ${scan.verdict === "REAL" ? "text-green-500" : scan.verdict === "FAKE" ? "text-red-500" : "text-yellow-500"}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{scan.file_name}</div>
                      <div className="text-xs text-muted">{new Date(scan.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted mb-2">
                    <span>Confidence</span>
                    <span className="font-bold">{scan.confidence}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scan.confidence > 90 ? "bg-green-500" : scan.confidence > 80 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${scan.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    scan.verdict === "REAL" ? "bg-green-500/10 text-green-500" : scan.verdict === "FAKE" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {scan.verdict}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedScan(scan); setIsModalOpen(true); }} className="p-2 rounded-lg text-muted hover:text-[#B784A7] transition-all duration-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(scan.id)} className="p-2 rounded-lg text-muted hover:text-red-500 transition-all duration-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredScans.length)} of {filteredScans.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-[var(--border-color)] disabled:opacity-50 hover:border-[#B784A7] transition-all duration-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPage === page ? "bg-[#B784A7] text-black shadow-lg" : "bg-[var(--bg-secondary)] text-muted hover:bg-[#B784A7]/20 hover:text-[#B784A7]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-[var(--border-color)] disabled:opacity-50 hover:border-[#B784A7] transition-all duration-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedScan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Scan Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-muted hover:text-main transition-all duration-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#B784A7]/10 rounded-xl">
                  <FileAudio className="w-8 h-8 text-[#B784A7]" />
                </div>
                <div>
                  <div className="font-bold">{selectedScan.file_name}</div>
                  <div className="text-sm text-muted">{new Date(selectedScan.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-main)] rounded-xl p-4">
                  <div className="text-xs text-muted mb-1">Verdict</div>
                  <div className={`font-bold ${selectedScan.verdict === "REAL" ? "text-green-500" : selectedScan.verdict === "FAKE" ? "text-red-500" : "text-yellow-500"}`}>
                    {selectedScan.verdict}
                  </div>
                </div>
                <div className="bg-[var(--bg-main)] rounded-xl p-4">
                  <div className="text-xs text-muted mb-1">Confidence</div>
                  <div className="font-bold">{selectedScan.confidence}%</div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-[var(--border-color)] rounded-xl text-sm hover:border-[#B784A7] transition-all duration-300">
                  Close
                </button>
                <button onClick={() => handleDelete(selectedScan.id)} className="flex-1 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-sm hover:bg-red-500/20 transition-all duration-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}