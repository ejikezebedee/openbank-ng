import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { store } from "../data/store.js";
import { decideKycReview, setAccountStatus } from "../services/adminOperations.js";
import { listAuditEvents } from "../services/audit.js";
import { requirePermission } from "../services/rbac.js";
import { requireAdminSession } from "../services/sessionAuth.js";
import { rejectHeldTransfer, releaseHeldTransfer, reverseTransfer } from "../services/transfers.js";

const reasonSchema = z.object({
  reason: z.string().min(8).max(240),
});

const kycDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected", "needs_more_info"]),
  approvedTier: z.enum(["tier_0", "tier_1", "tier_2", "tier_3"]).default("tier_1"),
  reason: z.string().min(8).max(240),
});

function getAdminActorId(request: { headers: Record<string, string | string[] | undefined> }): string {
  return requireAdminSession(request.headers.authorization as string | undefined).adminId;
}

export async function registerAdminRoutes(app: FastifyInstance) {
  app.get("/v1/admin/users", async (request, reply) => {
    try {
      requirePermission(getAdminActorId(request), "customers:read");
      return { data: store.adminUsers };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.get("/v1/admin/audit-events", async (request, reply) => {
    try {
      requirePermission(getAdminActorId(request), "audit:read");
      return { data: listAuditEvents() };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.get("/v1/admin/kyc-reviews", async (request, reply) => {
    try {
      requirePermission(getAdminActorId(request), "kyc:read");
      return { data: store.kycReviewCases };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/accounts/:accountId/freeze", async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const parsed = reasonSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: setAccountStatus(accountId, "freeze", parsed.data.reason, getAdminActorId(request)) };
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
      return { data: setAccountStatus(accountId, "unfreeze", parsed.data.reason, getAdminActorId(request)) };
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
          getAdminActorId(request),
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
      return { data: reverseTransfer(transferId, parsed.data.reason, getAdminActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.get("/v1/admin/transfers/review-queue", async (request, reply) => {
    try {
      requirePermission(getAdminActorId(request), "transfers:read");
      return { data: store.transfers.filter((transfer) => transfer.status === "requires_review") };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });

  app.post("/v1/admin/transfers/:transferId/release", async (request, reply) => {
    const { transferId } = request.params as { transferId: string };

    try {
      return { data: releaseHeldTransfer(transferId, getAdminActorId(request)) };
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
      return { data: rejectHeldTransfer(transferId, parsed.data.reason, getAdminActorId(request)) };
    } catch (error) {
      return reply.code(403).send({ error: "ADMIN_OPERATION_DENIED", message: (error as Error).message });
    }
  });
}
