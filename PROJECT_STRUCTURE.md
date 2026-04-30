# GuardFlow Project Structure

Complete overview of the GuardFlow security ecosystem.

## 📁 Repository Structure

```
GuardFlow/
│
├── README.md                      # Main project documentation
├── .env                          # Environment configuration
├── docker-compose.yml            # Complete stack deployment
├── PROJECT_STRUCTURE.md          # This file
│
├── SDK/                          # Python SDK Package
│   ├── guardflow/               # Core SDK code
│   │   ├── __init__.py         # Package exports
│   │   ├── middleware.py       # FastAPI middleware
│   │   ├── fingerprint.py      # DNA fingerprinting engine
│   │   ├── limiter.py          # Rate limiting logic
│   │   ├── reporter.py         # Async telemetry reporter
│   │   ├── scrubber.py         # PII redaction
│   │   └── py.typed            # Type hints marker
│   │
│   ├── README.md               # SDK documentation (used by PyPI)
│   ├── pyproject.toml          # Package configuration
│   ├── MANIFEST.in             # Package file inclusion rules
│   ├── LICENSE                 # MIT License
│   ├── CHANGELOG.md            # Version history
│   ├── requirements.txt        # Runtime dependencies
│   ├── requirements-dev.txt    # Development dependencies
│   ├── build_and_upload.sh     # Build and upload script
│   └── Makefile                # Build automation
│
├── studio/                      # GuardFlow Studio (Control Plane)
│   │
│   ├── backend/                # FastAPI Backend
│   │   ├── app/
│   │   │   ├── main.py        # Application entry point
│   │   │   ├── api/           # API endpoints
│   │   │   │   ├── auth.py    # Authentication endpoints
│   │   │   │   ├── projects.py # Project management
│   │   │   │   ├── telemetry.py # Threat logs
│   │   │   │   └── users.py   # User management
│   │   │   │
│   │   │   ├── core/          # Core functionality
│   │   │   │   ├── auth.py    # JWT authentication
│   │   │   │   ├── db.py      # Database connection
│   │   │   │   └── security.py # Password hashing
│   │   │   │
│   │   │   ├── models/        # SQLAlchemy models
│   │   │   │   ├── user.py
│   │   │   │   ├── project.py
│   │   │   │   ├── threat_log.py
│   │   │   │   └── global_blacklist.py
│   │   │   │
│   │   │   ├── schemas/       # Pydantic schemas
│   │   │   │   ├── user.py
│   │   │   │   ├── project.py
│   │   │   │   └── threat_log.py
│   │   │   │
│   │   │   └── services/      # Business logic
│   │   │       ├── user.py
│   │   │       └── project.py
│   │   │
│   │   ├── migrations/        # Alembic migrations
│   │   │   ├── env.py
│   │   │   └── versions/      # Migration files
│   │   │
│   │   ├── requirements.txt   # Backend dependencies
│   │   ├── Dockerfile         # Backend container
│   │   └── alembic.ini        # Migration config
│   │
│   └── frontend/              # Next.js Frontend
│       ├── app/               # App router pages
│       │   ├── page.tsx       # Homepage
│       │   ├── login/         # Login page
│       │   ├── register/      # Registration page
│       │   ├── dashboard/     # Main dashboard
│       │   ├── projects/      # Project management
│       │   ├── threats/       # Threat logs
│       │   ├── analytics/     # Analytics page
│       │   ├── blacklist/     # Global blacklist
│       │   ├── sdk-guide/     # SDK integration guide
│       │   ├── docs/          # Public documentation
│       │   ├── not-found.tsx  # 404 page
│       │   ├── layout.tsx     # Root layout
│       │   └── globals.css    # Global styles
│       │
│       ├── components/        # React components
│       │   ├── dashboard/     # Dashboard components
│       │   │   ├── dashboard-shell.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── header.tsx
│       │   │   ├── stats-card.tsx
│       │   │   ├── recent-threats.tsx
│       │   │   └── security-overview.tsx
│       │   │
│       │   └── ui/            # Reusable UI components
│       │       ├── api-key-display.tsx
│       │       ├── pagination.tsx
│       │       └── skeleton.tsx
│       │
│       ├── contexts/          # React contexts
│       │   └── AuthContext.tsx
│       │
│       ├── hooks/             # Custom React hooks
│       │   ├── useProjects.ts
│       │   ├── useThreats.ts
│       │   └── useStats.ts
│       │
│       ├── lib/               # Utilities
│       │   └── api/           # API client
│       │       ├── config.ts
│       │       ├── auth.ts
│       │       ├── projects.ts
│       │       └── threats.ts
│       │
│       ├── package.json       # Frontend dependencies
│       ├── next.config.js     # Next.js configuration
│       ├── tailwind.config.js # Tailwind CSS config
│       ├── tsconfig.json      # TypeScript config
│       └── Dockerfile         # Frontend container
│
└── test-deployment/           # SDK testing environment
    ├── test_app.py           # Test FastAPI application
    ├── docker-compose.test.yml
    └── requirements.txt
```

