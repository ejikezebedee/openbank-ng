import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireCustomerSession } from "../services/sessionAuth.js";
import { createTransfer } from "../services/transfers.js";

const transferSchema = z.object({
  sourceAccountId: z.string().min(1),
  amountKobo: z.number().int().positive(),
  beneficiaryName: z.string().min(2),
  beneficiaryAccountNumber: z.string().regex(/^\d{10}$/),
  beneficiaryBankCode: z.string().min(6),
  narration: z.string().max(120).default("OpenBank NG transfer"),
  channel: z.enum(["internal", "nip_mock", "manual_review"]).default("nip_mock"),
  idempotencyKey: z.string().min(12),
  customerDeviceId: z.string().min(1).optional(),
  otpChallengeId: z.string().min(1).optional(),
});

export async function registerTransferRoutes(app: FastifyInstance) {
  app.get("/v1/transfers", async (request, reply) => {
    try {
      const session = requireCustomerSession(request.headers.authorization);
      const ownedAccountIds = new Set(
        app.openBankStore.accounts.filter((account) => account.customerId === session.customerId).map((account) => account.id),
      );
      return { data: app.openBankStore.transfers.filter((transfer) => ownedAccountIds.has(transfer.sourceAccountId)) };
    } catch (error) {
      return reply.code(401).send({ error: "CUSTOMER_AUTH_REQUIRED", message: (error as Error).message });
    }
  });

  app.post("/v1/transfers", async (request, reply) => {
    const parsed = transferSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    try {
      const session = requireCustomerSession(request.headers.authorization);
      const transfer = createTransfer({ ...parsed.data, customerId: session.customerId });
      const statusCode = transfer.status === "failed" ? 409 : 201;
      return reply.code(statusCode).send({ data: transfer });
    } catch (error) {
      const message = (error as Error).message;
      const isAuthFailure = /session|Customer session/i.test(message);
      return reply
        .code(isAuthFailure ? 401 : 409)
        .send({ error: isAuthFailure ? "CUSTOMER_AUTH_REQUIRED" : "TRANSFER_NOT_ACCEPTED", message });
    }
  });
}
