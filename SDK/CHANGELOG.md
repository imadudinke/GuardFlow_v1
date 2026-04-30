# Changelog

All notable changes to the GuardFlow SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-04-30

### Fixed
- **Reduced error log spam**: Changed error logging from ERROR to DEBUG level for non-critical failures
- **Increased API timeouts**: Extended timeouts for cloud deployments (telemetry: 2s→5s, blacklist: 1s→3s, config: 1s→3s)
- **Better error handling**: Added specific handling for timeout and connection errors
- **Improved reliability**: SDK now handles slow Studio API responses gracefully

### Changed
- Telemetry timeout increased from 2.0s to 5.0s for better cloud compatibility
- Blacklist check timeout increased from 1.0s to 3.0s
- Runtime config timeout increased from 1.0s to 3.0s
- Error messages now use DEBUG level instead of ERROR/WARNING for transient failures

### Added
- Specific exception handling for `httpx.TimeoutException` and `httpx.ConnectError`
- Debug mode instructions in documentation
- Better error messages with exception type information

## [0.1.1] - 2026-04-29

### Fixed
- Updated documentation with proper Redis configuration requirements
- Corrected package name from `guardflow-sdk-imtech` to `guardflow-fastapi`
- Added comprehensive setup instructions for Redis
- Improved example code with Redis URL parameter
- Enhanced configuration documentation

### Added
- Redis configuration examples (local, password, SSL, cluster)
- Environment variables support documentation
- Better error handling examples

## [0.1.0] - 2026-04-29

### Added
- Initial release of GuardFlow SDK
- FastAPI middleware integration for threat detection
- DNA fingerprinting technology for unique threat signatures
- Real-time threat reporting to GuardFlow Studio
- Intelligent rate limiting with configurable thresholds
- Request metadata scrubbing for privacy compliance
- Redis-based caching and session management
- Comprehensive type hints and documentation
- Support for Python 3.8+

### Features
- `GuardFlowMiddleware` - Main FastAPI middleware for protection
- `create_fingerprint()` - Generate unique device/request fingerprints
- `TelemetryReporter` - Real-time threat data reporting
- `scrub_metadata()` - Privacy-compliant data sanitization

### Dependencies
- FastAPI 0.95.0+
- Redis 4.5.0+
- httpx 0.24.0+
- Pydantic 2.0.0+

### Documentation
- Complete API reference
- Integration examples
- Configuration guide
- Studio dashboard documentation