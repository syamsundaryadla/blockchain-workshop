import React, { useId, type ReactNode } from "react";
import {
  FileKey2,
  Fingerprint,
  GraduationCap,
  KeyRound,
  Landmark,
  LockKeyhole,
  Package,
  ShieldCheck,
} from "lucide-react";

const SCENES = [
  "case-examples",
  "block-batch",
  "cryptography-tools",
  "wallet-transactions",
  "identity-verification",
  "fabric-overview",
  "test-network",
  "project-setup",
  "fabric-wallet-ids",
  "fabric-block-storage",
  "fabric-block-hashes",
  "fabric-block-links",
  "fabric-integrity",
  "fabric-tampering",
  "transaction-receipt",
  "production-network",
];
export const isSyllabusScene = (scene: string) => SCENES.includes(scene);
function Label({
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
function Card({
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
      <Label x={x + 18} y={y + 37} white={accent}>
        {title}
      </Label>
      {sub && (
        <Label x={x + 18} y={y + 67} small white={accent}>
          {sub}
        </Label>
      )}
    </g>
  );
}
export function SyllabusDiagram({ scene }: { scene: string }) {
  const id = useId().replace(/:/g, "");
  const arrow = (d: string) => (
    <path d={d} className="fw-wire" markerEnd={`url(#syllabus-${id})`} />
  );
  let art: ReactNode;
  switch (scene) {
    case "case-examples":
      art = (
        <>
          {[
            [160, Package, "Walmart", "Food traceability", "2018 initiative"],
            [
              480,
              FileKey2,
              "Maersk / IBM",
              "TradeLens logistics",
              "Discontinued platform",
            ],
            [
              800,
              Landmark,
              "Financial records",
              "Shared reconciliation",
              "Illustrative use case",
            ],
          ].map(([x, Icon, title, a, b]) => {
            const Symbol = Icon as typeof Package;
            return (
              <g key={String(title)}>
                <Symbol
                  x={Number(x) - 35}
                  y={75}
                  width={70}
                  height={70}
                  className="foundation-icon"
                />
                <Label x={Number(x)} y={200} center>
                  {title as string}
                </Label>
                <Label x={Number(x)} y={245} small center>
                  {a as string}
                </Label>
                <Label x={Number(x)} y={275} small center>
                  {b as string}
                </Label>
              </g>
            );
          })}
          <Label x={480} y={350} center>
            Start with the shared-record problem, then judge the tradeoffs.
          </Label>
        </>
      );
      break;
    case "block-batch":
      art = (
        <>
          {[0, 1, 2].map((i) => (
            <Card
              key={i}
              x={65}
              y={35 + i * 105}
              w={230}
              h={80}
              title={`Transaction ${i + 1}`}
            />
          ))}
          {arrow("M315 180h130")}
          <rect
            x="475"
            y="55"
            width="385"
            height="270"
            rx="18"
            className="fw-card"
          />
          <rect
            x="475"
            y="55"
            width="385"
            height="58"
            rx="12"
            className="fw-fill"
          />
          <Label x={500} y={94} white>
            Block header
          </Label>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x="505"
                y={140 + i * 53}
                width="325"
                height="34"
                rx="4"
                className="fw-coin"
              />
              <Label
                x={520}
                y={162 + i * 53}
                small
              >{`Recorded transaction ${i + 1}`}</Label>
            </g>
          ))}
        </>
      );
      break;
    case "cryptography-tools":
      art = (
        <>
          {[
            [160, Fingerprint, "Hashing", "Check data integrity"],
            [
              480,
              KeyRound,
              "Digital signatures",
              "Check message + signing key",
            ],
            [800, LockKeyhole, "Encryption", "Protect confidentiality"],
          ].map(([x, Icon, a, b]) => {
            const Symbol = Icon as typeof KeyRound;
            return (
              <g key={String(a)}>
                <Symbol
                  x={Number(x) - 40}
                  y={95}
                  width={80}
                  height={80}
                  className="foundation-icon"
                />
                <Label x={Number(x)} y={240} center>
                  {a as string}
                </Label>
                <Label x={Number(x)} y={280} small center>
                  {b as string}
                </Label>
              </g>
            );
          })}
        </>
      );
      break;
    case "wallet-transactions":
      art = (
        <>
          <Card
            x={70}
            y={150}
            w={270}
            title="Address A"
            sub="Public sender identifier"
          />
          <Card
            x={620}
            y={150}
            w={270}
            title="Address B"
            sub="Public recipient identifier"
          />
          {arrow("M360 200h240")}
          <Label x={480} y={175} center>
            Transfer request
          </Label>
          <KeyRound
            x={110}
            y={40}
            width={55}
            height={55}
            className="foundation-icon"
          />
          <Label x={190} y={75}>
            Private key signs the request
          </Label>
          <path d="M137 105v30" className="fw-wire" />
          <Label x={480} y={335} small center>
            Public identifiers do not grant spending permission.
          </Label>
        </>
      );
      break;
    case "identity-verification":
      art = (
        <>
          <GraduationCap
            x={115}
            y={100}
            width={85}
            height={85}
            className="foundation-icon"
          />
          <Label x={155} y={245} center>
            Known issuer
          </Label>
          {arrow("M240 145h100")}
          <Card
            x={360}
            y={95}
            w={240}
            h={150}
            title="Signed record"
            sub="Content + issuer signature"
            accent
          />
          {arrow("M620 165h100")}
          <ShieldCheck
            x={760}
            y={110}
            width={85}
            height={85}
            className="foundation-icon"
          />
          <Label x={800} y={260} center>
            Verify issuer + integrity
          </Label>
          <Label x={480} y={340} small center>
            A matching hash alone does not prove that a claim is true.
          </Label>
        </>
      );
      break;
    case "fabric-overview":
      art = (
        <>
          <circle cx="160" cy="180" r="80" className="fw-coin" />
          <Label x={160} y={173} center>
            Known
          </Label>
          <Label x={160} y={203} center>
            identities
          </Label>
          {arrow("M265 180h95")}
          <Card
            x={380}
            y={105}
            w={230}
            h={150}
            title="Smart contracts"
            sub="Agreed business rules"
            accent
          />
          {arrow("M635 180h80")}
          <rect
            x="745"
            y="80"
            width="155"
            height="185"
            rx="10"
            className="fw-card"
          />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M770 ${115 + i * 35}h105`} className="fw-wire" />
          ))}
          <Label x={820} y={310} center>
            Shared ledger
          </Label>
        </>
      );
      break;
    case "test-network":
      art = (
        <>
          <rect
            x="45"
            y="40"
            width="870"
            height="300"
            rx="20"
            className="fw-boundary"
          />
          <Label x={75} y={80}>
            This laptop · Ubuntu / WSL 2 + Docker
          </Label>
          <Card
            x={95}
            y={130}
            w={240}
            title="Org1 peer"
            sub="Org1 test identities"
          />
          <Card
            x={625}
            y={130}
            w={240}
            title="Org2 peer"
            sub="Org2 test identities"
          />
          <Card
            x={370}
            y={245}
            w={220}
            h={75}
            title="Ordering service"
            accent
          />
          <path
            d="M335 180h290M215 230v50h155m375-50v50H590"
            className="fw-wire"
          />
          <Label x={480} y={380} small center>
            Separate logical organizations; one disposable development
            environment.
          </Label>
        </>
      );
      break;
    case "project-setup":
      art = (
        <>
          <Card
            x={45}
            y={95}
            w={250}
            h={170}
            title="Prepare before the day"
            sub="npm ci + prepare:kit"
          />
          {arrow("M315 180h40")}
          <Card
            x={375}
            y={95}
            w={250}
            h={170}
            title="Check + start network"
            sub="npm run check / network"
            accent
          />
          {arrow("M645 180h40")}
          <Card
            x={705}
            y={95}
            w={210}
            h={170}
            title="Deploy + open app"
            sub="npm run deploy / start"
          />
          <Label x={480} y={340} small center>
            Use the numbered handout for the exact command sequence.
          </Label>
        </>
      );
      break;
    case "fabric-wallet-ids":
      art = (
        <>
          <Card
            x={75}
            y={65}
            w={260}
            title="Wallet ID: alice"
            sub="Application label"
          />
          <Card
            x={75}
            y={235}
            w={260}
            title="Wallet ID: bob"
            sub="Application label"
          />
          {arrow("M355 115h160")}
          {arrow("M355 285h160")}
          <Card
            x={535}
            y={65}
            w={350}
            title="Org1 client certificate"
            sub="Actual identity owns Alice’s wallet"
            accent
          />
          <Card
            x={535}
            y={235}
            w={350}
            title="Org2 client certificate"
            sub="Actual identity owns Bob’s wallet"
            accent
          />
        </>
      );
      break;
    case "fabric-block-storage":
      art = (
        <>
          <Card x={40} y={65} w={215} h={90} title="Transaction A" />
          <Card x={40} y={225} w={215} h={90} title="Transaction B" />
          <path d="M270 110h55v165h-55" className="fw-wire" />
          {arrow("M325 190h80")}
          <rect
            x="425"
            y="65"
            width="245"
            height="250"
            rx="15"
            className="fw-card"
          />
          <Label x={450} y={105}>
            Ordered block
          </Label>
          <path d="M450 125h195" className="fw-wire" />
          <Label x={450} y={170} small>
            Header
          </Label>
          <Label x={450} y={210} small>
            Transaction records
          </Label>
          <Label x={450} y={250} small>
            Metadata
          </Label>
          {arrow("M690 190h65")}
          <ShieldCheck
            x={790}
            y={125}
            width={80}
            height={80}
            className="foundation-icon"
          />
          <Label x={830} y={280} center>
            Validate + append
          </Label>
        </>
      );
      break;
    case "fabric-block-hashes":
      art = (
        <>
          {[
            [70, "Encoded transaction data", "data_hash"],
            [235, "Encoded header fields", "Header hash"],
          ].map(([y, a, b]) => (
            <g key={String(a)}>
              <Card x={50} y={Number(y)} w={280} title={String(a)} />
              {arrow(`M350 ${Number(y) + 50}h65`)}
              <Card x={435} y={Number(y)} w={145} title="SHA-256" accent />
              {arrow(`M600 ${Number(y) + 50}h65`)}
              <Card x={685} y={Number(y)} w={225} title={String(b)} />
            </g>
          ))}
        </>
      );
      break;
    case "fabric-block-links":
      art = (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={40 + i * 315}
                y="70"
                width="250"
                height="220"
                rx="12"
                className="fw-card"
              />
              <Label x={60 + i * 315} y={110}>{`Block ${i + 1} header`}</Label>
              <path d={`M${60 + i * 315} 130h210`} className="fw-wire" />
              <Label x={60 + i * 315} y={175} small>
                number
              </Label>
              <Label x={60 + i * 315} y={215} small>
                previous_hash
              </Label>
              <Label x={60 + i * 315} y={255} small>
                data_hash
              </Label>
              {i < 2 && arrow(`M${300 + i * 315} 210h40`)}
            </g>
          ))}
          <Label x={480} y={355} small center>
            previous_hash refers to the previous block header’s hash.
          </Label>
        </>
      );
      break;
    case "fabric-integrity":
      art = (
        <>
          <Card
            x={75}
            y={55}
            w={350}
            h={125}
            title="Block integrity"
            sub="Data hashes + signatures"
          />
          <Card
            x={75}
            y={230}
            w={350}
            h={125}
            title="Transaction validity"
            sub="Endorsements + read versions"
          />
          <path d="M445 115h70v180h-70" className="fw-wire" />
          {arrow("M515 205h100")}
          <Card
            x={635}
            y={135}
            w={270}
            h={140}
            title="Apply valid writes"
            sub="Invalid → state unchanged"
            accent
          />
        </>
      );
      break;
    case "fabric-tampering":
      art = (
        <>
          <Card
            x={40}
            y={105}
            w={250}
            h={140}
            title="Original signed bytes"
            sub="Exact content is signed"
          />
          {arrow("M310 175h60")}
          <Card
            x={390}
            y={105}
            w={225}
            h={140}
            title="Changed payload"
            sub="Signed content changed"
          />
          <path d="m480 270 35 35m0-35-35 35" className="wg-error-line" />
          {arrow("M635 175h50")}
          <Card
            x={705}
            y={105}
            w={215}
            h={140}
            title="Check fails"
            sub="Reject altered request"
          />
          <Label x={480} y={365} small center>
            Conceptual integrity example · not a modified live Fabric ledger
          </Label>
        </>
      );
      break;
    case "transaction-receipt":
      art = (
        <>
          <rect
            x="85"
            y="40"
            width="435"
            height="300"
            rx="14"
            className="fw-card"
          />
          <Label x={110} y={85}>
            Real application result
          </Label>
          <path d="M110 110h385" className="fw-wire" />
          <Label x={110} y={155} small>
            Transaction ID: from the running app
          </Label>
          <Label x={110} y={205}>
            Commit status: valid
          </Label>
          <Label x={110} y={255}>
            Read ledger balances again
          </Label>
          {arrow("M540 190h100")}
          <Card
            x={660}
            y={120}
            w={235}
            h={150}
            title="Compare the result"
            sub="Expected: 80 / 70"
            accent
          />
          <Label x={480} y={380} small center>
            Illustration only. Use the real transaction ID and queried balances.
          </Label>
        </>
      );
      break;
    case "production-network":
      art = (
        <>
          <rect
            x="60"
            y="55"
            width="335"
            height="275"
            rx="16"
            className="fw-boundary"
          />
          <Label x={85} y={100}>
            Workshop environment
          </Label>
          <Card
            x={95}
            y={140}
            w={265}
            title="One prepared laptop"
            sub="Test IDs + local services"
          />
          <Label x={85} y={290} small>
            Learning and development
          </Label>
          <path d="M465 55v275" className="foundation-divider" />
          {[
            [605, 105, "Organization A"],
            [805, 245, "Organization B"],
          ].map(([x, y, a]) => (
            <g key={String(a)}>
              <circle
                cx={Number(x)}
                cy={Number(y)}
                r="54"
                className="fw-coin"
              />
              <Label x={Number(x)} y={Number(y) + 5} small center>
                {a}
              </Label>
            </g>
          ))}
          <path d="M645 145l120 65" className="fw-wire" />
          <Label x={690} y={345} center>
            Independent operations + governance
          </Label>
        </>
      );
      break;
    default:
      throw new Error(`Missing syllabus diagram: ${scene}`);
  }
  return (
    <figure className="workshop-diagram fabric-diagram syllabus-diagram">
      <svg
        viewBox="0 0 960 400"
        role="img"
        aria-label={`Diagram: ${scene.replaceAll("-", " ")}`}
      >
        <defs>
          <marker
            id={`syllabus-${id}`}
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
