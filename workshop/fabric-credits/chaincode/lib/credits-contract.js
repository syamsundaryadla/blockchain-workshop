"use strict";
const { Contract } = require("fabric-contract-api");
const { X509Certificate } = require("node:crypto");
const { prepareTransfer } = require("./transfer-rules");

const encode = (value) => Buffer.from(JSON.stringify(value));
const key = (id) => `wallet:${id}`;
const validId = (id) =>
  typeof id === "string" && /^[a-z][a-z0-9-]{0,31}$/.test(id);

class CreditsContract extends Contract {
  constructor() {
    super("CampusCredits");
  }

  _caller(ctx) {
    const certificate = new X509Certificate(ctx.stub.getCreator().idBytes);
    return {
      certificate,
      fingerprint: certificate.fingerprint256,
      msp: ctx.clientIdentity.getMSPID(),
    };
  }

  async InitializeDemo(ctx, aliceFingerprint, bobFingerprint) {
    const caller = this._caller(ctx);
    // This exact enrollment belongs to the supplied local test network.
    // A production system needs its own administration and enrollment policy.
    if (
      caller.msp !== "Org1MSP" ||
      !caller.certificate.subject.split("\n").includes("CN=org1admin")
    ) {
      throw new Error("Only the prepared Org1 administrator may initialize");
    }
    if ((await ctx.stub.getState("demo:initialized")).length) {
      throw new Error("Demo already initialized");
    }
    const fingerprintPattern = /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/;
    if (
      !fingerprintPattern.test(aliceFingerprint) ||
      !fingerprintPattern.test(bobFingerprint) ||
      aliceFingerprint === bobFingerprint
    ) {
      throw new Error("Two distinct certificate fingerprints are required");
    }
    const alice = {
      id: "alice",
      label: "Alice",
      owner: aliceFingerprint,
      ownerMSP: "Org1MSP",
      balance: 100,
    };
    const bob = {
      id: "bob",
      label: "Bob",
      owner: bobFingerprint,
      ownerMSP: "Org2MSP",
      balance: 50,
    };
    await ctx.stub.putState(key("alice"), encode(alice));
    await ctx.stub.putState(key("bob"), encode(bob));
    await ctx.stub.putState("demo:initialized", encode({ initialized: true }));
    ctx.stub.setEvent("DemoInitialized", encode({ alice: 100, bob: 50 }));
    return JSON.stringify({ alice: 100, bob: 50 });
  }

  async _wallet(ctx, id) {
    if (!validId(id)) throw new Error("Invalid wallet ID");
    const bytes = await ctx.stub.getState(key(id));
    if (!bytes.length)
      throw new Error("Wallet not found; initialize the demo first");
    const wallet = JSON.parse(bytes.toString());
    if (!Number.isSafeInteger(wallet.balance) || wallet.balance < 0)
      throw new Error("Invalid stored balance");
    return wallet;
  }

  async GetBalance(ctx, id) {
    return JSON.stringify(await this._wallet(ctx, id));
  }

  async TransferCredits(ctx, fromId, toId, rawAmount) {
    const sender = await this._wallet(ctx, fromId);
    const caller = this._caller(ctx);
    if (caller.msp !== sender.ownerMSP || caller.fingerprint !== sender.owner) {
      throw new Error(
        "Permission denied: signer does not own the sender wallet",
      );
    }
    if (fromId === toId) throw new Error("Choose a different recipient");
    const recipient = await this._wallet(ctx, toId);
    const result = prepareTransfer(
      sender.balance,
      recipient.balance,
      rawAmount,
    );
    sender.balance = result.senderBalance;
    recipient.balance = result.recipientBalance;
    // Fabric prepares these writes during execution. Valid commit applies them.
    await ctx.stub.putState(key(fromId), encode(sender));
    await ctx.stub.putState(key(toId), encode(recipient));
    const event = {
      from: fromId,
      to: toId,
      amount: result.amount,
      senderBalance: sender.balance,
      recipientBalance: recipient.balance,
    };
    ctx.stub.setEvent("CreditsTransferred", encode(event));
    return JSON.stringify(event);
  }
}
module.exports = CreditsContract;
