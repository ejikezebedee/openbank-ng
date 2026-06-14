# OpenBank NG API Reference

Base URL in local development:

```text
http://localhost:4000
```

All money amounts are integer kobo. `100000` means NGN 1,000.00.

## Health And Product

### `GET /health`

Returns service health.

### `GET /v1/product`

Returns product identity, market, currency, and commercial boundary.

## Authentication

### `POST /v1/auth/customer/login`

Body:

```json
{
  "email": "adaeze@example.com",
  "password": "password123"
}
```

Returns customer profile and sandbox bearer session. Production buyers must replace the sandbox token with a real JWT/session provider.

### `POST /v1/auth/admin/login`

Body:

```json
{
  "email": "ops@openbankng.example",
  "password": "password123"
}
```

Returns admin profile and sandbox bearer session.

## Customers And Accounts

### `GET /v1/customers`

Returns seed customers.

### `GET /v1/customers/:customerId/accounts`

Returns customer accounts.

## Beneficiaries

### `GET /v1/customers/:customerId/beneficiaries`

Lists active and disabled beneficiaries for a customer.

### `POST /v1/beneficiaries`

Body:

```json
{
  "customerId": "cus_001",
  "name": "Chinedu Okeke",
  "accountNumber": "0123456789",
  "bankCode": "000027"
}
```

### `DELETE /v1/customers/:customerId/beneficiaries/:beneficiaryId`

Disables a beneficiary.

## Security

### `POST /v1/security/devices/trust`

Body:

```json
{
  "customerId": "cus_001",
  "label": "Primary phone",
  "fingerprint": "buyer-device-fingerprint"
}
```

### `POST /v1/security/otp-challenges`

Body:

```json
{
  "customerId": "cus_001",
  "purpose": "transfer",
  "targetId": "acct_001"
}
```

Sandbox response includes a challenge ID. Production buyers must deliver OTP codes through an approved provider.

### `POST /v1/security/otp-challenges/:challengeId/verify`

Body:

```json
{
  "code": "123456"
}
```

## Transfers

### `GET /v1/transfers`

Lists transfers.

### `POST /v1/transfers`

Body:

```json
{
  "sourceAccountId": "acct_001",
  "amountKobo": 120000,
  "beneficiaryName": "Chinedu Okeke",
  "beneficiaryAccountNumber": "0123456789",
  "beneficiaryBankCode": "000027",
  "narration": "Invoice payment",
  "channel": "nip_mock",
  "idempotencyKey": "unique-transfer-key-0001",
  "customerDeviceId": "dev_001",
  "otpChallengeId": "otp_seed_transfer"
}
```

Possible statuses:

- `successful`
- `failed`
- `requires_review`
- `reversed`

High-risk transfers enter `requires_review` and wait for admin release or rejection.

## Statements

### `GET /v1/accounts/:accountId/statement?from=2026-01-01&to=2026-12-31`

Returns opening balance, closing balance, total debits, total credits, and ledger entries.

## Admin Operations

Admin protected sandbox routes use the `x-admin-id` header. Production buyers must replace this with real admin auth middleware.

### `GET /v1/admin/users`

Lists admin users.

### `GET /v1/admin/audit-events`

Lists audit events.

### `GET /v1/admin/kyc-reviews`

Lists KYC review cases.

### `POST /v1/admin/accounts/:accountId/freeze`

Header:

```text
x-admin-id: adm_002
```

Body:

```json
{
  "reason": "Compliance review requested"
}
```

### `POST /v1/admin/accounts/:accountId/unfreeze`

Same body as freeze.

### `POST /v1/admin/customers/:customerId/kyc-decision`

Body:

```json
{
  "decision": "approved",
  "approvedTier": "tier_2",
  "reason": "Documents verified"
}
```

### `GET /v1/admin/transfers/review-queue`

Lists transfers waiting for manual risk review.

### `POST /v1/admin/transfers/:transferId/release`

Releases a held transfer and posts the ledger debit.

### `POST /v1/admin/transfers/:transferId/reject`

Body:

```json
{
  "reason": "Customer confirmation failed"
}
```

### `POST /v1/admin/transfers/:transferId/reverse`

Reverses a successful transfer through a credit ledger entry.

## Notifications

### `GET /v1/notifications?customerId=cus_001`

Lists queued notification records for a customer.

## Reference Data

### `GET /v1/reference/banks`

Lists supported Nigerian bank codes.
