export interface FabricAsset {
  ID: string;
  Color: string;
  Size: number;
  Owner: string;
  AppraisedValue: number;
}

export interface FabricHistoryRecord {
  txId: string;
  timestamp: string;
  isDelete: boolean;
  value: FabricAsset;
  action: "CreateAsset" | "UpdateAsset" | "TransferAsset" | "DeleteAsset";
}

export type FabricRole = "client" | "peer-org1" | "peer-org2" | "orderer" | "ca-org1" | "ca-org2" | "ledger";

export interface FabricComponent {
  id: string;
  name: string;
  organization: "Org1" | "Org2" | "OrdererOrg" | "ClientApp";
  type: FabricRole;
  description: string;
  ports?: string[];
  containerName?: string;
  status: "active" | "endorsing" | "committing" | "idle";
}

export interface FabricTxStep {
  stepNumber: number;
  title: string;
  phase: "Endorsement" | "Ordering" | "Validation & Commit";
  activeComponents: string[];
  senderId: string;
  receiverId: string;
  description: string;
  technicalDetail: string;
  payloadSummary: string;
}
