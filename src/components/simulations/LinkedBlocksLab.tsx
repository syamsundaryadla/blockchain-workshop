"use client";
import React, { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";
interface Block {
  data: string;
  previous: string;
  hash: string;
}
const originals = [
  "Club opens its shared register",
  "Treasurer records a payment of 100",
  "Secretary confirms the entry",
];
const fingerprint = (data: string, previous: string) =>
  sha256(JSON.stringify({ data, previous }));
export function LinkedBlocksLab() {
  const [blocks, setBlocks] = useState<Block[]>([]),
    [drafts, setDrafts] = useState(originals),
    [computed, setComputed] = useState<string[]>([]),
    [showReason, setShowReason] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    (async () => {
      const result: Block[] = [];
      for (const data of originals) {
        const previous = result.at(-1)?.hash ?? "0".repeat(64);
        result.push({
          data,
          previous,
          hash: await fingerprint(data, previous),
        });
      }
      if (current) setBlocks(result);
    })().catch(() => {
      if (current)
        setError("Hashing is unavailable. Open on localhost or HTTPS.");
    });
    return () => {
      current = false;
    };
  }, []);
  useEffect(() => {
    if (!blocks.length) return;
    let current = true;
    setComputed([]);
    Promise.all(blocks.map((b, i) => fingerprint(drafts[i], b.previous)))
      .then((h) => {
        if (current) setComputed(h);
      })
      .catch(() => {
        if (current) setError("Could not verify these blocks.");
      });
    return () => {
      current = false;
    };
  }, [blocks, drafts]);
  const ready = computed.length === 3;
  const valid =
    ready &&
    blocks.every(
      (b, i) =>
        b.hash === computed[i] && (i === 0 || b.previous === computed[i - 1]),
    );
  return (
    <div className="linked-blocks-lab">
      <div className="lab-context-label">
        REAL HASHES · SIMPLIFIED CHAIN MODEL · NOT A FABRIC NETWORK
      </div>
      <div className="linked-blocks">
        {blocks.map((b, i) => {
          const contentMatches = ready && b.hash === computed[i],
            linkMatches = ready && (i === 0 || b.previous === computed[i - 1]);
          return (
            <section
              key={i}
              className={
                ready && (!contentMatches || !linkMatches)
                  ? "block-mismatch"
                  : ""
              }
            >
              <span className="eyebrow">Block {i + 1}</span>
              <label className="field-label">
                Recorded message
                <textarea
                  value={drafts[i]}
                  rows={2}
                  onChange={(e) => {
                    setDrafts((d) =>
                      d.map((v, j) => (i === j ? e.target.value : v)),
                    );
                    setShowReason(false);
                  }}
                />
              </label>
              <dl>
                <div>
                  <dt>Saved previous hash</dt>
                  <dd title={b.previous}>{b.previous.slice(0, 12)}…</dd>
                </div>
                <div>
                  <dt>Saved fingerprint</dt>
                  <dd title={b.hash}>{b.hash.slice(0, 12)}…</dd>
                </div>
                <div>
                  <dt>Recomputed now</dt>
                  <dd title={computed[i]}>
                    {ready ? computed[i].slice(0, 12) + "…" : "Checking…"}
                  </dd>
                </div>
              </dl>
              <p className="block-check">
                {!ready
                  ? "Checking…"
                  : !contentMatches
                    ? "Message fingerprint changed"
                    : !linkMatches
                      ? "Previous link no longer matches"
                      : "Content and link match"}
              </p>
            </section>
          );
        })}
      </div>
      <div className="campus-button-row">
        <button
          className="studio-button primary"
          onClick={() => {
            setDrafts((d) => d.map((v, i) => (i === 0 ? v + " (edited)" : v)));
            setShowReason(false);
          }}
        >
          Edit the first record
        </button>
        <button
          className="text-button"
          onClick={() => {
            setDrafts([...originals]);
            setShowReason(false);
          }}
        >
          Restore original records
        </button>
        <button
          className="text-button"
          onClick={() => setShowReason(!showReason)}
          aria-expanded={showReason}
        >
          Explain the checks
        </button>
      </div>
      <p
        className={`lab-result ${ready && !valid ? "result-rejected" : ""}`}
        role="status"
      >
        {error ||
          (!ready
            ? "Building and verifying the chain…"
            : valid
              ? "All three blocks verify. Predict which check fails after an edit."
              : "Verification failed. Find the changed fingerprint and the next block's mismatched link.")}
      </p>
      {showReason && (
        <p className="lab-footnote">
          Each block saves its predecessor's hash. Editing a message changes its
          recomputed hash. The next block still points to the old saved value. A
          real network also enforces agreement and validation rules; this model
          shows the hash links only. Hashes are shortened for display.
        </p>
      )}
    </div>
  );
}
