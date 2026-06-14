import type { FastifyInstance } from "fastify";
import { ledgerRepository } from "../repositories/memoryRepositories.js";

export async function registerStatementRoutes(app: FastifyInstance) {
  app.get("/v1/accounts/:accountId/statement", async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const query = request.query as { from?: string; to?: string };
    const from = query.from ? new Date(query.from) : new Date("1970-01-01T00:00:00.000Z");
    const to = query.to ? new Date(query.to) : new Date();

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return reply.code(422).send({ error: "INVALID_STATEMENT_DATE_RANGE" });
    }

    try {
      return { data: ledgerRepository.buildStatement(accountId, from, to) };
    } catch (error) {
      return reply.code(404).send({ error: "STATEMENT_NOT_AVAILABLE", message: (error as Error).message });
    }
  });
}
