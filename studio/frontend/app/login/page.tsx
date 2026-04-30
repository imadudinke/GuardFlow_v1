"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl } from "@/lib/api/url";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/v1/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }

      await checkAuth();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="border-4 border-black bg-yellow-300 px-8 py-8 text-center text-black shadow-[12px_12px_0_#000]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-4 border-black"></div>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.28em]">Loading access gate...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 bg-white">
      {/* Main artistic noise background - same as homepage */}
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
      
      {/* Subtle colorful accents - positioned for login page */}
      <div className="absolute top-1/6 left-1/8 w-32 h-32 opacity-8" style={{
        background: 'linear-gradient(135deg, #ff6b6b20, #4ecdc420)',
        clipPath: 'circle(50% at 50% 50%)',
        filter: 'blur(3px)'
      }}></div>
      
      <div className="absolute bottom-1/4 right-1/6 w-40 h-40 opacity-6" style={{
        background: 'linear-gradient(45deg, #a8edea15, #fed6e315)',
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        filter: 'blur(4px)'
      }}></div>

      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Home button */}
        <div className="absolute -top-16 left-0 z-20">
          <Link
            href="/"
            className="retro-button bg-white text-black border-black px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-black retro-mono text-xs">Home</span>
          </Link>
        </div>
        <div className="border-4 border-black bg-[#14071f] p-8 text-white shadow-[14px_14px_0_#f472b6]">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">
            Retro Threat Studio
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase tracking-[0.08em]">Welcome Back</h1>
          <p className="mt-4 max-w-md font-mono text-sm text-pink-100/85">
            Re-enter the Studio dashboard and monitor your FastAPI applications with real-time threat intelligence.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border-4 border-black bg-yellow-300 p-4 text-black shadow-[8px_8px_0_#000]">
              <div className="text-[10px] font-black uppercase tracking-[0.28em]">Mode</div>
              <div className="mt-1 text-2xl font-black uppercase">Live</div>
            </div>
            <div className="border-4 border-black bg-cyan-300 p-4 text-black shadow-[8px_8px_0_#000]">
              <div className="text-[10px] font-black uppercase tracking-[0.28em]">Style</div>
              <div className="mt-1 text-2xl font-black uppercase">Odd</div>
            </div>
          </div>
        </div>

        <div className="border-4 border-black bg-[#fff8dc] p-8 text-black shadow-[14px_14px_0_#000]">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-[0.08em]">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              Sign in to your GuardFlow Studio account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border-4 border-black bg-pink-300 px-4 py-3 text-sm font-semibold text-black shadow-[6px_6px_0_#000]">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-zinc-800"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-4 border-black bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition focus:bg-yellow-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-zinc-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-4 border-black bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition focus:bg-yellow-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border-4 border-black bg-cyan-300 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[8px_8px_0_#000] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-black uppercase tracking-[0.12em] text-black underline-offset-4 transition hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
