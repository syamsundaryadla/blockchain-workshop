"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Block, Transaction } from "@/types/blockchain";
import {
  createGenesisBlock,
  mineNewBlock,
  validateBlockchain,
  tamperBlockData,
  recalculateChainHashes,
} from "@/lib/blockchain-engine";
import { truncateHash, copyToClipboard } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Copy,
  Hash,
  Link as LinkIcon,
  AlertTriangle,
  Layers,
  Wrench,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Workflow,
  Eye,
  X,
  FileCode2,
} from "lucide-react";

interface CreationStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  detail: string;
  activeField: "txs" | "prevHash" | "nonce" | "hash" | "chain";
}

const CREATION_STEPS: CreationStep[] = [
  {
    stepNumber: 1,
    phase: "Transaction Ingestion",
    title: "1. Packaging Transactions from Mempool",
    description:
      "Pending verified transactions (Alice -> Bob $25) are packaged into the new block's candidate transaction payload.",
    detail: "TxID: 0x8a9f... | Amount: $25.00 | Digital Signature: Valid ECDSA",
    activeField: "txs",
  },
  {
    stepNumber: 2,
    phase: "Header Construction",
    title: "2. Referencing the Parent Block's Hash",
    description:
      "The new block fetches the SHA-256 hash of the preceding block (Block N-1) and embeds it permanently as 'previousHash'. This creates the backward cryptographic reference.",
    detail: "previousHash = Hash(Block #0) = e4f891b2c409...",
    activeField: "prevHash",
  },
  {
    stepNumber: 3,
    phase: "Cryptographic Hashing",
    title: "3. Generating the Block Hash Digest",
    description:
      "The entire block header (Index + Timestamp + Tx Data + PreviousHash + Nonce) is passed through the SHA-256 cryptographic function to produce a 64-hex-character digest.",
    detail: "Block Hash = SHA-256(Block #1 + Data + prevHash + nonce) = 78a2c10f...",
    activeField: "hash",
  },
  {
    stepNumber: 4,
    phase: "Chain Linking",
    title: "4. Cryptographic Link Locking",
    description:
      "The new block's previousHash pointer securely locks into the previous block. Any future modification to the parent block will change its hash, instantly breaking this link.",
    detail: "Chain Link: Block #1 [previousHash: e4f891...] ---> Block #0 [hash: e4f891...]",
    activeField: "chain",
  },
  {
    stepNumber: 5,
    phase: "Ledger Commitment",
    title: "5. Append to Ledger & Chain Extension",
    description:
      "The block is confirmed and permanently appended to the distributed ledger. The blockchain height increments and the chain grows.",
    detail: "Ledger Height updated to N. Block #1 is now immutable across network peers.",
    activeField: "chain",
  },
];

