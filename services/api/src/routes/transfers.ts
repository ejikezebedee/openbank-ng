import type { FastifyInstance } from "fastify";
import { z } from "zod";
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
});

export async function registerTransferRoutes(app: FastifyInstance) {
  app.get("/v1/transfers", async () => ({
    data: app.openBankStore.transfers,
  }));

  app.post("/v1/transfers", async (request, reply) => {
    const parsed = transferSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({
        error: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const transfer = createTransfer(parsed.data);
    const statusCode = transfer.status === "failed" ? 409 : 201;
    return reply.code(statusCode).send({ data: transfer });
  });
}
