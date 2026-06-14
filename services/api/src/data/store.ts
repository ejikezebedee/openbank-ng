import type { BankAccount, CustomerProfile, LedgerEntry, TransferRecord } from "@openbank-ng/shared";

export interface OpenBankStore {
  customers: CustomerProfile[];
  accounts: BankAccount[];
  ledgerEntries: LedgerEntry[];
  transfers: TransferRecord[];
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
  idempotencyKeys: new Map(),
};
