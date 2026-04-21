# GuardFlow SDK

Threat detection and monitoring SDK for Python applications.

## Installation

```bash
pip install guardflow
```

## Quick Start

```python
from guardflow import GuardFlowMiddleware

# Add to your ASGI app (FastAPI, Starlette, etc.)
app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key",
    block_threshold=80
)
```

## Features

- Real-time threat detection
- Device fingerprinting
- Automatic threat reporting
- Configurable blocking thresholds

## Documentation

Coming soon...
