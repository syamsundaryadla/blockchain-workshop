# Codebase Graph — BLOCKCHAIN LAB

## Overview
Interactive Blockchain Workshop Platform built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lucide React. Designed for classroom projectors with a clean high-contrast light theme (White background, Dark Navy headings, Royal Blue primary, Teal accents, Light Gray borders). Integrated continuous presentation flow with 50 focused slides following the pedagogical sequence: Concept Explanation → Visual Animation → Interactive Simulation → Key Takeaway → Next Topic.

## Directory Structure
- `src/app/` — Next.js App Router pages:
  - `page.tsx` — Direct continuous presentation entry point (`SlideViewer`) with query param support (`?slide=N`)
  - `presentation/page.tsx` — Presentation route
  - `simulations/` — Standalone Simulation directory and individual full-page workbench pages:
    - `page.tsx` — All-labs interactive directory hub
    - `hasher/page.tsx` — Standalone SHA-256 Hasher & Avalanche Workbench
    - `blockchain/page.tsx` — Standalone Blockchain Builder & Tamper Isolation
    - `networks/page.tsx` — Standalone P2P Mesh & Fault Tolerance Simulator
    - `transactions/page.tsx` — Standalone Transaction Lifecycle Simulator
    - `mining/page.tsx` — Standalone Consensus Engine (PoW, PoS, Raft)
    - `docker/page.tsx` — Standalone Docker Isolation & Linux Terminal
    - `fabric/page.tsx` — Standalone Hyperledger Fabric EOV Architecture Explorer
  - `mini-project/page.tsx` — Standalone "Hello Blockchain" Smart Contract Lab
- `src/components/`
  - `layout/SimulationPageLayout.tsx` — Unified standalone lab page wrapper with back-to-slide navigation
  - `presentation/`
    - `SlideViewer.tsx` — Fixed 16:9 presentation stage, dedicated comparison/infographic/code/quiz templates, and slide thumbnail drawer
    - `SlideInfographics.tsx` — Classroom-optimized SVG/CSS technical diagrams (Centralized vs Decentralized, SHA-256 pipeline, Block anatomy, ECDSA signing, Consensus trilemma, Docker cgroups, Fabric EOV, StateDB vs Block Log)
  - `simulations/`
    - `Sha256HasherSim.tsx` — Live Web Crypto SHA-256 hasher and avalanche effect demo
    - `BlockchainSim.tsx` — Interactive blockchain builder with block tampering and broken link cascade
    - `NetworkTopologySim.tsx` — Centralized vs. Decentralized mesh topology simulator with node kill and packet routing
    - `TransactionSim.tsx` — Public transaction lifecycle simulator (signing, mempool, propagation, confirmation)
    - `MiningSim.tsx` — Proof of work non-blocking mining simulator with difficulty targets and hashrate metrics
    - `FabricExplorerSim.tsx` — Hyperledger Fabric 8-step lifecycle simulator (Endorsement, Raft Ordering, MVCC validation, StateDB commit)
    - `DockerArchitectureSim.tsx` — Linux host container visualizer and interactive terminal
    - `AssetDemoSim.tsx` — Legacy asset-transfer-basic interactive mini-project
    - `HelloBlockchainSim.tsx` — "Hello Blockchain: Store, Retrieve, and Update a Message" interactive mini-project with JavaScript chaincode, StateDB inspector, block ledger append, and Ubuntu Docker CLI tabs
- `src/lib/`
  - `crypto.ts` — Web Crypto SHA-256 helper
  - `blockchain-engine.ts` — Educational blockchain data structure, validation, and tampering logic
  - `fabric-engine.ts` — Hyperledger Fabric component and lifecycle step definitions
  - `utils.ts` — Styling helpers, string formatters, and clipboard utilities
- `src/content/`
  - `modules.ts` — 6 Workshop Modules metadata and descriptions (including Hello Blockchain)
  - `slides.ts` — 50 pedagogical slides with speaker notes, code snippets, comparisons, and embedded simulation mappings
  - `quizzes.ts` — Knowledge check interactive quizzes with explanations

## Data Models & Schema
- `Block`: index, timestamp, transactions, previousHash, hash, nonce, difficulty, isTampered
- `Transaction`: id, sender, recipient, amount, timestamp, signature, status
- `Account`: id, name, address, balance, initialBalance
- `FabricAsset`: ID, Color, Size, Owner, AppraisedValue
- `FabricHistoryRecord`: txId, timestamp, isDelete, value, action
- `Slide`: id, moduleId, slideNumber, title, subtitle, category, content, simulationType, infographicType, quiz, speakerNotes

## Change Log
- 2026-10-15: Resolved slide comparison layout bug, eliminated empty white voids, added rich infographics, and enabled standalone lab pages:
  - Fixed Slide 3 and comparison slides: Created dedicated full-width 2-column comparative template spanning the 16:9 canvas with balanced cards and architectural tradeoff summaries.
  - Created `SlideInfographics.tsx` containing vector diagrams for Centralized vs Mesh, SHA-256 algorithmic pipeline, Block hash linking anatomy, ECDSA verification, Consensus trilemma, Docker cgroups, Fabric EOV lifecycle, and StateDB vs Block history.
  - Enabled standalone simulation routes (`/simulations/hasher`, `/simulations/blockchain`, `/simulations/networks`, `/simulations/transactions`, `/simulations/mining`, `/simulations/docker`, `/simulations/fabric`, `/mini-project`) with `SimulationPageLayout` linking directly back to the active slide.
  - Built Simulations Hub (`/simulations`) cataloging all 8 workbenches.
  - Refactored `SlideViewer.tsx` to maintain a rock-solid, fixed 16:9 stage geometry with slide thumbnail navigator (`M`/`G`) and `Open in Dedicated Page` buttons.
- 2026-10-14: Upgraded Mini Project (Module 6) from complex Asset Management to "Hello Blockchain: Store, Retrieve, and Update a Message":
  - Created `HelloBlockchainSim.tsx` featuring store, retrieve, and update operations using Fabric `putState`/`getState`, live StateDB vs. Block Ledger sync, JavaScript chaincode preview (`InitLedger`, `ReadMessage`, `UpdateMessage`), and Docker Ubuntu CLI execution simulator.
  - Updated slides 44–48 and Module 6 syllabus to teach the Hello Blockchain lifecycle.
  - Added slide 21 multi-consensus simulator for PoW, PoS, and Raft comparison.
  - Fixed JSX syntax in `SlideViewer.tsx` and validated static build (13/13 pages generated cleanly).
- 2026-10-14: Added `vercel.json` with `"framework": "nextjs"` preset and added `public/` directory with `robots.txt` and `favicon.svg` to resolve Vercel deployment error where Vercel defaulted to looking for a static `public` output directory.
- 2026-10-14: Enhanced visual simulations and data flow animations across all 8 workshop components.
- 2026-10-14: Redesigned presentation UI with clean projector-friendly light theme and integrated continuous presentation flow.
- 2026-10-14: Initialized repository structure and architecture graph.

