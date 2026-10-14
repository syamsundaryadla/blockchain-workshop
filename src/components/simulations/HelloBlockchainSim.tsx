"use client";

import React, { useState } from "react";
import { truncateHash, copyToClipboard } from "@/lib/utils";
import {
  Database,
  History,
  FileCode2,
  Terminal,
  Send,
  Search,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Copy,
  Layers,
  Play,
  Pause,
  ChevronRight,
  Shield,
  Server,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface MessageRecord {
  key: string;
  value: string;
  version: number;
  lastUpdated: string;
  txId: string;
  updatedBy: string;
}

interface MessageHistoryItem {
  txId: string;
  blockNumber: number;
  timestamp: string;
  previousValue: string;
  newValue: string;
  action: "CreateMessage" | "UpdateMessage";
  endorsedBy: string[];
}

const INITIAL_MESSAGE: MessageRecord = {
  key: "GLOBAL_MESSAGE",
  value: "Hello Blockchain! Welcome to Hyperledger Fabric.",
  version: 1,
  lastUpdated: "2026-10-14 09:00:00 UTC",
  txId: "0x4a8f91c2b09e84d7120a3498bb210947",
  updatedBy: "Admin@org1.example.com",
};

const INITIAL_HISTORY: MessageHistoryItem[] = [
  {
    txId: "0x4a8f91c2b09e84d7120a3498bb210947",
    blockNumber: 41,
    timestamp: "2026-10-14 09:00:00 UTC",
    previousValue: "(None - Initialization)",
    newValue: "Hello Blockchain! Welcome to Hyperledger Fabric.",
    action: "CreateMessage",
    endorsedBy: ["peer0.org1.example.com", "peer0.org2.example.com"],
  },
];

export function HelloBlockchainSim() {
  const [currentMessage, setCurrentMessage] = useState<MessageRecord>(INITIAL_MESSAGE);
  const [history, setHistory] = useState<MessageHistoryItem[]>(INITIAL_HISTORY);

  // Form Inputs
  const [inputMessage, setInputMessage] = useState<string>(
    "Decentralized trust verified by peer endorsement."
  );
  const [senderOrg, setSenderOrg] = useState<string>("Org1MSP (peer0.org1)");

  // Stepper lifecycle animation state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<
    "idle" | "endorse" | "order" | "validate" | "committed"
  >("idle");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"workspace" | "chaincode" | "terminal">("workspace");

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const handleReset = () => {
    setCurrentMessage(INITIAL_MESSAGE);
    setHistory(INITIAL_HISTORY);
    setActiveStage("idle");
    setIsProcessing(false);
  };

  const handleUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    setIsProcessing(true);

    // Stage 1: Endorsement Simulation
    setActiveStage("endorse");
    await new Promise((r) => setTimeout(r, 800));

    // Stage 2: Ordering (Raft batching)
    setActiveStage("order");
    await new Promise((r) => setTimeout(r, 800));

    // Stage 3: Validation (MVCC & Endorsement Policy)
    setActiveStage("validate");
    await new Promise((r) => setTimeout(r, 700));

    // Stage 4: Commit to World State & Block Append Log
    const newTxId = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const newBlockNumber = history[0].blockNumber + 1;
    const nowTimestamp = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

    const updatedRecord: MessageRecord = {
      key: "GLOBAL_MESSAGE",
      value: inputMessage.trim(),
      version: currentMessage.version + 1,
      lastUpdated: nowTimestamp,
      txId: newTxId,
      updatedBy: senderOrg.includes("Org1") ? "Admin@org1.example.com" : "User1@org2.example.com",
    };

    const historyItem: MessageHistoryItem = {
      txId: newTxId,
      blockNumber: newBlockNumber,
      timestamp: nowTimestamp,
      previousValue: currentMessage.value,
      newValue: inputMessage.trim(),
      action: "UpdateMessage",
      endorsedBy: ["peer0.org1.example.com", "peer0.org2.example.com"],
    };

    setCurrentMessage(updatedRecord);
    setHistory((prev) => [historyItem, ...prev]);
    setActiveStage("committed");
    setIsProcessing(false);

    setTimeout(() => {
      setActiveStage("idle");
    }, 2500);
  };

  const jsChaincodeSnippet = `// Fabric Contract API — Hello Blockchain Chaincode
const { Contract } = require('fabric-contract-api');

class HelloBlockchainContract extends Contract {
  // 1. Initialize Ledger with default message
  async InitLedger(ctx) {
    const initialMsg = 'Hello Blockchain! Welcome to Hyperledger Fabric.';
    await ctx.stub.putState('GLOBAL_MESSAGE', Buffer.from(initialMsg));
    return initialMsg;
  }

  // 2. Read Current Message from World State (Fast Read, No Ordering required)
  async ReadMessage(ctx, key) {
    const messageBytes = await ctx.stub.getState(key);
    if (!messageBytes || messageBytes.length === 0) {
      throw new Error(\`Message key \${key} does not exist\`);
    }
    return messageBytes.toString('utf8');
  }

  // 3. Update Message in World State (Requires Endorsement & Raft Ordering)
  async UpdateMessage(ctx, key, newMessage) {
    // Check if key exists
    const exists = await ctx.stub.getState(key);
    if (!exists || exists.length === 0) {
      throw new Error(\`Key \${key} not found. Call CreateMessage first.\`);
    }
    // Mutate state
    await ctx.stub.putState(key, Buffer.from(newMessage));
    return \`Updated \${key} successfully to: \${newMessage}\`;
  }
}

module.exports = HelloBlockchainContract;`;

  const cliSnippet = `# 1. Query Current Message via Peer CLI (ReadMessage)
peer chaincode query \\
  -C mychannel \\
  -n hello-blockchain \\
  -c '{"Args":["ReadMessage","GLOBAL_MESSAGE"]}'

# 2. Invoke Transaction Proposal to Update Message (UpdateMessage)
peer chaincode invoke \\
  -o localhost:7050 \\
  --ordererTLSHostnameOverride orderer.example.com \\
  --tls --cafile "\$ORDERER_CA" \\
  -C mychannel \\
  -n hello-blockchain \\
  --peerAddresses localhost:7051 --tlsRootCertFiles "\$PEER0_ORG1_CA" \\
  --peerAddresses localhost:9051 --tlsRootCertFiles "\$PEER0_ORG2_CA" \\
  -c '{"Args":["UpdateMessage","GLOBAL_MESSAGE","${inputMessage}"]}'`;

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Mini Project: Hello Blockchain Message Store
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Store, retrieve, and update a decentralized message with JavaScript chaincode, StateDB, and ledger logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "workspace"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            Live State &amp; Ledger
          </button>

          <button
            onClick={() => setActiveTab("chaincode")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "chaincode"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode2 className="w-4 h-4 text-teal-600" />
            JavaScript Chaincode
          </button>

          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "terminal"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-600" />
            Terminal Commands
          </button>
        </div>
      </div>

      {/* 1. WORKSPACE TAB */}
      {activeTab === "workspace" && (
        <div className="space-y-6">
          {/* Operation Form */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700">
                  Update Message on Blockchain (ctx.stub.putState)
                </h4>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset State
              </button>
            </div>

            <form onSubmit={handleUpdateMessage} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    New Message String Payload:
                  </label>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Enter message to write to ledger..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Invoking Organization MSP:
                  </label>
                  <select
                    value={senderOrg}
                    onChange={(e) => setSenderOrg(e.target.value)}
                    disabled={isProcessing}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="Org1MSP (peer0.org1)">Org1MSP (peer0.org1)</option>
                    <option value="Org2MSP (peer0.org2)">Org2MSP (peer0.org2)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isProcessing || !inputMessage.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isProcessing ? "Processing Transaction..." : "Submit Transaction Proposal"}
                </button>
              </div>
            </form>
          </div>

          {/* Transaction Execution Lifecycle Stepper */}
          {activeStage !== "idle" && (
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Hyperledger Fabric Execute-Order-Validate Pipeline:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    activeStage === "endorse"
                      ? "bg-white border-blue-500 ring-2 ring-blue-300 text-blue-900 font-bold"
                      : "bg-white/60 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400">1. Execute</div>
                  <div className="text-xs mt-0.5">Endorsement by Peers</div>
                  <div className="text-[10px] text-slate-500 mt-1">Simulates putState()</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    activeStage === "order"
                      ? "bg-white border-indigo-500 ring-2 ring-indigo-300 text-indigo-900 font-bold"
                      : "bg-white/60 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400">2. Order</div>
                  <div className="text-xs mt-0.5">Raft Ordering Service</div>
                  <div className="text-[10px] text-slate-500 mt-1">Batches into Block</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    activeStage === "validate"
                      ? "bg-white border-teal-500 ring-2 ring-teal-300 text-teal-900 font-bold"
                      : "bg-white/60 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400">3. Validate</div>
                  <div className="text-xs mt-0.5">MVCC &amp; Policy Checks</div>
                  <div className="text-[10px] text-slate-500 mt-1">Version verification</div>
                </div>

                <div
                  className={`p-3 rounded-xl border transition-all ${
                    activeStage === "committed"
                      ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 font-bold"
                      : "bg-white/60 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400">4. Commit</div>
                  <div className="text-xs mt-0.5">World State &amp; Ledger Log</div>
                  <div className="text-[10px] text-slate-500 mt-1">State updated!</div>
                </div>
              </div>
            </div>
          )}

          {/* Current World State vs. Immutable Ledger Log Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* World State Card (Current Key-Value) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      World State (StateDB — LevelDB / CouchDB)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Stores the current latest value of key &apos;GLOBAL_MESSAGE&apos;
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Version: {currentMessage.version}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Current Message Value:
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 font-sans leading-relaxed">
                    &ldquo;{currentMessage.value}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">State Key:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {currentMessage.key}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Read Latency:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      &lt;1.8 ms (Local StateDB)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 space-y-0.5 pt-1">
                  <div>Latest TxID: {truncateHash(currentMessage.txId, 8, 8)}</div>
                  <div>Committed by: {currentMessage.updatedBy}</div>
                </div>
              </div>
            </div>

            {/* Blockchain History Append Log */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Blockchain Append Log (Immutable History)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Full audit trail of every modification to this message
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {history.length} Commits
                </span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {history.map((record, idx) => (
                  <div
                    key={record.txId}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700">
                        Block #{record.blockNumber} • {record.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {record.timestamp}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-slate-800 font-medium">
                        &rarr; &ldquo;{record.newValue}&rdquo;
                      </p>
                      {idx > 0 && (
                        <p className="text-[11px] text-slate-400 line-through">
                          Prev: &ldquo;{record.previousValue}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono pt-0.5 border-t border-slate-100 flex items-center justify-between">
                      <span>TxID: {truncateHash(record.txId, 6, 6)}</span>
                      <span>Endorsed: Org1 &amp; Org2</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. JAVASCRIPT CHAINCODE TAB */}
      {activeTab === "chaincode" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-teal-600" />
                JavaScript Smart Contract: hello-blockchain.js
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Implements InitLedger, ReadMessage (getState), and UpdateMessage (putState).
              </p>
            </div>

            <button
              onClick={() => handleCopy(jsChaincodeSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              {copiedText === jsChaincodeSnippet ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedText === jsChaincodeSnippet ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
            {jsChaincodeSnippet}
          </pre>
        </div>
      )}

      {/* 3. TERMINAL COMMANDS TAB */}
      {activeTab === "terminal" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                Ubuntu CLI Invocation &amp; Query Commands
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Run these commands directly in your Linux / Ubuntu terminal against the Fabric test-network.
              </p>
            </div>

            <button
              onClick={() => handleCopy(cliSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              {copiedText === cliSnippet ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedText === cliSnippet ? "Copied" : "Copy CLI"}</span>
            </button>
          </div>

          <pre className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
            {cliSnippet}
          </pre>
        </div>
      )}
    </div>
  );
}
