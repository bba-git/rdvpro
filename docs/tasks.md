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
## APPT-001: Implement Appointment Service\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ### Cursor Prompt\
Use: "Implement the AppointmentService with DI, metrics, and audit logs."\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 Status: \uc0\u55357 \u56999  In Progress\
Priority: High\
Dependencies: AUTH-001\
\
### Requirements\
- Create, update, cancel appointments\
- Emit audit log on each action\
- Basic availability slots (hardcoded)\
\
### Acceptance Criteria\
1. Authenticated users can manage appointments\
2. Audit log stored in LoggerSystem\
3. Service exposes metrics and health endpoints\
\
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