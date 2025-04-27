# Current Tasks for HPV Platform Sprint 1\
> 
\f1 \uc0\u9888 \u65039 
\f0  NOTE: Cursor parses this file to identify active sprint tasks and track context before implementing any code.\
\
## AUTH-001: Set up Authentication Service\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ### Cursor Prompt\
Use: "Implement the AppointmentService with DI, metrics, and audit logs."\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Status: \uc0\u55357 \u56999  In Progress\
Priority: High\
Dependencies: None\
\
### Requirements\
- JWT-based authentication\
- OAuth2 provider stub\
- Logging of login attempts\
- RBAC middleware/guard\
- Unit tests for all public methods\
- Expose /health and /metrics endpoints\
\
### Acceptance Criteria\
1. Users can log in via API\
2. JWT issued with correct claims\
3. Logs written for login success/failure\
4. Role guards protect restricted endpoints\
5. Prometheus metrics exposed and logs sent to Azure\
\
---\
\
## AUTH-002: Forgot Password (Password Reset Request)
Status: Not Started
Priority: Medium
Dependencies: AUTH-001 must be completed first

### Requirements
- Create POST /auth/forgot-password endpoint
- Accept user email using ForgotPasswordDto
- Validate email format using class-validator
- Call Supabase password reset function internally
- Log reset request to audit_log (user_id or email + status)
- Do not disclose if the email exists or not (security best practice)

### Acceptance Criteria
1. Valid email triggers password reset email via Supabase
2. Invalid email format returns 400 Bad Request
3. Missing email returns 400 Bad Request
4. All reset requests are logged into audit_log
5. Always respond with 202 Accepted even if email is unknown
6. Proper structured error handling (no leakage of user info)

### Technical Notes
- Use ValidationPipe for DTO validation
- Mock SupabaseClient and AuditLogService in unit tests
- Follow TDD (tests first, then implementation)
- Respect structure defined in technical.md and .cursorcontext.md

## AUTH-003: Forgot Password Rate Limiting
Status: Completed
Priority: High
Dependencies: AUTH-002 must be completed first

### Requirements
- Implement rate limiting for the POST /auth/forgot-password endpoint
- Prevent brute force attacks and abuse of password reset feature
- Limit: 5 requests per hour per IP address
- Return 429 Too Many Requests when limit is exceeded
- Log rate limit blocks into audit_log
- Apply security best practices (no disclosure of user existence)

### Completed Implementation
- Created custom RateLimitGuard with IP-based tracking
- Applied rate limit only on /auth/forgot-password
- Implemented in-memory rate limiting with auto-cleanup
- Integrated audit logging for block events
- Covered with unit tests and integration tests following TDD
- Followed clean architecture and error handling best practices

# Current Sprint Tasks (Foundation Week 2)

## TECH-001: Fix Linter Warnings
Status: Completed
Priority: High
Dependencies: None

### Requirements
- Fix all TypeScript and NestJS linter warnings
- Ensure clean build and clean test run (no warnings)

### Completed Implementation
- Fixed all TypeScript type errors in auth and appointment services
- Corrected audit logging method signatures across the codebase
- Fixed Supabase client mock in test files
- Ensured clean build with `npm run build`
- Maintained 100% test coverage while fixing issues
- No functional changes made, only type fixes and linter improvements

### Acceptance Criteria
1. ✅ No warnings during `npm run build`
2. ✅ No warnings during `npm run test`
3. ✅ No IDE linter squiggles

---

## APPT-002: Extend Appointment Types
Status: Planned
Priority: High
Dependencies: None

### Requirements
- Update AppointmentType enum
- Accept new types: consultation, signature, delivery, administrative, urgent-signature
- Validate types properly via DTO
- Update unit and integration tests

### Acceptance Criteria
1. New types accepted and validated
2. All tests updated and passing
3. Audit logging unchanged

---

## APPT-003: Implement Supabase Persistence for Appointments
Status: Planned
Priority: High
Dependencies: APPT-002

### Requirements
- Create `appointments` table in Supabase
- Save appointment data into DB
- Update AppointmentService accordingly
- Handle Supabase errors properly
- Update unit/integration tests with mocks

### Acceptance Criteria
1. Appointments persisted in Supabase
2. Creation endpoint returns persisted appointment
3. Audit logging records database success/failure
4. All tests updated and passing

---

## SIGN-001: Prepare Signature Module Skeleton
Status: Planned
Priority: Medium
Dependencies: None

### Requirements
- Create SignatureService, SignatureController, SignatureModule
- Create Signature DTOs if needed
- Protect endpoints with JWT guard

### Acceptance Criteria
1. Signature module structure created
2. Compilation and basic tests passing
3. No business logic yet (skeleton only)

---

## EVT-001: Set Up EventBus Architecture
Status: Planned
Priority: Medium
Dependencies: None

### Requirements
- Create lightweight event bus system
- Allow AppointmentService and SignatureService to publish events
- Basic async event flow working (e.g., appointment.created)

### Acceptance Criteria
1. EventBus module ready
2. Appointment events emitted properly
3. Signature events stubbed for future expansion

---

---\
\
## CORE-003: API Gateway Rate Limiting\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ### Cursor Prompt\
Use: "Implement the AppointmentService with DI, metrics, and audit logs."\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Status: \uc0\u55357 \u56999  In Progress\
Priority: Medium\
Dependencies: AUTH-001\
\
### Requirements\
- Rate limit by IP and User ID\
- Log all throttled requests\
\
### Acceptance Criteria\
1. Public APIs are protected by rate limiting\
2. Blocked access is logged with metadata\
\
---\
\
## MON-004: Prometheus and Grafana Setup\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ### Cursor Prompt\
Use: "Implement the AppointmentService with DI, metrics, and audit logs."\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Status: \uc0\u55357 \u56604  Planned\
Priority: High\
Dependencies: None\
\
### Requirements\
- Export metrics from all services\
- Provision dashboards per service\
- Integrate with Azure Log Analytics\
\
### Acceptance Criteria\
1. Grafana accessible at public endpoint\
2. Dashboards auto-generated from templates\
3. Metrics ingestion confirmed\
\
---\
\
## EXT-005: Stub MICEN Adapter\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ### Cursor Prompt\
Use: "Implement the AppointmentService with DI, metrics, and audit logs."\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Status: \uc0\u55357 \u56604  Planned\
Priority: Medium\
Dependencies: CORE-003\
\
### Requirements\
- Provide interface to MICEN\
- Log all submission attempts\
- Handle simulated responses\
\
### Acceptance Criteria\
1. MICENAdapter responds with stub data\
2. Logs track each outgoing attempt\
3. Ready for real integration in Sprint 2}