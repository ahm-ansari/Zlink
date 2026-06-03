# ZawajLink Component Design v1.3

## Frontend Modules

- Auth Module: login, broker registration, broker verification readiness
- Dashboard: overview, quick stats, recent records, proposal operations
- Profile Management: rich biodata intake for Qatar/GCC brokers
- Search and Matchmaking: advanced filters, saved searches, explainable suggestions
- Messaging: moderated real-time message workflow over WebSocket
- Broker CRM: pipeline, reports, appointments, payment status
- Admin Panel: broker verification, plans, moderation-ready controls

## Backend Modules

- Auth Service: password hashing, JWT access token, refresh token storage
- Broker Service: verification and subscription relationship
- Profile Service: biodata CRUD, search, import/export, soft delete
- Matching Engine Service: AI-ready compatibility scoring boundary
- Communication Service: proposals, messages, moderation, WebSocket
- Billing and Subscription Service: plan management
- Notification Service: queue for In-App, SMS, Email, WhatsApp
- Admin Service: broker verification, reports, moderation endpoints

## API Design

Base URL: `/api/v1`

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /profiles`
- `GET /profiles/search`
- `GET /matches/:id`
- `POST /proposals`
- `POST /proposals/:id/messages`
- `GET /reports/broker`
- `GET /openapi.json`

## Security

- JWT access tokens with short expiry
- Refresh-token persistence and revocation
- RBAC middleware foundation
- Rate limiting
- Request validation
- Audit logging for sensitive actions
- Soft deletes for retention
- Field-encryption helper for sensitive profile fields

## Integrations

- Payment: Stripe / HyperPay via subscription service boundary
- SMS: Twilio / Ooredoo via notification queue
- Email: SendGrid / AWS SES via notification queue
- AI: OpenAI-ready matching service boundary
- Storage: Cloudinary-ready media fields and approval workflow
