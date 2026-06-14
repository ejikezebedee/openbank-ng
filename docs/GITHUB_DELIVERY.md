# GitHub Delivery Guide

## Repository

```text
https://github.com/ejikezebedee/openbank-ng
```

Current delivery branch:

```text
main
```

## Delivery Status

OpenBank NG is private and ready for buyer evaluation after Phase 7. Public release or marketplace sale still requires MD approval.

## Required GitHub Settings Before Public Release

- Keep repository private until approved.
- Add final license file when MD selects the commercial license.
- Add repository description:
  - `Fullstack Nigerian banking and wallet source-code platform.`
- Add topics:
  - `fintech`
  - `nigeria`
  - `banking`
  - `wallet`
  - `nextjs`
  - `nodejs`
  - `postgresql`
- Disable public issues until support policy is finalized, or use issue templates.
- Protect `main` before adding external collaborators.
- Require pull request review before merge if a team starts contributing.

## Buyer Review Flow

1. Share repository access with the approved buyer or reviewer only.
2. Direct them to `README.md`.
3. Direct technical reviewers to `docs/SETUP_GUIDE.md` and `docs/API_REFERENCE.md`.
4. Direct commercial reviewers to `sales/SALES_PAGE_COPY.md` and `docs/BUYER_HANDOFF.md`.
5. Direct security reviewers to `SECURITY.md`, `docs/DEPLOYMENT_GUIDE.md`, and `release/FINAL_RELEASE_AUDIT.md`.

## Release Tag Plan

Suggested tag after final approval:

```text
v0.1.0-package-candidate
```

Suggested release title:

```text
OpenBank NG v0.1.0 Package Candidate
```

## Release Description

Use `docs/RELEASE_NOTES.md` as the release description source.

## Do Not Publish Before

- MD approval.
- Final license selection.
- Final price confirmation.
- Final buyer support scope.
- Final repository visibility decision.
