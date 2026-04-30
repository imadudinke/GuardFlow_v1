"""
GuardFlow SDK - Distributed Anti-Bot & Identity Fingerprinting for FastAPI

A powerful Python SDK for FastAPI applications that provides:
- Real-time threat detection and fingerprinting
- Intelligent rate limiting and request analysis
- Seamless integration with GuardFlow Studio dashboard
- DNA-based threat signature sharing across projects

Example:
    from guardflow import GuardFlowMiddleware
    from fastapi import FastAPI
    
    app = FastAPI()
    app.add_middleware(
        GuardFlowMiddleware,
        api_key="gf_live_your_api_key",
        studio_url="https://studio.guardflow.dev",
        redis_url="redis://localhost:6379"  # Required: Redis connection
    )

Requirements:
    - Redis server running (local or remote)
    - GuardFlow Studio account and API key
    - FastAPI application

Redis Setup:
    # Install Redis
    sudo apt install redis-server  # Ubuntu/Debian
    brew install redis            # macOS
    
    # Start Redis
    redis-server
    
    # Or use Docker
    docker run -d -p 6379:6379 redis:alpine
"""

__version__ = "0.1.1"
__author__ = "GuardFlow Team"
__email__ = "team@guardflow.dev"
__license__ = "MIT"

# Core middleware - the main entry point for FastAPI integration
from .middleware import GuardFlowMiddleware

# Utility functions for advanced usage
from .fingerprint import create_fingerprint
from .reporter import TelemetryReporter
from .scrubber import scrub_metadata

# Public API
__all__ = [
    "GuardFlowMiddleware",
    "create_fingerprint", 
    "TelemetryReporter",
    "scrub_metadata",
    "__version__",
]
