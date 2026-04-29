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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-10 top-10 h-36 w-36 rounded-full border-[6px] border-black bg-pink-400/80" />
      <div className="pointer-events-none absolute right-[-2rem] top-24 h-44 w-44 rotate-12 border-[6px] border-black bg-cyan-300/70" />
      <div className="pointer-events-none absolute bottom-10 left-16 h-20 w-56 -skew-x-12 border-[5px] border-black bg-yellow-300/80" />

      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-4 border-black bg-[#14071f] p-8 text-white shadow-[14px_14px_0_#f472b6]">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">
            Retro Threat Studio
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase tracking-[0.08em]">Welcome Back</h1>
          <p className="mt-4 max-w-md font-mono text-sm text-pink-100/85">
            Re-enter the control room and monitor weird traffic in a loud, halftone-fed dashboard.
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
              Sign in to your GuardFlow account
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
