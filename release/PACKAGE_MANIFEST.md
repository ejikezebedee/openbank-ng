# OpenBank NG Package Manifest

## Root

- `README.md` - Product overview and documentation index.
- `CHANGELOG.md` - Release history.
- `SECURITY.md` - Security policy and production warnings.
- `.env.example` - Portable local environment template.
- `package.json` - Workspace scripts.

## Apps

- `apps/customer-web/` - Customer banking interface.
- `apps/admin-web/` - Admin operations console.

## API And Shared Code

- `services/api/` - Backend API and banking domain services.
- `packages/shared/` - Shared banking types, constants, and helpers.

## Database

- `db/README.md` - Database notes.
- `db/migrations/001_core_banking_schema.sql` - PostgreSQL-compatible schema.

## Documentation

- `docs/PRODUCT_BLUEPRINT.md`
- `docs/ARCHITECTURE.md`
- `docs/NIGERIA_BANKING_MODEL.md`
- `docs/STANDARD_CHARTERED_BENCHMARK.md`
- `docs/API_REFERENCE.md`
- `docs/SETUP_GUIDE.md`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/TROUBLESHOOTING.md`
- `docs/BUYER_HANDOFF.md`
- `docs/DEMO_VIDEO_SCRIPT.md`
- `docs/LICENSE_TERMS_DRAFT.md`
- `docs/RELEASE_NOTES.md`
- `docs/GITHUB_DELIVERY.md`
- `docs/ROADMAP.md`

## Phase Reports

- `docs/PHASE-002-BANKING-CORE.md`
- `docs/PHASE-003-OPERATIONS-COMPLIANCE.md`
- `docs/PHASE-004-REPOSITORIES-TESTS-CUSTOMER-BANKING.md`
- `docs/PHASE-005-SECURITY-RISK-NOTIFICATIONS.md`
- `docs/PHASE-006-BUYER-PACKAGE.md`
- `docs/PHASE-007-GITHUB-DELIVERY.md`
- `docs/PHASE-008-MARKETPLACE-LAUNCH.md`

## Sales And Release

- `sales/SALES_PAGE_COPY.md`
- `sales/GUMROAD_LISTING.md`
- `sales/BUYER_FAQ.md`
- `sales/LAUNCH_ASSETS.md`
- `release/RELEASE_CHECKLIST.md`
- `release/FINAL_RELEASE_AUDIT.md`
- `release/PACKAGE_MANIFEST.md`
- `release/MARKETPLACE_LAUNCH_CHECKLIST.md`

## Excluded From Buyer Package

- `node_modules/`
- `dist/`
- `.next/`
- `.env`
- Local logs.
- Local temporary files.
- Any production secrets.
