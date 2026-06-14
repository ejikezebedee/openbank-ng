import type {
  AccountStatement,
  BankAccount,
  Beneficiary,
  CustomerProfile,
  CustomerUser,
  LedgerEntry,
  TransferRecord,
} from "@openbank-ng/shared";

export interface TransactionContext {
  id: string;
}

export interface CustomerRepository {
  findCustomerById(customerId: string): CustomerProfile | undefined;
  findCustomerUserByEmail(email: string): CustomerUser | undefined;
}

export interface AccountRepository {
  findAccountById(accountId: string): BankAccount | undefined;
  listCustomerAccounts(customerId: string): BankAccount[];
}

export interface BeneficiaryRepository {
  listByCustomer(customerId: string): Beneficiary[];
  create(beneficiary: Beneficiary): Beneficiary;
  disable(customerId: string, beneficiaryId: string): Beneficiary;
}

export interface LedgerRepository {
  listAccountEntries(accountId: string): LedgerEntry[];
  buildStatement(accountId: string, from: Date, to: Date): AccountStatement;
}

export interface TransferRepository {
  findById(transferId: string): TransferRecord | undefined;
  save(transfer: TransferRecord): TransferRecord;
}

export interface UnitOfWork {
  transaction<T>(name: string, work: (context: TransactionContext) => T): T;
}
