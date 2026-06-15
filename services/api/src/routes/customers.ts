import type { FastifyInstance } from "fastify";
import { store } from "../data/store.js";
import { getAccountLedger } from "../services/ledger.js";
import { requirePermission } from "../services/rbac.js";
import { requireAdminSession, requireCustomerSession } from "../services/sessionAuth.js";

export async function registerCustomerRoutes(app: FastifyInstance) {
  app.get("/v1/customers", async (request, reply) => {
    try {
      const admin = requireAdminSession(request.headers.authorization);
      requirePermission(admin.adminId, "customers:read");
      return { data: store.customers };
    } catch (error) {
      return reply.code(403).send({ error: "CUSTOMER_READ_DENIED", message: (error as Error).message });
    }
  });

  app.get("/v1/customers/:customerId/summary", async (request, reply) => {
    const { customerId } = request.params as { customerId: string };

    try {
      const session = requireCustomerSession(request.headers.authorization);
      if (session.customerId !== customerId) {
        return reply.code(403).send({ error: "CUSTOMER_READ_DENIED", message: "Customer session cannot access another customer." });
      }
    } catch (error) {
      return reply.code(401).send({ error: "CUSTOMER_AUTH_REQUIRED", message: (error as Error).message });
    }

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
