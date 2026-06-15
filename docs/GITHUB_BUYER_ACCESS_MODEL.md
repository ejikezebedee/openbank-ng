# OpenBank NG GitHub Buyer Access Model

## Purpose

This model lets buyers inspect enough proof to trust the product before payment while keeping full source-code access gated until payment, license acceptance, and buyer approval are complete.

## Recommended Repository Structure

Use two GitHub repositories:

1. `openbank-ng-preview`
   - Visibility: public or controlled private preview.
   - Purpose: buyer confidence, marketplace link, product proof, and pre-sale review.
   - Contains buyer-facing documentation, screenshots, product positioning, setup overview, sales copy, FAQ, release notes, package manifest, security caveats, and commercial terms draft.
   - Does not contain full implementation source, private delivery ZIP, secrets, internal logs, local runtime files, or buyer-specific access material.

2. `openbank-ng`
   - Visibility: private.
   - Purpose: paid buyer delivery and controlled source-code access.
   - Contains the full source package: customer app, admin app, backend API, shared package, database migration, docs, sales material, release audit, screenshots, and validated buyer ZIP/hash.
   - Buyer access is granted only after payment confirmation, accepted license terms, approved support scope, and delivery record creation.

## What Buyers See Before Payment

The preview repo should show:

- Product README and positioning.
- Marketplace product cover image.
- Customer and admin screenshots.
- Architecture overview.
- API reference summary.
- Setup guide summary.
- Release notes.
- Buyer FAQ.
- Gumroad or sales-page copy.
- Pricing packages.
- Support policy draft.
- Commercial limitations and regulated-production caveats.
- Final release audit summary.
- Package manifest showing what paid buyers receive.

The preview repo should not expose:

- Full app source code.
- Backend service implementation.
- Database internals beyond a high-level schema summary, unless intentionally approved.
- Private buyer ZIP.
- Paid-only templates or delivery files.
- Secrets, logs, runtime files, internal paths, or operational metadata.

## What Paid Buyers Receive

After payment and approval, the buyer receives:

- Private GitHub repository access to `openbank-ng`, or a private fork created for that buyer.
- The validated buyer ZIP and `.sha256` hash.
- Full source code for the customer web app, admin web app, backend API, shared banking package, database migration, buyer documentation, and release materials.
- Setup, troubleshooting, deployment, API, and handoff documentation.
- Support only within the approved support scope.

## Buyer Access Gate

Do not grant full repository access until all are true:

- Payment is confirmed.
- Buyer identity or company record is captured.
- License terms are accepted.
- Refund policy is accepted.
- Support scope is accepted.
- Delivery method is approved.
- Repository invitation target is confirmed.
- Delivery event is recorded.

## GitHub Release Plan

For the private paid repo:

1. Push the full source repository.
2. Tag the validated package as `v0.1.0-buyer-ready`.
3. Attach the validated ZIP and `.sha256` file to the private GitHub release if GitHub release delivery is approved.
4. Keep issues disabled or restricted unless paid support includes GitHub issue handling.
5. Keep discussions disabled unless community support is approved.

For the preview repo:

1. Publish only approved buyer-facing proof files.
2. Link to Gumroad or the approved sales page.
3. State clearly that full source access is delivered after payment and license approval.
4. Avoid live-bank, licensed-bank, or regulated-payment claims.

## Recommended Default

- Public preview repo: `openbank-ng-preview`
- Private paid repo: `openbank-ng`
- Paid access: private GitHub invite after payment and license acceptance.
- Release artifact: validated ZIP plus hash attached only inside the private repo.
- Buyer access: no unpaid full-source access.

