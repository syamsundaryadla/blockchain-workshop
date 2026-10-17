import React, { type ReactNode, useId } from "react";

function Label({
  x,
  y,
  children,
  small = false,
  anchor = "start",
  tone = "",
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  anchor?: "start" | "middle" | "end";
  tone?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`${small ? "fw-small" : "fw-label"} ${tone}`}
    >
      {children}
    </text>
  );
}
function Card({
  x,
  y,
  w = 230,
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
      <Label x={x + 22} y={y + 39} tone={accent ? "fw-white" : ""}>
        {title}
      </Label>
      {sub && (
        <Label x={x + 22} y={y + 70} small tone={accent ? "fw-white" : ""}>
          {sub}
        </Label>
      )}
    </g>
  );
}
export function FabricWorkshopDiagram({ scene }: { scene: string }) {
  const id = useId().replace(/:/g, "");
  const arrow = (d: string) => (
    <path d={d} className="fw-wire" markerEnd={`url(#${id})`} />
  );
  const coin = (x: number, y: number, name: string, balance: string) => (
    <g>
      <circle cx={x} cy={y} r="90" className="fw-coin" />
      <Label x={x} y={y - 25} anchor="middle">
        {name}
      </Label>
      <text x={x} y={y + 35} textAnchor="middle" className="fw-balance">
        {balance}
      </text>
      <Label x={x} y={y + 62} anchor="middle" small>
        DEMO CREDITS
      </Label>
    </g>
  );
  const network = (
    <g>
      <rect
        x="65"
        y="70"
        width="340"
        height="220"
        rx="25"
        className="fw-boundary"
      />
      <rect
        x="555"
        y="70"
        width="340"
        height="220"
        rx="25"
        className="fw-boundary"
      />
      <Label x={95} y={108}>
        Organization 1
      </Label>
      <Label x={585} y={108}>
        Organization 2
      </Label>
      <Card
        x={105}
        y={140}
        w={260}
        title="Peer + ledger"
        sub="Execute · validate · commit"
      />
      <Card
        x={595}
        y={140}
        w={260}
        title="Peer + ledger"
        sub="Execute · validate · commit"
      />
      {arrow("M365 190h230")}
      <Card x={365} y={280} w={230} h={75} title="Ordering service" />
      <path d="M235 240v78h130m360-78v78H595" className="fw-wire" />
      <Label x={480} y={42} anchor="middle" small>
        mychannel / shared ledger rules
      </Label>
    </g>
  );
  let art: ReactNode;
  switch (scene) {
    case "cover":
    case "project":
      art = (
        <>
          {coin(240, 175, "Alice", "100")}
          {coin(720, 175, "Bob", "50")}
          {arrow("M345 175h270")}
          <Label x={480} y={148} anchor="middle">
            Transfer 20
          </Label>
          <Label x={480} y={310} anchor="middle" small>
            Who may request this change?
          </Label>
        </>
      );
      break;
    case "schedule":
    case "practical":
      art = (
        <>
          <path d="M100 180H855" className="fw-wire" />
          {(scene === "schedule"
            ? [
                [130, "10:00", "Understand"],
                [480, "13:15", "Connect"],
                [830, "15:00", "Build"],
              ]
            : [
                [100, "10 min", "Predict"],
                [290, "15 min", "Complete"],
                [480, "10 min", "Deploy"],
                [670, "15 min", "Test"],
                [860, "10 min", "Explain"],
              ]
          ).map(([x, time, label]) => (
            <g key={label}>
              <circle cx={Number(x)} cy="180" r="13" className="fw-fill" />
              <Label x={Number(x)} y={130} anchor="middle">
                {time}
              </Label>
              <Label x={Number(x)} y={230} anchor="middle">
                {label}
              </Label>
            </g>
          ))}
          <Label x={480} y={310} anchor="middle" small>
            {scene === "schedule"
              ? "Lunch 12:35–13:15 · two short breaks"
              : "15:00–16:00 / your hands on the keyboard"}
          </Label>
        </>
      );
      break;
    case "conflict":
      art = (
        <>
          <Card
            x={70}
            y={95}
            w={330}
            h={150}
            title="Club record: ₹500"
            sub="Copy held by the treasurer"
          />
          <Card
            x={560}
            y={95}
            w={330}
            h={150}
            title="Club record: ₹800"
            sub="Copy held by the secretary"
          />
          <text
            x="480"
            y="195"
            textAnchor="middle"
            className="fw-balance fw-coral"
          >
            ≠
          </text>
          <Label x={480} y={305} anchor="middle">
            Which update should everyone accept?
          </Label>
        </>
      );
      break;
    case "database":
      art = (
        <>
          <ellipse cx="480" cy="130" rx="145" ry="45" className="fw-coin" />
          <path d="M335 130v130c0 60 290 60 290 0V130" className="fw-wire" />
          <Label x={480} y={230} anchor="middle">
            Trusted operator
          </Label>
          {[
            [130, 90, "Permissions"],
            [760, 90, "Audit log"],
            [90, 290, "Simple queries"],
            [750, 290, "Clear responsibility"],
          ].map(([x, y, t]) => (
            <Label key={t} x={Number(x)} y={Number(y)}>
              {t}
            </Label>
          ))}
        </>
      );
      break;
    case "shared":
    case "agreement":
      art = (
        <>
          {[
            [180, 100, "College"],
            [780, 100, "Partner"],
            [480, 280, "Auditor"],
          ].map(([x, y, t]) => (
            <g key={t}>
              <circle
                cx={Number(x)}
                cy={Number(y)}
                r="67"
                className="fw-coin"
              />
              <Label x={Number(x)} y={Number(y) + 6} anchor="middle">
                {t}
              </Label>
            </g>
          ))}
          <path
            d="M250 100h460M230 155l190 90m120 0 190-90"
            className="fw-wire"
          />
          <Label x={480} y={155} anchor="middle">
            Agreed rules
          </Label>
          <Label x={480} y={190} anchor="middle" small>
            Copies + validation + a protocol
          </Label>
        </>
      );
      break;
    case "hash-vs-encryption":
      art = (
        <>
          <Card
            x={70}
            y={95}
            w={350}
            h={150}
            title="Hash"
            sub="Compare a fingerprint"
          />
          <Card
            x={540}
            y={95}
            w={350}
            h={150}
            title="Encryption"
            sub="Read content with the right key"
          />
          <Label x={245} y={295} anchor="middle">
            Was it changed?
          </Label>
          <Label x={715} y={295} anchor="middle">
            Who may read it?
          </Label>
        </>
      );
      break;
    case "truth":
      art = (
        <>
          <Card
            x={60}
            y={110}
            w={250}
            title="A false claim"
            sub="Entered at the source"
          />
          {arrow("M320 160h140")}
          <Card
            x={470}
            y={110}
            w={200}
            title="Hash matches"
            sub="Integrity check"
          />
          <Label x={820} y={165} anchor="middle">
            Still false.
          </Label>
          <path d="M735 220l25 25 60-65" className="fw-wire" />
          <Label x={480} y={300} anchor="middle" small>
            Evidence of change ≠ evidence of truth
          </Label>
        </>
      );
      break;
    case "identity":
    case "certificate":
      art = (
        <>
          <rect
            x="65"
            y="65"
            width="310"
            height="245"
            rx="18"
            className="fw-card"
          />
          <circle cx="125" cy="135" r="30" className="fw-coin" />
          <Label x={180} y={130}>
            Alice
          </Label>
          <Label x={180} y={160} small>
            {scene === "certificate" ? "Org1 certificate" : "Public identity"}
          </Label>
          <path d="M100 220h230m-230 25h150" className="fw-wire" />
          {arrow("M400 180h150")}
          <Card
            x={585}
            y={80}
            w={310}
            title={
              scene === "certificate"
                ? "CA issues identity"
                : "Private signing key"
            }
            sub={
              scene === "certificate"
                ? "MSP defines trusted membership"
                : "Keep it secret"
            }
            accent
          />
          <Card
            x={585}
            y={215}
            w={310}
            title="Business permission"
            sub="Still checked by the contract"
          />
        </>
      );
      break;
    case "transaction":
      art = (
        <>
          <rect
            x="180"
            y="45"
            width="600"
            height="265"
            rx="18"
            className="fw-card"
          />
          <Label x={215} y={93}>
            Transfer request
          </Label>
          {[
            "Signed by: Alice's test identity",
            "Action: TransferCredits",
            "Input: Alice → Bob / 20 credits",
          ].map((t, i) => (
            <g key={t}>
              <path d={`M215 ${125 + i * 60}h530`} className="fw-wire" />
              <Label x={215} y={155 + i * 60} small>
                {t}
              </Label>
            </g>
          ))}
          <Label x={480} y={345} anchor="middle" small>
            Requested is not the same as committed
          </Label>
        </>
      );
      break;
    case "query":
      art = (
        <>
          <Card
            x={65}
            y={50}
            w={300}
            title="Read balance"
            sub="Query / evaluate"
          />
          <Card
            x={65}
            y={220}
            w={300}
            title="Transfer credits"
            sub="Submit transaction"
            accent
          />
          {arrow("M375 100h220")}
          {arrow("M375 270h220")}
          <Label x={640} y={106}>
            Current state returned
          </Label>
          <Label x={640} y={260}>
            Rules → order → validate
          </Label>
          <Label x={640} y={291} small>
            Confirm only after valid commit
          </Label>
        </>
      );
      break;
    case "rules":
    case "permissions":
      art = (
        <>
          {[
            scene === "rules"
              ? ["Owner?", "Does the signer own it?"]
              : ["Membership", "Is this identity trusted?"],
            scene === "rules"
              ? ["Amount?", "Positive whole number?"]
              : ["Permission", "May it debit this wallet?"],
            scene === "rules"
              ? ["Funds?", "Enough to send?"]
              : ["Validation", "Endorsements + read versions?"],
          ].map(([t, s], i) => (
            <g key={t}>
              <circle cx={160 + i * 320} cy="100" r="30" className="fw-coin" />
              <Label x={160 + i * 320} y={107} anchor="middle">
                {i + 1}
              </Label>
              <Label x={160 + i * 320} y={185} anchor="middle">
                {t}
              </Label>
              <Label x={160 + i * 320} y={225} anchor="middle" small>
                {s}
              </Label>
            </g>
          ))}
        </>
      );
      break;
    case "permissioned":
      art = (
        <>
          <circle cx="480" cy="185" r="120" className="fw-boundary" />
          <Label x={480} y={177} anchor="middle">
            Fabric network
          </Label>
          <Label x={480} y={210} anchor="middle" small>
            Organizational identities + policies
          </Label>
          <Card
            x={40}
            y={115}
            w={240}
            title="Certified participant"
            sub="Membership checked"
          />
          {arrow("M290 165h70")}
          <Label x={800} y={175} anchor="middle">
            No mining race
          </Label>
          <Label x={800} y={210} anchor="middle" small>
            No built-in currency required
          </Label>
        </>
      );
      break;
    case "fabric-network":
    case "channel":
      art = network;
      break;
    case "roleplay":
      art = (
        <>
          {[
            ["Client", "Request a change"],
            ["Two peers", "Execute + endorse"],
            ["Orderer", "Agree the sequence"],
            ["Peers again", "Validate + commit"],
          ].map(([t, s], i) => (
            <g key={t}>
              <rect
                x={30 + i * 235}
                y={95}
                width="205"
                height="155"
                rx={i === 0 ? 35 : 8}
                className={i === 3 ? "fw-fill" : "fw-card"}
              />
              <Label
                x={132 + i * 235}
                y={150}
                anchor="middle"
                tone={i === 3 ? "fw-white" : ""}
              >
                {t}
              </Label>
              <Label
                x={132 + i * 235}
                y={190}
                anchor="middle"
                small
                tone={i === 3 ? "fw-white" : ""}
              >
                {s}
              </Label>
            </g>
          ))}
          <Label x={480} y={320} anchor="middle">
            Audience: stop any balance change that happens too early.
          </Label>
        </>
      );
      break;
    case "state-history":
      art = (
        <>
          <Card
            x={55}
            y={80}
            w={330}
            h={200}
            title="Current state"
            sub="Alice: 80 / Bob: 70"
            accent
          />
          <Label x={535} y={80}>
            Block history
          </Label>
          {["Initialize: 100 / 50", "Alice → Bob: 20", "Next transaction…"].map(
            (t, i) => (
              <g key={t}>
                <circle cx="545" cy={125 + i * 65} r="8" className="fw-fill" />
                <Label x={575} y={130 + i * 65} small>
                  {t}
                </Label>
              </g>
            ),
          )}
          <path d="M545 133v115" className="fw-wire" />
        </>
      );
      break;
    case "endorsement":
      art = (
        <>
          <Card
            x={55}
            y={80}
            w={355}
            h={180}
            title="Proposed: 80 / 70"
            sub="Endorsed simulation result"
          />
          <Card
            x={550}
            y={80}
            w={355}
            h={180}
            title="Current: 100 / 50"
            sub="Still unchanged before commit"
            accent
          />
          <Label x={480} y={320} anchor="middle">
            Prepared writes are not yet applied.
          </Label>
        </>
      );
      break;
    case "balances":
      art = (
        <>
          {coin(240, 175, "Alice", "80")}
          {coin(720, 175, "Bob", "70")}
          <text x="480" y="195" textAnchor="middle" className="fw-balance">
            +
          </text>
          <Label x={480} y={320} anchor="middle">
            150 credits before. 150 credits after.
          </Label>
        </>
      );
      break;
    case "architecture":
      art = (
        <>
          {[
            ["Browser", "HTML · CSS · JavaScript"],
            ["Local backend", "Node.js + Fabric Gateway"],
            ["Fabric peers", "JavaScript chaincode"],
          ].map(([t, s], i) => (
            <g key={t}>
              <Card
                x={30 + i * 325}
                y={105}
                w={265}
                h={135}
                title={t}
                sub={s}
                accent={i === 2}
              />
              {i < 2 && arrow(`M${300 + i * 325} 172h45`)}
            </g>
          ))}
          <Label x={480} y={310} anchor="middle" small>
            Private signing keys stay in the backend.
          </Label>
        </>
      );
      break;
    case "wallet":
      art = (
        <>
          <rect
            x="160"
            y="45"
            width="640"
            height="270"
            rx="16"
            className="fw-card"
          />
          <Label x={200} y={92}>
            Wallet / Alice
          </Label>
          {[
            "id          alice",
            "owner       certificate fingerprint",
            "organization Org1MSP",
            "balance     100",
          ].map((t, i) => (
            <Label key={t} x={200} y={140 + i * 43} small>
              {t}
            </Label>
          ))}
        </>
      );
      break;
    case "tests":
      art = (
        <>
          {[
            ["Send 20", "Valid commit", "80 / 70"],
            ["Send 1,000", "Insufficient credits", "Unchanged"],
            ["Wrong signer", "Permission denied", "Unchanged"],
          ].map(([a, b, c], i) => (
            <g key={a}>
              <Label x={70} y={90 + i * 100}>
                {a}
              </Label>
              <path d={`M280 ${85 + i * 100}h100`} className="fw-wire" />
              <Label x={425} y={90 + i * 100}>
                {b}
              </Label>
              <Label x={825} y={90 + i * 100} anchor="middle" small>
                {c}
              </Label>
            </g>
          ))}
        </>
      );
      break;
    case "showcase":
      art = (
        <>
          <text x="100" y="210" className="fw-balance">
            150
          </text>
          <Label x={105} y={255} small>
            TOTAL CREDITS
          </Label>
          <path d="M365 60v250" className="fw-wire" />
          {[
            "Show one valid commit.",
            "Show one rejected request.",
            "Explain who may spend.",
          ].map((s, i) => (
            <Label key={s} x={425} y={110 + i * 85}>
              {s}
            </Label>
          ))}
        </>
      );
      break;
    default:
      art = (
        <>
          <Label x={480} y={150} anchor="middle">
            Understand the rule.
          </Label>
          <Label x={480} y={225} anchor="middle">
            Predict the result.
          </Label>
        </>
      );
  }
  return (
    <figure className={`workshop-diagram fabric-diagram fabric-scene-${scene}`}>
      <svg
        viewBox="0 0 960 370"
        role="img"
        aria-label={`Workshop infographic: ${scene.replaceAll("-", " ")}`}
      >
        <defs>
          <marker
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 10 5 0 10" fill="#087f83" />
          </marker>
        </defs>
        {art}
      </svg>
    </figure>
  );
}
