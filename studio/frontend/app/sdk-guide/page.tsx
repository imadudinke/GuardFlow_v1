"use client";

import { useState } from "react";
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page";
import {
  Code,
  Copy,
  CheckCircle,
  ExternalLink,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";

const codeExamples = {
  python: {
    install: `pip install guardflow-fastapi`,
    basic: `from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

# Add GuardFlow protection
app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key_here",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com"
)

@app.get("/")
async def root():
    return {"status": "Protected by GuardFlow"}`,
    advanced: `from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

# Advanced configuration with custom settings
app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key_here",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com",
    # Honeypot traps - paths that should never be accessed
    bait_paths=["/admin", "/wp-admin", "/.env", "/config"],
    # Protected paths - require authentication
    protected_paths=["/api/admin", "/dashboard"]
)

# The middleware automatically:
# - Generates DNA fingerprints for each request
# - Checks global blacklist (shared across projects)
# - Enforces rate limiting (10 req/min, ban after 50)
# - Blocks honeypot path access
# - Reports threats to Studio in real-time
# - Scrubs PII from telemetry data

@app.get("/")
async def root():
    return {"status": "Protected"}

@app.get("/api/data")
async def get_data():
    # This endpoint is automatically protected
    return {"data": [1, 2, 3, 4, 5]}`,
  },
  nodejs: {
    install: `# Node.js SDK coming soon!
# For now, use the Python SDK with FastAPI`,
    basic: `// Node.js SDK is under development
// Currently available: Python SDK for FastAPI

// Stay tuned for:
// - Express.js middleware
// - Koa middleware  
// - NestJS integration`,
    advanced: `// Advanced features coming to Node.js SDK:
// - DNA fingerprinting
// - Rate limiting
// - Global blacklist
// - Honeypot traps
// - Real-time telemetry

// For now, use Python SDK with FastAPI
// Visit: https://pypi.org/project/guardflow-fastapi/`,
  },
};

export default function SDKGuidePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "nodejs">(
    "python",
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const CopyCodeButton = ({ id, code }: { id: string; code: string }) => (
    <button
      onClick={() => copyToClipboard(code, id)}
      className={`retro-button px-3 py-1.5 text-xs inline-flex items-center gap-2 shrink-0 transition-colors ${
        copiedCode === id
          ? "bg-emerald-600 hover:bg-emerald-500 text-black border-emerald-700"
          : "bg-blue-600 hover:bg-blue-500 text-black border-blue-700"
      }`}
      aria-label={`Copy ${id} code`}
      type="button"
    >
      {copiedCode === id ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copiedCode === id ? "Copied!" : "Copy"}
    </button>
  );

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-8 text-black">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <header className="retro-card-static p-6 bg-white">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                Integration Hub
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                SDK Guide
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                Integrate GuardFlow into your applications with our lightweight
                SDKs. Real-time threat detection with minimal performance
                impact.
              </p>
            </div>
          </header>

          {/* Quick Start */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="retro-card-static bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">
                  Quick Start
                </h3>
              </div>
              <div className="space-y-3 text-sm retro-mono">
                <div>1. Get your API key from Projects</div>
                <div>2. Install the SDK</div>
                <div>3. Add middleware to your app</div>
                <div>4. Start monitoring threats</div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">
                  Features
                </h3>
              </div>
              <div className="space-y-3 text-sm retro-mono">
                <div>• Real-time threat detection</div>
                <div>• Automatic IP blocking</div>
                <div>• Rate limiting</div>
                <div>• Custom rule engine</div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">
                  Supported
                </h3>
              </div>
              <div className="space-y-3 text-sm retro-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Python (FastAPI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-amber-600" />
                  <span>Node.js (coming soon)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-amber-600" />
                  <span>Go (planned)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span>Rust (planned)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage("python")}
              className={`retro-button px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono ${
                selectedLanguage === "python"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLanguage("nodejs")}
              className={`retro-button px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono ${
                selectedLanguage === "nodejs"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Node.js
            </button>
          </div>

          {/* Installation */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                Installation
              </h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gray-300 retro-mono">
                    Command
                  </span>
                  <CopyCodeButton
                    id="install"
                    code={codeExamples[selectedLanguage].install}
                  />
                </div>
                <code className="text-sm retro-mono block whitespace-pre-wrap break-all">
                  {codeExamples[selectedLanguage].install}
                </code>
              </div>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                Basic Usage
              </h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gray-300 retro-mono">
                    Snippet
                  </span>
                  <CopyCodeButton
                    id="basic"
                    code={codeExamples[selectedLanguage].basic}
                  />
                </div>
                <pre className="text-sm retro-mono whitespace-pre-wrap overflow-x-auto">
                  {codeExamples[selectedLanguage].basic}
                </pre>
              </div>
            </div>
          </div>

          {/* Advanced Configuration */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                Advanced Configuration
              </h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gray-300 retro-mono">
                    Snippet
                  </span>
                  <CopyCodeButton
                    id="advanced"
                    code={codeExamples[selectedLanguage].advanced}
                  />
                </div>
                <pre className="text-sm retro-mono whitespace-pre-wrap overflow-x-auto">
                  {codeExamples[selectedLanguage].advanced}
                </pre>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                API Endpoints
              </h3>
              <div className="space-y-4">
                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-green-100 text-green-800 px-2 py-1 text-xs font-black retro-mono">
                      POST
                    </span>
                    <code className="text-sm retro-mono text-black">
                      /api/v1/telemetry
                    </code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">
                    Send threat telemetry data
                  </p>
                </div>

                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-blue-100 text-blue-800 px-2 py-1 text-xs font-black retro-mono">
                      POST
                    </span>
                    <code className="text-sm retro-mono text-black">
                      /api/v1/telemetry/blacklist-check
                    </code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">
                    Check if DNA fingerprint is blacklisted
                  </p>
                </div>

                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-purple-100 text-purple-800 px-2 py-1 text-xs font-black retro-mono">
                      GET
                    </span>
                    <code className="text-sm retro-mono text-black">
                      /api/v1/telemetry/runtime-config
                    </code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">
                    Get project configuration settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="retro-card-static bg-white p-6">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                  Resources
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://pypi.org/project/guardflow-fastapi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm retro-mono text-black hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    PyPI Package
                  </a>
                  <a
                    href="https://github.com/imadudinke/GuardFlow_v1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm retro-mono text-black hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    GitHub Repository
                  </a>
                  <a
                    href="/docs"
                    className="flex items-center gap-3 text-sm retro-mono text-black hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Full Documentation
                  </a>
                  <a
                    href="https://guardflow-v1.onrender.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm retro-mono text-black hover:text-blue-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                    API Reference
                  </a>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3 text-sm retro-mono text-black">
                  <div>• Check the Analytics page for integration status</div>
                  <div>• View threat logs in the Threats section</div>
                  <div>• Monitor blocked requests in real-time</div>
                  <div>• Adjust settings in your Project configuration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardPage>
  );
}
