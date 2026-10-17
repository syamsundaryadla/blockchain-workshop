"use client";
import React, { useState } from "react";
export const FLOW_STAGES = [
  {
    title: "Propose",
    actor: "Alice's application",
    detail:
      "A signed request asks to transfer 20. Saved balances are unchanged.",
  },
  {
    title: "Execute & endorse",
    actor: "Required peers",
    detail:
      "Chaincode checks the owner, amount and funds. Peers endorse matching proposed results: 80 / 70.",
  },
  {
    title: "Order",
    actor: "Ordering service",
    detail:
      "The endorsed transaction is sequenced into a block. Ordering does not apply the balance changes.",
  },
  {
    title: "Validate",
    actor: "Peers",
    detail:
      "Check the endorsement policy and whether the records read during execution are still current.",
  },
  {
    title: "Commit",
    actor: "Peers and the client",
    detail:
      "A valid transaction applies both writes. The app confirms valid commit and reads the new balances.",
  },
];
export function FabricFlowLab() {
  const [stage, setStage] = useState(0),
    [fail, setFail] = useState(false);
  const committed = stage === 4 && !fail;
  return (
    <div className="flow-lab">
      <div className="lab-context-label">
        INTERACTIVE MODEL · NO LIVE FABRIC CONNECTION
      </div>
      <ol className="flow-stage-tabs" aria-label="Transaction stages">
        {FLOW_STAGES.map((s, i) => (
          <li
            key={s.title}
            className={i === stage ? "active" : i < stage ? "complete" : ""}
          >
            <button
              onClick={() => setStage(i)}
              aria-current={i === stage ? "step" : undefined}
            >
              <span>{i + 1}</span>
              {s.title}
            </button>
          </li>
        ))}
      </ol>
      <div className="flow-composition">
        <div className="flow-current">
          <span className="eyebrow">Confirmed current state</span>
          <div>
            <span>
              Alice<strong>{committed ? 80 : 100}</strong>
            </span>
            <span>
              Bob<strong>{committed ? 70 : 50}</strong>
            </span>
          </div>
          <small>
            {committed
              ? "Changed together after valid commit"
              : "Still the saved balances"}
          </small>
        </div>
        <div className="flow-explanation">
          <span className="eyebrow">{FLOW_STAGES[stage].actor}</span>
          <h2>
            {stage === 4 && fail
              ? "Recorded as invalid"
              : FLOW_STAGES[stage].title}
          </h2>
          <p>
            {stage === 4 && fail
              ? "A simulated version conflict fails validation. The block records the invalid transaction; current balances stay at 100 / 50."
              : FLOW_STAGES[stage].detail}
          </p>
          {stage > 0 && stage < 4 && (
            <p className="flow-proposed">
              Proposed result: Alice 80 / Bob 70. Not yet applied.
            </p>
          )}
        </div>
      </div>
      <div className="flow-controls">
        <label>
          <input
            type="checkbox"
            checked={fail}
            onChange={(e) => {
              setFail(e.target.checked);
              setStage(0);
            }}
          />{" "}
          Try a validation failure
        </label>
        <div className="campus-button-row">
          <button className="text-button" onClick={() => setStage(0)}>
            Restart
          </button>
          <button
            className="studio-button primary"
            disabled={stage === 4}
            onClick={() => setStage((s) => s + 1)}
          >
            {stage === 3 ? "Reveal commit result" : "Reveal next stage"} →
          </button>
        </div>
      </div>
      <p className="lab-footnote">
        Predict before each reveal: have the saved balances changed yet?
      </p>
    </div>
  );
}
