import { Block, Transaction, ChainValidationResult } from "@/types/blockchain";
import { calculateBlockHash } from "./crypto";

export function serializeTransactions(transactions: Transaction[]): string {
  return JSON.stringify(
    transactions.map((t) => ({
      s: t.sender,
      r: t.recipient,
      a: t.amount,
      t: t.timestamp,
    }))
  );
}

/**
 * Creates the genesis block of the educational chain.
 */
export async function createGenesisBlock(): Promise<Block> {
  const timestamp = 1704067200000; // Fixed timestamp for reproducible genesis: 2024-01-01
  const genesisTx: Transaction = {
    id: "tx-genesis",
    sender: "SYSTEM_GENESIS",
    recipient: "Alice",
    amount: 100,
    timestamp,
    status: "confirmed",
  };

  const txData = serializeTransactions([genesisTx]);
  const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
  const nonce = 0;
  const hash = await calculateBlockHash(0, previousHash, timestamp, txData, nonce);

  return {
    index: 0,
    timestamp,
    transactions: [genesisTx],
    previousHash,
    hash,
    nonce,
    difficulty: 1,
    isTampered: false,
  };
}

/**
 * Mines or creates a new block linked to the previous block.
 */
export async function mineNewBlock(
  previousBlock: Block,
  transactions: Transaction[],
  difficulty = 1
): Promise<Block> {
  const index = previousBlock.index + 1;
  const timestamp = Date.now();
  const txData = serializeTransactions(transactions);
  let nonce = 0;
  let hash = "";
  const targetPrefix = "0".repeat(difficulty);

  // Quick synchronous search for low educational difficulty
  while (true) {
    hash = await calculateBlockHash(index, previousBlock.hash, timestamp, txData, nonce);
    if (hash.startsWith(targetPrefix) || nonce > 20000) {
      break;
    }
    nonce++;
  }

  return {
    index,
    timestamp,
    transactions: transactions.map((tx) => ({ ...tx, status: "confirmed" })),
    previousHash: previousBlock.hash,
    hash,
    nonce,
    difficulty,
    isTampered: false,
  };
}

/**
 * Validates the entire blockchain:
 * 1. Has block data been altered such that its stored hash doesn't match its recomputed hash?
 * 2. Does each block's previousHash match the previous block's stored hash?
 */
export async function validateBlockchain(chain: Block[]): Promise<ChainValidationResult> {
  if (chain.length === 0) {
    return { isValid: true, brokenBlockIndex: null, errorReason: null };
  }

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];
    const txData = serializeTransactions(current.transactions);
    const recomputedHash = await calculateBlockHash(
      current.index,
      current.previousHash,
      current.timestamp,
      txData,
      current.nonce
    );

    // 1. Data integrity check
    if (recomputedHash !== current.hash) {
      return {
        isValid: false,
        brokenBlockIndex: i,
        errorReason: `Block #${current.index} data has been tampered with! Stored hash (${current.hash.substring(
          0,
          10
        )}...) does not match recomputed hash (${recomputedHash.substring(0, 10)}...).`,
      };
    }

    // 2. Link integrity check (for all blocks after genesis)
    if (i > 0) {
      const prev = chain[i - 1];
      if (current.previousHash !== prev.hash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          errorReason: `Broken link at Block #${current.index}! Its previousHash points to (${current.previousHash.substring(
            0,
            10
          )}...), but Block #${prev.index}'s actual hash is (${prev.hash.substring(0, 10)}...).`,
        };
      }
    }
  }

  return { isValid: true, brokenBlockIndex: null, errorReason: null };
}

/**
 * Simulates tampering by updating transaction data in a block WITHOUT updating its stored hash.
 * This makes the block visibly invalid upon validation.
 */
export function tamperBlockData(
  chain: Block[],
  blockIndex: number,
  newTransactions: Transaction[]
): Block[] {
  return chain.map((block, idx) => {
    if (idx === blockIndex) {
      return {
        ...block,
        transactions: newTransactions,
        isTampered: true,
      };
    }
    return block;
  });
}

/**
 * Demonstrates recalculating all hashes from a tampered block onward.
 * Used educationally to show that an attacker could recalculate hashes locally,
 * but in a real decentralized network, honest nodes would reject the alternate chain
 * due to consensus (Proof of Work / longest chain rule).
 */
export async function recalculateChainHashes(
  chain: Block[],
  startingIndex = 0
): Promise<Block[]> {
  const newChain: Block[] = [...chain];

  for (let i = startingIndex; i < newChain.length; i++) {
    const prevHash =
      i === 0
        ? "0000000000000000000000000000000000000000000000000000000000000000"
        : newChain[i - 1].hash;

    const current = newChain[i];
    const txData = serializeTransactions(current.transactions);
    const newHash = await calculateBlockHash(
      current.index,
      prevHash,
      current.timestamp,
      txData,
      current.nonce
    );

    newChain[i] = {
      ...current,
      previousHash: prevHash,
      hash: newHash,
      isTampered: false,
    };
  }

  return newChain;
}
