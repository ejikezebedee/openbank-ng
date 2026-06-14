# OpenBank NG Buyer Access SOP

## Status

Draft SOP for controlled buyer access. Requires MD approval before use.

## Access Method

Preferred method: private GitHub repository access.

Fallback method: packaged source archive through an approved marketplace or secure delivery channel.

## Access Steps

1. Confirm buyer payment.
2. Confirm buyer identity or company.
3. Confirm purchased package/tier.
4. Confirm license terms accepted.
5. Confirm refund policy accepted.
6. Confirm support scope accepted.
7. Send buyer access email from `sales/POST_PURCHASE_EMAILS.md`.
8. Grant private repository access or deliver approved package archive.
9. Record delivery in `release/BUYER_FULFILLMENT_CHECKLIST.md`.
10. Ask buyer to complete first-run verification.

## GitHub Access Controls

- Grant the least access needed.
- Prefer read-only collaborator access where available.
- Remove access if payment is reversed, license is breached, or access was granted in error.
- Do not make the repository public unless MD approves public visibility.

## Archive Delivery Controls

- Exclude `node_modules/`, build outputs, local environment files, logs, and temporary files.
- Include `.env.example`, docs, release files, sales/support docs, apps, services, packages, and database files.
- Run the commercial cleanup scan before packaging.
- Verify the archive can be extracted and inspected before delivery.

## Buyer Support Intake

Ask buyers to include:

- Package/tier.
- Node.js version.
- Operating system.
- Command used.
- Error output.
- App or service affected.
- Whether dependencies were freshly installed.

## Stop Conditions

Stop access or escalation if:

- Buyer requests regulated financial advice.
- Buyer requests live payment operations without proper provider approval.
- Buyer asks to remove compliance or security warnings.
- Buyer requests resale of the original source-code package.
- Buyer requests production launch claims that the package does not support.

