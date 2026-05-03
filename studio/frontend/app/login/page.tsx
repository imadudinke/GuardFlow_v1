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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const oauthError = new URLSearchParams(window.location.search).get("error");
    if (!oauthError) {
      return;
    }

    const oauthErrors: Record<string, string> = {
      google_auth_failed: "Google sign in failed. Please try again.",
      invalid_oauth_state: "Google sign in session expired. Please try again.",
      email_not_verified: "Google account email is not verified.",
      inactive_user: "Account is inactive.",
    };
    setError(oauthErrors[oauthError] ?? "Google sign in failed.");
  }, []);

  const handleGoogleSignIn = () => {
    window.location.href = getApiUrl("/api/v1/auth/google/login?next=/dashboard");
  };

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
          <p className="mt-4 text-sm font-black uppercase tracking-[0.28em]">
            Loading access gate...
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
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 retro-card-static bg-white p-4 rotate-12 hidden xl:block">
        <div className="h-16 w-16 border-4 border-black bg-white relative">
          <div className="absolute inset-2 border-2 border-black"></div>
        </div>
      </div>
      <div className="absolute bottom-32 right-20 retro-card-static bg-black p-3 -rotate-6 hidden xl:block">
        <div className="h-12 w-12 rounded-full border-4 border-white"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="retro-button inline-flex items-center gap-2 bg-white px-3 py-2 sm:px-4 text-black hover:bg-gray-100"
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
                strokeWidth={3}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-xs font-black retro-mono">BACK</span>
          </Link>
        </div>

        {/* Unconventional asymmetric layout */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Title section */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="retro-card-static bg-white p-6 sm:p-8 -rotate-1">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <div className="inline-block retro-card-static bg-black px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 rotate-2">
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] text-white retro-mono">
                    ACCESS GATE
                  </p>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight retro-title leading-none">
                  Welcome<br/>Back!
                </h1>
              </div>
            </div>

            <div className="retro-card-static bg-white p-5 sm:p-6 rotate-1">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <p className="text-xs sm:text-sm text-gray-700 retro-mono leading-relaxed">
                  Sign in to continue monitoring your projects, threats, and
                  analytics in Studio. Your security command center awaits.
                </p>
              </div>
            </div>

            {/* Decorative illustration */}
            <div className="retro-card-static bg-white p-5 sm:p-6 -rotate-2 hidden lg:block">
              <div className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-black retro-mono">
                SECURE ACCESS
              </div>
              <div className="flex items-center justify-around gap-3">
                <div className="retro-card-static bg-white p-3 sm:p-4 rotate-6">
                  <div className="h-12 sm:h-16 w-10 sm:w-12 border-3 border-black bg-white relative">
                    <div className="absolute inset-x-1 top-2 h-1.5 sm:h-2 bg-black"></div>
                    <div className="absolute inset-x-2 top-6 sm:top-7 h-1 bg-black"></div>
                    <div className="absolute inset-x-2 top-9 sm:top-10 h-1 bg-black"></div>
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl font-black">→</div>
                <div className="retro-card-static bg-black p-3 sm:p-4 -rotate-3">
                  <div className="relative h-12 sm:h-16 w-12 sm:w-16">
                    <div className="absolute left-1/2 top-2 h-5 sm:h-6 w-5 sm:w-6 -translate-x-1/2 rounded-full border-3 border-white bg-black"></div>
                    <div className="absolute bottom-2 left-1/2 h-6 sm:h-7 w-8 sm:w-10 -translate-x-1/2 border-3 border-white bg-black"></div>
                    <div className="absolute left-1/2 top-1/2 h-1 sm:h-1.5 w-8 sm:w-10 -translate-x-1/2 bg-white"></div>
                    <div className="absolute left-1/2 top-1/2 h-8 sm:h-10 w-1 sm:w-1.5 -translate-x-1/2 -translate-y-1/2 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Google Sign In */}
            <div className="retro-card-static bg-white p-5 sm:p-6 rotate-1">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <div className="mb-3 sm:mb-4 text-center">
                  <span className="inline-block retro-card-static bg-black px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] -rotate-1 text-white">
                    Quick Access
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="retro-button w-full bg-white px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-black transition-all hover:-translate-y-1 hover:bg-gray-100 flex items-center justify-center gap-2 sm:gap-3"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="truncate">Continue With Google</span>
                </button>
              </div>
            </div>

            {/* Traditional form */}
            <div className="retro-card-static bg-white p-6 sm:p-8 -rotate-1">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <div className="mb-5 sm:mb-6 text-center">
                  <div className="inline-block retro-card-static bg-black px-3 sm:px-4 py-1.5 sm:py-2 rotate-2 mb-3">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white retro-mono">
                      OR USE EMAIL
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {error && (
                    <div className="retro-card-static bg-red-100 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-black text-red-800 retro-mono rotate-1 text-center border-2 border-red-800">
                      {error}
                    </div>
                  )}

                  <div className="retro-card-static bg-white p-4 sm:p-5 rotate-1">
                    <label
                      htmlFor="email"
                      className="mb-2 sm:mb-3 block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-black"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-4 border-black bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black placeholder-gray-500 outline-none transition focus:bg-gray-50 font-mono"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="retro-card-static bg-white p-4 sm:p-5 -rotate-1">
                    <label
                      htmlFor="password"
                      className="mb-2 sm:mb-3 block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-black"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border-4 border-black bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black placeholder-gray-500 outline-none transition focus:bg-gray-50 font-mono"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="retro-button w-full bg-black px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-black uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-1 hover:bg-gray-900 disabled:opacity-50 rotate-1"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>

            <div className="retro-card-static bg-white p-4 sm:p-5 text-center -rotate-1">
              <p className="text-xs sm:text-sm text-zinc-700 retro-mono">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-black uppercase tracking-[0.12em] text-black underline decoration-2 sm:decoration-4 decoration-black underline-offset-4 transition hover:decoration-gray-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
