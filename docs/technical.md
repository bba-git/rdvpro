# Technical Specifications for HPV Platform\
\
## Backend Stack\
- **Language**: TypeScript\
- **Framework**: NestJS (Node.js)\
- **ORM**: TypeORM\
- **Transport**: RabbitMQ\
- **Monitoring**: Prometheus + Grafana (via exporters)\
- **Logging**: Structured JSON logs to Azure Monitor\
- **Metrics**: `/metrics` exposed for each service\
- **Authentication**: OAuth2 + JWT + optional Carte Real support\
\
## Core Principles\
- Dependency Injection in all services\
- Modular monorepo structure (Nx or Lerna)\
- Event-driven communication\
- All services emit structured logs with TraceID, UserID, Severity\
- Healthcheck endpoints: `/health`, `/metrics`\
- Rate-limiting and logging at gateway level\
\
## Audit & Logging Requirements\
- All mutations and actions must be logged\
- Correlation ID passed through all layers\
- Retry mechanisms required for inter-service communication\
- Logs must be parsable by Azure Log Analytics and Prometheus\
\
## Monitoring Requirements\
- Prometheus metrics exported at `/metrics`\
- Alerts defined for error rate, latency, failed logins\
- Grafana dashboards per service\
- Log retention: 7 days (dev), 30+ days (prod)\
\
## API Standards\
- OpenAPI/Swagger on all public endpoints\
- Request validation using `class-validator`\
- DTOs for all incoming payloads\
\
## Deployment & CI/CD\
- Containerized with Docker\
- Orchestrated via Kubernetes (Azure AKS preferred)\
- CI/CD via GitHub Actions or GitLab CI\
- Secret management via Azure Key Vault}