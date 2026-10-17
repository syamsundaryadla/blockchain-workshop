"use client";
import React, { useRef, useState } from "react";
export function SignatureLab() {
  const [message, setMessage] = useState(
      "Alice requests a transfer of 20 credits",
    ),
    [result, setResult] = useState(
      "Predict first: will this signature still match after an edit?",
    ),
    [signedMessage, setSignedMessage] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [valid, setValid] = useState<boolean | null>(null);
  const keys = useRef<CryptoKeyPair | null>(null),
    signature = useRef<ArrayBuffer | null>(null);
  async function sign() {
    setBusy(true);
    setValid(null);
    try {
      keys.current ??= await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign", "verify"],
      );
      const captured = message;
      signature.current = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        keys.current.privateKey,
        new TextEncoder().encode(captured),
      );
      setSignedMessage(captured);
      setResult(
        "Signed with a temporary private key. Edit the message, then verify.",
      );
    } catch {
      setResult(
        "Signing is unavailable here. Open the lab on localhost or an HTTPS page.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function verify() {
    if (!keys.current || !signature.current) return;
    setBusy(true);
    try {
      const matched = await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        keys.current.publicKey,
        signature.current,
        new TextEncoder().encode(message),
      );
      setValid(matched);
      setResult(
        matched
          ? "Signature matches this message and public key."
          : "Signature does not match. The message changed after signing.",
      );
    } catch {
      setResult("Verification failed. Sign the message again and retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="signature-lab">
      <div className="lab-context-label">
        REAL BROWSER CRYPTOGRAPHY · TEMPORARY KEYS · NOT FABRIC ENROLLMENT
      </div>
      <label className="field-label">
        Your message
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setValid(null);
          }}
          rows={2}
        />
      </label>
      <div className="signature-composition">
        <div>
          <span className="eyebrow">Private key</span>
          <strong>Sign the exact message</strong>
          <p>Kept in this browser session.</p>
        </div>
        <span className="signature-arrow" aria-hidden="true">
          →
        </span>
        <div>
          <span className="eyebrow">Public key</span>
          <strong>Verify the signature</strong>
          <p>Checks the key and message match.</p>
        </div>
      </div>
      <div className="campus-button-row">
        <button
          className="studio-button primary"
          disabled={busy}
          onClick={sign}
        >
          {signedMessage ? "Sign again" : "Sign message"}
        </button>
        <button
          className="studio-button secondary"
          disabled={busy || !signedMessage}
          onClick={verify}
        >
          Verify current message
        </button>
        <button
          className="text-button"
          disabled={!signedMessage || busy}
          onClick={() => {
            setMessage(signedMessage!);
            setValid(null);
          }}
        >
          Restore signed text
        </button>
      </div>
      <p
        className={`lab-result ${valid === false ? "result-rejected" : ""}`}
        role="status"
      >
        {result}
      </p>
      <p className="lab-footnote">
        A signature proves a key signed these bytes. It does not prove the
        message is truthful.
      </p>
    </div>
  );
}
