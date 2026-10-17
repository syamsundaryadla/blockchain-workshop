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
import { AboutMeSlide } from "./AboutMeSlide";
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
    frame = WORKSHOP_FRAMES[slide.slideNumber];
  const [revealed, setRevealed] = useState<number | null>(null);
  const steps = frame.steps ?? 0,
    isCode = ["code", "code-pair", "terminal"].includes(frame.layout);
  if (frame.scene === "about-me") return <AboutMeSlide />;
  return (
    <div
      className={`workshop-slide workshop-${frame.layout === "diagram" ? "illustrated" : frame.layout} scene-${frame.scene}`}
    >
      <header className="workshop-slide-heading">
        <div>
          <span className="eyebrow">{frame.eyebrow}</span>
          <h1>{editorial.title}</h1>
        </div>
        <p>{editorial.idea}</p>
      </header>
      {isCode ? (
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
      ) : frame.diagram ? (
        <WorkshopDiagram
          slide={frame.diagram}
          revealed={revealed ?? undefined}
        />
      ) : (
        <FabricWorkshopDiagram scene={frame.scene!} />
      )}
      {BEGINNER_LESSONS[slide.slideNumber - 1].activity && (
        <LessonPrompt
          activity={BEGINNER_LESSONS[slide.slideNumber - 1].activity!}
        />
      )}
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
          {slide.slideNumber >= 19 && (
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
    ["Wallet: Alice", "Signer: Bob"],
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
        ) : moduleId === 6 ? (
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
                  rx={moduleId === 3 ? 30 : 8}
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
            {moduleId === 5 && (
              <path d="m285 15 18 18m0-18-18 18" className="quiz-motif-line" />
            )}
          </>
        )}
      </svg>
    </figure>
  );
}
