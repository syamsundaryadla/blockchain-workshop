"use client";

import React, { useState, useEffect, useRef } from "react";
import { Account, Transaction } from "@/types/blockchain";
import { truncateHash } from "@/lib/utils";
import {
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Send,
  Shield,
  Layers,
  Radio,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  FileCode2,
  X,
  Sliders,
  Check,
} from "lucide-react";

const INITIAL_ACCOUNTS: Account[] = [
  { id: "acc-alice", name: "Alice", address: "0x71C84A18092B", balance: 100, initialBalance: 100 },
  { id: "acc-bob", name: "Bob", address: "0x28BF9024B10A", balance: 50, initialBalance: 50 },
  { id: "acc-charlie", name: "Charlie", address: "0x94DE1123498C", balance: 25, initialBalance: 25 },
];

interface LifecycleStep {
  stepIndex: number;
  phase: string;
  title: string;
  description: string;
  technicalExecution: string;
  activeStage: "signing" | "mempool" | "propagating" | "blockInclusion" | "confirmed";
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    stepIndex: 1,
    phase: "Cryptographic Authorization",
    title: "1. Transaction Initiation & ECDSA Digital Signature",
    description:
      "Alice authorizes a $25 transfer to Bob. Alice's client signs the transaction payload using her private ECDSA key. The signature proves ownership without revealing her private key.",
    technicalExecution:
      "sign(hash(txPayload), Alice_PrivateKey) -> Signature { r: 0x8a1b..., s: 0x4f92... }",
    activeStage: "signing",
  },
  {
    stepIndex: 2,
    phase: "Mempool Ingestion",
    title: "2. Mempool Queuing on Local Node",
    description:
      "The signed transaction is submitted to Alice's local peer node and enters the unconfirmed memory pool (Mempool), awaiting consensus processing.",
    technicalExecution:
      "mempool.push(tx) | Status: Unconfirmed | Gas/Fee: 21,000 gas units",
    activeStage: "mempool",
  },
  {
    stepIndex: 3,
    phase: "P2P Peer Propagation",
    title: "3. Gossip Broadcast & Independent Node Validation",
    description:
      "The transaction gossips across peer nodes. Every node verifies two rules independently: 1. ECDSA signature matches Alice's public key; 2. Alice's current balance >= $25.",
    technicalExecution:
      "verify(Alice_PubKey, Signature) == TRUE && Balance(Alice) >= $25.00",
    activeStage: "propagating",
  },
  {
    stepIndex: 4,
    phase: "Block Assembly",
    title: "4. Inclusion in Candidate Block",
    description:
      "A miner or validator node selects Alice's transaction from the mempool and groups it into candidate Block #43 alongside other network transactions.",
    technicalExecution:
      "BlockCandidate[#43].transactions = [Tx_Alice_Bob, Tx_Charlie_Dave...]",
    activeStage: "blockInclusion",
  },
  {
    stepIndex: 5,
    phase: "State Finality",
    title: "5. Ledger Confirmation & Account State Mutation",
    description:
      "The block is confirmed and appended to the chain. Account state balances mutate permanently across all nodes: Alice ($100 -> $75), Bob ($50 -> $75).",
    technicalExecution:
      "ApplyStateTransition(): State[Alice] = $75.00 | State[Bob] = $75.00 | Confirmed",
    activeStage: "confirmed",
  },
];

