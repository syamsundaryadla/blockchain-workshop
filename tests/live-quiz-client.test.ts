import test from "node:test";
import assert from "node:assert/strict";
import {
  quizRequest,
  QuizRequestError,
  isScannerBrowser,
  chromeJoinIntent,
} from "../src/lib/live-quiz/client";

test("a transient answer failure retries the identical answer without changing its question", async (t) => {
  const requests: string[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: string, init: RequestInit) => {
      requests.push(String(init.body));
      if (requests.length === 1)
        return Response.json(
          { error: "Temporary storage failure" },
          { status: 503 },
        );
      return Response.json({ me: { answer: 2 } });
    },
  );
  const result = await quizRequest("participant", {
    action: "answer",
    code: "123456",
    index: 4,
    option: 2,
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[0], requests[1]);
  assert.equal(result.me?.answer, 2);
});

test("a stalled state request releases polling within four seconds", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal!.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }),
  );
  const started = performance.now();
  await assert.rejects(
    quizRequest("participant", { action: "state", code: "123456" }),
    QuizRequestError,
  );
  assert.ok(performance.now() - started < 5500);
});

test("a dropped join response retries with the same participant credential and request", async (t) => {
  const calls: RequestInit[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: string, init: RequestInit) => {
      calls.push(init);
      if (calls.length === 1) throw new TypeError("Failed to fetch");
      return Response.json({
        code: "123456",
        phase: "lobby",
        count: 1,
        standings: {},
        players: {},
      });
    },
  );
  const result = await quizRequest("same-participant-token", {
    action: "join",
    code: "123456",
    name: "Student",
  });
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].headers, calls[1].headers);
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(result.count, 1);
  assert.deepEqual(result.players, []);
});

test("a blocked scanner gets actionable browser guidance instead of a raw fetch error", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(
    quizRequest("participant", { action: "join", code: "123456" }),
    (error) =>
      error instanceof QuizRequestError &&
      error.code === "network" &&
      /Chrome or Safari/.test(error.message),
  );
  assert.equal(calls, 2);
});

test("application errors are preserved without retrying or creating extra rooms", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return Response.json({ error: "This quiz has started." }, { status: 409 });
  });
  await assert.rejects(
    quizRequest("participant", { action: "join", code: "123456" }),
    (error) =>
      error instanceof QuizRequestError &&
      error.status === 409 &&
      /has started/.test(error.message),
  );
  assert.equal(calls, 1);
});

test("scanner detection and Chrome handoff retain the exact room link", () => {
  assert.equal(
    isScannerBrowser(
      "Mozilla/5.0 (Linux; Android 13; Pixel; wv) Version/4.0 Chrome/120 Mobile",
    ),
    true,
  );
  assert.equal(
    isScannerBrowser("Mozilla/5.0 (iPhone) AppleWebKit GSA/300.0 Mobile"),
    true,
  );
  assert.equal(
    isScannerBrowser(
      "Mozilla/5.0 (Linux; Android 13; Pixel) Chrome/120 Mobile Safari/537.36",
    ),
    false,
  );
  const url = "https://blockchain.risenine.in/quiz?code=123456";
  const intent = chromeJoinIntent(url);
  assert.ok(
    intent.startsWith(
      "intent://blockchain.risenine.in/quiz?code=123456#Intent;scheme=https;",
    ),
  );
  assert.ok(
    intent.includes(`S.browser_fallback_url=${encodeURIComponent(url)}`),
  );
  assert.equal(chromeJoinIntent("javascript:alert(1)"), "");
});
