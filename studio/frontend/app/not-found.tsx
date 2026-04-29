"use client";

import Link from "next/link";
import { Shield, Home, AlertTriangle, Search, ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 halftone-bg"></div>
      <div className="absolute inset-0 retro-grid"></div>
      
      {/* Colorful geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-400 retro-card-static transform rotate-12 opacity-20"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 retro-card-static transform -rotate-45 opacity-20"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-400 retro-card-static transform rotate-45 opacity-15"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-400 retro-card-static transform -rotate-12 opacity-20"></div>
      <div className="absolute top-1/3 left-1/2 w-20 h-20 bg-purple-400 retro-card-static transform rotate-90 opacity-25"></div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Header with logo */}
        <div className="mb-12 flex items-center gap-4">
          <div className="retro-card-static p-4 bg-black">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold retro-title text-black">GuardFlow</span>
        </div>

        {/* Main 404 content */}
        <div className="text-center max-w-2xl">
          {/* Large 404 with colorful styling */}
          <div className="mb-8">
            <div className="retro-card-static bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-8 mb-6">
              <h1 className="text-8xl font-black retro-title text-white drop-shadow-lg">
                404
              </h1>
            </div>
            
            {/* Error badge */}
            <div className="inline-block retro-card-static bg-red-100 text-red-800 px-4 py-2 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-black uppercase tracking-[0.2em] retro-mono">
                  Page Not Found
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="retro-card-static bg-white p-8 mb-8">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-black retro-title mb-4">
                Security Breach Detected
              </h2>
              <p className="text-lg retro-mono text-gray-700 mb-4">
                Just kidding! The page you're looking for has gone into stealth mode.
              </p>
              <p className="text-sm retro-mono text-gray-600">
                Our threat detection systems couldn't locate this URL in our secure perimeter. 
                It might have been moved, deleted, or you may have mistyped the address.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Link 
              href="/dashboard"
              className="retro-button bg-blue-100 text-blue-800 border-blue-800 p-4 text-center hover:bg-blue-200 block group"
            >
              <Home className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black retro-mono">Dashboard</div>
            </Link>
            
            <Link 
              href="/projects"
              className="retro-button bg-green-100 text-green-800 border-green-800 p-4 text-center hover:bg-green-200 block group"
            >
              <Shield className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black retro-mono">Projects</div>
            </Link>
            
            <Link 
              href="/threats"
              className="retro-button bg-orange-100 text-orange-800 border-orange-800 p-4 text-center hover:bg-orange-200 block group"
            >
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black retro-mono">Threats</div>
            </Link>
            
            <Link 
              href="/analytics"
              className="retro-button bg-purple-100 text-purple-800 border-purple-800 p-4 text-center hover:bg-purple-200 block group"
            >
              <Search className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black retro-mono">Analytics</div>
            </Link>
          </div>

          {/* Go back button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => window.history.back()}
              className="retro-button bg-gray-100 text-gray-800 border-gray-800 px-6 py-3 hover:bg-gray-200 flex items-center gap-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-black retro-mono">Go Back</span>
            </button>
            
            <Link 
              href="/"
              className="retro-button bg-black text-white border-black px-6 py-3 hover:bg-gray-800 flex items-center gap-3"
            >
              <Zap className="h-4 w-4" />
              <span className="font-black retro-mono">Home Base</span>
            </Link>
          </div>
        </div>

        {/* Fun security-themed message */}
        <div className="mt-12 retro-card-static bg-yellow-50 border-yellow-200 p-6 max-w-md text-center">
          <div className="absolute inset-0 halftone-subtle"></div>
          <div className="relative z-10">
            <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <p className="text-sm retro-mono text-yellow-800 font-bold mb-2">
              SECURITY TIP
            </p>
            <p className="text-xs retro-mono text-yellow-700">
              Always double-check URLs before clicking. This helps prevent phishing attacks and keeps your data secure!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs retro-mono text-gray-500">
            Error Code: GF-404 • GuardFlow Security Platform
          </p>
        </div>
      </div>
    </div>
  );
}