import React, { useId, type ReactNode } from "react";
import {
  Container,
  FileKey2,
  GraduationCap,
  HeartPulse,
  KeyRound,
  Landmark,
  Laptop,
  Package,
  ShieldCheck,
  Vote,
  Wallet,
} from "lucide-react";

const scenes = [
  "blockchain-definition",
  "bitcoin-timeline",
  "banking",
  "topologies",
  "block-fields",
  "ledger-replicas",
  "features",
  "p2p",
  "verification",
  "pow",
  "pos",
  "network-types",
  "wallet-address",
  "ethereum",
  "dapp",
  "supply-chain",
  "finance",
  "records",
  "voting",
  "tradelens",
  "tradeoffs",
  "environment",
  "live-demo",
  "security",
  "next-steps",
];
export const isFoundationScene = (scene: string) => scenes.includes(scene);

function Text({
  x,
  y,
  children,
  small = false,
  center = false,
  white = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  center?: boolean;
  white?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={center ? "middle" : "start"}
      className={`${small ? "fw-small" : "fw-label"} ${white ? "fw-white" : ""}`}
    >
      {children}
    </text>
  );
}
function Box({
  x,
  y,
  w = 240,
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
        rx="12"
        className={accent ? "fw-fill" : "fw-card"}
      />
      <Text x={x + 20} y={y + (sub ? 38 : h / 2 + 7)} white={accent}>
        {title}
      </Text>
      {sub && (
        <Text x={x + 20} y={y + 68} small white={accent}>
          {sub}
        </Text>
      )}
    </g>
  );
}
function Dot({
  x,
  y,
  label,
  active = false,
}: {
  x: number;
  y: number;
  label?: string;
  active?: boolean;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="23" className={active ? "fw-fill" : "fw-coin"} />
      {label && (
        <Text x={x} y={y + 6} small center white={active}>
          {label}
        </Text>
      )}
    </g>
  );
}
function Ledger({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width="170" height="155" rx="10" className="fw-card" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={x + 18}
            y={y + 22 + i * 35}
            width="26"
            height="20"
            rx="3"
            className="fw-fill"
          />
          <path d={`M${x + 57} ${y + 30 + i * 35}h90`} className="fw-wire" />
        </g>
      ))}
      <Text x={x + 85} y={y + 189} center>
        {label}
      </Text>
    </g>
  );
}

