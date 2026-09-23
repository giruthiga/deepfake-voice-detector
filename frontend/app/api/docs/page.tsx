"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  Copy,
  Check,
  Terminal,
  Code2,
  Globe,
  Lock,
  Key,
  Zap,
  Server,
  Database,
  Cpu,
  Layers,
  FileJson,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Send,
  Loader2,
  Info,
  X,
  CheckCircle,
  AlertTriangle,
  Play,
  Settings2,
  ArrowRight,
  RefreshCw,
  Menu,
  Plus,
  Trash2,
  History,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("analyze");
  const [activeLanguage, setActiveLanguage] = useState("python");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("vg_live_1234567890abcdef");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseHistory, setResponseHistory] = useState<any[]>([]);
  const [showResponseHistory, setShowResponseHistory] = useState(false);
  const [requestBody, setRequestBody] = useState(`{
  "file_url": "https://example.com/audio.mp3",
  "threshold": 70,
  "model": "v2.1"
}`);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [paramsEnabled, setParamsEnabled] = useState<{
    file_url: boolean;
    threshold: boolean;
    model: boolean;
    language: boolean;
  }>({
    file_url: true,
    threshold: true,
    model: false,
    language: false,
  });
  const [statusCode, setStatusCode] = useState<number | null>(null);

  // Code examples for different languages
  const codeExamples: Record<string, string> = {
    python: `import requests

# VoiceGuard API - Analyze Audio
url = "https://api.voiceguard.ai/v1/analyze"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "file_url": "https://example.com/audio.mp3",
    "threshold": 70
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    javascript: `// VoiceGuard API - Analyze Audio
const url = "https://api.voiceguard.ai/v1/analyze";
const headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
};

const payload = {
    file_url: "https://example.com/audio.mp3",
    threshold: 70
};

fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));`,
    curl: `curl -X POST "https://api.voiceguard.ai/v1/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_url": "https://example.com/audio.mp3",
    "threshold": 70
  }'`,
  };

  // API Endpoints
  const endpoints = [
    {
      id: "analyze",
      method: "POST",
      path: "/v1/analyze",
      title: "Analyze Audio",
      desc: "Analyze an audio file to detect if it's real or AI-generated.",
      icon: Zap,
      request: {
        file_url: "string (required)",
        threshold: "number (optional, default: 70)",
        model: "string (optional, default: v2.1)",
      },
      response: `{
  "verdict": "FAKE",
  "confidence": 94.2,
  "duration": "3:45",
  "segments": [
    { "start": "0:00", "end": "0:45", "verdict": "REAL", "confidence": 95 },
    { "start": "0:45", "end": "2:15", "verdict": "SUSPICIOUS", "confidence": 68 }
  ]
}`,
    },
    {
      id: "batch",
      method: "POST",
      path: "/v1/batch",
      title: "Batch Analyze",
      desc: "Analyze multiple audio files in a single request (up to 10 files).",
      icon: Layers,
      request: {
        files: "array of file_urls (required)",
        threshold: "number (optional, default: 70)",
      },
      response: `{
  "results": [
    { "file": "audio1.mp3", "verdict": "REAL", "confidence": 98 },
    { "file": "audio2.mp3", "verdict": "FAKE", "confidence": 91 }
  ],
  "total": 2
}`,
    },
    {
      id: "history",
      method: "GET",
      path: "/v1/history",
      title: "Get History",
      desc: "Retrieve your past analyses with pagination.",
      icon: Server,
      request: {
        page: "number (optional, default: 1)",
        limit: "number (optional, default: 10)",
        verdict: "string (optional: REAL, FAKE, SUSPICIOUS)",
      },
      response: `{
  "scans": [
    { "id": 1, "file": "interview.mp3", "verdict": "REAL" }
  ],
  "total": 247,
  "page": 1
}`,
    },
    {
      id: "models",
      method: "GET",
      path: "/v1/models",
      title: "List Models",
      desc: "Get available AI models for analysis.",
      icon: Cpu,
      request: {},
      response: `{
  "models": [
    { "id": "v2.1", "name": "Latest", "accuracy": "99.2%" },
    { "id": "v2.0", "name": "Stable", "accuracy": "98.5%" },
    { "id": "v1.5", "name": "Legacy", "accuracy": "96.8%" }
  ]
}`,
    },
    {
      id: "usage",
      method: "GET",
      path: "/v1/usage",
      title: "Get Usage",
      desc: "Check your API usage and limits.",
      icon: Database,
      request: {},
      response: `{
  "api_calls": 1240,
  "monthly_limit": 2000,
  "remaining": 760
}`,
    },
  ];

  const activeEndpointData = endpoints.find(e => e.id === activeEndpoint)!;

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy API Key
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate new API Key
  const handleGenerateKey = () => {
    const newKey = "vg_live_" + Math.random().toString(36).substring(2, 20);
    setApiKey(newKey);
    setCopied(false);
  };

  // Toggle parameter (FIXED)
  const toggleParam = (param: keyof typeof paramsEnabled) => {
    setParamsEnabled({
      ...paramsEnabled,
      [param]: !paramsEnabled[param],
    });
  };

  // Build request body from enabled params
  const buildRequestBody = () => {
    const body: any = {};
    if (paramsEnabled.file_url) body.file_url = "https://example.com/audio.mp3";
    if (paramsEnabled.threshold) body.threshold = 70;
    if (paramsEnabled.model) body.model = "v2.1";
    if (paramsEnabled.language) body.language = "en-US";
    return JSON.stringify(body, null, 2);
  };

  // Send request (simulated)
  const handleTryIt = () => {
    setIsLoading(true);
    setResponse(null);
    setStatusCode(null);

    // Simulate API call
    setTimeout(() => {
      let mockResponse;
      let status;

      if (activeEndpoint === "analyze") {
        mockResponse = {
          verdict: "FAKE",
          confidence: 94.2,
          duration: "3:45",
          segments: [
            { start: "0:00", end: "0:45", verdict: "REAL", confidence: 95 },
            { start: "0:45", end: "2:15", verdict: "SUSPICIOUS", confidence: 68 },
          ],
        };
        status = 200;
      } else if (activeEndpoint === "batch") {
        mockResponse = {
          results: [
            { file: "audio1.mp3", verdict: "REAL", confidence: 98 },
            { file: "audio2.mp3", verdict: "FAKE", confidence: 91 },
          ],
          total: 2,
        };
        status = 200;
      } else if (activeEndpoint === "history") {
        mockResponse = {
          scans: [
            { id: 1, file: "interview.mp3", verdict: "REAL", confidence: 98 },
            { id: 2, file: "voice_note.mp3", verdict: "FAKE", confidence: 94 },
          ],
          total: 247,
          page: 1,
        };
        status = 200;
      } else {
        mockResponse = {
          success: true,
          message: "Request successful",
          data: JSON.parse(activeEndpointData.response),
        };
        status = 200;
      }

      setResponse(mockResponse);
      setStatusCode(status);
      setResponseHistory([...responseHistory, { endpoint: activeEndpoint, status, timestamp: new Date().toLocaleTimeString() }]);
      setIsLoading(false);
    }, 1500);
  };

  // Set request body based on params
  const handleParamsChange = () => {
    setRequestBody(buildRequestBody());
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-[#B784A7]" />
            <span className="text-[#B784A7] text-sm font-medium">API Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Build with <span className="gradient-text">VoiceGuard</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Integrate deepfake voice detection into your applications with our powerful REST API.
          </p>
        </div>

        {/* API Key Section */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                <Key className="w-5 h-5 text-[#B784A7]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Your API Key</h3>
                <p className="text-gray-400 text-xs">Use this key to authenticate requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <code className="flex items-center gap-2 bg-black border border-neutral-700 rounded-lg px-4 py-2 text-white text-sm">
                  {showKey ? apiKey : "•".repeat(apiKey.length)}
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-gray-500 hover:text-[#B784A7] transition"
                  >
                    {showKey ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  </button>
                </code>
              </div>
              <button
                onClick={handleCopyApiKey}
                className="p-2 bg-[#B784A7]/10 text-[#B784A7] rounded-lg hover:bg-[#B784A7]/20 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleGenerateKey}
                className="p-2 bg-neutral-800 text-gray-300 rounded-lg hover:bg-neutral-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-4 sticky top-20">
              <h3 className="text-white font-semibold mb-4 px-2">Endpoints</h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setActiveEndpoint(endpoint.id);
                      setResponse(null);
                      setStatusCode(null);
                      setRequestBody(`{
  "${endpoint.id === "analyze" ? "file_url" : endpoint.id === "batch" ? "files" : "page"}": "${endpoint.id === "analyze" ? "https://example.com/audio.mp3" : endpoint.id === "batch" ? "[\"audio1.mp3\", \"audio2.mp3\"]" : "1"}",
  "threshold": 70
}`);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                      activeEndpoint === endpoint.id
                        ? "bg-[#B784A7]/10 text-[#B784A7] border border-[#B784A7]/20"
                        : "text-gray-400 hover:bg-neutral-800 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      endpoint.method === "POST" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-xs">{endpoint.path}</span>
                  </button>
                ))}
              </div>

              {/* Rate Limits */}
              <div className="mt-6 px-2">
                <h4 className="text-white font-semibold text-sm mb-2">Rate Limits</h4>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Free</span>
                    <span className="text-white">5 req/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro</span>
                    <span className="text-[#B784A7]">100 req/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise</span>
                    <span className="text-green-500">Unlimited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Endpoint Details */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded text-xs font-bold ${
                  activeEndpointData.method === "POST" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                }`}>
                  {activeEndpointData.method}
                </span>
                <code className="text-white text-lg font-mono">{activeEndpointData.path}</code>
                <span className="text-gray-400 text-sm ml-auto">{activeEndpointData.title}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{activeEndpointData.desc}</p>

              {/* Request Parameters */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Request Parameters</h4>
                <div className="bg-black rounded-xl p-4">
                  {Object.keys(activeEndpointData.request).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(activeEndpointData.request).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <code className="text-[#B784A7]">{key}</code>
                          <span className="text-gray-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No parameters required</p>
                  )}
                </div>
              </div>

              {/* Response Example */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Response Example</h4>
                <div className="bg-black rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">{activeEndpointData.response}</pre>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Code Examples</h3>
                <div className="flex items-center gap-2">
                  {["python", "javascript", "curl"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        activeLanguage === lang
                          ? "bg-[#B784A7] text-black"
                          : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
                      }`}
                    >
                      {lang === "python" ? "Python" : lang === "javascript" ? "JavaScript" : "cURL"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-black rounded-xl p-4 overflow-x-auto relative">
                <button
                  onClick={handleCopyCode}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#B784A7] transition"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-[#B784A7] text-sm font-mono">
                  <code>{codeExamples[activeLanguage]}</code>
                </pre>
              </div>
            </div>

            {/* Try It Console */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#B784A7]" />
                  Try It Yourself
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResponseHistory(!showResponseHistory)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-gray-300 rounded-lg text-xs font-medium hover:bg-neutral-700 transition"
                  >
                    <History className="w-3 h-3" />
                    History ({responseHistory.length})
                  </button>
                  <button
                    onClick={handleTryIt}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-lg text-sm hover:shadow-[0_0_20px_rgba(183,132,167,0.5)] transition"
                  >
                    <Send className="w-3 h-3" />
                    Send Request
                  </button>
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="mb-4">
                <button
                  onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#B784A7] transition mb-3"
                >
                  <Settings2 className="w-3 h-3" />
                  {showAdvancedParams ? "Hide" : "Show"} Request Parameters
                  <ChevronDown className={`w-3 h-3 transition ${showAdvancedParams ? "rotate-180" : ""}`} />
                </button>

                {showAdvancedParams && (
                  <div className="bg-black rounded-xl p-4 mb-4">
                    <div className="space-y-2">
                      {(Object.keys(paramsEnabled) as Array<keyof typeof paramsEnabled>).map((param) => (
                        <div key={param} className="flex items-center justify-between">
                          <code className="text-[#B784A7] text-sm">{param}</code>
                          <button
                            onClick={() => {
                              toggleParam(param);
                              setTimeout(handleParamsChange, 0);
                            }}
                            className="text-gray-400 hover:text-[#B784A7] transition"
                          >
                            {paramsEnabled[param] ? <ToggleRight className="w-5 h-5 text-[#B784A7]" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Request Body */}
              <div className="bg-black rounded-xl p-4 mb-4">
                <h4 className="text-gray-400 text-xs mb-2">Request Body (JSON)</h4>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-transparent text-green-400 text-sm font-mono resize-none focus:outline-none"
                  rows={5}
                />
              </div>

              {/* Response */}
              {isLoading && (
                <div className="bg-black rounded-xl p-4 mb-4 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[#B784A7] animate-spin" />
                  <span className="text-gray-400 ml-2 text-sm">Sending request...</span>
                </div>
              )}

              {response && !isLoading && (
                <>
                  <div className="bg-black rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-gray-400 text-xs">Response</h4>
                      <span className={`text-xs flex items-center gap-1 ${
                        statusCode === 200 ? "text-green-500" : "text-red-500"
                      }`}>
                        {statusCode === 200 ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {statusCode} {statusCode === 200 ? "OK" : "Error"}
                      </span>
                    </div>
                    <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>

                  {/* Response History */}
                  {showResponseHistory && responseHistory.length > 0 && (
                    <div className="bg-black rounded-xl p-4">
                      <h4 className="text-gray-400 text-xs mb-2">Recent Requests</h4>
                      <div className="space-y-2">
                        {responseHistory.slice(-5).reverse().map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-mono">{item.endpoint}</span>
                            <span className="text-gray-500">{item.timestamp}</span>
                            <span className={`font-bold ${item.status === 200 ? "text-green-500" : "text-red-500"}`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}