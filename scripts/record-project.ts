import { readFileSync, writeFileSync } from "node:fs";
import solc from "solc";
import ganache from "ganache";
import {
  BrowserProvider,
  ContractFactory,
  Contract,
  type Eip1193Provider,
} from "ethers";
async function main() {
  const source = readFileSync(
    "public/workshop/CampusAssetRegister.sol",
    "utf8",
  );
  const result = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: "Solidity",
        sources: { "CampusAssetRegister.sol": { content: source } },
        settings: {
          evmVersion: "shanghai",
          optimizer: { enabled: false },
          outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
        },
      }),
    ),
  );
  if (result.errors?.some((e: { severity: string }) => e.severity === "error"))
    throw Error("Compilation failed");
  const compiled =
    result.contracts["CampusAssetRegister.sol"].CampusAssetRegister;
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
    const contract = new Contract(await deployed.getAddress(), compiled.abi, a);
    const steps: {
      title: string;
      caller: string;
      action: string;
      result: string;
      owner: string;
      status: "success" | "rejected";
      transactionHash?: string;
    }[] = [];
    const create = await (
      await contract.createAsset("LAPTOP-001", "Lab Laptop")
    ).wait();
    steps.push({
      title: "Create the laptop",
      caller: "Account A",
      action: 'createAsset("LAPTOP-001", "Lab Laptop")',
      result: "AssetCreated · owner: Account A",
      owner: aa,
      status: "success",
      transactionHash: create.hash,
    });
    const state = await contract.readAsset("LAPTOP-001");
    steps.push({
      title: "Read the record",
      caller: "Account A",
      action: 'readAsset("LAPTOP-001")',
      result: state[0] + " · owner: Account A",
      owner: state[1],
      status: "success",
    });
    try {
      await contract.createAsset.staticCall("LAPTOP-001", "Overwrite");
      throw Error("Duplicate accepted");
    } catch (e) {
      if (!JSON.stringify(e).includes("Asset already exists")) throw e;
    }
    steps.push({
      title: "Reject a duplicate",
      caller: "Account A",
      action: 'createAsset("LAPTOP-001", "Overwrite")',
      result: "Asset already exists · original preserved",
      owner: aa,
      status: "rejected",
    });
    const transfer = await (
      await contract.transferAsset("LAPTOP-001", bb)
    ).wait();
    if ((await contract.readAsset("LAPTOP-001"))[1] !== bb)
      throw Error("Wrong owner");
    steps.push({
      title: "Transfer A → B",
      caller: "Account A",
      action: 'transferAsset("LAPTOP-001", B)',
      result: "AssetTransferred · A → B",
      owner: bb,
      status: "success",
      transactionHash: transfer.hash,
    });
    const invalid = await contract.transferAsset("LAPTOP-001", aa, {
      gasLimit: 150000,
    });
    try {
      await invalid.wait();
      throw Error("Old owner accepted");
    } catch (e) {
      if (!JSON.stringify(e).includes("CALL_EXCEPTION")) throw e;
    }
    if ((await contract.readAsset("LAPTOP-001"))[1] !== bb)
      throw Error("State changed after rejection");
    steps.push({
      title: "A loses permission",
      caller: "Account A",
      action: 'transferAsset("LAPTOP-001", A)',
      result: "Only the owner can transfer · B remains owner",
      owner: bb,
      status: "rejected",
      transactionHash: invalid.hash,
    });
    const back = await (
      await (contract.connect(b) as Contract).transferAsset("LAPTOP-001", aa)
    ).wait();
    if ((await contract.readAsset("LAPTOP-001"))[1] !== aa)
      throw Error("B failed to transfer");
    steps.push({
      title: "B gains permission",
      caller: "Account B",
      action: 'transferAsset("LAPTOP-001", A)',
      result: "AssetTransferred · B → A",
      owner: aa,
      status: "success",
      transactionHash: back.hash,
    });
    writeFileSync(
      "public/workshop/verified-run.json",
      JSON.stringify(
        {
          kind: "local-evm",
          compiler: solc.version(),
          evm: "shanghai",
          optimizer: false,
          network: "Ganache local test EVM",
          contractAddress: await contract.getAddress(),
          accounts: { A: aa, B: bb },
          steps,
        },
        null,
        2,
      ) + "\n",
    );
    console.log("Saved six verified EVM steps.");
  } finally {
    await chain.disconnect();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
