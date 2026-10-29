import test from "node:test";
import assert from "node:assert/strict";
import { questionsForPack } from "../src/lib/live-quiz/questions.server";
import { QUIZ_PACKS } from "../src/lib/live-quiz/types";

test("live quiz packs contain complete, unique beginner questions with one valid answer", () => {
  assert.equal(QUIZ_PACKS.length, 2);
  assert.equal(questionsForPack("foundations")?.length, 12);
  assert.equal(questionsForPack("workshop")?.length, 15);
  assert.equal(questionsForPack("fabric"), undefined);
  for (const pack of QUIZ_PACKS) {
    const questions = questionsForPack(pack.id)!;
    assert.equal(questions.length, pack.count);
    assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
    for (const q of questions) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(
        Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex < q.options.length,
      );
      assert.ok(q.question.length < 150 && q.explanation.length > 30);
    }
  }
  assert.equal(questionsForPack("unknown"), undefined);
});
