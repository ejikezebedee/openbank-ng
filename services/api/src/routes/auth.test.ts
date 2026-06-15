import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";
import { store } from "../data/store.js";
import { registerAdminRoutes } from "./admin.js";
import { registerAuthRoutes } from "./auth.js";
import { registerBeneficiaryRoutes } from "./beneficiaries.js";
import { registerCustomerRoutes } from "./customers.js";
import { registerNotificationRoutes } from "./notifications.js";
import { registerSecurityRoutes } from "./security.js";
import { registerStatementRoutes } from "./statements.js";
import { registerTransferRoutes } from "./transfers.js";
import "../types.js";

async function buildTestApp() {
  const app = Fastify();
  app.decorate("openBankStore", store);
  await app.register(registerAuthRoutes);
  await app.register(registerAdminRoutes);
  await app.register(registerCustomerRoutes);
  await app.register(registerBeneficiaryRoutes);
  await app.register(registerStatementRoutes);
  await app.register(registerNotificationRoutes);
  await app.register(registerTransferRoutes);
  await app.register(registerSecurityRoutes);
  return app;
}

test("rejects invalid passwords and protects admin read routes", async () => {
  const app = await buildTestApp();

  const rejectedLogin = await app.inject({
    method: "POST",
    url: "/v1/auth/customer/login",
    payload: { email: "adaeze@example.com", password: "WrongPassword!2026" },
  });

  assert.equal(rejectedLogin.statusCode, 401);

  const unauthenticatedAdminRead = await app.inject({
    method: "GET",
    url: "/v1/admin/audit-events",
  });

  assert.equal(unauthenticatedAdminRead.statusCode, 403);

  const login = await app.inject({
    method: "POST",
    url: "/v1/auth/admin/login",
    payload: { email: "ops@openbankng.example", password: "OpenBankAdmin!2026" },
  });
  const body = login.json<{ data: { session: { accessToken: string } } }>();

  assert.equal(login.statusCode, 200);
  assert.match(body.data.session.accessToken, /^sandbox\./);

  const authenticatedAdminRead = await app.inject({
    method: "GET",
    url: "/v1/admin/audit-events",
    headers: { authorization: `Bearer ${body.data.session.accessToken}` },
  });

  assert.equal(authenticatedAdminRead.statusCode, 200);
  await app.close();
});

test("protects customer and transfer read routes with bearer sessions", async () => {
  const app = await buildTestApp();

  const unauthenticatedCustomerList = await app.inject({ method: "GET", url: "/v1/customers" });
  const unauthenticatedSummary = await app.inject({ method: "GET", url: "/v1/customers/cus_001/summary" });
  const unauthenticatedTransfers = await app.inject({ method: "GET", url: "/v1/transfers" });
  const unauthenticatedBeneficiaries = await app.inject({ method: "GET", url: "/v1/customers/cus_001/beneficiaries" });
  const unauthenticatedStatement = await app.inject({ method: "GET", url: "/v1/accounts/acct_001/statement" });
  const unauthenticatedNotifications = await app.inject({ method: "GET", url: "/v1/notifications?customerId=cus_001" });

  assert.equal(unauthenticatedCustomerList.statusCode, 403);
  assert.equal(unauthenticatedSummary.statusCode, 401);
  assert.equal(unauthenticatedTransfers.statusCode, 401);
  assert.equal(unauthenticatedBeneficiaries.statusCode, 401);
  assert.equal(unauthenticatedStatement.statusCode, 401);
  assert.equal(unauthenticatedNotifications.statusCode, 401);

  const customerLogin = await app.inject({
    method: "POST",
    url: "/v1/auth/customer/login",
    payload: { email: "adaeze@example.com", password: "OpenBankDemo!2026" },
  });
  const customerBody = customerLogin.json<{ data: { session: { accessToken: string } } }>();

  const authenticatedSummary = await app.inject({
    method: "GET",
    url: "/v1/customers/cus_001/summary",
    headers: { authorization: `Bearer ${customerBody.data.session.accessToken}` },
  });
  const authenticatedTransfers = await app.inject({
    method: "GET",
    url: "/v1/transfers",
    headers: { authorization: `Bearer ${customerBody.data.session.accessToken}` },
  });
  const authenticatedBeneficiaries = await app.inject({
    method: "GET",
    url: "/v1/customers/cus_001/beneficiaries",
    headers: { authorization: `Bearer ${customerBody.data.session.accessToken}` },
  });
  const authenticatedStatement = await app.inject({
    method: "GET",
    url: "/v1/accounts/acct_001/statement",
    headers: { authorization: `Bearer ${customerBody.data.session.accessToken}` },
  });
  const authenticatedNotifications = await app.inject({
    method: "GET",
    url: "/v1/notifications?customerId=cus_001",
    headers: { authorization: `Bearer ${customerBody.data.session.accessToken}` },
  });

  assert.equal(authenticatedSummary.statusCode, 200);
  assert.equal(authenticatedTransfers.statusCode, 200);
  assert.equal(authenticatedBeneficiaries.statusCode, 200);
  assert.equal(authenticatedStatement.statusCode, 200);
  assert.equal(authenticatedNotifications.statusCode, 200);
  await app.close();
});

