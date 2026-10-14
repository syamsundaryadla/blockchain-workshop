"use client";

import React, { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import {
  Boxes,
  Terminal,
  Server,
  Copy,
  CheckCircle2,
  Info,
  Play,
  RotateCcw,
} from "lucide-react";

interface DockerContainerInfo {
  id: string;
  name: string;
  image: string;
  ports: string;
  status: "Up 2 hours" | "Exited (0)" | "Created";
  role: string;
  env: string[];
}

const CONTAINERS: DockerContainerInfo[] = [
  {
    id: "c-orderer",
    name: "orderer.example.com",
    image: "hyperledger/fabric-orderer:2.5",
    ports: "0.0.0.0:7050->7050/tcp",
    status: "Up 2 hours",
    role: "Ordering Node (Raft Consensus)",
    env: [
      "FABRIC_LOGGING_SPEC=INFO",
      "ORDERER_GENERAL_LISTENADDRESS=0.0.0.0",
      "ORDERER_GENERAL_GENESISMETHOD=file",
      "ORDERER_GENERAL_LOCALMSPID=OrdererMSP",
    ],
  },
  {
    id: "c-peer1",
    name: "peer0.org1.example.com",
    image: "hyperledger/fabric-peer:2.5",
    ports: "0.0.0.0:7051->7051/tcp, 0.0.0.0:7052->7052/tcp",
    status: "Up 2 hours",
    role: "Org1 Endorsing & Committing Peer",
    env: [
      "CORE_PEER_ID=peer0.org1.example.com",
      "CORE_PEER_LOCALMSPID=Org1MSP",
      "CORE_PEER_ADDRESS=peer0.org1.example.com:7051",
      "CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org1.example.com:7051",
    ],
  },
  {
    id: "c-peer2",
    name: "peer0.org2.example.com",
    image: "hyperledger/fabric-peer:2.5",
    ports: "0.0.0.0:9051->9051/tcp, 0.0.0.0:9052->9052/tcp",
    status: "Up 2 hours",
    role: "Org2 Endorsing & Committing Peer",
    env: [
      "CORE_PEER_ID=peer0.org2.example.com",
      "CORE_PEER_LOCALMSPID=Org2MSP",
      "CORE_PEER_ADDRESS=peer0.org2.example.com:9051",
      "CORE_PEER_GOSSIP_BOOTSTRAP=peer0.org2.example.com:9051",
    ],
  },
  {
    id: "c-ca1",
    name: "ca_org1",
    image: "hyperledger/fabric-ca:1.5",
    ports: "0.0.0.0:7054->7054/tcp",
    status: "Up 2 hours",
    role: "Org1 Certificate Authority (X.509 PKI)",
    env: [
      "FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server",
      "FABRIC_CA_SERVER_CA_NAME=ca-org1",
      "FABRIC_CA_SERVER_TLS_ENABLED=true",
    ],
  },
  {
    id: "c-chaincode",
    name: "dev-peer0.org1.example.com-basic_1.0",
    image: "dev-peer0.org1.example.com-basic_1.0-ccaas",
    ports: "internal-socket",
    status: "Up 2 hours",
    role: "Smart Contract Runtime (JavaScript Chaincode)",
    env: [
      "CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999",
      "CORE_CHAINCODE_ID_NAME=basic:1.0",
    ],
  },
];

const PREDEFINED_COMMANDS: { command: string; description: string; output: string }[] = [
  {
    command: "docker ps --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}'",
    description: "List all active Hyperledger Fabric infrastructure containers",
    output: `NAMES                                    IMAGE                             STATUS
orderer.example.com                      hyperledger/fabric-orderer:2.5    Up 2 hours
peer0.org1.example.com                   hyperledger/fabric-peer:2.5       Up 2 hours
peer0.org2.example.com                   hyperledger/fabric-peer:2.5       Up 2 hours
ca_org1                                  hyperledger/fabric-ca:1.5         Up 2 hours
ca_org2                                  hyperledger/fabric-ca:1.5         Up 2 hours
dev-peer0.org1.example.com-basic_1.0     dev-peer0.org1-ccaas              Up 2 hours`,
  },
  {
    command: "./network.sh up createChannel -c mychannel -ca",
    description: "Start Fabric test-network with CAs and create channel 'mychannel'",
    output: `[INFO] Starting nodes with CLI timeout of '5' tries and CLI delay of '3' seconds and using database 'leveldb'
[INFO] Generating crypto material using Fabric CA...
[INFO] Generating certs for Org1, Org2, and OrdererOrg
[INFO] Creating network "fabric_test" with the default driver
[INFO] Creating volume "fabric_orderer" ...
[INFO] Creating ca_org1, ca_org2, ca_orderer ...
[INFO] Creating orderer.example.com, peer0.org1.example.com, peer0.org2.example.com ...
[INFO] Bringing up orderer and peer nodes...
[INFO] Generating channel genesis block for channel 'mychannel'
[INFO] Creating channel 'mychannel' using osnadmin...
[INFO] Joining peer0.org1.example.com to channel 'mychannel'...
[INFO] Joining peer0.org2.example.com to channel 'mychannel'...
[SUCCESS] Channel 'mychannel' joined successfully!`,
  },
  {
    command: "./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript",
    description: "Deploy JavaScript chaincode with lifecycle package, install, approve, and commit",
    output: `[INFO] Vendoring JavaScript chaincode dependencies...
[INFO] Packaging chaincode 'basic'...
[INFO] Installing chaincode on peer0.org1.example.com...
[INFO] Installing chaincode on peer0.org2.example.com...
[INFO] Approving chaincode definition for Org1...
[INFO] Approving chaincode definition for Org2...
[INFO] Committing chaincode definition to channel 'mychannel'...
[INFO] Chaincode definition committed on channel 'mychannel'
[SUCCESS] Chaincode 'basic' deployed successfully!`,
  },
  {
    command: "docker logs peer0.org1.example.com --tail 6",
    description: "Inspect recent telemetry and block commit logs from Org1 peer",
    output: `2026-10-14 09:30:11.102 UTC [gossip.gossip] handlePresMsg -> INFO 054 Peer peer0.org1.example.com received gossip message
2026-10-14 09:30:14.221 UTC [valparam] Verify -> INFO 055 Endorsement policy verified for basic:1.0
2026-10-14 09:30:14.225 UTC [committer.txvalidator] Validate -> INFO 056 [mychannel] Validated block [14] in 12ms
2026-10-14 09:30:14.240 UTC [ledgermgmt] CommitLegacy -> INFO 057 [mychannel] Committed block [14] with 1 transaction(s)
2026-10-14 09:30:14.242 UTC [peer.blocksprovider] DeliverBlocks -> INFO 058 Got block [14] from ordering service`,
  },
];

export function DockerArchitectureSim() {
  const [activeTab, setActiveTab] = useState<"visual" | "terminal">("visual");
  const [selectedContainer, setSelectedContainer] = useState<DockerContainerInfo>(
    CONTAINERS[1]
  );
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string }[]
  >([
    {
      command: PREDEFINED_COMMANDS[0].command,
      output: PREDEFINED_COMMANDS[0].output,
    },
  ]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleRunCommand = (cmdItem: (typeof PREDEFINED_COMMANDS)[0]) => {
    setTerminalHistory((prev) => [
      ...prev,
      { command: cmdItem.command, output: cmdItem.output },
    ]);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Switcher & Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab("visual")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "visual"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Boxes className="w-4 h-4" />
            Host &amp; Container Architecture
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "terminal"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-4 h-4" />
            Interactive Terminal Walkthrough
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          Simulated educational container runtime
        </span>
      </div>

      {activeTab === "visual" ? (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">
                  Linux Host Machine (Ubuntu 22.04 LTS / Docker Engine 24.x)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 px-3 py-1 rounded-md bg-blue-50 border border-blue-200">
                Bridge Network: fabric_test (172.18.0.0/16)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONTAINERS.map((container) => {
                const isSelected = selectedContainer.id === container.id;

                return (
                  <div
                    key={container.id}
                    onClick={() => setSelectedContainer(container)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all shadow-sm ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
                        : "bg-white border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold truncate text-slate-900">
                        {container.name}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>
                        Role: <span className="font-semibold text-slate-800">{container.role}</span>
                      </div>
                      <div className="font-mono text-[10px] text-blue-700 truncate">
                        Image: {container.image}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate">
                        Ports: {container.ports}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedContainer && (
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900">
                    Inspecting Container: {selectedContainer.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedContainer.status}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Key Environment Variables:
                </span>
                <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-slate-700 space-y-1 border border-slate-200">
                  {selectedContainer.env.map((e, idx) => (
                    <div key={idx} className="truncate">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Predefined Clickable Command Buttons */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-slate-600 block mb-2">
              Click Command to Execute in Virtual Terminal:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PREDEFINED_COMMANDS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunCommand(item)}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-colors group"
                >
                  <div className="truncate">
                    <span className="font-mono text-xs text-blue-700 font-bold block truncate">
                      $ {item.command}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                      {item.description}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Clean Terminal Window */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl text-white">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  ubuntu@blockchain-lab:~/fabric-samples/test-network
                </span>
              </div>
              <button
                onClick={() => setTerminalHistory([])}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="p-5 font-mono text-xs space-y-4 max-h-[360px] overflow-y-auto">
              <div className="text-slate-400 text-[11px]">
                Linux 5.15.0-generic x86_64 Ubuntu 22.04 LTS (Jammy Jellyfish)
                <br />
                Click commands above to simulate real deployment operations.
              </div>

              {terminalHistory.map((entry, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="font-bold">$ {entry.command}</span>
                    <button
                      onClick={() => handleCopy(entry.command)}
                      className="text-slate-400 hover:text-white"
                      title="Copy command"
                    >
                      {copiedText === entry.command ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px] bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                    {entry.output}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
