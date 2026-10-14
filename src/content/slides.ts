import { Slide } from "@/types/presentation";
import { MODULE_QUIZZES } from "./quizzes";

export const PRESENTATION_SLIDES: Slide[] = [
  // ================= MODULE 1: BLOCKCHAIN FUNDAMENTALS =================
  {
    id: "slide-1",
    moduleId: 1,
    slideNumber: 1,
    title: "BLOCKCHAIN LAB",
    subtitle: "Interactive Technical Workshop for Engineers",
    category: "Module 1 • Fundamentals",
    content: {
      lead: "A visual, hands-on deep-dive into cryptographic ledgers, distributed networks, and enterprise blockchain engineering.",
      points: [
        "Demystifying blockchain without unnecessary math or cryptocurrency hype.",
        "Interactive simulations embedded directly into every topic: SHA-256 hashes, network resilience, and block tampering.",
        "Understand real enterprise architecture with Hyperledger Fabric.",
        "Build and test an Asset Management smart contract system hands-on.",
      ],
      quote: "Understand. Simulate. Build.",
    },
    speakerNotes:
      "Welcome students to the workshop. Emphasize that blockchain is fundamentally an architectural pattern for trustless distributed data integrity. Today every concept will be visually demonstrated and simulated live.",
  },
  {
    id: "slide-2",
    moduleId: 1,
    slideNumber: 2,
    title: "Why Was Blockchain Introduced?",
    subtitle: "The Double-Spending Problem and Intermediary Trust",
    category: "Module 1 • Fundamentals",
    content: {
      lead: "In the physical world, cash can only be spent once. In digital environments, binary data can be copied infinitely without degradation.",
      points: [
        "The Double-Spending Problem: How do two parties exchange digital value without trusting a central authority to prevent duplication?",
        "Traditional Solution: Centralized intermediaries (banks, clearing houses, cloud databases). They act as single points of trust, failure, and rent-seeking.",
        "The Blockchain Breakthrough (2008): Nakamoto combined cryptographic hashing, peer-to-peer networks, and consensus rules into a distributed timestamped ledger.",
      ],
    },
    speakerNotes:
      "Use the digital photo analogy: if I email you a photo, we both have a copy. If I email you a $10 bill, that cannot be allowed. Explain how blockchain solved digital scarcity and agreement among untrusted peers.",
  },
  {
    id: "slide-3",
    moduleId: 1,
    slideNumber: 3,
    title: "Traditional Databases vs. Distributed Blockchains",
    subtitle: "Choosing the Right Architecture for the Problem",
    category: "Module 1 • Fundamentals",
    content: {
      comparison: {
        leftTitle: "Relational / NoSQL Database (PostgreSQL, MongoDB)",
        leftItems: [
          "Single administrative authority (DBA / Cloud Provider).",
          "Full CRUD support: Create, Read, Update, Delete.",
          "High write throughput (millions of ops/sec).",
          "Data can be rewritten or backdated silently by admin.",
          "High trust required in the operating entity.",
        ],
        rightTitle: "Distributed Blockchain Ledger",
        rightItems: [
          "Decentralized multi-party governance; no single master.",
          "Append-only log: data can only be inserted, never deleted.",
          "Cryptographically verifiable audit trail of every state change.",
          "Consensus-driven writes; invalid transactions rejected by peers.",
          "Zero requirement for unilateral trust in any single node.",
        ],
      },
    },
    speakerNotes:
      "Contrast the DBA role: in SQL, 'DELETE FROM users WHERE id=5;' erases history. In blockchain, there is no DELETE. An update is a new transaction appended to the chain. Point out that databases are great for raw speed; blockchains are designed for multi-party trust.",
  },
  {
    id: "slide-4",
    moduleId: 1,
    slideNumber: 4,
    title: "Cryptographic Hashing (SHA-256)",
    subtitle: "The One-Way Mathematical Foundation of Blockchain",
    category: "Module 1 • Fundamentals",
    content: {
      lead: "A cryptographic hash function transforms arbitrary digital data into a fixed-length mathematical fingerprint.",
      points: [
        "Deterministic: Identical input data always produces the exact same 256-bit (64 hex characters) output.",
        "Pre-image Resistance (One-Way): Computationally infeasible to reverse or deduce the input from the hash digest.",
        "Avalanche Effect: Modifying even a single character, bit, or comma completely scrambles the output hash.",
        "Fixed Output Size: Whether hashing 1 letter or an entire encyclopedia, the SHA-256 digest is strictly 64 hex characters.",
      ],
    },
    speakerNotes:
      "Set up the live demonstration on the next slide. Emphasize that SHA-256 is not encryption (there is no secret key to decrypt); it is a one-way mathematical digest.",
  },
  {
    id: "slide-5",
    moduleId: 1,
    slideNumber: 5,
    title: "Interactive Simulation: SHA-256 & Avalanche Effect",
    subtitle: "Observe Live Cryptographic Hashing via Web Crypto API",
    category: "Module 1 • Fundamentals",
    simulationType: "hasher",
    content: {
      lead: "Type in either input box below to observe instant SHA-256 computation. Notice how a single letter change produces an unrecognizable output.",
    },
    speakerNotes:
      "Use the simulation live. Type 'Hello' in Stream A and 'hello' in Stream B. Show how the outputs are completely uncorrelated. Then click the '$50 vs $50.01' button to show financial implications.",
  },
  {
    id: "slide-6",
    moduleId: 1,
    slideNumber: 6,
    title: "Key Takeaway: The Cryptographic Seal",
    subtitle: "Summary of Cryptographic Hashing in Distributed Ledgers",
    category: "Module 1 • Fundamentals",
    content: {
      points: [
        "Hashes serve as tamper-evident seals: any alteration to historical block data invalidates the seal immediately.",
        "Hash digests are computationally cheap to verify (microseconds) but impossible to reverse or spoof.",
        "Next, we explore how peer-to-peer network topologies leverage these seals across independent nodes.",
      ],
      quote: "If the input changes by a single bit, the cryptographic seal shatters.",
    },
    speakerNotes:
      "Reiterate the takeaway before moving into network topology. Ensure students appreciate why SHA-256 is the mathematical bedrock of all modern blockchains.",
  },
  {
    id: "slide-7",
    moduleId: 1,
    slideNumber: 7,
    title: "Centralized vs. Decentralized Networks",
    subtitle: "Architectural Resilience and Failure Domains",
    category: "Module 1 • Fundamentals",
    content: {
      lead: "The topology of a network defines its fault tolerance, resilience, and operational security.",
      points: [
        "Centralized Network: All peripheral nodes communicate exclusively through a single central hub. If the hub fails or is censored, the entire network is paralyzed.",
        "Decentralized Mesh Network: Multiple peer nodes maintain redundant peer-to-peer links. If one or more nodes fail, packets route dynamically through surviving peers.",
        "Tradeoff: Decentralization eliminates single points of failure, but requires consensus algorithms to keep state synchronized across distributed nodes.",
      ],
    },
    speakerNotes:
      "Explain the failure domain. Introduce the simulation on the next slide where students can toggle node failures in real-time.",
  },
  {
    id: "slide-8",
    moduleId: 1,
    slideNumber: 8,
    title: "Interactive Simulation: Network Topology & Resilience",
    subtitle: "Simulate Single-Point-of-Failure vs. Mesh Routing",
    category: "Module 1 • Fundamentals",
    simulationType: "network",
    content: {
      lead: "Experiment with network resilience: click 'Kill Central Server' in Centralized mode, then switch to Decentralized Mesh and disable individual peer nodes.",
    },
    speakerNotes:
      "Demonstrate the kill central server button: show immediate packet dropping. Then switch to Decentralized mode and disable Node 2 or Node 5; send a packet and point out how it successfully reaches the destination via alternate surviving peers.",
  },
  {
    id: "slide-9",
    moduleId: 1,
    slideNumber: 9,
    title: "Key Takeaway: Resilience Through Topology",
    subtitle: "Eliminating Single Points of Failure",
    category: "Module 1 • Fundamentals",
    content: {
      points: [
        "Decentralized mesh networks continue delivering messages even when individual peer nodes go offline.",
        "However, decentralization introduces a new engineering challenge: with no central server, who decides what the true database state is?",
        "Next: We connect cryptographic hashes and blocks together into a tamper-evident chain.",
      ],
      quote: "Decentralization trades administrative simplicity for architectural resilience.",
    },
    speakerNotes:
      "Bridge to the next topic: now that we understand hashes and decentralized peers, how do we chain blocks together?",
  },
  {
    id: "slide-10",
    moduleId: 1,
    slideNumber: 10,
    title: "Anatomy of a Block & Chained Links",
    subtitle: "How Cryptographic Pointers Form an Immutable Ledger",
    category: "Module 1 • Fundamentals",
    content: {
      lead: "A block is a timestamped container of transactions bound together by the hash of the preceding block.",
      points: [
        "Block Header: Contains Block Index, Timestamp, Nonce, Transaction Data, and Previous Hash.",
        "The Chaining Mechanism: Block N explicitly stores Previous Hash = Hash(Block N-1).",
        "The Tamper Cascade: If an attacker alters a transaction in Block #1, Block #1's hash changes completely.",
        "Block #2 still points to Block #1's OLD hash — breaking the cryptographic link and invalidating every subsequent block.",
      ],
      codeSnippet: {
        language: "text",
        code: `Block #0 (Genesis)        Block #1                  Block #2
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Index: 0         │      │ Index: 1         │      │ Index: 2         │
│ PrevHash: 000000 │◄─────│ PrevHash: e4f891 │◄─────│ PrevHash: 78a2c1 │
│ Data: Genesis Tx │      │ Data: Alice->Bob │      │ Data: Bob->Dave  │
│ Hash: e4f891...  │      │ Hash: 78a2c1...  │      │ Hash: 991bf4...  │
└──────────────────┘      └──────────────────┘      └──────────────────┘`,
      },
    },
    speakerNotes:
      "Walk through the diagram. Point out the arrows: each block points backwards to its parent. Show how altering Block 1 causes Block 2's pointer to clash.",
  },
  {
    id: "slide-11",
    moduleId: 1,
    slideNumber: 11,
    title: "Interactive Simulation: Blockchain Builder & Tamper Detection",
    subtitle: "Mine Real Blocks and Simulate Data Tampering",
    category: "Module 1 • Fundamentals",
    simulationType: "blockchain",
    content: {
      lead: "Below is a working blockchain using Web Crypto SHA-256. Add a block, then edit the transaction amount in Block #0 or #1 to watch the chain break.",
    },
    speakerNotes:
      "Demonstrate live: click 'Mine & Add Block'. Then edit the amount in Block 0 from $100 to $9999. Point out the red broken link indicator and the explanation. Then click 'Recalculate Hashes' to explain why local recalculation is not enough in a consensus network.",
  },
  {
    id: "slide-12",
    moduleId: 1,
    slideNumber: 12,
    title: "Key Takeaway: The Cascade of Immutability",
    subtitle: "Mathematical Auditability Across Time",
    category: "Module 1 • Fundamentals",
    content: {
      points: [
        "In a blockchain, historical data cannot be modified silently. Any change immediately breaks the cryptographic pointer of every following block.",
        "Even if an attacker recalculates hashes locally, other honest nodes on the peer network will reject the rogue branch.",
        "Immutability is not magic: it is the mathematical consequence of hashing, linked pointers, and network consensus.",
      ],
      quote: "You cannot change the past without rewriting every moment that followed it.",
    },
    speakerNotes:
      "Emphasize this quote. It summarizes why blockchain history is immutable.",
  },
  {
    id: "slide-13",
    moduleId: 1,
    slideNumber: 13,
    title: "Module 1 Knowledge Check",
    subtitle: "Test Your Understanding of Blockchain Fundamentals",
    category: "Module 1 • Knowledge Check",
    quiz: MODULE_QUIZZES[1],
    content: {
      lead: "Answer the following question based on the concepts and simulations we explored in Module 1.",
    },
    speakerNotes:
      "Have students discuss the options before checking the answer. Reinforce the avalanche effect and broken link cascade.",
  },

  // ================= MODULE 2: ARCHITECTURE & CONCEPTS =================
  {
    id: "slide-14",
    moduleId: 2,
    slideNumber: 14,
    title: "Blockchain Network Nodes & Distributed Ledgers",
    subtitle: "Roles in a Decentralized Infrastructure",
    category: "Module 2 • Architecture",
    content: {
      lead: "A blockchain network operates through nodes running protocol client software that independently validates state transitions.",
      points: [
        "Full Nodes: Store the complete historical block log and independently validate every transaction and block against protocol rules.",
        "Light Clients / SPV: Store only block headers; verify transaction inclusion via Merkle proofs without consuming gigabytes of storage.",
        "Miner / Validator Nodes: Group pending transactions into candidate blocks and propose them using the network's consensus rules.",
        "Gossip Protocol: Nodes broadcast new transactions and verified blocks to connected peers across the peer-to-peer network.",
      ],
    },
    speakerNotes:
      "Explain the sovereign validation rule: full nodes never take another node's word for it; they re-verify every cryptographic signature and balance independently.",
  },
  {
    id: "slide-15",
    moduleId: 2,
    slideNumber: 15,
    title: "Public vs. Private vs. Permissioned Blockchains",
    subtitle: "Access Control, Confidentiality, and Governance",
    category: "Module 2 • Architecture",
    content: {
      comparison: {
        leftTitle: "Public / Permissionless (Bitcoin, Ethereum)",
        leftItems: [
          "Anyone can join, submit transactions, and validate blocks.",
          "Pseudonymous cryptographic public key addresses.",
          "High-cost consensus (PoW / PoS) needed to resist Sybil attacks.",
          "All transactions and contract state are globally visible.",
          "Lower transaction throughput (15-60 TPS on Layer 1).",
        ],
        rightTitle: "Permissioned / Enterprise (Hyperledger Fabric)",
        rightItems: [
          "Access restricted strictly to known, authenticated organizations.",
          "Legal identities certified by Certificate Authorities (X.509 PKI).",
          "Crash Fault Tolerant (Raft) consensus; zero mining or crypto tokens.",
          "Granular privacy: data isolated within private subnet channels.",
          "High transaction throughput (thousands of TPS) with instant finality.",
        ],
      },
    },
    speakerNotes:
      "Highlight why enterprises cannot use public chains for confidential commercial transactions (competitors would see unit costs and customer lists).",
  },
  {
    id: "slide-16",
    moduleId: 2,
    slideNumber: 16,
    title: "The Public Transaction Lifecycle",
    subtitle: "From ECDSA Digital Signature to Confirmed Block",
    category: "Module 2 • Architecture",
    content: {
      lead: "How does a financial transaction move from a user's wallet into an immutable, confirmed block?",
      points: [
        "1. Signature Generation: Sender cryptographically signs transaction payload using their private key (ECDSA).",
        "2. Mempool Broadcast: Transaction is broadcast to nodes and sits in the memory pool of pending unconfirmed transactions.",
        "3. Verification & Balance Check: Peer nodes verify that sender balance >= amount and that the digital signature is authentic.",
        "4. Block Inclusion & Ledger Commit: A validator bundles pending transactions into a new block, propagating it to all peers to update account balances.",
      ],
    },
    speakerNotes:
      "Walk through the 4 stages. Next slide will simulate this entire lifecycle interactively.",
  },
  {
    id: "slide-17",
    moduleId: 2,
    slideNumber: 17,
    title: "Interactive Simulation: Public Transaction Lifecycle",
    subtitle: "Simulate Digital Signing, Mempool, and Balance Updates",
    category: "Module 2 • Architecture",
    simulationType: "transaction",
    content: {
      lead: "Select a sender and recipient, enter an amount, and broadcast a transaction to watch the 4-stage lifecycle and balance updates live.",
    },
    speakerNotes:
      "Broadcast a valid transaction from Alice to Bob ($20). Show the signing, mempool, propagation, and confirmation stages. Then attempt an invalid transaction (e.g. Charlie trying to send $100 with only $25 balance) to demonstrate client-side validation rejection.",
  },
  {
    id: "slide-18",
    moduleId: 2,
    slideNumber: 18,
    title: "Key Takeaway: Distributed State Synchronization",
    subtitle: "Deterministic State Transitions via Signatures",
    category: "Module 2 • Architecture",
    content: {
      points: [
        "Transactions are cryptographically authorized state transitions: `State(t+1) = Apply(State(t), Tx)`.",
        "Balances are not stored as plain numbers in a central file; they are deterministic outputs of verified historical transfers.",
        "Next: How do distributed nodes agree on which candidate block gets appended next? Consensus mechanisms.",
      ],
      quote: "Cryptographic signatures prove authorization; consensus proves chronological order.",
    },
    speakerNotes:
      "Summarize state transitions before introducing consensus algorithms.",
  },
  {
    id: "slide-19",
    moduleId: 2,
    slideNumber: 19,
    title: "Introduction to Consensus Mechanisms",
    subtitle: "Solving the Byzantine Generals Problem Without Central Control",
    category: "Module 2 • Architecture",
    content: {
      lead: "In a network with network latency and potentially dishonest peers, consensus algorithms guarantee that all honest nodes agree on one valid history.",
      points: [
        "The Byzantine Generals Problem: How do distributed parties coordinate actions reliably when some members may be unreliable or malicious?",
        "Liveness & Safety: Liveness ensures valid transactions are eventually processed; Safety ensures all nodes agree on identical state.",
        "Lottery vs. Voting: Public networks use lottery mechanisms (Proof of Work, Proof of Stake); enterprise networks use authenticated voting (Raft, PBFT).",
      ],
    },
    speakerNotes:
      "Explain why simple majority voting fails on open public networks (Sybil attack: one person can spin up 10,000 virtual machines). Proof of Work tied voting power to real-world computational energy.",
  },
  {
    id: "slide-20",
    moduleId: 2,
    slideNumber: 20,
    title: "Proof of Work (PoW) Mining Mechanics",
    subtitle: "The Cryptographic Nonce Puzzle",
    category: "Module 2 • Architecture",
    content: {
      lead: "Proof of Work forces block authors to expend computational energy finding a valid block header hash.",
      points: [
        "Target Difficulty: Protocol dictates that `SHA-256(Block Header + Nonce)` must start with a specific number of leading zeros.",
        "The Nonce (Number Used Once): A numeric 32-bit counter incremented on every trial attempt.",
        "Computational Asymmetry: Finding a valid nonce requires millions of brute-force calculations, but any node can verify the solution in 1 microsecond.",
      ],
      codeSnippet: {
        language: "javascript",
        code: `// Proof of Work Verification Rule:
function isValidProof(headerData, nonce, difficulty) {
  const hash = sha256(\`\${headerData}|\${nonce}\`);
  const targetPrefix = "0".repeat(difficulty);
  return hash.startsWith(targetPrefix); // e.g. "000a4f..."
}`,
      },
    },
    speakerNotes:
      "Explain the asymmetry: hard to solve, instantaneous to verify. Next slide runs this exact mining loop directly in the browser.",
  },
  {
    id: "slide-21",
    moduleId: 2,
    slideNumber: 21,
    title: "Interactive Simulation: Consensus Mechanisms & PoW Mining",
    subtitle: "Simulate Proof of Work, Proof of Stake, and Enterprise Raft Consensus",
    category: "Module 2 • Architecture",
    simulationType: "consensus",
    content: {
      lead: "Explore how distributed networks achieve agreement: test live PoW nonce mining with adjustable difficulty targets, observe PoS validator stake attestation, and simulate enterprise Raft leader-follower log replication.",
    },
    speakerNotes:
      "Demonstrate Proof of Work first on difficulty 2 and 3. Then toggle to Proof of Stake to show how validator staking achieves finality without energy waste. Finally, switch to Enterprise Raft to show how Hyperledger Fabric achieves sub-second deterministic finality.",
  },
  {
    id: "slide-22",
    moduleId: 2,
    slideNumber: 22,
    title: "Key Takeaway: Proof of Work Tradeoffs",
    subtitle: "Security, Energy, and Finality in Public Chains",
    category: "Module 2 • Architecture",
    content: {
      points: [
        "Proof of Work provides robust Sybil resistance in untrusted environments, but consumes high electrical energy.",
        "Finality is probabilistic: transactions require multiple block confirmations to guard against temporary chain reorganizations.",
        "Next: Why enterprise consortia choose deterministic, permissioned consensus like Hyperledger Fabric.",
      ],
      quote: "Proof of Work ties consensus truth to thermodynamic reality.",
    },
    speakerNotes:
      "Set the transition: why can't enterprise businesses use Proof of Work? Because companies have known legal identities and need immediate, deterministic finality.",
  },
  {
    id: "slide-23",
    moduleId: 2,
    slideNumber: 23,
    title: "Public Consensus vs. Enterprise Raft Consensus",
    subtitle: "Comparing Consensus Architectures",
    category: "Module 2 • Architecture",
    content: {
      comparison: {
        leftTitle: "Proof of Work (Bitcoin)",
        leftItems: [
          "Security derived from global mining hashrate.",
          "High energy consumption and specialized ASIC hardware.",
          "Probabilistic finality (requires 6+ block confirmations).",
          "Low transaction throughput (7-15 TPS).",
        ],
        rightTitle: "Enterprise Raft Consensus (Hyperledger Fabric)",
        rightItems: [
          "Security derived from cryptographic identities and PKI certificates.",
          "Zero energy waste; runs on standard commodity cloud servers.",
          "Immediate, absolute finality (blocks cannot fork or re-organize).",
          "High throughput (thousands of TPS) with sub-second latency.",
        ],
      },
    },
    speakerNotes:
      "Show how enterprise consensus eliminates waste by relying on legal trust and PKI certificates rather than proof-of-burn electricity.",
  },
  {
    id: "slide-24",
    moduleId: 2,
    slideNumber: 24,
    title: "Module 2 Knowledge Check",
    subtitle: "Test Your Understanding of Architecture & Consensus",
    category: "Module 2 • Knowledge Check",
    quiz: MODULE_QUIZZES[2],
    content: {
      lead: "Review your understanding of Proof of Work and distributed consensus.",
    },
    speakerNotes:
      "Review the question with students. Reinforce that mining is simply finding a hash satisfying the mathematical constraint (leading zeros).",
  },

  // ================= MODULE 3: HYPERLEDGER FABRIC =================
  {
    id: "slide-25",
    moduleId: 3,
    slideNumber: 25,
    title: "Introduction to Hyperledger Fabric",
    subtitle: "The Modular Enterprise Blockchain Standard",
    category: "Module 3 • Enterprise Fabric",
    content: {
      lead: "Hosted by The Linux Foundation, Hyperledger Fabric is an open-source, permissioned, modular enterprise blockchain platform designed for consortium business applications.",
      points: [
        "Permissioned Access: Every participant (peer, client, administrator) has an authenticated X.509 digital certificate.",
        "Modular Architecture: Pluggable consensus (Raft), pluggable identity (MSP, LDAP), and pluggable ledger state databases (CouchDB / LevelDB).",
        "Privacy by Design: Channels allow competitors to participate on the same network while keeping transaction data completely isolated.",
        "Smart Contracts in Standard Languages: Write chaincode in TypeScript, JavaScript, Go, or Java — no obscure custom languages required.",
      ],
    },
    speakerNotes:
      "Introduce the enterprise consortium context: multiple companies (e.g. suppliers, manufacturers, retailers, logistics) need a shared single source of truth without giving any single company total control of the database.",
  },
  {
    id: "slide-26",
    moduleId: 3,
    slideNumber: 26,
    title: "Identities & Membership Service Providers (MSP)",
    subtitle: "Cryptographic X.509 Authentication and Roles",
    category: "Module 3 • Enterprise Fabric",
    content: {
      lead: "Every interaction in Hyperledger Fabric is digitally signed using public key infrastructure (PKI).",
      points: [
        "Certificate Authority (Fabric CA): Issues digital X.509 certificates to nodes and human users.",
        "Membership Service Provider (MSP): Translates cryptographic certificates into recognized organization affiliations and permissions.",
        "Identity-Based Access Control: Chaincode can inspect the client's organization ID (`ctx.clientIdentity.getMSPID()`) to enforce who can read or transfer specific assets.",
        "Mutual TLS (mTLS): All network communications between peers, orderers, and clients are encrypted using mutually authenticated TLS connections.",
      ],
    },
    speakerNotes:
      "Explain that MSP is like a corporate badge system. The badge (X.509 certificate) is signed by the company's HR/IT department (CA). When a node checks the badge, it knows which organization the actor belongs to.",
  },
  {
    id: "slide-27",
    moduleId: 3,
    slideNumber: 27,
    title: "Fabric Architecture: Peers & Ordering Service",
    subtitle: "Separation of Execution from Ordering",
    category: "Module 3 • Enterprise Fabric",
    content: {
      lead: "Fabric uniquely decouples the execution of smart contracts from the ordering of transactions into blocks.",
      points: [
        "Endorsing Peers: Receive transaction proposals from clients, simulate smart contracts in isolated containers, check business rules, and sign endorsements.",
        "Committing Peers: Every peer is a committing peer. They receive ordered blocks, validate signatures against endorsement policies, verify version conflicts, and commit valid state to the ledger.",
        "Ordering Service (Orderer): Receives endorsed transactions from clients, establishes a strict chronological order using Raft consensus, and packages them into blocks.",
        "Why Separate? Ordering nodes do not need to execute smart contracts or inspect private payloads, maximizing network throughput and scalability.",
      ],
    },
    speakerNotes:
      "Highlight the 'Execute-Order-Validate' paradigm. In Bitcoin/Ethereum, every node executes every contract sequentially after ordering. In Fabric, only designated endorsing peers simulate the contract beforehand, allowing parallel execution.",
  },
  {
    id: "slide-28",
    moduleId: 3,
    slideNumber: 28,
    title: "World State (StateDB) vs. Blockchain Append Log",
    subtitle: "Current Values vs. Full Audit History",
    category: "Module 3 • Enterprise Fabric",
    content: {
      comparison: {
        leftTitle: "World State (StateDB — LevelDB / CouchDB)",
        leftItems: [
          "Stores the current latest value of every asset key.",
          "Optimized for fast reads and complex queries (e.g. find all cars where owner='Alice').",
          "Frequently overwritten whenever an asset is updated or transferred.",
          "Can be rebuilt at any time from scratch by replaying the block log.",
        ],
        rightTitle: "Blockchain Log (Append-Only File Store)",
        rightItems: [
          "Stores the sequential, immutable cryptographic chain of all blocks.",
          "Records every transaction that ever occurred, including failed transactions.",
          "Never overwritten or modified — strictly append-only.",
          "Serves as the definitive cryptographic truth and audit trail.",
        ],
      },
    },
    speakerNotes:
      "Emphasize this distinction: if an asset's price changes 10 times, the World State shows only the current 10th price. The Blockchain Log stores all 10 transactions. If the World State database crashes, it can be re-derived completely from the block log.",
  },
  {
    id: "slide-29",
    moduleId: 3,
    slideNumber: 29,
    title: "The 8-Step Transaction Lifecycle",
    subtitle: "Endorsement • Ordering • Validation & Commit",
    category: "Module 3 • Enterprise Fabric",
    content: {
      lead: "A production Hyperledger Fabric transaction follows a precise 8-step lifecycle across three distinct architectural phases.",
      points: [
        "Phase 1 — Endorsement: 1. Client Proposal -> 2. Peer Simulation -> 3. Endorsement Responses.",
        "Phase 2 — Ordering: 4. Submit to Orderer -> 5. Raft Batching & Block Creation -> 6. Block Delivery to Peers.",
        "Phase 3 — Validation & Commit: 7. Endorsement Policy & MVCC Check -> 8. Ledger Commit & Event Notification.",
        "Next: Step through each phase interactively with live telemetry.",
      ],
    },
    speakerNotes:
      "Prepare students for the interactive 8-step simulation on the next slide. Highlight Step 7 (MVCC check) — this is how Fabric prevents double spending without mining.",
  },
  {
    id: "slide-30",
    moduleId: 3,
    slideNumber: 30,
    title: "Interactive Simulation: Fabric 8-Step Lifecycle Explorer",
    subtitle: "Step-by-Step Animated Consortium Architecture",
    category: "Module 3 • Enterprise Fabric",
    simulationType: "fabric",
    content: {
      lead: "Click 'Play Flow' or step through with Previous/Next buttons. Click any component on the blueprint to view its runtime role and ports.",
    },
    speakerNotes:
      "Run the simulation live. Pause at Step 2 (Chaincode Simulation) to explain that no ledger write has occurred yet. Then pause at Step 7 to explain MVCC read/write version validation.",
  },
  {
    id: "slide-31",
    moduleId: 3,
    slideNumber: 31,
    title: "Key Takeaway: Execute-Order-Validate Paradigm",
    subtitle: "Fabric's Key High-Throughput Innovation",
    category: "Module 3 • Enterprise Fabric",
    content: {
      points: [
        "By simulating chaincode before ordering, non-deterministic or failed transactions are aborted before reaching the ordering service.",
        "Ordering nodes focus exclusively on transaction sequence without executing business logic.",
        "MVCC concurrency checks guarantee state consistency without requiring slow global database locks.",
      ],
      quote: "Execute first, Order second, Validate and Commit third.",
    },
    speakerNotes:
      "Reiterate this paradigm: it is the #1 question asked in enterprise blockchain interviews.",
  },
  {
    id: "slide-32",
    moduleId: 3,
    slideNumber: 32,
    title: "Module 3 Knowledge Check",
    subtitle: "Test Your Understanding of Hyperledger Fabric",
    category: "Module 3 • Knowledge Check",
    quiz: MODULE_QUIZZES[3],
    content: {
      lead: "Review the unique architecture of enterprise permissioned blockchains.",
    },
    speakerNotes:
      "Review the quiz with the class. Ensure students understand how Execute-Order-Validate sets Fabric apart from Ethereum.",
  },

  // ================= MODULE 4: DEV ENVIRONMENT & DOCKER =================
  {
    id: "slide-33",
    moduleId: 4,
    slideNumber: 33,
    title: "Why Linux & Ubuntu for Blockchain?",
    subtitle: "The Production Environment for Distributed Systems",
    category: "Module 4 • Dev Environment",
    content: {
      lead: "Over 90% of cloud instances and enterprise blockchain nodes run on Linux, predominantly Ubuntu Server LTS.",
      points: [
        "POSIX Compliance: Standardized filesystem, process signals, and Unix socket communications.",
        "Native Docker Support: Linux kernel namespaces (`cgroups`, `chroot`) power Docker containers without hypervisor translation overhead.",
        "Automated Scripting: Bash shell scripts orchestrate complex multi-node network setups (`network.sh`).",
        "Deterministic Networking: Reliable bridge networks and domain resolution essential for distributed consortia.",
      ],
    },
    speakerNotes:
      "Explain why students learning blockchain must be comfortable with the terminal. All real production nodes, Kubernetes deployments, and Fabric CLI tools are operated from bash.",
  },
  {
    id: "slide-34",
    moduleId: 4,
    slideNumber: 34,
    title: "Docker Containers & Network Architecture",
    subtitle: "Virtualizing a Multi-Organization Consortium on One Machine",
    category: "Module 4 • Dev Environment",
    content: {
      lead: "Hyperledger Fabric leverages Docker containers to isolate organizations, cryptographic authorities, and smart contract runtimes.",
      points: [
        "Linux Host: Physical or virtual development machine running Docker Engine.",
        "Bridge Network (`fabric_test`): Internal virtual network allowing containers to communicate using domain names (e.g. `peer0.org1.example.com:7051`).",
        "Peer Containers: Run peer binaries, host StateDB, and manage TLS connections.",
        "Ordering Container: Runs the Raft sequencing engine.",
        "Chaincode Containers: Each deployed smart contract runs in its own dedicated, isolated Docker container for security.",
      ],
    },
    speakerNotes:
      "Explain that Docker allows an engineer to simulate 2 full organizations, 2 peers, 1 orderer, and 2 CAs on a single laptop.",
  },
  {
    id: "slide-35",
    moduleId: 4,
    slideNumber: 35,
    title: "Interactive Simulation: Docker Architecture & Virtual Terminal",
    subtitle: "Inspect Containers and Execute Simulated Test-Network Commands",
    category: "Module 4 • Dev Environment",
    simulationType: "docker",
    content: {
      lead: "Inspect the virtual containers below, or switch to the 'Interactive Terminal Walkthrough' tab to execute simulated setup commands.",
    },
    speakerNotes:
      "Switch to the terminal tab. Click './network.sh up createChannel' to demonstrate the genesis block generation, container provisioning, and channel joining output.",
  },
  {
    id: "slide-36",
    moduleId: 4,
    slideNumber: 36,
    title: "Key Takeaway: Containerized Consortium Security",
    subtitle: "Multi-Tenant Isolation on Enterprise Infrastructure",
    category: "Module 4 • Dev Environment",
    content: {
      points: [
        "Containerization provides strict process, filesystem, and network isolation between competing organizations.",
        "Smart contracts cannot access host operating system secrets or other organizations' private volumes.",
        "Next: Writing actual smart contract business logic in modern JavaScript.",
      ],
      quote: "Containers enable trustless parties to share hardware without sharing secrets.",
    },
    speakerNotes:
      "Summarize the container isolation principle before advancing to smart contract programming.",
  },
  {
    id: "slide-37",
    moduleId: 4,
    slideNumber: 37,
    title: "Module 4 Knowledge Check",
    subtitle: "Test Your Understanding of Environment & Containers",
    category: "Module 4 • Knowledge Check",
    quiz: MODULE_QUIZZES[4],
    content: {
      lead: "Review containerization principles in enterprise blockchain systems.",
    },
    speakerNotes:
      "Discuss the quiz options. Emphasize process and network isolation.",
  },

  // ================= MODULE 5: SMART CONTRACT DEVELOPMENT =================
  {
    id: "slide-38",
    moduleId: 5,
    slideNumber: 38,
    title: "Smart Contracts vs. Traditional Backend Apps",
    subtitle: "Deterministic Business Logic Guaranteed by Consensus",
    category: "Module 5 • Smart Contracts",
    content: {
      comparison: {
        leftTitle: "Traditional Backend (Node.js / Express)",
        leftItems: [
          "Runs on a single server or cloud cluster owned by one entity.",
          "Can make non-deterministic calls (e.g. Math.random(), fetch external API, system clock).",
          "Admin can unilaterally alter backend code without customer notification.",
          "Database state can be edited directly via administrative tools.",
        ],
        rightTitle: "Fabric Chaincode (Smart Contract)",
        rightItems: [
          "Executed identically across multiple independent endorsing peer nodes.",
          "MUST BE DETERMINISTIC: same inputs must produce identical read/write sets.",
          "Updates require organizational consensus via Chaincode Lifecycle approval.",
          "State can ONLY be modified through public contract function invocations.",
        ],
      },
    },
    speakerNotes:
      "Emphasize the determinism rule: why can't a smart contract call `Math.random()` or fetch `weather.com`? Because Peer A and Peer B would get different values, their endorsement hashes would conflict, and the transaction would fail!",
  },
  {
    id: "slide-39",
    moduleId: 5,
    slideNumber: 39,
    title: "Anatomy of JavaScript Chaincode",
    subtitle: "The Fabric Contract API in Modern JavaScript",
    category: "Module 5 • Smart Contracts",
    content: {
      lead: "Fabric smart contracts extend the official `Contract` base class from `fabric-contract-api`.",
      codeSnippet: {
        language: "javascript",
        filename: "assetTransfer.js",
        code: `const { Contract } = require('fabric-contract-api');

class AssetTransferContract extends Contract {
  // Invoked during contract deployment to populate sample data
  async InitLedger(ctx) {
    const assets = [
      { ID: 'asset1', Color: 'blue', Size: 5, Owner: 'Tomoko', AppraisedValue: 300 },
      { ID: 'asset2', Color: 'red', Size: 5, Owner: 'Brad', AppraisedValue: 400 },
    ];
    for (const asset of assets) {
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
    }
  }

  // Returns true if asset with given ID exists in World State
  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }
}`,
      },
      points: [
        "The Transaction Context (`ctx`): Provides access to `ctx.stub` (ledger read/write) and `ctx.clientIdentity` (caller MSP ID & cert).",
        "`ctx.stub.putState(key, buffer)`: Serializes binary data into the StateDB.",
        "`ctx.stub.getState(key)`: Retrieves current binary state for a given key.",
      ],
    },
    speakerNotes:
      "Walk line-by-line through the code. Explain that `ctx.stub` is the bridge between JavaScript code and the underlying database.",
  },
  {
    id: "slide-40",
    moduleId: 5,
    slideNumber: 40,
    title: "Asset Operations: Create, Read & Update",
    subtitle: "Implementing Core CRUD Logic Safely",
    category: "Module 5 • Smart Contracts",
    content: {
      lead: "Implementing asset creation and querying with guard clauses and error handling.",
      codeSnippet: {
        language: "javascript",
        filename: "assetTransfer.js (continued)",
        code: `// Create a new asset on the ledger
async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
  const exists = await this.AssetExists(ctx, id);
  if (exists) {
    throw new Error(\`The asset \${id} already exists\`);
  }
  const asset = {
    ID: id,
    Color: color,
    Size: parseInt(size, 10),
    Owner: owner,
    AppraisedValue: parseInt(appraisedValue, 10),
  };
  await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  return JSON.stringify(asset);
}

// Read an existing asset from the World State
async ReadAsset(ctx, id) {
  const assetJSON = await ctx.stub.getState(id);
  if (!assetJSON || assetJSON.length === 0) {
    throw new Error(\`The asset \${id} does not exist\`);
  }
  return assetJSON.toString();
}`,
      },
    },
    speakerNotes:
      "Point out the guard clause: checking `AssetExists` before creating. In blockchain, throwing an error aborts the proposal simulation cleanly, preventing invalid state from being packaged into blocks.",
  },
  {
    id: "slide-41",
    moduleId: 5,
    slideNumber: 41,
    title: "Asset Transfer & Ownership Mutation",
    subtitle: "Atomic State Transition with Validation",
    category: "Module 5 • Smart Contracts",
    content: {
      lead: "Ownership transfer requires fetching the current asset, updating the owner attribute, and committing the new state.",
      codeSnippet: {
        language: "javascript",
        filename: "assetTransfer.js (continued)",
        code: `// Transfer ownership of an asset to a new entity
async TransferAsset(ctx, id, newOwner) {
  const assetString = await this.ReadAsset(ctx, id);
  const asset = JSON.parse(assetString);
  const oldOwner = asset.Owner;
  asset.Owner = newOwner;
  
  // Persist the updated asset with the new owner
  await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  
  // Return the previous owner for telemetry/confirmation
  return oldOwner;
}`,
      },
      points: [
        "State Transition: Reads `asset.Owner = 'Alice'`, writes `asset.Owner = 'Bob'`.",
        "MVCC Protection: If two clients try to transfer `asset1` simultaneously, the first to commit succeeds; the second fails MVCC validation because the read version changed.",
      ],
    },
    speakerNotes:
      "Explain how MVCC protects against race conditions in high-throughput enterprise networks without needing slow global database locks.",
  },
  {
    id: "slide-42",
    moduleId: 5,
    slideNumber: 42,
    title: "Deploying Chaincode with network.sh",
    subtitle: "Package • Install • Approve • Commit",
    category: "Module 5 • Smart Contracts",
    content: {
      lead: "Fabric 2.x+ uses a decentralized chaincode lifecycle requiring organizations to agree on contract definitions before deployment.",
      codeSnippet: {
        language: "bash",
        code: `# Deploy JavaScript chaincode to channel 'mychannel'
./network.sh deployCC \\
  -ccn basic \\
  -ccp ../asset-transfer-basic/chaincode-javascript/ \\
  -ccl javascript

# Under the hood, this automates 4 lifecycle steps:
# 1. peer lifecycle chaincode package (creates .tar.gz bundle)
# 2. peer lifecycle chaincode install (installs on peer0.org1 and peer0.org2)
# 3. peer lifecycle chaincode approveformyorg (both Org1 and Org2 approve definition)
# 4. peer lifecycle chaincode commit (commits contract to channel 'mychannel')`,
      },
    },
    speakerNotes:
      "Explain the governance aspect: why must both Org1 and Org2 approve the chaincode definition? Because in enterprise consortia, no single company should be allowed to inject arbitrary smart contract code without mutual consent.",
  },
  {
    id: "slide-43",
    moduleId: 5,
    slideNumber: 43,
    title: "Module 5 Knowledge Check",
    subtitle: "Test Your Understanding of Chaincode Development",
    category: "Module 5 • Knowledge Check",
    quiz: MODULE_QUIZZES[5],
    content: {
      lead: "Review your knowledge of smart contract programming and state operations.",
    },
    speakerNotes:
      "Review the question with the class. Ensure students understand how `ctx.stub.putState` serializes data to the World State database.",
  },

  // ================= MODULE 6: HANDS-ON MINI PROJECT =================
  {
    id: "slide-44",
    moduleId: 6,
    slideNumber: 44,
    title: "Mini Project: Hello Blockchain Message Store",
    subtitle: "Store, Retrieve, and Update a Message with Hyperledger Fabric",
    category: "Module 6 • Mini Project",
    content: {
      lead: "In this hands-on project, we implement the quintessential distributed ledger application: storing, querying, and updating a message string across multiple organizations using JavaScript chaincode.",
      points: [
        "Project Goal: Build a decentralized, tamper-evident message store using Hyperledger Fabric, Docker containers, Ubuntu, and Node.js.",
        "Core Operations: InitLedger (sets default greeting), ReadMessage (fast O(1) query from StateDB), and UpdateMessage (endorsed write transaction).",
        "Multi-Org Governance: Updating the message requires cryptographic endorsement from both Org1 and Org2 peers before ordering.",
        "Live Interactive Demonstration: Test the complete lifecycle directly in our embedded simulation on the following slides.",
      ],
    },
    speakerNotes:
      "Introduce the Hello Blockchain project: Rather than getting bogged down in complex multi-field schemas, we focus on the fundamental primitives of blockchain: storing a string, reading it with sub-millisecond latency from StateDB, and updating it through consensus.",
  },
  {
    id: "slide-45",
    moduleId: 6,
    slideNumber: 45,
    title: "JavaScript Chaincode: putState & getState",
    subtitle: "The Fabric Contract API in Node.js",
    category: "Module 6 • Mini Project",
    content: {
      lead: "Smart contracts interact with the ledger via the chaincode stub (`ctx.stub`). Data is always written and read as raw binary byte buffers.",
      codeSnippet: {
        language: "javascript",
        code: `// Fabric Contract API — hello-blockchain.js
const { Contract } = require('fabric-contract-api');

class HelloBlockchainContract extends Contract {
  // 1. Initialize ledger with default greeting
  async InitLedger(ctx) {
    const defaultMsg = 'Hello Blockchain! Welcome to Hyperledger Fabric.';
    await ctx.stub.putState('GLOBAL_MESSAGE', Buffer.from(defaultMsg));
    return defaultMsg;
  }

  // 2. Read message from World State (fast query, no consensus overhead)
  async ReadMessage(ctx, key) {
    const bytes = await ctx.stub.getState(key);
    if (!bytes || bytes.length === 0) {
      throw new Error(\`Message with key \${key} does not exist\`);
    }
    return bytes.toString('utf8');
  }

  // 3. Update message (requires endorsement & Raft ordering)
  async UpdateMessage(ctx, key, newText) {
    await ctx.stub.putState(key, Buffer.from(newText));
    return \`Message updated successfully to: \${newText}\`;
  }
}
module.exports = HelloBlockchainContract;`,
      },
    },
    speakerNotes:
      "Explain the distinction between getState and putState. ReadMessage calls getState, which executes entirely locally on the client's peer without sending anything to the Orderer. UpdateMessage calls putState, which must go through the full 8-step endorsement and ordering flow.",
  },
  {
    id: "slide-46",
    moduleId: 6,
    slideNumber: 46,
    title: "Interactive Simulation: Hello Blockchain",
    subtitle: "Store, Retrieve, and Update Messages on the Simulated Ledger",
    category: "Module 6 • Mini Project",
    simulationType: "hello-blockchain",
    content: {
      lead: "Submit new message strings below to trigger the Execute-Order-Validate lifecycle. Compare the current World State with the immutable chronological block history.",
    },
    speakerNotes:
      "Demonstrate live: 1. Submit a new message from Org1 ('Decentralized consensus verified'). 2. Point out the 4-stage pipeline (Execute -> Order -> Validate -> Commit). 3. Switch sender to Org2 and update again. 4. Contrast the World State card (which shows only the current string) with the History log (which shows every edit with block numbers and TxIDs).",
  },
  {
    id: "slide-47",
    moduleId: 6,
    slideNumber: 47,
    title: "Key Takeaway: World State vs. Immutable Block History",
    subtitle: "Current Value ('Hello World') vs. Full Provenance History",
    category: "Module 6 • Mini Project",
    content: {
      points: [
        "World State (StateDB): Overwritten with each update. When you update 'GLOBAL_MESSAGE', CouchDB/LevelDB stores only the latest string for instant O(1) query performance.",
        "Blockchain Append Log: Strictly immutable and append-only. Every message revision remains permanently recorded inside numbered blocks with cryptographic hashes.",
        "Disaster Recovery: If the World State database is ever wiped, it can be 100% reconstructed by replaying all historical blocks from Genesis.",
      ],
      quote: "World State is current reality; the Blockchain Log is undeniable history.",
    },
    speakerNotes:
      "Reiterate this fundamental distinction: databases overwrite records, but blockchains append transactions while maintaining the latest state in a companion database.",
  },
  {
    id: "slide-48",
    moduleId: 6,
    slideNumber: 48,
    title: "CLI Interaction: Invoking Chaincode via Ubuntu Terminal",
    subtitle: "Executing peer chaincode query and invoke Commands",
    category: "Module 6 • Mini Project",
    content: {
      lead: "In a production Linux terminal environment, operators interact with chaincode containers using the `peer chaincode` CLI utility.",
      codeSnippet: {
        language: "bash",
        code: `# 1. Query current message from World State (no transaction fee/ordering)
peer chaincode query \\
  -C mychannel \\
  -n hello-blockchain \\
  -c '{"Args":["ReadMessage","GLOBAL_MESSAGE"]}'

# 2. Invoke transaction to update message with multi-org endorsement
peer chaincode invoke \\
  -o localhost:7050 \\
  --ordererTLSHostnameOverride orderer.example.com \\
  --tls --cafile "\$ORDERER_CA" \\
  -C mychannel \\
  -n hello-blockchain \\
  --peerAddresses localhost:7051 --tlsRootCertFiles "\$PEER0_ORG1_CA" \\
  --peerAddresses localhost:9051 --tlsRootCertFiles "\$PEER0_ORG2_CA" \\
  -c '{"Args":["UpdateMessage","GLOBAL_MESSAGE","Hello from Ubuntu CLI!"]}'`,
      },
      points: [
        "`peer chaincode query`: Reads directly from the local peer's StateDB in under 2 milliseconds.",
        "`peer chaincode invoke`: Submits the proposal to both Org1 and Org2 peers to satisfy the endorsement policy, then routes to the Raft orderer.",
      ],
    },
    speakerNotes:
      "Highlight the difference between 'peer chaincode query' and 'peer chaincode invoke'. Point out that query never creates a block; invoke always sequences through Raft.",
  },
  {
    id: "slide-49",
    moduleId: 6,
    slideNumber: 49,
    title: "Module 6 Knowledge Check",
    subtitle: "Test Your Understanding of Mini Project & State Management",
    category: "Module 6 • Knowledge Check",
    quiz: MODULE_QUIZZES[6],
    content: {
      lead: "Review the difference between the World State and the historical block log.",
    },
    speakerNotes:
      "Discuss the final quiz answer. Make sure everyone leaves the workshop understanding that World State is for fast operational queries, while the blockchain log is the immutable history.",
  },
  {
    id: "slide-50",
    moduleId: 6,
    slideNumber: 50,
    title: "Workshop Summary & Engineering Next Steps",
    subtitle: "What You've Learned & How to Continue Building",
    category: "Module 6 • Conclusion",
    content: {
      lead: "Congratulations! You have journeyed from cryptographic hashing primitives to enterprise consortium blockchain deployment.",
      points: [
        "Cryptographic Integrity: SHA-256 hashes and linked blocks create mathematically tamper-evident records.",
        "Consensus Models: Public networks use economic lottery (PoW/PoS); enterprise consortia use authenticated identity and Raft ordering.",
        "Hyperledger Fabric: Execute-Order-Validate architecture enables high throughput, confidentiality via channels, and deterministic state updates.",
        "Next Steps for Engineers: Explore Hyperledger Fabric Gateway SDKs (Node.js/Go), Kubernetes deployment via Fabric Operator, and Zero-Knowledge Proofs.",
      ],
      quote: "The future of distributed trust is built by engineers who understand both the math and the architecture.",
    },
    speakerNotes:
      "Congratulate the students. Wrap up the presentation and invite questions from the audience.",
  },
];
