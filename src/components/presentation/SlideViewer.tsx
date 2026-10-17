"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  CheckCircle2,
  ChevronRight,
  Command,
  Copy,
  FileText,
  FlaskConical,
  Grid2X2,
  Maximize2,
  Minimize2,
  X,
  XCircle,
} from "lucide-react";
import { PRESENTATION_SLIDES } from "@/content/slides";
import { WORKSHOP_MODULES } from "@/content/modules";
import { LESSON_EDITORIAL, STUDIO_LABS } from "@/content/studio";
import { HashFingerprintLab } from "@/components/simulations/HashFingerprintLab";
import { LinkedBlocksLab } from "@/components/simulations/LinkedBlocksLab";
import { CreditsLab } from "@/components/simulations/CreditsLab";
import { SignatureLab } from "@/components/simulations/SignatureLab";
import { FabricFlowLab } from "@/components/simulations/FabricFlowLab";
import { WorkshopSlide, WorkshopQuizMotif } from "./WorkshopSlide";
import { WORKSHOP_FRAMES } from "@/content/workshop-deck";
import { TitleSlide } from "./TitleSlide";
import { BEGINNER_LESSONS } from "@/content/beginner-workshop";
import { copyToClipboard } from "@/lib/utils";

type Panel = "outline" | "notes" | "details" | "help" | null;

function Dialog({
  title,
  children,
  close,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => previousFocus?.focus({ preventScroll: true });
  }, []);
  return (
    <div
      className="studio-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`studio-dialog ${wide ? "dialog-wide" : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
          }
          if (event.key !== "Tab") return;
          const focusable = ref.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <header>
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close dialog"
            autoFocus
          >
            <X size={19} />
          </button>
        </header>
        <div className="dialog-content">{children}</div>
      </div>
    </div>
  );
}

function Simulation({ type }: { type: string }) {
  switch (type) {
    case "hasher":
      return <HashFingerprintLab />;
    case "blockchain":
      return <LinkedBlocksLab />;
    case "credits":
      return <CreditsLab />;
    case "signatures":
      return <SignatureLab />;
    case "fabric-flow":
      return <FabricFlowLab />;
    default:
      return null;
  }
}

