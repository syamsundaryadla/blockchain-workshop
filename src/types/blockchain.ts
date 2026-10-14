export interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  signature?: string;
  status: "pending" | "confirmed" | "failed";
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  isTampered?: boolean;
}

export interface ChainValidationResult {
  isValid: boolean;
  brokenBlockIndex: number | null;
  errorReason: string | null;
}

export interface Account {
  id: string;
  name: string;
  address: string;
  balance: number;
  initialBalance: number;
}
