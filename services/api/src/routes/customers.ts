import type { FastifyInstance } from "fastify";
import { store } from "../data/store.js";
import { getAccountLedger } from "../services/ledger.js";

export async function registerCustomerRoutes(app: FastifyInstance) {
  app.get("/v1/customers", async () => ({
    data: store.customers,
  }));

  app.get("/v1/customers/:customerId/summary", async (request) => {
    const { customerId } = request.params as { customerId: string };
    const customer = store.customers.find((entry) => entry.id === customerId);
    const accounts = store.accounts.filter((account) => account.customerId === customerId);
    const accountIds = new Set(accounts.map((account) => account.id));

    return {
      data: {
        customer,
        accounts,
        transfers: store.transfers.filter((transfer) => accountIds.has(transfer.sourceAccountId)),
        ledgerEntries: accounts.flatMap((account) => getAccountLedger(account.id)).slice(0, 20),
      },
    };
  });
}
