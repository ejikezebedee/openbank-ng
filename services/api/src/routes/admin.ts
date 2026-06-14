import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { store } from "../data/store.js";
import { decideKycReview, setAccountStatus } from "../services/adminOperations.js";
import { listAuditEvents } from "../services/audit.js";
import { rejectHeldTransfer, releaseHeldTransfer, reverseTransfer } from "../services/transfers.js";

const actorHeader = "x-admin-id";

const reasonSchema = z.object({
  reason: z.string().min(8).max(240),
});

const kycDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected", "needs_more_info"]),
  approvedTier: z.enum(["tier_0", "tier_1", "tier_2", "tier_3"]).default("tier_1"),
  reason: z.string().min(8).max(240),
});

function getActorId(request: { headers: Record<string, string | string[] | undefined> }): string {
  const header = request.headers[actorHeader];
  return Array.isArray(header) ? header[0] ?? "" : header ?? "";
}

export async function registerAdminRoutes(app: FastifyInstance) {
  app.get("/v1/admin/users", async () => ({
    data: store.adminUsers,
  }));

  app.get("/v1/admin/audit-events", async () => ({
    data: listAuditEvents(),
  }));

  app.get("/v1/admin/kyc-reviews", async () => ({
    data: store.kycReviewCases,
  }));

  app.post("/v1/admin/accounts/:accountId/freeze", async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const parsed = reasonSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: setAccountStatus(accountId, "freeze", parsed.data.reason, getActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/accounts/:accountId/unfreeze", async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const parsed = reasonSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: setAccountStatus(accountId, "unfreeze", parsed.data.reason, getActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/customers/:customerId/kyc-decision", async (request, reply) => {
    const { customerId } = request.params as { customerId: string };
    const parsed = kycDecisionSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return {
        data: decideKycReview(
          customerId,
          parsed.data.decision,
          parsed.data.approvedTier,
          parsed.data.reason,
          getActorId(request),
        ),
      };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/transfers/:transferId/reverse", async (request, reply) => {
    const { transferId } = request.params as { transferId: string };
    const parsed = reasonSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: reverseTransfer(transferId, parsed.data.reason, getActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.get("/v1/admin/transfers/review-queue", async () => ({
    data: store.transfers.filter((transfer) => transfer.status === "requires_review"),
  }));

  app.post("/v1/admin/transfers/:transferId/release", async (request, reply) => {
    const { transferId } = request.params as { transferId: string };

    try {
      return { data: releaseHeldTransfer(transferId, getActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/transfers/:transferId/reject", async (request, reply) => {
    const { transferId } = request.params as { transferId: string };
    const parsed = reasonSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: rejectHeldTransfer(transferId, parsed.data.reason, getActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });
}
