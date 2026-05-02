'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Code, Zap, Lock, Globe, Copy, Check, BookOpen, Rocket, Terminal, Database, Cloud, ArrowRight } from 'lucide-react'

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('quick-start')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ children, language = 'bash', id }: { children: string, language?: string, id: string }) => (
    <div className="relative retro-card-static bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 my-4 font-mono text-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-800 dark:border-green-900">
        <span className="text-xs text-green-600 dark:text-green-500 uppercase tracking-wide">{language}</span>
        <button
          onClick={() => copyToClipboard(children, id)}
          className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 hover:text-green-400 dark:hover:text-green-300 transition-colors"
        >
          {copiedCode === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copiedCode === id ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )

  const sections = [
    { id: 'quick-start', label: 'Quick Start', icon: Rocket },
    { id: 'installation', label: 'Installation', icon: Terminal },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'configuration', label: 'Configuration', icon: Code },
    { id: 'deployment', label: 'Deployment', icon: Cloud },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Retro Header */}
      <header className="bg-white dark:bg-gray-800 border-b-4 border-black dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="retro-card bg-black dark:bg-white p-2">
                <Shield className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-black retro-title text-black dark:text-white">GuardFlow</h1>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">DOCUMENTATION</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="retro-button bg-white dark:bg-gray-700 text-black dark:text-white border-black dark:border-gray-600 px-6 py-2 hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="font-black retro-mono text-sm">LOGIN</span>
              </Link>
              <Link href="/register" className="retro-button bg-black dark:bg-white text-white dark:text-black border-black dark:border-white px-6 py-2 hover:bg-gray-900 dark:hover:bg-gray-100">
                <span className="font-black retro-mono text-sm">GET STARTED</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Halftone */}
      <section className="relative py-20 overflow-hidden">
        {/* Halftone background */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `
            radial-gradient(circle 2px at 2px 2px, black 1px, transparent 0),
            radial-gradient(circle 1.5px at 1.5px 1.5px, black 1px, transparent 0)
          `,
          backgroundSize: '8px 8px, 12px 12px',
          backgroundPosition: '0 0, 4px 4px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-block retro-card bg-blue-100 dark:bg-blue-900 border-black dark:border-blue-700 px-6 py-2 mb-6">
              <span className="font-black retro-mono text-sm text-black dark:text-white">DNA-BASED THREAT DETECTION</span>
            </div>
            <h1 className="text-6xl font-black retro-title text-black dark:text-white mb-6">
              GUARDFLOW<br/>
              <span className="text-4xl">DEVELOPER DOCS</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-mono">
              Protect your FastAPI applications with zero-latency security.<br/>
              Install in under 5 minutes.
            </p>
            
            {/* Install command */}
            <div className="max-w-2xl mx-auto">
              <div className="retro-card bg-black dark:bg-gray-950 text-green-400 dark:text-green-300 p-6">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-lg">$ pip install guardflow-fastapi</code>
                  <button 
                    onClick={() => copyToClipboard('pip install guardflow-fastapi', 'hero-install')}
                    className="retro-button bg-green-600 dark:bg-green-700 text-white border-green-800 dark:border-green-900 px-4 py-2 hover:bg-green-700 dark:hover:bg-green-600"
                  >
                    <span className="font-black retro-mono text-xs flex items-center gap-2">
                      {copiedCode === 'hero-install' ? <><Check className="w-4 h-4" /> COPIED</> : <><Copy className="w-4 h-4" /> COPY</>}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Processing Time', value: '<1ms' },
              { label: 'Detection Rate', value: '99.7%' },
              { label: 'False Positives', value: '<0.01%' },
              { label: 'Setup Time', value: '5 min' },
            ].map((stat, i) => (
              <div key={i} className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-4 text-center">
                <div className="text-3xl font-black retro-title text-black dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Navigation Tabs */}
      <section className="bg-gray-100 dark:bg-gray-800 border-y-4 border-black dark:border-gray-700 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`retro-button px-4 py-2 whitespace-nowrap ${
                    activeSection === section.id 
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                      : 'bg-white dark:bg-gray-700 text-black dark:text-white border-black dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="font-black retro-mono text-xs flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {section.label.toUpperCase()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Start */}
        <section id="quick-start" className="mb-20">
          <div className="retro-card bg-blue-50 dark:bg-blue-900 border-black dark:border-blue-700 p-2 inline-block mb-6">
            <h2 className="text-4xl font-black retro-title text-black dark:text-white flex items-center gap-3">
              <Rocket className="w-8 h-8" />
              QUICK START
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-mono">
            Get GuardFlow running in your FastAPI application in 3 simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="retro-card bg-blue-50 dark:bg-blue-900 border-black dark:border-blue-700 p-6">
              <div className="retro-card bg-blue-600 dark:bg-blue-700 text-white border-black dark:border-blue-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-4xl font-black retro-title">1</span>
              </div>
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-3">INSTALL SDK</h3>
              <CodeBlock language="bash" id="step1">pip install guardflow-fastapi</CodeBlock>
            </div>

            <div className="retro-card bg-green-50 dark:bg-green-900 border-black dark:border-green-700 p-6">
              <div className="retro-card bg-green-600 dark:bg-green-700 text-white border-black dark:border-green-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-4xl font-black retro-title">2</span>
              </div>
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-3">START REDIS</h3>
              <CodeBlock language="bash" id="step2">docker run -d -p 6379:6379 redis:alpine</CodeBlock>
            </div>

            <div className="retro-card bg-purple-50 dark:bg-purple-900 border-black dark:border-purple-700 p-6">
              <div className="retro-card bg-purple-600 dark:bg-purple-700 text-white border-black dark:border-purple-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-4xl font-black retro-title">3</span>
              </div>
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-3">ADD MIDDLEWARE</h3>
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">See code below →</p>
            </div>
          </div>

          <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">COMPLETE EXAMPLE</h3>
            <CodeBlock language="python" id="quickstart-full">{`from fastapi import FastAPI
from guardflow import GuardFlowMiddleware

app = FastAPI()

# Add GuardFlow protection
app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key",
    studio_url="https://guardflow-v1.onrender.com",
    redis_url="redis://localhost:6379"
)

@app.get("/")
async def protected_endpoint():
    return {"message": "Protected by GuardFlow"}`}</CodeBlock>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-20">
          <div className="retro-card bg-green-50 dark:bg-green-900 border-black dark:border-green-700 p-2 inline-block mb-6">
            <h2 className="text-4xl font-black retro-title text-black dark:text-white flex items-center gap-3">
              <Terminal className="w-8 h-8" />
              INSTALLATION
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">SYSTEM REQUIREMENTS</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 dark:bg-green-500 border-2 border-black dark:border-green-700"></div>
                  <span className="text-gray-700 dark:text-gray-300">Python 3.8+</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 dark:bg-green-500 border-2 border-black dark:border-green-700"></div>
                  <span className="text-gray-700 dark:text-gray-300">FastAPI 0.95+</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 dark:bg-green-500 border-2 border-black dark:border-green-700"></div>
                  <span className="text-gray-700 dark:text-gray-300">Redis 4.5+</span>
                </div>
              </div>
            </div>

            <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">INSTALL FROM PYPI</h3>
              <CodeBlock language="bash" id="install-pypi">pip install guardflow-fastapi</CodeBlock>
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                Or with development dependencies:
              </p>
              <CodeBlock language="bash" id="install-dev">pip install "guardflow-fastapi[dev]"</CodeBlock>
            </div>
          </div>

          <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">DOCKER COMPOSE SETUP</h3>
            <CodeBlock language="yaml" id="docker-compose">{`version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: guardflow_cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - redis
    environment:
      - GUARDFLOW_API_KEY=gf_live_your_api_key
      - GUARDFLOW_REDIS_URL=redis://redis:6379

volumes:
  redis_data:`}</CodeBlock>
          </div>
        </section>
        {/* Features */}
        <section id="features" className="mb-20">
          <div className="retro-card bg-purple-50 dark:bg-purple-900 border-black dark:border-purple-700 p-2 inline-block mb-6">
            <h2 className="text-4xl font-black retro-title text-black dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8" />
              SECURITY FEATURES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="retro-card bg-blue-50 dark:bg-blue-900 border-black dark:border-blue-700 p-6">
              <div className="retro-card bg-blue-600 dark:bg-blue-700 text-white border-black dark:border-blue-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-3xl font-black retro-title">🧬</span>
              </div>
              <h3 className="text-2xl font-black retro-title text-black dark:text-white mb-3">DNA FINGERPRINTING</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-mono text-sm">
                Identifies attackers by their unique request patterns. Analyzes header sequences, 
                presence vectors, and protocol behaviors.
              </p>
              <div className="retro-card-static bg-green-50 dark:bg-green-900 border-2 border-green-600 dark:border-green-700 p-3">
                <div className="font-black retro-mono text-xs text-green-800 dark:text-green-200">DETECTION RATE: 99.7%</div>
              </div>
            </div>

            <div className="retro-card bg-green-50 dark:bg-green-900 border-black dark:border-green-700 p-6">
              <div className="retro-card bg-green-600 dark:bg-green-700 text-white border-black dark:border-green-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-3xl font-black retro-title">⚡</span>
              </div>
              <h3 className="text-2xl font-black retro-title text-black dark:text-white mb-3">ZERO-LATENCY</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-mono text-sm">
                Async "fire & forget" telemetry ensures your application performance 
                is never impacted by security processing.
              </p>
              <div className="retro-card-static bg-blue-50 dark:bg-blue-900 border-2 border-blue-600 dark:border-blue-700 p-3">
                <div className="font-black retro-mono text-xs text-blue-800 dark:text-blue-200">PROCESSING: &lt;1ms</div>
              </div>
            </div>

            <div className="retro-card bg-purple-50 dark:bg-purple-900 border-black dark:border-purple-700 p-6">
              <div className="retro-card bg-purple-600 dark:bg-purple-700 text-white border-black dark:border-purple-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-3xl font-black retro-title">🔒</span>
              </div>
              <h3 className="text-2xl font-black retro-title text-black dark:text-white mb-3">PII REDACTION</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-mono text-sm">
                Automatically detects and redacts sensitive data before telemetry 
                leaves your infrastructure. GDPR compliant.
              </p>
              <div className="retro-card-static bg-purple-50 dark:bg-purple-900 border-2 border-purple-600 dark:border-purple-700 p-3">
                <div className="font-black retro-mono text-xs text-purple-800 dark:text-purple-200">PRIVACY: ZERO LEAKAGE</div>
              </div>
            </div>

            <div className="retro-card bg-red-50 dark:bg-red-900 border-black dark:border-red-700 p-6">
              <div className="retro-card bg-red-600 dark:bg-red-700 text-white border-black dark:border-red-800 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-3xl font-black retro-title">🍯</span>
              </div>
              <h3 className="text-2xl font-black retro-title text-black dark:text-white mb-3">HONEYPOT TRAPS</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-mono text-sm">
                Invisible endpoints that trigger instant global bans when accessed. 
                Catches reconnaissance and automated attacks.
              </p>
              <div className="retro-card-static bg-red-50 dark:bg-red-900 border-2 border-red-600 dark:border-red-700 p-3">
                <div className="font-black retro-mono text-xs text-red-800 dark:text-red-200">RESPONSE: INSTANT BAN</div>
              </div>
            </div>
          </div>

          <div className="retro-card bg-yellow-50 dark:bg-yellow-900 border-black dark:border-yellow-700 p-6 mt-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">HOW DNA FINGERPRINTING WORKS</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 font-mono text-sm">
              Traditional security looks at <strong>what</strong> attackers send. 
              GuardFlow analyzes <strong>how</strong> they send it.
            </p>
            <CodeBlock language="python" id="fingerprint-example">{`# Example: Two identical requests, different DNA
Request A: User-Agent → Accept → Accept-Language → Connection
Request B: Accept → User-Agent → Connection → Accept-Language

# Result: Completely different fingerprints
Fingerprint A: sha256("UA|AC|AL|CN") = "a1b2c3..."
Fingerprint B: sha256("AC|UA|CN|AL") = "x9y8z7..."`}</CodeBlock>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-20">
          <div className="retro-card bg-orange-50 dark:bg-orange-900 border-black dark:border-orange-700 p-2 inline-block mb-6">
            <h2 className="text-4xl font-black retro-title text-black dark:text-white flex items-center gap-3">
              <Code className="w-8 h-8" />
              CONFIGURATION
            </h2>
          </div>

          <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6 mb-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">BASIC CONFIGURATION</h3>
            <CodeBlock language="python" id="config-basic">{`from fastapi import FastAPI
from guardflow import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware,
    # Required Settings
    api_key="gf_live_your_api_key",
    studio_url="https://guardflow-v1.onrender.com",
    redis_url="redis://localhost:6379",
    
    # Security Configuration
    block_threshold=80,           # Threat score 0-100
    enable_fingerprinting=True,   # DNA identification
    enable_honeypots=True,        # Deception traps
    
    # Privacy Configuration
    redact_pii=True,             # Smart PII redaction
    redact_headers=[
        "Authorization",
        "Cookie",
        "X-API-Key"
    ],
    
    # Performance Configuration
    async_reporting=True,         # Zero-latency telemetry
    rate_limit_window=60,        # Seconds
    rate_limit_max_requests=100, # Per window
)`}</CodeBlock>
          </div>

          <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6 mb-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">ENVIRONMENT VARIABLES</h3>
            <CodeBlock language="bash" id="config-env">{`# .env file
GUARDFLOW_API_KEY=gf_live_your_api_key
GUARDFLOW_STUDIO_URL=https://guardflow-v1.onrender.com
GUARDFLOW_REDIS_URL=redis://localhost:6379
GUARDFLOW_BLOCK_THRESHOLD=80
GUARDFLOW_ENABLE_FINGERPRINTING=true
GUARDFLOW_ENABLE_HONEYPOTS=true
GUARDFLOW_REDACT_PII=true`}</CodeBlock>
          </div>

          <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">ADVANCED CONFIGURATION</h3>
            <CodeBlock language="python" id="config-advanced">{`from guardflow import GuardFlowMiddleware
from guardflow.fingerprint import CustomFingerprinter

# Custom fingerprinting rules
fingerprinter = CustomFingerprinter()
fingerprinter.add_header_weight("X-Custom-Header", 0.8)
fingerprinter.add_pattern_rule(r"bot|crawler", threat_boost=0.3)

app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key",
    studio_url="https://guardflow-v1.onrender.com",
    redis_url="redis://localhost:6379",
    
    # Custom fingerprinter
    fingerprinter=fingerprinter,
    
    # Redis clustering
    redis_cluster=True,
    redis_ssl=True,
    
    # Webhook integration
    webhook_url="https://your-app.com/security-webhook",
    webhook_events=["high_threat", "honeypot_trigger"],
)`}</CodeBlock>
          </div>
        </section>
        {/* Deployment */}
        <section id="deployment" className="mb-20">
          <div className="retro-card bg-red-50 dark:bg-red-900 border-black dark:border-red-700 p-2 inline-block mb-6">
            <h2 className="text-4xl font-black retro-title text-black dark:text-white flex items-center gap-3">
              <Cloud className="w-8 h-8" />
              DEPLOYMENT
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">DOCKERFILE</h3>
              <CodeBlock language="dockerfile" id="deploy-dockerfile">{`FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`}</CodeBlock>
            </div>

            <div className="retro-card bg-white dark:bg-gray-800 border-black dark:border-gray-700 p-6">
              <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">KUBERNETES</h3>
              <CodeBlock language="yaml" id="deploy-k8s">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi-app
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: your-app:latest
        ports:
        - containerPort: 8000
        env:
        - name: GUARDFLOW_API_KEY
          valueFrom:
            secretKeyRef:
              name: guardflow-secrets
              key: api-key`}</CodeBlock>
            </div>
          </div>

          <div className="retro-card bg-blue-50 dark:bg-blue-900 border-black dark:border-blue-700 p-6">
            <h3 className="text-xl font-black retro-title text-black dark:text-white mb-4">BEST PRACTICES</h3>
            <div className="space-y-3">
              {[
                'Use environment variables for API keys',
                'Enable Redis persistence (AOF or RDB)',
                'Start with lenient thresholds (90+)',
                'Monitor dashboard regularly',
                'Enable PII redaction for GDPR compliance',
                'Use Redis clustering for high traffic',
                'Test in staging before production'
              ].map((practice, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="retro-card bg-black dark:bg-white border-black dark:border-white w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 dark:text-green-600 font-black text-2xl leading-none">✓</span>
                  </div>
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 pt-2">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="retro-card bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 border-black dark:border-purple-700 p-12 text-center">
          <h2 className="text-4xl font-black retro-title text-white mb-4">READY TO PROTECT YOUR APP?</h2>
          <p className="text-lg text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto font-mono">
            Join thousands of developers using GuardFlow to secure their FastAPI applications.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link 
              href="/register" 
              className="retro-button bg-white dark:bg-gray-100 text-black border-black dark:border-gray-300 px-8 py-4 hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <span className="font-black retro-mono text-sm flex items-center gap-2">
                GET STARTED FREE <span className="text-xl">→</span>
              </span>
            </Link>
            <Link 
              href="/login" 
              className="retro-button bg-black dark:bg-gray-900 text-white border-white dark:border-gray-300 px-8 py-4 hover:bg-gray-900 dark:hover:bg-gray-800"
            >
              <span className="font-black retro-mono text-sm">VIEW DASHBOARD</span>
            </Link>
          </div>
          <p className="text-sm text-blue-200 dark:text-blue-300 mt-6 font-mono">
            NO CREDIT CARD • 100K REQUESTS/MONTH FREE • CANCEL ANYTIME
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black dark:bg-gray-950 text-white py-12 mt-20 border-t-4 border-black dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="retro-card bg-white border-white p-2">
                  <div className="w-6 h-6 bg-black"></div>
                </div>
                <span className="font-black retro-title text-xl">GuardFlow</span>
              </div>
              <p className="text-sm font-mono text-gray-400">
                Distributed application-layer security for modern APIs
              </p>
            </div>
            
            <div>
              <h4 className="font-black retro-title text-white mb-4">PRODUCT</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black retro-title text-white mb-4">RESOURCES</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li><a href="#guides" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="https://github.com/guardflow" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black retro-title text-white mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-2 border-gray-800 pt-8 text-center">
            <p className="text-sm font-mono text-gray-400">
              © 2026 GuardFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}