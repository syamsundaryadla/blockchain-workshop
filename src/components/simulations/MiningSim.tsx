"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { calculateBlockHash } from "@/lib/crypto";
import { truncateHash } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Pickaxe,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Clock,
  Gauge,
  Info,
  Shield,
  Layers,
  Server,
  Zap,
  Users,
  Vote,
  Power,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

type ConsensusMode = "pow" | "pos" | "raft";

interface PosValidator {
  id: string;
  name: string;
  stake: number;
  vote: "pending" | "approved" | "rejected";
  isLeader: boolean;
}

interface RaftNode {
  id: string;
  name: string;
  role: "leader" | "follower";
  isAlive: boolean;
  logIndex: number;
  hasAcked: boolean;
}

export function MiningSim() {
  const [consensusMode, setConsensusMode] = useState<ConsensusMode>("pow");

  // ================= POW STATE =================
  const [difficulty, setDifficulty] = useState<number>(3);
  const [blockIndex] = useState<number>(42);
  const [prevHash] = useState<string>(
    "0000a89f21c432098bfe1349a8820987fae1209384bb21098471209834190823"
  );
  const [txData, setTxData] = useState<string>(
    "Alice -> Bob ($50), Charlie -> Dave ($12)"
  );
  const [nonce, setNonce] = useState<number>(0);
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isMined, setIsMined] = useState<boolean>(false);
  const [minedBlock, setMinedBlock] = useState<{
    nonce: number;
    hash: string;
    durationMs: number;
    totalHashes: number;
  } | null>(null);

  const [hashCount, setHashCount] = useState<number>(0);
  const [hashRate, setHashRate] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const miningRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const currentNonceRef = useRef<number>(0);
  const totalHashesRef = useRef<number>(0);
  const targetPrefix = "0".repeat(difficulty);

  const updatePreview = useCallback(async () => {
    const hash = await calculateBlockHash(
      blockIndex,
      prevHash,
      1704067200000,
      txData,
      currentNonceRef.current
    );
    setCurrentHash(hash);
  }, [blockIndex, prevHash, txData]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const mineChunk = useCallback(async () => {
    if (!miningRef.current) return;

    const BATCH_SIZE = 120;
    const timestamp = 1704067200000;
    const prefix = "0".repeat(difficulty);

    for (let i = 0; i < BATCH_SIZE; i++) {
      const testNonce = currentNonceRef.current;
      const hash = await calculateBlockHash(
        blockIndex,
        prevHash,
        timestamp,
        txData,
        testNonce
      );

      totalHashesRef.current += 1;

      if (hash.startsWith(prefix)) {
        miningRef.current = false;
        setIsMining(false);
        setIsMined(true);
        setNonce(testNonce);
        setCurrentHash(hash);

        const duration = Date.now() - startTimeRef.current;
        setElapsedMs(duration);
        setMinedBlock({
          nonce: testNonce,
          hash,
          durationMs: duration,
          totalHashes: totalHashesRef.current,
        });

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        return;
      }

      currentNonceRef.current += 1;
    }

    setNonce(currentNonceRef.current);
    const now = Date.now();
    const duration = now - startTimeRef.current;
    setElapsedMs(duration);
    setHashCount(totalHashesRef.current);
    if (duration > 0) {
      setHashRate(Math.round((totalHashesRef.current / duration) * 1000));
    }

    if (miningRef.current) {
      requestAnimationFrame(mineChunk);
    }
  }, [blockIndex, difficulty, prevHash, txData]);

  const handleStartMining = () => {
    setIsMined(false);
    setMinedBlock(null);
    miningRef.current = true;
    setIsMining(true);
    startTimeRef.current = Date.now();
    totalHashesRef.current = 0;
    currentNonceRef.current = 0;
    setNonce(0);
    setHashCount(0);
    setElapsedMs(0);
    requestAnimationFrame(mineChunk);
  };

  const handleStopMining = () => {
    miningRef.current = false;
    setIsMining(false);
  };

  const handleResetPow = () => {
    miningRef.current = false;
    setIsMining(false);
    setIsMined(false);
    setMinedBlock(null);
    currentNonceRef.current = 0;
    setNonce(0);
    setHashCount(0);
    setHashRate(0);
    setElapsedMs(0);
    updatePreview();
  };

  // ================= POS STATE =================
  const INITIAL_VALIDATORS: PosValidator[] = [
    { id: "v1", name: "Validator Alpha", stake: 64, vote: "pending", isLeader: true },
    { id: "v2", name: "Validator Beta", stake: 32, vote: "pending", isLeader: false },
    { id: "v3", name: "Validator Gamma", stake: 48, vote: "pending", isLeader: false },
    { id: "v4", name: "Validator Delta", stake: 16, vote: "pending", isLeader: false },
  ];

  const [validators, setValidators] = useState<PosValidator[]>(INITIAL_VALIDATORS);
  const [posStage, setPosStage] = useState<"idle" | "selecting" | "proposing" | "voting" | "finalized">("idle");

  const handleRunPosSimulation = async () => {
    // Stage 1: Selecting Slot Leader weighted by stake
    setPosStage("selecting");
    await new Promise((r) => setTimeout(r, 800));

    // Choose leader (Validator Alpha or Gamma)
    setValidators((prev) =>
      prev.map((v, i) => ({
        ...v,
        isLeader: i === 0,
        vote: "pending",
      }))
    );

    // Stage 2: Leader Proposing Block
    setPosStage("proposing");
    await new Promise((r) => setTimeout(r, 900));

    // Stage 3: Validator Voting (Attestations)
    setPosStage("voting");
    await new Promise((r) => setTimeout(r, 1000));

    setValidators((prev) =>
      prev.map((v) => ({
        ...v,
        vote: "approved",
      }))
    );

    // Stage 4: 2/3 Supermajority Reached & Finalized
    setPosStage("finalized");
  };

  const handleResetPos = () => {
    setPosStage("idle");
    setValidators(INITIAL_VALIDATORS);
  };

  // ================= RAFT / ENTERPRISE CONSENSUS STATE =================
  const INITIAL_RAFT_NODES: RaftNode[] = [
    { id: "r-leader", name: "Raft Leader (Orderer 1)", role: "leader", isAlive: true, logIndex: 10, hasAcked: true },
    { id: "r-f1", name: "Raft Follower 1 (Orderer 2)", role: "follower", isAlive: true, logIndex: 9, hasAcked: false },
    { id: "r-f2", name: "Raft Follower 2 (Orderer 3)", role: "follower", isAlive: true, logIndex: 9, hasAcked: false },
    { id: "r-f3", name: "Raft Follower 3 (Orderer 4)", role: "follower", isAlive: true, logIndex: 9, hasAcked: false },
  ];

  const [raftNodes, setRaftNodes] = useState<RaftNode[]>(INITIAL_RAFT_NODES);
  const [raftStage, setRaftStage] = useState<"idle" | "propose" | "replicate" | "quorum" | "committed">("idle");

  const toggleRaftNode = (id: string) => {
    setRaftNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isAlive: !n.isAlive } : n))
    );
  };

  const handleRunRaftSimulation = async () => {
    const leader = raftNodes.find((n) => n.role === "leader");
    if (!leader || !leader.isAlive) return;

    setRaftStage("propose");
    await new Promise((r) => setTimeout(r, 700));

    setRaftStage("replicate");
    await new Promise((r) => setTimeout(r, 900));

    // Active followers send ACKs
    setRaftNodes((prev) =>
      prev.map((n) =>
        n.isAlive && n.role === "follower" ? { ...n, hasAcked: true, logIndex: 10 } : n
      )
    );

    setRaftStage("quorum");
    await new Promise((r) => setTimeout(r, 800));

    setRaftStage("committed");
  };

  const handleResetRaft = () => {
    setRaftStage("idle");
    setRaftNodes(INITIAL_RAFT_NODES);
  };

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Header & Consensus Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Consensus mechanisms
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare how distributed nodes reach agreement without a central administrator.
          </p>
        </div>

        {/* Mechanism Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setConsensusMode("pow")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              consensusMode === "pow"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Pickaxe className="w-4 h-4 text-amber-600" />
            Proof of Work (PoW)
          </button>

          <button
            onClick={() => setConsensusMode("pos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              consensusMode === "pos"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4 text-teal-600" />
            Proof of Stake (PoS)
          </button>

          <button
            onClick={() => setConsensusMode("raft")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              consensusMode === "raft"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Server className="w-4 h-4 text-indigo-600" />
            Raft
          </button>
        </div>
      </div>

      {/* 1. PROOF OF WORK SIMULATION */}
      {consensusMode === "pow" && (
        <div className="space-y-5">
          {/* Top Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-slate-600">
                Proof of Work: Miners compete computationally to find a numeric <strong className="text-slate-900">Nonce</strong> that produces a SHA-256 hash starting with target leading zeros.
              </span>
            </div>
            <button
              onClick={handleResetPow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Miner
            </button>
          </div>

          {/* Difficulty & Payload Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-700">
                Mining Target Difficulty
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDifficulty(d);
                      handleResetPow();
                    }}
                    disabled={isMining}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      difficulty === d
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {d} Zero{d > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Target Prefix: <span className="font-mono text-blue-700 font-bold">&quot;{targetPrefix}&quot;</span> (16^{difficulty} average attempts).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-700">
                  Block Candidate Header
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Block #{blockIndex}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                  Transactions Payload:
                </label>
                <input
                  type="text"
                  value={txData}
                  onChange={(e) => setTxData(e.target.value)}
                  disabled={isMining}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div className="text-[11px] font-mono text-slate-500 truncate">
                Prev Hash: {truncateHash(prevHash, 14, 14)}
              </div>
            </div>
          </div>

          {/* Mining Dashboard Console */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    isMined
                      ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                      : isMining
                      ? "bg-blue-50 border-blue-300 text-blue-600 animate-pulse"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <Pickaxe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Miner Status:</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-bold ${
                        isMined
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : isMining
                          ? "bg-blue-100 text-blue-800 animate-pulse border border-blue-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isMined ? "BLOCK MINED!" : isMining ? "MINING IN PROGRESS" : "READY"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {isMined
                      ? `Valid nonce found matching target constraint "${targetPrefix}".`
                      : isMining
                      ? "Brute-forcing SHA-256 nonces in non-blocking loop..."
                      : "Click 'Start Mining' to begin hash calculations."}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isMining ? (
                  <button
                    onClick={handleStartMining}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Mining
                  </button>
                ) : (
                  <button
                    onClick={handleStopMining}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stop Mining
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" /> Current Nonce
                </span>
                <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">
                  {nonce.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-teal-600" /> Hash Rate
                </span>
                <span className="text-xl font-mono font-bold text-teal-700 mt-1 block">
                  {hashRate.toLocaleString()} H/s
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Elapsed Time
                </span>
                <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">
                  {(elapsedMs / 1000).toFixed(2)}s
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Hashes Computed
                </span>
                <span className="text-xl font-mono font-bold text-slate-900 mt-1 block">
                  {hashCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Live Hash Calculation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Current SHA-256 Digest:</span>
                <span className="font-mono text-slate-500 text-[11px]">
                  Target constraint: starts with{" "}
                  <strong className="text-blue-700 font-bold">&quot;{targetPrefix}&quot;</strong>
                </span>
              </div>
              <div
                className={`p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between break-all shadow-inner ${
                  currentHash.startsWith(targetPrefix) && isMined
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <span>{currentHash || "0000000000000000000000000000000000000000000000000000000000000000"}</span>
              </div>
            </div>

            {minedBlock && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Proof of Work Solved! Block Verified across Network.
                </div>
                <p className="text-xs text-slate-600">
                  Nonce <strong className="text-slate-900 font-mono">{minedBlock.nonce}</strong> produces a valid hash with {difficulty} leading zeros. Network peers independently verify this in &lt;1 microsecond.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. PROOF OF STAKE SIMULATION */}
      {consensusMode === "pos" && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="text-slate-600">
                Proof of Stake: Replaces energy-intensive mining with economic bonding. Validators lock collateral (stake). A pseudo-random slot leader proposes the block, and other validators sign attestation votes.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunPosSimulation}
                disabled={posStage !== "idle" && posStage !== "finalized"}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Slot Attestation Flow
              </button>
              <button
                onClick={handleResetPos}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-3 rounded-xl border text-left ${
                posStage === "selecting"
                  ? "bg-teal-50 border-teal-500 ring-2 ring-teal-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">
                Stage 1
              </span>
              <span className="text-xs font-bold text-slate-900">
                Leader Election by Stake
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border text-left ${
                posStage === "proposing"
                  ? "bg-teal-50 border-teal-500 ring-2 ring-teal-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">
                Stage 2
              </span>
              <span className="text-xs font-bold text-slate-900">
                Leader Proposes Block
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border text-left ${
                posStage === "voting"
                  ? "bg-teal-50 border-teal-500 ring-2 ring-teal-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">
                Stage 3
              </span>
              <span className="text-xs font-bold text-slate-900">
                Committee Attestation Votes
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border text-left ${
                posStage === "finalized"
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300"
                  : "bg-white border-slate-200"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">
                Stage 4
              </span>
              <span className="text-xs font-bold text-slate-900">
                2/3 Supermajority Finality
              </span>
            </div>
          </div>

          {/* Validator Stake Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {validators.map((v) => (
              <div
                key={v.id}
                className={`p-4 rounded-2xl border transition-all shadow-sm ${
                  v.isLeader
                    ? "bg-teal-50/80 border-teal-400 ring-2 ring-teal-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Vote className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs text-slate-900">{v.name}</span>
                  </div>
                  {v.isLeader && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-200 text-teal-900">
                      Slot Leader
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Bonded Stake:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {v.stake} ETH
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Voting Weight:</span>
                    <span className="font-mono font-semibold text-teal-700">
                      {Math.round((v.stake / 160) * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                    <span className="text-slate-500">Vote Status:</span>
                    <span
                      className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                        v.vote === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {v.vote === "approved" ? "ATTESTED (SIGNED)" : "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posStage === "finalized" && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Block Finalized!</strong> 100% of active validator stake attested to the proposed block header. Instant deterministic finality achieved with zero computational waste.
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. ENTERPRISE RAFT CONSENSUS */}
      {consensusMode === "raft" && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-slate-600">
                Enterprise Raft Consensus (Hyperledger Fabric): Crash Fault Tolerant (CFT) leader-follower consensus. The leader sequences transactions and replicates them to followers. A simple quorum (N/2 + 1) guarantees ordering.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunRaftSimulation}
                disabled={raftStage !== "idle" && raftStage !== "committed"}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Submit Transaction to Orderer
              </button>
              <button
                onClick={handleResetRaft}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Raft Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {raftNodes.map((node) => (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition-all shadow-sm ${
                  !node.isAlive
                    ? "bg-red-50/50 border-red-300 opacity-60"
                    : node.role === "leader"
                    ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Server
                      className={`w-4 h-4 ${
                        node.role === "leader" ? "text-indigo-600" : "text-slate-500"
                      }`}
                    />
                    <span className="font-bold text-xs text-slate-900">{node.name}</span>
                  </div>
                  <button
                    onClick={() => toggleRaftNode(node.id)}
                    className="p-1 text-slate-400 hover:text-slate-800"
                    title={node.isAlive ? "Kill node" : "Revive node"}
                  >
                    <Power className={`w-3.5 h-3.5 ${node.isAlive ? "text-emerald-600" : "text-red-500"}`} />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Role:</span>
                    <span className="font-mono font-bold uppercase text-[10px] text-indigo-700">
                      {node.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Raft Log Index:</span>
                    <span className="font-mono font-bold text-slate-900">
                      #{node.logIndex}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                    <span className="text-slate-500">Quorum Status:</span>
                    <span
                      className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                        node.hasAcked
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {node.hasAcked ? "ACK REPLICATED" : "SYNCING"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {raftStage === "committed" && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>
                <strong>Quorum Achieved (3 of 4 Orderers)!</strong> Log entry committed with sub-second latency and zero probability of a chain fork.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
