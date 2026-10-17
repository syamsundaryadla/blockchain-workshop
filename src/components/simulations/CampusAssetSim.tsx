"use client";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  TEST_ACCOUNTS,
  createCampusAsset,
  emptyCampusState,
  readCampusAsset,
  transferCampusAsset,
  type CampusState,
} from "@/lib/campus-assets";
export function CampusAssetSim() {
  const [state, setState] = useState<CampusState>(emptyCampusState);
  const [caller, setCaller] = useState<string>(TEST_ACCOUNTS[0].address);
  const [id, setId] = useState("LAPTOP-001");
  const [name, setName] = useState("Lab Laptop");
  const [recipient, setRecipient] = useState<string>(TEST_ACCOUNTS[1].address);
  const [message, setMessage] = useState(
    "Start with Account A. Create LAPTOP-001, then read it.",
  );
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? state.assets[selectedId] : null;
  const who = (address: string) =>
    TEST_ACCOUNTS.find((a) => a.address.toLowerCase() === address.toLowerCase())
      ?.label ?? address;
  function act(kind: "create" | "read" | "transfer") {
    try {
      let next = state;
      if (kind === "create") next = createCampusAsset(state, id, name, caller);
      if (kind === "transfer")
        next = transferCampusAsset(state, id, recipient, caller);
      const asset = readCampusAsset(next, id);
      setState(next);
      setSelectedId(id);
      setFailed(false);
      setMessage(
        kind === "read"
          ? `${asset.name} · owner: ${who(asset.owner)}. No state changed.`
          : kind === "create"
            ? `Created ${id}. Owner: ${who(asset.owner)}.`
            : `Transferred ${id} to ${who(asset.owner)}.`,
      );
    } catch (error) {
      setFailed(true);
      setMessage(
        (error as Error).message + ". The existing record is unchanged.",
      );
    }
  }
  return (
    <div className="campus-sim">
      <div className="campus-sim-bar">
        <span className="practice-badge">Local simulation</span>
        <p>
          Rehearse here. Compile and deploy the contract in Remix for the
          practical.
        </p>
        <button
          className="text-button"
          onClick={() => {
            setState(emptyCampusState());
            setSelectedId(null);
            setFailed(false);
            setMessage("Rehearsal reset. Create your first asset.");
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div className="campus-workbench">
        <section className="campus-controls">
          <label>
            Calling account
            <select value={caller} onChange={(e) => setCaller(e.target.value)}>
              {TEST_ACCOUNTS.map((a) => (
                <option key={a.address} value={a.address}>
                  {a.label} · {a.address.slice(0, 8)}…
                </option>
              ))}
            </select>
          </label>
          <label>
            Asset ID
            <input value={id} onChange={(e) => setId(e.target.value)} />
          </label>
          <label>
            Asset name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="campus-button-row">
            <button
              className="studio-button primary"
              onClick={() => act("create")}
            >
              Create asset
            </button>
            <button
              className="studio-button secondary"
              onClick={() => act("read")}
            >
              Read asset
            </button>
          </div>
          <label>
            New owner
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            >
              {TEST_ACCOUNTS.map((a) => (
                <option key={a.address} value={a.address}>
                  {a.label}
                </option>
              ))}
              <option value="0x0000000000000000000000000000000000000000">
                Zero address · invalid recipient
              </option>
            </select>
          </label>
          <button
            className="studio-button primary"
            onClick={() => act("transfer")}
          >
            Transfer asset <ArrowRight size={14} />
          </button>
        </section>
        <section className="campus-record" aria-label="Current asset record">
          <span className="eyebrow">Current state</span>
          <span className="asset-tag">{selected?.id ?? "No asset yet"}</span>
          <h2>{selected?.name ?? "Create your first record."}</h2>
          <span className="eyebrow">Recorded owner</span>
          <strong>{selected ? who(selected.owner) : "—"}</strong>
          {selected && <code>{selected.owner}</code>}
          <div
            role="status"
            className={`campus-status ${failed ? "failure" : ""}`}
          >
            {message}
          </div>
        </section>
      </div>
      <section className="campus-history">
        <span className="eyebrow">
          Successful actions · this rehearsal only
        </span>
        {state.history.length === 0 ? (
          <p>No actions recorded yet.</p>
        ) : (
          <ol>
            {state.history.map((entry, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{entry.id}</strong>
                <span>
                  {entry.kind === "created"
                    ? "Created"
                    : `${who(entry.from!)} →`}{" "}
                  {who(entry.to)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
