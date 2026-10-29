"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { QuizAvatar } from "./QuizAvatar";
import { QuizBrowserHelp } from "./QuizBrowserHelp";
import {
  quizRequest as api,
  QuizRequestError,
  isScannerBrowser,
} from "@/lib/live-quiz/client";
import { QuizLeaveDialog, useQuizLeaveGuard } from "./useQuizLeaveGuard";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Flag,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  QUIZ_PACKS,
  type QuizSession,
  type QuizState,
} from "@/lib/live-quiz/types";
import { copyToClipboard } from "@/lib/utils";

const storageKey = (host: boolean) =>
  `blockchain-live-quiz:${host ? "host" : "player"}`;
const newToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
type ApiError = Error & { status?: number };

export function LiveQuiz({ host = false }: { host?: boolean }) {
  const [ready, setReady] = useState(false),
    [configured, setConfigured] = useState<boolean | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null),
    [state, setState] = useState<QuizState | null>(null);
  const [code, setCode] = useState(""),
    [name, setName] = useState(""),
    [password, setPassword] = useState("");
  const [pack, setPack] = useState("foundations"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [connection, setConnection] = useState("Connecting"),
    [now, setNow] = useState(0);
  const [copied, setCopied] = useState(false),
    [confirmEnd, setConfirmEnd] = useState(false);
  const [selected, setSelected] = useState<number | null>(null),
    [joinUrl, setJoinUrl] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [presenting, setPresenting] = useState(false);
  const [scannerBrowser, setScannerBrowser] = useState(false),
    [networkHelp, setNetworkHelp] = useState(false);
  const clock = useRef({ time: 0, at: 0 }),
    latest = useRef<QuizState | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const joinToken = useRef("");
  const currentSession = useRef(session);
  currentSession.current = session;
  async function togglePresentation() {
    if (presenting) {
      setPresenting(false);
      if (document.fullscreenElement)
        await document.exitFullscreen().catch(() => {});
    } else {
      setPresenting(true);
      // Keep the larger presentation layout if the browser blocks fullscreen.
      await document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }
  useEffect(() => {
    setScannerBrowser(isScannerBrowser(navigator.userAgent));
    const onFullscreen = () =>
      setPresenting(Boolean(document.fullscreenElement));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPresenting(false);
        if (document.fullscreenElement)
          void document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const accept = useCallback((value: QuizState, started: number) => {
    if (
      latest.current &&
      latest.current.code === value.code &&
      (latest.current.revision > value.revision ||
        (latest.current.revision === value.revision &&
          latest.current.serverNow > value.serverNow))
    )
      return;
    latest.current = value;
    clock.current = {
      time: value.serverNow + Math.min(1000, (performance.now() - started) / 2),
      at: performance.now(),
    };
    setNow(clock.current.time);
    setState(value);
    setConnection("Connected");
  }, []);
  useEffect(() => {
    const requestedCode =
      new URLSearchParams(window.location.search)
        .get("code")
        ?.replace(/\D/g, "")
        .slice(0, 6) || "";
    setCode(requestedCode);
    try {
      const saved = JSON.parse(
        localStorage.getItem(storageKey(host)) || "null",
      );
      if (
        saved &&
        /^\d{6}$/.test(saved.code) &&
        /^[a-f0-9]{64}$/.test(saved.token) &&
        saved.role === (host ? "host" : "player") &&
        (host || !requestedCode || requestedCode === saved.code)
      )
        setSession(saved);
      joinToken.current =
        localStorage.getItem("blockchain-live-quiz:join-token") || newToken();
      localStorage.setItem(
        "blockchain-live-quiz:join-token",
        joinToken.current,
      );
    } catch {
      joinToken.current = newToken();
    }
    setReady(true);
    fetch("/api/quiz", { cache: "no-store" })
      .then((r) => r.json())
      .then((r) => setConfigured(Boolean(r.configured)))
      .catch(() => {
        setNetworkHelp(true);
        setError(
          "Could not connect. Open this page in Chrome or Safari if you are using a QR scanner.",
        );
      });
  }, [host]);
  useEffect(() => {
    if (!host || !joinUrl) return;
    let active = true;
    QRCode.toDataURL(joinUrl, {
      width: 360,
      margin: 3,
      errorCorrectionLevel: "M",
      color: { dark: "#142d46", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setQrImage(url);
      })
      .catch(() => {
        if (active) setQrImage("");
      });
    return () => {
      active = false;
    };
  }, [host, joinUrl]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (clock.current.time)
        setNow(clock.current.time + performance.now() - clock.current.at);
    }, 100);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!session) return;
    setJoinUrl(`${window.location.origin}/quiz?code=${session.code}`);
    let stopped = false,
      polling = false,
      timer: ReturnType<typeof setTimeout>,
      failures = 0;
    const controller = new AbortController();
    const poll = async () => {
      if (stopped || polling) return;
      polling = true;
      let delay = 1800;
      try {
        const start = performance.now();
        const value = await api(
          session.token,
          { action: "state", code: session.code },
          controller.signal,
        );
        if (stopped) return;
        accept(value, start);
        failures = 0;
        if (value.phase === "finished") return;
        delay =
          value.phase === "countdown"
            ? 400
            : value.phase === "question"
              ? Math.max(
                  200,
                  Math.min(2500, value.endsAt - value.serverNow + 100),
                )
              : 1800;
      } catch (e) {
        if (stopped) return;
        const failure = e as ApiError;
        if ([401, 403, 404].includes(failure.status || 0)) {
          setError(failure.message);
          setConnection("Session ended");
          setSession(null);
          setState(null);
          latest.current = null;
          try {
            localStorage.removeItem(storageKey(host));
          } catch {
            /* storage may be disabled */
          }
          return;
        }
        failures++;
        setConnection("Reconnecting");
        delay = Math.min(10000, 1800 * failures);
      } finally {
        polling = false;
      }
      if (!stopped) timer = setTimeout(poll, delay + Math.random() * 150);
    };
    void poll();
    const onVisible = () => {
      if (document.visibilityState === "visible" && !polling) {
        clearTimeout(timer);
        timer = setTimeout(poll, 100);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [session, host, accept]);
  useEffect(() => {
    setSelected(null);
    if (state) setError("");
  }, [state?.index]);
  useEffect(() => {
    if (state?.phase === "leaderboard" || state?.phase === "finished")
      resultsRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
    if (state?.phase === "countdown")
      window.scrollTo({ top: 0, behavior: "instant" });
  }, [state?.phase]);

  function saveSession(value: QuizSession) {
    setSession(value);
    try {
      localStorage.setItem(storageKey(host), JSON.stringify(value));
    } catch {
      /* session continues until reload */
    }
  }
  function leave() {
    setSession(null);
    setState(null);
    latest.current = null;
    setError("");
    setConfirmEnd(false);
    try {
      localStorage.removeItem(storageKey(host));
    } catch {
      /* storage may be disabled */
    }
  }
  const leaveGuard = useQuizLeaveGuard(
    Boolean(session && state?.phase !== "finished"),
    session ? `${session.role}:${session.code}` : "",
    leave,
  );
  async function enter(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNetworkHelp(false);
    try {
      const token = host ? newToken() : joinToken.current || newToken();
      const start = performance.now();
      const result = await api(
        token,
        host
          ? { action: "create", pack, password }
          : { action: "join", code, name },
      );
      latest.current = null;
      accept(result, start);
      setPassword("");
      saveSession({ code: result.code, token, role: host ? "host" : "player" });
    } catch (e) {
      setNetworkHelp(e instanceof QuizRequestError && e.code === "network");
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function action(
    actionName: string,
    extra: Record<string, unknown> = {},
  ) {
    if (!session || busy) return;
    setBusy(true);
    setError("");
    try {
      const start = performance.now();
      const result = await api(session.token, {
        action: actionName,
        code: session.code,
        index: state?.index,
        ...extra,
      });
      if (currentSession.current?.token === session.token)
        accept(result, start);
      setConfirmEnd(false);
    } catch (e) {
      if (actionName === "answer") setSelected(null);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function download() {
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      const result = await api(session.token, {
        action: "export",
        code: session.code,
      });
      const cell = (v: string | number) =>
        `"${String(v)
          .replace(/^[=+\-@\t\r]/, "'$&")
          .replaceAll('"', '""')}"`;
      const csv = [
        "Rank,Name,Score,Correct answers",
        ...result.standings.map((p) =>
          [p.rank, p.name, p.score, p.correct].map(cell).join(","),
        ),
      ].join("\r\n");
      const url = URL.createObjectURL(
        new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-${session.code}-results.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const reveal = state?.phase === "leaderboard" || state?.phase === "finished";
  const seconds = state
    ? Math.max(
        0,
        Math.ceil(
          ((state.phase === "countdown" ? state.startsAt : state.endsAt) -
            now) /
            1000,
        ),
      )
    : 0;
  const answered = state?.me?.answer != null;
  const canAnswer =
    !host &&
    state?.phase === "question" &&
    seconds > 0 &&
    !answered &&
    !busy &&
    connection === "Connected";
  const me = state?.me;

  return (
    <div
      className={`live-quiz ${host ? "quiz-host" : "quiz-player"} ${presenting ? "quiz-presenting" : ""}`}
    >
      {leaveGuard.pending && (
        <QuizLeaveDialog
          host={host}
          cancel={leaveGuard.cancel}
          confirm={leaveGuard.confirm}
        />
      )}
      <header className="quiz-header">
        <Link href="/" className="wordmark">
          blockchain<span>lab.</span>
        </Link>
        <span className="quiz-header-label">Live quiz</span>
        <nav aria-label="Quiz navigation">
          {host && (
            <button
              className="quiz-present-button"
              onClick={() => void togglePresentation()}
              aria-pressed={presenting}
            >
              {presenting ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              {presenting ? "Exit presentation" : "Present"}
            </button>
          )}
          <Link href="/">
            <ArrowLeft size={15} /> Workshop
          </Link>
          <Link href={host ? "/quiz" : "/quiz/host"}>
            {host ? "Join as a student" : "Host a quiz"}
          </Link>
        </nav>
      </header>
      <main className="quiz-main">
        {error && (
          <div className="quiz-alert" role="alert">
            {error}
            <button aria-label="Dismiss message" onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}
        {!ready ? (
          <div className="quiz-loading">
            <Loader2 className="quiz-spin" /> Opening the quiz…
          </div>
        ) : !session ? (
          <div className="quiz-entry">
            <div className="quiz-entry-story">
              <span className="quiz-kicker">The workshop challenge</span>
              <h1>
                {host ? (
                  <>
                    Bring the room
                    <br />
                    into the game.
                  </>
                ) : (
                  <>
                    One question.
                    <br />
                    Fifteen seconds.
                  </>
                )}
              </h1>
              <p>
                {host
                  ? "Choose your questions. Let everyone join. You set the pace."
                  : "Answer correctly. Think quickly. Watch your name climb."}
              </p>
              <div className="quiz-sample" aria-hidden="true">
                <span>01</span>
                <div className="quiz-sample-line" />
                <strong>YOU</strong>
                <span>+95</span>
              </div>
              <div className="quiz-entry-rules">
                <span>
                  <Users size={17} /> Built for your workshop
                </span>
                <span>
                  <Trophy size={17} /> Up to 100 points per answer
                </span>
              </div>
            </div>
            <form className="quiz-entry-card" onSubmit={enter}>
              {!host && (scannerBrowser || networkHelp) && <QuizBrowserHelp />}
              <span className="quiz-kicker">
                {host ? "Presenter desk" : "You’re in the right place"}
              </span>
              <h2>{host ? "Open a quiz room" : "Join the live quiz"}</h2>
              {configured === false && (
                <div className="quiz-setup" role="status">
                  {host ? (
                    <>
                      Live quiz needs a one-time setup. Connect Redis and set
                      the host password in Vercel.{" "}
                      <a href="/quiz-setup.md" target="_blank" rel="noreferrer">
                        Read the setup guide ↗
                      </a>
                    </>
                  ) : (
                    "The host is setting up live quizzes. Please come back shortly."
                  )}
                </div>
              )}
              {host ? (
                <>
                  <label>
                    Question set
                    <select
                      value={pack}
                      onChange={(e) => setPack(e.target.value)}
                    >
                      {QUIZ_PACKS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} · {p.count} questions
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="quiz-field-note">
                    {QUIZ_PACKS.find((p) => p.id === pack)?.description}
                  </p>
                  <label>
                    Host password
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your private host password"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Room code
                    <input
                      className="quiz-code-input"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      autoComplete="off"
                      placeholder="000000"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                    />
                  </label>
                  <label>
                    Your name
                    <input
                      required
                      minLength={2}
                      maxLength={24}
                      autoComplete="nickname"
                      placeholder="Name or nickname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <p className="quiz-field-note">
                    Your name appears on the leaderboard. No account needed.
                  </p>
                </>
              )}
              <button
                className="quiz-button quiz-primary"
                disabled={busy || configured !== true}
              >
                {busy ? (
                  <Loader2 className="quiz-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
                {host ? "Create room" : "Join quiz"}
              </button>
              <p className="quiz-field-note">
                15 seconds per question · Faster correct answers earn more
              </p>
            </form>
          </div>
        ) : !state ? (
          <div className="quiz-loading">
            <Loader2 className="quiz-spin" /> Rejoining your room…{" "}
            <button onClick={leave}>Join another room</button>
          </div>
        ) : (
          <>
            <div className="quiz-session-bar">
              <span
                className={`quiz-connection ${connection === "Connected" ? "connected" : ""}`}
                role="status"
              >
                {connection}
              </span>
              <span>
                ROOM <b>{state.code}</b>
              </span>
              <span>
                <Users size={16} /> {state.count} joined
              </span>
              {!host && me && (
                <span>
                  <QuizAvatar seed={me.id} size={26} />
                  {me.name} · <b>{me.score.toLocaleString()} pts</b>
                </span>
              )}
            </div>
            {state.phase === "lobby" ? (
              <section className="quiz-lobby">
                <div className="quiz-lobby-stage">
                  <span className="quiz-kicker">{state.title}</span>
                  <h1>
                    {host
                      ? "Ready when you are."
                      : `You’re in, ${me?.name || name}.`}
                  </h1>
                  {!host && me && (
                    <div className="quiz-welcome-avatar">
                      <QuizAvatar seed={me.id} size={94} />
                    </div>
                  )}
                  <p>
                    {host
                      ? "Join on your phone. Keep this screen open."
                      : "Keep this page open. Your host will start the first question."}
                  </p>
                  <div className="quiz-room-access">
                    <div
                      className="quiz-room-code"
                      aria-label={`Room code ${state.code}`}
                    >
                      <span>ROOM CODE</span>
                      <strong>{state.code}</strong>
                    </div>
                    {host && qrImage && (
                      <a
                        className="quiz-qr"
                        href={joinUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          src={qrImage}
                          width={180}
                          height={180}
                          unoptimized
                          alt={`Scan to join quiz room ${state.code}`}
                        />
                        <span>Scan to join</span>
                      </a>
                    )}
                  </div>
                  {host && (
                    <button
                      className="quiz-copy"
                      onClick={async () => {
                        try {
                          await copyToClipboard(joinUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        } catch {
                          setError("Copy this join link from the text below.");
                        }
                      }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Link copied" : "Copy join link"}
                    </button>
                  )}
                  {host && <p className="quiz-join-url">{joinUrl}</p>}
                  {!host && (
                    <div className="quiz-waiting">
                      <span /> Waiting for the host
                    </div>
                  )}
                </div>
                <aside className="quiz-lobby-side">
                  <div className="quiz-lobby-count">
                    <strong>{state.count}</strong>
                    <span>
                      participants joined
                      <br />
                      room for {state.capacity}
                    </span>
                  </div>
                  {host ? (
                    <>
                      <div className="quiz-roster" aria-label="Participants">
                        {state.players.length ? (
                          state.players.map((p) => (
                            <span key={p.id}>
                              <QuizAvatar seed={p.id} size={27} />
                              {p.name}
                              <button
                                aria-label={`Remove ${p.name}`}
                                disabled={busy}
                                onClick={() =>
                                  void action("remove", { playerId: p.id })
                                }
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <p>Names appear here as students join.</p>
                        )}
                      </div>
                      <button
                        className="quiz-button quiz-primary"
                        disabled={
                          busy || !state.count || connection !== "Connected"
                        }
                        onClick={() => void action("advance")}
                      >
                        <Play size={18} /> Start quiz
                      </button>
                      <p className="quiz-field-note">
                        {state.total} questions · 5-second countdown before each
                      </p>
                    </>
                  ) : (
                    <div className="quiz-player-rules">
                      <h2>Here’s how to play</h2>
                      <p>Choose one answer in 15 seconds.</p>
                      <p>Correct answers earn 50–100 points.</p>
                      <p>See the leaderboard after every question.</p>
                    </div>
                  )}
                </aside>
              </section>
            ) : state.phase === "countdown" ? (
              <section
                className="quiz-countdown"
                aria-label="Question countdown"
              >
                <span className="quiz-kicker">
                  Question {state.index + 1} of {state.total}
                </span>
                <h1>Get ready.</h1>
                <strong>{seconds || "GO"}</strong>
                <p>The question will appear for everyone.</p>
              </section>
            ) : (
              <>
                {!reveal && (
                  <section className="quiz-question-stage">
                    <div className="quiz-question-top">
                      <span className="quiz-kicker">
                        Question {state.index + 1} / {state.total}
                      </span>
                      {!reveal && (
                        <div
                          className={`quiz-timer ${seconds <= 5 ? "urgent" : ""}`}
                          aria-label={`${seconds} seconds remaining`}
                        >
                          <strong>{seconds}</strong>
                          <span>seconds</span>
                        </div>
                      )}
                      {reveal && (
                        <span className="quiz-round-closed">
                          <Check size={16} /> Answers closed
                        </span>
                      )}
                    </div>
                    <h1>{state.question?.question}</h1>
                    <div className="quiz-options">
                      {state.question?.options.map((option, i) => {
                        const correct =
                          reveal && state.question?.correctIndex === i;
                        const chosen =
                          me?.answer === i || (!answered && selected === i);
                        return (
                          <button
                            key={i}
                            className={`quiz-option option-${i} ${correct ? "correct" : ""} ${chosen ? "chosen" : ""} ${reveal && chosen && !correct ? "wrong" : ""}`}
                            disabled={!canAnswer}
                            onClick={() => {
                              setSelected(i);
                              void action("answer", { option: i });
                            }}
                          >
                            <span className="quiz-option-letter">
                              {"ABCD"[i]}
                            </span>
                            <span>{option}</span>
                            {correct && <Check size={21} />}
                            {chosen && !reveal && (
                              <span className="quiz-chosen-label">
                                {answered ? "Locked" : "Sending…"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!reveal ? (
                      <div className="quiz-answer-status" role="status">
                        {host
                          ? `${state.answered} / ${state.count} answers received`
                          : answered
                            ? "Answer locked. The result appears when the timer ends."
                            : busy
                              ? "Sending your answer…"
                              : seconds === 0
                                ? "Time’s up. Getting the results…"
                                : "Choose one answer. Your first answer is final."}
                      </div>
                    ) : (
                      <p className="quiz-explanation">
                        {state.question?.explanation}
                      </p>
                    )}
                    {!reveal && (
                      <div className="quiz-time-track">
                        <div
                          style={{
                            width: `${Math.min(100, ((seconds * 1000) / state.duration) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </section>
                )}
                {reveal && (
                  <section className="quiz-results" ref={resultsRef}>
                    <div className="quiz-results-heading">
                      <div>
                        <span className="quiz-kicker">
                          {state.phase === "finished"
                            ? "The final standings"
                            : `After question ${state.index + 1}`}
                        </span>
                        <h2>
                          <Trophy size={27} />{" "}
                          {state.phase === "finished"
                            ? "Quiz complete."
                            : "Leaderboard"}
                        </h2>
                      </div>
                      {!host && me && (
                        <div className="quiz-my-result">
                          <strong>
                            {state.phase === "finished"
                              ? `${me.score.toLocaleString()} pts`
                              : `+${me.points ?? 0}`}
                          </strong>
                          <span>
                            {state.phase === "finished"
                              ? `${me.correct} correct answers`
                              : me.answer == null
                                ? "No answer this round"
                                : me.points
                                  ? "Correct answer"
                                  : "Keep going — next question awaits"}
                          </span>
                          <span>Rank #{me.rank}</span>
                        </div>
                      )}
                    </div>
                    {state.phase === "leaderboard" && state.question && (
                      <details className="quiz-answer-review">
                        <summary>
                          <Check size={17} /> Correct answer:{" "}
                          {state.question.options[state.question.correctIndex!]}
                        </summary>
                        <p>
                          <strong>{state.question.question}</strong>
                        </p>
                        <p>{state.question.explanation}</p>
                      </details>
                    )}
                    <ol
                      className={`quiz-leaderboard ${state.standings.length > 5 ? "has-many" : ""}`}
                    >
                      {state.standings.map((p) => (
                        <li
                          key={p.id}
                          className={me?.id === p.id ? "is-me" : ""}
                        >
                          <span className="quiz-rank">
                            {p.rank === 1 ? (
                              <Trophy size={20} />
                            ) : (
                              String(p.rank).padStart(2, "0")
                            )}
                          </span>
                          <strong>
                            <QuizAvatar seed={p.id} size={38} />
                            {p.name}
                            {me?.id === p.id && <small>YOU</small>}
                          </strong>
                          <span>
                            {p.score.toLocaleString()} <small>pts</small>
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="quiz-results-footer">
                      <span>Top 10 · Equal scores share a rank</span>
                      {host ? (
                        <div className="quiz-actions">
                          <button
                            className="quiz-button quiz-secondary"
                            disabled={busy}
                            onClick={() => void download()}
                          >
                            <Download size={16} /> Results CSV
                          </button>
                          {state.phase === "finished" ? (
                            <button
                              className="quiz-button quiz-primary"
                              onClick={leave}
                            >
                              New quiz <ArrowRight size={17} />
                            </button>
                          ) : (
                            <button
                              className="quiz-button quiz-primary"
                              disabled={busy || connection !== "Connected"}
                              onClick={() => void action("advance")}
                            >
                              {state.index + 1 === state.total
                                ? "Finish quiz"
                                : "Next question"}
                              <ArrowRight size={17} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span>
                          {state.phase === "finished"
                            ? "Thanks for playing."
                            : "Waiting for your host to continue…"}
                        </span>
                      )}
                    </div>
                  </section>
                )}
              </>
            )}
            <footer className="quiz-session-footer">
              <span>{state.title}</span>
              {host && state.phase !== "finished" ? (
                confirmEnd ? (
                  <div className="quiz-end-confirm">
                    <span>End the quiz for everyone?</span>
                    <button onClick={() => void action("end")} disabled={busy}>
                      End quiz
                    </button>
                    <button onClick={() => setConfirmEnd(false)}>
                      Keep playing
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmEnd(true)}>
                    <Flag size={14} /> End quiz
                  </button>
                )
              ) : (
                <button onClick={leaveGuard.requestLeave}>Leave room</button>
              )}
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
