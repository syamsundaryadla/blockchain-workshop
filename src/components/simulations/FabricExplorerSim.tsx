"use client";

import React, { useState, useEffect, useRef } from "react";
import { FABRIC_COMPONENTS, FABRIC_TX_STEPS } from "@/lib/fabric-engine";
import { FabricComponent, FabricTxStep } from "@/types/fabric";
import {
  Server,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  Database,
  Shield,
  FileCode2,
  Workflow,
  Info,
  Sliders,
  CheckCircle2,
  X,
} from "lucide-react";

interface PacketVisual {
  x: number; // percentage
  y: number; // percentage
  label: string;
  color: string;
}

export function FabricExplorerSim() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(2800);
  const [selectedComponent, setSelectedComponent] = useState<FabricComponent | null>(
    FABRIC_COMPONENTS[0]
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep: FabricTxStep = FABRIC_TX_STEPS[currentStepIndex];

  // Auto-play loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= FABRIC_TX_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, speedMs]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < FABRIC_TX_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const isComponentActive = (compId: string): boolean => {
    return currentStep.activeComponents.includes(compId);
  };

  // Determine animated data packets currently in transit based on the step number
  const getPacketsForStep = (): PacketVisual[] => {
    switch (currentStep.stepNumber) {
      case 1:
        // Client Proposal to Org1 & Org2 peers
        return [
          { x: 32, y: 32, label: "Proposal", color: "#2563EB" },
          { x: 48, y: 32, label: "Proposal", color: "#2563EB" },
        ];
      case 2:
        // Chaincode container simulation inside peers
        return [
          { x: 25, y: 44, label: "Simulating", color: "#0D9488" },
          { x: 75, y: 44, label: "Simulating", color: "#0D9488" },
        ];
      case 3:
        // Endorsements returning to client
        return [
          { x: 28, y: 25, label: "RW-Set + Sig", color: "#059669" },
          { x: 50, y: 25, label: "RW-Set + Sig", color: "#059669" },
        ];
      case 4:
        // Client submitting to Orderer
        return [{ x: 50, y: 15, label: "Endorsed Tx", color: "#4F46E5" }];
      case 5:
        // Raft consensus sequencing
        return [{ x: 75, y: 15, label: "Raft Batching", color: "#4F46E5" }];
      case 6:
        // Ordered block delivery to peers
        return [
          { x: 38, y: 42, label: "Block #42", color: "#2563EB" },
          { x: 75, y: 35, label: "Block #42", color: "#2563EB" },
        ];
      case 7:
        // MVCC validation in peers
        return [
          { x: 25, y: 55, label: "MVCC Check", color: "#0D9488" },
          { x: 75, y: 55, label: "MVCC Check", color: "#0D9488" },
        ];
      case 8:
        // Ledger commit
        return [
          { x: 25, y: 72, label: "StateDB Commit", color: "#059669" },
          { x: 75, y: 72, label: "Block Log Append", color: "#2563EB" },
        ];
      default:
        return [];
    }
  };

  const packetsInTransit = getPacketsForStep();

  return (
    <div className="space-y-6 w-full text-slate-800">
      {/* Top Playback & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {currentStepIndex === FABRIC_TX_STEPS.length - 1 ? "Replay Flow" : "Play Flow"}
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
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
            Step {currentStepIndex + 1} of {FABRIC_TX_STEPS.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === FABRIC_TX_STEPS.length - 1}
            className="p-2 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-40 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Sliders className="w-4 h-4 text-blue-600" />
            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value={3800}>Speed: Slow (3.8s)</option>
              <option value={2600}>Speed: Normal (2.6s)</option>
              <option value={1400}>Speed: Fast (1.4s)</option>
            </select>
          </div>

          <span
            className={`text-xs px-3 py-1.5 rounded-lg font-bold border ${
              currentStep.phase === "Endorsement"
                ? "bg-blue-50 border-blue-200 text-blue-800"
                : currentStep.phase === "Ordering"
                ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            Phase: {currentStep.phase}
          </span>
        </div>
      </div>

      {/* Main Architectural Blueprint Map with Animated Data Packets */}
      <div className="relative p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-700 flex items-center gap-1.5">
            <Workflow className="w-4 h-4 text-blue-600" />
            Hyperledger Fabric Consortium Architecture (Channel: mychannel)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Active components are highlighted. Click any component to inspect runtime roles.
          </span>
        </div>

        {/* Top Tier: Client Application & Raft Ordering Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedComponent(FABRIC_COMPONENTS[0])}
            className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-sm ${
              isComponentActive("client-app")
                ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-300"
                : "bg-slate-50 border-slate-200 hover:border-blue-400 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">Client Application</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-bold">
                Gateway SDK
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Initiates transaction proposals signed with user X.509 cert; collects endorsements and broadcasts to Orderer.
            </p>
          </div>

          <div
            onClick={() => setSelectedComponent(FABRIC_COMPONENTS[3])}
            className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-sm ${
              isComponentActive("orderer")
                ? "bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-300"
                : "bg-slate-50 border-slate-200 hover:border-indigo-400 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900">orderer.example.com</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-indigo-700 font-bold">
                Raft Consensus
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crash Fault Tolerant (CFT) Raft consensus node. Sequences transactions into chronological blocks and delivers them to channel peers.
            </p>
          </div>
        </div>

        {/* Middle Tier: Organizations Subnet (Org1 & Org2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200">
          {/* Org 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Organization 1 (Org1MSP)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Port: 7051</span>
            </div>

            <div
              onClick={() => setSelectedComponent(FABRIC_COMPONENTS[1])}
              className={`cursor-pointer p-4 rounded-xl border transition-all shadow-sm ${
                isComponentActive("peer0-org1")
                  ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-300"
                  : "bg-white border-slate-200 hover:border-blue-400 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">peer0.org1.example.com</span>
                <span className="text-[10px] text-blue-700 font-mono font-bold">
                  Endorsing &amp; Committing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Simulates chaincode, generates Read/Write sets with cryptographic signature, and validates blocks.
              </p>
            </div>
          </div>

          {/* Org 2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-900">Organization 2 (Org2MSP)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Port: 9051</span>
            </div>

            <div
              onClick={() => setSelectedComponent(FABRIC_COMPONENTS[2])}
              className={`cursor-pointer p-4 rounded-xl border transition-all shadow-sm ${
                isComponentActive("peer0-org2")
                  ? "bg-teal-50/90 border-teal-500 ring-2 ring-teal-300"
                  : "bg-white border-slate-200 hover:border-teal-400 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">peer0.org2.example.com</span>
                <span className="text-[10px] text-teal-700 font-mono font-bold">
                  Endorsing &amp; Committing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Validates endorsement policy AND(&apos;Org1MSP.peer&apos;, &apos;Org2MSP.peer&apos;) and commits block state.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Ledger Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedComponent(FABRIC_COMPONENTS[6])}
            className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-sm ${
              isComponentActive("world-state")
                ? "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300"
                : "bg-slate-50 border-slate-200 hover:border-emerald-400 opacity-70"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                World State (StateDB — LevelDB / CouchDB)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Stores latest values of keys (e.g. asset1.owner=&apos;Bob&apos;). Mutated only after successful MVCC and endorsement policy checks.
            </p>
          </div>

          <div
            onClick={() => setSelectedComponent(FABRIC_COMPONENTS[7])}
            className={`cursor-pointer p-4 rounded-2xl border transition-all shadow-sm ${
              isComponentActive("blockchain-log")
                ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-300"
                : "bg-slate-50 border-slate-200 hover:border-blue-400 opacity-70"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">
                Blockchain Append Log (Channel Ledger)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Append-only sequential file store containing every valid and invalid transaction sequenced by the ordering service.
            </p>
          </div>
        </div>

        {/* Floating Animated Packets in Transit Badge */}
        {packetsInTransit.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              Payload in Transit across Channel:
            </span>
            {packetsInTransit.map((pkt, i) => (
              <span
                key={i}
                style={{ backgroundColor: pkt.color }}
                className="px-2.5 py-0.5 rounded-md text-white font-mono font-bold text-[11px] shadow-sm"
              >
                {pkt.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Active Step Walkthrough Detail Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
              {currentStep.stepNumber}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {currentStep.title}
            </h4>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600">
            Phase: <strong className="text-blue-700">{currentStep.phase}</strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {currentStep.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1 font-bold uppercase tracking-wider">
              Technical Execution:
            </span>
            <p className="text-xs font-mono text-slate-800 leading-relaxed">
              {currentStep.technicalDetail}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1 font-bold uppercase tracking-wider">
              Cryptographic Payload:
            </span>
            <p className="text-xs font-mono text-blue-900 truncate leading-relaxed">
              {currentStep.payloadSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Component Inspector Modal/Card */}
      {selectedComponent && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm">
                Component: {selectedComponent.name}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                MSP: {selectedComponent.organization}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{selectedComponent.description}</p>
            {selectedComponent.ports && (
              <span className="text-[11px] font-mono text-slate-500 block mt-1">
                Listening gRPC Ports: {selectedComponent.ports.join(", ")}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
