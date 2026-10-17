import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import solc from "solc";
import ganache from "ganache";
import {
  BrowserProvider,
  ContractFactory,
  Contract,
  ZeroAddress,
  type Eip1193Provider,
} from "ethers";
import {
  emptyCampusState,
  createCampusAsset,
  transferCampusAsset,
  readCampusAsset,
  TEST_ACCOUNTS,
} from "../src/lib/campus-assets";

function compile(filename: string) {
  const result = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: "Solidity",
        sources: {
          [filename]: {
            content: readFileSync("public/workshop/" + filename, "utf8"),
          },
        },
        settings: {
          evmVersion: "shanghai",
          optimizer: { enabled: false },
          outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
        },
      }),
    ),
  );
  assert.deepEqual(
    (result.errors ?? []).filter(
      (e: { severity: string }) => e.severity === "error",
    ),
    [],
  );
  return result.contracts[filename].CampusAssetRegister;
}
test("starter compiles with the pinned workshop configuration", () => {
  assert.match(solc.version(), /^0[.]8[.]30/);
  compile("CampusAssetRegister.starter.sol");
});
test("deployed solution enforces ownership, emits events, and preserves state on rejection", async () => {
  const compiled = compile("CampusAssetRegister.sol");
  const chain = ganache.provider({
    chain: { hardfork: "shanghai" },
    wallet: { deterministic: true, totalAccounts: 3 },
    logging: { quiet: true },
  });
  try {
    const provider = new BrowserProvider(chain as unknown as Eip1193Provider);
    const a = await provider.getSigner(0),
      b = await provider.getSigner(1);
    const aa = await a.getAddress(),
      bb = await b.getAddress();
    const deployed = await new ContractFactory(
      compiled.abi,
      compiled.evm.bytecode.object,
      a,
    ).deploy();
    await deployed.waitForDeployment();
    const asset = new Contract(await deployed.getAddress(), compiled.abi, a);
    async function reject(action: () => Promise<unknown>, reason: string) {
      await assert.rejects(action, (error) =>
        JSON.stringify(error).includes(reason),
      );
    }
    await reject(
      () => asset.createAsset.staticCall("", "Lab Laptop"),
      "Asset ID is required",
    );
    await reject(
      () => asset.createAsset.staticCall("EMPTY-001", ""),
      "Asset name is required",
    );
    await reject(() => asset.readAsset("UNKNOWN-999"), "Asset not found");
    await reject(
      () => asset.transferAsset.staticCall("UNKNOWN-999", bb),
      "Asset not found",
    );
    const created = await (
      await asset.createAsset("LAPTOP-001", "Lab Laptop")
    ).wait();
    const createdLog = asset.interface.parseLog(created.logs[0]);
    assert.equal(createdLog?.name, "AssetCreated");
    assert.equal(createdLog?.args[2], aa);
    assert.deepEqual(Array.from(await asset.readAsset("LAPTOP-001")), [
      "Lab Laptop",
      aa,
    ]);
    await reject(
      () => asset.createAsset.staticCall("LAPTOP-001", "Overwrite"),
      "Asset already exists",
    );
    await reject(
      () => asset.transferAsset.staticCall("LAPTOP-001", ZeroAddress),
      "New owner cannot be zero",
    );
    const asB = asset.connect(b) as Contract;
    await reject(
      () => asB.transferAsset.staticCall("LAPTOP-001", bb),
      "Only the owner can transfer",
    );
    // Send a real reverting transaction as well as checking readable revert reasons.
    const before = await asset.readAsset("LAPTOP-001");
    const invalid = await asB.transferAsset("LAPTOP-001", bb, {
      gasLimit: 150000,
    });
    await assert.rejects(() => invalid.wait());
    assert.deepEqual(
      Array.from(await asset.readAsset("LAPTOP-001")),
      Array.from(before),
    );
    const transferred = await (
      await asset.transferAsset("LAPTOP-001", bb)
    ).wait();
    const log = asset.interface.parseLog(transferred.logs[0]);
    assert.equal(log?.name, "AssetTransferred");
    assert.equal(log?.args[1], aa);
    assert.equal(log?.args[2], bb);
    assert.equal((await asset.readAsset("LAPTOP-001"))[1], bb);
    await reject(
      () => asset.transferAsset.staticCall("LAPTOP-001", aa),
      "Only the owner can transfer",
    );
    assert.equal((await asset.readAsset("LAPTOP-001"))[1], bb);
    await (await asB.transferAsset("LAPTOP-001", aa)).wait();
    assert.equal((await asset.readAsset("LAPTOP-001"))[1], aa);
  } finally {
    await chain.disconnect();
  }
});
test("local rehearsal follows the same ownership rule and keeps unusual IDs safe", () => {
  const [a, b] = TEST_ACCOUNTS.map((x) => x.address);
  let state = emptyCampusState();
  state = createCampusAsset(state, "__proto__", "Lab Laptop", a);
  assert.equal(readCampusAsset(state, "__proto__").owner, a);
  assert.throws(
    () => createCampusAsset(state, "__proto__", "Other", b),
    /Asset already exists/,
  );
  state = transferCampusAsset(state, "__proto__", b, a);
  assert.throws(
    () => transferCampusAsset(state, "__proto__", a, a),
    /Only the owner/,
  );
  assert.throws(
    () => transferCampusAsset(state, "__proto__", ZeroAddress, b),
    /New owner cannot be zero/,
  );
  assert.equal(readCampusAsset(state, "__proto__").owner, b);
  assert.equal(state.history.length, 2);
});
