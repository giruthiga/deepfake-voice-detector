"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Shield, Zap, Users, Globe, Target, Eye, Heart, Cpu, Database, Lock, CheckCircle, ArrowRight, 
  Award, TrendingUp, Building2, Lightbulb, Sparkles, Rocket, Handshake, Scale, BrainCircuit,
  Play, ChevronDown, Star, Quote, Menu, X, MapPin, Briefcase, GraduationCap,
  MessageCircle, Share2, Link2
} from "lucide-react";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    founded: 0,
    audioAnalyzed: 0,
    users: 0,
    countries: 0,
  });
  
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      
      // Track active section
      const sections = ["hero", "mission", "stats", "technology", "team", "cta"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Animate stats when scrolled into view
  useEffect(() => {
    const statsSection = document.getElementById("stats");
    if (!statsSection) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start counting animation
          const duration = 2000;
          const startTime = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setAnimatedStats({
              founded: 2023, // Fixed
              audioAnalyzed: Math.floor(progress * 10), // 10M+
              users: Math.floor(progress * 50), // 50K+
              countries: Math.floor(progress * 40), // 40+
            });
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Team members
  const teamMembers = [
    {
      name: "Giruthiga",
      role: "Founder & CEO",
      bio: "Cybersecurity enthusiast focused on AI, deepfake detection, and digital forensics. Leading VoiceGuard's vision to protect digital identities.",
      initials: "G",
      color: "from-[#B784A7] to-cyan-400",
      socials: {
        twitter: "https://x.com/giruthiga",
        github: "https://github.com/giruthiga",
        linkedin: "https://linkedin.com/in/giruthiga",
      },
      location: "Bangalore, India",
      expertise: ["Cybersecurity", "AI Detection", "Digital Forensics"],
    },
    {
      name: "Priya",
      role: "Co-Founder & CTO",
      bio: "Tech innovator specializing in machine learning architecture and scalable audio analysis systems. Building the core AI engine behind VoiceGuard.",
      initials: "P",
      color: "from-blue-500 to-purple-500",
      socials: {
        twitter: "https://x.com/priya",
        github: "https://github.com/priya",
        linkedin: "https://linkedin.com/in/priya",
      },
      location: "Bangalore, India",
      expertise: ["Machine Learning", "Audio Forensics", "Architecture"],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Sub-Nav */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-lg border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 overflow-x-auto">
              {[
                { id: "hero", label: "Overview" },
                { id: "mission", label: "Mission" },
                { id: "stats", label: "Stats" },
                { id: "technology", label: "Technology" },
                { id: "team", label: "Team" },
                { id: "cta", label: "Join Us" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition ${
                    activeSection === item.id
                      ? "bg-[#B784A7] text-black"
                      : "text-gray-400 hover:text-[#B784A7] hover:bg-[#B784A7]/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="hidden md:block">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 text-[#B784A7] text-sm font-medium rounded-lg hover:bg-[#B784A7]/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#B784A7]/5 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B784A7]/10 border border-[#B784A7]/20 rounded-full mb-4">
              <Shield className="w-4 h-4 text-[#B784A7]" />
              <span className="text-[#B784A7] text-sm font-medium">About VoiceGuard</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Protecting Voices in the <span className="gradient-text">AI Era</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
              Founded in Bangalore, India, VoiceGuard is on a mission to combat the growing threat of AI-generated voice fraud. We build cutting-edge technology to help individuals and organizations verify the authenticity of audio content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("mission")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
              >
                <Rocket className="w-5 h-5" />
                Explore Our Journey
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[#B784A7] transition"
              >
                <Users className="w-5 h-5" />
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Drives <span className="gradient-text">Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-[#111111] border border-neutral-800 rounded-2xl p-8 hover:border-[#B784A7] transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,132,167,0.1)]">
              <div className="p-3 bg-[#B784A7]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Target className="w-8 h-8 text-[#B784A7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                To make deepfake detection accessible and reliable for everyone, from individual users to global enterprises. We believe trust in audio content is essential for a safe digital society.
              </p>
            </div>

            <div className="group bg-[#111111] border border-neutral-800 rounded-2xl p-8 hover:border-[#B784A7] transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,132,167,0.1)]">
              <div className="p-3 bg-[#B784A7]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Eye className="w-8 h-8 text-[#B784A7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A world where every voice can be trusted, and no one falls victim to audio manipulation. We envision a future where deepfake detection is as standard as antivirus software.
              </p>
            </div>

            <div className="group bg-[#111111] border border-neutral-800 rounded-2xl p-8 hover:border-[#B784A7] transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,132,167,0.1)]">
              <div className="p-3 bg-[#B784A7]/10 rounded-lg w-fit mb-4 group-hover:scale-110 transition">
                <Heart className="w-8 h-8 text-[#B784A7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Our Values</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Integrity, innovation, and user privacy. We never compromise on security or ethics. We are committed to building technology that serves humanity responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Our <span className="gradient-text">Impact</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition">
                  {animatedStats.founded || 2023}
                </div>
                <div className="text-gray-400 text-sm">Founded</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition">
                  {animatedStats.audioAnalyzed}M+
                </div>
                <div className="text-gray-400 text-sm">Audio Analyzed</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition">
                  {animatedStats.users}K+
                </div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition">
                  {animatedStats.countries}+
                </div>
                <div className="text-gray-400 text-sm">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Our <span className="gradient-text">Technology</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Powered by state-of-the-art machine learning and audio forensics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: "Deep Learning", desc: "Neural networks trained on millions of audio samples", color: "text-[#B784A7]" },
              { icon: Database, title: "Big Data", desc: "Massive datasets of real and synthetic voices", color: "text-blue-500" },
              { icon: Lock, title: "Security First", desc: "Enterprise-grade encryption and privacy protection", color: "text-green-500" },
              { icon: Zap, title: "Real-Time", desc: "Instant results with sub-second processing", color: "text-yellow-500" },
            ].map((tech) => (
              <div key={tech.title} className="group bg-[#111111] border border-neutral-800 rounded-xl p-6 text-center hover:border-[#B784A7] transition-all duration-300">
                <tech.icon className={`w-10 h-10 ${tech.color} mx-auto mb-4 group-hover:scale-110 transition`} />
                <h3 className="text-white font-semibold mb-2">{tech.title}</h3>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - With You and Priya */}
      <section id="team" className="py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">
            The visionary minds behind VoiceGuard
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="group bg-[#111111] border border-neutral-800 rounded-2xl p-8 text-center hover:border-[#B784A7] transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,132,167,0.1)]">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <span className="text-3xl font-bold text-black">{member.initials}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#B784A7] font-semibold mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.expertise.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-[#B784A7]/10 text-[#B784A7] text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>{member.location}</span>
                </div>
                <div className="flex justify-center gap-3">
                  <a href={member.socials.twitter} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-[#B784A7] hover:bg-[#B784A7]/10 transition">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a href={member.socials.github} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-[#B784A7] hover:bg-[#B784A7]/10 transition">
                    <Link2 className="w-4 h-4" />
                  </a>
                  <a href={member.socials.linkedin} className="p-2 bg-neutral-800 rounded-full text-gray-400 hover:text-[#B784A7] hover:bg-[#B784A7]/10 transition">
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-gradient-to-r from-[#B784A7]/10 to-cyan-400/10 border border-[#B784A7]/20 rounded-2xl p-12">
            <div className="p-4 bg-[#B784A7]/10 rounded-full w-fit mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#B784A7]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Start protecting yourself from deepfake voice fraud today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B784A7] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(183,132,167,0.5)] transition"
              >
                <CheckCircle className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[#B784A7] transition"
              >
                <Users className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-[#B784A7] rounded-full text-black shadow-[0_0_20px_rgba(183,132,167,0.5)] hover:shadow-[0_0_30px_rgba(183,132,167,0.7)] transition z-50"
        >
          <ChevronDown className="w-5 h-5 rotate-180" />
        </button>
      )}
    </div>
  );
}