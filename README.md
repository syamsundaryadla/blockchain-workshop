# Blockchain Lab — Hyperledger Fabric Workshop

A visual, interactive 9:30 a.m.–4:30 p.m. workshop for first- and second-year students. Learn concepts first, follow a real Fabric application after lunch, reserve 3–4 p.m. for the student practical, and close with demonstrations and Q&A by 4:30.

## Presentation and student resources

- 91 slides across eight modules with presenter notes, audience predictions, reasoning reveals and a four-volunteer network role-play.
- Opening order: title only; a short presenter introduction; then the first concept on slide 3. Public presenter details and links live in `src/content/presenter.ts`.
- Seven experiments: real SHA-256, linked-block tampering, manual P2P propagation, a real-hashing toy proof-of-work puzzle, real browser ECDSA signatures, a Fabric transaction model, and a clearly labeled credits rehearsal.
- A complete downloadable Campus Credits project: JavaScript chaincode, starter/solution rule, Node.js/Fabric Gateway backend, HTML/CSS/JavaScript UI, scripts and tests.
- A numbered student handout, instructor notes, and the compiled Windows/WSL installation PDF.

The finalized [syllabus and project scope](docs/workshop-syllabus.md) is the teaching reference. The [installation guide](output/pdf/fabric-student-installation-guide.pdf) and [LaTeX source](output/pdf/fabric-student-installation-guide.tex) are available separately.

## Run the presentation

```bash
npm install
npm run dev -- --port 3100
```

Open http://127.0.0.1:3100. This is the presentation website; it does not require a running Fabric network. The in-browser transaction and credits models explicitly identify themselves as simulations.

For an isolated production preview in Windows PowerShell:

```powershell
$env:BLOCKCHAIN_BUILD_DIR=".next-production"
npm run build
npm run start -- --port 3100
```

Use the same build-directory variable for build and start.

## Workshop routes

- `/` and `/presentation`: slides, chapter outline, notes and presentation mode.
- `/workshop`: schedule, 14-step practical, project ZIP, rule files and installation PDF.
- `/workshop/instructor`: timing, teaching cues and recovery instructions.
- `/workshop/replay`: labeled interactive fallback models, not saved Fabric execution evidence.
- `/simulations`: the seven core experiments.
- `/mini-project`: the in-memory credits rehearsal, with a link to the separately started real application.

Keyboard: arrows to navigate, M/G for outline, N for notes, F for presentation mode, Escape to close a dialog or exit presentation mode.

## Run the real Fabric project

Students install the tools in Ubuntu on WSL 2 before workshop day: Node.js 22.23.3, Fabric 2.5.16, CA 1.5.17 and the sample revision pinned in the installation guide. Docker Desktop must be running with Ubuntu integration enabled.

Open `workshop/fabric-credits` in Ubuntu, or unzip the student download into `~/campus-credits`:

```bash
npm ci
npm run prepare:kit
npm run check
npm test
npm run network
npm run deploy
npm start
```

Open http://127.0.0.1:3200, initialize once, and use the real application. It only confirms transfers after a valid Fabric commit. A network error does not cause a fallback to invented balances or transaction IDs.

See the [project README](workshop/fabric-credits/README.md) for advance preparation, the starter exercise, upgrades and reset behavior. Students edit three TODO groups in `chaincode/lib/transfer-rules.js`; identities, ledger plumbing and the interface are supplied. Switching to starter or solution replaces that active file, so save edits first. Internet access can still be needed for a first container build; rehearse the full deployment before the event.

The credits are application records, not real money or a native Fabric currency. The local identity selector chooses prepared credentials and is not production authentication. Private keys remain in the backend. Each laptop or pair uses a separate test network.

## Verification and packaging

```bash
npm test
npm run typecheck
npm run test:fabric
npm run build
npm run package:workshop
```

Install the kit dependencies before `test:fabric`. Its six tests exercise contract logic using a stubbed ledger and real test certificate parsing; they do not verify Fabric's ordering or commit validation. They cover authorized initialization, both transfer directions, wrong certificate/MSP, invalid amounts, insufficient funds, missing wallets and unchanged state on rejection. The kit was also checked with Ubuntu's Node runtime and its shell scripts parsed successfully.

The website tests verify the timetable, all slide visuals, synchronized instructions and arithmetic. Browser acceptance covers all slides, real signing/hash demonstrations, tampering, the transaction model, rehearsal permissions, downloads and mobile widths. The legacy Solidity tests remain as regressions for retained files, outside the active teaching path.

**Live-network verification is outstanding:** Docker Desktop's Linux engine was not running and Ubuntu Docker integration was unavailable in this development environment. Do not label the kit as a fully rehearsed Fabric deployment until the actual starter-to-commit flow passes on the prepared setup. Capture fresh screenshots and a recording from that same run before the event.

Packaging requires Python 3 and only its standard library. The packager copies starter/solution downloads, refreshes the installation PDF and builds the ZIP while excluding installed dependencies and private-key formats. Commit both project lockfiles. Do not ship generated network credentials.

## Content structure

The exact organizer-supplied headings and topic order are stored in `src/content/syllabus.ts` and checked by the content tests. Concept definitions stay short; the presenter notes carry detail. Node failure controls, transaction/block/chain animations and the Walmart mango example support the live explanations.

- `src/content/beginner-workshop.ts`: lesson ideas, activities, presenter cues, schedule and platform versions.
- `src/content/modules.ts` and `quizzes.ts`: eight modules and prediction checks.
- `src/components/presentation/FoundationDiagrams.tsx and FabricWorkshopDiagrams.tsx`: topic-specific SVG infographics.
- `src/components/presentation/LessonPrompt.tsx`: audience prompt and reasoning reveal.
- `src/components/simulations`: the seven core experiments plus retained supplementary demos.
- `src/content/practical.ts`: student steps, solution excerpts and instructor notes; keep the downloadable Markdown synchronized.
- `workshop/fabric-credits`: the real Fabric project and its tests.
- `scripts/package-fabric-kit.py`: reproducible student download packaging.

Earlier Solidity contracts and local-EVM recordings are retained without links in the active workshop. They must not be described as Fabric evidence.

## References

- [Fabric transaction flow](https://hyperledger-fabric.readthedocs.io/en/release-2.5/txflow.html)
- [Fabric application guide](https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html)
- [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-2.5/prereqs.html)
