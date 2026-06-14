# OpenBank NG Setup Guide

This guide helps buyers run OpenBank NG locally for evaluation, customization, and provider-integration planning.

## Requirements

- Node.js 20 or newer.
- npm 10 or newer.
- PostgreSQL 15 or newer for database-backed development.
- Redis is recommended for production queues, rate limits, and background jobs.

The current sandbox API runs with in-memory repositories so buyers can inspect the system before provisioning infrastructure.

## Local Setup

```bash
npm install
cp .env.example .env
npm run build
npm test
```

## Run The Apps

```bash
npm run dev
```

Default local URLs:

- Customer web: `http://localhost:3000`
- Admin web: `http://localhost:3001`
- API: `http://localhost:4000`

If a port is already in use, set the service-specific port in the matching app or service configuration before running.

## Database Setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to the buyer's database connection string.
4. Apply migrations from `db/migrations/` in numeric order.
5. Replace sandbox repositories with the PostgreSQL repository implementation as needed.

The first migration is:

```text
db/migrations/001_core_banking_schema.sql
```

## Sandbox Credentials

The sandbox seed data includes:

- Customer: `adaeze@example.com`
- Admin operations manager: `ops@openbankng.example`
- Admin compliance officer: `compliance@openbankng.example`
- Sandbox OTP code: `123456`

Passwords are accepted only by the sandbox login boundary. Production buyers must connect a real password/PIN hashing and identity provider flow before live use.

## First Verification

Run:

```bash
npm run build
npm test
```

Then smoke-check:

- `GET /health`
- `POST /v1/auth/customer/login`
- `GET /v1/customers`
- `POST /v1/security/otp-challenges`
- `POST /v1/transfers`
- `GET /v1/admin/transfers/review-queue`

## Production Replacement Points

Before live use, buyers must replace or complete:

- Password and PIN hashing.
- JWT signing and refresh-token rotation.
- PostgreSQL repository wiring.
- Redis-backed rate limits and queues.
- OTP provider.
- Notification provider.
- KYC provider.
- Funding and payout providers.
- Webhook signature verification.
- Monitoring and alerting.
- Legal, compliance, security, and regulatory review.
