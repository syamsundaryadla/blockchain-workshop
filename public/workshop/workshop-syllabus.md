# One-Day Hands-on Workshop on Blockchain Technology

Audience: 1st- and 2nd-year B.Tech CSE (Networking). No blockchain experience assumed; basic programming and networks are helpful.

Time: **09:30–16:30**. Morning: theory and interactive simulations. Afternoon: real Hyperledger Fabric demonstration and guided practical. Lunch: 12:30–13:30. Breaks: 12:05–12:15 and 14:35–14:45. Teaching and practical time: 340 minutes.

The existing presentation is revised in place: 91 visual slides across eight modules. Slide 1 contains only “Block chain fundamentals”; slide 2 introduces the facilitator; concepts begin on slide 3. Related ideas have separate diagrams when this aids understanding. Core slides add a few short subtopics and a concrete example only where useful. Presenter notes carry qualifications and timed facilitation prompts. Module 6 includes a six-component comparison with analogies and Campus Credits examples.

## Schedule

| Time | Session | What students do |
|---|---|---|
| 09:30–10:00 | 1 · Introduction to blockchain | Compare trust, Bitcoin’s beginnings and system control. |
| 10:00–10:40 | 2 · Architecture & working | Hash a message; link blocks; detect tampering. |
| 10:40–11:15 | 3 · Networking & consensus | Propagate a request; try a toy mining puzzle; compare protocols. |
| 11:15–11:45 | 4 · Cryptography & smart contracts | Sign and verify; explain wallets, DApps and contract rules. |
| 11:45–12:05 | 5 · Applications & case studies | Trace a food lot; examine finance, identity, healthcare and voting. |
| 12:05–12:15 | Break |  |
| 12:15–12:30 | 5 · Limitations & recap | Discuss TradeLens, privacy and when a database is enough. |
| 12:30–13:30 | Lunch |  |
| 13:30–14:10 | 6 · Hyperledger Fabric demonstration | Role-play peers and orderer; observe a real committed transfer. |
| 14:10–14:35 | 7 · Explain the real project | Trace browser → Node.js → chaincode and predict both balances. |
| 14:35–14:45 | Break |  |
| 14:45–15:00 | 7 · Code walkthrough & readiness | Locate three TODOs; check the prepared network and commands. |
| 15:00–16:00 | 7 · Student build & tests | Complete the rule; deploy; prove success and permission failures. |
| 16:00–16:30 | 8 · Demonstrations, learning paths & Q&A | Show a commit and a rejection; explain the design tradeoffs. |

## Syllabus

### Module 1: Introduction to Blockchain

1. What is Blockchain Technology?
2. Evolution of Blockchain and Introduction to Bitcoin (2009)
3. Traditional Banking Systems and Their Limitations
4. Centralized vs Decentralized vs Distributed Systems
5. Why Do We Need Blockchain?
6. Real-World Examples – Walmart, Maersk and Financial Transactions

