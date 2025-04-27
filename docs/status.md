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

## In Progress
- APPT-001: Appointment Service
- CORE-003: API Gateway Rate Limiting

## Planned
- MON-004: Observability Setup (local logging, later Prometheus stack)
- EXT-005: Stub MICEN Adapter

## Sprint: Foundation Setup (Week 1)

### 🚀 In Progress
- AuthService fully operational
- AppointmentService: Interfaces and DB schema defined
- API Gateway: Configuring rate limiter and CORS rules

### 📝 Planned
- SignatureService integration (next sprint)
- EventBus connectivity for async flows
- MICENAdapter stub (external interface)

### 🛑 Blockers / Issues
- Need final confirmation of PDP interface specs (v1.0 draft shared)

### 📈 Observability & Logs
- Local log ingestion functional
- Full monitoring stack (Prometheus/Grafana) planned, not yet started
