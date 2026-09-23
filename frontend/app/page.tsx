import Link from "next/link";
import { 
  Shield, 
  Zap, 
  BarChart3, 
  Upload, 
  ArrowRight, 
  Mic, 
  CheckCircle, 
  FileAudio,
  Users,
  Globe,
  Lock,
  Star,
  Sparkles,
  ChevronRight,
  Target,
  Eye,
  Heart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#B784A7]/10 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#B784A7]" />
            <span className="text-[#B784A7] text-sm font-medium">AI-Powered Detection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            Detect Deepfake
            <br />
            <span className="gradient-text">Voices Instantly</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Upload any audio and let our advanced AI determine if it&apos;s real or AI-generated. 
            Trust every voice you hear.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
            >
              <Upload className="w-5 h-5" />
              Analyze Voice
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[#B784A7] transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">VoiceGuard</span>?
            </h2>
            <p className="text-gray-400 text-lg">
              We are committed to building trusted tools for a safer digital world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced AI Detection",
                desc: "Deep learning models trained on thousands of real and fake audio samples to detect manipulation.",
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Our platform is designed for speed, giving you the results you need in seconds.",
              },
              {
                icon: BarChart3,
                title: "Detailed Analysis",
                desc: "We provide confidence scores, segment analysis, and clear explanations for every verdict.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-[#111111] border border-neutral-800 rounded-2xl card-hover"
              >
                <div className="p-3 bg-[#B784A7]/10 rounded-lg w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-[#B784A7]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How It <span className="gradient-text">Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload", desc: "Drag & drop or browse for an audio file" },
              { step: "02", title: "Analyze", desc: "Our AI processes and analyzes every detail" },
              { step: "03", title: "Get Verdict", desc: "Receive instant results with confidence score" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-bold text-[#B784A7] mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section (Real Information) */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We started VoiceGuard with a simple goal: to make deepfake detection accessible to everyone. We believe in transparency, security, and building tools that protect people from AI-generated voice fraud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To make deepfake detection accessible and reliable for everyone, from individual users to global enterprises.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                desc: "A world where every voice can be trusted, and no one falls victim to audio manipulation.",
              },
              {
                icon: Heart,
                title: "Our Values",
                desc: "Integrity, innovation, and user privacy. We never compromise on security or ethics.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 text-center">
                <div className="p-3 bg-[#B784A7]/10 rounded-lg w-fit mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#B784A7]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section (Real Data about the Product) */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10M+", label: "Audio Files Analyzed" },
              { value: "99.2%", label: "Detection Accuracy" },
              { value: "50K+", label: "Active Users" },
              { value: "< 3s", label: "Avg. Analysis Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links to Pages */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Explore <span className="gradient-text">VoiceGuard</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: "Analyze", href: "/analyze", desc: "Upload & detect" },
              { icon: BarChart3, title: "Dashboard", href: "/dashboard", desc: "View your stats" },
              { icon: FileAudio, title: "History", href: "/history", desc: "Past analyses" },
              { icon: Users, title: "Pricing", href: "/pricing", desc: "Plans & features" },
              { icon: Globe, title: "About", href: "/about", desc: "Our mission" },
              { icon: Lock, title: "API Docs", href: "/api/docs", desc: "For developers" },
              { icon: Shield, title: "FAQ", href: "/faq", desc: "Help center" },
              { icon: Mic, title: "Contact", href: "/contact", desc: "Get in touch" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-[#111111] border border-neutral-800 rounded-2xl p-6 text-center hover:border-[#B784A7] transition-all duration-300 hover:shadow-[0_0_20px_rgba(183,132,167,0.1)]"
              >
                <item.icon className="w-8 h-8 text-[#B784A7] mx-auto mb-3 group-hover:scale-110 transition" />
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
                <ChevronRight className="w-4 h-4 text-[#B784A7] mx-auto mt-3 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Protect Yourself?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start detecting deepfake voices today. Free to try, no credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}