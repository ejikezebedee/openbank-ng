import type { OtpPurpose, TransferInstruction, TransferRiskAssessment } from "@openbank-ng/shared";
import { kycTierDailyLimitsKobo } from "@openbank-ng/shared";
import { store } from "../data/store.js";
import { appendAuditEvent } from "./audit.js";

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function registerTrustedDevice(customerId: string, label: string, fingerprint: string) {
  const existing = store.customerDevices.find(
    (device) => device.customerId === customerId && device.fingerprint === fingerprint,
  );
  const now = new Date().toISOString();

  if (existing) {
    existing.label = label;
    existing.trusted = true;
    existing.lastSeenAt = now;
    return existing;
  }

  const device = {
    id: makeId("dev"),
    customerId,
    label,
    fingerprint,
    trusted: true,
    lastSeenAt: now,
    createdAt: now,
  };

  store.customerDevices.push(device);
  appendAuditEvent({
    actorId: customerId,
    actorRole: "customer",
    action: "device.trusted",
    entityType: "customer_device",
    entityId: device.id,
    message: `Trusted device registered: ${label}.`,
  });

  return device;
}

export function createOtpChallenge(customerId: string, purpose: OtpPurpose, targetId?: string) {
  const challenge = {
    id: makeId("otp"),
    customerId,
    purpose,
    targetId,
    code: "123456",
    verified: false,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  store.otpChallenges.push(challenge);
  appendAuditEvent({
    actorId: customerId,
    actorRole: "customer",
    action: "otp.challenge_created",
    entityType: "otp_challenge",
    entityId: challenge.id,
    message: `OTP challenge created for ${purpose}.`,
  });

  return challenge;
}

export function verifyOtpChallenge(challengeId: string, code: string) {
  const challenge = store.otpChallenges.find((entry) => entry.id === challengeId);

  if (!challenge || challenge.code !== code || new Date(challenge.expiresAt).getTime() < Date.now()) {
    throw new Error("OTP challenge is invalid or expired.");
  }

  challenge.verified = true;
  challenge.verifiedAt = new Date().toISOString();
  appendAuditEvent({
    actorId: challenge.customerId,
    actorRole: "customer",
    action: "otp.challenge_verified",
    entityType: "otp_challenge",
    entityId: challenge.id,
    message: `OTP challenge verified for ${challenge.purpose}.`,
  });

  return challenge;
}

export function assessTransferRisk(instruction: TransferInstruction): TransferRiskAssessment {
  const account = store.accounts.find((entry) => entry.id === instruction.sourceAccountId);
  const customer = account ? store.customers.find((entry) => entry.id === account.customerId) : undefined;
  const trustedDevice = instruction.customerDeviceId
    ? store.customerDevices.find((device) => device.id === instruction.customerDeviceId && device.trusted)
    : undefined;
  const verifiedOtp = instruction.otpChallengeId
    ? store.otpChallenges.find((challenge) => challenge.id === instruction.otpChallengeId && challenge.verified)
    : undefined;

  let score = 0;
  const reasons: string[] = [];

  if (!trustedDevice) {
    score += 35;
    reasons.push("untrusted_device");
  }

  if (!verifiedOtp) {
    score += 25;
    reasons.push("otp_not_verified");
  }

  if (customer && instruction.amountKobo > Number(kycTierDailyLimitsKobo[customer.kycTier]) * 0.5) {
    score += 25;
    reasons.push("large_against_kyc_tier");
  }

  const recentSimilarTransfer = store.transfers.some(
    (transfer) =>
      transfer.sourceAccountId === instruction.sourceAccountId &&
      transfer.beneficiaryAccountNumber === instruction.beneficiaryAccountNumber &&
      transfer.amountKobo === instruction.amountKobo &&
      Date.now() - new Date(transfer.createdAt).getTime() < 10 * 60 * 1000,
  );

  if (recentSimilarTransfer) {
    score += 20;
    reasons.push("recent_similar_transfer");
  }

  const level = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";

  return {
    score,
    level,
    reasons,
    requiresOtp: !verifiedOtp || score >= 25,
    requiresManualReview: score >= 50,
  };
}
