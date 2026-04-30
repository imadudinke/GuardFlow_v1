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
      {/* Main artistic noise background - enhanced for full screen */}
      <div className="absolute inset-0 opacity-[0.18]" style={{
        background: `
          radial-gradient(ellipse 1200px 800px at 15% 5%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.2) 50%, transparent 80%),
          radial-gradient(ellipse 800px 600px at 85% 95%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.1) 60%, transparent 85%),
          radial-gradient(ellipse 600px 400px at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, transparent 70%),
          radial-gradient(ellipse 400px 300px at 25% 75%, rgba(0,0,0,0.3) 0%, transparent 60%)
        `,
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='organicNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23organicNoise)' opacity='0.9'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fineGrain'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.4' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fineGrain)' opacity='0.7'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='microGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23microGrain)' opacity='0.5'/%3E%3C/svg%3E")
        `,
        backgroundSize: '100% 100%, 180px 180px, 90px 90px, 45px 45px',
        backgroundPosition: '0 0, 0 0, 60px 60px, 30px 30px'
      }}></div>
      
      {/* Enhanced halftone texture layer */}
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: `
          radial-gradient(circle 1.5px at 1.5px 1.5px, rgba(0,0,0,0.9) 0%, transparent 50%),
          radial-gradient(circle 1px at 1px 1px, rgba(0,0,0,0.7) 0%, transparent 50%),
          radial-gradient(circle 0.8px at 0.8px 0.8px, rgba(0,0,0,0.5) 0%, transparent 50%),
          radial-gradient(circle 1.2px at 1.2px 1.2px, rgba(0,0,0,0.6) 0%, transparent 50%)
        `,
        backgroundSize: '6px 6px, 10px 10px, 14px 14px, 18px 18px',
        backgroundPosition: '0 0, 3px 3px, 7px 7px, 9px 9px'
      }}></div>
      
      {/* Flowing organic shapes for depth */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        background: `
          radial-gradient(ellipse 300px 200px at 70% 20%, rgba(0,0,0,0.4) 0%, transparent 70%),
          radial-gradient(ellipse 250px 150px at 30% 80%, rgba(0,0,0,0.3) 0%, transparent 60%),
          radial-gradient(ellipse 200px 300px at 90% 60%, rgba(0,0,0,0.2) 0%, transparent 50%)
        `
      }}></div>
      
      {/* Subtle colorful accents - very minimal */}
      <div className="absolute top-1/4 left-1/6 w-40 h-40 opacity-6" style={{
        background: 'linear-gradient(135deg, #ff6b6b20, #4ecdc420)',
        clipPath: 'circle(50% at 50% 50%)',
        filter: 'blur(4px)'
      }}></div>
      
      <div className="absolute bottom-1/3 right-1/5 w-48 h-48 opacity-5" style={{
        background: 'linear-gradient(45deg, #a8edea15, #fed6e315)',
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        filter: 'blur(5px)'
      }}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8 lg:p-12">
          <nav className="flex items-center justify-between max-w-8xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="retro-card-static p-3 bg-black">
                {/* Custom shield visual */}
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-white" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
                  <div className="absolute inset-1 bg-black" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
              <span className="text-3xl lg:text-4xl font-black retro-title text-black">GuardFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="retro-button bg-white text-black border-black px-6 py-3 hover:bg-gray-50 hidden sm:block"
              >
                <span className="font-black retro-mono text-sm">
                  Documentation
                </span>
              </Link>
              <Link
                href="/login"
                className="retro-button bg-white text-black border-black px-6 py-3 hover:bg-gray-50 hidden sm:block"
              >
                <span className="font-black retro-mono text-sm">
                  Login
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

        {/* Hero Section - Full screen optimized */}
        <section className="px-6 md:px-8 lg:px-12 py-16 md:py-24 lg:py-32">
          <div className="max-w-8xl mx-auto text-center">
            {/* Main headline with colorful styling */}
            <div className="mb-12 lg:mb-16">
              <div className="retro-card-static bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 lg:p-12 mb-8 inline-block">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black retro-title text-white drop-shadow-lg">
                  ULTIMATE
                </h1>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black retro-title text-black mb-6">
                Python SDK
              </h2>
              <div className="retro-card-static bg-yellow-100 text-yellow-800 px-8 py-4 inline-block">
                <div className="flex items-center gap-3">
                  {/* Custom sparkles visual */}
                  <div className="w-6 h-6 relative">
                    <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-yellow-800 transform -translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-yellow-800 transform -translate-x-1/2"></div>
                    <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-yellow-800 transform -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-yellow-800 transform -translate-y-1/2"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-800 transform rotate-45"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-800 transform rotate-45"></div>
                  </div>
                  <span className="text-xl lg:text-2xl font-black uppercase tracking-[0.2em] retro-mono">
                    FastAPI + Studio
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="retro-card-static bg-white p-8 lg:p-12 mb-16 max-w-5xl mx-auto">
              <div className="absolute inset-0 halftone-accent"></div>
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl lg:text-4xl retro-mono text-gray-700 mb-6">
                  Python SDK for FastAPI with DNA fingerprinting technology.
                </p>
                <p className="text-xl lg:text-2xl retro-mono text-gray-600">
                  Integrate advanced threat detection into your FastAPI applications with intelligent rate limiting, 
                  real-time monitoring, and automated threat response. Includes Studio dashboard for management.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link 
                href={isAuthenticated ? "/dashboard" : "/register"}
                className="retro-button bg-blue-100 text-blue-800 border-blue-800 px-10 py-5 hover:bg-blue-200 flex items-center gap-4 group text-lg"
              >
                {/* Custom integration visual */}
                <div className="w-6 h-6 relative group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0 border-2 border-blue-800"></div>
                  <div className="absolute inset-1 bg-blue-800"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-blue-100 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-blue-100 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <span className="font-black retro-mono">Start Integrating</span>
                {/* Custom arrow */}
                <div className="w-5 h-5 relative">
                  <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-blue-800 transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-800 transform -translate-y-1/2 rotate-45"></div>
                </div>
              </Link>
              
              <Link 
                href="/sdk-guide"
                className="retro-button bg-green-100 text-green-800 border-green-800 px-10 py-5 hover:bg-green-200 flex items-center gap-4 text-lg"
              >
                {/* Custom SDK visual */}
                <div className="w-6 h-6 relative">
                  <div className="absolute inset-0 border-2 border-green-800 transform rotate-45"></div>
                  <div className="absolute inset-1 bg-green-800 transform rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-green-100 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
                <span className="font-black retro-mono">View SDK</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 md:px-8 lg:px-12 py-16 md:py-24">
          <div className="max-w-8xl mx-auto">
            <div className="text-center mb-16 lg:mb-20">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black retro-title text-black mb-6">
                SDK Features
              </h3>
              <p className="text-xl lg:text-2xl retro-mono text-gray-600">
                Everything you need to secure your FastAPI applications
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <div className="retro-card bg-red-50 border-red-200 p-8 lg:p-10 hover:bg-red-100 group">
                {/* Custom FastAPI visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute inset-0 bg-red-600 transform rotate-45"></div>
                    <div className="absolute inset-2 bg-white transform rotate-45"></div>
                    <div className="absolute inset-4 bg-red-600 transform rotate-45"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-red-800 mb-4">
                  FastAPI Middleware
                </h4>
                <p className="retro-mono text-red-700 text-base lg:text-lg">
                  Easy integration with FastAPI applications using simple middleware decorators and configuration.
                </p>
              </div>

              <div className="retro-card bg-blue-50 border-blue-200 p-8 lg:p-10 hover:bg-blue-100 group">
                {/* Custom Studio visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute inset-0 border-4 border-blue-600"></div>
                    <div className="absolute inset-1 bg-blue-600"></div>
                    <div className="absolute top-2 left-2 right-2 h-1 bg-white"></div>
                    <div className="absolute top-4 left-2 right-2 h-1 bg-white"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 bg-white"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-white"></div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-blue-800 mb-4">
                  Studio Dashboard
                </h4>
                <p className="retro-mono text-blue-700 text-base lg:text-lg">
                  Web-based management interface for monitoring threats, managing projects, and configuring rules.
                </p>
              </div>

              <div className="retro-card bg-green-50 border-green-200 p-8 lg:p-10 hover:bg-green-100 group">
                {/* Custom Rate Limiting visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute inset-0 border-2 border-green-600 rounded-full"></div>
                    <div className="absolute inset-1 border-2 border-green-600 rounded-full"></div>
                    <div className="absolute inset-2 border-2 border-green-600 rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-green-600 transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-600 transform -translate-y-1/2"></div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-green-800 mb-4">
                  Rate Limiting
                </h4>
                <p className="retro-mono text-green-700 text-base lg:text-lg">
                  Built-in rate limiting with configurable thresholds, sliding windows, and automatic scaling.
                </p>
              </div>

              <div className="retro-card bg-purple-50 border-purple-200 p-8 lg:p-10 hover:bg-purple-100 group">
                {/* Custom Analytics visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute bottom-0 left-1 w-2 h-8 bg-purple-600"></div>
                    <div className="absolute bottom-0 left-4 w-2 h-12 bg-purple-600"></div>
                    <div className="absolute bottom-0 left-7 w-2 h-6 bg-purple-600"></div>
                    <div className="absolute bottom-0 left-10 w-2 h-10 bg-purple-600"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 border-2 border-purple-600 rounded-full"></div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-purple-800 mb-4">
                  Real-Time Analytics
                </h4>
                <p className="retro-mono text-purple-700 text-base lg:text-lg">
                  Live metrics and analytics streamed to Studio dashboard with detailed request insights.
                </p>
              </div>

              <div className="retro-card bg-orange-50 border-orange-200 p-8 lg:p-10 hover:bg-orange-100 group">
                {/* Custom DNA Fingerprinting visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute inset-0 grid grid-cols-4 gap-0.5">
                      <div className="bg-orange-600 h-full"></div>
                      <div className="bg-orange-600 h-2/3"></div>
                      <div className="bg-orange-600 h-full"></div>
                      <div className="bg-orange-600 h-1/2"></div>
                      <div className="bg-orange-600 h-1/3"></div>
                      <div className="bg-orange-600 h-full"></div>
                      <div className="bg-orange-600 h-3/4"></div>
                      <div className="bg-orange-600 h-1/4"></div>
                      <div className="bg-orange-600 h-full"></div>
                      <div className="bg-orange-600 h-1/2"></div>
                      <div className="bg-orange-600 h-2/3"></div>
                      <div className="bg-orange-600 h-full"></div>
                      <div className="bg-orange-600 h-1/4"></div>
                      <div className="bg-orange-600 h-3/4"></div>
                      <div className="bg-orange-600 h-1/3"></div>
                      <div className="bg-orange-600 h-full"></div>
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-orange-800 mb-4">
                  DNA Fingerprinting
                </h4>
                <p className="retro-mono text-orange-700 text-base lg:text-lg">
                  Unique threat signatures automatically shared across all your FastAPI projects.
                </p>
              </div>

              <div className="retro-card bg-cyan-50 border-cyan-200 p-8 lg:p-10 hover:bg-cyan-100 group">
                {/* Custom Python Package visual element */}
                <div className="mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 relative">
                    <div className="absolute inset-0 border-4 border-cyan-600 transform rotate-12"></div>
                    <div className="absolute inset-1 bg-cyan-600 transform rotate-12"></div>
                    <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-12"></div>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-white transform rotate-12"></div>
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-black retro-title text-cyan-800 mb-4">
                  Python Package
                </h4>
                <p className="retro-mono text-cyan-700 text-base lg:text-lg">
                  Install via pip and integrate with just a few lines of code. Full Python 3.8+ support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 md:px-8 lg:px-12 py-16 md:py-24">
          <div className="max-w-8xl mx-auto">
            <div className="retro-card-static bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-12 lg:p-20 text-center">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black retro-title text-white mb-12 lg:mb-16">
                Security by the Numbers
              </h3>
              
              <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-4">
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-8 lg:p-10">
                  <div className="text-5xl lg:text-6xl font-black retro-title text-white mb-4">99.9%</div>
                  <div className="text-lg retro-mono text-white/90">Uptime</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-8 lg:p-10">
                  <div className="text-5xl lg:text-6xl font-black retro-title text-white mb-4">&lt;10ms</div>
                  <div className="text-lg retro-mono text-white/90">Response Time</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-8 lg:p-10">
                  <div className="text-5xl lg:text-6xl font-black retro-title text-white mb-4">1M+</div>
                  <div className="text-lg retro-mono text-white/90">Threats Blocked</div>
                </div>
                
                <div className="retro-card-static bg-white/20 backdrop-blur-sm p-8 lg:p-10">
                  <div className="text-5xl lg:text-6xl font-black retro-title text-white mb-4">24/7</div>
                  <div className="text-lg retro-mono text-white/90">Protection</div>
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
                {/* Custom dashboard visual */}
                <div className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform relative">
                  <div className="absolute inset-0 border-2 border-blue-800"></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-blue-800"></div>
                  <div className="absolute top-3 left-1 w-2 h-2 bg-blue-800"></div>
                  <div className="absolute top-3 right-1 w-1 h-1 bg-blue-800"></div>
                  <div className="absolute bottom-1 left-1 right-1 h-2 bg-blue-800"></div>
                </div>
                <div className="text-lg font-black retro-mono mb-2">Dashboard</div>
                <div className="text-xs retro-mono opacity-75">Security Overview</div>
              </Link>
              
              <Link 
                href="/projects"
                className="retro-button bg-green-100 text-green-800 border-green-800 p-6 text-center hover:bg-green-200 block group"
              >
                {/* Custom projects visual */}
                <div className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform relative">
                  <div className="absolute inset-0 border-2 border-green-800 rounded-full"></div>
                  <div className="absolute inset-1 bg-green-800 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-green-100 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-green-100 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="text-lg font-black retro-mono mb-2">Projects</div>
                <div className="text-xs retro-mono opacity-75">Manage Protection</div>
              </Link>
              
              <Link 
                href="/threats"
                className="retro-button bg-red-100 text-red-800 border-red-800 p-6 text-center hover:bg-red-200 block group"
              >
                {/* Custom threats visual */}
                <div className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform relative">
                  <div className="absolute inset-0 bg-red-800 transform rotate-45"></div>
                  <div className="absolute inset-1 bg-red-100 transform rotate-45"></div>
                  <div className="absolute inset-2 bg-red-800 transform rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-100 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
                <div className="text-lg font-black retro-mono mb-2">Threats</div>
                <div className="text-xs retro-mono opacity-75">Live Monitoring</div>
              </Link>
              
              <Link 
                href="/analytics"
                className="retro-button bg-purple-100 text-purple-800 border-purple-800 p-6 text-center hover:bg-purple-200 block group"
              >
                {/* Custom analytics visual */}
                <div className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform relative">
                  <div className="absolute bottom-0 left-1 w-1 h-6 bg-purple-800"></div>
                  <div className="absolute bottom-0 left-3 w-1 h-8 bg-purple-800"></div>
                  <div className="absolute bottom-0 left-5 w-1 h-4 bg-purple-800"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-2 border-purple-800 rounded-full"></div>
                </div>
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
                {/* Custom lightning visual */}
                <div className="w-12 h-12 text-yellow-600 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-yellow-600 transform rotate-12" style={{clipPath: 'polygon(30% 0%, 60% 0%, 40% 50%, 70% 50%, 40% 100%, 10% 100%, 30% 50%, 0% 50%)'}}></div>
                </div>
                <h4 className="text-2xl font-black retro-title text-yellow-800 mb-3">
                  Ready to Secure Your Apps?
                </h4>
                <p className="retro-mono text-yellow-700 mb-6">
                  Join thousands of Python developers securing their FastAPI applications with GuardFlow SDK
                </p>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="retro-button bg-black text-white border-black px-8 py-4 hover:bg-gray-800 inline-flex items-center gap-3"
                >
                  {/* Custom shield visual */}
                  <div className="w-5 h-5 relative">
                    <div className="absolute inset-0 bg-white" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
                    <div className="absolute inset-1 bg-black" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
                  </div>
                  <span className="font-black retro-mono">
                    {isAuthenticated ? "Go to Dashboard" : "Install SDK"}
                  </span>
                  {/* Custom arrow */}
                  <div className="w-4 h-4 relative">
                    <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-1.5 h-1.5 border-r-2 border-t-2 border-white transform -translate-y-1/2 rotate-45"></div>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs retro-mono text-gray-500">
                © 2026 GuardFlow Python SDK • Built with ❤️ for FastAPI developers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
