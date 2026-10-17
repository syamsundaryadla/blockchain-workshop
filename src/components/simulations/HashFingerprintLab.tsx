"use client";
import React, { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";
export function HashFingerprintLab() {
  const [first, setFirst] = useState("Hello campus"),
    [second, setSecond] = useState("Hello campus"),
    [hashes, setHashes] = useState<[string, string] | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    setHashes(null);
    Promise.all([sha256(first), sha256(second)])
      .then((h) => {
        if (current) {
          setHashes(h);
          setError("");
        }
      })
      .catch(() => {
        if (current)
          setError("Hashing is unavailable. Use localhost or an HTTPS page.");
      });
    return () => {
      current = false;
    };
  }, [first, second]);
  const same = hashes && hashes[0] === hashes[1];
  return (
    <div className="hash-fingerprint-lab">
      <div className="lab-context-label">
        REAL SHA-256 · CHANGE THE INPUT, THEN COMPARE
      </div>
      <div className="hash-comparison">
        {[first, second].map((value, i) => (
          <section key={i}>
            <label className="field-label">
              {i === 0 ? "First message" : "Second message"}
              <input
                value={value}
                onChange={(e) =>
                  (i === 0 ? setFirst : setSecond)(e.target.value)
                }
              />
            </label>
            <div className="hash-arrow" aria-hidden="true">
              ↓ SHA-256
            </div>
            <code
              className="fingerprint"
              aria-label={i === 0 ? "First fingerprint" : "Second fingerprint"}
            >
              {hashes
                ? hashes[i].split("").map((char, j) => (
                    <span
                      key={j}
                      className={
                        hashes[0][j] !== hashes[1][j] ? "hash-changed" : ""
                      }
                    >
                      {char}
                    </span>
                  ))
                : "Calculating…"}
            </code>
          </section>
        ))}
      </div>
      <div className="campus-button-row">
        <button
          className="studio-button primary"
          onClick={() =>
            setSecond(
              first.length
                ? first.slice(0, -1) + (first.at(-1) === "!" ? "?" : "!")
                : "!",
            )
          }
        >
          Change one character
        </button>
        <button className="text-button" onClick={() => setSecond(first)}>
          Make the messages identical
        </button>
      </div>
      <p className="lab-result" role="status">
        {error ||
          (hashes
            ? same
              ? "Same bytes. Same fingerprint. Now predict what one edit will do."
              : "Different fingerprints. Highlighted positions show the changed output."
            : "Calculating the fingerprints…")}
      </p>
      <p className="lab-footnote">
        Every result is 256 bits, displayed as 64 hexadecimal characters. A hash
        is a fingerprint, not encryption.
      </p>
    </div>
  );
}
