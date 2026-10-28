"use client";
import React, { useEffect, useId, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";

const KINDS = {
  topologies: "topology",
  "transaction-animation": "transaction",
  "block-animation": "block",
  "chain-animation": "chain",
  "mango-trace": "mango",
} as const;
export const isConceptAnimationScene = (scene: string) =>
  Object.hasOwn(KINDS, scene);
const STEPS = {
  topology: [
    "All illustrated nodes are available. Predict what one failure will affect.",
    "One highlighted node fails in each design.",
    "The central hub’s clients lose access; one decentralized group is affected.",
    "The replicated mesh uses an alternate path. Recovery depends on the real design.",
  ],
  transaction: [
    "Alice has 100 credits; Bob has 50. No transfer has been accepted.",
    "Alice requests a transfer of 20. The saved balances stay unchanged.",
    "Check the signing authority, positive amount and available balance.",
    "The model accepts and records the transfer. Alice has 80; Bob has 70.",
  ],
  block: [
    "Transaction records are waiting to be grouped.",
    "Collect the records into one candidate block.",
    "Create the block header and its fingerprint information.",
    "The candidate block contains a header and a batch of records; acceptance still follows network rules.",
  ],
  chain: [
    "Start with the first illustrated block and its hash H1.",
    "The second block stores H1 as its previous hash.",
    "The third block stores H2, the preceding block’s hash.",
    "Check each link. Now try editing the first block.",
  ],
  mango: [
    "A store wants to find where this mango lot originated.",
    "Use the lot identifier to locate the store’s recorded handover.",
    "Follow the distributor and packer records backwards.",
    "Reach the farm record. Walmart reported a 2.2-second lookup in its pilot.",
  ],
} as const;
const NOTES = {
  topology:
    "Illustrative designs: failure recovery depends on replication, quorum, connectivity and operations.",
  transaction:
    "Conceptual model; the detailed Fabric transaction flow is demonstrated later.",
  block:
    "Toy block assembly. Exact fields and hashing differ across blockchain platforms.",
  chain:
    "Illustrative hash labels. A network also needs rules and agreement about accepted history.",
  mango:
    "Reported 2017 pilot, described in Walmart’s 2018 report. This is not a universal performance guarantee.",
};
const MANGO_SOURCE =
  "https://stock.walmart.com/_assets/_513a414897667f69e48953e02796048d/walmart/db/951/9698/file/WMT-2018-GRR-Summary-for-digital.pdf";
const NODE_OPTIONS = [
  ["central-hub", "Centralized: main hub"],
  ...Array.from({ length: 4 }, (_, i) => [
    `central-client-${i}`,
    `Centralized: client ${i + 1}`,
  ]),
  ...Array.from({ length: 3 }, (_, i) => [
    `decentral-hub-${i}`,
    `Decentralized: hub ${i + 1}`,
  ]),
  ...Array.from({ length: 3 }, (_, i) => [
    `decentral-client-${i}`,
    `Decentralized: client ${i + 1}`,
  ]),
  ...Array.from({ length: 4 }, (_, i) => [
    `distributed-${i}`,
    `Distributed: node ${i + 1}`,
  ]),
];
const AUTO_FAILED = ["central-hub", "decentral-hub-0", "distributed-0"];
function Text({
  x,
  y,
  children,
  small = false,
  center = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  center?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={center ? "middle" : "start"}
      className={small ? "ca-small" : "ca-label"}
    >
      {children}
    </text>
  );
}
function Panel({
  x,
  y,
  w,
  title,
  sub,
  active = false,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub?: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="100"
        rx="12"
        className={`ca-panel ${active ? "active" : ""}`}
      />
      <Text x={x + 20} y={y + 37}>
        {title}
      </Text>
      {sub && (
        <Text x={x + 20} y={y + 72} small>
          {sub}
        </Text>
      )}
    </g>
  );
}

export function ConceptAnimation({ scene }: { scene: string }) {
  const kind = KINDS[scene as keyof typeof KINDS];
  const [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [tampered, setTampered] = useState(false);
  const [offNodes, setOffNodes] = useState<string[]>([]),
    [selectedNode, setSelectedNode] = useState("central-hub");
  const reduced = Boolean(useReducedMotion());
  const id = useId().replace(/:/g, "");
  useEffect(() => {
    if (!playing) return;
    if (step === 3) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((n) => n + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [playing, step]);
  function reset() {
    setPlaying(false);
    setStep(0);
    setTampered(false);
    setOffNodes([]);
  }
  const isOff = (key: string) =>
    offNodes.includes(key) || (step >= 1 && AUTO_FAILED.includes(key));
  function toggleNode(key: string) {
    const current = new Set([...offNodes, ...(step >= 1 ? AUTO_FAILED : [])]);
    if (current.has(key)) current.delete(key);
    else current.add(key);
    setOffNodes([...current]);
    setSelectedNode(key);
    setPlaying(false);
    setStep(0);
  }
  const arrow = (d: string, active = false) => (
    <path
      d={d}
      className={`ca-wire ${active ? "active" : ""}`}
      markerEnd={`url(#ca-${id})`}
    />
  );
  let drawing: ReactNode;
  if (kind === "topology") {
    const centralDown = isOff("central-hub"),
      degraded = step >= 2 || offNodes.length > 0;
    const node = (x: number, y: number, key: string) => {
      const off = isOff(key),
        label = NODE_OPTIONS.find(([id]) => id === key)?.[1] ?? key;
      return (
        <g
          role="button"
          tabIndex={0}
          aria-label={`${label}: ${off ? "off. Turn on node" : "on. Turn off node"}`}
          aria-pressed={off}
          onClick={() => toggleNode(key)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              toggleNode(key);
            }
          }}
          className={`ca-node ${off ? "failed" : ""} ${selectedNode === key ? "selected" : ""}`}
        >
          <title>{`${label}: ${off ? "off" : "on"}`}</title>
          <circle cx={x} cy={y} r="19" />
          {off && <path d={`M${x - 7} ${y - 7}l14 14m0-14-14 14`} />}
        </g>
      );
    };
    drawing = (
      <>
        {[160, 480, 800].map((cx, group) => (
          <g key={group}>
            <Text x={cx} y={28} center>
              {["Centralized", "Decentralized", "Distributed"][group]}
            </Text>
            {group === 0 ? (
              <>
                <g>
                  {[
                    [-65, -50],
                    [65, -50],
                    [-65, 60],
                    [65, 60],
                  ].map(([dx, dy], i) => (
                    <g key={i}>
                      <path
                        d={`M${cx} 145l${dx} ${dy}`}
                        className={`ca-wire ${(centralDown && degraded) || isOff(`central-client-${i}`) ? "muted" : ""}`}
                      />
                      {node(cx + dx, 145 + dy, `central-client-${i}`)}
                    </g>
                  ))}
                </g>
                {node(cx, 145, "central-hub")}
              </>
            ) : group === 1 ? (
              <>
                {[-75, 0, 75].map((dx, i) => (
                  <g
                    key={i}
                    className={
                      isOff(`decentral-hub-${i}`) && degraded
                        ? "ca-unavailable-group"
                        : ""
                    }
                  >
                    <path
                      d={`M${cx + dx} ${i === 1 ? 180 : 115}v-47`}
                      className={`ca-wire ${(isOff(`decentral-hub-${i}`) && degraded) || isOff(`decentral-client-${i}`) ? "muted" : ""}`}
                    />
                    {node(cx + dx, i === 1 ? 133 : 68, `decentral-client-${i}`)}
                    {node(cx + dx, i === 1 ? 180 : 115, `decentral-hub-${i}`)}
                  </g>
                ))}
                <path
                  d={`M${cx - 75} 115l75 65`}
                  className={`ca-wire ${(isOff("decentral-hub-0") || isOff("decentral-hub-1")) && degraded ? "muted" : ""}`}
                />
                <path
                  d={`M${cx} 180l75-65`}
                  className={`ca-wire ${(isOff("decentral-hub-1") || isOff("decentral-hub-2")) && degraded ? "muted" : ""}`}
                />
              </>
            ) : (
              <>
                {[
                  [0, 1],
                  [0, 2],
                  [0, 3],
                  [1, 2],
                  [1, 3],
                  [2, 3],
                ].map(([a, b]) => {
                  const p = [
                      [-65, -50],
                      [65, -50],
                      [-65, 60],
                      [65, 60],
                    ],
                    unavailable =
                      isOff(`distributed-${a}`) || isOff(`distributed-${b}`);
                  return (
                    <path
                      key={`${a}-${b}`}
                      d={`M${cx + p[a][0]} ${145 + p[a][1]}L${cx + p[b][0]} ${145 + p[b][1]}`}
                      className={`ca-wire ${unavailable && degraded ? "muted" : ""} ${!unavailable && (step === 3 || offNodes.some((n) => n.startsWith("distributed-"))) ? "ca-route" : ""}`}
                    />
                  );
                })}
                {[
                  [-65, -50],
                  [65, -50],
                  [-65, 60],
                  [65, 60],
                ].map(([dx, dy], i) => (
                  <React.Fragment key={i}>
                    {node(cx + dx, 145 + dy, `distributed-${i}`)}
                  </React.Fragment>
                ))}
                {step === 3 && !reduced && (
                  <circle r="6" className="ca-packet">
                    <animateMotion
                      dur="2s"
                      path={`M${cx + 65} 95L${cx - 65} 205H${cx + 65}V95`}
                      repeatCount="2"
                    />
                  </circle>
                )}
              </>
            )}
            <Text x={cx} y={265} center small>
              {
                [
                  centralDown && degraded
                    ? "Hub unavailable"
                    : "One access hub",
                  offNodes.some((n) => n.startsWith("decentral-hub")) ||
                  step >= 2
                    ? "Affected groups isolated"
                    : "Several control points",
                  step === 3 ||
                  offNodes.some((n) => n.startsWith("distributed-"))
                    ? "Remaining paths"
                    : "Replicated mesh example",
                ][group]
              }
            </Text>
          </g>
        ))}
        <path d="M320 35v235m320-235v235" className="ca-divider" />
      </>
    );
  } else if (kind === "transaction") {
    drawing = (
      <>
        <Panel
          x={35}
          y={130}
          w={235}
          title={`Alice: ${step === 3 ? 80 : 100}`}
          sub="Sender’s saved balance"
          active={step === 3}
        />
        <Panel
          x={365}
          y={130}
          w={230}
          title={
            step < 2
              ? "Network rules"
              : step === 2
                ? "Check the request"
                : "Accepted + recorded"
          }
          sub={step === 3 ? "Both balances update" : "No saved change yet"}
          active={step >= 2}
        />
        <Panel
          x={690}
          y={130}
          w={235}
          title={`Bob: ${step === 3 ? 70 : 50}`}
          sub="Recipient’s saved balance"
          active={step === 3}
        />
        {arrow("M285 180h65", step > 0)}
        {arrow("M610 180h65", step === 3)}
        <g
          className="ca-moving-record"
          style={{
            transform: `translate(${step > 0 ? 235 : 0}px, 0)`,
            opacity: step > 0 && step < 3 ? 1 : 0,
          }}
        >
          <rect
            x="135"
            y="42"
            width="210"
            height="54"
            rx="8"
            className="ca-message"
          />
          <Text x={240} y={76} center>
            Request: transfer 20
          </Text>
        </g>
        <Text x={480} y={300} center>
          Total credits: 150 before and after
        </Text>
      </>
    );
  } else if (kind === "block") {
    drawing = (
      <>
        <rect
          x="460"
          y="30"
          width="435"
          height="255"
          rx="16"
          className="ca-panel"
        />
        <g className="ca-fade" style={{ opacity: step >= 2 ? 1 : 0.18 }}>
          <rect
            x="460"
            y="30"
            width="435"
            height="55"
            rx="12"
            className="ca-message"
          />
          <Text x={485} y={65}>
            Header + fingerprint information
          </Text>
        </g>
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            className="ca-moving-record"
            style={{ transform: `translate(${step >= 1 ? 420 : 0}px, 0)` }}
          >
            <rect
              x="65"
              y={103 + i * 54}
              width="335"
              height="40"
              rx="6"
              className={step === 3 ? "ca-message" : "ca-panel"}
            />
            <Text
              x={85}
              y={130 + i * 54}
              small
            >{`Transaction record ${i + 1}`}</Text>
          </g>
        ))}
        <Text x={220} y={65} center>
          Waiting records
        </Text>
        <Text x={680} y={325} center>
          {step === 3
            ? "Candidate block ready"
            : "A block groups records together"}
        </Text>
      </>
    );
  } else if (kind === "chain") {
    drawing = (
      <>
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            className="ca-fade"
            style={{ opacity: i <= step ? 1 : 0.08 }}
          >
            <rect
              x={35 + i * 315}
              y="65"
              width="255"
              height="190"
              rx="12"
              className={`ca-panel ${tampered && i === 0 ? "bad" : ""}`}
            />
            <Text x={55 + i * 315} y={105}>{`Block ${i + 1}`}</Text>
            <Text
              x={55 + i * 315}
              y={150}
              small
            >{`Records: ${tampered && i === 0 ? "edited" : "unchanged"}`}</Text>
            <Text
              x={55 + i * 315}
              y={190}
              small
            >{`Hash: H${i + 1}${tampered && i === 0 ? "*" : ""}`}</Text>
            <Text x={55 + i * 315} y={230} small>
              {i === 0 ? "Previous: start" : `Previous: H${i}`}
            </Text>
            {i < 2 && (
              <path
                d={`M${300 + i * 315} 170h35`}
                className={`ca-wire ${tampered && i === 0 ? "bad" : step > i ? "active" : "muted"}`}
                markerEnd={`url(#ca-${id})`}
              />
            )}
          </g>
        ))}
        <Text x={480} y={315} center>
          {tampered
            ? "H1 changed. The stored H1 link no longer matches."
            : step === 3
              ? "Each stored link matches the preceding block’s hash."
              : "Add a block and carry forward the previous hash."}
        </Text>
      </>
    );
  } else {
    const reached = (index: number) =>
      step === 3 || (step === 2 && index >= 1) || (step === 1 && index === 3);
    drawing = (
      <>
        <path d="M105 110h750" className="ca-wire" />
        {["Farm", "Packer", "Distributor", "Store"].map((label, i) => (
          <g key={label}>
            <circle
              cx={105 + i * 250}
              cy="110"
              r="31"
              className={`ca-panel ${reached(i) ? "active" : ""}`}
            />
            <Text x={105 + i * 250} y={117} center>
              {i + 1}
            </Text>
            <Text x={105 + i * 250} y={175} center>
              {label}
            </Text>
          </g>
        ))}
        {step > 0 && (
          <path
            d={`M855 110H${step === 1 ? 855 : step === 2 ? 355 : 105}`}
            className="ca-route"
          />
        )}
        {step > 0 && !reduced && (
          <circle r="7" className="ca-packet">
            <animateMotion
              key={step}
              dur="1.2s"
              path={
                step === 1
                  ? "M855 80v30"
                  : step === 2
                    ? "M855 110H355"
                    : "M355 110H105"
              }
              fill="freeze"
            />
          </circle>
        )}
        <Panel
          x={125}
          y={215}
          w={315}
          title="Manual trace: nearly 7 days"
          sub="Reported manual-record exercise"
        />
        <Panel
          x={520}
          y={215}
          w={315}
          title="Pilot lookup: 2.2 seconds"
          sub="Reported blockchain result"
          active={step === 3}
        />
      </>
    );
  }
  return (
    <figure
      className={`workshop-diagram concept-animation ${reduced ? "reduced-motion" : ""}`}
      aria-label={`${kind} step-by-step animation`}
    >
      <div className="concept-animation-canvas">
        <svg viewBox="0 0 960 340" role="img" aria-label={STEPS[kind][step]}>
          <defs>
            <marker
              id={`ca-${id}`}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 8 4 0 8Z" fill="#087f83" />
            </marker>
          </defs>
          {drawing}
        </svg>
      </div>
      {kind === "topology" && (
        <div className="node-power-controls">
          <label>
            Node
            <select
              aria-label="Node"
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
            >
              {NODE_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="studio-button secondary"
            onClick={() => toggleNode(selectedNode)}
          >
            {isOff(selectedNode)
              ? "Turn on selected node"
              : "Turn off selected node"}
          </button>
        </div>
      )}
      <div className="concept-animation-controls">
        <div className="campus-button-row">
          <button
            className="text-button"
            onClick={() => {
              if (step === 3 || offNodes.length) {
                setStep(0);
                setTampered(false);
                setOffNodes([]);
              }
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}{" "}
            {playing
              ? "Pause animation"
              : step === 3
                ? "Replay animation"
                : "Play animation"}
          </button>
          <button
            className="text-button"
            disabled={step === 3}
            onClick={() => {
              setPlaying(false);
              setOffNodes([]);
              setStep((n) => Math.min(3, n + 1));
            }}
          >
            <StepForward size={15} /> Next step
          </button>
          <button className="text-button" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <span>{step + 1} / 4</span>
      </div>
      <p className="concept-animation-status" role="status">
        {kind === "topology" && offNodes.length
          ? `${offNodes.length} node${offNodes.length === 1 ? " is" : "s are"} off. Failed nodes have a red X. Their unavailable links are dimmed; click a node again to restore it.`
          : kind === "chain" && tampered
            ? "The edited block’s calculated hash differs from the stored link. A local edit does not change accepted network history."
            : STEPS[kind][step]}
      </p>
      {kind === "chain" && step === 3 && (
        <button
          className="text-button animation-tamper"
          onClick={() => setTampered(!tampered)}
        >
          {tampered ? "Restore first block" : "Edit first block"}
        </button>
      )}
      <figcaption>
        {NOTES[kind]}{" "}
        {kind === "mango" && (
          <a href={MANGO_SOURCE} target="_blank" rel="noreferrer">
            Walmart report ↗
          </a>
        )}
      </figcaption>
    </figure>
  );
}
