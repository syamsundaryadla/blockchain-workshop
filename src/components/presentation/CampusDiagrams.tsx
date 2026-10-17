"use client";
import React, { type ReactNode } from "react";
function Text({
  x,
  y,
  children,
  small = false,
  accent = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      className={small ? "wg-small" : accent ? "wg-on-accent" : "wg-label"}
    >
      {children}
    </text>
  );
}
function Box({
  x,
  y,
  w = 230,
  h = 95,
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
      <Text x={x + 20} y={y + 36} accent={accent}>
        {title}
      </Text>
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
function Arrow({ d }: { d: string }) {
  return (
    <path d={d} className="wg-strong-line" markerEnd="url(#campus-arrow)" />
  );
}
function Laptop({ x = 350, y = 110 }: { x?: number; y?: number }) {
  return (
    <g>
      <rect x={x} y={y} width="210" height="140" rx="10" className="wg-card" />
      <rect
        x={x + 13}
        y={y + 13}
        width="184"
        height="108"
        rx="4"
        className="wg-panel"
      />
      <Text x={x + 36} y={y + 60} small>
        LAPTOP-001
      </Text>
      <Text x={x + 36} y={y + 90}>
        Lab Laptop
      </Text>
      <path
        d={`M${x - 25} ${y + 150}h260l-20 15H${x - 5}Z`}
        className="wg-card"
      />
    </g>
  );
}
export function CampusDiagram({
  scene,
  slide = 0,
  revealed,
}: {
  scene: string;
  slide?: number;
  revealed?: number;
}) {
  let drawing: ReactNode;
  switch (scene) {
    case "cover":
      drawing = (
        <>
          <rect
            x="100"
            y="30"
            width="700"
            height="380"
            rx="20"
            className="wg-panel"
          />
          <rect
            x="140"
            y="65"
            width="210"
            height="40"
            rx="4"
            className="wg-card-accent"
          />
          <Text x={160} y={92} accent>
            LAPTOP-001
          </Text>
          <Laptop x={340} y={130} />
          <Text x={145} y={180}>
            Lab Laptop
          </Text>
          <Text x={145} y={215} small>
            CAMPUS INVENTORY
          </Text>
          <Box x={140} y={305} w={190} h={75} title="Account A" />
          <Arrow d="M345 343h180" />
          <Box x={550} y={305} w={210} h={75} title="Account B" accent />
        </>
      );
      break;
    case "schedule":
      drawing = (
        <>
          {[
            [
              "MORNING",
              "Understand",
              "10:00–12:35",
              ["Trust & shared records", "Hashes, blocks, accounts"],
            ],
            [
              "AFTER LUNCH",
              "Build",
              "13:15–14:20",
              ["Open Remix", "Create + read an asset"],
            ],
            [
              "AFTERNOON",
              "Test & explain",
              "14:30–16:00",
              ["Transfer ownership", "Try failures + pair challenge"],
            ],
          ].map((c, i) => (
            <g key={i}>
              <Text x={35 + i * 295} y={95} small>
                {c[0] as string}
              </Text>
              <Text x={35 + i * 295} y={145}>
                {c[1] as string}
              </Text>
              <Text x={35 + i * 295} y={180} small>
                {c[2] as string}
              </Text>
              <path d={`M${35 + i * 295} 208h245`} className="wg-strong-line" />
              {(c[3] as string[]).map((s, j) => (
                <Text key={s} x={35 + i * 295} y={250 + j * 35}>
                  {s}
                </Text>
              ))}
            </g>
          ))}
        </>
      );
      break;
    case "problem":
      drawing = (
        <>
          <Laptop />
          <Box
            x={20}
            y={62}
            w={230}
            title="Department"
            sub="Maintains the register"
          />
          <Box
            x={645}
            y={62}
            w={230}
            title="Student A"
            sub="Claims the laptop"
          />
          <Box
            x={645}
            y={280}
            w={230}
            title="Student B"
            sub="Receives the laptop"
          />
          <Arrow d="M250 110h70" />
          <Arrow d="M645 110h-65" />
          <Arrow d="M645 320h-70" />
          <Text x={240} y={395}>
            Who can change the ownership record?
          </Text>
        </>
      );
      break;
    case "decision":
    case "limits":
      drawing = (
        <>
          <Text x={50} y={65}>
            {scene === "limits"
              ? "Can the system observe the physical world?"
              : "Who needs to trust this record?"}
          </Text>
          <path
            d="M450 90v50H200v50m250-50h250v50"
            className="wg-strong-line"
          />
          <Box
            x={40}
            y={205}
            w={345}
            h={130}
            title={scene === "limits" ? "Recorded claim" : "One trusted team"}
            sub={
              scene === "limits"
                ? "Code checks caller + stored state"
                : "Database + permissions + audit log"
            }
          />
          <Box
            x={515}
            y={205}
            w={345}
            h={130}
            title={
              scene === "limits" ? "Physical handover" : "Independent parties"
            }
            sub={
              scene === "limits"
                ? "Needs evidence outside the contract"
                : "Consider a verifiable shared ledger"
            }
            accent
          />
          <Text x={125} y={395} small>
            {scene === "limits"
              ? "VALID RECORD ≠ PROOF THAT THE LAPTOP WAS DELIVERED"
              : "CHOOSE THE SIMPLEST SYSTEM THAT MEETS THE NEED"}
          </Text>
        </>
      );
      break;
    case "accounts":
      drawing = (
        <>
          <Box
            x={45}
            y={80}
            w={315}
            h={125}
            title="Account A"
            sub="0x…A · current caller"
            accent
          />
          <Box
            x={540}
            y={80}
            w={315}
            h={125}
            title="Account B"
            sub="0x…B · another test account"
          />
          <Arrow d="M360 143h170" />
          <Text x={390} y={112} small>
            REQUEST
          </Text>
          <Box
            x={240}
            y={285}
            w={420}
            title="An address is an identifier"
            sub="It does not verify a person’s real identity."
          />
        </>
      );
      break;
    case "agreement":
      drawing = (
        <>
          <circle cx="450" cy="220" r="95" className="wg-card-accent" />
          <Text x={395} y={210} accent>
            Shared rules
          </Text>
          <Text x={393} y={242} accent>
            Valid history
          </Text>
          {[
            [90, 60],
            [650, 60],
            [90, 300],
            [650, 300],
          ].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x + 80} ${y + 45}L450 220`} className="wg-wire" />
              <Box
                x={x}
                y={y}
                w={160}
                title={`Node ${i + 1}`}
                sub="Check the rules"
              />
            </g>
          ))}
          <Text x={290} y={425} small>
            REMIX VM: LOCAL PRACTICE, NOT A DISTRIBUTED NETWORK
          </Text>
        </>
      );
      break;
    case "contract":
      drawing = (
        <>
          <Box x={30} y={165} title="A request" sub="Transfer LAPTOP-001" />
          <Arrow d="M260 212h55" />
          <rect
            x="335"
            y="80"
            width="250"
            height="270"
            rx="14"
            className="wg-panel"
          />
          <Text x={360} y={130}>
            Smart contract
          </Text>
          {[
            "Does the asset exist?",
            "Is the caller the owner?",
            "Is the new owner valid?",
          ].map((s, i) => (
            <Text key={s} x={360} y={190 + i * 45} small>
              {s}
            </Text>
          ))}
          <Arrow d="M585 212h35" />
          <Box
            x={640}
            y={165}
            title="Updated record"
            sub="Only when checks pass"
            accent
          />
        </>
      );
      break;
    case "project":
      drawing = (
        <>
          <Laptop x={55} y={110} />
          <Text x={65} y={330} small>
            ONE ITEM. ONE ID.
          </Text>
          {[
            ["Create", "A registers the laptop"],
            ["Read", "See its name + owner"],
            ["Transfer", "A → B changes ownership"],
          ].map(([t, s], i) => (
            <g key={t}>
              <circle
                cx="375"
                cy={100 + i * 115}
                r="21"
                className="wg-card-accent"
              />
              <Text x={370} y={106 + i * 115} accent>
                {i + 1}
              </Text>
              <Box x={420} y={65 + i * 115} w={400} title={t} sub={s} />
              {i < 2 && (
                <path d={`M375 ${125 + i * 115}v65`} className="wg-wire" />
              )}
            </g>
          ))}
        </>
      );
      break;
    case "permissions":
      drawing = (
        <>
          <Text x={45} y={65} small>
            {slide === 30 ? "AFTER THE TRANSFER" : "BEFORE THE TRANSFER"}
          </Text>
          <Box
            x={45}
            y={105}
            w={290}
            title={slide === 30 ? "Owner: Account B" : "Owner: Account A"}
            sub="LAPTOP-001 · Lab Laptop"
            accent
          />
          {[
            ["Account A", slide === 30 ? "Rejected" : "Allowed"],
            ["Account B", slide === 30 ? "Allowed" : "Rejected"],
          ].map(([a, s], i) => (
            <g key={a}>
              <Box x={45} y={255 + i * 90} w={245} h={70} title={a} />
              <Arrow d={`M290 ${290 + i * 90}h180`} />
              <rect
                x="500"
                y={255 + i * 90}
                width="350"
                height="70"
                rx="10"
                className={s === "Rejected" ? "wg-bad-card" : "wg-card"}
              />
              <Text x={525} y={295 + i * 90}>
                {s} · transferAsset
              </Text>
            </g>
          ))}
          <Text x={430} y={150} small>
            CALLER == CURRENT OWNER?
          </Text>
        </>
      );
      break;
    case "browser":
      drawing = (
        <>
          <rect
            x="70"
            y="35"
            width="760"
            height="365"
            rx="15"
            className="wg-card"
          />
          <rect
            x="70"
            y="35"
            width="760"
            height="50"
            rx="15"
            className="wg-panel"
          />
          <circle cx="95" cy="60" r="5" className="wg-card-accent" />
          <Text x={120} y={66} small>
            REMIX · CAMPUS ASSET REGISTER
          </Text>
          <rect
            x="95"
            y="110"
            width="220"
            height="260"
            rx="6"
            className="wg-panel"
          />
          <Text x={115} y={150}>
            Compile → deploy
          </Text>
          <Text x={115} y={185} small>
            Solidity 0.8.30
          </Text>
          <Text x={115} y={215} small>
            EVM: shanghai
          </Text>
          <Text x={115} y={245} small>
            Optimizer: off
          </Text>
          <Text x={115} y={290} small>
            Remix VM (Shanghai)
          </Text>
          <Text x={365} y={160}>
            Test accounts, ready to use.
          </Text>
          <Text x={365} y={210}>
            No installation. No wallet.
          </Text>
          <Text x={365} y={260}>
            No real money.
          </Text>
          <Text x={365} y={330} small>
            THE CHAIN RUNS LOCALLY IN YOUR BROWSER.
          </Text>
        </>
      );
      break;
    case "remix":
      drawing = (
        <>
          {[
            ["Open", "Import the starter"],
            ["Compile", "0.8.30 · shanghai"],
            ["Deploy", "Remix VM (Shanghai)"],
            ["Inspect", "Find contract buttons"],
          ].map(([t, s], i) => (
            <g
              key={t}
              style={{
                opacity: revealed !== undefined && i >= revealed ? 0.16 : 1,
              }}
            >
              <circle
                cx={110 + i * 225}
                cy="135"
                r="45"
                className="wg-card-accent"
              />
              <text
                x={110 + i * 225}
                y="145"
                textAnchor="middle"
                className="wg-on-accent"
              >
                {i + 1}
              </text>
              <Text x={40 + i * 225} y={240}>
                {t}
              </Text>
              <Text x={40 + i * 225} y={275} small>
                {s}
              </Text>
              {i < 3 && <Arrow d={`M${163 + i * 225} 135h106`} />}
            </g>
          ))}
          <Text x={235} y={380} small>
            CHECKPOINT: EVERY PAIR FINDS ITS DEPLOYED INSTANCE.
          </Text>
        </>
      );
      break;
    case "tests":
      drawing = (
        <>
          {[
            ["Action", "Expected result"],
            ["Duplicate ID", "Asset already exists"],
            ["Unknown ID", "Asset not found"],
            ["Non-owner transfer", "Only the owner can transfer"],
            ["Zero-address recipient", "New owner cannot be zero"],
          ].map(([a, b], i) => (
            <g key={a}>
              <rect
                x="40"
                y={25 + i * 77}
                width="820"
                height="64"
                rx="6"
                className={i === 0 ? "wg-card-accent" : "wg-card"}
              />
              <Text x={65} y={65 + i * 77} accent={i === 0}>
                {a}
              </Text>
              <Text x={400} y={65 + i * 77} accent={i === 0}>
                {b}
              </Text>
            </g>
          ))}
        </>
      );
      break;
    case "history":
      drawing = (
        <>
          <Box
            x={40}
            y={100}
            w={300}
            h={220}
            title="Current state"
            sub="readAsset(LAPTOP-001)"
          />
          <Text x={65} y={220}>
            Lab Laptop
          </Text>
          <Text x={65} y={265}>
            Owner: Account B
          </Text>
          <path d="M465 90v285" className="wg-strong-line" />
          {[
            ["Created", "owner: A"],
            ["Transferred", "A → B"],
            ["Read again", "owner: B"],
          ].map(([t, s], i) => (
            <g key={t}>
              <circle
                cx="465"
                cy={120 + i * 110}
                r="8"
                className="wg-card-accent"
              />
              <Text x={500} y={120 + i * 110}>
                {t}
              </Text>
              <Text x={500} y={149 + i * 110} small>
                {s}
              </Text>
            </g>
          ))}
        </>
      );
      break;
    case "challenge":
      drawing = (
        <>
          <Text x={45} y={80} small>
            25 MINUTES · SWAP EXPLANATIONS WITH YOUR PARTNER
          </Text>
          <text x="45" y="165" className="campus-challenge-id">
            MIC-002
          </text>
          <Text x={45} y={215}>
            or PROJECTOR-003
          </Text>
          <path d="M420 80v300" className="wg-wire" />
          {[
            "Create + read your item",
            "Transfer A → B",
            "Show A’s rejected transfer",
            "Show B’s successful transfer",
          ].map((s, i) => (
            <g key={s}>
              <rect
                x="470"
                y={95 + i * 75}
                width="23"
                height="23"
                rx="3"
                className="wg-card"
              />
              <Text x={515} y={113 + i * 75}>
                {s}
              </Text>
            </g>
          ))}
        </>
      );
      break;
    case "finish":
      drawing = (
        <>
          <text x="35" y="155" className="campus-challenge-id">
            You built
          </text>
          <Text x={40} y={210}>
            a register with rules.
          </Text>
          {["Create", "Read", "Transfer", "Test", "Explain"].map((t, i) => (
            <g key={t}>
              <circle
                cx={80 + i * 180}
                cy="325"
                r="24"
                className="wg-card-accent"
              />
              <text
                x={80 + i * 180}
                y="331"
                textAnchor="middle"
                className="wg-on-accent"
              >
                {i + 1}
              </text>
              <Text x={45 + i * 180} y={390}>
                {t}
              </Text>
              {i < 4 && <Arrow d={`M${110 + i * 180} 325h112`} />}
            </g>
          ))}
        </>
      );
      break;
    default:
      drawing = <Laptop />;
  }
  return (
    <figure className={`workshop-diagram campus-diagram campus-${scene}`}>
      <svg
        viewBox="0 0 900 450"
        role="img"
        aria-label={`Campus asset workshop: ${scene}`}
      >
        <defs>
          <marker
            id="campus-arrow"
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
