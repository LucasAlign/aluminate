import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_LOGIN, isDemoLogin } from "./demo-auth.ts";

test("accepts only the public demo credentials", () => {
  assert.equal(isDemoLogin(DEMO_LOGIN.email, DEMO_LOGIN.password), true);
  assert.equal(isDemoLogin(`  ${DEMO_LOGIN.email.toUpperCase()}  `, DEMO_LOGIN.password), true);
  assert.equal(isDemoLogin(DEMO_LOGIN.email, "wrong-password"), false);
  assert.equal(isDemoLogin("admin@aluminate.app", DEMO_LOGIN.password), false);
});
