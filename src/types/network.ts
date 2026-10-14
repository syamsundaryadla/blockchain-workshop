export type TopologyType = "centralized" | "decentralized";

export interface NetworkNode {
  id: string;
  name: string;
  role: "central-hub" | "peer" | "client";
  x: number; // percentage (0-100) or coordinates
  y: number; // percentage (0-100) or coordinates
  isAlive: boolean;
  isTransmitting?: boolean;
  receivedCount: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  isActive: boolean;
}

export interface NetworkPacket {
  id: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0 to 1
  path: string[]; // sequence of node IDs
  currentEdgeIndex: number;
  data: string;
  failed?: boolean;
}
