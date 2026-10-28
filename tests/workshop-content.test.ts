import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PRESENTATION_SLIDES } from "../src/content/slides";
import { WORKSHOP_MODULES } from "../src/content/modules";
import {
  BEGINNER_LESSONS,
  WORKSHOP_SCHEDULE,
  WORKSHOP_SETTINGS,
} from "../src/content/beginner-workshop";
import { PRACTICAL_STEPS, PROJECT_EXCERPTS } from "../src/content/practical";
import { WorkshopSlide } from "../src/components/presentation/WorkshopSlide";
import { rehearseTransfer } from "../src/lib/credits-rehearsal";
import { WORKSHOP_SYLLABUS } from "../src/content/syllabus";
const require = createRequire(import.meta.url);
const {
  prepareTransfer,
} = require("../workshop/fabric-credits/chaincode/lib/transfer-rules.js");
test("the complete visual workshop has eight modules and a protected real-Fabric build hour", () => {
  assert.equal(PRESENTATION_SLIDES.length, BEGINNER_LESSONS.length);
  assert.ok(
    PRESENTATION_SLIDES.length >=
      WORKSHOP_SYLLABUS.reduce((sum, m) => sum + m.topics.length, 2),
  );
  assert.equal(WORKSHOP_MODULES.length, 8);
  assert.equal(PRESENTATION_SLIDES[0].title, "Block chain fundamentals");
  assert.equal(PRESENTATION_SLIDES[1].title, "About me");
  assert.equal(BEGINNER_LESSONS[2].title, "What is Blockchain Technology?");
  assert.equal(PRESENTATION_SLIDES.filter((s) => s.quiz).length, 6);
  assert.equal(
    WORKSHOP_MODULES.reduce((sum, m) => sum + m.durationMinutes, 0),
    340,
  );
  let next = 1;
  for (const m of WORKSHOP_MODULES) {
    assert.equal(m.slideRange[0], next);
    next = m.slideRange[1] + 1;
  }
  assert.equal(next, PRESENTATION_SLIDES.length + 1);
  const minutes = (t: string) =>
    Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  let end = 570,
    teaching = 0;
  for (const [time, title] of WORKSHOP_SCHEDULE) {
    const [a, b] = time.split("–").map(minutes);
    assert.equal(a, end);
    end = b;
    if (!["Break", "Lunch"].includes(title)) teaching += b - a;
  }
  assert.equal(end, 990);
  assert.equal(teaching, 340);
  assert.equal(WORKSHOP_SCHEDULE.at(-1)![0], "16:00–16:30");
  assert.ok(
    WORKSHOP_SCHEDULE.some(
      ([time, title]) =>
        time === "15:00–16:00" && title.includes("Student build"),
    ),
  );
  assert.ok(BEGINNER_LESSONS.filter((l) => l.activity).length >= 25);
  for (const slide of PRESENTATION_SLIDES) {
    assert.ok(slide.speakerNotes.length > 40);
    if (slide.slideNumber > 2 && !slide.quiz && !slide.simulationType) {
      const html = renderToStaticMarkup(
        React.createElement(WorkshopSlide, { slide, onDetails: () => {} }),
      );
      assert.ok(html.includes("<svg") || html.includes("<code"));
    }
  }
  assert.deepEqual(
    PRESENTATION_SLIDES.filter((s) => s.simulationType).map(
      (s) => s.simulationType,
    ),
    [
      "hasher",
      "blockchain",
      "broadcast",
      "mining",
      "signatures",
      "fabric-flow",
      "credits",
    ],
  );
});
test("organizer headings and topic order are preserved, with short definitions", () => {
  assert.deepEqual(
    WORKSHOP_MODULES.map((m) => m.title),
    WORKSHOP_SYLLABUS.map((m) => m.title),
  );
  for (const module of WORKSHOP_MODULES) {
    const syllabus = WORKSHOP_SYLLABUS[module.id - 1];
    const seen = new Set<number>();
    let previous = 0;
    for (const lesson of BEGINNER_LESSONS.slice(
      module.slideRange[0] - 1,
      module.slideRange[1],
    )) {
      if (lesson.syllabusTopic) {
        assert.ok(lesson.syllabusTopic >= previous, module.title);
        assert.equal(
          lesson.title,
          lesson.scene === "mango-trace"
            ? "Walmart Mango Traceability Example"
            : syllabus.topics[lesson.syllabusTopic - 1],
        );
        previous = lesson.syllabusTopic;
        seen.add(previous);
      } else if (!["cover", "about-me"].includes(lesson.scene)) {
        assert.equal(lesson.title, module.title);
      }
      if (lesson.explanation)
        assert.ok(lesson.explanation.length <= 240, lesson.title);
    }
    assert.deepEqual(
      [...seen],
      syllabus.topics.map((_, i) => i + 1),
    );
  }
  assert.match(BEGINNER_LESSONS[2].explanation!, /shared digital record book/);
});
test("handout, solution excerpts, downloads and platform versions stay aligned", () => {
  const source = readFileSync(
    "workshop/fabric-credits/chaincode/lib/transfer-rules.js",
    "utf8",
  );
  const handout = readFileSync("public/workshop/student-handout.md", "utf8");
  for (const version of [
    WORKSHOP_SETTINGS.node,
    WORKSHOP_SETTINGS.fabric,
    WORKSHOP_SETTINGS.fabricCA,
  ])
    assert.ok(handout.includes(version));
  for (const excerpt of Object.values(PROJECT_EXCERPTS))
    assert.ok(source.replace(/\s+/g, "").includes(excerpt.replace(/\s+/g, "")));
  assert.equal(PRACTICAL_STEPS.length, 14);
  for (const step of PRACTICAL_STEPS) {
    assert.ok(handout.includes(step.title));
    assert.ok(handout.includes(step.expected));
  }
  for (const name of [
    "fabric-installation-guide.pdf",
    "campus-credits-kit.zip",
    "transfer-rules.starter.js",
    "transfer-rules.solution.js",
  ])
    assert.ok(existsSync("public/workshop/" + name), name);
  const page = readFileSync("src/app/workshop/page.tsx", "utf8");
  assert.ok(!/CampusAssetRegister|Open Remix|\.sol\"/.test(page));
});
test("browser rehearsal matches the supplied real-project arithmetic and preserves state on rejection", () => {
  const start = { alice: 100, bob: 50 };
  const next = rehearseTransfer(start, "alice", "alice", "bob", "20");
  const real = prepareTransfer(100, 50, "20");
  assert.equal(next.alice, real.senderBalance);
  assert.equal(next.bob, real.recipientBalance);
  const back = rehearseTransfer(next, "bob", "bob", "alice", "10");
  assert.deepEqual(back, { alice: 90, bob: 60 });
  assert.throws(
    () => rehearseTransfer(back, "bob", "alice", "bob", "1"),
    /Permission denied/,
  );
  for (const amount of ["0", "-1", "2.5", "20abc", "1000"])
    assert.throws(() =>
      rehearseTransfer(back, "alice", "alice", "bob", amount),
    );
  assert.deepEqual(start, { alice: 100, bob: 50 });
  assert.deepEqual(back, { alice: 90, bob: 60 });
});
