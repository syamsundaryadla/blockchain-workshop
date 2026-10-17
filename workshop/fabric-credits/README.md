# Campus Credits Transfer

A local Hyperledger Fabric workshop project. Demo credits are application records, not real money or a native Fabric currency.

## Before workshop day

Complete the supplied Windows/WSL installation guide. In **Ubuntu**, use Node.js 22.23.3 and the pinned Fabric 2.5.16 / CA 1.5.17 sample setup. Keep Docker Desktop running with Ubuntu integration enabled.

Unzip this kit into `~/campus-credits` in Ubuntu. Open that folder in VS Code using its WSL extension. Run from the kit folder:

```bash
npm ci
npm run prepare:kit
npm run check
docker pull hyperledger/fabric-nodeenv:2.5
npm test
```

The Node runtime image is downloaded in advance. Application and chaincode dependencies are locked. Set `FABRIC_SAMPLES` to your full sample path only if you used a different installation folder.

## Instructor demonstration

The active rule starts as the completed solution. In Ubuntu:

```bash
npm run network
npm run deploy
npm start
```

Open **http://127.0.0.1:3200** in your Windows browser. Click **Initialize demo once**. Read Alice 100 / Bob 50. As Alice, send Bob 20: 80 / 70. As Bob, send Alice 10: 90 / 60. The UI confirms success only after a valid Fabric commit and displays its transaction ID.

## Student exercise: final hour

The environment and network are prepared before 15:00. `npm run use:starter` replaces the active transfer-rules file, so save any work before using it.

```bash
npm run use:starter
```

Edit `chaincode/lib/transfer-rules.js`: validate a positive whole-number amount, reject insufficient funds, and calculate both resulting balances. Identity ownership checks, ledger writes, and the UI are already supplied.

```bash
npm test
npm run deploy
npm start
```

Initialize once, transfer 20, switch the identity, and send 10 back. Test a rejected amount and **Load the forbidden test**. That action selects Bob as signer while requesting a debit from Alice; press Request transfer to exercise the actual contract permission check.

If a version of `campuscredits` was already deployed on this network, redeploy with the **next** sequence:

```bash
CC_SEQUENCE=2 npm run deploy
```

Use 3 for the next upgrade, and so on. An upgrade preserves the ledger; do not initialize it again. The two wallets stay bound to their original certificates. If certificates are regenerated, stop the application and reset only the disposable practice network.

## Recovery and reset

`npm run use:solution` replaces the active file with the completed rule. Deploy again with the next sequence if required. This is a recovery path, not the completion criterion: each pair must explain one transfer and one rejection.

Stop the application with Ctrl+C before resetting:

```bash
npm run reset:network
```

This deletes the sample network, all its channels, its ledger data and generated identities. Do not use it against a network containing work you need. Downloads and Docker images stay. Start a fresh network, deploy sequence 1, restart the backend, and initialize once.

## Boundaries

- Each laptop/pair runs a separate local test network.
- Signing credentials remain in Ubuntu, never in the browser. The selector chooses prepared demo identities and is not production authentication.
- The exact `org1admin` enrollment is allowed to initialize this demo once. Production administrative policy is outside this workshop.
- Endorsement prepares read/write sets; a valid commit applies the balance changes.
- A proposal rejection is not automatically a recorded blockchain transaction.
- The browser rehearsal in the presentation is a simulation. This kit uses the real Fabric Gateway API and does not fall back to fake transactions.

## Troubleshooting

Docker unavailable: open Docker Desktop, enable Ubuntu WSL integration, and reopen Ubuntu. Missing wallets: deploy and initialize once. An incomplete TODO error: finish the rule, test and deploy it. A sequence/definition error: use the next deployment sequence. A certificate or peer-connection error after reset: restart the Node backend so it reloads credentials.

Save the full error and ask the instructor before deleting data. Never share private-key files.
