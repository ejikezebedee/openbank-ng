# OpenBank NG Database

This folder contains buyer-portable database artifacts for the commercial source-code package.

## Migration Order

1. `migrations/001_core_banking_schema.sql`

## Production Notes

- Use PostgreSQL or a compatible managed database.
- Encrypt or tokenize sensitive identity fields in production.
- Keep ledger writes inside database transactions.
- Keep audit-event writes append-only.
- Do not run this system with placeholder secrets.
- Buyers are responsible for licensing, compliance, hosting, bank-provider contracts, and operational controls.
