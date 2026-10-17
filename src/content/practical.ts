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
  "# Instructor guide: Campus Credits Transfer\n\n## Protect the teaching rhythm\nUse explain → predict → demonstrate → students try → discuss. Pause every 10–15 minutes. Ask for a show of hands before revealing a quiz answer. Keep slides light; the notes carry the explanation.\n\n## Morning: build the foundation\n10:00–10:35: trust, conflicting records and the database tradeoff. 10:35–11:10: real hashes and a toy chain. Break until 11:20. 11:20–12:10: identities, real browser signatures, queries, transactions and contract rules. 12:10–12:35: Fabric roles and a four-volunteer network role-play. Lunch until 13:15.\n\n## Afternoon: follow a transaction\n13:15–13:40: current state versus block history and the manual Fabric flow explorer. Ask whether the balance changed at endorsement. Only valid commit applies the writes. A rejected proposal need not appear in the ledger.\n\n## Explain and demonstrate the project\n13:40–14:05: demo credits, two wallets, the browser/backend/contract boundary and a tiny JavaScript primer. 14:05–14:25: use the real downloaded kit to show 100/50 → 80/70 → 90/60, then insufficient funds. Break until 14:35.\n\n## Readiness before 3\n14:35–15:00: locate the three TODOs and explain the supplied identity check. Each prepared laptop/pair needs cached dependencies and the runtime image. Installation belongs before the workshop. Start the network; students deploy their completed rule during the final hour.\n\n## The final hour\n15:00–15:10 predict. 15:10–15:25 complete the three TODOs. 15:25–15:35 deploy and launch. 15:35–15:50 test success, invalid input and the wrong signer. 15:50–16:00 pairs demonstrate and answer the exit questions. Swap the keyboard after the first valid transfer.\n\n## Credentials and permissions\nThe downloaded kit binds Alice to a prepared Org1 client certificate and Bob to an Org2 client certificate. The contract checks certificate fingerprint and MSP against the sender record. The exact Org1 test administrator may initialize once. The demo selector is not production authentication; private keys stay in the local backend.\n\n## Recovery without hiding the lesson\nUse npm run use:solution only after saving student edits. Redeploy with the next CC_SEQUENCE if a contract already exists. Existing balances persist across upgrades. A full network reset deletes sample channels, ledger data and test identities; stop the Node app first and use reset only for this disposable network.\n\n## When Docker or connectivity fails\nCheck Docker Desktop is running with Ubuntu integration enabled. Use npm run check in Ubuntu. Keep a prepared partner laptop available. The presentation's credits and transaction labs are labeled simulations; never present their output as a real Fabric commit.\n\n## Evidence to prepare before the event\nRehearse the actual downloaded kit on a fresh prepared environment. Verify initialization, two transfer directions, invalid amounts, insufficient funds and wrong-signing-identity rejection. Capture screenshots and a recording of this same Fabric project after that rehearsal. The previous Solidity recordings are not Fabric evidence.\n\n## Exit questions\nWhat changed? Who signed? Which rule rejected the invalid action? Why does the combined balance stay 150? When would a database be sufficient? Ask the partner who typed less to explain.";
