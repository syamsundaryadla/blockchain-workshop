"use client";

import React, { type ReactNode } from "react";

const descriptions: Record<number, string> = {
  2: "One digital token is copied into two conflicting payment claims. A shared ledger must decide which claim is valid.",
  3: "A database controlled by one administrator is compared with an append-only ledger verified by several organizations.",
  4: "A message and its bytes enter SHA-256, producing a fixed 256-bit fingerprint.",
  6: "Changing one character produces a visibly different fingerprint. A matching fingerprint supports integrity; a mismatch reveals a change.",
  7: "A central hub has one failure point. A mesh contains independent nodes with redundant connections.",
  9: "A failed intermediate node blocks the direct route, but a second connected path still reaches the destination.",
  10: "An exploded block separates transaction data, header fields, previous hash, and resulting current hash.",
  12: "An edited transaction no longer matches its stored block hash. The next block's pointer depends on the earlier fingerprint.",
  14: "Full nodes store and verify history, light clients inspect headers and proofs, and validators propose candidate blocks.",
  15: "A public network permits open participation; a permissioned network checks certified identities before admission.",
  16: "Account A requests a transfer of LAPTOP-001 to Account B. The request is authorized, broadcast, checked, and recorded.",
  18: "A transfer of 25 changes Alice's balance from 100 to 75 and Bob's balance from 50 to 75.",
  19: "Honest participants receive conflicting messages from an unreliable participant. Safety and liveness are separate consensus goals.",
  20: "A miner changes the nonce repeatedly until the resulting hash meets the leading-zero target.",
  22: "Proof of Work consumes electricity and computation to produce a proof that is cheap for other nodes to verify.",
  23: "Proof of Work uses computational competition in an open network; Raft replicates a leader's log to a majority of known members.",
  25: "A carrier, port, customs authority, and warehouse share a shipment record while remaining separate organizations.",
  26: "A certificate authority issues an X.509 identity. An MSP checks its organization and role before policy evaluation.",
  27: "Two organizations have their own peers and ledgers. Clients collect endorsements and submit transactions to an ordering service.",
  28: "World State stores the latest owner Bob, while the block log retains creation and transfer transactions.",
  29: "Fabric's eight-step transaction sequence: proposal, simulation, endorsement, submission, ordering, delivery, validation, and commitment.",
  31: "A simulated transaction can pass endorsement but still fail version validation. Only valid writes update World State.",
  33: "A Linux terminal operates Docker, which runs the Fabric test network and provides the environment for peer commands.",
  34: "Containers isolate processes, filesystems, and networking while sharing the Linux host kernel and hardware.",
  36: "Organization containers are isolated by process boundaries; certificates and channel policies provide a separate trust boundary.",
  38: "Two endorsers run the same deterministic contract and produce matching results. A random external result would disagree.",
  41: "Two transactions read version 1; the first valid commit writes version 2, causing the second transaction's version check to fail.",
  42: "A chaincode package is installed on peers, its definition is approved by organizations, and then committed to a channel.",
  44: "A participant updates GLOBAL_MESSAGE through a contract and peers, then reads current state and inspects revision history.",
  47: "The latest message is shown beside a timeline retaining all three earlier versions.",
  50: "Cryptographic integrity, distributed agreement, and shared business rules join to form the workshop's final message-store project.",
};

function Label({
  x,
  y,
  children,
  small = false,
  anchor = "start",
  tone,
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  anchor?: "start" | "middle" | "end";
  tone?: "accent" | "bad" | "good";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`${small ? "wg-small" : "wg-label"} ${tone ? `wg-${tone}-text` : ""}`}
    >
      {children}
    </text>
  );
}
function Card({
  x,
  y,
  w = 170,
  h = 100,
  title,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        className={accent ? "wg-card-accent" : "wg-card"}
      />
      <text
        x={x + 20}
        y={y + 36}
        className={accent ? "wg-on-accent" : "wg-label"}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + 20}
          y={y + 64}
          className={accent ? "wg-on-accent-small" : "wg-small"}
        >
          {sub}
        </text>
      )}
    </g>
  );
}
function Node({
  x,
  y,
  name,
  active = false,
  failed = false,
  r = 24,
}: {
  x: number;
  y: number;
  name?: string;
  active?: boolean;
  failed?: boolean;
  r?: number;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        className={
          failed ? "wg-node-failed" : active ? "wg-card-accent" : "wg-card"
        }
      />
      {failed ? (
        <path
          d={`M${x - 7} ${y - 7}l14 14m-14 0l14-14`}
          className="wg-error-line"
        />
      ) : (
        <>
          <rect
            x={x - 7}
            y={y - 9}
            width="14"
            height="18"
            rx="2"
            fill="none"
            stroke={active ? "white" : "var(--g-accent)"}
            strokeWidth="1.5"
          />
          <path
            d={`M${x - 3} ${y - 3}h6m-6 6h6`}
            stroke={active ? "white" : "var(--g-accent)"}
          />
        </>
      )}
      {name && (
        <Label x={x} y={y + r + 23} small anchor="middle">
          {name}
        </Label>
      )}
    </g>
  );
}
function Wire({
  d,
  arrow = false,
  strong = false,
  bad = false,
  dashed = false,
  id,
}: {
  d: string;
  arrow?: boolean;
  strong?: boolean;
  bad?: boolean;
  dashed?: boolean;
  id?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      className={bad ? "wg-error-line" : strong ? "wg-strong-line" : "wg-wire"}
      markerEnd={arrow ? `url(#wg-arrow-${id})` : undefined}
      strokeDasharray={dashed ? "6 7" : undefined}
    />
  );
}
function Fingerprint({
  x,
  y,
  altered = false,
  width = 350,
}: {
  x: number;
  y: number;
  altered?: boolean;
  width?: number;
}) {
  const cell = width / 16;
  return (
    <g>
      {Array.from({ length: 64 }, (_, i) => (
        <rect
          key={i}
          x={x + (i % 16) * cell}
          y={y + Math.floor(i / 16) * 17}
          width={cell - 4}
          height="11"
          rx="2"
          fill={
            altered
              ? ["#aa6153", "#dfb7aa", "#f1d8cd", "#8e5148"][
                  (i * 3 + Math.floor(i / 7)) % 4
                ]
              : ["var(--g-accent)", "#9aafd6", "#c6d4eb", "#7593c2"][
                  (i * 7 + Math.floor(i / 5)) % 4
                ]
          }
        />
      ))}
    </g>
  );
}

