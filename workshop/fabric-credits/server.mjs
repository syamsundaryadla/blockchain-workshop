import http from "node:http";
import path from "node:path";
import os from "node:os";
import { readFile, readdir } from "node:fs/promises";
import { createPrivateKey, X509Certificate } from "node:crypto";
import { fileURLToPath } from "node:url";
import grpc from "@grpc/grpc-js";
import { connect, hash, signers } from "@hyperledger/fabric-gateway";

const root = path.dirname(fileURLToPath(import.meta.url));
const samples =
  process.env.FABRIC_SAMPLES ||
  path.join(os.homedir(), "fabric-workshop", "fabric-samples");
const orgRoot = path.join(
  samples,
  "test-network",
  "organizations",
  "peerOrganizations",
);
const port = Number(process.env.PORT || 3200);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw Error("Use a port between 1024 and 65535");
const profiles = {
  alice: { org: 1, user: "User1" },
  bob: { org: 2, user: "User1" },
  admin: { org: 1, user: "Admin" },
};
const connections = new Map();
async function oneFile(dir) {
  const names = (await readdir(dir)).sort();
  if (names.length !== 1) throw Error(`Expected one credential file in ${dir}`);
  return readFile(path.join(dir, names[0]));
}
async function credentials(role) {
  const p = profiles[role];
  if (!p) throw Error("Choose Alice or Bob's demo identity");
  const domain = `org${p.org}.example.com`;
  const org = path.join(orgRoot, domain);
  const msp = path.join(org, "users", `${p.user}@${domain}`, "msp");
  return {
    mspId: `Org${p.org}MSP`,
    cert: await oneFile(path.join(msp, "signcerts")),
    key: await oneFile(path.join(msp, "keystore")),
    tls: await readFile(
      path.join(org, "peers", `peer0.${domain}`, "tls", "ca.crt"),
    ),
    host: `peer0.${domain}`,
    endpoint: `localhost:${p.org === 1 ? 7051 : 9051}`,
  };
}
async function session(role) {
  if (connections.has(role)) return connections.get(role);
  const c = await credentials(role);
  const client = new grpc.Client(
    c.endpoint,
    grpc.credentials.createSsl(c.tls),
    { "grpc.ssl_target_name_override": c.host },
  );
  const gateway = connect({
    client,
    identity: { mspId: c.mspId, credentials: c.cert },
    signer: signers.newPrivateKeySigner(createPrivateKey(c.key)),
    hash: hash.sha256,
    evaluateOptions: () => ({ deadline: Date.now() + 20000 }),
    endorseOptions: () => ({ deadline: Date.now() + 60000 }),
    submitOptions: () => ({ deadline: Date.now() + 30000 }),
    commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
  });
  const result = {
    client,
    gateway,
    contract: gateway.getNetwork("mychannel").getContract("campuscredits"),
  };
  connections.set(role, result);
  return result;
}
const decode = (bytes) => JSON.parse(new TextDecoder().decode(bytes));
async function balances() {
  const { contract } = await session("alice");
  const [alice, bob] = await Promise.all([
    contract.evaluateTransaction("GetBalance", "alice"),
    contract.evaluateTransaction("GetBalance", "bob"),
  ]);
  return { alice: decode(alice).balance, bob: decode(bob).balance };
}
async function submit(role, name, args) {
  const { contract } = await session(role);
  const transaction = await contract.submitAsync(name, { arguments: args });
  const status = await transaction.getStatus();
  if (!status.successful)
    throw Error(
      `Transaction failed validation (code ${status.code}). Refresh balances before retrying.`,
    );
  return { transactionId: transaction.getTransactionId(), status: "VALID" };
}
async function body(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (Buffer.byteLength(data) > 8192) throw Error("Request too large");
  }
  return data ? JSON.parse(data) : {};
}
function json(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(value));
}
const files = {
  "/": ["index.html", "text/html"],
  "/style.css": ["style.css", "text/css"],
  "/app.js": ["app.js", "text/javascript"],
};
const server = http.createServer(async (req, res) => {
  try {
    const origin = req.headers.origin;
    if (
      origin &&
      !new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`]).has(
        origin,
      )
    ) {
      json(res, 403, { error: "Use the local workshop page" });
      return;
    }
    if (
      req.headers.host !== `127.0.0.1:${port}` &&
      req.headers.host !== `localhost:${port}`
    ) {
      json(res, 403, { error: "Use the local workshop address" });
      return;
    }
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && files[url.pathname]) {
      const [file, mime] = files[url.pathname];
      res.writeHead(200, {
        "Content-Type": `${mime}; charset=utf-8`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'",
      });
      res.end(await readFile(path.join(root, "web", file)));
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/balances") {
      json(res, 200, await balances());
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/initialize") {
      await body(req);
      const [a, b] = await Promise.all([
        credentials("alice"),
        credentials("bob"),
      ]);
      const result = await submit("admin", "InitializeDemo", [
        new X509Certificate(a.cert).fingerprint256,
        new X509Certificate(b.cert).fingerprint256,
      ]);
      json(res, 200, { ...result, ...(await balances()) });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/transfer") {
      const input = await body(req);
      if (
        !["alice", "bob"].includes(input.signer) ||
        !["alice", "bob"].includes(input.from) ||
        typeof input.to !== "string" ||
        input.to.length > 32 ||
        typeof input.amount !== "string" ||
        input.amount.length > 40
      )
        throw Error("Check the identity, wallets and amount");
      const result = await submit(input.signer, "TransferCredits", [
        input.from,
        input.to,
        input.amount,
      ]);
      json(res, 200, { ...result, ...(await balances()) });
      return;
    }
    json(res, 404, { error: "Page or operation not found" });
  } catch (error) {
    const details = Array.isArray(error?.details)
      ? error.details
          .map((d) => d.message)
          .filter(Boolean)
          .join("; ")
      : "";
    const message = String(details || error?.message || error).slice(0, 800);
    json(res, 400, { error: message });
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Campus Credits: http://127.0.0.1:${port}`);
  console.log(
    "Real Fabric mode. Start the network and deploy campuscredits first. Demo credentials stay on this backend.",
  );
});
async function shutdown() {
  server.close();
  for (const c of connections.values()) {
    c.gateway.close();
    c.client.close();
  }
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