export function BlockchainSim() {
  const [activeTab, setActiveTab] = useState<"interactive" | "creationFlow">("interactive");
  const [chain, setChain] = useState<Block[]>([]);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    brokenBlockIndex: number | null;
    errorReason: string | null;
  }>({ isValid: true, brokenBlockIndex: null, errorReason: null });

  // Creation walkthrough state
  const [creationStepIndex, setCreationStepIndex] = useState<number>(0);
  const [isCreationPlaying, setIsCreationPlaying] = useState<boolean>(false);
  const creationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pending transaction inputs
  const [sender, setSender] = useState("Alice");
  const [recipient, setRecipient] = useState("Bob");
  const [amount, setAmount] = useState(25);
  const [isMining, setIsMining] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [inspectedBlock, setInspectedBlock] = useState<Block | null>(null);

  // Initialize genesis block
  const initializeChain = useCallback(async () => {
    const genesis = await createGenesisBlock();
    setChain([genesis]);
  }, []);

  useEffect(() => {
    initializeChain();
  }, [initializeChain]);

  // Re-run validation whenever chain changes
  useEffect(() => {
    if (chain.length === 0) return;
    validateBlockchain(chain).then((res) => setValidation(res));
  }, [chain]);

  // Creation animation player loop
  useEffect(() => {
    if (isCreationPlaying) {
      creationTimerRef.current = setTimeout(() => {
        setCreationStepIndex((prev) => {
          if (prev >= CREATION_STEPS.length - 1) {
            setIsCreationPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600);
    } else if (creationTimerRef.current) {
      clearTimeout(creationTimerRef.current);
    }

    return () => {
      if (creationTimerRef.current) clearTimeout(creationTimerRef.current);
    };
  }, [isCreationPlaying, creationStepIndex]);

  const handleAddBlock = async () => {
    if (chain.length === 0 || isMining) return;
    setIsMining(true);

    try {
      const prevBlock = chain[chain.length - 1];
      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender,
        recipient,
        amount,
        timestamp: Date.now(),
        status: "confirmed",
      };

      const newBlock = await mineNewBlock(prevBlock, [newTx], 1);
      setChain((prev) => [...prev, newBlock]);
    } finally {
      setIsMining(false);
    }
  };

  const handleTamperBlock = (blockIndex: number, newAmount: number) => {
    const targetBlock = chain[blockIndex];
    if (!targetBlock || targetBlock.transactions.length === 0) return;

    const modifiedTransactions: Transaction[] = [
      {
        ...targetBlock.transactions[0],
        amount: newAmount,
      },
    ];

    const tampered = tamperBlockData(chain, blockIndex, modifiedTransactions);
    setChain(tampered);
  };

  const handleRecalculate = async () => {
    if (chain.length === 0) return;
    const recomputed = await recalculateChainHashes(chain, 0);
    setChain(recomputed);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const currentCreationStep = CREATION_STEPS[creationStepIndex];

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              validation.isValid
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-300 animate-pulse"
            }`}
          >
            {validation.isValid ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-slate-900">Chain integrity</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-bold tracking-wide border ${
                  validation.isValid
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
              >
                {validation.isValid ? "Verified" : "Broken link"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              {validation.isValid
                ? `${chain.length} blocks linked by SHA-256.`
                : validation.errorReason}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "interactive"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            The chain
          </button>
          <button
            onClick={() => setActiveTab("creationFlow")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "creationFlow"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Workflow className="w-4 h-4 text-teal-600" />
            How blocks connect
          </button>
        </div>
      </div>

      {/* MODE 1: STEP-BY-STEP BLOCK CREATION FLOW */}
      {activeTab === "creationFlow" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-teal-600" />
                Step-by-Step Block Creation &amp; Cryptographic Linking
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Observe how raw transactions enter a block, how the previous hash binds to the parent, and how the chain links together.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isCreationPlaying ? (
                <button
                  onClick={() => setIsCreationPlaying(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {creationStepIndex === CREATION_STEPS.length - 1 ? "Replay Flow" : "Play Flow"}
                </button>
              ) : (
                <button
                  onClick={() => setIsCreationPlaying(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause
                </button>
              )}

              <button
                onClick={() => {
                  setIsCreationPlaying(false);
                  if (creationStepIndex > 0) setCreationStepIndex((p) => p - 1);
                }}
                disabled={creationStepIndex === 0}
                className="p-2 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                Step {creationStepIndex + 1} of {CREATION_STEPS.length}
              </span>

              <button
                onClick={() => {
                  setIsCreationPlaying(false);
                  if (creationStepIndex < CREATION_STEPS.length - 1)
                    setCreationStepIndex((p) => p + 1);
                }}
                disabled={creationStepIndex === CREATION_STEPS.length - 1}
                className="p-2 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsCreationPlaying(false);
                  setCreationStepIndex(0);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CREATION_STEPS.map((st, idx) => {
              const isActive = idx === creationStepIndex;
              const isPast = idx < creationStepIndex;

              return (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setIsCreationPlaying(false);
                    setCreationStepIndex(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-teal-50 border-teal-600 ring-2 ring-teal-300 text-teal-900 shadow-sm"
                      : isPast
                      ? "bg-slate-50 border-slate-300 text-slate-700"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider">
                      Stage {st.stepNumber}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-xs font-bold truncate">{st.phase}</div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                  {currentCreationStep.stepNumber}
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {currentCreationStep.title}
                  </h4>
                  <span className="text-xs text-teal-800 font-medium">
                    Phase: {currentCreationStep.phase}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {currentCreationStep.description}
            </p>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Internal Block Payload &amp; State:
              </span>
              <p className="font-mono text-xs text-blue-900 font-medium">
                {currentCreationStep.detail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE CHAIN & TAMPER DETECTION */}
      {activeTab === "interactive" && (
        <div className="space-y-6">
          {/* Action and Reset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">
                Try appending blocks, or edit the transaction amount in any block below to see real-time tamper detection.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!validation.isValid && (
                <button
                  onClick={handleRecalculate}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors shadow-sm"
                  title="Recalculates SHA-256 hashes locally. Explains that honest consensus peers reject this altered fork."
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recalculate Hashes Locally
                </button>
              )}

              <button
                onClick={initializeChain}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Chain
              </button>
            </div>
          </div>

          {/* Block Append Creation Form */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Append New Candidate Block
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Sender
                </label>
                <select
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Alice">Alice</option>
                  <option value="Bob">Bob</option>
                  <option value="Charlie">Charlie</option>
                  <option value="Dave">Dave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Recipient
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Bob">Bob</option>
                  <option value="Alice">Alice</option>
                  <option value="Charlie">Charlie</option>
                  <option value="Dave">Dave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddBlock}
                  disabled={isMining}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  {isMining ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isMining ? "Hashing..." : "Mine & Append Block"}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Chained Blocks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Blockchain Ledger ({chain.length} Blocks)
              </span>
              <span className="text-xs text-slate-500">
                Click any block to inspect its complete internal data structure.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chain.map((block, index) => {
                const isBroken =
                  validation.brokenBlockIndex !== null &&
                  index >= validation.brokenBlockIndex;
                const isSourceOfBreak = validation.brokenBlockIndex === index;

                return (
                  <div
                    key={block.index}
                    className={`relative rounded-2xl border p-5 transition-all shadow-sm ${
                      isSourceOfBreak
                        ? "bg-red-50/70 border-red-400 ring-2 ring-red-300"
                        : isBroken
                        ? "bg-red-50/30 border-red-300 opacity-95"
                        : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                            isSourceOfBreak
                              ? "bg-red-200 text-red-900"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          Block #{block.index}
                        </span>
                        {block.index === 0 && (
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                            Genesis
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">
                          Nonce: {block.nonce}
                        </span>
                        <button
                          onClick={() => setInspectedBlock(block)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                          title="Inspect raw block JSON"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3.5 text-xs">
                      {/* Previous Hash */}
                      <div>
                        <span className="text-slate-500 text-[11px] font-semibold block mb-1 flex items-center gap-1">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                          Previous Hash:
                        </span>
                        <div
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border font-mono text-[11px] ${
                            isBroken && !isSourceOfBreak
                              ? "bg-red-100 border-red-300 text-red-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{truncateHash(block.previousHash, 8, 8)}</span>
                          <button
                            onClick={() => handleCopy(block.previousHash)}
                            className="hover:text-slate-900"
                            title="Copy previous hash"
                          >
                            {copiedHash === block.previousHash ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Transaction Data (Editable for Tampering Demo) */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 text-[11px] font-bold flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-amber-600" />
                            Transaction Payload (Editable):
                          </span>
                          {block.isTampered && (
                            <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5 bg-red-100 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Altered!
                            </span>
                          )}
                        </div>

                        {block.transactions.map((tx, txIdx) => (
                          <div
                            key={txIdx}
                            className="flex items-center justify-between gap-2 text-xs pt-1"
                          >
                            <span className="font-mono text-slate-900 font-medium">
                              {tx.sender} &rarr; {tx.recipient}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 text-xs font-bold">$</span>
                              <input
                                type="number"
                                value={tx.amount}
                                onChange={(e) =>
                                  handleTamperBlock(index, Number(e.target.value))
                                }
                                className={`w-20 bg-white px-2 py-0.5 rounded-md font-mono text-xs border text-right focus:outline-none ${
                                  block.isTampered
                                    ? "border-red-500 text-red-700 bg-red-50 font-bold"
                                    : "border-slate-300 text-slate-900 focus:border-blue-500"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Current Block Hash */}
                      <div>
                        <span className="text-slate-500 text-[11px] font-semibold block mb-1 flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-blue-600" />
                          Current Block Hash (SHA-256):
                        </span>
                        <div
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg font-mono text-[11px] border ${
                            isSourceOfBreak
                              ? "bg-red-100 border-red-300 text-red-900 font-bold"
                              : "bg-blue-50/70 border-blue-200 text-blue-950 font-medium"
                          }`}
                        >
                          <span>{truncateHash(block.hash, 9, 9)}</span>
                          <button
                            onClick={() => handleCopy(block.hash)}
                            className="hover:text-slate-900"
                            title="Copy block hash"
                          >
                            {copiedHash === block.hash ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Arrow connector */}
                    {index < chain.length - 1 && (
                      <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                        <div
                          className={`w-7 h-7 rounded-full border shadow-sm flex items-center justify-center text-xs font-bold ${
                            isBroken
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "bg-white border-slate-300 text-slate-600"
                          }`}
                        >
                          &rarr;
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Raw Block Inspector Modal */}
      {inspectedBlock && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Block #{inspectedBlock.index} Raw Schema
                </h4>
              </div>
              <button
                onClick={() => setInspectedBlock(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-80">
              {JSON.stringify(inspectedBlock, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedBlock(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
