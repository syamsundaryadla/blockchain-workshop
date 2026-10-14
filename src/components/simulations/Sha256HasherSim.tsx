"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { sha256 } from "@/lib/crypto";
import { copyToClipboard } from "@/lib/utils";
import {
  Hash,
  Copy,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

interface HashingStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  explanation: string;
  stageName: string;
  dataPreview: string;
  registers?: { [key: string]: string };
}

const HASH_STAGES: HashingStep[] = [
  {
    stepNumber: 1,
    title: "1. ASCII & Binary Conversion",
    subtitle: "Input text converted to raw binary bits",
    explanation:
      "The message string 'Hello' is converted to 8-bit ASCII byte sequences: H (01001000), e (01100101), l (01101100), l (01101100), o (01101111). Total initial length: 5 bytes (40 bits).",
    stageName: "Input Encoding",
    dataPreview: "01001000 01100101 01101100 01101100 01101111",
  },
  {
    stepNumber: 2,
    title: "2. 512-Bit Block Padding",
    subtitle: "Append '1' bit, zeros, and 64-bit message length",
    explanation:
      "SHA-256 processes data in strict 512-bit message blocks. First, a single '1' bit is appended. Then, zero bits ('0') are added until the block length is exactly 448 bits. Finally, the original 64-bit length (40) is appended, creating a full 512-bit chunk.",
    stageName: "Block Padding",
    dataPreview: "01001000...10000000 [408 zeros] ...000000101000 (512 bits)",
  },
  {
    stepNumber: 3,
    title: "3. Message Schedule Expansion",
    subtitle: "Expand 16 words into 64 words (W[0] to W[63])",
    explanation:
      "The 512-bit block is split into sixteen 32-bit words (W[0]..W[15]). SHA-256 then mathematically expands these into 64 words using right-rotations and XOR operations: W[i] = σ1(W[i-2]) + W[i-7] + σ0(W[i-15]) + W[i-16].",
    stageName: "Schedule Expansion",
    dataPreview: "W[0]=0x48656c6c | W[1]=0x6f800000 ... W[63]=0x9b05688c",
  },
  {
    stepNumber: 4,
    title: "4. Compression Rounds (Registers A through H)",
    subtitle: "64 iterative mathematical transformations",
    explanation:
      "Eight 32-bit working state registers (A, B, C, D, E, F, G, H) are initialized with fixed fractional square root constants. For 64 rounds, non-linear bitwise operations (Majority, Choose, Right-Rotate) scramble the registers with round constants K[t] and message words W[t].",
    stageName: "Compression Rounds",
    dataPreview: "Round 64 of 64: Registers scrambled via Ch(E,F,G) and Maj(A,B,C)",
    registers: {
      A: "0x185f8db3",
      B: "0x2271a0fd",
      C: "0x9816e872",
      D: "0xcf9532ef",
      E: "0x39a19e23",
      F: "0x3dd6fe6d",
      G: "0x4fe6789b",
      H: "0xdcf4a854",
    },
  },
  {
    stepNumber: 5,
    title: "5. Final 256-Bit Digest Generation",
    subtitle: "Add working registers to initial hash state",
    explanation:
      "The scrambled working registers are added (modulo 2^32) to the initial hash values. The resulting eight 32-bit words are concatenated to form the final 256-bit (64 hexadecimal characters) output hash digest.",
    stageName: "Hash Digest Output",
    dataPreview: "185f8db32271a0fd9816e872cf9532ef39a19e233dd6fe6d4fe6789bdcf4a854",
  },
];

