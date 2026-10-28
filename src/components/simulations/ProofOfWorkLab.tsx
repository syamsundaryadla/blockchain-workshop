"use client";
import React, { useEffect, useRef, useState } from "react";

async function fingerprint(message: string, nonce: number) {
  if (!globalThis.crypto?.subtle)
    throw new Error("Use localhost or HTTPS for browser hashing.");
  const bytes = new TextEncoder().encode(`${message}|nonce=${nonce}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
}

export function ProofOfWorkLab() {
  const [message, setMessage] = useState("Alice sends Bob 20 credits");
  const [result, setResult] = useState<{
    nonce: number;
    hash: string;
    attempts: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  async function tryNonce(search: boolean) {
    const run = ++generation.current;
    setBusy(true);
    setError("");
    const start = result ? result.nonce + 1 : 0;
    try {
      for (let i = 0; i < (search ? 4096 : 1); i++) {
        const nonce = start + i;
        const hash = await fingerprint(message, nonce);
        if (generation.current !== run) return;
        if (!search || hash.startsWith("00") || i % 32 === 0 || i === 4095)
          setResult({ nonce, hash, attempts: i + 1 });
        if (!search || hash.startsWith("00")) break;
      }
    } catch (err) {
      if (generation.current === run)
        setError(err instanceof Error ? err.message : "Hashing failed.");
    } finally {
      if (generation.current === run) setBusy(false);
    }
  }
  const solved = result?.hash.startsWith("00");
  return (
    <div className="proof-of-work-lab">
      <div className="lab-context-label">
        REAL SHA-256 · TOY PROOF OF WORK · NO BITCOIN OR FABRIC NETWORK
      </div>
      <label className="field-label">
        Candidate message
        <input
          disabled={busy}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setResult(null);
            setError("");
          }}
        />
      </label>
      <div className="pow-workbench">
        <section>
          <span className="field-label">Nonce tried</span>
          <strong>{result?.nonce ?? "—"}</strong>
          <span>
            {result
              ? `${result.attempts} attempt${result.attempts === 1 ? "" : "s"} in this run`
              : "A search value, not a payment amount"}
          </span>
        </section>
        <section>
          <span className="field-label">Teaching target</span>
          <strong>00…</strong>
          <span>Two leading hexadecimal zeros</span>
        </section>
      </div>
      <code
        className={`pow-fingerprint ${solved ? "solved" : ""}`}
        aria-label="Calculated SHA-256 fingerprint"
      >
        {result?.hash ?? "Try one nonce, then search for the target."}
      </code>
      <div className="campus-button-row">
        <button
          className="studio-button secondary"
          disabled={busy}
          onClick={() => void tryNonce(false)}
        >
          Try one nonce
        </button>
        <button
          className="studio-button primary"
          disabled={busy}
          onClick={() => void tryNonce(true)}
        >
          {busy ? "Searching…" : "Find a valid nonce"}
        </button>
      </div>
      <p className="lab-result" role="status">
        {error ||
          (busy
            ? "Computing candidate hashes…"
            : solved
              ? "Target met. Change the message: this proof no longer applies to the edited input."
              : result
                ? "Target not met. Vary the nonce and try again."
                : "Predict: can you know the successful nonce without trying hashes?")}
      </p>
      <p className="lab-footnote">
        A valid puzzle result does not prove the transaction is allowed. Nodes
        must still validate the rules. Bitcoin uses a different header and a
        much harder target; Fabric does not mine.
      </p>
    </div>
  );
}