export function FoundationDiagram({ scene }: { scene: string }) {
  const id = useId().replace(/:/g, "");
  const arrow = (d: string) => (
    <path d={d} className="fw-wire" markerEnd={`url(#foundation-${id})`} />
  );
  let art: ReactNode;
  switch (scene) {
    case "blockchain-definition":
      art = (
        <>
          <Ledger x={60} y={87} label="Recorded changes" />
          {arrow("M250 165h80")}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={350 + i * 78}
                y="125"
                width="60"
                height="80"
                rx="7"
                className={i === 1 ? "fw-fill" : "fw-card"}
              />
              {i < 2 && (
                <path d={`M${410 + i * 78} 165h18`} className="fw-wire" />
              )}
            </g>
          ))}
          <Text x={455} y={276} center>
            Linked blocks
          </Text>
          {arrow("M600 165h65")}
          <ShieldCheck
            x={737}
            y={120}
            width={80}
            height={80}
            className="foundation-icon"
          />
          <Text x={775} y={276} center>
            Agreed acceptance rules
          </Text>
        </>
      );
      break;
    case "bitcoin-timeline":
      art = (
        <>
          <path d="M90 170H865" className="fw-wire" />
          {[
            [120, "Before Bitcoin", "Cryptography + timestamps"],
            [365, "2008", "Bitcoin paper"],
            [610, "2009", "Bitcoin network"],
            [850, "Beyond currency", "Shared programs + records"],
          ].map(([x, a, b]) => (
            <g key={a}>
              <Dot x={Number(x)} y={170} active={a === "2009"} />
              <Text x={Number(x)} y={110} center>
                {a}
              </Text>
              <Text x={Number(x)} y={235} small center>
                {b}
              </Text>
            </g>
          ))}
          <Text x={480} y={325} center>
            One digital balance should not be spent twice.
          </Text>
        </>
      );
      break;
    case "banking":
      art = (
        <>
          <Landmark
            x={170}
            y={60}
            width={65}
            height={65}
            className="foundation-icon"
          />
          <Landmark
            x={720}
            y={60}
            width={65}
            height={65}
            className="foundation-icon"
          />
          <Ledger x={115} y={148} label="Bank A record" />
          <Ledger x={665} y={148} label="Bank B record" />
          {arrow("M310 215h335")}
          <Text x={480} y={180} center>
            Transfer + reconcile
          </Text>
          <Text x={480} y={265} small center>
            Different records · shared payment arrangements
          </Text>
        </>
      );
      break;
    case "topologies": {
      const mesh = [
        [-66, -45],
        [66, -45],
        [-66, 65],
        [66, 65],
      ];
      art = (
        <>
          {[160, 480, 800].map((cx, group) => (
            <g key={cx}>
              <Text x={cx} y={45} center>
                {["Centralized", "Decentralized", "Distributed"][group]}
              </Text>
              {group === 0 ? (
                <>
                  {mesh.map(([dx, dy], i) => (
                    <g key={i}>
                      <path d={`M${cx} 185l${dx} ${dy}`} className="fw-wire" />
                      <Dot x={cx + dx} y={185 + dy} />
                    </g>
                  ))}
                  <Dot x={cx} y={185} active />
                </>
              ) : group === 1 ? (
                <>
                  {[-70, 0, 70].map((dx, i) => (
                    <g key={i}>
                      <Dot x={cx + dx} y={i === 1 ? 210 : 140} active />
                      <path
                        d={`M${cx + dx} ${i === 1 ? 210 : 140}v-45`}
                        className="fw-wire"
                      />
                      <Dot x={cx + dx} y={i === 1 ? 165 : 95} />
                    </g>
                  ))}
                  <path d={`M${cx - 70} 140l70 70 70-70`} className="fw-wire" />
                </>
              ) : (
                <>
                  {mesh.map(([dx, dy], i) => (
                    <g key={i}>
                      {mesh.slice(i + 1).map(([ex, ey], j) => (
                        <path
                          key={j}
                          d={`M${cx + dx} ${185 + dy}L${cx + ex} ${185 + ey}`}
                          className="fw-wire"
                        />
                      ))}
                      <Dot x={cx + dx} y={185 + dy} />
                    </g>
                  ))}
                </>
              )}
              <Text x={cx} y={320} center small>
                {
                  [
                    "One control point",
                    "Several control points",
                    "Several locations",
                  ][group]
                }
              </Text>
            </g>
          ))}
          <path d="M320 55v255m320-255v255" className="foundation-divider" />
        </>
      );
      break;
    }
    case "block-fields":
      art = (
        <>
          <rect
            x="80"
            y="35"
            width="455"
            height="300"
            rx="16"
            className="fw-card"
          />
          <Text x={105} y={75}>
            A proof-of-work teaching block
          </Text>
          {[
            "Transaction data / commitment",
            "Timestamp",
            "Previous block hash",
            "Nonce · search value",
          ].map((s, i) => (
            <g key={s}>
              <path
                d={`M105 ${95 + i * 55}h405`}
                className="foundation-divider"
              />
              <Text x={105} y={130 + i * 55} small>
                {s}
              </Text>
            </g>
          ))}
          {arrow("M555 185h90")}
          <Box
            x={665}
            y={130}
            w={245}
            title="Block fingerprint"
            sub="Calculated from the header"
            accent
          />
          <Text x={665} y={280} small>
            Fabric uses a different format.
          </Text>
          <Text x={665} y={305} small>
            No mining nonce in our project.
          </Text>
        </>
      );
      break;
    case "ledger-replicas":
      art = (
        <>
          <Ledger x={80} y={95} label="Participant A" />
          <Ledger x={395} y={95} label="Participant B" />
          <Ledger x={710} y={95} label="Participant C" />
          <path d="M270 168h105m205 0h110" className="fw-wire" />
          <Text x={480} y={55} center>
            Distributed ledger technology / DLT
          </Text>
          <Text x={480} y={350} small center>
            Replication needs an agreement protocol.
          </Text>
        </>
      );
      break;
    case "features":
      art = (
        <>
          <circle cx="480" cy="185" r="78" className="fw-fill" />
          <Text x={480} y={180} center white>
            Shared
          </Text>
          <Text x={480} y={208} center white>
            record
          </Text>
          {[
            [120, 68, "Visibility", "For authorized readers"],
            [625, 68, "Tamper resistance", "Under protocol assumptions"],
            [120, 245, "Security", "Keys + checks + operations"],
            [625, 245, "Decentralization", "Depends on governance"],
          ].map(([x, y, a, b]) => (
            <g key={a}>
              <Box
                x={Number(x)}
                y={Number(y)}
                w={230}
                title={String(a)}
                sub={String(b)}
              />
              <path
                d={`M${Number(x) < 480 ? Number(x) + 230 : Number(x)} ${Number(y) + 50}L${Number(x) < 480 ? 405 : 555} 185`}
                className="fw-wire"
              />
            </g>
          ))}
        </>
      );
      break;
    case "p2p": {
      const nodes = [
        [130, 175],
        [345, 70],
        [345, 285],
        [615, 70],
        [615, 285],
        [830, 175],
      ];
      art = (
        <>
          {[
            [0, 1],
            [0, 2],
            [1, 2],
            [1, 3],
            [2, 4],
            [3, 4],
            [3, 5],
            [4, 5],
          ].map(([a, b]) => (
            <path
              key={`${a}-${b}`}
              d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`}
              className="fw-wire"
            />
          ))}
          {nodes.map(([x, y], i) => (
            <Dot
              key={i}
              x={x}
              y={y}
              label={String.fromCharCode(65 + i)}
              active={i === 0}
            />
          ))}
          <Text x={480} y={365} small center>
            Connections carry messages, not block hash links.
          </Text>
        </>
      );
      break;
    }
    case "verification":
      art = (
        <>
          <Box
            x={45}
            y={110}
            w={230}
            h={140}
            title="Receive request"
            sub="No balance change yet"
          />
          {arrow("M295 180h55")}
          <Box
            x={370}
            y={110}
            w={230}
            h={140}
            title="Check the rules"
            sub="Signature · owner · funds"
            accent
          />
          {arrow("M620 180h55")}
          <Box
            x={695}
            y={110}
            w={225}
            h={140}
            title="Agree + record"
            sub="Protocol-specific process"
          />
          <Text x={480} y={330} center>
            Local acceptance is not final confirmation.
          </Text>
        </>
      );
      break;
    case "pow":
      art = (
        <>
          <Box
            x={40}
            y={110}
            w={220}
            title="Candidate header"
            sub="Data commitment + nonce"
          />
          {arrow("M280 160h70")}
          <Box
            x={370}
            y={110}
            w={220}
            title="Hash + compare"
            sub="Does it meet the target?"
            accent
          />
          {arrow("M610 160h70")}
          <Box
            x={700}
            y={110}
            w={220}
            title="Verify the proof"
            sub="Also check every rule"
          />
          <path d="M480 230v70H150v-70" className="fw-wire" />
          <Text x={315} y={330} small center>
            Try another nonce if the target is missed.
          </Text>
        </>
      );
      break;
    case "pos":
      art = (
        <>
          <circle cx="170" cy="175" r="82" className="fw-coin" />
          <Text x={170} y={170} center>
            Stake
          </Text>
          <Text x={170} y={200} small center>
            Economic commitment
          </Text>
          {arrow("M275 175h95")}
          <Box
            x={390}
            y={100}
            w={230}
            h={150}
            title="Propose / attest"
            sub="Validator protocol rules"
            accent
          />
          {arrow("M640 175h60")}
          <ShieldCheck
            x={760}
            y={112}
            width={95}
            height={95}
            className="foundation-icon"
          />
          <Text x={805} y={265} center>
            Verify + apply rules
          </Text>
          <Text x={480} y={345} small center>
            Ethereum example · no staking or funds needed today
          </Text>
        </>
      );
      break;
    case "network-types":
      art = (
        <>
          {[
            [55, "Public", "Open participation", "Bitcoin / Ethereum"],
            [
              365,
              "Private",
              "One organization governs",
              "Restricted membership",
            ],
            [
              675,
              "Consortium",
              "Organizations govern jointly",
              "Agreed membership",
            ],
          ].map(([x, a, b, c], i) => (
            <g key={a}>
              <rect
                x={Number(x)}
                y="55"
                width="230"
                height="255"
                rx={i === 0 ? 70 : 14}
                className={i === 2 ? "fw-coin" : "fw-card"}
              />
              <Text x={Number(x) + 115} y={95} center>
                {a}
              </Text>
              {[0, 1, 2].map((j) => (
                <Dot
                  key={j}
                  x={Number(x) + 55 + j * 60}
                  y={162 + (j % 2) * 45}
                  active={i > 0 && j === 1}
                />
              ))}
              <Text x={Number(x) + 115} y={260} small center>
                {b}
              </Text>
              <Text x={Number(x) + 115} y={285} small center>
                {c}
              </Text>
            </g>
          ))}
        </>
      );
      break;
    case "wallet-address":
      art = (
        <>
          <Wallet
            x={115}
            y={110}
            width={105}
            height={105}
            className="foundation-icon"
          />
          <Text x={165} y={270} center>
            Wallet software
          </Text>
          {arrow("M250 165h80")}
          <KeyRound
            x={380}
            y={55}
            width={65}
            height={65}
            className="foundation-icon"
          />
          <Text x={485} y={88}>
            Private key → authorize
          </Text>
          <FileKey2
            x={380}
            y={220}
            width={65}
            height={65}
            className="foundation-icon"
          />
          <Text x={485} y={250}>
            Public address → identify
          </Text>
          <path d="M350 165v-78m0 78v87" className="fw-wire" />
          <Text x={485} y={310} small>
            Balances live in network state.
          </Text>
        </>
      );
      break;
    case "ethereum":
      art = (
        <>
          <Box
            x={40}
            y={130}
            w={220}
            title="User request"
            sub="Signed by an account"
          />
          {arrow("M280 180h65")}
          <path d="m480 65 80 115-80 115-80-115Z" className="fw-fill" />
          <Text x={480} y={175} center white>
            EVM
          </Text>
          <Text x={480} y={200} small center white>
            Contract execution
          </Text>
          {arrow("M580 180h90")}
          <Box
            x={690}
            y={130}
            w={230}
            title="Shared state"
            sub="Updated under chain rules"
          />
          <Text x={480} y={345} small center>
            Ethereum: PoS + ETH gas · separate from our Fabric project
          </Text>
        </>
      );
      break;
    case "dapp":
      art = (
        <>
          <Laptop
            x={110}
            y={110}
            width={110}
            height={110}
            className="foundation-icon"
          />
          <Text x={165} y={275} center>
            Interface
          </Text>
          {arrow("M260 165h90")}
          <Box
            x={370}
            y={110}
            w={240}
            title="Contract rules"
            sub="Validate the requested change"
            accent
          />
          {arrow("M630 165h75")}
          <Ledger x={740} y={80} label="Shared state" />
          <Text x={480} y={345} small center>
            Frontend hosting and backend decentralization are separate choices.
          </Text>
        </>
      );
      break;
    case "supply-chain":
      art = (
        <>
          <Text x={480} y={45} center>
            Walmart / leafy-greens traceability initiative / 2018 case
          </Text>
          {[
            [145, "Farm", "Lot + harvest"],
            [480, "Packer", "Processing checkpoint"],
            [815, "Store", "Trace a recalled lot"],
          ].map(([x, a, b], i) => (
            <g key={a}>
              <Package
                x={Number(x) - 33}
                y={110}
                width={66}
                height={66}
                className="foundation-icon"
              />
              <Text x={Number(x)} y={225} center>
                {a}
              </Text>
              <Text x={Number(x)} y={260} small center>
                {b}
              </Text>
              {i < 2 && arrow(`M${Number(x) + 70} 145h195`)}
            </g>
          ))}
          <Text x={480} y={345} center>
            The record still depends on truthful data capture.
          </Text>
        </>
      );
      break;
    case "finance":
      art = (
        <>
          <Box x={60} y={65} w={240} title="Buyer" sub="Invoice received" />
          <Box x={660} y={65} w={240} title="Seller" sub="Payment requested" />
          <Box
            x={360}
            y={245}
            w={240}
            title="Bank / settlement"
            sub="Actual payment arrangements"
          />
          <path
            d="M300 115h360M180 165l180 125m420-125L600 290"
            className="fw-wire"
          />
          <circle cx="480" cy="120" r="65" className="fw-fill" />
          <Text x={480} y={115} center white>
            Shared
          </Text>
          <Text x={480} y={143} center white>
            status
          </Text>
        </>
      );
      break;
    case "records":
      art = (
        <>
          {[
            [160, HeartPulse, "Healthcare", "Protect patient records"],
            [480, ShieldCheck, "Insurance", "Track claim status"],
            [800, KeyRound, "Access control", "Share only what is needed"],
          ].map(([x, Icon, a, b]) => {
            const Symbol = Icon as typeof GraduationCap;
            return (
              <g key={String(a)}>
                <Symbol
                  x={Number(x) - 40}
                  y={100}
                  width={80}
                  height={80}
                  className="foundation-icon"
                />
                <Text x={Number(x)} y={235} center>
                  {a as string}
                </Text>
                <Text x={Number(x)} y={275} small center>
                  {b as string}
                </Text>
              </g>
            );
          })}
          <Text x={480} y={350} small center>
            Share only what is needed. Sensitive documents need separate
            protection.
          </Text>
        </>
      );
      break;
    case "voting":
      art = (
        <>
          <Vote
            x={430}
            y={130}
            width={100}
            height={100}
            className="foundation-icon"
          />
          {[
            [120, 80, "Eligibility", "Who may vote?"],
            [620, 80, "Ballot secrecy", "Who can learn the choice?"],
            [120, 255, "Device security", "Was the intent captured?"],
            [620, 255, "Coercion resistance", "Was the choice free?"],
          ].map(([x, y, a, b]) => (
            <Box
              key={a}
              x={Number(x)}
              y={Number(y)}
              w={230}
              title={String(a)}
              sub={String(b)}
            />
          ))}
        </>
      );
      break;
    case "tradelens":
      art = (
        <>
          <path d="M140 175h680" className="fw-wire" />
          {[
            [150, "TradeLens", "Shared logistics records"],
            [480, "November 2022", "Discontinuation announced"],
            [810, "Q1 2023", "Announced shutdown target"],
          ].map(([x, a, b]) => (
            <g key={a}>
              <Dot x={Number(x)} y={175} active={a === "November 2022"} />
              <Text x={Number(x)} y={110} center>
                {a}
              </Text>
              <Text x={Number(x)} y={245} small center>
                {b}
              </Text>
            </g>
          ))}
          <Text x={480} y={335} center>
            Working code also needs participation and viable governance.
          </Text>
        </>
      );
      break;
    case "tradeoffs":
      art = (
        <>
          <path d="M480 80v90m0 0-230 75m230-75 230 75" className="fw-wire" />
          <Text x={480} y={60} center>
            Who needs to verify the record?
          </Text>
          <Box
            x={65}
            y={230}
            w={350}
            title="One trusted operator"
            sub="Start with a database"
          />
          <Box
            x={545}
            y={230}
            w={350}
            title="Independent organizations"
            sub="Consider shared verification"
            accent
          />
          <Text x={480} y={145} small center>
            Then weigh privacy, cost, governance and complexity.
          </Text>
        </>
      );
      break;
    case "environment":
      art = (
        <>
          <Laptop
            x={405}
            y={10}
            width={70}
            height={65}
            className="foundation-icon"
          />
          <Text x={495} y={48}>
            Windows browser
          </Text>
          <rect
            x="70"
            y="115"
            width="820"
            height="230"
            rx="18"
            className="fw-boundary"
          />
          <Text x={95} y={150}>
            Ubuntu / WSL 2
          </Text>
          <Box
            x={110}
            y={200}
            w={270}
            title="Node.js + Gateway"
            sub="Application + signing identities"
          />
          {arrow("M400 250h125")}
          <Container
            x={560}
            y={185}
            width={60}
            height={60}
            className="foundation-icon"
          />
          <Text x={650} y={218}>
            Docker services
          </Text>
          <Text x={560} y={280} small>
            Peers · orderer · certificate authorities
          </Text>
          {arrow("M440 75v30H245v80")}
        </>
      );
      break;
    case "live-demo":
      art = (
        <>
          <Box
            x={45}
            y={105}
            w={250}
            h={140}
            title="Initialize: 100 / 50"
            sub="Prepared real application"
          />
          {arrow("M315 175h40")}
          <Box
            x={375}
            y={105}
            w={250}
            h={140}
            title="Alice sends 20"
            sub="Wait for valid commit"
            accent
          />
          {arrow("M645 175h40")}
          <Box
            x={705}
            y={105}
            w={210}
            h={140}
            title="Read: 80 / 70"
            sub="Verify transaction ID"
          />
          <Text x={480} y={335} small center>
            Expected workflow · run the separate Fabric app for live evidence
          </Text>
        </>
      );
      break;
    case "security":
      art = (
        <>
          {[
            [130, KeyRound, "Protect keys"],
            [480, ShieldCheck, "Enforce permissions"],
            [830, FileKey2, "Check valid commit"],
          ].map(([x, Icon, title]) => {
            const Symbol = Icon as typeof KeyRound;
            return (
              <g key={String(title)}>
                <Symbol
                  x={Number(x) - 40}
                  y={100}
                  width={80}
                  height={80}
                  className="foundation-icon"
                />
                <Text x={Number(x)} y={255} center>
                  {title as string}
                </Text>
              </g>
            );
          })}
          <Text x={480} y={335} small center>
            Production also needs privacy, resilience, authentication and
            review.
          </Text>
        </>
      );
      break;
    case "next-steps":
      art = (
        <>
          <path d="M130 220h700" className="fw-wire" />
          {[
            [140, 200, "Foundations", "Networks + cryptography"],
            [470, 145, "Build again", "JavaScript + Fabric Gateway"],
            [800, 90, "Go deeper", "Identities + policies + operations"],
          ].map(([x, y, a, b]) => (
            <g key={a}>
              <path d={`M${x} 220V${y}`} className="fw-wire" />
              <Dot x={Number(x)} y={Number(y)} active />
              <Text x={Number(x)} y={Number(y) - 45} center>
                {a}
              </Text>
              <Text x={Number(x)} y={290} small center>
                {b}
              </Text>
            </g>
          ))}
        </>
      );
      break;
    default:
      throw new Error(`Missing foundation diagram: ${scene}`);
  }
  return (
    <figure
      className={`workshop-diagram fabric-diagram foundation-diagram foundation-${scene}`}
    >
      <svg
        viewBox="0 0 960 390"
        role="img"
        aria-label={`Visual explanation: ${scene.replaceAll("-", " ")}`}
      >
        <defs>
          <marker
            id={`foundation-${id}`}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0 8 4 0 8Z" fill="#087f83" />
          </marker>
        </defs>
        {art}
      </svg>
    </figure>
  );
}
