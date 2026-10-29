import type { QuizState } from "./types";

export class QuizRequestError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: "network" | "response",
  ) {
    super(message);
    this.name = "QuizRequestError";
  }
}

// Older scanner webviews do not always implement AbortSignal.timeout/any.
// A plain AbortController works in those browsers as well as Chrome/Safari.
export async function quizRequest(
  token: string,
  body: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<QuizState> {
  const attempts = body.action === "join" ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(abort, body.action === "join" ? 15000 : 10000);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      });
      let result;
      try {
        result = await response.json();
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        throw new QuizRequestError(
          "The quiz service did not respond normally. Reload this page and try again.",
          response.status,
          "response",
        );
      }
      if (!response.ok)
        throw new QuizRequestError(
          result.error || "The quiz could not be reached. Try again.",
          response.status,
          "response",
        );
      return {
        ...result,
        standings: Array.isArray(result.standings) ? result.standings : [],
        players: Array.isArray(result.players) ? result.players : [],
      };
    } catch (error) {
      if (error instanceof QuizRequestError || signal?.aborted) throw error;
      // The same participant credential makes joining idempotent, including
      // when the first request succeeded but its response was lost.
      if (attempt + 1 < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
      throw new QuizRequestError(
        "Could not connect to the quiz. Check your connection. If you scanned a QR code, open this link in Chrome or Safari and try again.",
        undefined,
        "network",
      );
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }
  throw new QuizRequestError(
    "Could not connect to the quiz.",
    undefined,
    "network",
  );
}

export function isScannerBrowser(userAgent: string) {
  return /FBAN|FBAV|Instagram|MicroMessenger|Line\/|GSA\/|;\s*wv\)|Version\/4\.0.*Chrome/i.test(
    userAgent,
  );
}

export function chromeJoinIntent(joinUrl: string) {
  const url = new URL(joinUrl);
  if (!/^https?:$/.test(url.protocol)) return "";
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${url.protocol.slice(0, -1)};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`;
}
