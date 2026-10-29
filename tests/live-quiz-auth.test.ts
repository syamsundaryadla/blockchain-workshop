import test from "node:test";
import assert from "node:assert/strict";
import { quizConfigured, validAdminPassword } from "../src/lib/live-quiz/redis.server";

test("quiz configuration accepts an eight-character host password and checks the exact secret", () => {
  const names = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN", "QUIZ_ADMIN_PASSWORD"] as const;
  const previous = Object.fromEntries(names.map(name => [name, process.env[name]]));
  try {
    process.env.UPSTASH_REDIS_REST_URL = "https://quiz-test.invalid";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    process.env.QUIZ_ADMIN_PASSWORD = "test1234";
    assert.equal(quizConfigured(), true);
    assert.equal(validAdminPassword("test1234"), true);
    assert.equal(validAdminPassword("wrong123"), false);
    process.env.QUIZ_ADMIN_PASSWORD = "short12";
    assert.equal(quizConfigured(), false);
    process.env.QUIZ_ADMIN_PASSWORD = "test1234";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.KV_REST_API_URL = "https://quiz-alias-test.invalid";
    process.env.KV_REST_API_TOKEN = "alias-test-token";
    assert.equal(quizConfigured(), true);
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});
