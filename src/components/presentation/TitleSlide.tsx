import React from "react";

function LedgerBlock({ x, y, opacity = 1 }: { x: number; y: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d="M0-48 84 0 0 48-84 0Z" fill="#365973" />
      <path d="M-84 0 0 48V142l-84-48Z" fill="#1c3c55" />
      <path d="m0 48 84-48v94L0 142Z" fill="#244a65" />
      <path d="M0-48 84 0v94L0 142l-84-48V0ZM-84 0 0 48 84 0M0 48v94" className="title-block-edge" />
      <path d="m-62 42 40 23m-40-6 40 23m-40-6 25 14" className="title-block-records" />
      <path d="m0-48 84 48" className="title-block-highlight" />
    </g>
  );
}

export function TitleSlide() {
  return (
    <div className="title-only-slide">
      <svg className="title-ledger-art" viewBox="0 0 1000 620" aria-hidden="true" focusable="false">
        <path d="M620 162c65 18 100 22 170 35M790 387c65 18 100 22 170 35" className="title-chain-track" />
        <path d="M620 162c65 18 100 22 170 35M790 387c65 18 100 22 170 35" className="title-chain-link" />
        <LedgerBlock x={620} y={20} opacity={0.55} />
        <LedgerBlock x={790} y={245} />
        <LedgerBlock x={960} y={470} opacity={0.7} />
        <path d="M170 545h290l62-36h138" className="title-ledger-trace" />
        <circle cx="170" cy="545" r="3" className="title-trace-node" />
        <circle cx="660" cy="509" r="3" className="title-trace-node" />
      </svg>
      <h1><span className="title-subject">Block chain</span>{" "}<span className="title-fundamentals">fundamentals</span></h1>
    </div>
  );
}
