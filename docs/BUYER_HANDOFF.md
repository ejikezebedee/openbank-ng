# OpenBank NG Buyer Handoff

## What This Product Is

OpenBank NG is a commercial source-code platform for building Nigerian banking, wallet, cooperative finance, agency banking, and payment products.

## What The Buyer Receives

- Customer banking web app.
- Admin operations web app.
- Backend API service.
- Shared banking types and validation helpers.
- PostgreSQL-compatible schema.
- Ledger, transfer, KYC, risk, notification, and audit workflows.
- Buyer setup, deployment, API, troubleshooting, sales, and release documentation.

## Recommended First Review

1. Read `README.md`.
2. Read `docs/PRODUCT_BLUEPRINT.md`.
3. Run `docs/SETUP_GUIDE.md`.
4. Review `docs/API_REFERENCE.md`.
5. Review `docs/DEPLOYMENT_GUIDE.md`.
6. Review `release/RELEASE_CHECKLIST.md`.
7. Review `docs/LICENSE_TERMS_DRAFT.md`.

## Buyer Responsibilities

The buyer is responsible for:

- Banking/payment licensing.
- Regulated provider contracts.
- KYC/AML provider setup.
- Legal and compliance review.
- Production security audit.
- Production hosting.
- Monitoring and support operations.
- Final go-live approval.

## Customization Priorities

Highest priority:

- Replace sandbox auth with production auth.
- Wire PostgreSQL repositories.
- Connect OTP and notification providers.
- Connect KYC provider.
- Connect funding and payout providers.
- Implement webhook signature checks.
- Add Redis-backed queues and rate limits.

Next priority:

- Expand customer onboarding.
- Add transaction receipts.
- Add reconciliation exports.
- Add dispute case management.
- Add support ticket integration.
- Add production observability.

## Commercial Positioning

OpenBank NG should be sold as a serious fintech foundation, not as a licensed bank or instant live banking product.

Suggested positioning:

"A fullstack Nigerian banking and wallet source-code platform with customer app, admin console, API, ledger, KYC, transfer risk controls, and buyer-ready documentation."