export function TransactionSim() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [senderId, setSenderId] = useState("acc-alice");
  const [recipientId, setRecipientId] = useState("acc-bob");
  const [amount, setAmount] = useState(25);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Step-by-step playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(2400);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Inspected payload modal
  const [inspectedTx, setInspectedTx] = useState<Transaction | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setAccounts(INITIAL_ACCOUNTS);
    setHistory([]);
    setError(null);
    setCurrentStepIndex(0);
    setAmount(25);
  };

  const currentStep = LIFECYCLE_STEPS[currentStepIndex];

  // Auto-play stepper loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < LIFECYCLE_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          // Commit at final step
          handleExecuteFinalCommit();
          setIsPlaying(false);
        }
      }, speedMs);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, speedMs]);

  const handleExecuteFinalCommit = () => {
    const sender = accounts.find((a) => a.id === senderId);
    const recipient = accounts.find((a) => a.id === recipientId);
    if (!sender || !recipient) return;

    if (sender.balance < amount) {
      setError(`Insufficient Balance: ${sender.name} has $${sender.balance}.`);
      return;
    }

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === senderId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === recipientId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const tx: Transaction = {
      id: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      sender: sender.name,
      recipient: recipient.name,
      amount,
      timestamp: Date.now(),
      signature: `SIG_ECDSA_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: "confirmed",
    };

    setHistory((prev) => [tx, ...prev]);
  };

  const handleStartFlow = () => {
    setError(null);

    if (senderId === recipientId) {
      setError("Sender and recipient cannot be the same account.");
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      setError("Please specify a valid transaction amount greater than 0.");
      return;
    }

    const sender = accounts.find((a) => a.id === senderId);
    if (!sender || sender.balance < amount) {
      setError(
        `Insufficient Balance: ${sender?.name || "Sender"} has $${sender?.balance || 0}, cannot send $${amount}.`
      );
      return;
    }

    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < LIFECYCLE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleExecuteFinalCommit();
    }
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const activeStage = currentStep.activeStage;

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Banner & Account Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-slate-600">
            Public Blockchain Transaction Lifecycle Simulator: Demonstrates ECDSA digital signing, mempool buffering, P2P peer gossip verification, and ledger state finality.
          </span>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Balances
        </button>
      </div>

      {/* Account Balances Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isSender = acc.id === senderId;
          const isRecipient = acc.id === recipientId;

          return (
            <div
              key={acc.id}
              className={`p-4 rounded-2xl border transition-all shadow-sm flex items-center justify-between ${
                isSender
                  ? "bg-blue-50/70 border-blue-300 ring-1 ring-blue-300"
                  : isRecipient
                  ? "bg-teal-50/70 border-teal-300 ring-1 ring-teal-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Wallet
                    className={`w-4 h-4 ${
                      isSender
                        ? "text-blue-600"
                        : isRecipient
                        ? "text-teal-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span className="font-bold text-base text-slate-900">{acc.name}</span>
                  {isSender && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Sender
                    </span>
                  )}
                  {isRecipient && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      Recipient
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400 block mt-0.5">
                  {acc.address}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-slate-900">
                  ${acc.balance}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Balance
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Configuration Form */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-600" />
          Broadcast Transaction
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              From (Sender)
            </label>
            <select
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              disabled={isPlaying}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (${a.balance})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              To (Recipient)
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              disabled={isPlaying}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (${a.balance})
                </option>
              ))}
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
              disabled={isPlaying}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleStartFlow}
              disabled={isPlaying}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isPlaying ? "Simulating Lifecycle..." : "Initiate Lifecycle"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Visual Lifecycle Stepper with Playback Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600" />
            <span className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Visual Lifecycle Pipeline (5 Stages)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play Lifecycle
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause
              </button>
            )}

            <button
              onClick={handleStepPrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
              title="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800">
              Stage {currentStepIndex + 1} / {LIFECYCLE_STEPS.length}
            </span>

            <button
              onClick={handleStepNext}
              disabled={currentStepIndex === LIFECYCLE_STEPS.length - 1}
              className="p-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
              title="Next Stage"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <div
                key={step.stepIndex}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                  isActive
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300 shadow-sm"
                    : isCompleted
                    ? "bg-slate-50 border-slate-300 opacity-90"
                    : "bg-white border-slate-200 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step {step.stepIndex}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">
                  {step.phase}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                {currentStep.stepIndex}
              </span>
              <h5 className="font-bold text-sm text-slate-900">{currentStep.title}</h5>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white border border-slate-200 text-blue-700">
              Phase: {currentStep.phase}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {currentStep.description}
          </p>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Cryptographic Execution / Protocol Verification:
            </span>
            <p className="font-mono text-xs text-blue-900 font-medium">
              {currentStep.technicalExecution}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmed Ledger History */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Transaction Ledger History ({history.length} records)
          </span>
          <span className="text-[11px] text-slate-400">Chronological audit trail</span>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No transactions confirmed yet. Select accounts and click &quot;Initiate Lifecycle&quot; above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {history.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 bg-slate-50/50 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    CONFIRMED
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900">{tx.sender}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{tx.recipient}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-blue-700">
                    ${tx.amount}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    TxID: {truncateHash(tx.id, 6, 6)}
                  </span>
                  <button
                    onClick={() => setInspectedTx(tx)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Payload Inspector Modal */}
      {inspectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Transaction Receipt: {truncateHash(inspectedTx.id, 8, 8)}
                </h4>
              </div>
              <button
                onClick={() => setInspectedTx(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
              {JSON.stringify(inspectedTx, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedTx(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
