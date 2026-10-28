"use client";
import React, { useState } from "react";
import { propagationDistances } from "@/lib/propagation-model";

const positions = [
  [90, 160],
  [270, 65],
  [270, 255],
  [500, 65],
  [500, 255],
  [680, 160],
];
const edges = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];

export function BroadcastLab() {
  const [hop, setHop] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [offNodes, setOffNodes] = useState<number[]>([]),
    [selectedNode, setSelectedNode] = useState(1);
  const hops = propagationDistances(positions.length, edges, offNodes);
  const maxHop = Math.min(
    invalid ? 1 : Infinity,
    Math.max(0, ...hops.filter(Number.isFinite)),
  );
  function toggleNode(index: number) {
    setOffNodes((current) =>
      current.includes(index)
        ? current.filter((n) => n !== index)
        : [...current, index],
    );
    setSelectedNode(index);
    setHop(0);
  }
  const received = hops.filter((n) => n <= hop).length;
  return (
    <div className="broadcast-lab">
      <div className="lab-context-label">
        MANUAL PROPAGATION MODEL · NOT LIVE NETWORKING OR CONSENSUS
      </div>
      <div className="broadcast-request">
        <strong>Alice → Bob · {invalid ? 200 : 20} credits</strong>
        <span>Alice has 100 · received ≠ confirmed</span>
      </div>
      <div className="broadcast-canvas">
        <svg
          className="broadcast-network"
          viewBox="0 0 770 325"
          role="img"
          aria-label={`Hop ${hop}: ${received} of 6 nodes have the request`}
        >
          {edges.map(([a, b]) => (
            <path
              key={`${a}-${b}`}
              d={`M${positions[a][0]} ${positions[a][1]}L${positions[b][0]} ${positions[b][1]}`}
              className={
                !offNodes.includes(a) &&
                !offNodes.includes(b) &&
                hop >= Math.max(hops[a], hops[b])
                  ? "broadcast-link reached"
                  : "broadcast-link"
              }
            />
          ))}
          {positions.map(([x, y], i) => (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={offNodes.includes(i)}
              aria-label={`Node ${String.fromCharCode(65 + i)}: ${offNodes.includes(i) ? "off. Turn on node" : "on. Turn off node"}`}
              onClick={() => toggleNode(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleNode(i);
                }
              }}
              className={`broadcast-peer ${offNodes.includes(i) ? "offline" : hops[i] <= hop ? (invalid && i > 0 ? "received rejected" : "received") : ""}`}
            >
              <circle cx={x} cy={y} r="34" />
              <text x={x} y={y + 6} textAnchor="middle">
                {String.fromCharCode(65 + i)}
              </text>
              <text
                x={x}
                y={y + 58}
                textAnchor="middle"
                className="broadcast-node-status"
              >
                {offNodes.includes(i)
                  ? "Off"
                  : i === 0
                    ? "Request origin"
                    : hops[i] > hop
                      ? invalid && hop > 0
                        ? "Not forwarded"
                        : "Waiting"
                      : invalid
                        ? "Rule rejected"
                        : "Rule check passed"}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="node-power-controls">
        <label>
          Network node
          <select
            aria-label="Network node"
            value={selectedNode}
            onChange={(event) => setSelectedNode(Number(event.target.value))}
          >
            {positions.map((_, i) => (
              <option key={i} value={i}>
                Node {String.fromCharCode(65 + i)}
              </option>
            ))}
          </select>
        </label>
        <button
          className="studio-button secondary"
          onClick={() => toggleNode(selectedNode)}
        >
          {offNodes.includes(selectedNode) ? "Turn on node" : "Turn off node"}
        </button>
        <button
          className="text-button"
          onClick={() => {
            setOffNodes([]);
            setHop(0);
          }}
        >
          Restore all nodes
        </button>
      </div>
      <div className="flow-controls">
        <label className="flow-failure-toggle">
          <input
            type="checkbox"
            checked={invalid}
            onChange={(event) => {
              setInvalid(event.target.checked);
              setHop(0);
            }}
          />
          Try an unaffordable request
        </label>
        <div className="campus-button-row">
          <button className="text-button" onClick={() => setHop(0)}>
            Restart
          </button>
          <button
            className="studio-button primary"
            disabled={hop >= maxHop}
            onClick={() => setHop(hop + 1)}
          >
            Broadcast next hop
          </button>
        </div>
      </div>
      <p className="lab-result" role="status">
        {received} of 6 nodes have the request.{" "}
        {offNodes.includes(0)
          ? "The origin is off. Restore node A to send a request."
          : invalid
            ? hop === 0
              ? "Predict: will the receiving peers forward a request for 200 when Alice has 100?"
              : "Receiving peers reject it: 200 exceeds 100. They do not forward the invalid request."
            : offNodes.length
              ? "Only reachable nodes receive it. Off nodes do not forward messages; connected peers can use another path."
              : "Local rule checks pass; ledger confirmation still requires the network protocol."}{" "}
        No balances change in this model.
      </p>
    </div>
  );
}
