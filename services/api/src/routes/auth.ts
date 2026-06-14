import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { store } from "../data/store.js";
import { appendAuditEvent } from "../services/audit.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/v1/auth/admin/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    const admin = store.adminUsers.find((entry) => entry.email === parsed.data.email && entry.active);

    if (!admin) {
      return reply.code(401).send({ error: "INVALID_CREDENTIALS" });
    }

    appendAuditEvent({
      actorId: admin.id,
      actorRole: admin.role,
      action: "auth.login",
      entityType: "admin_user",
      entityId: admin.id,
      message: `${admin.name} authenticated into the admin console.`,
    });

    return {
      data: {
        admin,
        session: {
          tokenType: "Bearer",
          accessToken: `sandbox.${admin.id}.replace-with-jwt-provider`,
          expiresInSeconds: 900,
        },
      },
    };
  });
}
