"use client";

import React, { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, StepForward, Check } from "lucide-react";

export const isDecisionScene = (scene: string) =>
  ["agreement", "rules", "state-history"].includes(scene);

export function DecisionAnimation({ scene }: { scene: string }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [signer, setSigner] = useState("Alice");
  const [amount, setAmount] = useState("20");
  const [first, setFirst] = useState("Bob");
  const contract = scene === "rules";
  const conflict = scene === "agreement";
  const validAmount =
    /^[1-9][0-9]*$/.test(amount) && Number.isSafeInteger(Number(amount));
  const failure =
    signer !== "Alice" ? 1 : !validAmount ? 2 : Number(amount) > 100 ? 3 : null;
  const last = contract && failure !== null ? failure : 4;
  const committed = step === 4;
  const rejected = contract && failure !== null && step >= failure;
  const reset = () => {
    setStep(0);
    setPlaying(false);
  };
  useEffect(() => {
    if (!playing || step >= last) return;
    const timer = setTimeout(() => setStep((s) => Math.min(last, s + 1)), 1800);
    return () => clearTimeout(timer);
  }, [playing, step, last]);

  const messages = conflict
    ? [
        "Predict: Alice has 100. Can two requests for 80 both succeed?",
        `In this model, the request to ${first} is checked first. Both requests are still pending.`,
        `The first transfer is accepted: Alice has 20; ${first} receives 80.`,
        "The other request is checked against the updated balance: 20 is less than 80.",
        "Reject the second request. A shared order and validation rules prevent spending the same balance twice.",
      ]
    : contract
      ? [
          "Predict the result, then walk through the contract checks.",
          signer === "Alice"
            ? "Owner check passed: Alice is signing for her own wallet."
            : "Rejected: Bob cannot spend from Alice’s wallet. Balances stay unchanged.",
          validAmount
            ? "Amount check passed: a positive, safe whole number."
            : "Rejected: enter a positive, safe whole number. Balances stay unchanged.",
          Number(amount) <= 100
            ? "Funds check passed. The proposed updates still await valid commit."
            : "Rejected: Alice has only 100 credits. Balances stay unchanged.",
          "Valid commit applies both balance changes together. Total credits stay at 150.",
        ]
      : [
          "Current state answers: what are the balances now? History answers: what was recorded?",
          "Alice requests 20. The saved balances are still 100 / 50.",
          "Peers simulate and endorse proposed balances of 80 / 70. Saved state is unchanged.",
          "The orderer includes the transaction in a block. Peers still need to validate it.",
          "Peers validate and commit: current state becomes 80 / 70; block history retains the transfer.",
        ];
  const transferred = conflict ? step >= 2 : committed;
  const value = contract ? Number(amount) : conflict ? 80 : 20;
  const balances = conflict
    ? [
        ["Alice", transferred ? 20 : 100],
        ["Bob", transferred && first === "Bob" ? 80 : 0],
        ["Carol", transferred && first === "Carol" ? 80 : 0],
      ]
    : [
        ["Alice", transferred ? 100 - value : 100],
        ["Bob", transferred ? 50 + value : 50],
      ];
  return (
    <section className="decision-demo" aria-label="Interactive teaching model">
      <div className="decision-inputs">
        {conflict ? (
          <label>
            First request in this model{" "}
            <select
              value={first}
              onChange={(e) => {
                reset();
                setFirst(e.target.value);
              }}
            >
              <option>Bob</option>
              <option>Carol</option>
            </select>
          </label>
        ) : contract ? (
          <>
            <label>
              Signing identity{" "}
              <select
                value={signer}
                onChange={(e) => {
                  reset();
                  setSigner(e.target.value);
                }}
              >
                <option>Alice</option>
                <option>Bob</option>
              </select>
            </label>
            <label>
              Credits from Alice to Bob{" "}
              <input
                value={amount}
                onChange={(e) => {
                  reset();
                  setAmount(e.target.value);
                }}
                inputMode="numeric"
                maxLength={18}
              />
            </label>
          </>
        ) : (
          <span className="decision-model-label">
            One transfer · two views of the ledger
          </span>
        )}
        <span className="decision-model-label">
          Teaching model · no live transaction
        </span>
      </div>
      <div className="decision-visual">
        <div className="decision-balances" aria-label="Saved balances">
          {balances.map(([name, balance]) => (
            <div key={name}>
              <span>{name}</span>
              <strong>{balance}</strong>
              <small>saved credits</small>
            </div>
          ))}
        </div>
        <div className="decision-records">
          {conflict ? (
            <>
              <div className={step >= 2 ? "decision-pass" : ""}>
                Alice → {first} · 80 <b>{step >= 2 ? "Accepted" : "Pending"}</b>
              </div>
              <div className={step >= 3 ? "decision-fail" : ""}>
                Alice → {first === "Bob" ? "Carol" : "Bob"} · 80{" "}
                <b>{step >= 3 ? "Insufficient funds" : "Pending"}</b>
              </div>
            </>
          ) : contract ? (
            ["Owner", "Amount", "Funds", "Valid commit"].map((label, i) => (
              <div
                key={label}
                className={
                  rejected && step === i + 1
                    ? "decision-fail"
                    : step >= i + 1
                      ? "decision-pass"
                      : ""
                }
              >
                <span>{label}</span>
                <b>
                  {rejected && step === i + 1
                    ? "Rejected"
                    : step >= i + 1
                      ? "Passed"
                      : "Waiting"}
                </b>
              </div>
            ))
          ) : (
            <>
              <span className="decision-model-label">Block history</span>
              <div>
                Earlier record <b>Initial balances 100 / 50</b>
              </div>
              <div className={committed ? "decision-pass" : ""}>
                Alice → Bob · 20{" "}
                <b>
                  {committed
                    ? "Recorded · valid"
                    : step >= 3
                      ? "Awaiting validation"
                      : "Not yet committed"}
                </b>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="decision-status" role="status">
        {messages[step]}
      </p>
      <div className="decision-controls">
        <button
          type="button"
          onClick={() => {
            if (step >= last) setStep(0);
            setPlaying((p) => !p || step >= last);
          }}
        >
          {playing && step < last ? <Pause size={15} /> : <Play size={15} />}{" "}
          {playing && step < last ? "Pause" : step >= last ? "Replay" : "Play"}
        </button>
        <button
          type="button"
          disabled={step >= last}
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(last, s + 1));
          }}
        >
          <StepForward size={15} /> Next step
        </button>
        <button type="button" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
        <span>
          {step + 1} / {last + 1}
        </span>
      </div>
    </section>
  );
}

export function PracticalSuccessChecklist() {
  return (
    <section
      className="practical-success"
      aria-label="Your pair’s success checklist"
    >
      <p className="eyebrow">Your pair is ready to demonstrate when…</p>
      <ol>
        {[
          ["Transfer succeeds", "Show a valid commit and balances 80 / 70."],
          [
            "Forbidden transfer fails",
            "Use the wrong signer; show unchanged balances.",
          ],
          ["Explain why", "Name the signer, the rule and what changed."],
        ].map(([title, text], i) => (
          <li key={title}>
            <span className="success-number">0{i + 1}</span>
            <Check size={23} aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <p className="success-timing">
        10 min predict → 15 min code → 10 min launch → 15 min test → 10 min
        explain
      </p>
    </section>
  );
}
