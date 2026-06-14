import {
  findNigerianBank,
  isValidNubanLikeAccount,
  kycTierDailyLimitsKobo,
  type TransferInstruction,
  type TransferRecord,
} from "@openbank-ng/shared";
import { store } from "../data/store.js";
import { getAccount, postDebit } from "./ledger.js";

function makeReference(): string {
  return `OBNG${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function createTransfer(instruction: TransferInstruction): TransferRecord {
  const existingTransferId = store.idempotencyKeys.get(instruction.idempotencyKey);
  const existingTransfer = existingTransferId
    ? store.transfers.find((transfer) => transfer.id === existingTransferId)
    : undefined;

  if (existingTransfer) {
    return existingTransfer;
  }

  const account = getAccount(instruction.sourceAccountId);
  const customer = account ? store.customers.find((entry) => entry.id === account.customerId) : undefined;
  const transfer: TransferRecord = {
    ...instruction,
    id: `trf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "processing",
    reference: makeReference(),
    createdAt: new Date().toISOString(),
  };

  if (!account || !customer) {
    transfer.status = "failed";
    transfer.failureReason = "Source account or customer was not found.";
  } else if (account.status !== "active") {
    transfer.status = "requires_review";
    transfer.failureReason = "Source account is not active.";
  } else if (!isValidNubanLikeAccount(instruction.beneficiaryAccountNumber)) {
    transfer.status = "failed";
    transfer.failureReason = "Beneficiary account number must be 10 digits.";
  } else if (!findNigerianBank(instruction.beneficiaryBankCode)) {
    transfer.status = "failed";
    transfer.failureReason = "Beneficiary bank code is not supported.";
  } else if (instruction.amountKobo <= 0) {
    transfer.status = "failed";
    transfer.failureReason = "Amount must be greater than zero.";
  } else if (instruction.amountKobo > Number(kycTierDailyLimitsKobo[customer.kycTier])) {
    transfer.status = "requires_review";
    transfer.failureReason = "Transfer exceeds the customer's KYC tier daily limit.";
  } else if (account.availableBalanceKobo < instruction.amountKobo) {
    transfer.status = "failed";
    transfer.failureReason = "Insufficient available balance.";
  } else {
    postDebit(account, transfer.id, instruction.amountKobo, instruction.narration || "OpenBank NG transfer");
    transfer.status = "successful";
    transfer.completedAt = new Date().toISOString();
  }

  store.transfers.push(transfer);
  store.idempotencyKeys.set(instruction.idempotencyKey, transfer.id);
  return transfer;
}
