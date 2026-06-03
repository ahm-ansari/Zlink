# ZawajLink (زواج لينك)

**Project Title:** ZawajLink - Matrimonial Broker Management Portal  
**Version:** 1.3  
**Date:** May 26, 2026  
**Prepared for:** Abulhassan  
**Positioning:** Empowering Brokers, Connecting Destinies

ZawajLink is a secure, culturally sensitive SaaS web portal for matrimonial brokers, marriage bureaus, and mediate agents in Qatar and the GCC region. It helps brokers manage client biodata, search and match bride/groom profiles, track proposals, protect privacy, and operate their business from a bilingual web dashboard.

## Stack

- Frontend: Next.js, React, Lucide icons
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Target UX: Mobile-first, bilingual Arabic + English, RTL-ready

## Current Implementation

- Broker registration/login API with signed token authentication scaffolding
- Versioned REST API at `/api/v1`
- OpenAPI document at `/api/v1/openapi.json`
- WebSocket messaging endpoint at `/ws/messages`
- Short-lived access tokens and refresh-token storage
- Role-ready backend architecture for Broker, Admin, Support, and Limited Client View
- Request validation, rate limiting, audit logging, and field-encryption helpers
- Broker-facing dashboard with operational metrics
- Client biodata CRUD API and UI
- Qatar/GCC-aware profile fields: nationality, residence country, family background, privacy level, verification status, service fee, payment status
- Advanced filtering by gender, status, and lead pipeline stage
- Saved searches and match-alert data model
- AI-assisted rule-based compatibility score with explainable reasons
- Proposal workflow with message moderation support
- Appointment scheduling API
- Broker verification API
- Subscription plan API for SaaS billing
- Notification queue API for in-app, SMS, email, and WhatsApp integrations
- CSV profile import/export endpoints
- Seed script for demo profiles

## Database Notes

The implementation uses MongoDB as requested earlier. BRD v1.3 PostgreSQL notes are mapped as MongoDB equivalents:

- UUID primary keys: `uuid` field on core collections
- Soft deletes: `deletedAt` field on core collections
- JSONB preferences: nested `preferences` object
- Search indexes: age, gender, nationality, religion, status, broker, and deleted fields
- Age trigger: application-level age calculation from `dateOfBirth`
- pgcrypto: AES-GCM field-encryption helper for sensitive profile fields

## Product Scope

### In Scope

- Broker registration and verification foundation
- Comprehensive bride/groom biodata management
- Advanced search and match suggestions
- Proposal and appointment workflow model
- Broker CRM pipeline: New, Contacted, Meeting, Proposal, Outcome
- Admin-ready data models for moderation, plans, verification, and disputes
- Multi-channel notification readiness through API structure
- Analytics-ready dashboard metrics

### Phase 1 Out of Scope

- Native mobile apps
- Direct client-to-client matching bypassing brokers
- Video calling and live matchmaking events
- Horoscope integration
- Full international compliance beyond GCC focus

## Setup

```bash
npm install
copy .env.example .env
```

Update `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/zawajlink
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the backend and frontend:

```bash
npm run seed --workspace backend
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`  
API Base: `http://localhost:5000/api/v1`

## API

- `GET /api/health`
- `GET /api/v1/openapi.json`
- `GET /api/dashboard`
- `GET /api/profiles`
- `GET /api/profiles/search`
- `POST /api/profiles`
- `GET /api/profiles/:id`
- `PUT /api/profiles/:id`
- `DELETE /api/profiles/:id`
- `GET /api/matches/:id`
- `POST /api/auth/register-broker`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/brokers`
- `PATCH /api/brokers/:id/verification`
- `GET /api/proposals`
- `POST /api/proposals`
- `PUT /api/proposals/:id`
- `GET /api/proposals/:id/messages`
- `POST /api/proposals/:id/messages`
- `PATCH /api/messages/:messageId/moderation`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/subscription-plans`
- `POST /api/subscription-plans`
- `GET /api/reports/broker`
- `GET /api/reports/platform`
- `GET /api/saved-searches`
- `POST /api/saved-searches`
- `GET /api/notifications`
- `POST /api/notifications`
- `GET /api/profiles-export`
- `POST /api/profiles-import`

All business endpoints are also mounted under `/api/v1`.

## Deployment & Operations Readiness

- Development, staging, and production configuration through `.env`
- Request IDs and audit logs for sensitive actions
- Rate limiting and validation middleware
- Docker/GitHub Actions-ready workspace scripts
- Notification, billing, media, and AI integration boundaries ready for provider adapters

## Success Metrics

- Active ZawajLink brokers
- Average clients managed per broker
- Match success rate
- Monthly recurring revenue
- Retention and satisfaction scores
