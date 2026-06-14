# OpenBank NG

Complete fullstack banking and wallet platform for Nigeria.

OpenBank NG is a commercial source-code product for fintech founders, agencies, developers, cooperatives, and licensed operators who need a serious Nigerian banking/wallet platform foundation.

This product is software only. Buyers are responsible for licensing, regulatory approval, banking/payment partners, production security audits, KYC/AML provider setup, and live payment rail authorization.

## Product Scope

OpenBank NG is designed as a complete end-to-end platform:

- Customer banking app
- Admin operations dashboard
- Backend API
- PostgreSQL database
- Double-entry ledger
- Wallet/account system
- Nigerian bank directory and bank-code support
- NGN/kobo money handling
- KYC workflow with BVN/NIN-ready fields
- Tiered limits
- Transfer and funding workflows
- Provider adapter layer
- Transaction receipts
- Reconciliation support
- Audit logs
- Sales, setup, and release documentation

## Apps And Services

```text
apps/
  customer-web/        Customer-facing banking app
  admin-web/           Back-office operations dashboard
services/
  api/                 Backend API and banking domain services
packages/
  shared/              Shared types, constants, validation schemas
docs/
  Product, architecture, compliance, and buyer documentation
sales/
  Sales-page copy, pricing rationale, buyer FAQ
release/
  Commercial release checklist and audit notes
```

## Nigerian Banking Orientation

OpenBank NG is structured around Nigerian fintech requirements:

- Naira-native balances stored in kobo
- Nigerian bank codes and account lookup adapter design
- NUBAN-style account-number generation support
- BVN/NIN-ready onboarding flow
- KYC tiering
- NIP/NIBSS-style transaction status model
- Provider adapters for Paystack, Monnify, Flutterwave, bank sponsors, and sandbox rails

## Commercial Boundary

OpenBank NG does not provide:

- A banking license
- Direct NIBSS access
- Regulated payment processing rights
- Production KYC/AML approval
- Legal or compliance certification

The buyer must connect licensed providers and complete legal, compliance, security, and regulatory review before live use.

## Development Status

Initial product blueprint and GitHub-ready structure are in progress.

See:

- [Product Blueprint](./docs/PRODUCT_BLUEPRINT.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Nigeria Banking Model](./docs/NIGERIA_BANKING_MODEL.md)
- [Release Checklist](./release/RELEASE_CHECKLIST.md)
- [Sales Page Copy](./sales/SALES_PAGE_COPY.md)