test("redacts OTP codes and requires the owning customer session to verify", async () => {
  const app = await buildTestApp();

  const customerLogin = await app.inject({
    method: "POST",
    url: "/v1/auth/customer/login",
    payload: { email: "adaeze@example.com", password: "OpenBankDemo!2026" },
  });
  const customerBody = customerLogin.json<{ data: { session: { accessToken: string } } }>();
  const authorization = `Bearer ${customerBody.data.session.accessToken}`;

  const challengeResponse = await app.inject({
    method: "POST",
    url: "/v1/security/otp-challenges",
    headers: { authorization },
    payload: { purpose: "transfer", targetId: "acct_001" },
  });
  const challengeBody = challengeResponse.json<{ data: { id: string; code?: string } }>();
  const storedChallenge = store.otpChallenges.find((challenge) => challenge.id === challengeBody.data.id);

  assert.equal(challengeResponse.statusCode, 201);
  assert.equal(challengeBody.data.code, undefined);
  assert.match(storedChallenge?.code ?? "", /^\d{6}$/);

  const rejectedVerification = await app.inject({
    method: "POST",
    url: `/v1/security/otp-challenges/${challengeBody.data.id}/verify`,
    headers: { authorization },
    payload: { code: "000000" },
  });

  assert.equal(rejectedVerification.statusCode, 401);

  const verifiedResponse = await app.inject({
    method: "POST",
    url: `/v1/security/otp-challenges/${challengeBody.data.id}/verify`,
    headers: { authorization },
    payload: { code: storedChallenge?.code },
  });
  const verifiedBody = verifiedResponse.json<{ data: { id: string; verified: boolean; code?: string } }>();

  assert.equal(verifiedResponse.statusCode, 200);
  assert.equal(verifiedBody.data.verified, true);
  assert.equal(verifiedBody.data.code, undefined);
  await app.close();
});

test("smokes transfer review queue release and rejection through admin bearer auth", async () => {
  const app = await buildTestApp();

  const customerLogin = await app.inject({
    method: "POST",
    url: "/v1/auth/customer/login",
    payload: { email: "adaeze@example.com", password: "OpenBankDemo!2026" },
  });
  const customerBody = customerLogin.json<{ data: { session: { accessToken: string } } }>();
  const customerAuth = `Bearer ${customerBody.data.session.accessToken}`;

  const firstHeldTransfer = await app.inject({
    method: "POST",
    url: "/v1/transfers",
    headers: { authorization: customerAuth },
    payload: {
      sourceAccountId: "acct_001",
      amountKobo: 12_500,
      beneficiaryName: "Route Smoke Release",
      beneficiaryAccountNumber: "0123456789",
      beneficiaryBankCode: "000027",
      narration: "Route smoke release",
      channel: "nip_mock",
      idempotencyKey: `route-release-${Date.now()}`,
    },
  });
  const firstHeldBody = firstHeldTransfer.json<{ data: { id: string; status: string } }>();

  assert.equal(firstHeldTransfer.statusCode, 201);
  assert.equal(firstHeldBody.data.status, "requires_review");

  const spoofedRelease = await app.inject({
    method: "POST",
    url: `/v1/admin/transfers/${firstHeldBody.data.id}/release`,
    headers: { "x-admin-id": "adm_001" },
  });

  assert.equal(spoofedRelease.statusCode, 403);

  const adminLogin = await app.inject({
    method: "POST",
    url: "/v1/auth/admin/login",
    payload: { email: "ops@openbankng.example", password: "OpenBankAdmin!2026" },
  });
  const adminBody = adminLogin.json<{ data: { session: { accessToken: string } } }>();
  const adminAuth = `Bearer ${adminBody.data.session.accessToken}`;

  const reviewQueue = await app.inject({
    method: "GET",
    url: "/v1/admin/transfers/review-queue",
    headers: { authorization: adminAuth },
  });
  const reviewQueueBody = reviewQueue.json<{ data: Array<{ id: string }> }>();

  assert.equal(reviewQueue.statusCode, 200);
  assert.ok(reviewQueueBody.data.some((transfer) => transfer.id === firstHeldBody.data.id));

  const releasedTransfer = await app.inject({
    method: "POST",
    url: `/v1/admin/transfers/${firstHeldBody.data.id}/release`,
    headers: { authorization: adminAuth },
  });
  const releasedBody = releasedTransfer.json<{ data: { status: string; reviewedBy?: string } }>();

  assert.equal(releasedTransfer.statusCode, 200);
  assert.equal(releasedBody.data.status, "successful");
  assert.equal(releasedBody.data.reviewedBy, "adm_001");

  const secondHeldTransfer = await app.inject({
    method: "POST",
    url: "/v1/transfers",
    headers: { authorization: customerAuth },
    payload: {
      sourceAccountId: "acct_001",
      amountKobo: 13_500,
      beneficiaryName: "Route Smoke Reject",
      beneficiaryAccountNumber: "0123456789",
      beneficiaryBankCode: "000027",
      narration: "Route smoke reject",
      channel: "nip_mock",
      idempotencyKey: `route-reject-${Date.now()}`,
    },
  });
  const secondHeldBody = secondHeldTransfer.json<{ data: { id: string; status: string } }>();

  assert.equal(secondHeldTransfer.statusCode, 201);
  assert.equal(secondHeldBody.data.status, "requires_review");

  const rejectedTransfer = await app.inject({
    method: "POST",
    url: `/v1/admin/transfers/${secondHeldBody.data.id}/reject`,
    headers: { authorization: adminAuth },
    payload: { reason: "Route smoke rejection coverage." },
  });
  const rejectedBody = rejectedTransfer.json<{ data: { status: string; failureReason?: string; reviewedBy?: string } }>();

  assert.equal(rejectedTransfer.statusCode, 200);
  assert.equal(rejectedBody.data.status, "failed");
  assert.equal(rejectedBody.data.failureReason, "Route smoke rejection coverage.");
  assert.equal(rejectedBody.data.reviewedBy, "adm_001");
  await app.close();
});
