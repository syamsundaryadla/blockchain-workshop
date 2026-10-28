# One-Day Hands-on Workshop on Blockchain Technology

Audience: 1st- and 2nd-year B.Tech CSE (Networking). No blockchain experience assumed; basic programming and networks are helpful.

Time: **09:30–16:30**. Morning: theory and interactive simulations. Afternoon: real Hyperledger Fabric demonstration and guided practical. Lunch: 12:30–13:30. Breaks: 12:05–12:15 and 14:35–14:45. Teaching and practical time: 340 minutes.

The existing presentation is revised in place: 91 visual slides across eight modules. Slide 1 contains only “Block chain fundamentals”; slide 2 introduces the facilitator; concepts begin on slide 3. Related ideas have separate diagrams when this aids understanding. Keep on-screen text to one short explanation where needed. Presenter notes carry examples, qualifications and facilitation prompts.

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

## Mini project: Campus Credits Transfer

### Story and visible result

Two demo wallets belong to Alice and Bob. Alice transfers campus credits to Bob. These are application records on Fabric, not a built-in Fabric currency, legal tender, or a real payment service.

| Action | Alice | Bob | Combined balance |
|---|---:|---:|---:|
| Prepared initialization | 100 | 50 | 150 |
| Alice transfers 20 to Bob | 80 | 70 | 150 |
| Bob transfers 10 to Alice | 90 | 60 | 150 |
| Alice attempts to send 1,000 | 90 | 60 | 150 |

The last request must fail and leave both balances unchanged.

### Architecture

```text
Browser: prepared HTML + CSS + a little JavaScript
                     |
                     v
Local Node.js application + Fabric Gateway client
                     |
                     v
Fabric test network: Org1 peer + Org2 peer + ordering service
                     |
                     v
JavaScript chaincode: identity checks + transfer rules + wallet records
```

The browser calls a backend; HTML and CSS alone cannot submit a signed Fabric transaction. The backend uses prepared test credentials inside Ubuntu. Private keys do not go into browser code.

Each student laptop or working pair uses its own local network. Alice is bound to one prepared Org1 client identity and Bob to one prepared Org2 client identity. An organization is not a wallet: these are two chosen users within the demonstration organizations.

The UI's Alice/Bob selector chooses between prepared local demonstration identities. It is not production authentication. The chaincode independently checks that the actual signing identity owns the requested sender wallet; a sender name supplied by the browser is never proof of ownership.

### Core contract operations

| Operation | Behavior |
|---|---|
| `InitializeDemo(aliceIdentity, bobIdentity)` | Prepared instructor-only bootstrap creates the two wallets once and binds them to their Fabric identities and MSPs. Repeat initialization and an unauthorized caller must fail. |
| `GetBalance(walletId)` | Reads an existing wallet and returns its owner label and whole-number balance. |
| `TransferCredits(fromWalletId, toWalletId, amount)` | Checks that the signed Fabric identity owns the requested sender wallet, validates the transfer, and prepares both balance changes and a transfer event in one transaction. |

The prepared bootstrap and identity lookup are supplied, explained, and tested. Students do not write enrollment or initialization security in the one-hour exercise.

### Transfer rules

1. The signing identity must be bound to the sender wallet. Check both the identity and its MSP.
2. The recipient wallet must exist and differ from the sender.
3. The amount must be a positive safe integer; reject zero, negatives, fractions, malformed values, and out-of-range numbers. Use strict parsing, not permissive `parseInt` conversion.
4. The sender must have sufficient credits, and the resulting balances must remain safe integers.
5. Debit and credit belong to one Fabric transaction. Only a valid committed transaction updates current state.
6. Transferring preserves the combined balance of 150. There is no student-facing mint or top-up operation.
7. Report success in the UI after a valid commit, with the transaction ID. Refresh balances from the ledger rather than trusting the browser's arithmetic.

A business-rule rejection during proposal execution is not necessarily written to the blockchain. A transaction that reaches ordering can later be marked invalid during validation; invalid transactions do not update current state. Keep this distinction in instructor notes so a failed UI request is not presented as a guaranteed ledger entry.

### Prepared UI

- Two balance cards: Alice and Bob.
- A clearly labeled demo-identity selector.
- Recipient, amount, and Transfer controls.
- A result area showing committed success with a transaction ID, or a readable error.
- A balance refresh control.

Use the same simple screen for the instructor demonstration and student practical. No frontend framework, wallet extension, or frontend build exercise is required.

## Exactly what students do in the student build hour

