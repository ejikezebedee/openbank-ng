export const PRODUCT_NAME = "OpenBank NG";
export const DEFAULT_CURRENCY = "NGN";
export const MONEY_MINOR_UNIT = "kobo";

export type KycTier = "tier_0" | "tier_1" | "tier_2" | "tier_3";
export type KycStatus = "not_started" | "pending_review" | "approved" | "rejected";
export type AccountStatus = "active" | "frozen" | "closed";
export type LedgerEntryType = "debit" | "credit";
export type TransferChannel = "internal" | "nip_mock" | "manual_review";

export type TransactionStatus =
  | "draft"
  | "pending"
  | "processing"
  | "requires_review"
  | "successful"
  | "failed"
  | "reversed"
  | "cancelled";

export const transactionStatuses: TransactionStatus[] = [
  "draft",
  "pending",
  "processing",
  "requires_review",
  "successful",
  "failed",
  "reversed",
  "cancelled",
];

export function formatKobo(amountKobo: bigint | number): string {
  const amount = typeof amountKobo === "bigint" ? amountKobo : BigInt(amountKobo);
  const sign = amount < 0n ? "-" : "";
  const absolute = amount < 0n ? -amount : amount;
  const naira = absolute / 100n;
  const kobo = absolute % 100n;
  return `${sign}NGN ${naira.toLocaleString("en-NG")}.${kobo.toString().padStart(2, "0")}`;
}

export const kycTierDailyLimitsKobo: Record<KycTier, bigint> = {
  tier_0: 0n,
  tier_1: 500_000n,
  tier_2: 5_000_000n,
  tier_3: 50_000_000n,
};

export const nigerianBanks = [
  { code: "000013", name: "Guaranty Trust Bank" },
  { code: "000014", name: "Access Bank" },
  { code: "000015", name: "Zenith Bank" },
  { code: "000016", name: "First Bank of Nigeria" },
  { code: "000021", name: "United Bank for Africa" },
  { code: "000023", name: "Citibank Nigeria" },
  { code: "000026", name: "Stanbic IBTC Bank" },
  { code: "000027", name: "Standard Chartered Bank Nigeria" },
  { code: "000030", name: "Heritage Bank" },
  { code: "000033", name: "United Mortgage Bank" },
  { code: "000034", name: "Union Bank of Nigeria" },
  { code: "000035", name: "Wema Bank" },
  { code: "000036", name: "Polaris Bank" },
  { code: "000050", name: "Ecobank Nigeria" },
  { code: "000100", name: "Suntrust Bank" },
] as const;

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  kycTier: KycTier;
  kycStatus: KycStatus;
  bvnLast4?: string;
  ninLast4?: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  accountName: string;
  currency: typeof DEFAULT_CURRENCY;
  balanceKobo: number;
  availableBalanceKobo: number;
  status: AccountStatus;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountId: string;
  entryType: LedgerEntryType;
  amountKobo: number;
  balanceAfterKobo: number;
  narration: string;
  createdAt: string;
}

export interface TransferInstruction {
  sourceAccountId: string;
  amountKobo: number;
  beneficiaryName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankCode: string;
  narration: string;
  channel: TransferChannel;
  idempotencyKey: string;
}

export interface TransferRecord extends TransferInstruction {
  id: string;
  status: TransactionStatus;
  reference: string;
  failureReason?: string;
  createdAt: string;
  completedAt?: string;
}

export function isValidNigerianPhone(phone: string): boolean {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone);
}

export function isValidNubanLikeAccount(accountNumber: string): boolean {
  return /^\d{10}$/.test(accountNumber);
}

export function findNigerianBank(code: string) {
  return nigerianBanks.find((bank) => bank.code === code);
}
