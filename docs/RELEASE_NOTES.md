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
- Setup, deployment, API, troubleshooting, demo, buyer handoff, sales, Gumroad listing, buyer FAQ, launch assets, post-purchase email, support policy, pricing, commercial terms, and release checklist documentation.
- Changelog, security policy, package manifest, GitHub delivery guide, and final release audit.
- Marketplace launch checklist, buyer fulfillment checklist, commercial decision record, and buyer access SOP for public-sale and delivery readiness review.
- Marketplace product cover image for Gumroad, GitHub, sales-page, and launch-post use.
- Phase 13 commercial product integrity audit with implemented-vs-hardening boundary.

### Verification

- Build passes.
- Automated tests pass.
- API smoke tests have covered customer auth, beneficiaries, statements, OTP, device trust, transfer risk hold, admin release, and notifications.
- Buyer-facing documentation uses portable paths and states the commercial compliance boundary.
- Marketplace listing materials state the software-only boundary and public-sale approval gate.
- Buyer fulfillment materials state the access, support, and compliance boundaries.
- Commercial decision materials keep price, license, refund, support, and access decisions gated by MD approval.
- Product cover image avoids regulated-institution logos and approval claims.
- Buyer-facing positioning has been corrected from broad "complete platform"
  language to Nigerian banking and wallet infrastructure foundation.

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
- True production double-entry ledger enforcement.
- Reconciliation reports against licensed provider settlement records.
- Dispute/refund case management for merchant workflows.
- Monitoring, logging, incident response, and backup procedures.
- Legal, compliance, security, and provider approvals.
