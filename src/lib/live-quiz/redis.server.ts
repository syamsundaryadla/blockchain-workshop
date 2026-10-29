import { createHash, timingSafeEqual } from "node:crypto";

export function quizConfigured() {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN) &&
      (process.env.QUIZ_ADMIN_PASSWORD?.length ?? 0) >= 8,
  );
}
export const hashSecret = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function validAdminPassword(value: string) {
  return timingSafeEqual(
    Buffer.from(hashSecret(value)),
    Buffer.from(hashSecret(process.env.QUIZ_ADMIN_PASSWORD || "")),
  );
}
export async function redisCommand(
  command: (string | number)[],
): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Quiz storage is not configured");
  if (process.env.VERCEL && !url.startsWith("https://"))
    throw new Error("Quiz storage requires HTTPS");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Quiz storage HTTP ${response.status}`);
  const value = await response.json();
  if (value.error) throw new Error("Quiz storage rejected a command");
  return value.result;
}