## 🔧 Key Configuration Files

### Root Level
- **README.md**: Complete project documentation
- **.env**: Environment variables for all services
- **docker-compose.yml**: Orchestrates all services (backend, frontend, postgres, redis)

### SDK Package
- **SDK/README.md**: SDK-specific documentation (displayed on PyPI)
- **SDK/pyproject.toml**: Package metadata and dependencies
- **SDK/MANIFEST.in**: Controls which files are included in the package

### Studio Backend
- **studio/backend/app/main.py**: FastAPI application entry point
- **studio/backend/requirements.txt**: Python dependencies
- **studio/backend/alembic.ini**: Database migration configuration

### Studio Frontend
- **studio/frontend/package.json**: Node.js dependencies
- **studio/frontend/next.config.js**: Next.js build configuration
- **studio/frontend/tailwind.config.js**: Styling configuration

## 📦 Package Distribution

### SDK on PyPI
The SDK is published to PyPI as `guardflow-fastapi`:
- Source: `SDK/` directory
- Documentation: `SDK/README.md` (automatically displayed on PyPI)
- Installation: `pip install guardflow-fastapi`

### Studio Deployment
The Studio can be deployed in multiple ways:
- **Docker Compose**: Complete stack with one command
- **Vercel**: Frontend deployment (Next.js)
- **Kubernetes**: Production-grade orchestration
- **Manual**: Separate backend and frontend deployment

## 🚀 Quick Commands

### SDK Development
```bash
cd SDK
pip install -e ".[dev]"          # Install in development mode
pytest tests/ -v                  # Run tests
python -m build                   # Build package
twine upload --repository testpypi dist/*  # Upload to Test PyPI
```

### Studio Development
```bash
# Backend
cd studio/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Frontend
cd studio/frontend
npm install --legacy-peer-deps
npm run dev
```

### Complete Stack
```bash
# From root directory
docker-compose up -d              # Start all services
docker-compose logs -f            # View logs
docker-compose down               # Stop all services
```

## 📚 Documentation Locations

1. **Main README** (`/README.md`): Complete project overview
2. **SDK README** (`/SDK/README.md`): SDK-specific documentation (used by PyPI)
3. **Public Docs** (`/studio/frontend/app/docs/page.tsx`): Web-based documentation
4. **API Docs**: Auto-generated at `http://localhost:8001/docs` (FastAPI)

## 🔗 Important URLs

### Development
- Studio Frontend: http://localhost:3000
- Studio Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Production
- PyPI Package: https://pypi.org/project/guardflow-fastapi/
- Test PyPI: https://test.pypi.org/project/guardflow-fastapi/
- Studio (Hosted): https://studio.guardflow.dev
- Documentation: https://docs.guardflow.dev

## 🎯 Key Features by Component

### SDK (`/SDK`)
- DNA fingerprinting
- Rate limiting
- PII redaction
- Async telemetry
- Honeypot traps

### Studio Backend (`/studio/backend`)
- JWT authentication
- Project management
- Threat log storage
- Global blacklist
- WebSocket support

### Studio Frontend (`/studio/frontend`)
- Real-time dashboard
- Threat visualization
- Project management UI
- API key management
- Public documentation page

## 📝 Notes

- The SDK README is automatically used by PyPI when the package is published
- The main README provides an overview of the entire ecosystem
- All documentation is kept in sync across different locations
- The project uses a monorepo structure for easier development and deployment
