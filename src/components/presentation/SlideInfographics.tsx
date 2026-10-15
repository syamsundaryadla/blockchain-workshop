"use client";

import React from "react";
import {
  ShieldCheck,
  Key,
  Lock,
  ArrowRight,
  Database,
  Layers,
  Server,
  Share2,
  Cpu,
  CheckCircle2,
  XCircle,
  FileCode,
  HardDrive,
  RefreshCw,
  Zap,
} from "lucide-react";

interface InfographicProps {
  type: string;
}

export function SlideInfographic({ type }: InfographicProps) {
  switch (type) {
    case "centralized-vs-decentralized":
      return <CentralizedVsDecentralizedInfographic />;
    case "sha256-pipeline":
      return <Sha256PipelineInfographic />;
    case "block-anatomy":
      return <BlockAnatomyInfographic />;
    case "transaction-lifecycle":
      return <TransactionLifecycleInfographic />;
    case "consensus-comparison":
      return <ConsensusComparisonInfographic />;
    case "docker-architecture":
      return <DockerArchitectureInfographic />;
    case "fabric-eov-flow":
      return <FabricEovInfographic />;
    case "state-vs-ledger":
      return <StateVsLedgerInfographic />;
    default:
      return null;
  }
}

// 1. Centralized Authority vs. Decentralized P2P Mesh
function CentralizedVsDecentralizedInfographic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {/* Centralized Network */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-mono font-bold text-red-700 uppercase">
            Centralized Model (Client-Server)
          </span>
          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
            Single Point of Failure
          </span>
        </div>

        <div className="py-4 flex items-center justify-center">
          <svg className="w-48 h-32" viewBox="0 0 200 130">
            {/* Center Hub */}
            <circle cx="100" cy="65" r="22" fill="#DC2626" opacity="0.15" />
            <circle cx="100" cy="65" r="16" fill="#DC2626" />
            <text x="100" y="69" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
              HUB
            </text>

            {/* Satellite Nodes */}
            {[
              { x: 30, y: 30, label: "Client 1" },
              { x: 170, y: 30, label: "Client 2" },
              { x: 30, y: 100, label: "Client 3" },
              { x: 170, y: 100, label: "Client 4" },
            ].map((node, i) => (
              <g key={i}>
                <line
                  x1="100"
                  y1="65"
                  x2={node.x}
                  y2={node.y}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <circle cx={node.x} cy={node.y} r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
                <circle cx={node.x} cy={node.y} r="4" fill="#0F172A" />
              </g>
            ))}
          </svg>
        </div>

        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-900 leading-snug">
          <strong>Vulnerability:</strong> If the central database is compromised, attacked, or corrupted, all 4 clients lose access immediately.
        </div>
      </div>

      {/* Decentralized P2P Mesh */}
      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-blue-200">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase">
            Decentralized Mesh (Blockchain)
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            Fault Tolerant
          </span>
        </div>

        <div className="py-4 flex items-center justify-center">
          <svg className="w-48 h-32" viewBox="0 0 200 130">
            {/* Peer to Peer Connections */}
            <line x1="45" y1="35" x2="155" y2="35" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="45" y2="95" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="155" y1="35" x2="155" y2="95" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="45" y1="95" x2="155" y2="95" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="155" y2="95" stroke="#0D9488" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="155" y1="35" x2="45" y2="95" stroke="#0D9488" strokeWidth="1" strokeDasharray="3 3" />

            {/* Peer Nodes */}
            {[
              { x: 45, y: 35, label: "Peer A" },
              { x: 155, y: 35, label: "Peer B" },
              { x: 45, y: 95, label: "Peer C" },
              { x: 155, y: 95, label: "Peer D" },
            ].map((node, i) => (
              <g key={i}>
                <circle cx={node.x} cy={node.y} r="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                <circle cx={node.x} cy={node.y} r="5" fill="#2563EB" />
                <text x={node.x} y={node.y > 65 ? node.y + 22 : node.y - 18} textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="bold">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="p-2.5 rounded-lg bg-blue-100/60 border border-blue-200 text-[11px] text-blue-900 leading-snug">
          <strong>Resilience:</strong> If Peer A or B crashes, Peers C and D continue validating and replicating transactions seamlessly without data loss.
        </div>
      </div>
    </div>
  );
}

// 2. SHA-256 Mathematical Transformation Pipeline
function Sha256PipelineInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          SHA-256 Algorithmic Pipeline Architecture
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          FIPS 180-4 Standard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center">
        {/* Step 1 */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Step 1</span>
          <span className="text-xs font-bold text-slate-900 block">Arbitrary Input</span>
          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded block">
            &quot;Hello&quot; (40 bits)
          </span>
          <span className="text-[10px] text-slate-500 block">Any byte length</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 mx-auto hidden sm:block" />

        {/* Step 2 */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Step 2</span>
          <span className="text-xs font-bold text-slate-900 block">512-bit Padding</span>
          <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded block">
            1-bit + 0s + len
          </span>
          <span className="text-[10px] text-slate-500 block">Strict boundary</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 mx-auto hidden sm:block" />

        {/* Step 3 */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Step 3</span>
          <span className="text-xs font-bold text-slate-900 block">64-Round Loop</span>
          <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-1 py-0.5 rounded block">
            Registers A..H
          </span>
          <span className="text-[10px] text-slate-500 block">Bitwise Ch &amp; Maj</span>
        </div>
      </div>

      {/* Output Hash Digest */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-bold text-blue-950">
            Fixed Cryptographic Output:
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-blue-800 bg-white px-2.5 py-1 rounded border border-blue-300 break-all text-center">
          185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
        </span>
        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
          64 Hex / 256 Bits
        </span>
      </div>
    </div>
  );
}

// 3. Block Anatomy & Hash Linking Infographic
function BlockAnatomyInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Cryptographic Chain Linking Anatomy
        </span>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          Immutable Back-Pointers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Block N-1 */}
        <div className="p-3 rounded-lg bg-white border border-slate-300 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="text-xs font-bold text-slate-900">Block #1</span>
            <span className="text-[10px] font-mono text-slate-500">Nonce: 84920</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="text-slate-500">Prev: 0000000000000000...</div>
            <div className="text-blue-700 font-bold bg-blue-50 p-1 rounded">
              Hash: 0000ab94c7...
            </div>
          </div>
          <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
            Tx: Alice -&gt; Bob (2.5 BTC)
          </div>
        </div>

        {/* Block N */}
        <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-300 space-y-2">
          <div className="flex items-center justify-between border-b border-blue-100 pb-1">
            <span className="text-xs font-bold text-blue-950">Block #2</span>
            <span className="text-[10px] font-mono text-blue-700">Nonce: 47193</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="text-blue-800 font-bold bg-white p-1 rounded border border-blue-200 flex items-center justify-between">
              <span>Prev: 0000ab94c7...</span>
              <span className="text-[9px] text-emerald-700 font-bold">LOCKED</span>
            </div>
            <div className="text-teal-700 font-bold bg-teal-50 p-1 rounded">
              Hash: 0000f281e0...
            </div>
          </div>
          <div className="text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-200">
            Tx: Bob -&gt; Charlie (1.0 BTC)
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
        <strong>The Tamper Barrier:</strong> If someone alters Block #1&apos;s transaction from 2.5 to 25.0, Block #1&apos;s hash immediately changes. Block #2&apos;s <code>PrevHash</code> no longer matches, shattering the chain.
      </div>
    </div>
  );
}

// 4. Transaction Lifecycle & Cryptographic Signing Infographic
function TransactionLifecycleInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-blue-600" />
          Public-Key Digital Signature Verification Flow
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          ECDSA secp256k1
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Private Key</span>
          <Key className="w-4 h-4 text-amber-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">Sign Transaction</span>
          <span className="text-[10px] text-slate-500 block">Held strictly in secret</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">2. Mempool</span>
          <Database className="w-4 h-4 text-blue-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">Broadcast to Peers</span>
          <span className="text-[10px] text-slate-500 block">Waiting in buffer</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">3. Peer Nodes</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">Verify with PubKey</span>
          <span className="text-[10px] text-slate-500 block">Math checks without secret</span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">4. Finality</span>
          <CheckCircle2 className="w-4 h-4 text-teal-600 mx-auto" />
          <span className="text-xs font-bold text-slate-900 block">Block Appended</span>
          <span className="text-[10px] text-slate-500 block">State updated on ledger</span>
        </div>
      </div>
    </div>
  );
}

