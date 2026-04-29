"use client";

import { useState } from "react";
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page";
import { Code, Copy, CheckCircle, ExternalLink, Terminal, Shield, Zap } from "lucide-react";

const codeExamples = {
  python: {
    install: `pip install guardflow-sdk`,
    basic: `from guardflow import GuardFlow

# Initialize with your project API key
gf = GuardFlow(api_key="gf_live_your_api_key_here")

# Basic middleware integration
@app.middleware("http")
async def guardflow_middleware(request: Request, call_next):
    # Check if request should be blocked
    result = await gf.check_request(request)
    
    if result.blocked:
        return JSONResponse(
            status_code=403,
            content={"error": "Request blocked by GuardFlow"}
        )
    
    response = await call_next(request)
    
    # Log the request for analysis
    await gf.log_request(request, response)
    
    return response`,
    advanced: `# Advanced configuration
gf = GuardFlow(
    api_key="gf_live_your_api_key_here",
    hard_ban_enabled=True,  # Block high-risk requests
    rate_limit_window=60,   # Rate limiting window in seconds
    max_requests_per_window=100,
    custom_rules=[
        {"path": "/admin/*", "block_anonymous": True},
        {"path": "/api/sensitive", "require_auth": True}
    ]
)

# Custom threat detection
@gf.custom_detector
def detect_sql_injection(request):
    suspicious_patterns = ["'", "UNION", "SELECT", "--"]
    query_params = str(request.query_params)
    
    for pattern in suspicious_patterns:
        if pattern.lower() in query_params.lower():
            return {
                "threat_detected": True,
                "risk_factor": "sql_injection_attempt",
                "confidence": 0.8
            }
    
    return {"threat_detected": False}`
  },
  nodejs: {
    install: `npm install @guardflow/sdk`,
    basic: `const { GuardFlow } = require('@guardflow/sdk');

// Initialize GuardFlow
const gf = new GuardFlow({
  apiKey: 'gf_live_your_api_key_here'
});

// Express.js middleware
app.use(async (req, res, next) => {
  try {
    // Check request against GuardFlow
    const result = await gf.checkRequest(req);
    
    if (result.blocked) {
      return res.status(403).json({
        error: 'Request blocked by GuardFlow'
      });
    }
    
    // Continue to next middleware
    next();
    
    // Log request after processing
    res.on('finish', () => {
      gf.logRequest(req, res);
    });
    
  } catch (error) {
    console.error('GuardFlow error:', error);
    next(); // Continue on error
  }
});`,
    advanced: `// Advanced configuration with custom rules
const gf = new GuardFlow({
  apiKey: 'gf_live_your_api_key_here',
  hardBanEnabled: true,
  rateLimitWindow: 60,
  maxRequestsPerWindow: 100,
  customRules: [
    {
      path: '/admin/*',
      blockAnonymous: true
    },
    {
      path: '/api/sensitive',
      requireAuth: true
    }
  ]
});

// Custom threat detection
gf.addCustomDetector('xss-detection', (req) => {
  const suspiciousPatterns = ['<script', 'javascript:', 'onerror='];
  const userInput = JSON.stringify(req.body) + req.url;
  
  for (const pattern of suspiciousPatterns) {
    if (userInput.toLowerCase().includes(pattern)) {
      return {
        threatDetected: true,
        riskFactor: 'xss_attempt',
        confidence: 0.9
      };
    }
  }
  
  return { threatDetected: false };
});`
  }
};

export default function SDKGuidePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'nodejs'>('python');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

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
                Integrate GuardFlow into your applications with our lightweight SDKs. Real-time threat detection with minimal performance impact.
              </p>
            </div>
          </header>

          {/* Quick Start */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="retro-card-static bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">Quick Start</h3>
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
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">Features</h3>
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
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">Supported</h3>
              </div>
              <div className="space-y-3 text-sm retro-mono">
                <div>• Python (FastAPI, Django)</div>
                <div>• Node.js (Express, Koa)</div>
                <div>• Go (coming soon)</div>
                <div>• Rust (coming soon)</div>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`retro-button px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono ${
                selectedLanguage === 'python' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLanguage('nodejs')}
              className={`retro-button px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono ${
                selectedLanguage === 'nodejs' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Node.js
            </button>
          </div>

          {/* Installation */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Installation</h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white relative">
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].install, 'install')}
                  className="absolute top-3 right-3 retro-button bg-gray-700 text-white border-gray-600 px-3 py-1 text-xs flex items-center gap-2"
                >
                  {copiedCode === 'install' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'install' ? 'Copied!' : 'Copy'}
                </button>
                <code className="text-sm retro-mono">{codeExamples[selectedLanguage].install}</code>
              </div>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Basic Usage</h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white relative">
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].basic, 'basic')}
                  className="absolute top-3 right-3 retro-button bg-gray-700 text-white border-gray-600 px-3 py-1 text-xs flex items-center gap-2"
                >
                  {copiedCode === 'basic' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'basic' ? 'Copied!' : 'Copy'}
                </button>
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
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Advanced Configuration</h3>
              <div className="retro-card-static bg-gray-900 p-4 text-white relative">
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].advanced, 'advanced')}
                  className="absolute top-3 right-3 retro-button bg-gray-700 text-white border-gray-600 px-3 py-1 text-xs flex items-center gap-2"
                >
                  {copiedCode === 'advanced' ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'advanced' ? 'Copied!' : 'Copy'}
                </button>
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
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">API Endpoints</h3>
              <div className="space-y-4">
                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-green-100 text-green-800 px-2 py-1 text-xs font-black retro-mono">POST</span>
                    <code className="text-sm retro-mono">/api/v1/telemetry</code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">Send threat telemetry data</p>
                </div>

                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-blue-100 text-blue-800 px-2 py-1 text-xs font-black retro-mono">POST</span>
                    <code className="text-sm retro-mono">/api/v1/telemetry/blacklist-check</code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">Check if DNA fingerprint is blacklisted</p>
                </div>

                <div className="retro-card-static bg-gray-50 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="retro-card-static bg-purple-100 text-purple-800 px-2 py-1 text-xs font-black retro-mono">GET</span>
                    <code className="text-sm retro-mono">/api/v1/telemetry/runtime-config</code>
                  </div>
                  <p className="text-sm retro-mono text-gray-600">Get project configuration settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="retro-card-static bg-white p-6">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Resources</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 text-sm retro-mono hover:text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    Python SDK Documentation
                  </a>
                  <a href="#" className="flex items-center gap-3 text-sm retro-mono hover:text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    Node.js SDK Documentation
                  </a>
                  <a href="#" className="flex items-center gap-3 text-sm retro-mono hover:text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    API Reference
                  </a>
                  <a href="#" className="flex items-center gap-3 text-sm retro-mono hover:text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    Example Projects
                  </a>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm retro-mono">
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