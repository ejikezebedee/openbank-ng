import assert from "node:assert/strict";
import test from "node:test";
import { shouldBlockDefaultSandboxSigningSecret } from "./sessionAuth.js";

test("blocks default sandbox session secret in production mode", () => {
  assert.equal(shouldBlockDefaultSandboxSigningSecret("production", "replace-this-sandbox-session-secret"), true);
  assert.equal(shouldBlockDefaultSandboxSigningSecret("production", "buyer-supplied-session-secret"), false);
  assert.equal(shouldBlockDefaultSandboxSigningSecret("test", "replace-this-sandbox-session-secret"), false);
});
