import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { store } from "../data/store.js";
import { appendAuditEvent } from "../services/audit.js";
import { verifySandboxPassword } from "../services/sandboxCrypto.js";
import { createSessionToken } from "../services/sessionAuth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function redactAdmin(admin: (typeof store.adminUsers)[number]) {
  const { passwordHash: _passwordHash, ...safeAdmin } = admin;
  return safeAdmin;
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/v1/auth/customer/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    const user = store.customerUsers.find((entry) => entry.email === parsed.data.email && entry.active);
    const customer = user ? store.customers.find((entry) => entry.id === user.customerId) : undefined;

    if (!user || !customer || !verifySandboxPassword(parsed.data.password, user.passwordHash)) {
      return reply.code(401).send({ error: "INVALID_CREDENTIALS" });
    }

    appendAuditEvent({
      actorId: customer.id,
      actorRole: "customer",
      action: "auth.login",
      entityType: "customer",
      entityId: customer.id,
      message: `${customer.firstName} ${customer.lastName} authenticated into the customer portal.`,
    });

    return {
      data: {
        customer,
        session: {
          tokenType: "Bearer",
          accessToken: createSessionToken({ kind: "customer", customerId: customer.id, userId: user.id }),
          expiresInSeconds: 900,
        },
      },
    };
  });

  app.post("/v1/auth/admin/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    const admin = store.adminUsers.find((entry) => entry.email === parsed.data.email && entry.active);

    if (!admin || !verifySandboxPassword(parsed.data.password, admin.passwordHash)) {
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
        admin: redactAdmin(admin),
        session: {
          tokenType: "Bearer",
          accessToken: createSessionToken({ kind: "admin", adminId: admin.id, role: admin.role }),
          expiresInSeconds: 900,
        },
      },
    };
  });
}
