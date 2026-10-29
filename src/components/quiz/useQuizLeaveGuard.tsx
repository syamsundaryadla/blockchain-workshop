"use client";
import { useEffect, useRef, useState } from "react";

type Pending = { kind: "back" | "link" | "room"; href?: string };
export function useQuizLeaveGuard(
  active: boolean,
  roomKey: string,
  leaveRoom: () => void,
) {
  const [pending, setPending] = useState<Pending | null>(null);
  const allowed = useRef(false),
    canGoBack = useRef(false),
    leave = useRef(leaveRoom);
  leave.current = leaveRoom;
  useEffect(() => {
    if (!active) return;
    allowed.current = false;
    const existing = history.state?.__quizGuard;
    canGoBack.current = existing
      ? Boolean(existing.canGoBack)
      : history.length > 1;
    const marker = { key: roomKey, canGoBack: canGoBack.current };
    const pushGuard = () =>
      history.pushState(
        { ...history.state, __quizGuard: marker },
        "",
        window.location.href,
      );
    if (existing)
      history.replaceState(
        { ...history.state, __quizGuard: marker },
        "",
        window.location.href,
      );
    else pushGuard();
    const onPop = () => {
      if (allowed.current) return;
      pushGuard();
      setPending((current) => current || { kind: "back" });
    };
    const onUnload = (event: BeforeUnloadEvent) => {
      if (allowed.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const onLink = (event: MouseEvent) => {
      if (
        allowed.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const destination = new URL(anchor.href, location.href);
      if (
        destination.href === location.href ||
        (destination.protocol !== "http:" && destination.protocol !== "https:")
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setPending({ kind: "link", href: destination.href });
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onLink, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onLink, true);
    };
  }, [active, roomKey]);
  return {
    pending,
    requestLeave: () =>
      active ? setPending({ kind: "room" }) : leave.current(),
    cancel: () => setPending(null),
    confirm: () => {
      if (!pending) return;
      allowed.current = true;
      setPending(null);
      if (pending.kind === "room") {
        leave.current();
        allowed.current = false;
      } else if (pending.kind === "link") window.location.assign(pending.href!);
      else if (canGoBack.current) history.go(-2);
      else window.location.assign("/");
    },
  };
}

export function QuizLeaveDialog({
  host,
  cancel,
  confirm,
}: {
  host: boolean;
  cancel: () => void;
  confirm: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div
      className="quiz-leave-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) cancel();
      }}
    >
      <div
        ref={ref}
        className="quiz-leave-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-leave-title"
        aria-describedby="quiz-leave-description"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
          if (event.key === "Tab") {
            const buttons = ref.current?.querySelectorAll("button");
            if (!buttons?.length) return;
            if (event.shiftKey && document.activeElement === buttons[0]) {
              event.preventDefault();
              buttons[buttons.length - 1].focus();
            } else if (
              !event.shiftKey &&
              document.activeElement === buttons[buttons.length - 1]
            ) {
              event.preventDefault();
              buttons[0].focus();
            }
          }
        }}
      >
        <span className="quiz-kicker">Your quiz is still active</span>
        <h2 id="quiz-leave-title">
          {host ? "Leave the host screen?" : "Leave this quiz?"}
        </h2>
        <p id="quiz-leave-description">
          {host
            ? "The room will stay live. Reopen this quiz in the same browser to continue hosting."
            : "A running question’s timer keeps going. You can rejoin using this browser."}
        </p>
        <div className="quiz-actions">
          <button className="quiz-button quiz-primary" onClick={cancel}>
            Stay in quiz
          </button>
          <button className="quiz-button quiz-secondary" onClick={confirm}>
            Leave quiz
          </button>
        </div>
      </div>
    </div>
  );
}
