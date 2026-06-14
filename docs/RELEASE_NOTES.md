# OpenBank NG Release Notes

## v0.1.0 Package Candidate

OpenBank NG is a fullstack Nigerian banking and wallet source-code package.

### Included

- Customer banking web app.
- Admin operations console.
- Backend API service.
- Shared banking domain package.
- PostgreSQL-compatible schema.
- NGN/kobo money handling.
- Nigerian bank-code support.
- BVN/NIN-ready KYC workflow.
- Account, ledger, transfer, reversal, statement, beneficiary, audit, risk, OTP, device, and notification workflows.
- Setup, deployment, API, troubleshooting, demo, buyer handoff, sales, and release checklist documentation.

### Verification

- Build passes.
- Automated tests pass.
- API smoke tests have covered customer auth, beneficiaries, statements, OTP, device trust, transfer risk hold, admin release, and notifications.
- Buyer-facing documentation uses portable paths and states the commercial compliance boundary.

### Known Production Gaps

The package is not a licensed bank and is not ready for live regulated use without buyer work.

Production buyers must complete:

- Real auth and password/PIN hashing.
- PostgreSQL repository wiring.
- Redis-backed queues and rate limits.
- KYC provider integration.
- OTP and notification provider integration.
- Funding and payout provider integration.
- Webhook signature verification.
- Monitoring, logging, incident response, and backup procedures.
- Legal, compliance, security, and provider approvals.
