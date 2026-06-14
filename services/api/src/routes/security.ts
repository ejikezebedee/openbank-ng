import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createOtpChallenge, registerTrustedDevice, verifyOtpChallenge } from "../services/security.js";

const deviceSchema = z.object({
  customerId: z.string().min(1),
  label: z.string().min(2).max(80),
  fingerprint: z.string().min(12).max(160),
});

const otpCreateSchema = z.object({
  customerId: z.string().min(1),
  purpose: z.enum(["login", "transfer", "beneficiary"]),
  targetId: z.string().min(1).optional(),
});

const otpVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});

export async function registerSecurityRoutes(app: FastifyInstance) {
  app.post("/v1/security/devices/trust", async (request, reply) => {
    const parsed = deviceSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    return { data: registerTrustedDevice(parsed.data.customerId, parsed.data.label, parsed.data.fingerprint) };
  });

  app.post("/v1/security/otp-challenges", async (request, reply) => {
    const parsed = otpCreateSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    return reply
      .code(201)
      .send({ data: createOtpChallenge(parsed.data.customerId, parsed.data.purpose, parsed.data.targetId) });
  });

  app.post("/v1/security/otp-challenges/:challengeId/verify", async (request, reply) => {
    const { challengeId } = request.params as { challengeId: string };
    const parsed = otpVerifySchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(422).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    }

    try {
      return { data: verifyOtpChallenge(challengeId, parsed.data.code) };
    } catch (error) {
      return reply.code(401).send({ error: "OTP_VERIFICATION_FAILED", message: (error as Error).message });
    }
  });
}
