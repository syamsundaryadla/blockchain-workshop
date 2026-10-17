"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { sha256 } from "@/lib/crypto";
import type { VisualKind } from "@/content/studio";

export function ChainArtwork({
  interactive = false,
}: {
  interactive?: boolean;
}) {
  const [changed, setChanged] = useState(false);
  const [hashes, setHashes] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    Promise.all([
      sha256("GENESIS"),
      sha256("Alice → Bob: 25"),
      sha256("Alice → Bob: 250"),
      sha256("Bob → Eve: 10"),
    ]).then((values) => {
      if (active) setHashes(values);
    });
    return () => {
      active = false;
    };
  }, []);
  const positions = [
    [43, 263],
    [222, 194],
    [401, 125],
  ];
  return (
    <div className={`chain-artwork ${changed ? "is-tampered" : ""}`}>
      <div className="artwork-heading">
        <span className="status-dot" />A chain of evidence
        <span className="artwork-format">SHA–256</span>
      </div>
      <svg
        viewBox="0 0 600 440"
        role="img"
        aria-label={
          changed
            ? "The middle block has been altered. Its stored hash no longer matches its data."
            : "Three linked blocks, each pointing to the hash of the previous block."
        }
      >
        <defs>
          <pattern
            id="studio-grid"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".7" fill="#819ac0" opacity=".23" />
          </pattern>
          <linearGradient id="block-top" x2="1" y2="1">
            <stop stopColor="#5e86ed" />
            <stop offset="1" stopColor="#3157b6" />
          </linearGradient>
          <linearGradient id="block-front" x2="0" y2="1">
            <stop stopColor="#214dba" />
            <stop offset="1" stopColor="#163880" />
          </linearGradient>
          <linearGradient id="block-side" x2="0" y2="1">
            <stop stopColor="#193b88" />
            <stop offset="1" stopColor="#102552" />
          </linearGradient>
        </defs>
        <rect width="600" height="440" fill="url(#studio-grid)" />
        <path
          d="M15 385 560 175 M15 415 590 193"
          stroke="#6181af"
          strokeWidth=".5"
          opacity=".2"
        />
        <path
          d="m173 313 49-69 M352 244l49-69"
          stroke={changed ? "#f09688" : "#8eaaf5"}
          strokeWidth="2"
          strokeDasharray={changed ? "4 6" : undefined}
        />
        {positions.map(([x, y], index) => (
          <g key={index} className="sculpture-block">
            <path
              d={`M${x} ${y + 112}l65-34 65 34-65 34Z`}
              fill="#040e22"
              opacity=".5"
            />
            <path
              d={`M${x} ${y}l65-34 65 34-65 34Z`}
              fill={index === 1 && changed ? "#ba6c61" : "url(#block-top)"}
              stroke={index === 1 && changed ? "#f4a59a" : "#85a7ff"}
              strokeWidth=".8"
            />
            <path
              d={`M${x} ${y}l65 34v90l-65-34Z`}
              fill={index === 1 && changed ? "#723d3a" : "url(#block-front)"}
              stroke="#7593cb"
              strokeOpacity=".35"
              strokeWidth=".8"
            />
            <path
              d={`M${x + 65} ${y + 34}l65-34v90l-65 34Z`}
              fill="url(#block-side)"
              stroke="#7593cb"
              strokeOpacity=".35"
              strokeWidth=".8"
            />
            <path
              d={`M${x + 12} ${y}l53-27 53 27-53 27Z`}
              fill="none"
              stroke="#a9c0ff"
              opacity=".3"
            />
            <text
              x={x + 65}
              y={y + 5}
              fill="#e0e9ff"
              textAnchor="middle"
              fontSize="14"
              fontFamily="monospace"
            >
              {String(index).padStart(2, "0")}
            </text>
            <g
              transform={`translate(${x + 10} ${y + 30}) skewY(27.6)`}
              fill="#a9c0f4"
              fontFamily="monospace"
              fontSize="7.5"
            >
              <text y="0" fill="#edf3ff">
                {index === 0
                  ? "GENESIS"
                  : index === 1
                    ? "TRANSFER"
                    : "TRANSFER"}
              </text>
              <text y="20">
                {index === 0
                  ? "Origin"
                  : index === 1
                    ? changed
                      ? "250 tokens"
                      : "25 tokens"
                    : "10 tokens"}
              </text>
              <text y="38" fontSize="6.5">
                {(
                  hashes[
                    index === 1 ? (changed ? 2 : 1) : index === 2 ? 3 : 0
                  ] || "········"
                ).slice(0, 8)}
              </text>
            </g>
            <g
              transform={`translate(${x + 75} ${y + 65}) skewY(-27.6)`}
              fill="#5d7cae"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <rect
                  key={i}
                  x={(i % 4) * 10}
                  y={Math.floor(i / 4) * 9}
                  width="5"
                  height="4"
                  opacity={((i % 3) + 1) / 3}
                />
              ))}
            </g>
          </g>
        ))}
        <path
          d="M82 237v-54h91"
          stroke="#657fa5"
          strokeWidth=".7"
          fill="none"
        />
        <text x="84" y="173" fontSize="9" fill="#9bacc6" letterSpacing="1.5">
          THE FIRST RECORD
        </text>
        <path
          d="M467 275v45h-111"
          stroke="#657fa5"
          strokeWidth=".7"
          fill="none"
        />
        <text
          x="357"
          y="339"
          fontSize="9"
          fill={changed ? "#f2a89d" : "#9bacc6"}
          letterSpacing="1.2"
        >
          {changed ? "DATA ≠ STORED HASH" : "LINKED BY A FINGERPRINT"}
        </text>
      </svg>
      {interactive && (
        <div className="artwork-footer">
          <span>
            {changed
              ? "An edit leaves evidence."
              : "What if someone changes the past?"}
          </span>
          <button onClick={() => setChanged(!changed)}>
            {changed ? (
              <>
                <RotateCcw size={13} /> Restore
              </>
            ) : (
              <>
                Try an edit <ArrowUpRight size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

const NODES = [
  [270, 72],
  [412, 155],
  [412, 315],
  [270, 398],
  [128, 315],
  [128, 155],
];

function Mesh({ consensus = false }: { consensus?: boolean }) {
  return (
    <>
      {NODES.map(([x, y], i) =>
        NODES.slice(i + 1).map(([x2, y2], j) => (
          <line
            key={`${i}-${j}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            className="diagram-wire"
          />
        )),
      )}
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="29"
            className={
              consensus && i === 0 ? "diagram-node-active" : "diagram-node"
            }
          />
          <rect
            x={x - 8}
            y={y - 9}
            width="16"
            height="18"
            rx="3"
            fill="none"
            stroke={consensus && i === 0 ? "white" : "#4769b8"}
            strokeWidth="1.5"
          />
          <path
            d={`M${x - 4} ${y - 3}h8m-8 5h8`}
            stroke={consensus && i === 0 ? "white" : "#4769b8"}
          />
          <text
            x={x}
            y={y + 48}
            textAnchor="middle"
            className="diagram-caption"
          >
            {consensus
              ? i === 0
                ? "PROPOSER"
                : `VALIDATOR ${i}`
              : `PEER ${i + 1}`}
          </text>
        </g>
      ))}
      <circle cx="270" cy="235" r="51" fill="#edf2ff" />
      <text x="270" y="231" textAnchor="middle" className="diagram-main">
        {consensus ? "Agree." : "Verify."}
      </text>
      <text x="270" y="250" textAnchor="middle" className="diagram-small">
        {consensus ? "one valid history" : "independently"}
      </text>
    </>
  );
}

function Flow({ kind }: { kind: VisualKind }) {
  const labels =
    kind === "fabric"
      ? ["ENDORSE", "ORDER", "VALIDATE"]
      : kind === "transaction"
        ? ["SIGN", "BROADCAST", "CONFIRM"]
        : ["READ", "EXECUTE", "WRITE"];
  const descriptions =
    kind === "fabric"
      ? ["Peers simulate", "Orderers sequence", "Peers commit"]
      : kind === "transaction"
        ? ["Sender authorizes", "Peers verify", "Ledger updates"]
        : ["Current state", "Contract logic", "Proposed state"];
  return (
    <>
      <path d="M93 233H447" className="diagram-wire" strokeDasharray="4 7" />
      {labels.map((label, i) => (
        <g key={label} transform={`translate(${i * 157 + 45} 160)`}>
          <rect
            width="136"
            height="145"
            rx="12"
            className={i === 1 ? "diagram-node-active" : "diagram-node"}
          />
          <text
            x="18"
            y="30"
            className="diagram-caption"
            fill={i === 1 ? "#b6c9ff" : undefined}
          >
            0{i + 1}
          </text>
          <rect
            x="48"
            y="47"
            width="40"
            height="32"
            rx="5"
            fill="none"
            stroke={i === 1 ? "#bacdff" : "#7289bd"}
          />
          <path
            d="M58 58h20m-20 10h12"
            stroke={i === 1 ? "#bacdff" : "#7289bd"}
          />
          <text
            x="68"
            y="111"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill={i === 1 ? "white" : "#263b61"}
          >
            {label}
          </text>
          <text x="68" y="173" textAnchor="middle" className="diagram-small">
            {descriptions[i]}
          </text>
        </g>
      ))}
      <text x="270" y="107" textAnchor="middle" className="diagram-caption">
        {kind === "fabric"
          ? "EXECUTE–ORDER–VALIDATE"
          : kind === "transaction"
            ? "A TRANSACTION'S JOURNEY"
            : "A DETERMINISTIC STATE CHANGE"}
      </text>
    </>
  );
}

export function SubjectVisual({ kind }: { kind: VisualKind }) {
  if (kind === "chain") return <ChainArtwork />;
  return (
    <div className={`subject-visual subject-${kind}`}>
      <svg
        viewBox="0 0 540 470"
        role="img"
        aria-label={
          {
            hash: "A message passes through SHA-256 to produce a 64-character hash. Changing one letter produces a different fingerprint.",
            network:
              "Six peers connected by redundant paths, each independently verifying the shared record.",
            consensus:
              "A proposer and five validators agree on a valid history.",
            fabric:
              "Endorsing peers simulate, orderers sequence, and peers validate and commit.",
            transaction:
              "A transaction is signed, broadcast to peers, and confirmed in the ledger.",
            docker: "Three isolated containers share one Linux host kernel.",
            state:
              "World State stores the current message; the block log preserves earlier revisions.",
            contract:
              "Contract logic reads current state and proposes a new state.",
          }[kind]
        }
      >
        {kind === "network" || kind === "consensus" ? (
          <Mesh consensus={kind === "consensus"} />
        ) : kind === "hash" ? (
          <>
            <rect
              x="55"
              y="65"
              width="430"
              height="65"
              rx="10"
              className="diagram-node"
            />
            <text x="78" y="88" className="diagram-caption">
              MESSAGE
            </text>
            <text x="78" y="112" className="diagram-main">
              Hello, blockchain.
            </text>
            <path d="M270 130v45m0 80v47" className="diagram-wire" />
            <rect
              x="192"
              y="175"
              width="156"
              height="80"
              rx="12"
              className="diagram-node-active"
            />
            <text
              x="270"
              y="209"
              textAnchor="middle"
              fill="white"
              fontSize="20"
              fontWeight="600"
            >
              SHA–256
            </text>
            <text
              x="270"
              y="232"
              textAnchor="middle"
              fill="#b9ccff"
              fontSize="10"
            >
              ONE-WAY FUNCTION
            </text>
            {Array.from({ length: 64 }, (_, i) => (
              <rect
                key={i}
                x={79 + (i % 16) * 24}
                y={306 + Math.floor(i / 16) * 18}
                width="17"
                height="11"
                rx="2"
                fill={
                  ["#204bc4", "#7394e4", "#b9cbee", "#dfe7fa"][
                    (i * 7 + Math.floor(i / 5)) % 4
                  ]
                }
              />
            ))}
            <text
              x="270"
              y="411"
              textAnchor="middle"
              className="diagram-caption"
            >
              256 BITS. A FINGERPRINT OF YOUR DATA.
            </text>
          </>
        ) : kind === "docker" ? (
          <>
            <rect
              x="47"
              y="109"
              width="446"
              height="262"
              rx="16"
              className="diagram-node"
            />
            {["PEER · ORG 1", "ORDERER", "PEER · ORG 2"].map((label, i) => (
              <g key={label} transform={`translate(${67 + i * 143} 135)`}>
                <rect
                  width="120"
                  height="139"
                  rx="8"
                  fill={i === 1 ? "#2e56bd" : "#e8eefb"}
                />
                <rect
                  x="39"
                  y="28"
                  width="42"
                  height="43"
                  rx="6"
                  fill="none"
                  stroke={i === 1 ? "#c0d0fa" : "#788fbd"}
                  strokeWidth="1.3"
                />
                <text
                  x="60"
                  y="107"
                  textAnchor="middle"
                  fontSize="9"
                  fill={i === 1 ? "white" : "#334e80"}
                >
                  {label}
                </text>
              </g>
            ))}
            <path d="M85 304h370" className="diagram-wire" />
            <text
              x="270"
              y="344"
              textAnchor="middle"
              className="diagram-caption"
            >
              SHARED LINUX KERNEL
            </text>
            <text x="270" y="408" textAnchor="middle" className="diagram-small">
              Isolated processes. One host.
            </text>
          </>
        ) : kind === "state" ? (
          <>
            <text x="53" y="88" className="diagram-caption">
              WORLD STATE
            </text>
            <rect
              x="45"
              y="105"
              width="450"
              height="103"
              rx="12"
              className="diagram-node-active"
            />
            <text
              x="68"
              y="137"
              fill="#b4c7fa"
              fontSize="10"
              fontFamily="monospace"
            >
              GLOBAL_MESSAGE · v3
            </text>
            <text x="68" y="178" fill="white" fontSize="25">
              “Hello, blockchain.”
            </text>
            <path
              d="M270 210v64"
              className="diagram-wire"
              strokeDasharray="4 5"
            />
            <text x="53" y="268" className="diagram-caption">
              BLOCK HISTORY
            </text>
            {["Hello.", "Hello, world.", "Hello, blockchain."].map(
              (label, i) => (
                <g key={label} transform={`translate(${45 + i * 155} 287)`}>
                  <rect
                    width="140"
                    height="104"
                    rx="8"
                    className="diagram-node"
                  />
                  <text x="15" y="30" className="diagram-caption">
                    REVISION {i + 1}
                  </text>
                  <text x="15" y="66" fontSize="12" fill="#3b547b">
                    {label}
                  </text>
                </g>
              ),
            )}
          </>
        ) : (
          <Flow kind={kind} />
        )}
      </svg>
      <span className="visual-footnote">
        {kind === "hash"
          ? "Data → digest"
          : kind === "state"
            ? "Current value / complete history"
            : kind === "docker"
              ? "Container architecture"
              : kind === "network"
                ? "Peer-to-peer topology"
                : kind === "consensus"
                  ? "Distributed agreement"
                  : "Follow the flow"}
      </span>
    </div>
  );
}
