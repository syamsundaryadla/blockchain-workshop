"use client";
import React, { useState } from "react";
import { rehearseTransfer, type WalletId } from "@/lib/credits-rehearsal";
export function CreditsLab() {
  const [state, setState] = useState({ alice: 100, bob: 50 }),
    [signer, setSigner] = useState<WalletId>("alice"),
    [from, setFrom] = useState<WalletId>("alice"),
    [to, setTo] = useState<WalletId>("bob"),
    [amount, setAmount] = useState("20"),
    [result, setResult] = useState(
      "Predict both balances, then try the transfer.",
    ),
    [rejected, setRejected] = useState(false),
    [history, setHistory] = useState<string[]>([]);
  function transfer() {
    try {
      const next = rehearseTransfer(state, signer, from, to, amount);
      setState(next);
      const text = `Simulated: ${from} → ${to}, ${amount} credits. Balances: ${next.alice} / ${next.bob}.`;
      setResult(text);
      setHistory((h) => [text, ...h].slice(0, 4));
      setRejected(false);
    } catch (e) {
      setResult((e as Error).message + " Balances unchanged.");
      setRejected(true);
    }
  }
  const options = (
    <>
      <option value="alice">Alice</option>
      <option value="bob">Bob</option>
    </>
  );
  return (
    <div className="credits-lab">
      <div className="lab-context-label">
        BROWSER REHEARSAL · IN-MEMORY SIMULATION · NOT A FABRIC TRANSACTION
      </div>
      <div className="credit-balances">
        {(["alice", "bob"] as const).map((id) => (
          <div key={id}>
            <span>{id === "alice" ? "Alice" : "Bob"}</span>
            <strong>{state[id]}</strong>
            <small>demo credits</small>
          </div>
        ))}
        <div className="credit-total">
          <span>Combined</span>
          <strong>{state.alice + state.bob}</strong>
          <small>must stay constant</small>
        </div>
      </div>
      <div className="credits-fields">
        <label>
          Signing identity
          <select
            value={signer}
            onChange={(e) => setSigner(e.target.value as WalletId)}
          >
            {options}
          </select>
        </label>
        <label>
          Debit wallet
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as WalletId)}
          >
            {options}
          </select>
        </label>
        <label>
          Recipient
          <select
            value={to}
            onChange={(e) => setTo(e.target.value as WalletId)}
          >
            {options}
          </select>
        </label>
        <label>
          Amount
          <input
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <div className="campus-button-row">
        <button className="studio-button primary" onClick={transfer}>
          Try transfer
        </button>
        <button
          className="text-button"
          onClick={() => {
            setState({ alice: 100, bob: 50 });
            setHistory([]);
            setRejected(false);
            setResult("Reset to 100 / 50. Make your next prediction.");
          }}
        >
          Reset rehearsal
        </button>
      </div>
      <p
        className={`lab-result ${rejected ? "result-rejected" : ""}`}
        role="status"
      >
        {result}
      </p>
      <details className="rehearsal-help">
        <summary>Try these three experiments</summary>
        <ol>
          <li>Alice signs, debit Alice, send Bob 20: expect 80 / 70.</li>
          <li>Bob signs, debit Alice: permission denied.</li>
          <li>
            Send 1,000: insufficient credits. Check that the balances stay
            unchanged.
          </li>
        </ol>
      </details>
      {history.length > 0 && (
        <details>
          <summary>Recent simulated transfers</summary>
          <ul>
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