| Time | Student work | Evidence |
|---|---|---|
| 15:00–15:10 | Open the starter and identify the sender, recipient, and amount. Predict the expected result. | Correct verbal prediction: 100/50 becomes 80/70. |
| 15:10–15:25 | Complete three small TODO groups: validate the amount, check sufficient funds, and calculate the two resulting balances. | A readable completed function; identity binding and ledger plumbing remain supplied. |
| 15:25–15:35 | Use the prepared deployment/start script and open the supplied app. | Contract deployed and initial balances read from Fabric. |
| 15:35–15:50 | Transfer 20, switch demo identity, transfer 10 back, then try invalid amounts, insufficient funds, and a forbidden identity action. | Expected balances; rejected requests leave them unchanged. |
| 15:50–16:00 | Demonstrate the result and answer the exit questions; compare with a database. | Explain who signed, why a request failed, and why the combined balance stays constant. |

For the forbidden-identity check, provide a prepared instructor/test action that attempts to debit Alice using Bob's signing identity. It must reach and fail the contract's ownership check; changing only an untrusted UI label is not a sufficient test. Ordinary transfers by Bob from Bob's own wallet are allowed.

Pairs swap the driver after the first successful transfer. A prepared solution is available for recovery, but the pair must still demonstrate the checks and explain the result. Finishing every optional test is secondary to understanding one successful transfer and one rejection.

## Materials to prepare

- A visual presentation with eight modules, concise labels, gradual reveals, and presenter notes. Use topic-specific infographics rather than repeated illustrations.
- A student starter and completed JavaScript chaincode solution.
- Prepared Node.js/Fabric Gateway backend, HTML/CSS/JavaScript UI, and demonstration identities.
- A single documented setup path, deployment/start commands, and a clearly labeled reset command for the disposable network.
- A numbered practical handout with exact expected balances and error cases.
- An instructor guide with timing, questions, recovery steps, and common WSL/Docker failures.
- Screenshots and a recording from the same real Fabric project. Label any browser-only fallback as a simulation.

Pre-workshop installation uses the shared installation guide: Ubuntu 24.04 under WSL 2, Node.js 22.23.3, Fabric 2.5.16, Fabric CA 1.5.17, and sample revision `3c63eac4e303e8348c42637d7ed337727645b9ce`. Use matching binaries/images and lock application dependencies when preparing the project.

Do not schedule installation during the teaching day. Before the workshop, rehearse the practical on the same starter and cache required npm dependencies and runtime images. Use the 14:45 readiness slot to recover an environment, not download the entire toolchain.

## Readiness and acceptance

- Run the full student path on a fresh prepared environment with the handout alone.
- Verify one-time authorized initialization and rejection of unauthorized or repeat initialization.
- Verify 100/50 → 80/70 → 90/60 with actual committed Fabric transactions.
- Verify invalid amounts, insufficient funds, missing recipient, self-transfer, overflow, and an unbound or wrong signing identity; balances must not change.
- Confirm that a browser-supplied sender or balance cannot bypass contract authorization.
- Submit two conflicting transfers from the same starting balance and confirm that a stale transaction cannot overspend the wallet. Treat the concurrency explanation as an instructor demonstration, not a student implementation requirement.
- Verify that UI success waits for a valid commit and query results match the ledger after refresh.
- Check every presentation link, diagram, knowledge check, note, handout, download, and fallback after migration from Solidity.

## Keep outside the core day

Detailed Raft mechanics, BFT configuration, writing channel/MSP policies, CA administration, Docker internals, production deployment, full chaincode lifecycle commands, advanced MVCC analysis, private-data collections, token standards, and Ethereum/Solidity development are follow-up topics.

Briefly name where these fit without turning them into additional practical tasks. An ordinary database may be preferable when one trusted organization controls the application and its records.

## Exit questions

1. What changed when Alice sent 20 credits to Bob?
2. Which identity was permitted to debit Alice's wallet?
3. Why did the rejected transfer leave the balances unchanged?
4. Why does Fabric need an application contract for these credits?
5. When would a database with permissions be sufficient?

## Official technical references

- [Fabric transaction flow](https://hyperledger-fabric.readthedocs.io/en/release-2.5/txflow.html)
- [Running a Fabric application](https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html)
- [Smart contracts and chaincode](https://hyperledger-fabric.readthedocs.io/en/release-2.5/smartcontract/smartcontract.html)
- [Fabric test network](https://hyperledger-fabric.readthedocs.io/en/release-2.5/test_network.html)

## Case-study and theory references

- [Bitcoin FAQ](https://bitcoin.org/en/faq) and [original paper](https://bitcoin.org/bitcoin.pdf)
- [Ethereum proof of stake](https://ethereum.org/developers/docs/consensus-mechanisms/pos/)
- [Ethereum smart contracts](https://ethereum.org/developers/docs/smart-contracts/) and [DApps](https://ethereum.org/developers/docs/dapps/)
- [Walmart's 2018 traceability initiative](https://corporate.walmart.com/news/2018/09/24/in-wake-of-romaine-e-coli-scare-walmart-deploys-blockchain-to-track-leafy-greens)
- [Maersk/IBM TradeLens discontinuation announcement](https://www.maersk.com/news/articles/2022/11/29/maersk-and-ibm-to-discontinue-tradelens)
