"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Mic, Link as LinkIcon, FileAudio, X, CheckCircle, XCircle, AlertTriangle,
  Loader2, Play, Pause, Download, Share2, RefreshCw, Settings2, BarChart3, Activity,
  FileText, Zap, Shield, Clock, Info, Globe, Layers,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/toast";

export default function AnalyzePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fix hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // State
  const [uploadMode, setUploadMode] = useState<"file" | "url" | "record">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [threshold, setThreshold] = useState(70);
  const [model, setModel] = useState("v2.1");
  const [dragActive, setDragActive] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [analysisSpeed, setAnalysisSpeed] = useState("fast");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  // Real API URL
  const API_URL = "http://localhost:8000";

  // Helper: Format duration (seconds to HH:MM:SS or MM:SS)
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper: Get gauge color based on verdict
  const getGaugeColor = (verdict: string) => {
    if (verdict === "REAL") return "#22C55E";
    if (verdict === "FAKE") return "#EF4444";
    return "#EAB308";
  };

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  };

  // Handle batch file upload
  const handleBatchSelect = (files: FileList) => {
    const newFiles = Array.from(files);
    setBatchFiles([...batchFiles, ...newFiles]);
  };

  // Handle drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Save scan to Supabase
  const saveScanToSupabase = async (scanResult: any) => {
    if (!user) {
      showToast("Please log in to save scans", "info");
      return;
    }

    try {
      let fileUrl = url;
      if (file) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("audio-files")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          showToast(`Upload failed: ${uploadError.message}`, "error");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("audio-files")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("scans").insert({
        user_id: user.id,
        file_name: file?.name || url || "Unknown file",
        file_url: fileUrl,
        verdict: scanResult.verdict,
        confidence: scanResult.confidence,
        duration: scanResult.duration,
        file_size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "N/A",
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        showToast(`Failed to save scan: ${insertError.message}`, "error");
      } else {
        showToast("File uploaded and scan saved successfully!", "success");
      }
    } catch (error) {
      console.error("Error in saveScanToSupabase:", error);
      showToast("Error saving scan", "error");
    }
  };

  // Analyze file (Real API Call)
  const handleAnalyze = async () => {
    if (!file && !url && batchFiles.length === 0) {
      showToast("Please upload a file or provide a URL", "error");
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("threshold", threshold.toString());

        response = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_url: url, threshold }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Format duration (seconds to HH:MM:SS or MM:SS)
      const formattedDuration = formatDuration(data.duration);

      // Use normalized features from backend (0-100 range)
      const normFeatures = data.features?.normalized_features || {};
      
      // Build result object from real API
      const resultData = {
        verdict: data.verdict,
        confidence: data.confidence,
        duration: formattedDuration,
        size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "N/A",
        timestamp: new Date().toLocaleString(),
        features: [
          { name: "Spectral Centroid", score: normFeatures.spectral_centroid || 0, status: normFeatures.spectral_centroid > 70 ? "suspicious" : "normal" },
          { name: "Zero Crossing Rate", score: normFeatures.zero_crossing_rate || 0, status: normFeatures.zero_crossing_rate > 70 ? "suspicious" : "normal" },
          { name: "MFCC Mean", score: normFeatures.mfcc || 0, status: normFeatures.mfcc > 70 ? "suspicious" : "normal" },
          { name: "Pitch", score: normFeatures.pitch || 0, status: normFeatures.pitch > 70 ? "suspicious" : "normal" },
        ],
        deepAnalysis: {
          spectralCentroid: normFeatures.spectral_centroid || 0,
          zeroCrossingRate: normFeatures.zero_crossing_rate || 0,
          mfccDistance: normFeatures.mfcc || 0,
          harmonicRatio: normFeatures.pitch || 0,
        },
      };

      setProgress(100);
      setResult(resultData);
      await saveScanToSupabase({
        verdict: data.verdict,
        confidence: data.confidence,
        duration: formattedDuration,
      });
      showToast("Analysis complete!", "success");
    } catch (error: any) {
      console.error("Analysis error:", error);
      showToast(error.message || "Failed to analyze audio. Make sure backend is running.", "error");
      setProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset
  const handleReset = () => {
    setFile(null);
    setUrl("");
    setResult(null);
    setProgress(0);
    setIsAnalyzing(false);
    setBatchFiles([]);
  };

  // Audio player mock
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Export Report
  const handleExport = () => {
    const report = JSON.stringify(result, null, 2);
    const blob = new Blob([report], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceguard_report.json";
    a.click();
    showToast("Report downloaded!", "success");
  };

  // Share result
  const handleShare = () => {
    navigator.clipboard.writeText(`https://voiceguard.ai/scan/${file?.name || url}`);
    showToast("Share link copied to clipboard!", "success");
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Analyze <span className="gradient-text">Audio</span>
          </h1>
          <p className="text-muted">Upload a voice recording to detect if it&apos;s real or AI-generated</p>
        </div>

        {/* ========== UPLOAD SECTION ========== */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
          {/* Mode Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "file" as const, label: "Upload File", icon: Upload },
              { id: "url" as const, label: "From URL", icon: LinkIcon },
              { id: "record" as const, label: "Record", icon: Mic },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setUploadMode(mode.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
                  uploadMode === mode.id
                    ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                    : "bg-[var(--bg-secondary)] text-muted hover:bg-neutral-700"
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Upload Area */}
          {uploadMode === "file" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
                dragActive ? "border-[#B784A7] bg-[#B784A7]/10" : "border-[var(--border-color)] hover:border-[#B784A7]"
              }`}
            >
              {!file ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-[#B784A7]/10 rounded-full">
                      <Upload className="w-8 h-8 text-[#B784A7]" />
                    </div>
                  </div>
                  <p className="font-medium mb-2">Drag & drop your audio file here</p>
                  <p className="text-muted text-sm mb-6">Supports MP3, WAV, M4A, FLAC (Max 50MB)</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition"
                  >
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 bg-[#B784A7]/10 rounded-full">
                    <FileAudio className="w-6 h-6 text-[#B784A7]" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-muted text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-muted hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-[var(--bg-main)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-[#B784A7]" />
                <label className="text-sm">Detection Threshold</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="flex-1 accent-[#B784A7]"
                />
                <span className="text-sm font-bold text-[#B784A7]">{threshold}%</span>
              </div>
              <p className="text-xs text-muted mt-2">Higher threshold = stricter detection</p>
            </div>

            <div className="bg-[var(--bg-main)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#B784A7]" />
                <label className="text-sm">Model Version</label>
              </div>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-main text-sm focus:border-[#B784A7] focus:outline-none transition"
              >
                <option value="v2.1">v2.1 (Latest - Recommended)</option>
                <option value="v2.0">v2.0 (Stable)</option>
                <option value="v1.5">v1.5 (Legacy)</option>
              </select>
              <p className="text-xs text-muted mt-2">Choose the AI model to use</p>
            </div>
          </div>

          {/* Analyze Button */}
          {!isAnalyzing && (
            <button
              onClick={handleAnalyze}
              className="w-full mt-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
            >
              {file || url || batchFiles.length > 0 ? "Analyze Audio" : "Upload Audio to Analyze"}
            </button>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Analyzing audio...</span>
                <span className="text-sm font-bold text-[#B784A7]">{progress}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B784A7] to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Loader2 className="w-4 h-4 text-[#B784A7] animate-spin" />
                <span className="text-xs text-muted">
                  {progress < 30 ? "Preprocessing audio..." : progress < 60 ? "Extracting features..." : progress < 90 ? "Running deep learning model..." : "Generating report..."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========== RESULTS SECTION ========== */}
        {result && !isAnalyzing && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8">
            {/* Verdict Banner */}
            <div className={`flex flex-col items-center justify-center p-8 rounded-2xl mb-8 ${
              result.verdict === "REAL" ? "bg-green-500/10 border border-green-500/20" :
              result.verdict === "FAKE" ? "bg-red-500/10 border border-red-500/20" :
              "bg-yellow-500/10 border border-yellow-500/20"
            }`}>
              <div className={`p-4 rounded-full mb-4 ${
                result.verdict === "REAL" ? "bg-green-500/20" :
                result.verdict === "FAKE" ? "bg-red-500/20" :
                "bg-yellow-500/20"
              }`}>
                {result.verdict === "FAKE" ? (
                  <XCircle className="w-14 h-14 text-red-500" />
                ) : result.verdict === "REAL" ? (
                  <CheckCircle className="w-14 h-14 text-green-500" />
                ) : (
                  <AlertTriangle className="w-14 h-14 text-yellow-500" />
                )}
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                result.verdict === "REAL" ? "text-green-500" :
                result.verdict === "FAKE" ? "text-red-500" :
                "text-yellow-500"
              }`}>
                {result.verdict}
              </h2>
              <p className="text-muted">
                {result.verdict === "FAKE" ? "This audio appears to be AI-generated" : 
                 result.verdict === "REAL" ? "This audio appears to be genuine" :
                 "This audio requires further investigation"}
              </p>
            </div>

            {/* Confidence Meter & Details (Fully Aligned) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Confidence Score - PERFECTLY CENTERED */}
              <div className="bg-[var(--bg-main)] rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* SVG Gauge */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={getGaugeColor(result.verdict)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.confidence / 100) * 264} 264`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  {/* HTML Text for Perfect Centering */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{result.confidence}%</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-6 mb-1">Confidence Score</h3>
                <p className="text-muted text-sm">How confident we are in this verdict</p>
              </div>

              {/* Audio Details - Perfectly Aligned */}
              <div className="bg-[var(--bg-main)] rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-6">Audio Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Duration</span>
                    <span className="font-medium text-sm">{result.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Size</span>
                    <span className="font-medium text-sm">{result.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Analyzed At</span>
                    <span className="font-medium text-sm">{result.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Model</span>
                    <span className="font-medium text-sm">{model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted text-sm">Threshold</span>
                    <span className="font-medium text-sm">{threshold}%</span>
                  </div>
                </div>

                {/* Audio Player (No hardcoded time) */}
                <div className="mt-8 flex items-center gap-3 bg-[var(--bg-secondary)] rounded-xl p-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-3 bg-[#B784A7] rounded-full text-black hover:shadow-[0_0_15px_rgba(183,132,167,0.5)] transition"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B784A7] rounded-full" style={{ width: "35%" }} />
                  </div>
                  <span className="text-xs text-muted">Playing audio...</span>
                </div>
              </div>
            </div>

            {/* Feature Analysis */}
            <div className="bg-[var(--bg-main)] rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-semibold mb-6">Feature Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.features.map((feature: any, i: number) => (
                  <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{feature.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        feature.score > 70 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                      }`}>
                        {feature.score > 70 ? "Suspicious" : "Normal"}
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          feature.score > 70 ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(100, feature.score)}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-muted mt-2 font-bold">{Math.round(feature.score)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 border border-[var(--border-color)] rounded-xl font-medium hover:border-[#B784A7] transition"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Analyze Another
              </button>
              <button
                onClick={handleExport}
                className="flex-1 py-3 bg-[#B784A7]/10 text-[#B784A7] rounded-xl font-medium hover:bg-[#B784A7]/20 transition"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download Report
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition"
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Share Result
              </button>
            </div>
          </div>
        )}

        {/* ========== INFO SECTION ========== */}
        {!result && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Shield, title: "Advanced AI", desc: "Deep learning models trained on millions of samples" },
              { icon: Activity, title: "Real-time Analysis", desc: "Get results in seconds, not hours" },
              { icon: BarChart3, title: "Detailed Reports", desc: "Comprehensive breakdown of every detection" },
            ].map((info) => (
              <div key={info.title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 text-center">
                <info.icon className="w-8 h-8 text-[#B784A7] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{info.title}</h3>
                <p className="text-muted text-sm">{info.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}