# OpenBank NG Release Checklist

## Commercial Readiness

- [x] Clear title and positioning
- [x] Buyer pain point documented
- [x] Product promise documented
- [x] Target buyers documented
- [x] Pricing rationale included
- [x] Sales page copy included
- [x] FAQ included
- [ ] License terms selected
- [x] Buyer compliance notice included
- [x] License terms draft included

## Product Completeness

- [ ] Customer app implemented
- [ ] Admin app implemented
- [ ] Backend API implemented
- [ ] Database schema implemented
- [ ] Ledger engine implemented
- [ ] Provider adapter system implemented
- [ ] KYC workflow implemented
- [ ] Transaction lifecycle implemented
- [ ] Demo data included
- [x] Tests included
- [x] API docs included
- [x] Setup guide included
- [x] Deployment guide included

## Nigerian Banking Readiness

- [x] NGN/kobo money handling
- [x] Nigerian phone normalization
- [x] Nigerian bank code directory
- [x] NUBAN-style account-number support
- [x] BVN/NIN-ready KYC fields
- [x] KYC tier limits
- [x] NIP/NIBSS-style transfer statuses
- [ ] Funding provider adapter
- [ ] Payout provider adapter
- [ ] Webhook signature verification pattern
- [ ] Reconciliation workflow

## Security And Compliance Warnings

- [x] No hardcoded secrets
- [x] No private keys or tokens
- [x] No internal server paths
- [x] No local agent/workspace paths
- [x] No machine-specific home-directory paths
- [x] No private emails
- [x] No misleading banking-license claims
- [x] No GTBank or Standard Chartered branding/assets
- [x] Buyer compliance responsibilities stated
- [x] Production audit warning included

## GitHub Delivery Gate

- [x] Repository destination selected
- [x] Branch strategy selected
- [x] README complete
- [x] `.env.example` complete
- [x] Portable setup instructions
- [x] Tests or verification notes included
- [x] Release notes included
- [x] GitHub-ready locally
- [x] Changelog included
- [x] Security policy included
- [x] Package manifest included
- [x] Final release audit included
- [x] GitHub delivery guide included

## Phase 6 Release Audit Notes

- Buyer-facing setup, deployment, API, troubleshooting, handoff, demo, sales, and release checklist files are present.
- Documentation uses portable relative paths.
- Buyer compliance and production-security responsibilities are stated.
- Final public release remains gated by Phase 7 delivery polish and MD approval.

## Phase 7 Release Audit Notes

- GitHub delivery guide is present.
- Changelog is present.
- Security policy is present.
- Package manifest is present.
- Final release audit is present.
- Repository remains private unless MD approves a visibility change.
- Public release remains gated by final license, pricing, support, and buyer-access approval.
