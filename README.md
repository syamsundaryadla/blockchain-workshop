# BLOCKCHAIN LAB
### Interactive Blockchain Workshop Experience

> **Understand. Simulate. Build.**

A production-quality interactive presentation and simulation platform designed for conducting high-impact blockchain workshops for undergraduate engineering students.

---

## Key Features

### 1. Direct Continuous Presentation Flow
- **Pedagogical Sequence:**
  $$\text{Concept Explanation} \longrightarrow \text{Visual Animation} \longrightarrow \text{Interactive Simulation} \longrightarrow \text{Key Takeaway} \longrightarrow \text{Next Topic}$$
- No switching tabs, external links, or separate simulation portals.
- 50 focused, projector-optimized slides across 6 comprehensive workshop modules.

### 2. Clean, Projector-Friendly Visual Design
- **Background:** Crisp White (`#FFFFFF`)
- **Secondary Surfaces:** Soft Gray (`#F8FAFC`)
- **Headings:** Dark Navy (`#0F172A`)
- **Primary Accents:** Royal Blue (`#2563EB`)
- **Secondary Accents:** Teal (`#0D9488`)
- **Body Text:** High-Contrast Slate (`#334155`)
- **Borders:** Subtle Light Gray (`#CBD5E1`)
- **Typography:** Space Grotesk (headings), Inter (body), JetBrains Mono (code & hashes).
- **Zero Emojis:** 100% clean vector icons via Lucide React.
- **16:9 Aspect Ratio Optimization:** Formatted with generous spacing and large font scales for classroom projectors.

### 3. Integrated Interactive Simulations
1. **Live SHA-256 Cryptographic Hasher (`Sha256HasherSim`)**: Web Crypto API hashing with side-by-side Avalanche Effect comparison.
2. **Centralized vs. Decentralized Network Topology (`NetworkTopologySim`)**: Live SVG mesh routing, central server failure simulation (SPOF), and packet delivery statistics.
3. **Blockchain Builder & Tamper Detection (`BlockchainSim`)**: Mine linked blocks with SHA-256, edit historical amounts, and witness broken cryptographic link cascades.
4. **Public Transaction Lifecycle (`TransactionSim`)**: Digital ECDSA signing, mempool queuing, peer propagation, balance checks, and block inclusion.
5. **Proof of Work (PoW) Mining Simulator (`MiningSim`)**: Non-blocking asynchronous mining loop, adjustable difficulty (1-4 zeros), and real-time hashrate metrics.
6. **Hyperledger Fabric 8-Step Lifecycle Explorer (`FabricExplorerSim`)**: Step-by-step interactive consortium architecture walkthrough (Endorsement, Raft Ordering, MVCC validation, StateDB commit).
7. **Docker Architecture & Terminal Walkthrough (`DockerArchitectureSim`)**: Linux host container visualizer and interactive CLI with copyable test-network commands.
8. **Hands-on Mini-Project Asset Management (`AssetDemoSim`)**: Hyperledger Fabric `asset-transfer-basic` implementation (Create, Read, Update, Transfer, and World State StateDB JSON inspector).

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Right Arrow` / `Space` | Advance to Next Slide |
| `Left Arrow` | Return to Previous Slide |
| `F` | Toggle Fullscreen Mode |
| `N` | Toggle Presenter Speaker Notes Drawer |
| `M` | Open Workshop Module Navigator |
| `?` | Open Keyboard Shortcuts Reference |
| `Escape` | Close Open Modals / Exit Fullscreen |

---

## Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### Installation
```bash
git clone <repository-url>
cd Blockchain
npm install
```

### Running Locally (Development)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm start
```

---

## Workshop Curriculum (6 Modules)

1. **Module 1: Blockchain Fundamentals (Slides 1–13)**
   - Double-spending dilemma, centralized intermediaries, traditional DBs vs. blockchains.
   - SHA-256 cryptographic hashing & live simulation.
   - Centralized vs. decentralized network topologies & simulation.
   - Anatomy of a block, chaining mechanism, and tamper detection simulation.
   - Module 1 Knowledge Check.

2. **Module 2: Blockchain Architecture & Concepts (Slides 14–24)**
   - Network nodes, public vs. private vs. permissioned models.
   - Public transaction lifecycle & live simulation.
   - Distributed state synchronization.
   - Consensus mechanisms, Byzantine Generals Problem, Proof of Work mining & simulation.
   - Module 2 Knowledge Check.

3. **Module 3: Introduction to Hyperledger Fabric (Slides 25–32)**
   - Why enterprise blockchain? Consortium governance and confidentiality.
   - Organizations, X.509 certificates, MSP (Membership Service Providers).
   - Peer roles (Endorsing vs. Committing) & Raft ordering service.
   - Channels, World State (StateDB CouchDB/LevelDB) vs. Blockchain Log.
   - The 8-Step Execute-Order-Validate transaction lifecycle & simulation.
   - Module 3 Knowledge Check.

4. **Module 4: Ubuntu, Docker & Network Setup (Slides 33–37)**
   - Why Linux/Ubuntu for distributed systems.
   - Docker container virtualization & bridge networking.
   - Fabric test-network container architecture & interactive terminal simulation.
   - Containerized multi-party consortium security.
   - Module 4 Knowledge Check.

5. **Module 5: Smart Contract Development (Slides 38–43)**
   - Traditional backend vs. deterministic chaincode.
   - Fabric Contract API in JavaScript.
   - Ledger state operations: `ctx.stub.putState` & `getState`.
   - Asset transfer logic & MVCC concurrency protection.
   - Chaincode deployment lifecycle: Package, Install, Approve, Commit.
   - Module 5 Knowledge Check.

6. **Module 6: Hands-on Mini Project (Slides 44–50)**
   - Project overview: Blockchain-based Asset Management System.
   - Asset schema: ID, Color, Size, Owner, AppraisedValue.
   - Live interactive asset management demonstration (Create, Read, Update, Transfer).
   - World State key-value store vs. historical block log.
   - Terminal commands with `peer chaincode invoke` & `query`.
   - Module 6 Knowledge Check & workshop conclusion.