// 5. Consensus Mechanisms Comparison Matrix
function ConsensusComparisonInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          Consensus Trilemma: PoW vs. PoS vs. Raft
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          Agreement Models
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Proof of Work (PoW)</span>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1 rounded">Bitcoin</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Miners race computing trillions of SHA-256 hashes to find a nonce below target difficulty.
          </p>
          <div className="text-[10px] font-semibold text-slate-500 border-t pt-1">
            Energy: High • Security: Censorship Proof
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">Proof of Stake (PoS)</span>
            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1 rounded">Ethereum</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Validators lock collateral tokens (e.g. 32 ETH). A pseudo-random lottery selects block proposers.
          </p>
          <div className="text-[10px] font-semibold text-blue-700 border-t pt-1">
            Energy: 99.9% Less • Slashing for Misbehavior
          </div>
        </div>

        <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-950">Raft Quorum (CFT)</span>
            <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1 rounded">Fabric</span>
          </div>
          <p className="text-[11px] text-teal-900 leading-snug">
            Designated leader orders transactions and replicates log entries across a majority quorum.
          </p>
          <div className="text-[10px] font-semibold text-teal-800 border-t pt-1">
            Throughput: 10,000+ TPS • Crash Fault Tolerant
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Docker Container Isolation Architecture
function DockerArchitectureInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-teal-800 uppercase flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-teal-600" />
          Container Virtualization vs. Heavy Virtual Machines
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          Linux Namespace Isolation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-blue-900 block">Peer 0 (Org1)</span>
          <span className="text-[10px] font-mono text-slate-500 block">Port 7051</span>
          <span className="text-[11px] text-slate-600 block bg-slate-50 p-1 rounded">
            Holds Ledger &amp; Endorsement
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-teal-900 block">Orderer Node</span>
          <span className="text-[10px] font-mono text-slate-500 block">Port 7050</span>
          <span className="text-[11px] text-slate-600 block bg-slate-50 p-1 rounded">
            Raft Consensus Batches
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-purple-900 block">Chaincode Docker</span>
          <span className="text-[10px] font-mono text-slate-500 block">Port 9999</span>
          <span className="text-[11px] text-slate-600 block bg-slate-50 p-1 rounded">
            JavaScript Execution Env
          </span>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between text-xs text-slate-700">
        <span className="font-semibold">Shared Host Linux Kernel:</span>
        <span className="font-mono text-[11px] text-blue-700 font-bold">
          Docker Bridge Network: <code>fabric_test (172.20.0.0/16)</code>
        </span>
      </div>
    </div>
  );
}

