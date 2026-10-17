# Instructor guide: Campus Credits Transfer

## Protect the teaching rhythm
Use explain → predict → demonstrate → students try → discuss. Pause every 10–15 minutes. Ask for a show of hands before revealing a quiz answer. Keep slides light; the notes carry the explanation.

## Morning: build the foundation
10:00–10:35: trust, conflicting records and the database tradeoff. 10:35–11:10: real hashes and a toy chain. Break until 11:20. 11:20–12:10: identities, real browser signatures, queries, transactions and contract rules. 12:10–12:35: Fabric roles and a four-volunteer network role-play. Lunch until 13:15.

## Afternoon: follow a transaction
13:15–13:40: current state versus block history and the manual Fabric flow explorer. Ask whether the balance changed at endorsement. Only valid commit applies the writes. A rejected proposal need not appear in the ledger.

## Explain and demonstrate the project
13:40–14:05: demo credits, two wallets, the browser/backend/contract boundary and a tiny JavaScript primer. 14:05–14:25: use the real downloaded kit to show 100/50 → 80/70 → 90/60, then insufficient funds. Break until 14:35.

## Readiness before 3
14:35–15:00: locate the three TODOs and explain the supplied identity check. Each prepared laptop/pair needs cached dependencies and the runtime image. Installation belongs before the workshop. Start the network; students deploy their completed rule during the final hour.

## The final hour
15:00–15:10 predict. 15:10–15:25 complete the three TODOs. 15:25–15:35 deploy and launch. 15:35–15:50 test success, invalid input and the wrong signer. 15:50–16:00 pairs demonstrate and answer the exit questions. Swap the keyboard after the first valid transfer.

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
