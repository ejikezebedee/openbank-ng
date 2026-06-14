# OpenBank NG Buyer FAQ

## Is OpenBank NG a licensed bank?

No. OpenBank NG is software source code only. The buyer must provide all required licenses, regulated partners, legal review, compliance approval, and payment-rail authorization.

## Can I use it for a client project?

Yes, subject to the final commercial license selected before sale. Agencies should confirm whether the purchased license permits one client project, multiple client projects, resale, or white-label delivery.

## Can I deploy it to production immediately?

No. Before production use, the buyer must complete provider integrations, production authentication, password/PIN hashing, database repository wiring, webhook verification, monitoring, security audit, legal review, compliance approval, and regulated partner approval.

## Does it include real NIBSS access?

No. It includes Nigerian banking workflow assumptions and provider adapter boundaries. The buyer must connect approved providers and payment rails.

## Does it include BVN or NIN verification?

It includes BVN/NIN-ready fields and KYC workflow structure. The buyer must connect licensed KYC/identity providers before live verification.

## What technical stack does it use?

The package uses a TypeScript monorepo with customer web, admin web, API service, shared banking package, and PostgreSQL-compatible schema documentation.

## What should I review first?

Start with `README.md`, `docs/SETUP_GUIDE.md`, `docs/API_REFERENCE.md`, `docs/DEPLOYMENT_GUIDE.md`, `SECURITY.md`, and `release/RELEASE_CHECKLIST.md`.

## What is the biggest buyer benefit?

The buyer starts with a structured fintech foundation that includes app surfaces, backend workflow boundaries, Nigerian banking primitives, and buyer-facing documentation.

## What is not included?

OpenBank NG does not include legal advice, banking license, production KYC/AML approval, live payment provider contracts, production security certification, hosted infrastructure, or guaranteed regulatory acceptance.

## What customization is expected?

Expected customization includes branding, production auth, PostgreSQL repository wiring, provider integrations, webhook signature checks, observability, support operations, compliance workflows, and deployment hardening.

