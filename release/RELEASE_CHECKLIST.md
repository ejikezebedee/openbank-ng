# OpenBank NG Release Checklist

## Commercial Readiness

- [ ] Clear title and positioning
- [ ] Buyer pain point documented
- [ ] Product promise documented
- [ ] Target buyers documented
- [ ] Pricing rationale included
- [ ] Sales page copy included
- [ ] FAQ included
- [ ] License terms selected
- [ ] Buyer compliance notice included

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
- [ ] Tests included
- [ ] API docs included
- [ ] Setup guide included
- [ ] Deployment guide included

## Nigerian Banking Readiness

- [ ] NGN/kobo money handling
- [ ] Nigerian phone normalization
- [ ] Nigerian bank code directory
- [ ] NUBAN-style account-number support
- [ ] BVN/NIN-ready KYC fields
- [ ] KYC tier limits
- [ ] NIP/NIBSS-style transfer statuses
- [ ] Funding provider adapter
- [ ] Payout provider adapter
- [ ] Webhook signature verification pattern
- [ ] Reconciliation workflow

## Security And Compliance Warnings

- [ ] No hardcoded secrets
- [ ] No private keys or tokens
- [ ] No internal server paths
- [ ] No local agent/workspace paths
- [ ] No machine-specific home-directory paths
- [ ] No private emails
- [ ] No misleading banking-license claims
- [ ] No GTBank or Standard Chartered branding/assets
- [ ] Buyer compliance responsibilities stated
- [ ] Production audit warning included

## GitHub Delivery Gate

- [ ] Repository destination selected
- [ ] Branch strategy selected
- [ ] README complete
- [ ] `.env.example` complete
- [ ] Portable setup instructions
- [ ] Tests or verification notes included
- [ ] Release notes included
- [ ] GitHub-ready locally
