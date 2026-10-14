"use client";

import React, { useState, useEffect, useRef } from "react";
import { TopologyType, NetworkNode, NetworkEdge, NetworkPacket } from "@/types/network";
import {
  Server,
  Share2,
  Send,
  Power,
  RotateCcw,
  AlertTriangle,
  Info,
  Radio,
  Play,
  Pause,
  ChevronRight,
  Database,
  X,
  Sliders,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface NodeTelemetry {
  ip: string;
  region: string;
  blockHeight: number;
  mempoolCount: number;
  peerCount: number;
}

export function NetworkTopologySim() {
  const [topology, setTopology] = useState<TopologyType>("decentralized");
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [stats, setStats] = useState({
    sent: 0,
    delivered: 0,
    dropped: 0,
  });

  // Selected node for deep inspection
  const [selectedNode, setSelectedNode] = useState<{
    node: NetworkNode;
    telemetry: NodeTelemetry;
  } | null>(null);

  // Auto-stream continuous transmission state
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(false);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  const initializeTopology = (type: TopologyType) => {
    setIsAutoStreaming(false);
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    if (type === "centralized") {
      const centralNode: NetworkNode = {
        id: "hub",
        name: "Central Server",
        role: "central-hub",
        x: 50,
        y: 50,
        isAlive: true,
        receivedCount: 0,
      };

      const outerNodes: NetworkNode[] = [
        { id: "node-1", name: "Client A", role: "client", x: 20, y: 25, isAlive: true, receivedCount: 0 },
        { id: "node-2", name: "Client B", role: "client", x: 50, y: 15, isAlive: true, receivedCount: 0 },
        { id: "node-3", name: "Client C", role: "client", x: 80, y: 25, isAlive: true, receivedCount: 0 },
        { id: "node-4", name: "Client D", role: "client", x: 80, y: 75, isAlive: true, receivedCount: 0 },
        { id: "node-5", name: "Client E", role: "client", x: 50, y: 85, isAlive: true, receivedCount: 0 },
        { id: "node-6", name: "Client F", role: "client", x: 20, y: 75, isAlive: true, receivedCount: 0 },
      ];

      const newEdges: NetworkEdge[] = outerNodes.map((n) => ({
        id: `edge-${n.id}-hub`,
        source: n.id,
        target: "hub",
        isActive: true,
      }));

      setNodes([centralNode, ...outerNodes]);
      setEdges(newEdges);
      setPackets([]);
    } else {
      const meshNodes: NetworkNode[] = [
        { id: "peer-1", name: "Node 1 (US)", role: "peer", x: 25, y: 25, isAlive: true, receivedCount: 12 },
        { id: "peer-2", name: "Node 2 (EU)", role: "peer", x: 50, y: 20, isAlive: true, receivedCount: 12 },
        { id: "peer-3", name: "Node 3 (Asia)", role: "peer", x: 75, y: 30, isAlive: true, receivedCount: 12 },
        { id: "peer-4", name: "Node 4 (SA)", role: "peer", x: 20, y: 65, isAlive: true, receivedCount: 12 },
        { id: "peer-5", name: "Node 5 (Africa)", role: "peer", x: 50, y: 55, isAlive: true, receivedCount: 12 },
        { id: "peer-6", name: "Node 6 (India)", role: "peer", x: 75, y: 75, isAlive: true, receivedCount: 12 },
        { id: "peer-7", name: "Node 7 (Aus)", role: "peer", x: 45, y: 85, isAlive: true, receivedCount: 12 },
      ];

      const meshEdges: NetworkEdge[] = [
        { id: "e1-2", source: "peer-1", target: "peer-2", isActive: true },
        { id: "e1-4", source: "peer-1", target: "peer-4", isActive: true },
        { id: "e1-5", source: "peer-1", target: "peer-5", isActive: true },
        { id: "e2-3", source: "peer-2", target: "peer-3", isActive: true },
        { id: "e2-5", source: "peer-2", target: "peer-5", isActive: true },
        { id: "e3-6", source: "peer-3", target: "peer-6", isActive: true },
        { id: "e3-5", source: "peer-3", target: "peer-5", isActive: true },
        { id: "e4-5", source: "peer-4", target: "peer-5", isActive: true },
        { id: "e4-7", source: "peer-4", target: "peer-7", isActive: true },
        { id: "e5-6", source: "peer-5", target: "peer-6", isActive: true },
        { id: "e5-7", source: "peer-5", target: "peer-7", isActive: true },
        { id: "e6-7", source: "peer-6", target: "peer-7", isActive: true },
      ];

      setNodes(meshNodes);
      setEdges(meshEdges);
      setPackets([]);
    }
  };

  useEffect(() => {
    initializeTopology(topology);
  }, [topology]);

  const toggleNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, isAlive: !n.isAlive } : n))
    );
  };

  const handleSendMessage = () => {
    const aliveNodes = nodes.filter((n) => n.isAlive);
    if (aliveNodes.length < 2) return;

    if (topology === "centralized") {
      const hub = nodes.find((n) => n.id === "hub");
      const clientA = nodes.find((n) => n.id === "node-1");
      const clientD = nodes.find((n) => n.id === "node-4");

      if (!clientA || !clientD) return;

      const path = ["node-1", "hub", "node-4"];
      const isFailed = !hub?.isAlive || !clientA.isAlive || !clientD.isAlive;

      const newPacket: NetworkPacket = {
        id: `pkt-${Date.now()}-${Math.random()}`,
        sourceId: "node-1",
        targetId: "node-4",
        progress: 0,
        path,
        currentEdgeIndex: 0,
        data: "TX_PAYLOAD_0x8F",
        failed: isFailed,
      };

      setPackets((prev) => [...prev, newPacket]);
      setStats((s) => ({ ...s, sent: s.sent + 1 }));
    } else {
      const startNode = nodes.find((n) => n.id === "peer-1");
      const endNode = nodes.find((n) => n.id === "peer-6");

      if (!startNode || !endNode || !startNode.isAlive || !endNode.isAlive) {
        setStats((s) => ({ ...s, sent: s.sent + 1, dropped: s.dropped + 1 }));
        return;
      }

      // BFS to find the shortest active path among ALIVE nodes
      const queue: string[][] = [["peer-1"]];
      const visited = new Set<string>(["peer-1"]);
      let foundPath: string[] | null = null;

      while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const lastNodeId = currentPath[currentPath.length - 1];

        if (lastNodeId === "peer-6") {
          foundPath = currentPath;
          break;
        }

        const neighborEdges = edges.filter(
          (e) => e.source === lastNodeId || e.target === lastNodeId
        );

        for (const edge of neighborEdges) {
          const neighborId =
            edge.source === lastNodeId ? edge.target : edge.source;
          const neighborNode = nodes.find((n) => n.id === neighborId);

          if (neighborNode?.isAlive && !visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push([...currentPath, neighborId]);
          }
        }
      }

      const newPacket: NetworkPacket = {
        id: `pkt-${Date.now()}-${Math.random()}`,
        sourceId: "peer-1",
        targetId: "peer-6",
        progress: 0,
        path: foundPath || ["peer-1", "peer-5", "peer-6"],
        currentEdgeIndex: 0,
        data: "BLOCK_HASH_#42",
        failed: !foundPath,
      };

      setPackets((prev) => [...prev, newPacket]);
      setStats((s) => ({ ...s, sent: s.sent + 1 }));
    }
  };

  // Continuous auto-streaming toggle
  useEffect(() => {
    if (isAutoStreaming) {
      streamTimerRef.current = setInterval(() => {
        handleSendMessage();
      }, 1400);
    } else if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isAutoStreaming, nodes, topology, edges]);

  // Animation frame packet position updater
  useEffect(() => {
    const updatePackets = () => {
      setPackets((prev) => {
        const nextPackets: NetworkPacket[] = [];

        for (const pkt of prev) {
          if (pkt.failed && pkt.progress >= 0.5) {
            setStats((s) => ({ ...s, dropped: s.dropped + 1 }));
            continue;
          }

          const nextProgress = pkt.progress + 0.035;

          if (nextProgress >= 1) {
            const nextHopIndex = pkt.currentEdgeIndex + 1;
            if (nextHopIndex < pkt.path.length - 1) {
              nextPackets.push({
                ...pkt,
                currentEdgeIndex: nextHopIndex,
                progress: 0,
              });
            } else {
              setStats((s) => ({ ...s, delivered: s.delivered + 1 }));
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === pkt.targetId
                    ? { ...n, receivedCount: n.receivedCount + 1 }
                    : n
                )
              );
            }
          } else {
            nextPackets.push({
              ...pkt,
              progress: nextProgress,
            });
          }
        }

        return nextPackets;
      });

      animationRef.current = requestAnimationFrame(updatePackets);
    };

    animationRef.current = requestAnimationFrame(updatePackets);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [edges, nodes]);

  const handleInspectNode = (node: NetworkNode) => {
    const connectedEdges = edges.filter(
      (e) => e.source === node.id || e.target === node.id
    );

    const telemetry: NodeTelemetry = {
      ip: `192.168.1.${node.id.replace(/[^0-9]/g, "") || "10"}`,
      region:
        node.id === "hub"
          ? "AWS us-east-1 (Centralized Datacenter)"
          : node.name.includes("US")
          ? "North America"
          : node.name.includes("EU")
          ? "Frankfurt, Europe"
          : node.name.includes("Asia")
          ? "Tokyo, Asia"
          : node.name.includes("India")
          ? "Mumbai, India"
          : node.name.includes("SA")
          ? "São Paulo, South America"
          : node.name.includes("Africa")
          ? "Cape Town, Africa"
          : "Sydney, Australia",
      blockHeight: 1240 + node.receivedCount,
      mempoolCount: Math.max(0, 14 - node.receivedCount % 5),
      peerCount: connectedEdges.length,
    };

    setSelectedNode({ node, telemetry });
  };

  const activeNodeCount = nodes.filter((n) => n.isAlive).length;
  const centralHubAlive =
    topology === "centralized"
      ? nodes.find((n) => n.id === "hub")?.isAlive ?? true
      : true;

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Architecture Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Topology Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setTopology("centralized")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              topology === "centralized"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Server className="w-4 h-4 text-blue-600" />
            Centralized Architecture (SPOF)
          </button>
          <button
            onClick={() => setTopology("decentralized")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              topology === "decentralized"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Share2 className="w-4 h-4 text-teal-600" />
            Decentralized Mesh Architecture (P2P)
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isAutoStreaming ? (
            <button
              onClick={() => setIsAutoStreaming(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Auto Stream Packets
            </button>
          ) : (
            <button
              onClick={() => setIsAutoStreaming(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              Pause Stream
            </button>
          )}

          <button
            onClick={handleSendMessage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            Send Single Packet
          </button>

          {topology === "centralized" && (
            <button
              onClick={() => toggleNode("hub")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                centralHubAlive
                  ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {centralHubAlive ? "Kill Central Hub" : "Revive Central Hub"}
            </button>
          )}

          <button
            onClick={() => initializeTopology(topology)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Online Peers
          </span>
          <span className="text-xl font-mono font-bold text-slate-900">
            {activeNodeCount} / {nodes.length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Packets Broadcast
          </span>
          <span className="text-xl font-mono font-bold text-blue-600">
            {stats.sent}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Successfully Delivered
          </span>
          <span className="text-xl font-mono font-bold text-emerald-600">
            {stats.delivered}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Dropped / Blocked
          </span>
          <span className="text-xl font-mono font-bold text-red-600">
            {stats.dropped}
          </span>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="relative w-full h-[400px] rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden select-none shadow-inner">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="absolute top-3 left-3 z-10 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-sm">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Click any node to inspect telemetry, or click power switch to kill it.</span>
        </div>

        {/* SVG Edges and Animated Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isEdgeAlive = sourceNode.isAlive && targetNode.isAlive;

            return (
              <line
                key={edge.id}
                x1={`${sourceNode.x}%`}
                y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={isEdgeAlive ? "#94A3B8" : "#EF4444"}
                strokeWidth={isEdgeAlive ? 2.5 : 1.5}
                strokeDasharray={isEdgeAlive ? undefined : "5 5"}
                strokeOpacity={isEdgeAlive ? 0.75 : 0.4}
              />
            );
          })}

          {packets.map((pkt) => {
            const currentHopId = pkt.path[pkt.currentEdgeIndex];
            const nextHopId = pkt.path[pkt.currentEdgeIndex + 1];

            const nodeA = nodes.find((n) => n.id === currentHopId);
            const nodeB = nodes.find((n) => n.id === nextHopId);

            if (!nodeA || !nodeB) return null;

            const curX = nodeA.x + (nodeB.x - nodeA.x) * pkt.progress;
            const curY = nodeA.y + (nodeB.y - nodeA.y) * pkt.progress;

            return (
              <g key={pkt.id} transform={`translate(${curX}%, ${curY}%)`}>
                <circle
                  r={7}
                  fill={pkt.failed ? "#DC2626" : "#2563EB"}
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Interactive Nodes */}
        {nodes.map((node) => {
          const isCentral = node.role === "central-hub";

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <div
                onClick={() => handleInspectNode(node)}
                className={`cursor-pointer flex flex-col items-center justify-center px-3 py-2 rounded-xl border transition-all shadow-md ${
                  node.isAlive
                    ? isCentral
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                      : "bg-white border-slate-300 hover:border-blue-500 hover:shadow-lg"
                    : "bg-red-50 border-red-300 opacity-60 grayscale"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isCentral ? (
                    <Server
                      className={`w-4 h-4 ${
                        node.isAlive ? "text-blue-600" : "text-red-500"
                      }`}
                    />
                  ) : (
                    <Radio
                      className={`w-3.5 h-3.5 ${
                        node.isAlive ? "text-teal-600" : "text-red-500"
                      }`}
                    />
                  )}
                  <span className="text-xs font-bold whitespace-nowrap text-slate-900">
                    {node.name}
                  </span>
                </div>

                <div className="flex items-center justify-between w-full gap-2 mt-1 border-t border-slate-100 pt-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.isAlive ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-[10px] font-bold tracking-wider text-slate-500">
                      {node.isAlive ? "ONLINE" : "DEAD"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }}
                    className={`p-0.5 rounded text-[10px] font-bold ${
                      node.isAlive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                    title={node.isAlive ? "Kill this node" : "Revive this node"}
                  >
                    <Power className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Peer Node Telemetry: {selectedNode.node.name}
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  selectedNode.node.isAlive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {selectedNode.node.isAlive ? "Active & Syncing" : "Offline / Unreachable"}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Virtual IP &amp; Region:</span>
              <span className="font-mono font-bold text-slate-900">
                {selectedNode.telemetry.ip}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {selectedNode.telemetry.region}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Ledger Block Height:</span>
              <span className="font-mono font-bold text-blue-700 text-sm">
                #{selectedNode.telemetry.blockHeight}
              </span>
              <span className="text-[10px] text-slate-400 block">Verified &amp; Appended</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Mempool Pending Txs:</span>
              <span className="font-mono font-bold text-teal-700 text-sm">
                {selectedNode.telemetry.mempoolCount} transactions
              </span>
              <span className="text-[10px] text-slate-400 block">Awaiting inclusion</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[11px] block">P2P Mesh Connections:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {selectedNode.telemetry.peerCount} active edges
              </span>
              <span className="text-[10px] text-slate-400 block">Gossip propagation</span>
            </div>
          </div>
        </div>
      )}

      {/* Educational Analysis Callout */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1.5 text-slate-700">
        <div className="font-bold text-blue-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          Key Architectural Takeaway:
        </div>
        {topology === "centralized" ? (
          <p className="leading-relaxed">
            In a <strong>Centralized Architecture</strong>, killing the central server immediately shuts down communication across the entire network.
            Clients cannot reach each other, demonstrating the Single Point of Failure (SPOF) vulnerable to outages, cloud downtime, or censorship.
          </p>
        ) : (
          <p className="leading-relaxed">
            In a <strong>Decentralized Mesh Architecture</strong>, nodes maintain redundant peer-to-peer links.
            If one or more nodes fail (try toggling Node 5 or Node 2 offline), packets dynamically re-route through surviving peers.
            Decentralization eliminates the single point of failure at the cost of requiring consensus algorithms to synchronize state.
          </p>
        )}
      </div>
    </div>
  );
}
