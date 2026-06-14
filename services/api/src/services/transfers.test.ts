import assert from "node:assert/strict";
import test from "node:test";
import { store } from "../data/store.js";
import { createTransfer, reverseTransfer } from "./transfers.js";

test("creates a transfer once for the same idempotency key", () => {
  const beforeCount = store.transfers.length;
  const instruction = {
    sourceAccountId: "acct_001",
    amountKobo: 100_000,
    beneficiaryName: "Test Beneficiary",
    beneficiaryAccountNumber: "0123456789",
    beneficiaryBankCode: "000027",
    narration: "Automated test transfer",
    channel: "nip_mock" as const,
    idempotencyKey: "automated-test-key-0001",
    customerDeviceId: "dev_001",
    otpChallengeId: "otp_seed_transfer",
  };

  const first = createTransfer(instruction);
  const second = createTransfer(instruction);

  assert.equal(first.id, second.id);
  assert.equal(first.status, "successful");
  assert.equal(store.transfers.length, beforeCount + 1);
});

test("reverses a successful transfer with a credit ledger entry", () => {
  const transfer = createTransfer({
    sourceAccountId: "acct_001",
    amountKobo: 200_000,
    beneficiaryName: "Reversal Beneficiary",
    beneficiaryAccountNumber: "0123456789",
    beneficiaryBankCode: "000027",
    narration: "Automated reversal transfer",
    channel: "nip_mock",
    idempotencyKey: "automated-test-key-0002",
    customerDeviceId: "dev_001",
    otpChallengeId: "otp_seed_transfer",
  });

  const reversed = reverseTransfer(transfer.id, "Automated reversal test", "adm_001");
  const reversalLedger = store.ledgerEntries.find((entry) => entry.transactionId === `${transfer.id}_reversal`);

  assert.equal(reversed.status, "reversed");
  assert.equal(reversalLedger?.entryType, "credit");
  assert.equal(reversalLedger?.amountKobo, transfer.amountKobo);
});

test("holds risky transfers for manual security review", () => {
  const transfer = createTransfer({
    sourceAccountId: "acct_001",
    amountKobo: 300_000,
    beneficiaryName: "Risk Review Beneficiary",
    beneficiaryAccountNumber: "0123456789",
    beneficiaryBankCode: "000027",
    narration: "Risk review transfer",
    channel: "nip_mock",
    idempotencyKey: "automated-test-key-risk-0003",
  });

  assert.equal(transfer.status, "requires_review");
  assert.equal(transfer.riskLevel, "high");
  assert.deepEqual(transfer.riskReasons, ["untrusted_device", "otp_not_verified"]);
});
