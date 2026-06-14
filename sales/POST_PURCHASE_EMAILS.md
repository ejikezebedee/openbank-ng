# OpenBank NG Post-Purchase Email Templates

## Buyer Access Email

Subject: OpenBank NG access and setup instructions

Hello,

Thank you for purchasing OpenBank NG.

Your package includes the OpenBank NG source-code platform, setup documentation, API reference, deployment guide, troubleshooting guide, buyer handoff notes, security policy, release checklist, and package manifest.

Start here:

1. Read `README.md`.
2. Follow `docs/SETUP_GUIDE.md`.
3. Review `docs/API_REFERENCE.md`.
4. Review `SECURITY.md`.
5. Review `release/RELEASE_CHECKLIST.md`.

Important: OpenBank NG is source-code software only. It is not a licensed bank, regulated payment processor, legal opinion, compliance certification, production security certification, or live payment-rail authorization. You are responsible for licensing, regulated providers, KYC/AML provider setup, legal/compliance review, production security audit, hosting, and go-live approval.

Regards,
OpenBank NG Delivery Team

## Buyer First-Run Follow-Up

Subject: OpenBank NG first-run checklist

Hello,

Please confirm these first-run checks:

- `npm install` completed.
- `npm run build` passed.
- `npm test` passed.
- `.env.example` was copied into your local `.env`.
- Customer app, admin app, and API were reviewed locally.

If anything fails, send the command used, the error output, your Node.js version, and which app or service failed.

Regards,
OpenBank NG Delivery Team

## Support Boundary Response

Subject: OpenBank NG support scope

Hello,

Thanks for the update.

The included support scope covers package access, setup documentation clarification, first-run troubleshooting, and guidance on where to customize the code.

The included support scope does not cover regulated provider approval, production legal/compliance review, production security certification, custom feature development, infrastructure management, or live payment-rail operations unless a separate paid customization or support agreement is approved.

Regards,
OpenBank NG Delivery Team

## Refund Policy Response

Subject: OpenBank NG refund request

Hello,

Thank you for contacting us.

OpenBank NG is a digital source-code package. Refund eligibility is limited to duplicate purchases, incorrect file delivery, or download/access issues that cannot be resolved.

Refunds do not cover buyer misunderstanding of licensing, regulated provider requirements, production readiness obligations, or custom implementation work when these conditions were stated before purchase.

We will review the request and respond with the final decision under the approved refund policy.

Regards,
OpenBank NG Delivery Team

