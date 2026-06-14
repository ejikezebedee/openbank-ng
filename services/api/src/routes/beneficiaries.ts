import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { findNigerianBank, isValidNubanLikeAccount } from "@openbank-ng/shared";
import { beneficiaryRepository } from "../repositories/memoryRepositories.js";
import { appendAuditEvent } from "../services/audit.js";

const beneficiarySchema = z.object({
  customerId: z.string().min(1),
  name: z.string().min(2).max(80),
  accountNumber: z.string().regex(/^\d{10}$/),
  bankCode: z.string().min(6),
});

export async function registerBeneficiaryRoutes(app: FastifyInstance) {
  app.get("/v1/customers/:customerId/beneficiaries", async (request) => {
    const { customerId } = request.params as { customerId: string };
    return { data: beneficiaryRepository.listByCustomer(customerId) };
  });

  app.post("/v1/beneficiaries", async (request, reply) => {
    const parsed = beneficiarySchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    if (!isValidNubanLikeAccount(parsed.data.accountNumber) || !findNigerianBank(parsed.data.bankCode)) {
      return reply.code(422).send({ error: "INVALID_BENEFICIARY_BANK_DETAILS" });
    }

    const beneficiary = beneficiaryRepository.create({
      id: "",
      customerId: parsed.data.customerId,
      name: parsed.data.name,
      accountNumber: parsed.data.accountNumber,
      bankCode: parsed.data.bankCode,
      bankName: "",
      status: "active",
      createdAt: "",
    });

    appendAuditEvent({
      actorId: beneficiary.customerId,
      actorRole: "customer",
      action: "beneficiary.create",
      entityType: "beneficiary",
      entityId: beneficiary.id,
      message: `Beneficiary ${beneficiary.name} created.`,
      metadata: { bankCode: beneficiary.bankCode },
    });

    return reply.code(201).send({ data: beneficiary });
  });

  app.delete("/v1/customers/:customerId/beneficiaries/:beneficiaryId", async (request, reply) => {
    const { customerId, beneficiaryId } = request.params as { customerId: string; beneficiaryId: string };

    try {
      const beneficiary = beneficiaryRepository.disable(customerId, beneficiaryId);
      appendAuditEvent({
        actorId: customerId,
        actorRole: "customer",
        action: "beneficiary.disable",
        entityType: "beneficiary",
        entityId: beneficiary.id,
        message: `Beneficiary ${beneficiary.name} disabled.`,
      });
      return { data: beneficiary };
    } catch (error) {
      return reply.code(404).send({ error: "BENEFICIARY_NOT_FOUND", message: (error as Error).message });
    }
  });
}