export function SlideViewer() {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const escapeHandledByPanel = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const slide = PRESENTATION_SLIDES[index];
  const editorial = LESSON_EDITORIAL[index];
  const moduleInfo = WORKSHOP_MODULES.find((m) => m.id === slide.moduleId)!;
  const lab = STUDIO_LABS.find((l) => l.type === slide.simulationType);
  const cover = index === 0;
  const move = useCallback(
    (amount: number) =>
      setIndex((prev) =>
        Math.max(0, Math.min(PRESENTATION_SLIDES.length - 1, prev + amount)),
      ),
    [],
  );
  const goTo = (target: number) => {
    setIndex(target);
    setPanel(null);
  };

  useEffect(() => {
    const readLocation = () => {
      const requested = Number(
        new URLSearchParams(window.location.search).get("slide"),
      );
      const found = PRESENTATION_SLIDES.findIndex(
        (s) => s.slideNumber === requested,
      );
      setIndex(found >= 0 ? found : 0);
    };
    readLocation();
    setReady(true);
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, []);
  useEffect(() => {
    if (ready) {
      const url = new URL(window.location.href);
      if (index === 0) url.searchParams.delete("slide");
      else url.searchParams.set("slide", String(slide.slideNumber));
      window.history.replaceState(null, "", url);
    }
    setAnswer(null);
    setSubmitted(false);
    setCopied(false);
  }, [index, ready, slide.slideNumber]);
  const toggleFullscreen = useCallback(async () => {
    const entering = !fullscreen;
    // Keep the presentation layout active even if the host leaves native fullscreen.
    setFullscreen(entering);
    try {
      if (!entering && document.fullscreenElement)
        await document.exitFullscreen();
      else if (entering && !document.fullscreenElement)
        await stageRef.current?.requestFullscreen();
    } catch {
      /* The presentation layout also works when native fullscreen is unavailable. */
    }
  }, [fullscreen]);
  useEffect(() => {
    const changed = () => {
      if (document.fullscreenElement) setFullscreen(true);
    };
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);
  useEffect(() => {
    const captureEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") escapeHandledByPanel.current = Boolean(panel);
    };
    const releaseEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!escapeHandledByPanel.current) {
        setFullscreen(false);
        if (document.fullscreenElement)
          void document.exitFullscreen().catch(() => {});
      }
      escapeHandledByPanel.current = false;
    };
    window.addEventListener("keydown", captureEscape, true);
    window.addEventListener("keyup", releaseEscape);
    return () => {
      window.removeEventListener("keydown", captureEscape, true);
      window.removeEventListener("keyup", releaseEscape);
    };
  }, [panel]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement;
      if (
        element.closest("input, textarea, select, [contenteditable=true]") ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        panel
      )
        return;
      if (event.key === " " && element.closest("button, a")) return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        move(1);
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1);
      }
      if (["m", "g"].includes(event.key.toLowerCase())) setPanel("outline");
      if (event.key.toLowerCase() === "n") setPanel("notes");
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
      if (event.key === "?") setPanel("help");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, panel, toggleFullscreen]);

  return (
    <div
      ref={stageRef}
      className={`studio ${cover ? "studio-cover" : ""} ${fullscreen ? "studio-fullscreen" : ""}`}
    >
      <aside className="studio-rail" aria-label="Workshop navigation">
        <Link href="/" className="studio-mark" aria-label="Blockchain Lab home">
          <Blocks size={25} strokeWidth={1.5} />
        </Link>
        <div className="rail-tools">
          <button
            className="rail-button active"
            onClick={() => setPanel("outline")}
            aria-label="Workshop outline"
            title="Workshop outline (M)"
          >
            <Grid2X2 size={20} />
          </button>
          <Link
            className="rail-button"
            href="/simulations"
            aria-label="Explore labs"
            title="Explore labs"
          >
            <FlaskConical size={20} />
          </Link>
          <button
            className="rail-button"
            onClick={() => setPanel("notes")}
            aria-label="Presenter notes"
            title="Presenter notes (N)"
          >
            <FileText size={19} />
          </button>
        </div>
        <button
          className="rail-button rail-help"
          onClick={() => setPanel("help")}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <Command size={19} />
        </button>
        <span className="rail-edition">LAB / 01</span>
      </aside>
      <div className="studio-workspace">
        <header className="studio-topbar">
          <Link href="/" className="wordmark">
            blockchain<span>lab</span>
            <span className="wordmark-period">.</span>
          </Link>
          <div className="topbar-center">
            <span className="topbar-divider" />
            <span>One-day workshop</span>
          </div>
          <div className="topbar-actions">
            <Link href="/workshop">
              Student kit <ArrowUpRight size={14} />
            </Link>
            <Link href="/simulations">
              Explore the labs <ArrowUpRight size={14} />
            </Link>
            <button
              className="icon-button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title="Fullscreen (F)"
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              <span className="present-button-label">
                {fullscreen ? "Exit" : "Present"}
              </span>
            </button>
          </div>
        </header>
        <main className="studio-main">
          <div className="lesson-context">
            <button onClick={() => setPanel("outline")}>
              <span className="context-index">
                {String(moduleInfo.id).padStart(2, "0")}
              </span>
              {moduleInfo.shortTitle}
              <ChevronRight size={13} />
            </button>
            <span className="lesson-position">
              {cover
                ? "Presenter-led · 6 chapters"
                : `${slide.quiz ? "Knowledge check" : slide.simulationType ? "Hands-on lab" : "The lesson"} / ${String(slide.slideNumber).padStart(2, "0")}`}
            </span>
          </div>
          <section
            className={`lesson-stage ${cover ? "cover-stage" : ""} ${slide.simulationType ? "lab-stage" : ""}`}
            aria-label={`Slide ${slide.slideNumber}: ${editorial.title}`}
          >
            {cover ? (
              <TitleSlide />
            ) : slide.simulationType ? (
              <>
                <div className="lab-heading">
                  <div>
                    <span className="eyebrow">
                      Experiment / {lab?.topic || "Blockchain"}
                    </span>
                    <h1>{editorial.title}</h1>
                    <p>{editorial.idea}</p>
                  </div>
                  {lab && (
                    <Link className="studio-button secondary" href={lab.route}>
                      Open lab <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
                <div className="simulation-surface" key={slide.id}>
                  <Simulation type={slide.simulationType} />
                </div>
              </>
            ) : slide.quiz ? (
              <div className="quiz-layout" key={slide.id}>
                <div className="quiz-intro">
                  <span className="eyebrow">
                    Vote first · explain your reasoning
                  </span>
                  <h1>{editorial.title}</h1>
                  <p>{editorial.idea}</p>
                  <WorkshopQuizMotif moduleId={slide.moduleId} />
                </div>
                <div className="quiz-body">
                  <h2>{slide.quiz.question}</h2>
                  <div className="quiz-options">
                    {slide.quiz.options.map((option, i) => (
                      <button
                        key={i}
                        disabled={submitted}
                        aria-pressed={answer === i}
                        onClick={() => setAnswer(i)}
                        className={`quiz-option ${answer === i ? "selected" : ""} ${submitted && i === slide.quiz!.correctIndex ? "correct" : ""} ${submitted && answer === i && i !== slide.quiz!.correctIndex ? "incorrect" : ""}`}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{option}</span>
                        {submitted && i === slide.quiz!.correctIndex ? (
                          <CheckCircle2 size={20} />
                        ) : submitted && answer === i ? (
                          <XCircle size={20} />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  {submitted ? (
                    <div className="quiz-feedback" role="status">
                      <strong>
                        {answer === slide.quiz.correctIndex
                          ? "That's right."
                          : "Let's look at why."}
                      </strong>
                      <p>{slide.quiz.explanation}</p>
                      <button
                        className="text-button"
                        onClick={() => {
                          setAnswer(null);
                          setSubmitted(false);
                        }}
                      >
                        Try again <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="studio-button primary"
                      disabled={answer === null}
                      onClick={() => setSubmitted(true)}
                    >
                      Reveal the reasoning <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <WorkshopSlide
                key={slide.id}
                slide={slide}
                onDetails={() => setPanel("details")}
              />
            )}
          </section>
          <footer className="lesson-controls">
            <button
              className="previous-button"
              disabled={index === 0}
              onClick={() => move(-1)}
              aria-label="Previous slide"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div
              className="chapter-progress"
              aria-label={`Slide ${index + 1} of ${PRESENTATION_SLIDES.length}`}
            >
              <div className="chapter-segments">
                {WORKSHOP_MODULES.map((m) => (
                  <button
                    key={m.id}
                    title={m.title}
                    aria-label={`Go to ${m.title}`}
                    className={
                      slide.moduleId === m.id
                        ? "current"
                        : slide.moduleId > m.id
                          ? "complete"
                          : ""
                    }
                    onClick={() => goTo(m.slideRange[0] - 1)}
                  >
                    <span
                      style={{
                        width: `${slide.moduleId > m.id ? 100 : slide.moduleId === m.id ? ((slide.slideNumber - m.slideRange[0] + 1) / (m.slideRange[1] - m.slideRange[0] + 1)) * 100 : 0}%`,
                      }}
                    />
                  </button>
                ))}
              </div>
              <span>
                {String(index + 1).padStart(2, "0")}{" "}
                <span>/ {PRESENTATION_SLIDES.length}</span>
              </span>
            </div>
            <button
              className="next-button"
              disabled={index === PRESENTATION_SLIDES.length - 1}
              onClick={() => move(1)}
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          </footer>
          <div className="studio-colophon">
            <span>Built to be understood.</span>
            <button onClick={() => setPanel("help")}>
              <Command size={12} /> Keyboard shortcuts
            </button>
          </div>
        </main>
      </div>
      {panel && (
        <Dialog
          title={
            panel === "outline"
              ? "Your learning path"
              : panel === "notes"
                ? "Presenter notes"
                : panel === "help"
                  ? "At your fingertips"
                  : "A closer look"
          }
          close={() => setPanel(null)}
          wide={panel === "outline"}
        >
          {panel === "outline" ? (
            <div className="outline-modules">
              <Link className="text-button" href="/workshop">
                Day schedule & student downloads <ArrowUpRight size={14} />
              </Link>
              {WORKSHOP_MODULES.map((m) => (
                <section key={m.id}>
                  <div className="outline-module-title">
                    <span>{String(m.id).padStart(2, "0")}</span>
                    <h3>{m.title}</h3>
                    <span>{m.durationMinutes} min</span>
                  </div>
                  <div className="outline-lessons">
                    {PRESENTATION_SLIDES.filter((s) => s.moduleId === m.id).map(
                      (s) => (
                        <button
                          key={s.id}
                          className={
                            s.slideNumber === slide.slideNumber ? "active" : ""
                          }
                          onClick={() => goTo(s.slideNumber - 1)}
                        >
                          <span>{String(s.slideNumber).padStart(2, "0")}</span>
                          <span>
                            {LESSON_EDITORIAL[s.slideNumber - 1].title}
                          </span>
                          {s.simulationType ? (
                            <FlaskConical size={14} />
                          ) : s.quiz ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <ArrowUpRight size={13} />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </div>
          ) : panel === "help" ? (
            <div className="shortcut-list">
              {[
                ["Next slide", "→ / Space"],
                ["Previous slide", "←"],
                ["Workshop outline", "M / G"],
                ["Presenter notes", "N"],
                ["Fullscreen", "F"],
                ["Keyboard shortcuts", "?"],
                ["Close dialog", "Esc"],
              ].map(([action, key]) => (
                <div key={action}>
                  <span>{action}</span>
                  <kbd>{key}</kbd>
                </div>
              ))}
            </div>
          ) : panel === "notes" ? (
            <div className="lesson-detail">
              <span className="eyebrow">
                Slide {slide.slideNumber} / {moduleInfo.shortTitle}
              </span>
              <h3>{editorial.title}</h3>
              <p>{slide.speakerNotes}</p>
              {BEGINNER_LESSONS[index].activity && (
                <div className="presenter-activity">
                  <strong>{BEGINNER_LESSONS[index].activity!.label}</strong>
                  <p>{BEGINNER_LESSONS[index].activity!.prompt}</p>
                  <p>{BEGINNER_LESSONS[index].activity!.answer}</p>
                </div>
              )}
              <Link className="text-button" href="/workshop/instructor">
                Instructor guide & troubleshooting <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="lesson-detail">
              <span className="eyebrow">
                Slide {slide.slideNumber} / {moduleInfo.shortTitle}
              </span>
              <h3>{slide.title}</h3>
              {slide.content.lead && <p>{slide.content.lead}</p>}
              {slide.content.points?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {slide.content.comparison && (
                <div className="detail-comparison">
                  {["left", "right"].map((side) => {
                    const content = slide.content.comparison!;
                    return (
                      <section key={side}>
                        <h4>
                          {side === "left"
                            ? content.leftTitle
                            : content.rightTitle}
                        </h4>
                        <ul>
                          {(side === "left"
                            ? content.leftItems
                            : content.rightItems
                          ).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              )}
              {slide.content.codeSnippet && (
                <div className="studio-code">
                  <div>
                    <span>
                      {slide.content.codeSnippet.filename ||
                        slide.content.codeSnippet.language}
                    </span>
                    <button
                      onClick={async () => {
                        setCopied(
                          await copyToClipboard(
                            slide.content.codeSnippet!.code,
                          ),
                        );
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre>
                    <code>{slide.content.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
              {slide.content.quote && (
                <blockquote>{slide.content.quote}</blockquote>
              )}
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
}
