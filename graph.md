# Codebase Graph — BLOCKCHAIN LAB

## Overview
Interactive Blockchain Workshop Platform built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lucide React. Designed for classroom projectors with a clean high-contrast light theme (White background, Dark Navy headings, Royal Blue primary, Teal accents, Light Gray borders). Integrated continuous presentation flow with 50 focused slides following the pedagogical sequence: Concept Explanation → Visual Animation → Interactive Simulation → Key Takeaway → Next Topic.

## Directory Structure
- `src/app/` — Next.js App Router pages:
  - `page.tsx` — Direct continuous presentation entry point (`SlideViewer`)
  - `presentation/page.tsx` — Direct presentation route
  - `simulations/` — Redirects directly to continuous presentation
  - `mini-project/` — Redirects directly to continuous presentation
- `src/components/`
  - `presentation/SlideViewer.tsx` — Fullscreen presenter interface with keyboard shortcuts, speaker notes, module navigator, and embedded simulation runner
  - `simulations/`
    - `Sha256HasherSim.tsx` — Live Web Crypto SHA-256 hasher and avalanche effect demo
    - `BlockchainSim.tsx` — Interactive blockchain builder with block tampering and broken link cascade
    - `NetworkTopologySim.tsx` — Centralized vs. Decentralized mesh topology simulator with node kill and packet routing
    - `TransactionSim.tsx` — Public transaction lifecycle simulator (signing, mempool, propagation, confirmation)
    - `MiningSim.tsx` — Proof of work non-blocking mining simulator with difficulty targets and hashrate metrics
    - `FabricExplorerSim.tsx` — Hyperledger Fabric 8-step lifecycle simulator (Endorsement, Raft Ordering, MVCC validation, StateDB commit)
    - `DockerArchitectureSim.tsx` — Linux host container visualizer and interactive terminal
    - `AssetDemoSim.tsx` — Asset-transfer-basic interactive mini-project with CRUD, transfer, history, and World State inspector
- `src/lib/`
  - `crypto.ts` — Web Crypto SHA-256 helper
  - `blockchain-engine.ts` — Educational blockchain data structure, validation, and tampering logic
  - `fabric-engine.ts` — Hyperledger Fabric component and lifecycle step definitions
  - `utils.ts` — Styling helpers, string formatters, and clipboard utilities
- `src/content/`
  - `modules.ts` — 6 Workshop Modules metadata and descriptions
  - `slides.ts` — 50 pedagogical slides with speaker notes, code snippets, comparisons, and embedded simulation mappings
  - `quizzes.ts` — Knowledge check interactive quizzes with explanations

## Data Models & Schema
- `Block`: index, timestamp, transactions, previousHash, hash, nonce, difficulty, isTampered
- `Transaction`: id, sender, recipient, amount, timestamp, signature, status
- `Account`: id, name, address, balance, initialBalance
- `FabricAsset`: ID, Color, Size, Owner, AppraisedValue
- `FabricHistoryRecord`: txId, timestamp, isDelete, value, action
- `Slide`: id, moduleId, slideNumber, title, subtitle, category, content, simulationType, quiz, speakerNotes

## Change Log
- 2026-10-14: Added `vercel.json` with `"framework": "nextjs"` preset and added `public/` directory with `robots.txt` and `favicon.svg` to resolve Vercel deployment error where Vercel defaulted to looking for a static `public` output directory.
- 2026-10-14: Enhanced visual simulations and data flow animations across all 8 workshop components:
  - `Sha256HasherSim.tsx`: Added 5-stage animated hashing process visualizer (ASCII encoding -> 512-bit padding -> message schedule -> 64 compression rounds with working registers A-H -> 256-bit digest) alongside live interactive avalanche hasher.
  - `BlockchainSim.tsx`: Added step-by-step block creation & cryptographic linking flow (mempool ingestion -> header assembly -> hashing -> link locking -> ledger append) alongside live tamper cascade detection with broken link isolation and raw block schema inspector.
  - `NetworkTopologySim.tsx`: Added continuous auto-streaming packet animation, dynamic BFS shortest-path re-routing around failed peers, interactive node kill/revive switches, and detailed peer node telemetry inspector (IP, region, block height, mempool, peer count).
  - `TransactionSim.tsx`: Built visual 5-stage transaction lifecycle pipeline (ECDSA signature authorization -> mempool buffering -> P2P gossip peer verification -> candidate block inclusion -> ledger state finality) with step-by-step playback controls and receipt inspector.
  - `MiningSim.tsx`: Expanded into comprehensive multi-mechanism consensus simulator supporting Proof of Work (PoW mining race with non-blocking nonce search), Proof of Stake (PoS validator election & attestation voting), and Enterprise Raft Consensus (CFT leader-follower quorum replication).
  - `FabricExplorerSim.tsx`: Added animated floating channel packets in transit, active component glow with inactive component dimming, and step-by-step Execute-Order-Validate walkthrough.
  - `SlideViewer.tsx`: Optimized presentation code snippets and controls for 16:9 1920x1080 classroom projector visibility with clean light theme (White #FFFFFF, Deep Navy #0F172A, Royal Blue #2563EB, Teal #0D9488) and zero emojis.
- 2026-10-14: Redesigned presentation UI with clean projector-friendly light theme and integrated continuous presentation flow.
- 2026-10-14: Initialized repository structure and architecture graph.

