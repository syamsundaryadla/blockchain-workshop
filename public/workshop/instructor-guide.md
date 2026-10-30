# Instructor guide: Blockchain Technology Workshop

## Teaching method
Use the supplied headings in the supplied order. Define unfamiliar terms in one or two sentences, then use the diagram and a short prediction. Animations start paused and support manual steps. Keep a checkpoint every 10–15 minutes.

## Pacing the one-day workshop

The 90 slides are visual steps, not 90 separate lectures. Use the subtopic labels as speaking cues and each on-screen example within the existing explanation time (usually 20–45 seconds). Reuse the same example in the next animation or experiment. Explain each concept once, then ask one short prediction.

- Morning modules retain their existing time slots. Cap each hashing, propagation, mining and signature experiment at three minutes. Applications use one short example each; avoid extended case-study discussion.
- 12:15–12:20: limitations, truthful input and database comparison. 12:20–12:30: the 12-question morning quiz, including joining and leaderboard transitions. Create the room before the slot.
- 13:30–14:10: place the three-minute component comparison after the organization diagram and role-play, alongside the identity explanation. Reuse those examples in the real demo. Within the 40 minutes, allow about 12 minutes for terms and identities, eight for role-play and flow, five for the prepared environment and ten for the real demo, leaving five for questions.
- 14:10–14:35: project story, architecture and transfer rules. 14:45–15:00: starter walkthrough and readiness. Treat Fabric-managed block/hash/link slides as a short recap; students only implement the three supplied TODO groups.
- Protect 15:00–16:00 for the student build. Resolve installation issues before the event or pair with a prepared laptop.
- 16:00–16:10: two short pair demonstrations, transaction evidence and security recap. 16:10–16:20: the 15-question afternoon quiz. 16:20–16:30: learning pathways and Q&A.

Both live quizzes use 15-second answer windows. The ten-minute slots include preparation countdowns, room joining and short leaderboard pauses. If running late, shorten repeated demonstrations and optional discussion; keep the student build hour and finish time.

## Module 1: Introduction to Blockchain

09:30–10:00

Follow the exact six topic headings in order. Define blockchain before introducing Bitcoin and the trust problem. In Topic 4, use Play or Next step to show failures, then click any node or select it and use Turn off selected node. Restore nodes and compare the affected paths. Distributed placement alone does not guarantee fault tolerance. After Topic 6, use the Walmart mango example: the 2017 exercise was reported as six days, 18 hours and 26 minutes using existing methods, compared with a 2.2-second pilot lookup. Labels in the diagram are illustrative. Use the cited Walmart report rather than presenting the result as a universal benchmark.

## Module 2: Blockchain Architecture & Working

10:00–10:40

Define transaction, then play its animation: balances stay unchanged until acceptance. Define a block and animate records grouping into a candidate block. Explain the structure before SHA-256. Keep the difference between a PoW teaching nonce and Fabric block fields explicit. After hash linking and the tampering exercise, play the blockchain animation and edit the first block. Introduce DLT and qualify transparency, immutability, security and decentralization.

## Module 3: Blockchain Networking & Consensus

10:40–11:15

Follow P2P → node roles → propagation → validation → consensus → PoW → PoS → network types. Use the propagation model to turn off node B and send the request through another reachable path. Turn off the origin to stop broadcasting; restore all nodes to reset the network. The model is not live networking or a consensus protocol. In the unaffordable-request case, receiving peers reject the request instead of forwarding it. Spend only a few minutes on the easy real-hashing nonce puzzle.

## Module 4: Cryptography, Wallets & Smart Contracts

11:15–11:45

Introduce cryptographic tools before keys, signatures, wallets and addresses. Demonstrate signing a real message and rejecting edited content. A public address is not spending authority; a wallet manages keys rather than holding coins inside a file. Introduce Ethereum, contracts, DApps and Fabric at beginner level. Do not start a separate Ethereum project or ask students for real funds.

## Module 5: Blockchain Applications & Use Cases

11:45–12:30

Follow banking → supply chain → identity → voting → healthcare/insurance → opportunities and limitations. Use Walmart as a dated traceability case and TradeLens as a discontinued governance/commercial-viability case. Blockchain does not guarantee truthful input, privacy or secure voting. Break 12:05–12:15. Use the database comparison to close the morning. Lunch 12:30–13:30.

## Module 6: Introduction to Hyperledger Fabric

13:30–14:10

Explain Fabric in the exact supplied order. Separate logical organizations from the single laptop hosting the test network. Ubuntu/WSL runs the tools; Docker runs services; Node.js connects the browser application through Fabric Gateway. Use the role-play and labeled transaction-flow model before the real application. In the prepared Fabric app initialize 100/50, transfer 20, wait for valid commit and a real transaction ID, read 80/70, then demonstrate insufficient funds and a wrong signer. Models are not live Fabric evidence.

## Module 7: Mini Project – Blockchain-Based Digital Wallet & Transaction System

14:10–16:00

Follow the supplied project headings. The practical is real Fabric with application-defined demo credits. Its wallet IDs are labels bound to actual certificates and MSPs, not public-chain cryptocurrency addresses. Fabric forms blocks, calculates hashes and verifies its ledger; students do not implement another blockchain in chaincode. Installation belongs before the event. Break 14:35–14:45; use 14:45–15:00 for starter/readiness. Protect 15:00–16:00 for students: predict 10 minutes, complete TODOs 15, deploy/launch 10, test 15, explain 10. Swap the driver after the first valid transfer.

## Module 8: Project Demonstration & Conclusion

16:00–16:30

Follow demonstration → verification → real-world implementation → security → learning pathways → Q&A. Ask the quieter partner to explain who signed, what changed and why a request failed. A real commit result and a fresh balance query are the evidence; a browser animation is not. Discuss authentication, key management, privacy, governance and operational resilience as future work. Finish by 16:30.

## Credentials and permissions
The downloaded kit binds Alice to a prepared Org1 client certificate and Bob to an Org2 client certificate. The contract checks certificate fingerprint and MSP against the sender record. The exact Org1 test administrator may initialize once. The demo selector is not production authentication; private keys stay in the local backend.

## Recovery without hiding the lesson
Use npm run use:solution only after saving student edits. Redeploy with the next CC_SEQUENCE if a contract already exists. Existing balances persist across upgrades. A full network reset deletes sample channels, ledger data and test identities; stop the Node app first and use reset only for this disposable network.

## When Docker or connectivity fails
Check Docker Desktop is running with Ubuntu integration enabled. Use npm run check in Ubuntu. Keep a prepared partner laptop available. The presentation's credits and transaction labs are labeled simulations; never present their output as a real Fabric commit.

## Evidence to prepare before the event
Rehearse the actual downloaded kit on a fresh prepared environment. Verify initialization, two transfer directions, invalid amounts, insufficient funds and wrong-signing-identity rejection. Capture screenshots and a recording of this same Fabric project after that rehearsal. The previous Solidity recordings are not Fabric evidence.

## Exit questions
What changed? Who signed? Which rule rejected the invalid action? Why does the combined balance stay 150? When would a database be sufficient? Ask the partner who typed less to explain.
