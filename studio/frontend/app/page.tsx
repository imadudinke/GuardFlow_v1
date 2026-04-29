"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Zap,
  Target,
  Eye,
  Lock,
  Activity,
  Fingerprint,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  Globe,
  Database,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 halftone-bg"></div>
      <div className="absolute inset-0 retro-grid"></div>
      
      {/* Colorful geometric shapes - more vibrant and creative */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-red-400 to-pink-500 retro-card-static transform rotate-12 opacity-25"></div>
      <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 retro-card-static transform -rotate-45 opacity-30"></div>
      <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 retro-card-static transform rotate-45 opacity-20"></div>
      <div className="absolute bottom-32 right-1/3 w-36 h-36 bg-gradient-to-br from-green-400 to-emerald-500 retro-card-static transform -rotate-12 opacity-25"></div>
      <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-gradient-to-br from-purple-400 to-violet-500 retro-card-static transform rotate-90 opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-600 retro-card-static transform -rotate-30 opacity-25"></div>
      <div className="absolute bottom-1/4 left-1/6 w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-600 retro-card-static transform rotate-60 opacity-35"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="retro-card-static p-3 bg-black">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-black retro-title text-black">GuardFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="retro-button bg-white text-black border-black px-6 py-3 hover:bg-gray-50 hidden sm:block"
              >
                <span className="font-black retro-mono text-sm">
                  {isAuthenticated ? "Dashboard" : "Login"}
                </span>
              </Link>
              <Link
                href={isAuthenticated ? "/dashboard" : "/register"}
                className="retro-button bg-black text-white border-black px-6 py-3 hover:bg-gray-800"
              >
                <span className="font-black retro-mono text-sm">
                  {isAuthenticated ? "Enter Studio" : "Get Started"}
                </span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="px-6 md:px-8 py-12 md:py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Main headline with colorful styling */}
            <div className="mb-8">
              <div className="retro-card-static bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 mb-6 inline-block">
                <h1 className="text-5xl md:text-7xl font-black retro-title text-white drop-shadow-lg">
                  ULTIMATE
                </h1>
              </div>
              <h2 className="text-4xl md:text-6xl font-black retro-title text-black mb-4">
                Security Platform
              </h2>
              <div className="retro-card-static bg-yellow-100 text-yellow-800 px-6 py-3 inline-block">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-lg font-black uppercase tracking-[0.2em] retro-mono">
                    Real-Time Protection
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="retro-card-static bg-white p-8 mb-12 max-w-4xl mx-auto">
              <div className="absolute inset-0 halftone-accent"></div>
              <div className="relative z-10">
                <p className="text-xl md:text-2xl retro-mono text-gray-700 mb-4">
                  Advanced threat detection with DNA fingerprinting technology.
                </p>
                <p className="text-lg retro-mono text-gray-600">
                  Protect your applications with intelligent rate limiting, real-time monitoring, 
                  and automated threat response. Built for modern security teams.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href={isAuthenticated ? "/dashboard" : "/register"}
                className="retro-button bg-blue-100 text-blue-800 border-blue-800 px-8 py-4 hover:bg-blue-200 flex items-center gap-3 group"
              >
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-black retro-mono">Start Protecting</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link 
                href="/sdk-guide"
                className="retro-button bg-green-100 text-green-800 border-green-800 px-8 py-4 hover:bg-green-200 flex items-center gap-3"
              >
                <Database className="h-5 w-5" />
                <span className="font-black retro-mono">View SDK</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black retro-title text-black mb-4">
                Security Arsenal
              </h3>
              <p className="text-lg retro-mono text-gray-600">
                Everything you need to defend your applications
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature cards with different colors */}
              <div className="retro-card bg-red-50 border-red-200 p-6 hover:bg-red-100 group">
                <Target className="h-10 w-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-red-800 mb-3">
                  Threat Detection
                </h4>
                <p className="retro-mono text-red-700 text-sm">
                  AI-powered threat identification with DNA fingerprinting for precise attack recognition.
                </p>
              </div>

              <div className="retro-card bg-blue-50 border-blue-200 p-6 hover:bg-blue-100 group">
                <Eye className="h-10 w-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-blue-800 mb-3">
                  Real-Time Monitoring
                </h4>
                <p className="retro-mono text-blue-700 text-sm">
                  Live dashboard with instant alerts and comprehensive threat analytics.
                </p>
              </div>

              <div className="retro-card bg-green-50 border-green-200 p-6 hover:bg-green-100 group">
                <Lock className="h-10 w-10 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-green-800 mb-3">
                  Rate Limiting
                </h4>
                <p className="retro-mono text-green-700 text-sm">
                  Intelligent rate limiting with adaptive thresholds and automatic scaling.
                </p>
              </div>

              <div className="retro-card bg-purple-50 border-purple-200 p-6 hover:bg-purple-100 group">
                <Activity className="h-10 w-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-purple-800 mb-3">
                  Live Analytics
                </h4>
                <p className="retro-mono text-purple-700 text-sm">
                  Deep insights into traffic patterns, attack vectors, and system performance.
                </p>
              </div>

              <div className="retro-card bg-orange-50 border-orange-200 p-6 hover:bg-orange-100 group">
                <Fingerprint className="h-10 w-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-orange-800 mb-3">
                  DNA Fingerprinting
                </h4>
                <p className="retro-mono text-orange-700 text-sm">
                  Unique threat signatures shared across all your projects for enhanced protection.
                </p>
              </div>

              <div className="retro-card bg-cyan-50 border-cyan-200 p-6 hover:bg-cyan-100 group">
                <Globe className="h-10 w-10 text-cyan-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black retro-title text-cyan-800 mb-3">
                  Global Blacklist
                </h4>
                <p className="retro-mono text-cyan-700 text-sm">
                  Shared threat intelligence across all projects with automatic updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="retro-card-static bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-black retro-title text-white mb-8">
                Security by the Numbers
              </h3>
              
              <div className="grid gap-8 md:grid-cols-4">
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-6">
                  <div className="text-4xl font-black retro-title text-white mb-2">99.9%</div>
                  <div className="text-sm retro-mono text-white/90">Uptime</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-6">
                  <div className="text-4xl font-black retro-title text-white mb-2">&lt;10ms</div>
                  <div className="text-sm retro-mono text-white/90">Response Time</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-6">
                  <div className="text-4xl font-black retro-title text-white mb-2">1M+</div>
                  <div className="text-sm retro-mono text-white/90">Threats Blocked</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-6">
                  <div className="text-4xl font-black retro-title text-white mb-2">24/7</div>
                  <div className="text-sm retro-mono text-white/90">Protection</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black retro-title text-black mb-4">
                Quick Access
              </h3>
              <p className="text-lg retro-mono text-gray-600">
                Jump straight into the action
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link 
                href="/dashboard"
                className="retro-button bg-blue-100 text-blue-800 border-blue-800 p-6 text-center hover:bg-blue-200 block group"
              >
                <BarChart3 className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black retro-mono mb-2">Dashboard</div>
                <div className="text-xs retro-mono opacity-75">Security Overview</div>
              </Link>
              
              <Link 
                href="/projects"
                className="retro-button bg-green-100 text-green-800 border-green-800 p-6 text-center hover:bg-green-200 block group"
              >
                <ShieldCheck className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black retro-mono mb-2">Projects</div>
                <div className="text-xs retro-mono opacity-75">Manage Protection</div>
              </Link>
              
              <Link 
                href="/threats"
                className="retro-button bg-red-100 text-red-800 border-red-800 p-6 text-center hover:bg-red-200 block group"
              >
                <Target className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black retro-mono mb-2">Threats</div>
                <div className="text-xs retro-mono opacity-75">Live Monitoring</div>
              </Link>
              
              <Link 
                href="/analytics"
                className="retro-button bg-purple-100 text-purple-800 border-purple-800 p-6 text-center hover:bg-purple-200 block group"
              >
                <Activity className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-black retro-mono mb-2">Analytics</div>
                <div className="text-xs retro-mono opacity-75">Deep Insights</div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="px-6 md:px-8 py-12 border-t-4 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <div className="retro-card-static bg-yellow-100 border-yellow-200 p-8 mb-8 inline-block">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h4 className="text-2xl font-black retro-title text-yellow-800 mb-3">
                  Ready to Secure Your Apps?
                </h4>
                <p className="retro-mono text-yellow-700 mb-6">
                  Join thousands of developers protecting their applications with GuardFlow
                </p>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="retro-button bg-black text-white border-black px-8 py-4 hover:bg-gray-800 inline-flex items-center gap-3"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-black retro-mono">
                    {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs retro-mono text-gray-500">
                © 2026 GuardFlow Security Platform • Built with ❤️ for developers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
