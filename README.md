# GuardFlow V1

GuardFlow is a full-stack application security platform for FastAPI apps:

- **SDK (`SDK/`)**: Python middleware for DNA fingerprinting, rate limiting, and threat telemetry.
- **Studio (`studio/`)**: Web control plane for threat visibility, project management, analytics, and blacklist operations.

## Live Links

- Studio: [https://guard-flow-v1.vercel.app/](https://guard-flow-v1.vercel.app/)
- Documentation: [https://guard-flow-v1.vercel.app/docs](https://guard-flow-v1.vercel.app/docs)
- SDK Guide: [https://guard-flow-v1.vercel.app/sdk-guide](https://guard-flow-v1.vercel.app/sdk-guide)
- Repository: [https://github.com/imadudinke/GuardFlow_v1](https://github.com/imadudinke/GuardFlow_v1)

## PyPI Package

`guardflow-fastapi`

[![PyPI version](https://img.shields.io/pypi/v/guardflow-fastapi)](https://pypi.org/project/guardflow-fastapi/)
[![Python versions](https://img.shields.io/pypi/pyversions/guardflow-fastapi)](https://pypi.org/project/guardflow-fastapi/)
[![Downloads](https://static.pepy.tech/badge/guardflow-fastapi)](https://pepy.tech/projects/guardflow-fastapi)
[![Downloads / month](https://static.pepy.tech/badge/guardflow-fastapi/month)](https://pepy.tech/projects/guardflow-fastapi)

Install:

```bash
pip install guardflow-fastapi
```

## Repository Structure

```text
GuardFlow_V1/
├── SDK/                  # Python package (guardflow-fastapi)
│   ├── guardflow/        # SDK source
│   └── README.md         # SDK-specific README
├── studio/
│   ├── backend/          # FastAPI backend (API, auth, telemetry)
│   └── frontend/         # Next.js Studio UI
└── README.md             # This file
```

## Quick Start (Local)

### 1) SDK in your FastAPI app

```python
from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key_here",
    redis_url="redis://localhost:6379",
    studio_url="https://guard-flow-v1.vercel.app",
)
```

### 2) Run Studio backend

```bash
cd studio/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 3) Run Studio frontend

```bash
cd studio/frontend
npm install
npm run dev
```

## Core Features

- DNA-based request fingerprinting
- Real-time threat telemetry ingestion
- Threat scoring and blacklist workflow
- Project-based API key management
- Responsive Studio dashboard (projects, threats, analytics, SDK guide)
- Privacy-aware metadata handling

## Notes

- This repo contains both product UI and SDK code; update docs/URLs together when changing domains.
- If you are using hosted Studio, keep `studio_url` set to the production URL above.

## License

MIT (see repository license files).
