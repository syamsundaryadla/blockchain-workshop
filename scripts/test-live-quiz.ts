import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

// Explicit integration test: requires a running app backed by real Redis.
// Remote targets must be deliberately enabled; this can consume hosting quota.
const base = process.env.QUIZ_TEST_URL || "http://127.0.0.1:3102";
const password = process.env.QUIZ_TEST_PASSWORD;
if (
  !["localhost", "127.0.0.1"].includes(new URL(base).hostname) &&
  process.env.QUIZ_LOAD_TEST_ALLOW_REMOTE !== "true"
)
  throw new Error(
    "Remote load tests require QUIZ_LOAD_TEST_ALLOW_REMOTE=true and reviewed quotas.",
  );
if (!password)
  throw new Error("Set QUIZ_TEST_PASSWORD to your test host password.");
const token = () => randomBytes(32).toString("hex");
const host = token(),
  people = Array.from({ length: 150 }, () => token());
const timings: number[] = [];
async function call(
  auth: string,
  body: Record<string, unknown>,
  expected = 200,
) {
  const start = performance.now();
  const response = await fetch(base + "/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  assert.equal(
    response.status,
    expected,
    `${body.action}: ${JSON.stringify(result)}`,
  );
  if (body.action === "answer" || body.action === "state")
    timings.push(performance.now() - start);
  return result;
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function main() {
  await call(
    host,
    { action: "create", pack: "foundations", password: "wrong" },
    403,
  );
  const lobby = await call(host, {
    action: "create",
    pack: "foundations",
    password,
  });
  const code = lobby.code;
  console.log(`Testing isolated quiz room ${code}`);
  try {
    assert.equal(lobby.phase, "lobby");
    assert.equal(lobby.question, null);
    await call(token(), { action: "state", code }, 401);
    await Promise.all(
      people
        .slice(0, 100)
        .map((auth, i) =>
          call(auth, { action: "join", code, name: `Student ${i + 1}` }),
        ),
    );
    console.log("PASS: 100 simultaneous participant joins");
    const initial = await call(host, { action: "state", code });
    assert.equal(initial.count, 100);
    await call(token(), { action: "join", code, name: "Student 1" }, 409);
    await Promise.all(
      people
        .slice(100)
        .map((auth, i) =>
          call(auth, { action: "join", code, name: `Student ${i + 101}` }),
        ),
    );
    await call(token(), { action: "join", code, name: "Over capacity" }, 409);
    const snapshots = await Promise.all(
      people.slice(0, 100).map((auth) => call(auth, { action: "state", code })),
    );
    assert.ok(
      snapshots.every(
        (s) =>
          s.count === 150 && s.question === null && !s.questions && !s.host,
      ),
    );
    assert.ok(
      snapshots.every(
        (s) => !Array.isArray(s.players) || s.players.length === 0,
      ),
    );
    await call(people[0], { action: "advance", code, index: -1 }, 403);
    const question = await call(host, { action: "advance", code, index: -1 });
    assert.equal(question.phase, "countdown");
    assert.equal(question.question, null);
    assert.equal(question.endsAt - question.startsAt, 20000);
    await call(host, { action: "advance", code, index: -1 }, 409);
    await call(
      people[0],
      {
        action: "answer",
        code,
        index: 0,
        option: 0,
        now: question.startsAt + 1,
      },
      409,
    );
    await call(token(), { action: "join", code, name: "Late joiner" }, 409);
    const resume = await call(people[0], {
      action: "join",
      code,
      name: "Student 1",
    });
    assert.equal(resume.count, 150);
    await sleep(Math.max(0, question.startsAt - Date.now() + 80));
    const open = await call(people[0], { action: "state", code });
    assert.equal(open.phase, "question");
    assert.equal(open.question.correctIndex, undefined);
    assert.equal(open.question.explanation, undefined);
    await call(people[0], { action: "answer", code, index: 1, option: 0 }, 409);
    await call(people[0], { action: "answer", code, index: 0, option: 8 }, 400);
    const answers = await Promise.all(
      people
        .slice(0, 100)
        .map((auth, i) =>
          call(auth, {
            action: "answer",
            code,
            index: 0,
            option: i % 4,
            score: 999999,
            timestamp: 0,
          }),
        ),
    );
    assert.ok(answers.every((s) => s.me.points === null && s.me.score === 0));
    await sleep(1100);
    await call(people[100], { action: "answer", code, index: 0, option: 0 });
    const duplicate = await call(people[0], {
      action: "answer",
      code,
      index: 0,
      option: 1,
    });
    assert.equal(duplicate.me.answer, 0);
    const ongoing = await call(host, { action: "state", code });
    assert.equal(ongoing.answered, 101);
    assert.equal(ongoing.phase, "question");
    console.log(
      "PASS: 100 simultaneous answers; duplicates, permissions, early answers and hidden keys",
    );
    await sleep(Math.max(0, question.endsAt - Date.now() + 40));
    await call(
      people[149],
      {
        action: "answer",
        code,
        index: 0,
        option: 0,
        timestamp: question.startsAt,
      },
      409,
    );
    const results = await Promise.all(
      people.slice(0, 101).map((auth) => call(auth, { action: "state", code })),
    );
    assert.ok(
      results.every(
        (s) =>
          s.phase === "leaderboard" &&
          s.index === 0 &&
          s.question.correctIndex === 0,
      ),
    );
    assert.ok(
      results[0].me.points > results[100].me.points,
      "Faster correct answer should score more",
    );
    assert.ok(
      results.every(
        (s) => s.me.points === 0 || (s.me.points >= 50 && s.me.points <= 100),
      ),
      "Every answer is capped at 100 points",
    );
    assert.equal(results[1].me.points, 0);
    assert.equal(results[0].me.score, results[0].me.points);
    const again = await call(people[0], {
      action: "answer",
      code,
      index: 0,
      option: 0,
    });
    assert.equal(again.me.score, results[0].me.score);
    const exported = await call(host, { action: "export", code });
    assert.equal(exported.standings.length, 150);
    const privateExport = await call(people[0], { action: "export", code });
    assert.equal(privateExport.standings.length, 10);
    assert.equal(
      exported.standings.reduce(
        (n: number, p: { correct: number }) => n + p.correct,
        0,
      ),
      26,
    );
    const next = await call(host, { action: "advance", code, index: 0 });
    assert.equal(next.index, 1);
    await call(host, { action: "advance", code, index: 0 }, 409);
    console.log(
      "PASS: strict 20-second cutoff, speed scoring, leaderboard, full export and host-controlled advance",
    );
  } finally {
    await call(host, { action: "end", code });
  }
  timings.sort((a, b) => a - b);
  console.log(
    JSON.stringify(
      {
        participantsTested: 150,
        simultaneousJoins: 100,
        simultaneousAnswers: 100,
        requestsMeasured: timings.length,
        localP95Ms: Math.round(timings[Math.floor(timings.length * 0.95)]),
        note: "Local Redis/API test. This is not a Vercel or venue-network capacity certification.",
      },
      null,
      2,
    ),
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
