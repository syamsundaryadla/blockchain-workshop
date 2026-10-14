import { QuizQuestion } from "@/types/presentation";

export const MODULE_QUIZZES: Record<number, QuizQuestion> = {
  1: {
    id: "quiz-mod-1",
    question: "If an attacker modifies a transaction in Block #2 of a 5-block chain, what immediately happens to the chain?",
    options: [
      "The network automatically overwrites the change without anyone noticing.",
      "Block #2's recomputed hash changes, breaking the link with Block #3 and invalidating all subsequent blocks.",
      "Only Block #2 is affected, while Blocks #3, #4, and #5 remain completely valid.",
      "The attacker automatically receives administrative privileges on the blockchain.",
    ],
    correctIndex: 1,
    explanation:
      "Because each block contains the cryptographic hash of the previous block, modifying any byte in Block #2 changes its SHA-256 hash completely (the avalanche effect). Block #3's 'previousHash' pointer will no longer match, instantly breaking the cryptographic link.",
  },
  2: {
    id: "quiz-mod-2",
    question: "In Proof of Work (PoW) consensus, what is the miner actually trying to accomplish?",
    options: [
      "Solve a complex mathematical calculus equation for the government.",
      "Find a nonce value such that hashing the block header yields a digest with a specific number of leading zeros.",
      "Vote by staking cryptocurrency tokens to validate transaction signatures.",
      "Query all peer nodes simultaneously to get unanimous approval.",
    ],
    correctIndex: 1,
    explanation:
      "Proof of Work requires finding a numeric 'nonce' such that SHA-256(Block Header + Nonce) produces a hash below a specific target difficulty (e.g., starting with a set number of leading zeros). This requires trial-and-error work that is computationally costly to produce but instantaneously verifiable by any node.",
  },
  3: {
    id: "quiz-mod-3",
    question: "How does Hyperledger Fabric's transaction model fundamentally differ from Ethereum or Bitcoin?",
    options: [
      "Fabric does not use cryptography or digital signatures.",
      "Fabric executes transactions AFTER ordering them into blocks (Order-Execute).",
      "Fabric uses an 'Execute-Order-Validate' model, simulating transactions on endorsing peers before ordering.",
      "Fabric requires proof-of-work mining with high GPU electricity consumption.",
    ],
    correctIndex: 2,
    explanation:
      "Public blockchains typically use 'Order-Execute' (transactions are ordered into blocks and then executed sequentially by all nodes, limiting throughput). Hyperledger Fabric uses 'Execute-Order-Validate': endorsing peers simulate chaincode first, ordering nodes order transactions without executing them, and committing peers validate endorsements and version conflicts (MVCC) before committing.",
  },
  4: {
    id: "quiz-mod-4",
    question: "In a Dockerized Hyperledger Fabric deployment, why are peer and orderer services run in separate containers?",
    options: [
      "Because Docker can only run one process per server.",
      "To provide process, network, and security isolation between organizations and distinct infrastructure roles.",
      "Because Fabric requires separate physical hard drives for each container.",
      "To bypass Linux user permission requirements.",
    ],
    correctIndex: 1,
    explanation:
      "Containerization provides strict architectural and network isolation. Each organization (Org1, Org2) runs its own peer nodes and Certificate Authorities in isolated namespaces, while the Ordering Service runs independently, reflecting enterprise multi-party security boundaries.",
  },
  5: {
    id: "quiz-mod-5",
    question: "When writing a Hyperledger Fabric JavaScript chaincode, what API method persists updated asset data to the World State?",
    options: [
      "ctx.database.insert(asset)",
      "ctx.stub.putState(assetId, Buffer.from(JSON.stringify(asset)))",
      "localStorage.setItem(assetId, JSON.stringify(asset))",
      "ctx.chaincode.saveRecord(assetId, asset)",
    ],
    correctIndex: 1,
    explanation:
      "Fabric contracts interact with the ledger via `ctx.stub`. The `putState(key, value)` method writes binary buffer data to the StateDB (World State) for that specific asset key during the commit phase.",
  },
  6: {
    id: "quiz-mod-6",
    question: "What is the key difference between the World State (StateDB) and the Blockchain Log in Hyperledger Fabric?",
    options: [
      "The World State stores current asset values for rapid querying, while the Blockchain Log is an immutable audit trail of all past transactions.",
      "The World State is public, while the Blockchain Log is private.",
      "The World State is stored on disk, while the Blockchain Log is held only in RAM.",
      "There is no difference; they are two names for the same file.",
    ],
    correctIndex: 0,
    explanation:
      "World State represents the latest state of all ledger keys (e.g., 'asset1 is owned by Bob') stored in LevelDB or CouchDB for fast key and rich queries. The Blockchain Log is the append-only sequence of immutable blocks recording the complete history of every change that ever occurred.",
  },
};
