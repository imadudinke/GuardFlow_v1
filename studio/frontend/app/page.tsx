"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, ShieldCheck, Fingerprint, Waypoints } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8 flex items-center justify-center">
      {/* Outer Floating Device Frame */}
      <div className="relative w-full max-w-[1440px] overflow-hidden rounded-[48px] border-[12px] border-white/60 bg-white shadow-2xl md:min-h-[90vh] md:rounded-[60px] md:border-[16px]">
        
        {/* 3-Column Background Grid Structure */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 divide-x divide-black/5">
          <div className="bg-[#E5E7EB]"></div>
          <div className="bg-[#F9FAFB]"></div>
          <div className="bg-[#D1D5DB]"></div>
        </div>

        {/* Halftone Dot Pattern — Layer 1: tight small dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 0.8px, transparent 0.8px)",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Halftone Dot Pattern — Layer 2: medium offset dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.2px, transparent 1.2px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "9px 9px",
          }}
        />

        {/* Halftone Dot Pattern — Layer 3: large sparse accent dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 2px, transparent 2px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "16px 0",
          }}
        />

        {/* Subtle film grain texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Radial vignette for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,0.06) 100%)",
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full flex-col pt-6 md:pt-10">
          
          {/* Navbar */}
          <nav className="mx-6 md:mx-12 flex items-center justify-between">
            <Link href="/" className="font-serif text-3xl font-black text-black tracking-tight flex-1">
              GUARDFLOW<sup className="text-sm font-bold">&reg;</sup>
            </Link>
            <div className="hidden flex-none gap-10 md:flex">
              <Link href="#product" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-black">Insights</Link>
              <Link href="#workflow" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-black">Solutions</Link>
              <Link href="#pricing" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-black">Pricing</Link>
            </div>
            <div className="flex flex-1 items-center justify-end gap-6">
              <Link href={isAuthenticated ? "/dashboard" : "/login"} className="text-sm font-semibold text-gray-800 hover:text-black hidden sm:block">
                {isAuthenticated ? "Dashboard" : "Login"}
              </Link>
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-gray-900 transition-colors">
                {isAuthenticated ? "Open Studio" : "Try Now"}
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="mx-auto mt-24 max-w-5xl px-6 text-center md:mt-36">
            <h1 className="font-serif text-6xl font-black leading-[1.05] tracking-tight text-black md:text-[6.5rem]">
              Bold Options<br />That Start With<br />Security.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-gray-700 md:text-xl leading-relaxed">
              Helping modern engineering brands craft digital experiences that inspire action, enforce compliance, and drive reliable growth.
            </p>
            <div className="mt-12 mb-20 flex justify-center gap-4">
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="flex items-center gap-3 rounded-full bg-black px-10 py-5 text-base font-bold text-white shadow-xl hover:bg-gray-900 transition-transform hover:-translate-y-0.5">
                {isAuthenticated ? "Enter Studio \u2197" : "Get In Touch \u2197"}
              </Link>
            </div>
          </section>

          {/* Trusted By Banner */}
          <div className="mt-auto border-t border-black/10 bg-white/40 backdrop-blur-md pt-8 pb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 mb-8">Trusted by teams of every scale</p>
            <div className="mx-auto flex max-w-4xl flex-wrap justify-between gap-8 px-6 font-serif text-2xl font-black tracking-tighter text-black/40 mix-blend-multiply items-center md:text-3xl">
              <span>MERCURY</span>
              <span>RAMP</span>
              <span>HEX</span>
              <span>VERCEL</span>
              <span>DESCRIPT</span>
            </div>
          </div>

          {/* Product Features Section inside brutalist cards */}
          <div className="grid md:grid-cols-3 border-t border-black/10 divide-y md:divide-y-0 md:divide-x divide-black/10 bg-white/60 backdrop-blur-sm">
             <div className="p-10 md:p-14 hover:bg-white transition-colors">
               <ShieldCheck className="h-10 w-10 text-black mb-6" strokeWidth={1.5} />
               <h3 className="font-serif text-2xl font-black tracking-tight text-black">Private Vaults</h3>
               <p className="mt-4 text-gray-700 font-medium leading-relaxed">Dedicated keys and controls for every single environment.</p>
             </div>
             <div className="p-10 md:p-14 hover:bg-white transition-colors">
               <Fingerprint className="h-10 w-10 text-black mb-6" strokeWidth={1.5} />
               <h3 className="font-serif text-2xl font-black tracking-tight text-black">Shared Memory</h3>
               <p className="mt-4 text-gray-700 font-medium leading-relaxed">A fingerprint caught once becomes known absolutely everywhere.</p>
             </div>
             <div className="p-10 md:p-14 hover:bg-white transition-colors">
               <Waypoints className="h-10 w-10 text-black mb-6" strokeWidth={1.5} />
               <h3 className="font-serif text-2xl font-black tracking-tight text-black">Live Control</h3>
               <p className="mt-4 text-gray-700 font-medium leading-relaxed">Switch modes automatically without deploying new code.</p>
             </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
