"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  X,
  Zap,
  Shield,
  BarChart3,
  Users,
  FileAudio,
  Download,
  Sparkles,
  ChevronDown,
  Infinity as InfinityIcon,
  CreditCard,
  Lock,
  Cloud,
  Gift,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Plans data
  const plans = [
    {
      id: "free",
      name: "Free",
      tagline: "For personal use",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: "5 scans per month", included: true },
        { text: "Basic analysis", included: true },
        { text: "Waveform visualization", included: true },
        { text: "Standard support", included: true },
        { text: "Batch scanning", included: false },
        { text: "API access", included: false },
        { text: "Advanced reports", included: false },
        { text: "Team collaboration", included: false },
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "For professionals",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        { text: "Unlimited scans", included: true },
        { text: "Advanced AI analysis", included: true },
        { text: "Full waveform + spectrogram", included: true },
        { text: "Priority support", included: true },
        { text: "Batch scanning (10 files)", included: true },
        { text: "API access (1,000 calls/month)", included: true },
        { text: "Advanced reports (PDF/CSV)", included: true },
        { text: "Team collaboration (3 seats)", included: false },
      ],
      cta: "Choose Pro",
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "For large organizations",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Unlimited team seats", included: true },
        { text: "Custom AI model training", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Unlimited API access", included: true },
        { text: "SLA & custom integrations", included: true },
        { text: "On-premise deployment", included: true },
        { text: "White-labeling options", included: true },
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "How accurate is the deepfake detection?",
      answer: "Our AI models achieve 99.2% accuracy on average, trained on millions of real and fake audio samples. We continuously update our models to stay ahead of new deepfake techniques.",
    },
    {
      question: "What audio formats are supported?",
      answer: "We support MP3, WAV, M4A, FLAC, OGG, and WMA formats. The maximum file size is 50MB per file for individual uploads, and 25MB per file for batch uploads.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your dashboard settings. Your plan will remain active until the end of the billing period, and you won't be charged again.",
    },
    {
      question: "Do you offer a free trial for Pro features?",
      answer: "Yes! We offer a 14-day free trial for the Pro plan. You get full access to all Pro features during this period, no credit card required.",
    },
    {
      question: "Is there an API available for developers?",
      answer: "Yes, we provide a comprehensive REST API with detailed documentation. Pro users get 1,000 API calls per month, while Enterprise users get unlimited access.",
    },
    {
      question: "How is my data handled?",
      answer: "Your audio files are encrypted at rest and in transit. We follow industry-standard security practices, and we never use your audio data to train our models without explicit consent.",
    },
  ];

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "enterprise") {
      window.location.href = "/contact";
    } else {
      window.location.href = "/register?plan=" + planId;
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#B784A7]" />
            <span className="text-[#B784A7] text-sm font-medium">Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-[#111111] border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#111111] border rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-[#B784A7] shadow-[0_0_30px_rgba(183,132,167,0.2)] scale-105 z-10"
                  : "border-neutral-800 hover:border-[#B784A7]/50"
              }`}
            >
              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400">/{billingCycle === "monthly" ? "month" : "year"}</span>
                </div>
                {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                  <p className="text-sm text-green-500 mt-1">
                    Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice} per year
                  </p>
                )}
                {plan.monthlyPrice === 0 && (
                  <p className="text-sm text-gray-500 mt-1">Free forever</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-[#B784A7]" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600" />
                    )}
                    <span className={feature.included ? "text-gray-300 text-sm" : "text-gray-500 text-sm line-through"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black hover:shadow-[0_0_30px_rgba(183,132,167,0.5)]"
                    : "bg-neutral-800 text-white hover:bg-[#B784A7]/20 hover:text-[#B784A7]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Compare <span className="gradient-text">Features</span>
          </h2>
          
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="py-4 pr-4 text-gray-400 font-medium">Feature</th>
                <th className="py-4 px-4 text-center text-white font-semibold">Free</th>
                <th className="py-4 px-4 text-center text-[#B784A7] font-semibold">Pro</th>
                <th className="py-4 px-4 text-center text-white font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Scans per month", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
                { feature: "File size limit", free: "25MB", pro: "50MB", enterprise: "100MB" },
                { feature: "Batch scanning", free: false, pro: "10 files", enterprise: "Unlimited" },
                { feature: "API access", free: false, pro: "1,000 calls/mo", enterprise: "Unlimited" },
                { feature: "Advanced reports (PDF)", free: false, pro: true, enterprise: true },
                { feature: "Custom model training", free: false, pro: false, enterprise: true },
                { feature: "Team seats", free: "1", pro: "3", enterprise: "Unlimited" },
                { feature: "White-labeling", free: false, pro: false, enterprise: true },
                { feature: "On-premise deployment", free: false, pro: false, enterprise: true },
                { feature: "SLA support", free: false, pro: "Email", enterprise: "24/7 Dedicated" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-neutral-800/50 last:border-0">
                  <td className="py-3 pr-4 text-gray-300 text-sm">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.free === true ? (
                      <Check className="w-4 h-4 text-green-500 inline" />
                    ) : row.free === false ? (
                      <X className="w-4 h-4 text-gray-600 inline" />
                    ) : (
                      <span className="text-gray-400 text-sm">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.pro === true ? (
                      <Check className="w-4 h-4 text-[#B784A7] inline" />
                    ) : row.pro === false ? (
                      <X className="w-4 h-4 text-gray-600 inline" />
                    ) : (
                      <span className="text-gray-300 text-sm">{row.pro}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.enterprise === true ? (
                      <Check className="w-4 h-4 text-[#B784A7] inline" />
                    ) : row.enterprise === false ? (
                      <X className="w-4 h-4 text-gray-600 inline" />
                    ) : (
                      <span className="text-gray-300 text-sm">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#B784A7]/10 to-cyan-400/10 border border-[#B784A7]/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of professionals who trust VoiceGuard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
            >
              <Gift className="w-5 h-5" />
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[#B784A7] transition"
            >
              <Cloud className="w-5 h-5" />
              Contact Sales
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}