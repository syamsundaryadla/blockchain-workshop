import React from "react";
import Link from "next/link";
import {
  Hash,
  Share2,
  Box,
  Send,
  Cpu,
  Layers,
  Server,
  Code2,
  ArrowRight,
  Presentation,
  CheckCircle2,
} from "lucide-react";

const LABS = [
  {
    id: "hasher",
    title: "1. SHA-256 Hasher & Avalanche Effect",
    module: "Module 1 • Fundamentals",
    description:
      "Inspect the 5-stage cryptographic compression pipeline and test live bitwise avalanche dispersion.",
    href: "/simulations/hasher",
    slideNumber: 5,
    icon: Hash,
    color: "blue",
  },
  {
    id: "networks",
    title: "2. Network Topology & Mesh Routing",
    module: "Module 1 • Fundamentals",
    description:
      "Simulate single points of failure in centralized systems vs. dynamic shortest-path rerouting in decentralized P2P meshes.",
    href: "/simulations/networks",
    slideNumber: 8,
    icon: Share2,
    color: "teal",
  },
  {
    id: "blockchain",
    title: "3. Block Anatomy & Tamper Detection",
    module: "Module 2 • Architecture",
    description:
      "Assemble cryptographically chained blocks, simulate deliberate byte tampering, and observe hash cascade fractures.",
    href: "/simulations/blockchain",
    slideNumber: 11,
    icon: Box,
    color: "blue",
  },
  {
    id: "transactions",
    title: "4. Public Transaction Lifecycle",
    module: "Module 2 • Architecture",
    description:
      "Step through ECDSA wallet signature generation, mempool validation, gossip protocol broadcast, and ledger confirmation.",
    href: "/simulations/transactions",
    slideNumber: 17,
    icon: Send,
    color: "teal",
  },
  {
    id: "mining",
    title: "5. Consensus Engine Comparison",
    module: "Module 3 • Consensus",
    description:
      "Compare Proof of Work (PoW hashrate race), Proof of Stake (PoS validator voting), and Enterprise Raft leader replication.",
    href: "/simulations/mining",
    slideNumber: 21,
    icon: Cpu,
    color: "blue",
  },
  {
    id: "docker",
    title: "6. Docker Container Isolation",
    module: "Module 4 • Docker",
    description:
      "Explore Linux kernel cgroups, isolated bridge networks, peer/orderer containers, and execute live CLI commands.",
    href: "/simulations/docker",
    slideNumber: 32,
    icon: Server,
    color: "teal",
  },
  {
    id: "fabric",
    title: "7. Hyperledger Fabric Architecture",
    module: "Module 5 • Enterprise Fabric",
    description:
      "Trace the 8-step Execute-Order-Validate lifecycle across Client, Endorsers, Raft Orderers, and Committer nodes.",
    href: "/simulations/fabric",
    slideNumber: 38,
    icon: Layers,
    color: "blue",
  },
  {
    id: "mini-project",
    title: "8. Mini Project: Hello Blockchain",
    module: "Module 6 • Mini Project",
    description:
      "Interactive smart contract store, retrieve, and update operations with live StateDB CouchDB inspector and ledger blocks.",
    href: "/mini-project",
    slideNumber: 47,
    icon: Code2,
    color: "teal",
  },
];

export default function SimulationsHubPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-display">
              BLOCKCHAIN LAB • Interactive Simulations Directory
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              8 Standalone Classroom Workbenches for Hands-on Technical Instruction
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Presentation className="w-4 h-4" />
            <span>Open Presentation Deck</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            Classroom Simulation Workbenches
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Each simulation can be run directly inside the 16:9 presentation deck, or launched here as a dedicated, full-screen standalone workbench for deep-dive lab exercises and instructor demos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {LABS.map((lab) => {
            const IconComponent = lab.icon;
            return (
              <div
                key={lab.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {lab.module}
                    </span>
                    <Link
                      href={`/?slide=${lab.slideNumber}`}
                      className="text-xs text-slate-500 hover:text-blue-600 font-semibold"
                    >
                      Slide {lab.slideNumber}
                    </Link>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-blue-600 flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {lab.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {lab.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/?slide=${lab.slideNumber}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View in Slide {lab.slideNumber}
                  </Link>

                  <Link
                    href={lab.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors"
                  >
                    <span>Launch Standalone Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
