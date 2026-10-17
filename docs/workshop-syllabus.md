# Blockchain to Hyperledger Fabric: Campus Credits Transfer

Final teaching scope and project specification · 17 October 2026

## Workshop at a glance

- Audience: first- and second-year students; no blockchain experience required.
- Time: 10:00 a.m.–4:00 p.m.; 300 minutes of teaching and practical work, a 40-minute lunch, and two 10-minute breaks.
- Progression: understand the concepts in the morning, follow a working Fabric application in the afternoon, and build and test in the final hour.
- Project: transfer application-level demo credits between two identity-bound wallets on Hyperledger Fabric.
- Setup: each student prepares their Windows/WSL laptop before workshop day using the installation guide. Pair work is encouraged; pairs swap the keyboard during the practical.
- Teaching style: short explanations, visual predictions, live demonstrations, student attempts, and discussion. Most cycles should take 10–15 minutes.

Success means students can explain what a transaction changes, which identity may request it, and why a forbidden transaction fails.

This specification replaces the earlier Remix/Solidity campus asset-register syllabus. The presentation, student kit, notes, and project now follow this scope. Legacy Solidity files and recordings are retained outside the active learning path and are not Fabric evidence. Live Fabric deployment still requires a running Docker Desktop engine with Ubuntu integration and a full instructor rehearsal.

## Timetable

| Time | Session | Visual or live activity | Checkpoint |
|---|---|---|---|
| 10:00–10:10 | Welcome and the day's goal | Show the completed app briefly; ask where a digital balance is recorded. | Describe the goal in one sentence. |
| 10:10–10:35 | Why blockchain? | Compare one shared spreadsheet with copies held by several organizations; let volunteers propose conflicting edits. | Explain who is trusted to change a record, and when a database is enough. |
| 10:35–11:10 | Hashes, blocks, and tamper evidence | Change one character in a hash demo; link three blocks; edit an earlier record and inspect broken verification. | Explain that a hash is a fingerprint, not encryption, and tamper evidence does not establish truthful input. |
| 11:10–11:20 | Break | | |
| 11:20–11:50 | Identities, signatures, and transactions | Follow a signed request from a user; compare copying a public identifier with possessing its signing key. | Explain the difference between identity, a transaction, and permission to perform an action. |
| 11:50–12:10 | Smart contracts and shared agreement | Turn a simple transfer into if/then rules; contrast a normal query with a state-changing request. | Predict the rules needed before changing two balances. |
| 12:10–12:35 | Meet Hyperledger Fabric | Build a network diagram with two organizations, their peers, an orderer, a channel, and certificate-based identities. | Identify the role of each component; understand that Fabric does not require cryptocurrency mining. |
| 12:35–13:15 | Lunch | | |
| 13:15–13:40 | A Fabric transaction, step by step | Animate proposal → execution and endorsement → ordering → validation and commit; contrast current balances with the block history. | Explain why endorsement alone is not a committed balance change. |
| 13:40–14:05 | Explain Campus Credits Transfer | Show the app, two wallet records, and the transfer rules; introduce only the JavaScript needed to read a record, check a condition, and update a number. | Predict Alice and Bob's balances after a transfer. |
| 14:05–14:25 | Instructor live demonstration | Start the prepared app, query balances, transfer 20, wait for commit, refresh, and attempt an invalid transfer. | Distinguish a successful committed transfer from a rejected request. |
| 14:25–14:35 | Break | | |
| 14:35–15:00 | Guided code walkthrough and readiness | Connect the browser action to the backend and contract; explain starter TODOs and run the readiness check on students' prepared environments. | Locate the validation and balance-update sections; have the required dependencies and runtime images cached. |
| 15:00–16:00 | Students build, test, and explain | Complete the small contract exercise, deploy with the prepared script, use the supplied UI, and test success and failure cases. | Demonstrate a valid transfer, a rejected transfer, and explain the ownership rule. |

## Six teaching chapters

1. **Why a shared ledger?** Records, trust, multiple organizations, database tradeoffs.
2. **How changes become visible.** Hashes, linked blocks, tamper evidence, truthful-input limitations.
3. **Who requests a change?** Identities, signing keys, signatures, queries, transactions, permission checks.
4. **How Fabric processes it.** Smart contracts/chaincode, organizations, peers, orderer, channel, CA, MSP, current state, and the transaction journey.
5. **Understand the application.** Credits, two wallet records, a Node.js connection, a small JavaScript contract, and committed results.
6. **Build and prove it.** Complete the starter, deploy, transfer, reject invalid actions, and explain the result.

Introduce CA as the certificate issuer and MSP as the organization's membership/trust rules. Students do not configure either from scratch. Explain consensus as agreement about the transaction sequence; the test network's single ordering node is a learning simplification, not a demonstration of production fault tolerance.

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

## Exactly what students do in the final hour

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

- A visual presentation with six chapters, concise labels, gradual reveals, and presenter notes. Use topic-specific infographics rather than repeated illustrations.
- A student starter and completed JavaScript chaincode solution.
- Prepared Node.js/Fabric Gateway backend, HTML/CSS/JavaScript UI, and demonstration identities.
- A single documented setup path, deployment/start commands, and a clearly labeled reset command for the disposable network.
- A numbered practical handout with exact expected balances and error cases.
- An instructor guide with timing, questions, recovery steps, and common WSL/Docker failures.
- Screenshots and a recording from the same real Fabric project. Label any browser-only fallback as a simulation.

Pre-workshop installation uses the shared installation guide: Ubuntu 24.04 under WSL 2, Node.js 22.23.3, Fabric 2.5.16, Fabric CA 1.5.17, and sample revision `3c63eac4e303e8348c42637d7ed337727645b9ce`. Use matching binaries/images and lock application dependencies when preparing the project.

Do not schedule installation during the teaching day. Before the workshop, rehearse the practical on the same starter and cache required npm dependencies and runtime images. Use the 14:35 readiness slot to recover an environment, not download the entire toolchain.

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
