/**
 * Cryptographic utility providing standard SHA-256 hashing using the browser's
 * native Web Crypto API (crypto.subtle). Includes server-side / node fallback
 * so that tests and SSR execute seamlessly.
 */

export async function sha256(message: string): Promise<string> {
  // Check for Web Crypto API (browsers and modern Node 18+)
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Node.js fallback if crypto.subtle is not accessible
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(message).digest("hex");
  } catch (err) {
    console.error("No SHA-256 implementation available", err);
    return "0".repeat(64);
  }
}

/**
 * Calculates a canonical block hash from its fields.
 */
export async function calculateBlockHash(
  index: number,
  previousHash: string,
  timestamp: number,
  dataString: string,
  nonce: number
): Promise<string> {
  const payload = `${index}|${previousHash}|${timestamp}|${dataString}|${nonce}`;
  return sha256(payload);
}
