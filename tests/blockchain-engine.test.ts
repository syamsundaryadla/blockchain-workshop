import test from "node:test";
import assert from "node:assert/strict";
import { sha256, calculateBlockHash } from "../src/lib/crypto";
import {
  createGenesisBlock,
  mineNewBlock,
  validateBlockchain,
  tamperBlockData,
  recalculateChainHashes,
} from "../src/lib/blockchain-engine";
import { FABRIC_TX_STEPS, FABRIC_COMPONENTS, INITIAL_FABRIC_ASSETS } from "../src/lib/fabric-engine";
import { Transaction } from "../src/types/blockchain";

test("SHA-256 cryptographic hashing", async () => {
  const hash1 = await sha256("Blockchain Lab");
  const hash2 = await sha256("Blockchain Lab");
  const hash3 = await sha256("blockchain lab"); // Notice lowercase 'b'

  assert.equal(hash1.length, 64, "SHA-256 hash must be 64 hexadecimal characters");
  assert.equal(hash1, hash2, "SHA-256 must be strictly deterministic");
  assert.notEqual(hash1, hash3, "Avalanche effect: minor input change must randomize hash output");
});

test("Genesis block creation", async () => {
  const genesis = await createGenesisBlock();
  assert.equal(genesis.index, 0, "Genesis block index must be 0");
  assert.equal(
    genesis.previousHash,
    "0000000000000000000000000000000000000000000000000000000000000000",
    "Genesis previousHash must be 64 zeros"
  );
  assert.equal(genesis.hash.length, 64, "Genesis hash must be 64 characters");
  assert.equal(genesis.isTampered, false);
});

test("Mining and chaining blocks", async () => {
  const genesis = await createGenesisBlock();
  const tx1: Transaction = {
    id: "tx-test-1",
    sender: "Alice",
    recipient: "Bob",
    amount: 50,
    timestamp: Date.now(),
    status: "confirmed",
  };

  const block1 = await mineNewBlock(genesis, [tx1], 1);
  assert.equal(block1.index, 1);
  assert.equal(block1.previousHash, genesis.hash, "Block 1 must point to Genesis hash");
  assert.ok(block1.hash.startsWith("0"), "Block 1 hash must satisfy difficulty target");

  const tx2: Transaction = {
    id: "tx-test-2",
    sender: "Bob",
    recipient: "Charlie",
    amount: 20,
    timestamp: Date.now(),
    status: "confirmed",
  };

  const block2 = await mineNewBlock(block1, [tx2], 1);
  assert.equal(block2.index, 2);
  assert.equal(block2.previousHash, block1.hash, "Block 2 must point to Block 1 hash");

  const chain = [genesis, block1, block2];
  const validation = await validateBlockchain(chain);
  assert.equal(validation.isValid, true, "Untampered chain must be completely valid");
  assert.equal(validation.brokenBlockIndex, null);
});

test("Tampering detection and broken link isolation", async () => {
  const genesis = await createGenesisBlock();
  const tx1: Transaction = {
    id: "tx-1",
    sender: "Alice",
    recipient: "Bob",
    amount: 30,
    timestamp: Date.now(),
    status: "confirmed",
  };
  const block1 = await mineNewBlock(genesis, [tx1], 1);
  const chain = [genesis, block1];

  // Tamper with Block 1's transaction amount (e.g., change 30 to 9999)
  const tamperedTx: Transaction = {
    ...tx1,
    amount: 9999,
  };

  const tamperedChain = tamperBlockData(chain, 1, [tamperedTx]);
  assert.equal(tamperedChain[1].isTampered, true);

  const validation = await validateBlockchain(tamperedChain);
  assert.equal(validation.isValid, false, "Tampered chain must be detected as invalid");
  assert.equal(validation.brokenBlockIndex, 1, "Must isolate tampered Block #1");
  assert.ok(validation.errorReason?.includes("tampered"), "Error reason must explain tampering");
});

test("Recalculate chain hashes", async () => {
  const genesis = await createGenesisBlock();
  const tx1: Transaction = {
    id: "tx-1",
    sender: "Alice",
    recipient: "Bob",
    amount: 25,
    timestamp: Date.now(),
    status: "confirmed",
  };
  const block1 = await mineNewBlock(genesis, [tx1], 1);
  const chain = [genesis, block1];

  const tamperedChain = tamperBlockData(chain, 1, [{ ...tx1, amount: 500 }]);
  const repairedChain = await recalculateChainHashes(tamperedChain, 0);

  const validation = await validateBlockchain(repairedChain);
  assert.equal(
    validation.isValid,
    true,
    "Recalculating hashes repairs local cryptographic integrity"
  );
});

test("Hyperledger Fabric 8-step lifecycle integrity", () => {
  assert.equal(FABRIC_TX_STEPS.length, 8, "Fabric lifecycle must define exactly 8 sequential steps");

  // Step numbers 1 to 8 in order
  FABRIC_TX_STEPS.forEach((step, idx) => {
    assert.equal(step.stepNumber, idx + 1);
    assert.ok(step.activeComponents.length > 0);
    assert.ok(step.description.length > 20);
    assert.ok(step.technicalDetail.length > 20);
  });

  assert.ok(FABRIC_COMPONENTS.length >= 6);
  assert.ok(INITIAL_FABRIC_ASSETS.length >= 5);
});
