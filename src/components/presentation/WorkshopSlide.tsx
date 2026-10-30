"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import type { Slide } from "@/types/presentation";
import { LESSON_EDITORIAL } from "@/content/studio";
import { WORKSHOP_FRAMES } from "@/content/workshop-deck";
import { WorkshopDiagram } from "./WorkshopDiagrams";
import { FabricWorkshopDiagram } from "./FabricWorkshopDiagrams";
import { BEGINNER_LESSONS } from "@/content/beginner-workshop";
import { LessonPrompt } from "./LessonPrompt";
import { FoundationDiagram, isFoundationScene } from "./FoundationDiagrams";
import { SyllabusDiagram, isSyllabusScene } from "./SyllabusDiagrams";
import { ConceptAnimation, isConceptAnimationScene } from "./ConceptAnimation";
import { FABRIC_COMPONENTS, TEACHING_CUES } from "@/content/teaching-cues";
import {
  DecisionAnimation,
  isDecisionScene,
  PracticalSuccessChecklist,
} from "./DecisionAnimation";
function CodePanel({
  code,
  title,
  label,
}: {
  code: string;
  title: string;
  label?: string;
}) {
  return (
    <section className="lecture-code-panel" aria-label={title}>
      <header>
        <span className="terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{title}</span>
        <span className="code-panel-label">{label}</span>
      </header>
      <pre>
        <code>
          {code.split("\n").map((line, i) => (
            <span className="lecture-code-line" key={i}>
              <span className="lecture-line-number" aria-hidden="true">
                {i + 1}
              </span>
              <span>
                {line
                  .split(
                    /(\/\/.*$|"[^"]*"|\b(?:const|let|if|throw|new|async|await|function|return)\b)/g,
                  )
                  .map((token, j) => (
                    <span
                      key={j}
                      className={
                        token.startsWith("//")
                          ? "token-comment"
                          : token.startsWith('"')
                            ? "token-string"
                            : /^(const|let|if|throw|new|async|await|function|return)$/.test(
                                  token,
                                )
                              ? "token-keyword"
                              : undefined
                      }
                    >
                      {token}
                    </span>
                  ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
export function WorkshopSlide({
  slide,
  onDetails,
}: {
  slide: Slide;
  onDetails: () => void;
}) {
  const editorial = LESSON_EDITORIAL[slide.slideNumber - 1],
    frame = WORKSHOP_FRAMES[slide.slideNumber],
    lesson = BEGINNER_LESSONS[slide.slideNumber - 1];
  const [revealed, setRevealed] = useState<number | null>(null);
  const [componentCount, setComponentCount] = useState(1);
  const steps = frame.steps ?? 0,
    isCode = ["code", "code-pair", "terminal"].includes(frame.layout);
  const teaching = TEACHING_CUES[lesson.scene];
  return (
    <div
      className={`workshop-slide workshop-${frame.layout === "diagram" ? "illustrated" : frame.layout} scene-${frame.scene} ${editorial.title.length > 45 ? "long-heading" : ""}`}
    >
      <header className="workshop-slide-heading">
        <div>
          <span className="eyebrow">{frame.eyebrow}</span>
          <h1>{editorial.title}</h1>
        </div>
        {lesson.explanation && (
          <p className="workshop-explanation">{lesson.explanation}</p>
        )}
        {teaching && (
          <ul className="lesson-subtopics" aria-label="Key subtopics">
            {teaching.subtopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        )}
      </header>
      {isDecisionScene(lesson.scene) ? (
        <DecisionAnimation key={lesson.scene} scene={lesson.scene} />
      ) : lesson.scene === "practical" ? (
        <PracticalSuccessChecklist />
      ) : frame.scene === "certificate" ? (
        <div className="fabric-component-reference">
          <table>
            <caption>
              Fabric components · the Campus Credits example
              <span className="component-reveal-controls">
                <button
                  onClick={() => setComponentCount((n) => Math.min(6, n + 1))}
                  disabled={componentCount === 6}
                >
                  Next component
                </button>
                <button
                  onClick={() =>
                    setComponentCount(componentCount === 6 ? 1 : 6)
                  }
                >
                  {componentCount === 6 ? "Start again" : "Show all"}
                </button>
              </span>
            </caption>
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">What it does</th>
                <th scope="col">Simple analogy</th>
                <th scope="col">In our project</th>
              </tr>
            </thead>
            <tbody>
              {FABRIC_COMPONENTS.slice(0, componentCount).map((component) => (
                <tr key={component.name}>
                  <th scope="row">{component.name}</th>
                  <td>{component.job}</td>
                  <td>{component.analogy}</td>
                  <td>{component.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : isCode ? (
        <div
          className={`lecture-code-composition ${frame.secondCode ? "paired-code" : "single-code"}`}
        >
          {!frame.secondCode && (
            <aside className="lecture-code-guide">
              {editorial.labels.map((s, i) => (
                <div key={s}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{s}</p>
                </div>
              ))}
            </aside>
          )}
          <CodePanel
            code={frame.code!}
            title={frame.filename ?? "JavaScript excerpt"}
            label="EXPLAIN TOGETHER"
          />
          {frame.secondCode && (
            <CodePanel
              code={frame.secondCode}
              title="The caller and the rule"
              label="EXPLAIN TOGETHER"
            />
          )}
        </div>
      ) : isConceptAnimationScene(frame.scene!) ? (
        <ConceptAnimation scene={frame.scene!} />
      ) : frame.diagram ? (
        <WorkshopDiagram
          slide={frame.diagram}
          revealed={revealed ?? undefined}
        />
      ) : isSyllabusScene(frame.scene!) ? (
        <SyllabusDiagram scene={frame.scene!} />
      ) : isFoundationScene(frame.scene!) ? (
        <FoundationDiagram scene={frame.scene!} />
      ) : (
        <FabricWorkshopDiagram scene={frame.scene!} />
      )}
      {teaching?.example && !isDecisionScene(lesson.scene) && (
        <p className="lesson-example">
          <span>Example</span>
          {teaching.example}
        </p>
      )}
      {lesson.activity && <LessonPrompt activity={lesson.activity} />}
      <footer className="workshop-slide-footer">
        <div>
          {steps > 0 ? (
            <button
              className="text-button reveal-button"
              onClick={() =>
                setRevealed(
                  revealed === null
                    ? 1
                    : revealed >= steps
                      ? null
                      : revealed + 1,
                )
              }
            >
              {revealed === null ? (
                <>
                  Walk through the steps <ArrowRight size={14} />
                </>
              ) : revealed >= steps ? (
                <>
                  Show all <RotateCcw size={13} />
                </>
              ) : (
                <>
                  Next step · {revealed + 1}/{steps} <ArrowRight size={14} />
                </>
              )}
            </button>
          ) : (
            <span className="workshop-caption">{frame.caption}</span>
          )}
        </div>
        <div className="workshop-resource-actions">
          {frame.scene === "live-demo" && (
            <a
              className="text-button"
              href="http://127.0.0.1:3200"
              target="_blank"
              rel="noreferrer"
            >
              Open real Fabric app <ArrowUpRight size={14} />
            </a>
          )}
          {slide.moduleId >= 6 && (
            <Link className="text-button" href="/workshop">
              Student kit <ArrowUpRight size={14} />
            </Link>
          )}
          <button className="text-button" onClick={onDetails}>
            {isCode ? "Code & explanation" : "A closer look"}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
export function WorkshopQuizMotif({ moduleId }: { moduleId: number }) {
  const pairs = [
    ["One trusted editor", "Shared trust?"],
    ["Saved fingerprint", "Changed input"],
    ["PoW search", "PoS validators"],
    ["Wallet: Alice", "Signer: Bob"],
    ["Shared claim", "Truthful input?"],
    ["Endorsed", "Committed?"],
    ["Prepared tools", "Your three TODOs"],
    ["One operator", "Shared trust?"],
  ];
  const labels = pairs[moduleId - 1];
  return (
    <figure className={`quiz-infographic quiz-infographic-${moduleId}`}>
      <svg viewBox="0 0 360 150" role="img" aria-label={labels.join(" / ")}>
        {moduleId === 2 ? (
          <>
            <path d="M30 55h75l35 45h175" className="quiz-motif-line" />
            <text x="25" y="35">
              hash before
            </text>
            <text x="190" y="133">
              hash after · ?
            </text>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={140 + i * 28}
                y="40"
                width="18"
                height="27"
                rx="3"
                className={i % 2 ? "quiz-motif-emphasis" : "quiz-motif-box"}
              />
            ))}
          </>
        ) : moduleId === 8 ? (
          <>
            <circle cx="65" cy="75" r="38" className="quiz-motif-box" />
            <circle cx="270" cy="75" r="38" className="quiz-motif-emphasis" />
            <text x="58" y="82">
              A
            </text>
            <text x="263" y="82">
              B
            </text>
            <path d="M112 68h105m-16-8 16 8-16 8" className="quiz-motif-line" />
            <text x="115" y="125">
              Who should verify it?
            </text>
          </>
        ) : (
          <>
            {labels.map((s, i) => (
              <g key={s}>
                <rect
                  x={12 + i * 180}
                  y={35 + i * 22}
                  width="156"
                  height="70"
                  rx={moduleId === 4 ? 30 : 8}
                  className={i === 1 ? "quiz-motif-emphasis" : "quiz-motif-box"}
                />
                <text
                  x={90 + i * 180}
                  y={76 + i * 22}
                  textAnchor="middle"
                  style={{ fontSize: 13 }}
                >
                  {s}
                </text>
              </g>
            ))}
            {moduleId === 7 && (
              <path d="m285 15 18 18m0-18-18 18" className="quiz-motif-line" />
            )}
          </>
        )}
      </svg>
    </figure>
  );
}