After Topic 6: Walmart mango traceability example. In its reported pilot, tracing fell from nearly seven days to 2.2 seconds. [Walmart’s 2018 report, p. 39](https://stock.walmart.com/_assets/_513a414897667f69e48953e02796048d/walmart/db/951/9698/file/WMT-2018-GRR-Summary-for-digital.pdf). These are reported pilot measurements, not a universal speed guarantee.

### Module 2: Blockchain Architecture & Working

1. What is a Transaction?
2. What is a Block?
3. Structure of a Block – Data, Timestamp, Previous Hash, Nonce and Hash
4. Understanding SHA-256 Hashing
5. How Blocks Are Connected to Form a Blockchain
6. Distributed Ledger Technology (DLT)
7. Key Features – Transparency, Immutability, Security and Decentralization

Animations follow the transaction, block and blockchain-linking explanations.

### Module 3: Blockchain Networking & Consensus

1. Peer-to-Peer (P2P) Networks
2. Nodes and Their Roles in Blockchain
3. How Transactions Propagate Across the Network
4. Transaction Verification and Validation
5. What is Consensus and Why Is It Required?
6. Proof of Work (PoW) and Mining
7. Introduction to Proof of Stake (PoS) and Validators
8. Public, Private and Consortium Blockchains

### Module 4: Cryptography, Wallets & Smart Contracts

1. Introduction to Cryptography in Blockchain
2. Public Keys, Private Keys and Digital Signatures
3. What is a Cryptocurrency Wallet?
4. Wallet Addresses and Blockchain Transactions
5. Introduction to Ethereum
6. What Are Smart Contracts?
7. Decentralized Applications (DApps)
8. Introduction to Hyperledger Fabric

### Module 5: Blockchain Applications & Use Cases

1. Banking and Financial Transactions
2. Supply Chain Management
3. Digital Identity and Record Verification
4. Blockchain-Based Voting Systems
5. Healthcare and Insurance
6. Opportunities, Challenges and Limitations of Blockchain

### Module 6: Introduction to Hyperledger Fabric

1. Overview of Hyperledger Fabric
2. Permissioned Blockchain Networks
3. Understanding Organizations, Peers and Ordering Services
4. Introduction to Docker and Ubuntu/WSL
5. Understanding the Hyperledger Fabric Test Network
6. Demonstration of Blockchain Transactions Using Fabric

### Module 7: Mini Project – Blockchain-Based Digital Wallet & Transaction System

1. Understanding the Project Architecture and Workflow
2. Setting Up the Development Environment
3. Creating Simulated Wallet Accounts
4. Generating and Managing Wallet Addresses
5. Implementing Virtual Currency Transfers
6. Creating Transaction Records
7. Storing Transactions in Blocks
8. Generating SHA-256 Block Hashes
9. Linking Blocks Using Previous Hashes
10. Implementing Blockchain Integrity Verification
11. Detecting Modified or Tampered Transactions
12. Testing the Complete Application

This workshop retains the real Hyperledger Fabric application. Block formation, hashing, linking and ledger verification are Fabric-managed mechanisms explained with diagrams; students complete the application’s three transfer-rule TODOs rather than build a Python blockchain.

### Module 8: Project Demonstration & Conclusion

1. Demonstration of the Completed Mini Project
2. Verifying Blockchain Transactions
3. Understanding Real-World Blockchain Implementation
4. Common Challenges and Security Considerations
5. Future Learning Pathways in Blockchain Development
6. Interactive Q&A Session

## Pacing the one-day workshop

The 91 slides are visual steps, not 91 separate lectures. Use the subtopic labels as speaking cues and each on-screen example within the existing explanation time (usually 20–45 seconds). Reuse the same example in the next animation or experiment. Explain each concept once, then ask one short prediction.

- Morning modules retain their existing time slots. Cap each hashing, propagation, mining and signature experiment at three minutes. Applications use one short example each; avoid extended case-study discussion.
- 12:15–12:20: limitations, truthful input and database comparison. 12:20–12:30: the 12-question morning quiz, including joining and leaderboard transitions. Create the room before the slot.
- 13:30–14:10: place the three-minute component comparison after the organization diagram and role-play, alongside the identity explanation. Reuse those examples in the real demo. Within the 40 minutes, allow about 12 minutes for terms and identities, eight for role-play and flow, five for the prepared environment and ten for the real demo, leaving five for questions.
- 14:10–14:35: project story, architecture and transfer rules. 14:45–15:00: starter walkthrough and readiness. Treat Fabric-managed block/hash/link slides as a short recap; students only implement the three supplied TODO groups.
- Protect 15:00–16:00 for the student build. Resolve installation issues before the event or pair with a prepared laptop.
- 16:00–16:10: two short pair demonstrations, transaction evidence and security recap. 16:10–16:20: the 15-question afternoon quiz. 16:20–16:30: learning pathways and Q&A.

Both live quizzes use 15-second answer windows. The ten-minute slots include preparation countdowns, room joining and short leaderboard pauses. If running late, shorten repeated demonstrations and optional discussion; keep the student build hour and finish time.

## Interactive teaching

Use explain → predict → demonstrate → students try → discuss. Core concepts have one- or two-sentence definitions. Play, Pause, Next step and Reset control the animations. Click nodes or use the node selector to switch them off and restore them. Check understanding every 10–15 minutes. The seven experiments are real SHA-256 comparison, hash-chain tampering, manual P2P propagation, a real-hashing toy mining puzzle, real browser signatures, a Fabric transaction model and a clearly labeled credits rehearsal. A simulation is never evidence of a real Fabric transaction.

## Real student mini project

**Campus Credits Transfer on Hyperledger Fabric.** Start with Alice 100 / Bob 50. Alice sends 20: 80 / 70. Bob sends 10 back: 90 / 60. Reject invalid amounts, insufficient funds and a wrong signing identity without changing the balances. The combined balance stays 150.

Students complete three small JavaScript TODO groups, deploy to a prepared two-organization network, and use a supplied HTML/CSS/JavaScript interface with a Node.js/Fabric Gateway backend. The contract binds wallet ownership to actual signing identities. This is a real Fabric application, not a Python simulator or a cryptocurrency service. Students do not hand-build Fabric blocks or their hashes: Fabric manages its ledger format.

The hands-on build is protected from 15:00–16:00; demonstrations, security discussion, learning pathways and Q&A follow until 16:30. Swap the driver halfway through. Success means each pair can explain who signed, what changed, and why a forbidden action failed.

## Prerequisites

Bring a laptop with the prepared Ubuntu 24.04 / WSL 2, Docker Desktop integration, Node.js 22.23.3, Fabric 2.5.16, Fabric CA 1.5.17, Git, VS Code and a modern browser. Use the installation guide before the day; Docker/WSL are required for the local Fabric practical. Cache dependencies and images, rehearse deployment, and pair with a prepared laptop if needed. Python is not a student-project prerequisite.

## Learning outcomes

Students should be able to explain a hash link, distinguish identity from authorization and receipt from confirmation, compare consensus approaches at an introductory level, identify Fabric roles, and demonstrate a real transfer plus a rejection. They should be able to choose a database when a shared blockchain is unnecessary. Do not describe introductory exposure as mastery of all protocols or production security.


## Case-study and theory references

- [Bitcoin FAQ](https://bitcoin.org/en/faq) and [original paper](https://bitcoin.org/bitcoin.pdf)
- [Ethereum proof of stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/)
- [Ethereum smart contracts](https://ethereum.org/developers/docs/smart-contracts/) and [DApps](https://ethereum.org/developers/docs/dapps/)
- [Walmart's 2018 traceability initiative](https://corporate.walmart.com/news/2018/09/24/in-wake-of-romaine-e-coli-scare-walmart-deploys-blockchain-to-track-leafy-greens)
- [Maersk/IBM TradeLens discontinuation announcement](https://www.maersk.com/news/articles/2022/11/29/maersk-and-ibm-to-discontinue-tradelens)
