import type {
  AccountControlRecord,
  AdminUser,
  AuditEvent,
  BankAccount,
  CustomerProfile,
  KycReviewCase,
  LedgerEntry,
  TransferRecord,
} from "@openbank-ng/shared";

export interface OpenBankStore {
  customers: CustomerProfile[];
  accounts: BankAccount[];
  ledgerEntries: LedgerEntry[];
  transfers: TransferRecord[];
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  kycReviewCases: KycReviewCase[];
  accountControls: AccountControlRecord[];
  idempotencyKeys: Map<string, string>;
}

const now = new Date().toISOString();

export const store: OpenBankStore = {
  customers: [
    {
      id: "cus_001",
      firstName: "Adaeze",
      lastName: "Okafor",
      phone: "+2348012345678",
      email: "adaeze@example.com",
      kycTier: "tier_2",
      kycStatus: "approved",
      bvnLast4: "4821",
      ninLast4: "1742",
      createdAt: now,
    },
  ],
  accounts: [
    {
      id: "acct_001",
      customerId: "cus_001",
      accountNumber: "1023456789",
      accountName: "Adaeze Okafor",
      currency: "NGN",
      balanceKobo: 2_450_000_00,
      availableBalanceKobo: 2_450_000_00,
      status: "active",
      createdAt: now,
    },
  ],
  ledgerEntries: [
    {
      id: "led_001",
      transactionId: "seed_opening_balance",
      accountId: "acct_001",
      entryType: "credit",
      amountKobo: 2_450_000_00,
      balanceAfterKobo: 2_450_000_00,
      narration: "Opening balance",
      createdAt: now,
    },
  ],
  transfers: [],
  adminUsers: [
    {
      id: "adm_001",
      name: "Operations Manager",
      email: "ops@openbankng.example",
      role: "operations_manager",
      active: true,
      createdAt: now,
    },
    {
      id: "adm_002",
      name: "Compliance Officer",
      email: "compliance@openbankng.example",
      role: "compliance_officer",
      active: true,
      createdAt: now,
    },
  ],
  auditEvents: [
    {
      id: "aud_001",
      actorId: "system",
      actorRole: "system",
      action: "transfer.create",
      severity: "info",
      entityType: "account",
      entityId: "acct_001",
      message: "Seed account and opening ledger entry created.",
      createdAt: now,
    },
  ],
  kycReviewCases: [
    {
      id: "kyc_001",
      customerId: "cus_001",
      status: "approved",
      submittedTier: "tier_2",
      assignedTo: "adm_002",
      decision: "approved",
      decisionReason: "Seed customer approved for sandbox banking workflow.",
      createdAt: now,
      decidedAt: now,
    },
  ],
  accountControls: [],
  idempotencyKeys: new Map(),
};
