import { randomInt, randomUUID } from "node:crypto";
import { QUIZ_SCRIPT, RATE_LIMIT_SCRIPT } from "@/lib/live-quiz/engine";
import { questionsForPack } from "@/lib/live-quiz/questions.server";
import { QUIZ_PACKS } from "@/lib/live-quiz/types";
import {
  hashSecret,
  quizConfigured,
  redisCommand,
  validAdminPassword,
} from "@/lib/live-quiz/redis.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;
const headers = {
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
};
const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers });
const actions = new Set([
  "create",
  "join",
  "state",
  "answer",
  "advance",
  "end",
  "remove",
  "export",
]);
export function GET() {
  return reply({ configured: quizConfigured() });
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 8192) {
      await reader.cancel();
      throw new Error("body");
    }
    chunks.push(value);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("body");
  return body;
}

export async function POST(request: Request) {
  if (!quizConfigured())
    return reply(
      {
        error:
          "Live quiz is not configured yet. Ask the host to finish the quiz setup.",
        setup: true,
      },
      503,
    );
  const origin = request.headers.get("origin");
  // Next can normalize request.url to an internal hostname behind a proxy.
  // The HTTP Host header retains the browser's actual destination.
  if (origin) {
    try {
      if (
        new URL(origin).host !==
        (request.headers.get("host") || new URL(request.url).host)
      )
        return reply(
          { error: "Open the quiz on this website to continue." },
          403,
        );
    } catch {
      return reply({ error: "Invalid request origin." }, 403);
    }
  }
  let body;
  try {
    body = await readBody(request);
  } catch {
    return reply({ error: "Invalid quiz request." }, 400);
  }
  const token =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!/^[a-f0-9]{64}$/.test(token) || !actions.has(body.action))
    return reply({ error: "Invalid quiz session. Join again." }, 400);
  const auth = hashSecret(token);
  try {
    if (body.action === "create" || body.action === "join") {
      // Per-IP limits allow a whole classroom behind the same Wi-Fi/NAT.
      const ip =
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        "local";
      const count = Number(
        await redisCommand([
          "EVAL",
          RATE_LIMIT_SCRIPT,
          1,
          `quiz:v1:rate:${body.action}:${hashSecret(ip)}`,
        ]),
      );
      if (count > (body.action === "create" ? 10 : 500))
        return reply(
          { error: "Too many attempts. Wait one minute and try again." },
          429,
        );
    }
    if (body.action === "create") {
      if (
        typeof body.password !== "string" ||
        !validAdminPassword(body.password)
      )
        return reply({ error: "The host password is incorrect." }, 403);
      const questions = questionsForPack(body.pack);
      const pack = QUIZ_PACKS.find((p) => p.id === body.pack);
      if (!questions || !pack)
        return reply({ error: "Choose a question set." }, 400);
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = String(randomInt(100000, 1000000));
        const result = JSON.parse(
          String(
            await redisCommand([
              "EVAL",
              QUIZ_SCRIPT,
              1,
              `quiz:v1:room:${code}`,
              JSON.stringify({
                action: "create",
                code,
                auth,
                questions,
                title: pack.title,
              }),
            ]),
          ),
        );
        if (!result.error) return reply(result);
      }
      return reply({ error: "Could not reserve a room. Try again." }, 503);
    }
    if (typeof body.code !== "string" || !/^\d{6}$/.test(body.code))
      return reply({ error: "Enter the six-digit room code." }, 400);
    const command: Record<string, unknown> = { action: body.action, auth };
    if (body.action === "join") {
      const name =
        typeof body.name === "string"
          ? body.name.normalize("NFKC").trim().replace(/\s+/g, " ")
          : "";
      if (name.length < 2 || name.length > 24 || /[\p{C}<>]/u.test(name))
        return reply(
          { error: "Use a name with 2–24 visible characters." },
          400,
        );
      Object.assign(command, {
        name,
        nameKey: name.toLowerCase(),
        playerId: randomUUID(),
      });
    }
    if (body.action === "advance" || body.action === "answer") {
      if (!Number.isInteger(body.index) || body.index < -1 || body.index > 50)
        return reply({ error: "Invalid question number." }, 400);
      command.index = body.index;
    }
    if (body.action === "answer") command.option = body.option;
    if (body.action === "remove") {
      if (typeof body.playerId !== "string" || body.playerId.length > 64)
        return reply({ error: "Choose a participant." }, 400);
      command.playerId = body.playerId;
    }
    const result = JSON.parse(
      String(
        await redisCommand([
          "EVAL",
          QUIZ_SCRIPT,
          1,
          `quiz:v1:room:${body.code}`,
          JSON.stringify(command),
        ]),
      ),
    );
    return reply(result, result.error ? result.status : 200);
  } catch {
    // Never log request bodies, passwords, session tokens or database credentials.
    console.error("Live quiz storage request failed");
    return reply(
      {
        error:
          "The quiz service is temporarily unavailable. Your saved answers are safe; try again.",
      },
      503,
    );
  }
}
