# Project Status: RDVPro

## Completed Tasks
- ✅ AUTH-001: Authentication Service
  - Implemented AuthService with Supabase login
  - Implemented AuthController with login endpoint
  - Added LoginDto for input validation
  - Integrated audit logging for login attempts
  - Implemented structured error handling
  - Following NestJS standards and DTO validation

- ✅ AUTH-002: Forgot Password
  - Implemented forgot-password endpoint
  - Added ForgotPasswordDto with email validation
  - Integrated Supabase password reset
  - Added audit logging for reset requests
  - Implemented security best practices (202 response)
  - Full test coverage (unit + integration)

- ✅ AUTH-003: Forgot Password Rate Limiting
  - Implemented RateLimitGuard for forgot-password endpoint
  - Limited to 5 requests per IP per hour
  - Added audit logging for rate limit blocks
  - Maintained security best practices (no email existence disclosure)
  - Full test coverage (unit + integration)

- ✅ TECH-001: Fix Linter Warnings
  - Fixed all TypeScript and NestJS linter warnings
  - Ensured clean build and test runs
  - Maintained test coverage while fixing issues
  - Preserved audit logging functionality
  - No functional changes made

- ✅ APPT-002: Extend Appointment Types
  - Added new appointment types: administrative and urgent-signature
  - Updated DTO validation for new types
  - Extended test coverage for all appointment types
  - Maintained audit logging functionality
  - No breaking changes to existing code

- ✅ APPT-003: Implement Supabase Persistence for Appointments
  - Implemented appointments table in Supabase
  - Added appointment creation with proper error handling
  - Integrated audit logging for database operations
  - Full test coverage with Supabase mocks
  - All tests passing with persistence layer

- ✅ SIGN-001: Prepare Signature Module Skeleton
  - Created src/signature/ module with service, controller, module, and DTOs
  - Protected endpoints with JwtAuthGuard and set up audit log stubs
  - Added unit tests for service and controller (all passing)

## In Progress
- CORE-003: API Gateway Rate Limiting

## Planned
- EVT-001: Set Up EventBus Architecture
- MON-004: Observability Setup (local logging, later Prometheus stack)
- EXT-005: Stub MICEN Adapter

## Sprint: Foundation Setup (Week 2)

### 🚀 In Progress
- Linter issues cleanup underway
- AppointmentService: Expanding AppointmentType enum
- AppointmentService: Migrating persistence to Supabase database
- API Gateway: Configuring rate limiter and CORS rules

### 📝 Planned
- SignatureService initial module structure
- EventBus internal event flow preparation
- MICENAdapter stub preparation

### 🛑 Blockers / Issues
- Need final confirmation of PDP interface specs (v1.0 draft shared)

### 📈 Observability & Logs
- Audit logging operational across auth and appointment
- Local log ingestion functional
- Full monitoring stack (Prometheus/Grafana) planned for Sprint 3

- AUTH-004: Implement JWT Strategy
  - ✅ Strategy class and guard wired in NestJS Auth module
  - ✅ Fixed runtime issue with missing JWT strategy registration
  - ✅ TDD-driven implementation complete (unit + integration)
  - ✅ JWT validation with Supabase tokens working
  - ✅ Audit logging for auth success/failure implemented
  - ✅ Protected routes working with JwtAuthGuard

- ✅ DEV-001: Seed Script (Appointment + Signature)
  - Created a reusable development seed script
  - Authenticates with Supabase, fetches JWT token
  - Sends valid POST requests to /appointments and /signature
  - Logs audit trail on all calls (success and failure)
  - Responses saved to local files for testing