export function Sha256HasherSim() {
  const [activeTab, setActiveTab] = useState<"animation" | "interactive">("interactive");

  // Step-by-step animation state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [animSpeedMs, setAnimSpeedMs] = useState<number>(2600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive live hasher state
  const [inputA, setInputA] = useState("Hello World");
  const [hashA, setHashA] = useState("");
  const [inputB, setInputB] = useState("hello World");
  const [hashB, setHashB] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    sha256(inputA).then(setHashA);
  }, [inputA]);

  useEffect(() => {
    sha256(inputB).then(setHashB);
  }, [inputB]);

  // Animation player loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= HASH_STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, animSpeedMs);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, animSpeedMs]);

  const handleNextStep = () => {
    setIsPlaying(false);
    if (currentStepIndex < HASH_STAGES.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetAnim = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const handleSetExample = (valA: string, valB: string) => {
    setInputA(valA);
    setInputB(valB);
  };

  // Compute bit differences between hashA and hashB for visual divergence metric
  const calculateHexDifferences = () => {
    if (!hashA || !hashB || hashA.length !== 64 || hashB.length !== 64) {
      return { diffCount: 0, percentage: 0 };
    }
    let diffs = 0;
    for (let i = 0; i < 64; i++) {
      if (hashA[i] !== hashB[i]) diffs++;
    }
    const pct = Math.round((diffs / 64) * 100);
    return { diffCount: diffs, percentage: pct };
  };

  const { diffCount, percentage } = calculateHexDifferences();
  const currentStep = HASH_STAGES[currentStepIndex];

  return (
    <div className="w-full p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            Cryptographic Hashing (SHA-256) Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrates deterministic one-way computation, fixed 256-bit output size, and the avalanche effect.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("animation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "animation"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            1. Animated Hashing Process
          </button>
          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "interactive"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-600" />
            2. Live Interactive Avalanche Hasher
          </button>
        </div>
      </div>

      {/* MODE 1: ANIMATED HASHING PROCESS VISUALIZATION */}
      {activeTab === "animation" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {currentStepIndex === HASH_STAGES.length - 1 ? "Replay Animation" : "Play Process"}
                </button>
              ) : (
                <button
                  onClick={() => setIsPlaying(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-sm"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause
                </button>
              )}

              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-lg text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                Step {currentStepIndex + 1} of {HASH_STAGES.length}
              </span>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === HASH_STAGES.length - 1}
                className="p-2 rounded-lg text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetAnim}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Animation Speed:</span>
              <select
                value={animSpeedMs}
                onChange={(e) => setAnimSpeedMs(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value={3500}>Slow (3.5s)</option>
                <option value={2400}>Normal (2.4s)</option>
                <option value={1200}>Fast (1.2s)</option>
              </select>
            </div>
          </div>

          {/* Stepper Pipeline Flow Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {HASH_STAGES.map((st, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-blue-50 border-blue-600 ring-2 ring-blue-300 text-blue-900 shadow-sm"
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
                  <div className="text-xs font-bold truncate">{st.stageName}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Visual Demonstration Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                  {currentStep.stepNumber}
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentStep.title}</h4>
                  <p className="text-xs text-blue-700 font-medium">{currentStep.subtitle}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-white border border-slate-200 text-slate-600">
                Phase: {currentStep.stageName}
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {currentStep.explanation}
            </p>

            {/* Visual Data Flow Transformation Box */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Internal State &amp; Data Structure:
              </span>
              <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                {currentStep.dataPreview}
              </div>
            </div>

            {/* Working State Registers (for Stage 4) */}
            {currentStep.registers && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  32-Bit Working State Registers (A through H):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(currentStep.registers).map(([reg, val]) => (
                    <div
                      key={reg}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-xs flex items-center justify-between shadow-sm"
                    >
                      <span className="font-bold text-blue-700">Reg {reg}:</span>
                      <span className="text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE LIVE AVALANCHE HASHER */}
      {activeTab === "interactive" && (
        <div className="space-y-6">
          {/* Quick Example Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Quick Demonstration Presets:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSetExample("Hello World", "hello World")}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-medium border border-slate-300 transition-colors shadow-sm"
              >
                Capital &quot;H&quot; vs Lowercase &quot;h&quot;
              </button>
              <button
                onClick={() =>
                  handleSetExample(
                    "Transaction: Alice -> Bob ($50.00)",
                    "Transaction: Alice -> Bob ($50.01)"
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-medium border border-slate-300 transition-colors shadow-sm"
              >
                Financial: $50.00 vs $50.01
              </button>
              <button
                onClick={() => handleSetExample("Blockchain Workshop 2026", "Blockchain Workshop 2026")}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 transition-colors flex items-center gap-1 shadow-sm"
                title="Reset to identical"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Identical</span>
              </button>
            </div>
          </div>

          {/* Side-by-side Avalanche Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stream A */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Input String A:
                </label>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {inputA.length} characters
                </span>
              </div>

              <textarea
                rows={3}
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner resize-none leading-relaxed"
                placeholder="Type any message..."
              />

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  SHA-256 Digest (64 Hex / 256 Bits):
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 font-mono text-xs text-blue-950 break-all shadow-sm">
                  <span className="font-bold tracking-tight">{hashA}</span>
                  <button
                    onClick={() => handleCopy(hashA)}
                    className="ml-2 p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-white flex-shrink-0 transition-colors"
                    title="Copy hash"
                  >
                    {copiedHash === hashA ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stream B */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  Input String B (Altered Input):
                </label>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {inputB.length} characters
                </span>
              </div>

              <textarea
                rows={3}
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white shadow-inner resize-none leading-relaxed"
                placeholder="Type any message..."
              />

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  SHA-256 Digest (64 Hex / 256 Bits):
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-200 font-mono text-xs text-teal-950 break-all shadow-sm">
                  <span className="font-bold tracking-tight">{hashB}</span>
                  <button
                    onClick={() => handleCopy(hashB)}
                    className="ml-2 p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-white flex-shrink-0 transition-colors"
                    title="Copy hash"
                  >
                    {copiedHash === hashB ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Divergence Metric & Analysis Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Hex Character Divergence
              </span>
              <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block">
                {diffCount} / 64
              </span>
              <span className="text-xs text-slate-500">characters altered</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Avalanche Dispersion
              </span>
              <span className="text-2xl font-mono font-bold text-blue-600 mt-1 block">
                {percentage}%
              </span>
              <span className="text-xs text-slate-500">statistical independence</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                Fixed Output Bit-Width
              </span>
              <span className="text-2xl font-mono font-bold text-teal-700 mt-1 block">
                256 Bits
              </span>
              <span className="text-xs text-slate-500">strictly deterministic</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              The Avalanche Effect Explained:
            </div>
            <p className="leading-relaxed">
              Cryptographic hash functions are engineered so that any single-bit input modification flips approximately 50% of the output bits in an apparently random manner.
              Because the resulting 64-character hex digests bear zero mathematical correlation to one another, an adversary cannot infer how to reverse or tamper with data without completely shattering the hash.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
