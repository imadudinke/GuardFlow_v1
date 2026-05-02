"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl } from "@/lib/api/url";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/v1/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
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
          <p className="mt-4 text-sm font-black uppercase tracking-[0.28em]">
            Loading registration gate...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white p-4 text-black sm:p-6 lg:p-8">
      <div className="absolute inset-0 halftone-bg"></div>
      <div className="absolute inset-0 retro-grid"></div>

      <div className="relative z-10 mx-auto w-full max-w-5xl space-y-6">
        <div>
          <Link
            href="/"
            className="retro-button inline-flex items-center gap-2 bg-white px-4 py-2 text-black"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-black retro-mono">Home</span>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="retro-card-static bg-white p-6 sm:p-8">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.35em] text-white retro-mono">
                Operator Intake
              </p>
              <h2 className="text-4xl font-black uppercase tracking-[0.08em] retro-title sm:text-5xl">
                Create Account
              </h2>
              <p className="mt-4 max-w-md text-sm text-gray-700 retro-mono">
                Register a GuardFlow account to create projects and manage
                FastAPI protection.
              </p>
              <div className="mt-8 retro-card-static bg-gray-50 p-5">
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-gray-600 retro-mono">
                  Onboarding Illustration
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="retro-card-static bg-white p-3">
                    <div className="relative h-12 w-full border-2 border-black bg-white">
                      <div className="absolute left-2 top-2 h-2 w-2 bg-black"></div>
                      <div className="absolute left-6 top-2 right-2 h-1.5 bg-black"></div>
                      <div className="absolute left-2 top-6 h-2 w-2 border-2 border-black bg-white"></div>
                      <div className="absolute left-6 top-6 right-2 h-1.5 bg-black"></div>
                    </div>
                  </div>
                  <div className="retro-card-static bg-black p-3">
                    <div className="relative h-12 w-full">
                      <div className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-black"></div>
                      <div className="absolute left-1/2 bottom-1 h-6 w-8 -translate-x-1/2 border-2 border-white bg-black"></div>
                      <div className="absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 bg-white"></div>
                      <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 bg-white"></div>
                    </div>
                  </div>
                  <div className="retro-card-static bg-white p-3">
                    <div className="relative h-12 w-full border-2 border-black bg-gray-100">
                      <div className="absolute left-2 right-2 top-2 h-1.5 bg-black"></div>
                      <div className="absolute left-2 right-4 top-5 h-1.5 bg-black"></div>
                      <div className="absolute left-2 right-6 top-8 h-1.5 bg-black"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="retro-card-static bg-white p-6 text-black sm:p-8">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <h1 className="text-3xl font-black uppercase tracking-[0.08em]">
                  Join Studio
                </h1>
                <p className="mt-2 text-sm text-zinc-700 retro-mono">
                  Create your account and access GuardFlow dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="retro-card-static bg-red-100 px-4 py-3 text-sm font-semibold text-red-800 retro-mono">
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
                    className="w-full retro-card-static bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition focus:bg-gray-50"
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
                    className="w-full retro-card-static bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition focus:bg-gray-50"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-700 retro-mono">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-zinc-800"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full retro-card-static bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition focus:bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="retro-button w-full bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-green-900 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-700 retro-mono">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-black uppercase tracking-[0.12em] text-black underline-offset-4 transition hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
