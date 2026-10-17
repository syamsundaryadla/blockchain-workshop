// Contract logic against a stubbed ledger and real test certificate parsing.
// These tests do not simulate or replace Fabric ordering/validation.
const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { X509Certificate } = require("node:crypto");
const CreditsContract = require("../chaincode/lib/credits-contract");
const cert = (name) => readFileSync(join(__dirname, "fixtures", name + ".crt"));
const fingerprint = (name) => new X509Certificate(cert(name)).fingerprint256;
function ledger() {
  const state = new Map();
  const events = [];
  const contract = new CreditsContract();
  async function call(
    name,
    role,
    args = [],
    msp = role === "bob" ? "Org2MSP" : "Org1MSP",
  ) {
    const writes = new Map();
    const pendingEvents = [];
    const ctx = {
      clientIdentity: { getMSPID: () => msp },
      stub: {
        getCreator: () => ({ idBytes: cert(role) }),
        getState: async (key) => Buffer.from(state.get(key) || []),
        putState: async (key, value) => {
          writes.set(key, Buffer.from(value));
        },
        setEvent: (name, value) =>
          pendingEvents.push({ name, value: JSON.parse(value.toString()) }),
      },
    };
    const response = await contract[name](ctx, ...args);
    for (const [k, v] of writes) state.set(k, v);
    events.push(...pendingEvents);
    return JSON.parse(response);
  }
  const initialize = () =>
    call("InitializeDemo", "org1admin", [
      fingerprint("alice"),
      fingerprint("bob"),
    ]);
  return { call, initialize, state, events };
}
test("one-time initialization requires the supplied organization administrator", async () => {
  const l = ledger();
  const args = [fingerprint("alice"), fingerprint("bob")];
  await assert.rejects(
    l.call("InitializeDemo", "alice", args),
    /administrator/,
  );
  await assert.rejects(
    l.call("InitializeDemo", "org1admin", args, "Org2MSP"),
    /administrator/,
  );
  await l.initialize();
  await assert.rejects(l.initialize(), /already initialized/);
  assert.equal((await l.call("GetBalance", "alice", ["alice"])).balance, 100);
});
test("real certificate ownership checks allow both transfer directions", async () => {
  const l = ledger();
  await l.initialize();
  await l.call("TransferCredits", "alice", ["alice", "bob", "20"]);
  assert.equal((await l.call("GetBalance", "alice", ["alice"])).balance, 80);
  assert.equal((await l.call("GetBalance", "bob", ["bob"])).balance, 70);
  await l.call("TransferCredits", "bob", ["bob", "alice", "10"]);
  assert.equal((await l.call("GetBalance", "alice", ["alice"])).balance, 90);
  assert.equal((await l.call("GetBalance", "bob", ["bob"])).balance, 60);
  assert.equal(
    l.events.filter((e) => e.name === "CreditsTransferred").length,
    2,
  );
});
test("wrong certificate, wrong MSP, bad inputs and missing records leave all state unchanged", async () => {
  const l = ledger();
  await l.initialize();
  const snapshot = () =>
    JSON.stringify([...l.state].map(([k, v]) => [k, v.toString()]));
  const before = snapshot();
  await assert.rejects(
    l.call("TransferCredits", "bob", ["alice", "bob", "20"]),
    /Permission denied/,
  );
  await assert.rejects(
    l.call("TransferCredits", "intruder", ["alice", "bob", "20"]),
    /Permission denied/,
  );
  await assert.rejects(
    l.call("TransferCredits", "alice", ["alice", "bob", "20"], "Org2MSP"),
    /Permission denied/,
  );
  for (const amount of ["0", "-1", "2.5", "20abc", "1000", "9007199254740992"])
    await assert.rejects(
      l.call("TransferCredits", "alice", ["alice", "bob", amount]),
    );
  await assert.rejects(
    l.call("TransferCredits", "alice", ["alice", "alice", "1"]),
    /different recipient/,
  );
  await assert.rejects(
    l.call("TransferCredits", "alice", ["alice", "missing", "1"]),
    /not found/,
  );
  assert.equal(snapshot(), before);
  assert.equal(l.events.length, 1);
});
test("only the intended three operations are public contract methods", () => {
  const methods = Object.getOwnPropertyNames(CreditsContract.prototype).filter(
    (n) => n !== "constructor" && !n.startsWith("_"),
  );
  assert.deepEqual(
    methods.sort(),
    ["GetBalance", "InitializeDemo", "TransferCredits"].sort(),
  );
});