// 7. Hyperledger Fabric Execute-Order-Validate (EOV) Flow
function FabricEovInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          Execute-Order-Validate (EOV) 3-Phase Enterprise Pipeline
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          Determinism Guarantee
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-lg bg-white border border-blue-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block">
            Phase 1: Execute
          </span>
          <span className="text-xs font-bold text-slate-900 block">Endorsement Simulation</span>
          <p className="text-[11px] text-slate-600 leading-snug">
            Client sends proposal to Endorsing Peers. Peers run chaincode in sandbox, generate Read/Write set, sign endorsements.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-white border border-teal-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-teal-700 uppercase block">
            Phase 2: Order
          </span>
          <span className="text-xs font-bold text-slate-900 block">Raft Batch Ordering</span>
          <p className="text-[11px] text-slate-600 leading-snug">
            Orderer receives endorsed transactions, establishes strict chronological sequence, packages into blocks.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-white border border-emerald-200 space-y-1">
          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">
            Phase 3: Validate
          </span>
          <span className="text-xs font-bold text-slate-900 block">MVCC Check &amp; Commit</span>
          <p className="text-[11px] text-slate-600 leading-snug">
            Committer peers check endorsement policies and MVCC read-conflicts, then commit state to CouchDB StateDB.
          </p>
        </div>
      </div>
    </div>
  );
}

// 8. World State DB vs. Blockchain Append Log
function StateVsLedgerInfographic() {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <span className="text-xs font-mono font-bold text-blue-800 uppercase flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          The Dual-Ledger Architecture: World State vs. Block History
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          Hyperledger Fabric Ledger
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">World State DB (CouchDB)</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Represents the <strong>CURRENT</strong> value of all keys. Fast key-value index query via <code>getState(&apos;msg&apos;)</code>.
          </p>
          <div className="font-mono text-[11px] bg-blue-50 p-1.5 rounded text-blue-900 font-semibold">
            Key: &quot;msg&quot; -&gt; Value: &quot;Hello Blockchain!&quot;
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-900">Blockchain Log (File Storage)</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Immutable append-only record of <strong>ALL historical state transitions</strong> from Genesis Block to present.
          </p>
          <div className="font-mono text-[11px] bg-teal-50 p-1.5 rounded text-teal-900 font-semibold">
            Block #1 (Init) -&gt; Block #2 (Update) -&gt; Block #3
          </div>
        </div>
      </div>
    </div>
  );
}