export function WorkshopDiagram({
  slide,
  revealed,
}: {
  slide: number;
  revealed?: number;
}) {
  let drawing: ReactNode;
  const id = slide;
  switch (slide) {
    case 2:
      drawing = (
        <>
          <rect
            x="45"
            y="67"
            width="240"
            height="294"
            rx="18"
            className="wg-panel"
          />
          <Label x={75} y={105} small>
            THE SAME DIGITAL FILE
          </Label>
          <rect
            x="104"
            y="144"
            width="125"
            height="147"
            rx="8"
            className="wg-card"
          />
          <circle cx="167" cy="197" r="24" className="wg-card-accent" />
          <text x="167" y="204" textAnchor="middle" className="wg-on-accent">
            10
          </text>
          <Label x={167} y={258} anchor="middle" small>
            token.dat
          </Label>
          <Wire d="M285 210h95v-74h115M380 210v94h115" strong arrow id={id} />
          <Card x={510} y={85} w={325} title="Pay Bob · 10" sub="Claim A" />
          <Card x={510} y={255} w={325} title="Pay Eve · 10" sub="Claim B" />
          <Label x={450} y={408} anchor="middle" tone="bad">
            Two copies. Two claims. Which one counts?
          </Label>
        </>
      );
      break;
    case 3:
      drawing = (
        <>
          <Label x={210} y={50} anchor="middle">
            One administrator
          </Label>
          <Label x={680} y={50} anchor="middle">
            Several independent verifiers
          </Label>
          <path d="M450 45v345" className="wg-wire" />
          <Node x={210} y={103} active name="DATABASE OWNER" />
          <Wire d="M210 135v40" strong />
          <ellipse
            cx="210"
            cy="202"
            rx="118"
            ry="27"
            className="wg-card-accent"
          />
          <path d="M92 202v100c0 36 236 36 236 0V202" className="wg-card" />
          <ellipse cx="210" cy="302" rx="118" ry="27" className="wg-card" />
          <Label x={210} y={256} anchor="middle">
            UPDATE / DELETE
          </Label>
          <Label x={210} y={375} anchor="middle" small>
            Trust the operator
          </Label>
          {[0, 1, 2].map((n) => (
            <g key={n}>
              <Card
                x={500 + n * 112}
                y={195}
                w={98}
                h={108}
                title={`#${n}`}
                sub={n === 0 ? "Create" : "Append"}
              />
              <Node x={549 + n * 112} y={103} name={`ORG ${n + 1}`} />
              <Wire d={`M${549 + n * 112} 132v57`} />
            </g>
          ))}
          <Wire d="M600 247h9m103 0h9" strong />
          <Label x={677} y={375} anchor="middle" small>
            Verify the shared record
          </Label>
        </>
      );
      break;
    case 4:
      drawing = (
        <>
          <Card
            x={35}
            y={147}
            w={205}
            h={135}
            title="Hello, world."
            sub="Any length of input"
          />
          <Wire d="M246 213h80" arrow strong id={id} />
          <rect
            x="345"
            y="118"
            width="190"
            height="190"
            rx="24"
            className="wg-card-accent"
          />
          <text
            x="440"
            y="201"
            textAnchor="middle"
            className="wg-on-accent wg-large"
          >
            SHA
          </text>
          <text
            x="440"
            y="242"
            textAnchor="middle"
            className="wg-on-accent wg-large"
          >
            256
          </text>
          <Wire d="M542 213h65" arrow strong id={id} />
          <Fingerprint x={635} y={169} width={230} />
          <Label x={750} y={277} anchor="middle" small>
            64 hexadecimal characters
          </Label>
          <Label x={140} y={340} anchor="middle" small>
            DATA IN
          </Label>
          <Label x={440} y={340} anchor="middle" small>
            ONE-WAY FUNCTION
          </Label>
          <Label x={750} y={340} anchor="middle" small>
            FIXED-SIZE DIGEST
          </Label>
        </>
      );
      break;
    case 6:
      drawing = (
        <>
          <Label x={62} y={88} small>
            ORIGINAL
          </Label>
          <Label x={480} y={88} small>
            ONE CHARACTER CHANGED
          </Label>
          <Label x={62} y={145}>
            Hello
          </Label>
          <Label x={480} y={145}>
            hello
          </Label>
          <Fingerprint x={62} y={183} />
          <Fingerprint x={480} y={183} altered />
          <Wire d="M62 285h768" />
          <Label x={450} y={340} anchor="middle">
            A small input change leaves a very different fingerprint.
          </Label>
          <Label x={450} y={379} small anchor="middle">
            TAMPER EVIDENCE ≠ ENCRYPTION
          </Label>
        </>
      );
      break;
    case 7: {
      const positions = [
        [577, 118],
        [758, 118],
        [798, 270],
        [665, 343],
        [535, 270],
      ];
      drawing = (
        <>
          <Label x={220} y={50} anchor="middle">
            Central hub
          </Label>
          <Label x={666} y={50} anchor="middle">
            Peer-to-peer mesh
          </Label>
          {[
            [220, 105],
            [340, 210],
            [290, 335],
            [150, 335],
            [100, 210],
          ].map(([x, y], i) => (
            <g key={i}>
              <Wire d={`M220 218L${x} ${y}`} />
              <Node x={x} y={y} />
            </g>
          ))}
          <Node x={220} y={218} active r={34} />
          <Label x={220} y={400} anchor="middle" small>
            ALL ROUTES DEPEND ON ONE HUB
          </Label>
          {positions.map(([x, y], i) =>
            positions
              .slice(i + 1)
              .map(([x2, y2], j) => (
                <Wire key={`${i}-${j}`} d={`M${x} ${y}L${x2} ${y2}`} />
              )),
          )}
          {positions.map(([x, y], i) => (
            <Node key={i} x={x} y={y} />
          ))}
          <Label x={666} y={400} anchor="middle" small>
            MULTIPLE INDEPENDENT PATHS
          </Label>
        </>
      );
      break;
    }
    case 9:
      drawing = (
        <>
          <Wire d="M95 220L275 110 460 110 650 220 805 220" dashed />
          <Wire
            d="M95 220L275 330 460 330 650 220 805 220"
            strong
            arrow
            id={id}
          />
          <Node x={95} y={220} active name="SOURCE" />
          <Node x={275} y={110} failed name="OFFLINE" />
          <Node x={460} y={110} />
          <Node x={275} y={330} name="ALTERNATE PATH" />
          <Node x={460} y={330} />
          <Node x={650} y={220} />
          <Node x={805} y={220} active name="DESTINATION" />
          <Label x={450} y={215} anchor="middle">
            The direct route fails.
          </Label>
          <Label x={450} y={248} anchor="middle" tone="accent">
            The connected route survives.
          </Label>
        </>
      );
      break;
    case 10:
      drawing = (
        <>
          <Card x={30} y={162} w={170} title="Block #41" sub="hash: 6b83…" />
          <Wire d="M205 213h65" strong arrow id={id} />
          <rect
            x="285"
            y="44"
            width="330"
            height="350"
            rx="14"
            className="wg-card"
          />
          <Label x={310} y={83} small>
            BLOCK #42 / EXPLODED VIEW
          </Label>
          {[
            ["Header", "index · timestamp · nonce"],
            ["Previous hash", "6b83…"],
            ["Transactions", "Alice → Bob · 25"],
          ].map(([title, sub], i) => (
            <g key={title}>
              <rect
                x="309"
                y={107 + i * 72}
                width="283"
                height="60"
                rx="7"
                className={i === 1 ? "wg-card-accent" : "wg-panel"}
              />
              <text
                x="325"
                y={131 + i * 72}
                className={i === 1 ? "wg-on-accent" : "wg-label"}
              >
                {title}
              </text>
              <text
                x="325"
                y={151 + i * 72}
                className={i === 1 ? "wg-on-accent-small" : "wg-small"}
              >
                {sub}
              </text>
            </g>
          ))}
          <Label x={450} y={365} anchor="middle">
            SHA-256 → 9a71…
          </Label>
          <Wire d="M622 213h62" strong arrow id={id} />
          <Card x={700} y={162} w={170} title="Block #43" sub="prev: 9a71…" />
        </>
      );
      break;
    case 12:
      drawing = (
        <>
          {[0, 1, 2, 3].map((n) => (
            <g key={n}>
              <rect
                x={40 + n * 220}
                y="120"
                width="160"
                height="170"
                rx="12"
                className={n === 1 ? "wg-bad-card" : "wg-card"}
              />
              <Label x={60 + n * 220} y={157} small>{`BLOCK #${n}`}</Label>
              <Label x={120 + n * 220} y={213} anchor="middle">
                {n === 1 ? "25 → 250" : n === 0 ? "Genesis" : "Unchanged"}
              </Label>
              <Label x={120 + n * 220} y={252} anchor="middle" small>
                {n === 1
                  ? "HASH MISMATCH"
                  : n > 1
                    ? "DEPENDS ON PRIOR HASH"
                    : "ORIGIN"}
              </Label>
              {n < 3 && (
                <Wire
                  d={`M${205 + n * 220} 204h49`}
                  strong={n === 0}
                  bad={n > 0}
                  dashed={n > 0}
                />
              )}
            </g>
          ))}
          <Label x={450} y={367} anchor="middle">
            An edit cannot silently preserve the old fingerprints.
          </Label>
        </>
      );
      break;
    case 14:
      drawing = (
        <>
          {[
            { x: 35, title: "Full node", sub: "Stores + validates history" },
            { x: 335, title: "Light client", sub: "Checks headers + proofs" },
            { x: 635, title: "Validator", sub: "Proposes a candidate block" },
          ].map(({ x, title, sub }, i) => (
            <g key={title}>
              <rect
                x={x}
                y="70"
                width="230"
                height="290"
                rx="14"
                className="wg-panel"
              />
              <Label x={x + 115} y={112} anchor="middle">
                {title}
              </Label>
              {i === 0 ? (
                [0, 1, 2, 3].map((n) => (
                  <rect
                    key={n}
                    x={x + 55}
                    y={148 + n * 31}
                    width="120"
                    height="23"
                    rx="4"
                    className="wg-card"
                  />
                ))
              ) : i === 1 ? (
                <>
                  <rect
                    x={x + 55}
                    y="150"
                    width="120"
                    height="25"
                    rx="4"
                    className="wg-card-accent"
                  />
                  <Wire
                    d={`M${x + 115} 179v35m-55 0h110m-110 0v25m110-25v25`}
                  />
                  <circle cx={x + 60} cy="251" r="14" className="wg-card" />
                  <circle cx={x + 170} cy="251" r="14" className="wg-card" />
                </>
              ) : (
                <>
                  <rect
                    x={x + 61}
                    y="153"
                    width="109"
                    height="111"
                    rx="8"
                    className="wg-card-accent"
                  />
                  <path
                    d={`M${x + 91} 209l17 17 37-40`}
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                  />
                </>
              )}
              <Label x={x + 115} y={326} anchor="middle" small>
                {sub}
              </Label>
            </g>
          ))}
        </>
      );
      break;
    case 15:
      drawing = (
        <>
          <rect
            x="35"
            y="69"
            width="380"
            height="292"
            rx="130"
            className="wg-open-boundary"
          />
          <Label x={225} y={111} anchor="middle">
            Open participation
          </Label>
          {[
            [130, 185],
            [235, 176],
            [328, 212],
            [175, 278],
            [290, 288],
          ].map(([x, y], i) => (
            <Node key={i} x={x} y={y} />
          ))}
          <rect
            x="495"
            y="69"
            width="370"
            height="292"
            rx="14"
            className="wg-panel"
          />
          <Label x={680} y={111} anchor="middle">
            Certified membership
          </Label>
          <path d="M549 139v174" className="wg-strong-line" />
          <rect
            x="525"
            y="200"
            width="49"
            height="48"
            rx="6"
            className="wg-card-accent"
          />
          <text x="550" y="230" textAnchor="middle" className="wg-on-accent">
            ✓
          </text>
          <Node x={650} y={188} name="ORG 1" />
          <Node x={778} y={276} name="ORG 2" />
          <Wire d="M674 206l79 53" />
          <Label x={225} y={410} anchor="middle" small>
            PUBLIC NETWORK
          </Label>
          <Label x={680} y={410} anchor="middle" small>
            PERMISSIONED NETWORK
          </Label>
        </>
      );
      break;
    case 16:
      drawing = (
        <>
          {["Sign", "Broadcast", "Verify", "Confirm"].map((title, i) => (
            <g
              key={title}
              style={{
                opacity: revealed === undefined || i < revealed ? 1 : 0.13,
              }}
            >
              <Card
                x={30 + i * 225}
                y={135}
                w={165}
                h={150}
                title={title}
                sub={
                  [
                    "Account A authorizes",
                    "Peers receive",
                    "Rules are checked",
                    "Ledger updates",
                  ][i]
                }
                accent={i === 0}
              />
              <Label x={52 + i * 225} y={245} small>{`0${i + 1}`}</Label>
              {i < 3 && (
                <Wire d={`M${200 + i * 225} 209h47`} strong arrow id={id} />
              )}
            </g>
          ))}
          <Label x={450} y={368} anchor="middle">
            LAPTOP-001 · Account A → Account B
          </Label>
        </>
      );
      break;
    case 18:
      drawing = (
        <>
          <Label x={235} y={74} anchor="middle" small>
            BEFORE
          </Label>
          <Label x={670} y={74} anchor="middle" small>
            AFTER A VERIFIED TRANSFER
          </Label>
          {["Alice", "Bob"].map((name, i) => (
            <g key={name}>
              <Label x={55} y={165 + i * 145}>
                {name}
              </Label>
              <text
                x="235"
                y={177 + i * 145}
                textAnchor="middle"
                className="wg-number"
              >
                {i === 0 ? "100" : "50"}
              </text>
              <Wire d={`M350 ${155 + i * 145}h160`} strong arrow id={id} />
              <text
                x="670"
                y={177 + i * 145}
                textAnchor="middle"
                className="wg-number wg-accent-text"
              >
                75
              </text>
              <Label x={450} y={132 + i * 145} anchor="middle" small>
                {i === 0 ? "− 25" : "+ 25"}
              </Label>
            </g>
          ))}
          <Label x={450} y={413} anchor="middle" small>
            SAME VALID TRANSACTION + SAME RULES → SAME NEXT STATE
          </Label>
        </>
      );
      break;
    case 19:
      drawing = (
        <>
          <Node x={450} y={82} failed name="UNRELIABLE PARTICIPANT" r={33} />
          {[
            [110, 270],
            [335, 320],
            [570, 320],
            [790, 270],
          ].map(([x, y], i) => (
            <g key={i}>
              <Wire d={`M450 119L${x} ${y - 32}`} bad dashed />
              <Node x={x} y={y} name={`HONEST ${i + 1}`} r={29} />
            </g>
          ))}
          <Label x={210} y={169} small tone="bad">
            MESSAGE A
          </Label>
          <Label x={655} y={169} small tone="bad">
            MESSAGE B
          </Label>
          <rect
            x="298"
            y="179"
            width="304"
            height="64"
            rx="9"
            className="wg-panel"
          />
          <Label x={450} y={217} anchor="middle">
            Which history do we accept?
          </Label>
          <Label x={230} y={420} anchor="middle" small>
            SAFETY: NO CONFLICTING DECISIONS
          </Label>
          <Label x={680} y={420} anchor="middle" small>
            LIVENESS: EVENTUAL PROGRESS
          </Label>
        </>
      );
      break;
    case 20:
      drawing = (
        <>
          <Label x={55} y={70} small>
            CHANGE THE NONCE. HASH AGAIN.
          </Label>
          {[
            ["1", "a9f3…", "Try again"],
            ["2", "c728…", "Try again"],
            ["3", "75ab…", "Try again"],
            ["…", "000e…", "Target met"],
          ].map(([nonce, hash, status], i) => (
            <g key={nonce}>
              <rect
                x="45"
                y={97 + i * 68}
                width="485"
                height="55"
                rx="6"
                className={i === 3 ? "wg-card-accent" : "wg-panel"}
              />
              <text
                x="68"
                y={131 + i * 68}
                className={i === 3 ? "wg-on-accent" : "wg-small"}
              >{`nonce ${nonce}`}</text>
              <text
                x="225"
                y={131 + i * 68}
                className={i === 3 ? "wg-on-accent" : "wg-label"}
              >
                {hash}
              </text>
              <text
                x="405"
                y={131 + i * 68}
                className={i === 3 ? "wg-on-accent-small" : "wg-small"}
              >
                {status}
              </text>
            </g>
          ))}
          <rect
            x="590"
            y="102"
            width="260"
            height="230"
            rx="17"
            className="wg-card"
          />
          <Label x={720} y={148} anchor="middle" small>
            ILLUSTRATIVE TARGET
          </Label>
          <text x="720" y="218" textAnchor="middle" className="wg-number">
            000…
          </text>
          <Label x={720} y={280} anchor="middle" small>
            Hard to find. Easy to verify.
          </Label>
          <Label x={450} y={414} anchor="middle" small>
            ILLUSTRATIVE ATTEMPTS · NEXT: MINE REAL HASHES IN THE LAB
          </Label>
        </>
      );
      break;
    case 22:
      drawing = (
        <>
          <path
            d="m100 99-49 109h48l-16 95 79-132h-51l26-72Z"
            className="wg-card-accent"
          />
          <Label x={112} y={356} anchor="middle">
            Electricity
          </Label>
          <Wire d="M185 207h101" strong arrow id={id} />
          <rect
            x="310"
            y="107"
            width="240"
            height="195"
            rx="14"
            className="wg-card"
          />
          {[0, 1, 2].map((n) => (
            <g key={n}>
              <rect
                x="335"
                y={127 + n * 50}
                width="190"
                height="36"
                rx="4"
                className="wg-panel"
              />
              <circle cx="360" cy={145 + n * 50} r="10" className="wg-wire" />
              <path
                d={`M387 ${140 + n * 50}h110m-110 10h110`}
                className="wg-wire"
              />
            </g>
          ))}
          <Label x={430} y={356} anchor="middle">
            Many hash attempts
          </Label>
          <Wire d="M574 207h100" strong arrow id={id} />
          <rect
            x="710"
            y="144"
            width="137"
            height="112"
            rx="12"
            className="wg-card-accent"
          />
          <text
            x="779"
            y="214"
            textAnchor="middle"
            className="wg-on-accent wg-large"
          >
            000…
          </text>
          <Label x={779} y={356} anchor="middle">
            One verifiable proof
          </Label>
          <Label x={450} y={418} anchor="middle" small>
            SECURITY BENEFIT / ENERGY COST / PROBABILISTIC FINALITY
          </Label>
        </>
      );
      break;
    case 23:
      drawing = (
        <>
          <Label x={218} y={65} anchor="middle">
            Proof of Work
          </Label>
          <Label x={690} y={65} anchor="middle">
            Raft
          </Label>
          {[
            [100, 163],
            [215, 163],
            [330, 163],
          ].map(([x, y], i) => (
            <g key={i}>
              <Node x={x} y={y} active={i === 1} />
              <Wire d={`M${x} 195L215 280`} />
            </g>
          ))}
          <Card x={140} y={280} w={150} h={75} title="Valid proof" accent />
          <Label x={217} y={410} anchor="middle" small>
            OPEN COMPETITION · WORK
          </Label>
          <Node x={690} y={143} active name="LEADER" />
          <Wire
            d="M690 175v49m-120 0h240m-240 0v48m120-48v48m120-48v48"
            strong
          />
          {[570, 690, 810].map((x, i) => (
            <Node key={x} x={x} y={300} name={`FOLLOWER ${i + 1}`} />
          ))}
          <Label x={690} y={410} anchor="middle" small>
            KNOWN CLUSTER · MAJORITY
          </Label>
          <path d="M445 75v320" className="wg-wire" />
        </>
      );
      break;
    case 25:
      drawing = (
        <>
          {[
            [45, 65, "Carrier", "Shipment created"],
            [600, 65, "Port", "Cargo received"],
            [45, 284, "Customs", "Clearance recorded"],
            [600, 284, "Warehouse", "Delivery confirmed"],
          ].map(([x, y, title, sub]) => (
            <g key={title}>
              <Card
                x={Number(x)}
                y={Number(y)}
                w={245}
                h={100}
                title={String(title)}
                sub={String(sub)}
              />
              <Wire
                d={`M${Number(x) < 300 ? 295 : 595} ${Number(y) + 50}L450 222`}
              />
            </g>
          ))}
          <circle cx="450" cy="222" r="83" className="wg-card-accent" />
          <text x="450" y="208" textAnchor="middle" className="wg-on-accent">
            SHIPMENT
          </text>
          <text
            x="450"
            y="239"
            textAnchor="middle"
            className="wg-on-accent-small"
          >
            A shared record
          </text>
          <Label x={450} y={421} anchor="middle" small>
            FOUR ORGANIZATIONS · ONE CONSORTIUM
          </Label>
        </>
      );
      break;
    case 26:
      drawing = (
        <>
          <Node x={100} y={213} active r={47} name="CERTIFICATE AUTHORITY" />
          <Wire d="M153 213h100" strong arrow id={id} />
          <rect
            x="285"
            y="62"
            width="285"
            height="300"
            rx="13"
            className="wg-card"
          />
          <Label x={313} y={107} small>
            X.509 CERTIFICATE
          </Label>
          <circle cx="331" cy="158" r="19" className="wg-panel" />
          <path d="M366 147h165m-165 17h125" className="wg-wire" />
          <Label x={313} y={220}>
            Subject: User1
          </Label>
          <Label x={313} y={256}>
            Organization: Org1
          </Label>
          <Label x={313} y={292}>
            Role: client
          </Label>
          <Label x={313} y={334} small>
            Signed by a trusted issuer
          </Label>
          <Wire d="M579 213h84" strong arrow id={id} />
          <Card
            x={695}
            y={145}
            w={170}
            h={139}
            title="MSP"
            sub="Identity + role"
            accent
          />
          <Label x={780} y={331} anchor="middle" small>
            POLICY EVALUATION
          </Label>
        </>
      );
      break;
    case 27:
      drawing = (
        <>
          <Card x={345} y={15} w={210} h={78} title="Client / gateway" />
          <Wire d="M375 98L235 167m290-69 140 69" strong />
          <rect
            x="45"
            y="157"
            width="340"
            height="221"
            rx="14"
            className="wg-panel"
          />
          <rect
            x="515"
            y="157"
            width="340"
            height="221"
            rx="14"
            className="wg-panel"
          />
          <Label x={67} y={190} small>
            ORGANIZATION 1
          </Label>
          <Label x={539} y={190} small>
            ORGANIZATION 2
          </Label>
          <Node x={140} y={253} name="PEER 1" />
          <Node x={615} y={253} name="PEER 2" />
          <Card
            x={211}
            y={218}
            w={147}
            h={92}
            title="Ledger"
            sub="Local replica"
          />
          <Card
            x={687}
            y={218}
            w={147}
            h={92}
            title="Ledger"
            sub="Local replica"
          />
          <Card
            x={345}
            y={335}
            w={210}
            h={80}
            title="Ordering service"
            accent
          />
          <Wire d="M345 372L186 309m369 63 96-63" strong />
          <Label x={450} y={145} anchor="middle" small>
            ENDORSEMENTS
          </Label>
          <Label x={450} y={275} anchor="middle" small>
            CHANNEL
          </Label>
        </>
      );
      break;
    case 28:
      drawing = (
        <>
          <rect
            x="40"
            y="65"
            width="340"
            height="300"
            rx="15"
            className="wg-panel"
          />
          <Label x={70} y={109} small>
            WORLD STATE / LATEST
          </Label>
          <Label x={70} y={164}>
            asset1.owner
          </Label>
          <text
            x="210"
            y="251"
            textAnchor="middle"
            className="wg-number wg-accent-text"
          >
            Bob
          </text>
          <Label x={210} y={320} anchor="middle" small>
            Fast current-value query
          </Label>
          <Wire d="M415 215h70" strong arrow id={id} />
          <Label x={684} y={72} anchor="middle" small>
            BLOCK LOG / HISTORY
          </Label>
          {[
            ["Block 0", "Create · Alice"],
            ["Block 1", "Transfer · Bob"],
            ["Block 2", "Next transaction…"],
          ].map(([title, sub], i) => (
            <g key={title}>
              <Card
                x={525}
                y={95 + i * 99}
                w={325}
                h={82}
                title={title}
                sub={sub}
                accent={i === 1}
              />
              {i < 2 && <Wire d={`M690 ${179 + i * 99}v15`} />}
            </g>
          ))}
        </>
      );
      break;
    case 29: {
      const steps = [
        "Proposal",
        "Simulate",
        "Endorse",
        "Submit",
        "Order",
        "Deliver",
        "Validate",
        "Commit",
      ];
      drawing = (
        <>
          <Label x={235} y={43} anchor="middle" small>
            EXECUTE / ENDORSE
          </Label>
          <Label x={687} y={43} anchor="middle" small>
            ORDER → VALIDATE
          </Label>
          {steps.map((title, i) => {
            const col = i < 4 ? i : 7 - i;
            const x = 30 + col * 225;
            const y = i < 4 ? 80 : 270;
            return (
              <g
                key={title}
                style={{
                  opacity: revealed === undefined || i < revealed ? 1 : 0.13,
                }}
              >
                <Card
                  x={x}
                  y={y}
                  w={165}
                  h={100}
                  title={title}
                  sub={`STEP ${i + 1}`}
                  accent={i === 7}
                />
                {i < 3 && (
                  <Wire d={`M${x + 172} ${y + 50}h42`} arrow strong id={id} />
                )}
                {i === 3 && (
                  <Wire d={`M${x + 82} ${y + 110}v69`} arrow strong id={id} />
                )}
                {i > 3 && i < 7 && (
                  <Wire d={`M${x - 7} ${y + 50}h-42`} arrow strong id={id} />
                )}
              </g>
            );
          })}
          <Label x={450} y={427} anchor="middle" small>
            SIMULATION PRODUCES A READ / WRITE SET · COMMITMENT UPDATES THE
            LEDGER
          </Label>
        </>
      );
      break;
    }
    case 31:
      drawing = (
        <>
          <Card
            x={35}
            y={164}
            w={205}
            h={100}
            title="Endorsed proposal"
            sub="Read version: v1"
          />
          <Wire d="M247 213h94" strong arrow id={id} />
          <rect
            x="365"
            y="142"
            width="160"
            height="142"
            rx="20"
            className="wg-card-accent"
          />
          <text x="445" y="205" textAnchor="middle" className="wg-on-accent">
            VALIDATE
          </text>
          <text
            x="445"
            y="239"
            textAnchor="middle"
            className="wg-on-accent-small"
          >
            Policy + versions
          </text>
          <Wire d="M533 213h45v-105h70m-70 105v112h70" strong arrow id={id} />
          <Card
            x={665}
            y={63}
            w={200}
            h={100}
            title="VALID"
            sub="Update World State"
            accent
          />
          <rect
            x="665"
            y="274"
            width="200"
            height="100"
            rx="10"
            className="wg-bad-card"
          />
          <Label x={685} y={313} tone="bad">
            INVALID
          </Label>
          <Label x={685} y={342} small>
            No state update
          </Label>
          <Label x={450} y={424} anchor="middle" small>
            BOTH VALID AND INVALID TRANSACTIONS REMAIN IN THE COMMITTED BLOCK
          </Label>
        </>
      );
      break;
    case 33:
      drawing = (
        <>
          <rect
            x="35"
            y="75"
            width="390"
            height="280"
            rx="13"
            className="wg-terminal"
          />
          <circle cx="58" cy="95" r="4" fill="#bf7d70" />
          <circle cx="73" cy="95" r="4" fill="#d4b26f" />
          <circle cx="88" cy="95" r="4" fill="#7d9b86" />
          <text x="62" y="151" className="wg-terminal-text">
            $ docker --version
          </text>
          <text x="62" y="198" className="wg-terminal-text">
            $ ./network.sh up
          </text>
          <text x="62" y="245" className="wg-terminal-text">
            $ peer chaincode query
          </text>
          <text x="62" y="315" className="wg-on-accent-small">
            A consistent Linux environment
          </text>
          <Wire d="M444 213h66" arrow strong id={id} />
          <Card
            x={535}
            y={83}
            w={315}
            title="Tools"
            sub="Git · Node.js · Fabric binaries"
          />
          <Card
            x={535}
            y={215}
            w={315}
            title="Runtime"
            sub="Docker · peer / orderer containers"
            accent
          />
          <Label x={450} y={416} anchor="middle" small>
            INSTALL → VERIFY → START THE TEST NETWORK
          </Label>
        </>
      );
      break;
    case 34:
      drawing = (
        <>
          <rect
            x="45"
            y="36"
            width="810"
            height="364"
            rx="18"
            className="wg-panel"
          />
          {["PEER · ORG 1", "ORDERER", "PEER · ORG 2"].map((name, i) => (
            <g key={name}>
              <rect
                x={76 + i * 267}
                y="67"
                width="215"
                height="174"
                rx="10"
                className="wg-card"
              />
              <Label x={183 + i * 267} y={105} anchor="middle" small>
                {name}
              </Label>
              <rect
                x={100 + i * 267}
                y="126"
                width="166"
                height="42"
                rx="5"
                className="wg-card-accent"
              />
              <text
                x={183 + i * 267}
                y="152"
                textAnchor="middle"
                className="wg-on-accent-small"
              >
                Process + filesystem
              </text>
              <Label x={183 + i * 267} y={204} anchor="middle" small>
                Isolated namespace
              </Label>
            </g>
          ))}
          <rect
            x="76"
            y="270"
            width="749"
            height="48"
            rx="7"
            className="wg-card-accent"
          />
          <text x="450" y="300" textAnchor="middle" className="wg-on-accent">
            Shared Linux kernel
          </text>
          <Label x={450} y={367} anchor="middle" small>
            HARDWARE / CPU / MEMORY / NETWORK
          </Label>
        </>
      );
      break;
    case 36:
      drawing = (
        <>
          <rect
            x="35"
            y="52"
            width="830"
            height="305"
            rx="16"
            className="wg-panel"
          />
          {["ORG 1", "ORG 2"].map((org, i) => (
            <g key={org}>
              <rect
                x={65 + i * 420}
                y="84"
                width="350"
                height="235"
                rx="12"
                className="wg-open-boundary"
              />
              <Label x={91 + i * 420} y={118} small>
                {org} / PROCESS BOUNDARY
              </Label>
              <Node x={150 + i * 420} y={187} name="PEER" />
              <Card
                x={225 + i * 420}
                y={156}
                w={165}
                h={82}
                title="Identity"
                sub={`Certificate · ${org}`}
              />
              <Label x={235 + i * 420} y={288} anchor="middle" small>
                Separate workloads + credentials
              </Label>
            </g>
          ))}
          <Wire d="M415 199h70" strong />
          <Label x={450} y={404} anchor="middle">
            Isolation runs the workloads. Policies establish trust.
          </Label>
        </>
      );
      break;
    case 38:
      drawing = (
        <>
          <Card
            x={35}
            y={164}
            w={170}
            h={102}
            title="Same input"
            sub="Transfer(asset1, Bob)"
          />
          <Wire d="M215 212h60v-97h78m-78 97v106h78" arrow strong id={id} />
          <Card
            x={370}
            y={64}
            w={230}
            h={100}
            title="Endorser A"
            sub="Contract + current state"
          />
          <Card
            x={370}
            y={270}
            w={230}
            h={100}
            title="Endorser B"
            sub="Contract + current state"
          />
          <Wire d="M612 115h50v97h47m-47 0v107h-50" arrow strong id={id} />
          <rect
            x="725"
            y="164"
            width="140"
            height="102"
            rx="10"
            className="wg-card-accent"
          />
          <text
            x="795"
            y="207"
            textAnchor="middle"
            className="wg-on-accent wg-large"
          >
            =
          </text>
          <text
            x="795"
            y="241"
            textAnchor="middle"
            className="wg-on-accent-small"
          >
            Matching results
          </text>
          <Label x={450} y={423} anchor="middle" small>
            NO RANDOM VALUES · NO UNCONTROLLED EXTERNAL CALLS · SAME RESULT
          </Label>
        </>
      );
      break;
    case 41:
      drawing = (
        <>
          <Label x={60} y={53} small>
            TWO TRANSFERS READ THE SAME ASSET
          </Label>
          <Wire d="M170 90v278m300-278v278m270-278v278" dashed />
          <Label x={170} y={87} anchor="middle">
            Tx A
          </Label>
          <Label x={470} y={87} anchor="middle">
            World State
          </Label>
          <Label x={740} y={87} anchor="middle">
            Tx B
          </Label>
          <Wire d="M185 145h265M725 145H490" arrow strong id={id} />
          <Label x={470} y={184} anchor="middle" small>
            Both read v1
          </Label>
          <Wire d="M185 226h265" arrow strong id={id} />
          <Label x={310} y={216} anchor="middle" small>
            A commits → v2
          </Label>
          <Wire d="M725 301H490" arrow bad id={id} />
          <Label x={616} y={286} anchor="middle" small tone="bad">
            B expects v1 → rejected
          </Label>
          <Label x={450} y={418} anchor="middle" small>
            MVCC PREVENTS A STALE READ FROM OVERWRITING A NEWER COMMIT
          </Label>
        </>
      );
      break;
    case 42:
      drawing = (
        <>
          {["Package", "Install", "Approve", "Commit"].map((title, i) => (
            <g
              key={title}
              style={{
                opacity: revealed === undefined || i < revealed ? 1 : 0.13,
              }}
            >
              <rect
                x={34 + i * 225}
                y="111"
                width="160"
                height="172"
                rx="12"
                className={i === 3 ? "wg-card-accent" : "wg-card"}
              />
              <text
                x={57 + i * 225}
                y="151"
                className={i === 3 ? "wg-on-accent-small" : "wg-small"}
              >{`0${i + 1}`}</text>
              <text
                x={114 + i * 225}
                y="202"
                textAnchor="middle"
                className={i === 3 ? "wg-on-accent" : "wg-label"}
              >
                {title}
              </text>
              <text
                x={114 + i * 225}
                y="245"
                textAnchor="middle"
                className={i === 3 ? "wg-on-accent-small" : "wg-small"}
              >
                {
                  [
                    "Build the bundle",
                    "On each peer",
                    "By organizations",
                    "On the channel",
                  ][i]
                }
              </text>
              {i < 3 && (
                <Wire d={`M${201 + i * 225} 194h44`} arrow strong id={id} />
              )}
            </g>
          ))}
          <Label x={450} y={363} anchor="middle">
            Installing code and approving a definition are different steps.
          </Label>
        </>
      );
      break;
    case 44:
      drawing = (
        <>
          <rect
            x="40"
            y="98"
            width="235"
            height="234"
            rx="14"
            className="wg-panel"
          />
          <Label x={65} y={135} small>
            YOUR MESSAGE
          </Label>
          <rect
            x="64"
            y="167"
            width="188"
            height="72"
            rx="7"
            className="wg-card"
          />
          <Label x={157} y={209} anchor="middle">
            Hello!
          </Label>
          <rect
            x="104"
            y="262"
            width="109"
            height="38"
            rx="6"
            className="wg-card-accent"
          />
          <text
            x="158"
            y="287"
            textAnchor="middle"
            className="wg-on-accent-small"
          >
            UpdateMessage
          </text>
          <Wire d="M289 214h66" arrow strong id={id} />
          <Card
            x={375}
            y={163}
            w={185}
            h={100}
            title="The contract"
            sub="GLOBAL_MESSAGE"
            accent
          />
          <Wire d="M573 214h35v-85h46m-46 85v106h46" arrow strong id={id} />
          <Card
            x={675}
            y={76}
            w={185}
            title="Current state"
            sub="Read the latest value"
          />
          <Card
            x={675}
            y={270}
            w={185}
            title="Block history"
            sub="Inspect every revision"
          />
        </>
      );
      break;
    case 47:
      drawing = (
        <>
          <Label x={70} y={79} small>
            LATEST VALUE
          </Label>
          <rect
            x="55"
            y="105"
            width="780"
            height="97"
            rx="14"
            className="wg-card-accent"
          />
          <text x="85" y="164" className="wg-on-accent wg-large">
            “Hello, blockchain.”
          </text>
          <Label x={70} y={264} small>
            THE RECORD OF CHANGES
          </Label>
          <Wire d="M107 324h690" strong />
          {["Hello.", "Hello, world.", "Hello, blockchain."].map((value, i) => (
            <g key={value}>
              <circle
                cx={107 + i * 340}
                cy="324"
                r="10"
                className="wg-card-accent"
              />
              <Label
                x={107 + i * 340}
                y={293}
                anchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
                small
              >{`REVISION ${i + 1}`}</Label>
              <Label
                x={107 + i * 340}
                y={371}
                anchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
              >
                {value}
              </Label>
            </g>
          ))}
          <Label x={450} y={425} anchor="middle" small>
            THE STATE CHANGES. THE EARLIER TRANSACTIONS REMAIN.
          </Label>
        </>
      );
      break;
    case 50:
      drawing = (
        <>
          <Card
            x={25}
            y={70}
            w={230}
            title="Integrity"
            sub="Hashes + linked records"
          />
          <Card
            x={335}
            y={70}
            w={230}
            title="Agreement"
            sub="Consensus + validation"
          />
          <Card
            x={645}
            y={70}
            w={230}
            title="Shared rules"
            sub="Contracts + policies"
          />
          <Wire d="M140 185v64h620v-64m-310 64v59" strong arrow id={id} />
          <rect
            x="280"
            y="325"
            width="340"
            height="85"
            rx="12"
            className="wg-card-accent"
          />
          <text x="450" y="360" textAnchor="middle" className="wg-on-accent">
            YOUR FIRST SHARED LEDGER
          </text>
          <text
            x="450"
            y="386"
            textAnchor="middle"
            className="wg-on-accent-small"
          >
            Store → read → update → verify
          </text>
        </>
      );
      break;
    default:
      throw new Error(`Missing workshop infographic for slide ${slide}`);
  }
  return (
    <figure className={`workshop-diagram diagram-${slide}`}>
      <svg viewBox="0 0 900 450" role="img" aria-label={descriptions[slide]}>
        <defs>
          <marker
            id={`wg-arrow-${id}`}
            markerWidth="9"
            markerHeight="9"
            refX="8"
            refY="4.5"
            orient="auto"
          >
            <path d="M0 0l9 4.5L0 9Z" fill="var(--g-accent)" />
          </marker>
        </defs>
        {drawing}
      </svg>
    </figure>
  );
}
