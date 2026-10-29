export interface PracticalStep {
  title: string;
  action: string;
  expected: string;
  command?: string;
}
export const PRACTICAL_STEPS: PracticalStep[] = [
  {
    title: "Before the day: finish the installation check",
    action:
      "Use the installation PDF. Complete its real Fabric write/read check in Ubuntu. Install and unzip this project kit before the workshop.",
    expected:
      "WSL 2, Docker integration, Node 22.23.3, Fabric 2.5.16 and CA 1.5.17 are ready.",
  },
  {
    title: "Prepare the project folder in Ubuntu",
    action:
      "Open the downloaded kit in Ubuntu, preferably ~/campus-credits. Install the locked dependencies and cache the JavaScript runtime image before workshop day.",
    command:
      "npm ci\nnpm run prepare:kit\nnpm run check\ndocker pull hyperledger/fabric-nodeenv:2.5",
    expected:
      "Environment checks pass. Both application and chaincode dependencies are available.",
  },
  {
    title: "Start the prepared network",
    action:
      "During the readiness slot, keep Docker Desktop running and start the two-organization test network. Use a separate Ubuntu terminal for the application later.",
    command: "npm run network",
    expected:
      "Org1 peer, Org2 peer, the orderer and certificate authorities are running on mychannel.",
  },
  {
    title: "15:00 — Predict before you code",
    action:
      "Write down Alice 100 / Bob 50. Predict both balances after Alice sends 20, then Bob sends 10 back. Explain who must sign each request.",
    expected: "First 80 / 70, then 90 / 60. Combined credits stay at 150.",
  },
  {
    title: "15:10 — Open the starter",
    action:
      "Install the starter, then edit chaincode/lib/transfer-rules.js. This command replaces that file; save any existing changes first.",
    command: "npm run use:starter",
    expected:
      "Three TODO groups are visible. The starter deliberately rejects transfers until they are completed.",
  },
  {
    title: "Complete TODO 1: check the amount",
    action:
      "Accept only strictly parsed positive whole-number text. Convert it to a number and reject unsafe integers. Reject zero, negatives, fractions, blank input and text such as 20abc.",
    expected:
      "Invalid amounts throw an error before any balance updates are prepared.",
  },
  {
    title: "Complete TODO 2: check the funds",
    action:
      "Compare the amount with senderBalance. If the amount is greater, throw an Insufficient credits error.",
    expected: "A wallet with 80 cannot send 1,000.",
  },
  {
    title: "Complete TODO 3: calculate both balances",
    action:
      "Subtract from the sender, add to the recipient, check that resulting balances remain safe integers, and return amount, senderBalance and recipientBalance.",
    command: "npm test",
    expected:
      "The rule tests pass. A transfer of 20 from 100 / 50 returns 80 / 70.",
  },
  {
    title: "15:25 — Deploy your completed rule",
    action:
      "Deploy to the prepared channel. If campuscredits was already deployed on this network, use the next sequence: CC_SEQUENCE=2 npm run deploy, then 3 for the next upgrade. An upgrade preserves existing balances.",
    command: "npm run deploy",
    expected:
      "campuscredits is committed on mychannel. No TODO or deployment error remains.",
  },
  {
    title: "Start the real application",
    action:
      "From the kit folder, start the backend. Open http://127.0.0.1:3200 in your Windows browser. The application uses real Fabric; it does not fall back to a simulation.",
    command: "npm start",
    expected:
      "The Campus Credits interface opens. No balances are invented if the ledger cannot be reached.",
  },
  {
    title: "Initialize once and make a successful transfer",
    action:
      "For a fresh ledger, click Initialize demo once. Keep Alice as signing identity and debit wallet; send Bob 20. Wait for valid commit, then read the balances again.",
    expected:
      "Initially 100 / 50; after the committed transfer 80 / 70. A committed transaction ID is displayed.",
  },
  {
    title: "Swap the driver and transfer back",
    action:
      "The other partner takes the keyboard. Select Bob as signing identity and debit wallet, choose Alice as recipient, and send 10.",
    expected: "Alice 90 / Bob 60. Bob may spend his own wallet, not Alice's.",
  },
  {
    title: "15:35 — Prove a request can fail",
    action:
      "Try 1,000, then zero or a fraction. Use Load the forbidden test to select Bob as signer while debiting Alice; press Request transfer. Read both balances after each failure.",
    expected:
      "Rejections leave balances at 90 / 60. The ownership error comes from the contract, not just a disabled browser control.",
  },
  {
    title: "15:50 — Demonstrate and explain",
    action:
      "Show one valid committed transfer and one rejection. Explain which identity signed, which rule rejected the invalid action, and why the total stays 150. Compare this shared-network example with a database.",
    expected:
      "Both partners can explain the result. Understanding is the goal, not copying a completed file.",
  },
];
export const PRACTICAL_TESTS = [
  ["Valid transfer", "Alice signs; Alice → Bob, 20", "Valid commit; 80 / 70"],
  ["Return transfer", "Bob signs; Bob → Alice, 10", "Valid commit; 90 / 60"],
  ["Insufficient funds", "Send 1,000", "Rejected; balances unchanged"],
  [
    "Invalid amount",
    "0, -1, 2.5, blank, or 20abc",
    "Positive whole-number amount required",
  ],
  ["Wrong identity", "Bob signs; debit Alice", "Permission denied"],
  ["Same wallet", "Alice → Alice", "Different recipient required"],
  [
    "Unknown wallet",
    "Use a missing recipient in the test helper",
    "Wallet not found",
  ],
  ["Repeat initialization", "Initialize again", "Demo already initialized"],
];
export const PROJECT_EXCERPTS = {
  amount:
    'if (typeof rawAmount !== "string" || !/^[1-9][0-9]*$/.test(rawAmount)) {\n    throw new Error("Use a positive whole-number amount");\n  }\n  const amount = Number(rawAmount);\n  if (!Number.isSafeInteger(amount)) {\n    throw new Error("Amount is too large");\n  }',
  funds:
    'if (senderBalance < amount) {\n    throw new Error("Insufficient credits");\n  }',
  balances:
    'const nextSender = senderBalance - amount;\n  const nextRecipient = recipientBalance + amount;\n  if (!Number.isSafeInteger(nextSender) || !Number.isSafeInteger(nextRecipient)) {\n    throw new Error("Resulting balance is too large");\n  }\n  return { amount, senderBalance: nextSender, recipientBalance: nextRecipient };',
};
export const INSTRUCTOR_GUIDE =
  "# Instructor guide: Blockchain Technology Workshop\n\n## Teaching method\nUse the supplied headings in the supplied order. Define unfamiliar terms in one or two sentences, then use the diagram and a short prediction. Animations start paused and support manual steps. Keep a checkpoint every 10–15 minutes.\n\n## Pacing the one-day workshop\n\nThe 91 slides are visual steps, not 91 separate lectures. Use the subtopic labels as speaking cues and each on-screen example within the existing explanation time (usually 20–45 seconds). Reuse the same example in the next animation or experiment. Explain each concept once, then ask one short prediction.\n\n- Morning modules retain their existing time slots. Cap each hashing, propagation, mining and signature experiment at three minutes. Applications use one short example each; avoid extended case-study discussion.\n- 12:15–12:20: limitations, truthful input and database comparison. 12:20–12:30: the 12-question morning quiz, including joining and leaderboard transitions. Create the room before the slot.\n- 13:30–14:10: place the three-minute component comparison after the organization diagram and role-play, alongside the identity explanation. Reuse those examples in the real demo. Within the 40 minutes, allow about 12 minutes for terms and identities, eight for role-play and flow, five for the prepared environment and ten for the real demo, leaving five for questions.\n- 14:10–14:35: project story, architecture and transfer rules. 14:45–15:00: starter walkthrough and readiness. Treat Fabric-managed block/hash/link slides as a short recap; students only implement the three supplied TODO groups.\n- Protect 15:00–16:00 for the student build. Resolve installation issues before the event or pair with a prepared laptop.\n- 16:00–16:10: two short pair demonstrations, transaction evidence and security recap. 16:10–16:20: the 15-question afternoon quiz. 16:20–16:30: learning pathways and Q&A.\n\nBoth live quizzes use 15-second answer windows. The ten-minute slots include preparation countdowns, room joining and short leaderboard pauses. If running late, shorten repeated demonstrations and optional discussion; keep the student build hour and finish time.\n\n## Module 1: Introduction to Blockchain\n\n09:30–10:00\n\nFollow the exact six topic headings in order. Define blockchain before introducing Bitcoin and the trust problem. In Topic 4, use Play or Next step to show failures, then click any node or select it and use Turn off selected node. Restore nodes and compare the affected paths. Distributed placement alone does not guarantee fault tolerance. After Topic 6, use the Walmart mango example: the 2017 exercise was reported as six days, 18 hours and 26 minutes using existing methods, compared with a 2.2-second pilot lookup. Labels in the diagram are illustrative. Use the cited Walmart report rather than presenting the result as a universal benchmark.\n\n## Module 2: Blockchain Architecture & Working\n\n10:00–10:40\n\nDefine transaction, then play its animation: balances stay unchanged until acceptance. Define a block and animate records grouping into a candidate block. Explain the structure before SHA-256. Keep the difference between a PoW teaching nonce and Fabric block fields explicit. After hash linking and the tampering exercise, play the blockchain animation and edit the first block. Introduce DLT and qualify transparency, immutability, security and decentralization.\n\n## Module 3: Blockchain Networking & Consensus\n\n10:40–11:15\n\nFollow P2P → node roles → propagation → validation → consensus → PoW → PoS → network types. Use the propagation model to turn off node B and send the request through another reachable path. Turn off the origin to stop broadcasting; restore all nodes to reset the network. The model is not live networking or a consensus protocol. In the unaffordable-request case, receiving peers reject the request instead of forwarding it. Spend only a few minutes on the easy real-hashing nonce puzzle.\n\n## Module 4: Cryptography, Wallets & Smart Contracts\n\n11:15–11:45\n\nIntroduce cryptographic tools before keys, signatures, wallets and addresses. Demonstrate signing a real message and rejecting edited content. A public address is not spending authority; a wallet manages keys rather than holding coins inside a file. Introduce Ethereum, contracts, DApps and Fabric at beginner level. Do not start a separate Ethereum project or ask students for real funds.\n\n## Module 5: Blockchain Applications & Use Cases\n\n11:45–12:30\n\nFollow banking → supply chain → identity → voting → healthcare/insurance → opportunities and limitations. Use Walmart as a dated traceability case and TradeLens as a discontinued governance/commercial-viability case. Blockchain does not guarantee truthful input, privacy or secure voting. Break 12:05–12:15. Use the database comparison to close the morning. Lunch 12:30–13:30.\n\n## Module 6: Introduction to Hyperledger Fabric\n\n13:30–14:10\n\nExplain Fabric in the exact supplied order. Separate logical organizations from the single laptop hosting the test network. Ubuntu/WSL runs the tools; Docker runs services; Node.js connects the browser application through Fabric Gateway. Use the role-play and labeled transaction-flow model before the real application. In the prepared Fabric app initialize 100/50, transfer 20, wait for valid commit and a real transaction ID, read 80/70, then demonstrate insufficient funds and a wrong signer. Models are not live Fabric evidence.\n\n## Module 7: Mini Project – Blockchain-Based Digital Wallet & Transaction System\n\n14:10–16:00\n\nFollow the supplied project headings. The practical is real Fabric with application-defined demo credits. Its wallet IDs are labels bound to actual certificates and MSPs, not public-chain cryptocurrency addresses. Fabric forms blocks, calculates hashes and verifies its ledger; students do not implement another blockchain in chaincode. Installation belongs before the event. Break 14:35–14:45; use 14:45–15:00 for starter/readiness. Protect 15:00–16:00 for students: predict 10 minutes, complete TODOs 15, deploy/launch 10, test 15, explain 10. Swap the driver after the first valid transfer.\n\n## Module 8: Project Demonstration & Conclusion\n\n16:00–16:30\n\nFollow demonstration → verification → real-world implementation → security → learning pathways → Q&A. Ask the quieter partner to explain who signed, what changed and why a request failed. A real commit result and a fresh balance query are the evidence; a browser animation is not. Discuss authentication, key management, privacy, governance and operational resilience as future work. Finish by 16:30.\n\n## Credentials and permissions\nThe downloaded kit binds Alice to a prepared Org1 client certificate and Bob to an Org2 client certificate. The contract checks certificate fingerprint and MSP against the sender record. The exact Org1 test administrator may initialize once. The demo selector is not production authentication; private keys stay in the local backend.\n\n## Recovery without hiding the lesson\nUse npm run use:solution only after saving student edits. Redeploy with the next CC_SEQUENCE if a contract already exists. Existing balances persist across upgrades. A full network reset deletes sample channels, ledger data and test identities; stop the Node app first and use reset only for this disposable network.\n\n## When Docker or connectivity fails\nCheck Docker Desktop is running with Ubuntu integration enabled. Use npm run check in Ubuntu. Keep a prepared partner laptop available. The presentation's credits and transaction labs are labeled simulations; never present their output as a real Fabric commit.\n\n## Evidence to prepare before the event\nRehearse the actual downloaded kit on a fresh prepared environment. Verify initialization, two transfer directions, invalid amounts, insufficient funds and wrong-signing-identity rejection. Capture screenshots and a recording of this same Fabric project after that rehearsal. The previous Solidity recordings are not Fabric evidence.\n\n## Exit questions\nWhat changed? Who signed? Which rule rejected the invalid action? Why does the combined balance stay 150? When would a database be sufficient? Ask the partner who typed less to explain.\n";
