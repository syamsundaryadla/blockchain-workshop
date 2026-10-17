# Campus Credits Transfer — student practical

10:00–16:00 workshop. Student build: 15:00–16:00.

Demo credits are application-defined records on Hyperledger Fabric, not real money. Work in pairs and swap the keyboard after the first successful transfer.

## Setup

Use the installation PDF before workshop day: Ubuntu 24.04 on WSL 2, Node.js 22.23.3, Fabric 2.5.16, CA 1.5.17. Each laptop/pair has its own network. Keep private keys in the backend. The Alice/Bob selector uses prepared test credentials, not production login.

## 1. Before the day: finish the installation check

Use the installation PDF. Complete its real Fabric write/read check in Ubuntu. Install and unzip this project kit before the workshop.

Expected result: WSL 2, Docker integration, Node 22.23.3, Fabric 2.5.16 and CA 1.5.17 are ready.

## 2. Prepare the project folder in Ubuntu

Open the downloaded kit in Ubuntu, preferably ~/campus-credits. Install the locked dependencies and cache the JavaScript runtime image before workshop day.

```bash
npm ci
npm run prepare:kit
npm run check
docker pull hyperledger/fabric-nodeenv:2.5
```

Expected result: Environment checks pass. Both application and chaincode dependencies are available.

## 3. Start the prepared network

During the readiness slot, keep Docker Desktop running and start the two-organization test network. Use a separate Ubuntu terminal for the application later.

```bash
npm run network
```

Expected result: Org1 peer, Org2 peer, the orderer and certificate authorities are running on mychannel.

## 4. 15:00 — Predict before you code

Write down Alice 100 / Bob 50. Predict both balances after Alice sends 20, then Bob sends 10 back. Explain who must sign each request.

Expected result: First 80 / 70, then 90 / 60. Combined credits stay at 150.

## 5. 15:10 — Open the starter

Install the starter, then edit chaincode/lib/transfer-rules.js. This command replaces that file; save any existing changes first.

```bash
npm run use:starter
```

Expected result: Three TODO groups are visible. The starter deliberately rejects transfers until they are completed.

## 6. Complete TODO 1: check the amount

Accept only strictly parsed positive whole-number text. Convert it to a number and reject unsafe integers. Reject zero, negatives, fractions, blank input and text such as 20abc.

Expected result: Invalid amounts throw an error before any balance updates are prepared.

## 7. Complete TODO 2: check the funds

Compare the amount with senderBalance. If the amount is greater, throw an Insufficient credits error.

Expected result: A wallet with 80 cannot send 1,000.

## 8. Complete TODO 3: calculate both balances

Subtract from the sender, add to the recipient, check that resulting balances remain safe integers, and return amount, senderBalance and recipientBalance.

```bash
npm test
```

Expected result: The rule tests pass. A transfer of 20 from 100 / 50 returns 80 / 70.

## 9. 15:25 — Deploy your completed rule

Deploy to the prepared channel. If campuscredits was already deployed on this network, use the next sequence: CC_SEQUENCE=2 npm run deploy, then 3 for the next upgrade. An upgrade preserves existing balances.

```bash
npm run deploy
```

Expected result: campuscredits is committed on mychannel. No TODO or deployment error remains.

## 10. Start the real application

From the kit folder, start the backend. Open http://127.0.0.1:3200 in your Windows browser. The application uses real Fabric; it does not fall back to a simulation.

```bash
npm start
```

Expected result: The Campus Credits interface opens. No balances are invented if the ledger cannot be reached.

## 11. Initialize once and make a successful transfer

For a fresh ledger, click Initialize demo once. Keep Alice as signing identity and debit wallet; send Bob 20. Wait for valid commit, then read the balances again.

Expected result: Initially 100 / 50; after the committed transfer 80 / 70. A committed transaction ID is displayed.

## 12. Swap the driver and transfer back

The other partner takes the keyboard. Select Bob as signing identity and debit wallet, choose Alice as recipient, and send 10.

Expected result: Alice 90 / Bob 60. Bob may spend his own wallet, not Alice's.

## 13. 15:35 — Prove a request can fail

Try 1,000, then zero or a fraction. Use Load the forbidden test to select Bob as signer while debiting Alice; press Request transfer. Read both balances after each failure.

Expected result: Rejections leave balances at 90 / 60. The ownership error comes from the contract, not just a disabled browser control.

## 14. 15:50 — Demonstrate and explain

Show one valid committed transfer and one rejection. Explain which identity signed, which rule rejected the invalid action, and why the total stays 150. Compare this shared-network example with a database.

Expected result: Both partners can explain the result. Understanding is the goal, not copying a completed file.

## Failure checklist

| Test | Try this | Expected |
|---|---|---|
| Valid transfer | Alice signs; Alice → Bob, 20 | Valid commit; 80 / 70 |
| Return transfer | Bob signs; Bob → Alice, 10 | Valid commit; 90 / 60 |
| Insufficient funds | Send 1,000 | Rejected; balances unchanged |
| Invalid amount | 0, -1, 2.5, blank, or 20abc | Positive whole-number amount required |
| Wrong identity | Bob signs; debit Alice | Permission denied |
| Same wallet | Alice → Alice | Different recipient required |
| Unknown wallet | Use a missing recipient in the test helper | Wallet not found |
| Repeat initialization | Initialize again | Demo already initialized |

## Recovery

Save your edits first. `npm run use:solution` replaces the active rule with the completed one. Deploy with the next sequence if required. You must still explain one valid transfer and one rejection.

`npm run reset:network` deletes the sample network, all its channel ledgers and generated test identities. Stop the Node app first. Use it only for this disposable workshop setup. Restart from sequence 1 and initialize once on a fresh ledger. Upgrading a contract does not reset balances or require reinitialization.

The presentation's browser rehearsal is a simulation. The downloaded Node application uses Fabric Gateway and shows a transaction ID only after valid commit. An unconfirmed or timed-out request must be checked by querying the ledger; do not assume it failed before retrying.
