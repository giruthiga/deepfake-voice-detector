"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Share2, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  // Fix hydration error
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[#B784A7]/10 rounded-lg">
                <Shield className="w-6 h-6 text-[#B784A7]" />
              </div>
              <span className="font-bold text-xl text-main">
                Voice<span className="text-[#B784A7]">Guard</span>
              </span>
            </Link>
            <p className="text-muted text-sm max-w-xs">
              Advanced AI-powered deepfake voice detection. Trust every voice you hear.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted hover:text-[#B784A7] transition">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted hover:text-[#B784A7] transition">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted hover:text-[#B784A7] transition">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-main font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/analyze" className="text-muted hover:text-[#B784A7] transition text-sm">
                  Analyze Voice
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-muted hover:text-[#B784A7] transition text-sm">
                  History
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted hover:text-[#B784A7] transition text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/api/docs" className="text-muted hover:text-[#B784A7] transition text-sm">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-main font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted hover:text-[#B784A7] transition text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted hover:text-[#B784A7] transition text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-[#B784A7] transition text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-[#B784A7] transition text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] mt-12 pt-8 text-center">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} VoiceGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}