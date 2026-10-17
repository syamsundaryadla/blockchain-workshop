export interface LessonActivity {
  label: string;
  prompt: string;
  answer: string;
}
export interface BeginnerLesson {
  title: string;
  idea: string;
  scene: string;
  notes: string;
  labels?: string[];
  diagram?: number;
  layout?: "diagram" | "process" | "poster" | "code" | "code-pair" | "terminal";
  code?: string;
  secondCode?: string;
  caption?: string;
  steps?: number;
  quizIndex?: number;
  simulationType?:
    | "hasher"
    | "blockchain"
    | "signatures"
    | "fabric-flow"
    | "credits";
  activity?: LessonActivity;
}
export const WORKSHOP_SETTINGS = {
  node: "22.23.3",
  fabric: "2.5.16",
  fabricCA: "1.5.17",
  ubuntu: "24.04 LTS / WSL 2",
  samples: "3c63eac4e303e8348c42637d7ed337727645b9ce",
  environment: "Local Fabric test network",
  channel: "mychannel",
  chaincode: "campuscredits",
} as const;
export const WORKSHOP_SCHEDULE = [
  [
    "10:00–10:10",
    "Welcome & the day's goal",
    "Meet the project; make a prediction.",
  ],
  ["10:10–10:35", "Why blockchain?", "Compare conflicting records and trust."],
  [
    "10:35–11:10",
    "Hashes, blocks & tampering",
    "Change a message and edit a linked block.",
  ],
  ["11:10–11:20", "Break", ""],
  [
    "11:20–11:50",
    "Identities & transactions",
    "Sign a message; test a changed message.",
  ],
  [
    "11:50–12:10",
    "Smart contracts & agreement",
    "Invent rules for a valid transfer.",
  ],
  [
    "12:10–12:35",
    "Meet Hyperledger Fabric",
    "Become the client, peers and orderer.",
  ],
  ["12:35–13:15", "Lunch", ""],
  [
    "13:15–13:40",
    "A Fabric transaction",
    "Follow endorsement, ordering and valid commit.",
  ],
  [
    "13:40–14:05",
    "Explain the project",
    "Predict balances; meet the small JavaScript rule.",
  ],
  [
    "14:05–14:25",
    "Instructor live demonstration",
    "See a committed transfer and a rejected request.",
  ],
  ["14:25–14:35", "Break", ""],
  [
    "14:35–15:00",
    "Code walkthrough & readiness",
    "Open the starter and check the prepared tools.",
  ],
  [
    "15:00–16:00",
    "Students build, test & explain",
    "Complete three TODOs; deploy; demonstrate success and rejection.",
  ],
];
export const BEGINNER_LESSONS: BeginnerLesson[] = [
  {
    title: "Block chain fundamentals",
    idea: "",
    scene: "cover",
    notes:
      "10:00–10:10. Welcome students with no assumed blockchain background. Show the day's progression without opening code. Invite pairs to work together; each prepared laptop has its own local network. The last hour is reserved for students.",
    labels: [],
  },
  {
    title: "About me",
    idea: "Meet your workshop facilitator.",
    scene: "about-me",
    notes:
      "10:00–10:10. Introduce Syam Sundar Yadla, founder of Risenine Technologies. Briefly share your practical AI focus and Aditya University background. The slide uses public LinkedIn and company-site information. Invite students to ask questions throughout. Begin the first concept on slide 3; the full timetable is in the student kit.",
    labels: [],
  },
  {
    title: "Two people. Two different records.",
    idea: "Who decides which version everyone should trust?",
    scene: "conflict",
    notes:
      "10:10–10:35. Ask two volunteers to record a shared club expense. Give them conflicting updates. Invite the room to identify the trust problem before naming blockchain.",
    labels: ["Same event", "Different copies", "Who decides?"],
    activity: {
      label: "Discuss · 60 sec",
      prompt: "Two copies disagree. Who gets the final say?",
      answer:
        "That depends on the trust model. First identify who is authorized to maintain or approve the record.",
    },
  },
  {
    title: "A database is often enough.",
    idea: "One trusted operator can keep an excellent record.",
    scene: "database",
    notes:
      "Compare a college's own attendance register with records shared by several independent institutions. Blockchain is a tradeoff, not an automatic upgrade. A database can also have permissions and audit logs.",
    labels: ["Trusted operator", "Permissions", "Audit log"],
    activity: {
      label: "Choose · 30 sec",
      prompt: "Would you use a blockchain for your personal to-do list?",
      answer:
        "Usually a simple app or database is enough. There is no independent group that needs shared verification.",
    },
  },
  {
    title: "Shared records. Shared rules.",
    idea: "Organizations keep copies and agree how changes are accepted.",
    scene: "shared",
    notes:
      "Use three volunteers as independent organizations. Read the same proposed update aloud. Explain replicated records and agreed validation rules; independent copies alone do not establish agreement.",
    labels: ["Replicated records", "Agreed rules", "Known responsibilities"],
    activity: {
      label: "Role-play · 2 min",
      prompt:
        "Three organizations receive different updates. Are copies alone enough?",
      answer:
        "No. They also need agreed rules and a protocol for accepting a sequence of changes.",
    },
  },
  {
    title: "Would you choose blockchain?",
    idea: "Vote first. Explain the trust assumption.",
    scene: "decision",
    notes:
      "Ask for a show of hands before selecting an answer. The goal is a reasoned tradeoff, not memorizing a slogan. Have one student explain the database option.",
    labels: [],
    quizIndex: 0,
  },
  {
    title: "A fingerprint for a message.",
    idea: "The same input gives the same SHA-256 output.",
    scene: "hash",
    notes:
      "10:35–11:10. Introduce a hash as a digital fingerprint. It is deterministic and fixed length. Similar-looking messages need not have similar hashes. Avoid promising that collisions are mathematically impossible.",
    labels: ["Input", "SHA-256", "256-bit fingerprint"],
    diagram: 4,
    activity: {
      label: "Predict · 30 sec",
      prompt: "Will the same message produce the same fingerprint tomorrow?",
      answer:
        "Yes, with the same bytes and hash algorithm. Changing whitespace or letter case changes the input.",
    },
  },
  {
    title: "Change one letter. Predict the result.",
    idea: "Try your own message in the hash lab.",
    scene: "hash-lab",
    notes:
      "Ask the room to predict before typing. Change only one character, then compare the full outputs. This demo calculates real SHA-256 hashes in the browser. Let pairs suggest their own messages.",
    labels: [],
    simulationType: "hasher",
  },
  {
    title: "A hash is not a secret message.",
    idea: "Fingerprinting and encryption solve different problems.",
    scene: "hash-vs-encryption",
    notes:
      "Contrast verifying that a file changed with encrypting content for an authorized reader. A hash is not decoded back into the original. Hashing predictable data does not make it confidential.",
    labels: ["Integrity check", "Not encryption", "Not automatic privacy"],
    activity: {
      label: "Discuss · 30 sec",
      prompt: "Does hashing an exam answer keep it secret?",
      answer:
        "Not reliably. Predictable inputs can be guessed and hashed. Integrity is different from confidentiality.",
    },
  },
  {
    title: "Blocks remember their predecessor.",
    idea: "A link carries the previous block's fingerprint.",
    scene: "block",
    notes:
      "Build three blocks visually. Point to data, the previous hash and current hash. This is an introductory model; real block formats and validation rules are richer. This model shows hash links; it does not implement Fabric consensus.",
    labels: ["Records", "Previous hash", "Current hash"],
    diagram: 10,
    activity: {
      label: "Point it out · 30 sec",
      prompt: "Which field links this block to the one before it?",
      answer:
        "The previous block's hash. Changing earlier data affects verification of the chain.",
    },
  },
  {
    title: "Edit an earlier block.",
    idea: "Which verification fails first?",
    scene: "chain-lab",
    notes:
      "Let a volunteer edit an earlier transaction in the toy chain. Inspect the failed hash and dependent links. Recomputing all local hashes does not make a rewritten history acceptable to an actual network. This simplified model does not implement a consensus protocol.",
    labels: [],
    simulationType: "blockchain",
  },
  {
    title: "A permanent record can still be wrong.",
    idea: "Tamper evidence cannot prove truthful input.",
    scene: "truth",
    notes:
      "Ask whether a false attendance entry becomes true when hashed. Separate evidence of later changes from verification of the original claim. This is also why physical handover and real-world identity require additional controls.",
    labels: ["What was entered?", "Was it changed?", "Was it true?"],
    activity: {
      label: "Discuss · 60 sec",
      prompt:
        "If someone records the wrong attendance, does the blockchain fix it?",
      answer:
        "No. The system can preserve a false claim faithfully. Truthful inputs need additional checks.",
    },
  },
  {
    title: "Can a hash prove the story is true?",
    idea: "Choose a reason, then compare with your neighbor.",
    scene: "hash-check",
    notes:
      "Before the 11:10 break, give pairs 30 seconds to explain what a hash can and cannot establish. Resume at 11:20 with the idea of identifying who requests a change.",
    labels: [],
    quizIndex: 1,
  },
  {
    title: "Who is asking for the change?",
    idea: "A name on a screen is not proof of identity.",
    scene: "identity",
    notes:
      "11:20–11:50. Distinguish a user label from signing credentials. A public identifier can be copied. Keeping a private signing key secret is what matters. Fabric later associates signing identities with certificates and organizations.",
    labels: ["Public identity", "Private signing key", "Authorization rule"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "I know your username. Can I sign as you?",
      answer: "Knowing a label is not possession of its private signing key.",
    },
  },
  {
    title: "Sign it. Change it. Check it.",
    idea: "A real browser signature makes the difference visible.",
    scene: "signature-lab",
    notes:
      "This experiment uses real browser ECDSA signing with a temporary key pair, not Fabric enrollment. Sign a short message, edit it, then verify again. The signature binds that message to the key; it does not establish the truth of the message.",
    labels: [],
    simulationType: "signatures",
  },
  {
    title: "A transaction is a request.",
    idea: "Who, what, and which rules?",
    scene: "transaction",
    notes:
      "Use a simple Alice-to-Bob request. Separate the requested change from a confirmed result. Ask which fields must be checked; remind students that a sender label is not itself authorization.",
    labels: ["Signing identity", "Requested action", "Input values"],
    activity: {
      label: "Invent a test · 60 sec",
      prompt: "What would you check before accepting a transfer request?",
      answer:
        "The actual signer, wallet ownership, recipient, amount, available funds, and the valid committed result.",
    },
  },
  {
    title: "Reading is different from changing.",
    idea: "A query reads current state. A transaction requests a change.",
    scene: "query",
    notes:
      "Point to a balance display and a transfer button. In Fabric a query evaluates chaincode without submitting its changes for ordering and commit. The normal transfer path waits for a valid commit.",
    labels: ["Read balance", "Request transfer", "Wait for commit"],
    activity: {
      label: "Choose · 30 sec",
      prompt: "Does refreshing a balance need a new transfer transaction?",
      answer:
        "No. A query reads current state without submitting new writes for ordering.",
    },
  },
  {
    title: "Turn a promise into a rule.",
    idea: "Only the owner. Positive amount. Enough balance.",
    scene: "rules",
    notes:
      "11:50–12:10. Ask the room to invent rejection cases before revealing the three rules. A smart contract is code that applies agreed rules to recorded state. It cannot make a bad business rule sensible.",
    labels: ["Who may spend?", "Is the amount valid?", "Is there enough?"],
    activity: {
      label: "Think–pair–share · 60 sec",
      prompt: "Suggest one transfer that must fail.",
      answer:
        "Examples: a negative amount, insufficient funds, an unknown recipient, or the wrong signing identity.",
    },
  },
  {
    title: "Shared agreement is a process.",
    idea: "A valid request still needs an agreed place in the history.",
    scene: "agreement",
    notes:
      "Keep consensus conceptual: participants follow a protocol to agree on a sequence of accepted records. Do not imply every blockchain uses voting, mining, or the same fault model. Introduce smart contract versus chaincode: Fabric packages contract logic as chaincode.",
    labels: ["Execute rules", "Agree sequence", "Validate and record"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Do all blockchains use mining to agree?",
      answer:
        "No. Different protocols use different agreement mechanisms. Our Fabric network has an ordering service.",
    },
  },
  {
    title: "Bob can copy Alice's name.",
    idea: "Does that let Bob spend Alice's credits?",
    scene: "identity-check",
    notes:
      "Ask students to distinguish claimed sender from actual signing identity. This is the key permission rule they will later test in the project. No cryptography mathematics is needed.",
    labels: [],
    quizIndex: 2,
  },
  {
    title: "Meet Hyperledger Fabric.",
    idea: "A permissioned network for participating organizations.",
    scene: "permissioned",
    notes:
      "12:10–12:35. Introduce Fabric as the required platform. Participation uses organizational identities and policies. No cryptocurrency, mining race, MetaMask or Solidity is needed. Permissioned does not mean every piece of data is automatically private.",
    labels: ["Known organizations", "Certified identities", "Agreed policies"],
    activity: {
      label: "Choose · 30 sec",
      prompt: "Do we need to buy cryptocurrency to use this Fabric project?",
      answer:
        "No. Our demo credits are records defined by our own application.",
    },
  },
  {
    title: "Two organizations. One shared channel.",
    idea: "Peers keep ledgers. The orderer sequences transactions.",
    scene: "fabric-network",
    notes:
      "Trace Org1 and Org2, one peer per organization, and one ordering node in this local test network. Each laptop runs its own network. Production networks use additional infrastructure and resilience; a single orderer here is a learning simplification.",
    labels: ["Org1 peer", "Org2 peer", "Ordering service"],
    activity: {
      label: "Point it out · 60 sec",
      prompt:
        "Which component runs the transfer rule? Which orders transactions?",
      answer:
        "Peers execute chaincode. The ordering service sequences endorsed transactions into blocks.",
    },
  },
  {
    title: "Become the network.",
    idea: "Four volunteers: client, two peers, and orderer.",
    scene: "roleplay",
    notes:
      "Give four volunteers role cards. The client requests a transfer; peers simulate and endorse; the orderer places it in sequence; peers validate and commit. Keep balances unchanged until the final valid commit. The audience spots a deliberately premature update.",
    labels: [
      "Client requests",
      "Peers endorse",
      "Orderer sequences",
      "Peers commit",
    ],
    activity: {
      label: "Role-play · 3 min",
      prompt: "At which moment may the volunteers change the saved balances?",
      answer:
        "Only after peers validate the ordered transaction as valid and commit its writes.",
    },
  },
  {
    title: "A certificate connects a key to an organization.",
    idea: "CA issues it. MSP defines which identities to trust.",
    scene: "certificate",
    notes:
      "Use a campus ID analogy carefully: a certificate binds a key to an identity under an issuer's trust; it is not the same as business permission to spend any wallet. Explain CA and MSP in plain terms; students will not configure them from scratch.",
    labels: ["Certificate authority", "Signed certificate", "Membership rules"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "A valid certificate means I can spend any wallet. True?",
      answer:
        "False. Membership identifies a participant; business permissions still restrict spending.",
    },
  },
  {
    title: "A channel has its own ledger.",
    idea: "Only its participating organizations share that channel.",
    scene: "channel",
    notes:
      "Before lunch, ask a volunteer to locate the channel boundary and explain peer versus orderer. A channel is not an assurance that all data within it is secret from its members. Announce lunch 12:35–13:15.",
    labels: ["mychannel", "Org1 + Org2", "One channel ledger"],
    activity: {
      label: "Teach it back · 60 sec",
      prompt: "Explain peer, orderer, and channel to your neighbor.",
      answer:
        "Peers execute and validate; the orderer sequences transactions; the channel has its own shared ledger.",
    },
  },
  {
    title: "Current balance. Recorded history.",
    idea: "Two views of the same ledger.",
    scene: "state-history",
    notes:
      "13:15–13:40. Reorient students after lunch. World state is the latest key-value data; the blockchain records blocks and transactions. Invalid ordered transactions do not update current balances. Not every proposal rejection appears on the ledger.",
    labels: ["Current state", "Transaction history", "Different jobs"],
    activity: {
      label: "Point it out · 30 sec",
      prompt: "Where would you read the latest balance?",
      answer:
        "From current state. Blocks preserve the transaction record; they serve a different purpose.",
    },
  },
  {
    title: "Follow one Fabric transaction.",
    idea: "Reveal each stage. Watch when the balance changes.",
    scene: "fabric-flow",
    notes:
      "Use the transaction explorer. Pause at endorsement and ask whether Alice's balance has changed yet. Only the valid commit applies the prepared writes. Repeat with validation failure and note that real validation can reject stale reads or insufficient endorsements.",
    labels: [],
    simulationType: "fabric-flow",
  },
  {
    title: "An endorsement is not a receipt.",
    idea: "Execution prepares a result; validation decides whether it applies.",
    scene: "endorsement",
    notes:
      "Compare proposed 80/70 with committed 100/50. Endorsements attest to a simulated result. Required endorsement policy and version checks are validated before current state changes. Do not teach the orderer as the component that executes the transfer rule.",
    labels: ["Simulated result", "Required endorsements", "Valid commit"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Can an endorsed transaction still fail later?",
      answer:
        "Yes. Peers validate endorsements and read versions before valid writes change current state.",
    },
  },
  {
    title: "Who checks which rule?",
    idea: "The contract checks spending. Peers check transaction validity.",
    scene: "permissions",
    notes:
      "Separate three layers: organizational membership, contract authorization, and endorsement/validation policy. Being a valid network member is not permission to debit someone else's wallet. Raft ordering is not a replacement for these checks.",
    labels: ["Membership", "Business permission", "Transaction validation"],
    activity: {
      label: "Discuss · 60 sec",
      prompt: "Bob is a legitimate member. Why might his transfer still fail?",
      answer:
        "He may lack permission for the requested sender wallet, have insufficient funds, or submit invalid inputs.",
    },
  },
  {
    title: "Endorsed. But not committed.",
    idea: "Which balance should the app show as confirmed?",
    scene: "fabric-check",
    notes:
      "Ask the room to vote. Explain that the application waits for valid commit and reads balances again. Concurrency/version conflicts are instructor context, not a second student project.",
    labels: [],
    quizIndex: 3,
  },
  {
    title: "Build Campus Credits Transfer.",
    idea: "Two wallets. One transfer. Clear rules.",
    scene: "project",
    notes:
      "13:40–14:05. Introduce the project fully only now. Demo credits are application records, not a native Fabric currency or real money. Alice is bound to a prepared Org1 test identity; Bob to an Org2 test identity. Organizations are not themselves wallets.",
    labels: ["Alice: 100", "Transfer: 20", "Bob: 50"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Is Fabric itself creating these credits for us?",
      answer: "No. Our contract defines the records and their rules.",
    },
  },
  {
    title: "Where did the 20 go?",
    idea: "The combined balance must stay at 150.",
    scene: "balances",
    notes:
      "Ask students to calculate both balances before revealing 80 and 70. Reverse direction: Bob sends 10, producing 90 and 60. A transfer moves existing credits; this project has no student-facing mint function.",
    labels: ["100 → 80", "50 → 70", "Total: 150"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Alice sends 20. Bob sends 10 back. What are their balances?",
      answer: "Alice 90 and Bob 60. The combined balance is still 150.",
    },
  },
  {
    title: "One click. Three layers.",
    idea: "Browser → Node.js application → Fabric.",
    scene: "architecture",
    notes:
      "Follow the transfer button through browser JavaScript, the local Node/Fabric Gateway backend and JavaScript chaincode. HTML/CSS alone do not submit a signed Fabric transaction. Private keys stay on the backend, not in the browser. The demo selector is not production authentication.",
    labels: ["HTML / CSS / JS", "Node + Gateway", "JavaScript chaincode"],
    activity: {
      label: "Point it out · 30 sec",
      prompt: "Where should private signing keys live?",
      answer:
        "In the prepared backend environment, never in browser JavaScript.",
    },
  },
  {
    title: "A wallet is a small stored record.",
    idea: "A balance belongs to an actual signing identity.",
    scene: "wallet",
    notes:
      "Introduce only the JavaScript needed: object fields, function arguments, if/throw, basic arithmetic, await. The supplied contract binds owner certificate fingerprints and MSPs. Students complete the arithmetic guards; they do not write certificate handling.",
    labels: ["Wallet ID", "Owner identity + MSP", "Whole-number balance"],
    activity: {
      label: "Discuss · 30 sec",
      prompt: "Why isn't an owner's display name enough?",
      answer:
        "The contract needs an actual validated signing identity and its organization.",
    },
  },
  {
    title: "First, reject invalid amounts.",
    idea: "Zero, negatives, fractions, and malformed text must fail.",
    scene: "code",
    notes:
      "Show the strict amount check. Explain regex as matching only positive whole-number text; do not spend time teaching regex syntax. Number.isSafeInteger prevents amounts that cannot be represented exactly. Client-side form validation is convenience; contract validation is mandatory.",
    labels: ["Positive integer", "Strict parsing", "Safe number"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Should 2.5 or '20abc' be accepted as a credit amount?",
      answer:
        "No. Accept only strictly parsed positive whole numbers within JavaScript's safe integer range.",
    },
    code: 'if (!/^[1-9][0-9]*$/.test(rawAmount)) {\n  throw new Error("Use a positive whole number");\n}\nconst amount = Number(rawAmount);\nif (!Number.isSafeInteger(amount)) {\n  throw new Error("Amount is too large");\n}',
    layout: "code",
  },
  {
    title: "Then, check the available balance.",
    idea: "A request for 1,000 must not change anything.",
    scene: "code",
    notes:
      "14:05–14:25 demonstration. Start the prepared Fabric project, show 100/50, transfer 20 as Alice, wait for commit, refresh, then try insufficient funds. A business-rule rejection during endorsement is not automatically a ledger entry.",
    labels: ["Read current balance", "Reject overspending", "Preserve state"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Alice has 80. She requests 1,000. What changes?",
      answer: "Nothing. Reject before preparing any balance updates.",
    },
    code: 'if (senderBalance < amount) {\n  throw new Error("Insufficient credits");\n}\n// A rejected request changes no balances.',
    layout: "code",
  },
  {
    title: "One transaction. Two resulting balances.",
    idea: "Debit and credit become visible together after a valid commit.",
    scene: "code",
    notes:
      "Explain that putState prepares writes during execution; it is not an immediate ledger commit. Show 80/70 then 90/60 in the real app. After the 14:25–14:35 break, walk through the supplied identity check, starter TODOs and launch commands until 15:00.",
    labels: ["Debit sender", "Credit recipient", "Wait for valid commit"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Does putState immediately prove a successful transfer?",
      answer:
        "No. It prepares writes during execution. Only a valid commit updates current state.",
    },
    code: "const result = prepareTransfer(\n  sender.balance, recipient.balance, rawAmount\n);\nsender.balance = result.senderBalance;\nrecipient.balance = result.recipientBalance;\nawait ctx.stub.putState(senderKey, encode(sender));\nawait ctx.stub.putState(recipientKey, encode(recipient));\n// Only valid commit applies these prepared writes.",
    layout: "code",
  },
  {
    title: "What will you build at 3?",
    idea: "The small rule, not the entire network.",
    scene: "readiness-check",
    notes:
      "14:35–15:00. Confirm Docker is running and prerequisites were installed beforehand. Open the downloaded kit. Explain npm run use:starter, the three TODO groups, npm run deploy and npm start. Use the solution only for recovery. Keep all of 15:00–16:00 for students.",
    labels: [],
    quizIndex: 4,
  },
  {
    title: "Your hour starts here.",
    idea: "Predict. Complete. Deploy. Test. Explain.",
    scene: "practical",
    notes:
      "15:00–15:10: open starter and predict 100/50 → 80/70. 15:10–15:25: complete three small TODO groups. 15:25–15:35: prepared deployment and app launch. 15:35–15:50: success and rejection tests. 15:50–16:00: pair demonstrations and exit questions.",
    labels: [
      "10 min predict",
      "15 min complete",
      "10 min deploy",
      "15 min test",
      "10 min explain",
    ],
    activity: {
      label: "Pair task · 10 min",
      prompt:
        "Before coding, write down the expected result of transferring 20.",
      answer: "100 / 50 becomes 80 / 70, and the total stays 150.",
    },
  },
  {
    title: "Three small TODOs.",
    idea: "The network, identities, and interface are provided.",
    scene: "code",
    notes:
      "Students edit chaincode/lib/transfer-rules.js after running npm run use:starter. Complete amount parsing, sufficient-funds check, and the resulting balances. Keep the supplied signature ownership and ledger code. The complete solution is in solution/transfer-rules.js.",
    labels: ["Validate amount", "Check funds", "Calculate balances"],
    activity: {
      label: "Build · 15 min",
      prompt: "Find the three TODO groups. Explain each before filling it.",
      answer: "Validate the amount; check funds; calculate debit and credit.",
    },
    code: "function prepareTransfer(sender, recipient, rawAmount) {\n  // TODO 1: validate and parse the amount\n  // TODO 2: reject insufficient funds\n  // TODO 3: calculate both resulting balances\n  // Keep the combined balance unchanged.\n}",
    layout: "code",
  },
  {
    title: "Try the rules before the live network.",
    idea: "A clearly labeled browser rehearsal of the same balances.",
    scene: "credits-lab",
    notes:
      "This is an in-memory simulation, not Fabric evidence. Use it to rehearse predictions or as a connectivity fallback. For the real practical, run the downloaded project and confirm committed transaction IDs. Swap the keyboard after the first successful transfer.",
    labels: [],
    simulationType: "credits",
  },
  {
    title: "Make one action fail on purpose.",
    idea: "A rejection is part of your demonstration.",
    scene: "tests",
    notes:
      "15:35–15:50. Test zero, negative, fractional, malformed and insufficient amounts. Use the supplied forbidden action to try Alice's wallet with Bob's identity; a normal Bob-to-Alice transfer is allowed. Read both balances after each rejection. Self-transfer and missing recipient should also fail.",
    labels: ["Successful transfer", "Rejected request", "Balances unchanged"],
    activity: {
      label: "Pair challenge · 15 min",
      prompt:
        "Make a valid transfer, then deliberately try a forbidden action.",
      answer:
        "Show the actual signer, rejection message, and unchanged balances.",
    },
  },
  {
    title: "Show it. Then explain it.",
    idea: "Who signed? What changed? Why did it fail?",
    scene: "showcase",
    notes:
      "15:50–16:00. Invite a few pairs to show one valid transfer and one rejection. Ask the quieter partner to explain the permission rule. Prioritize understanding over completing every optional edge case. The invariant is always total credits 150.",
    labels: ["Show a commit", "Show a rejection", "Explain the owner rule"],
    activity: {
      label: "Demonstrate · 10 min",
      prompt: "Ask the partner who did less typing to explain the rule.",
      answer:
        "Only the identity bound to the sender wallet may debit it; both resulting balances change together.",
    },
  },
  {
    title: "When would you choose a database?",
    idea: "Leave with a reason, not just a working button.",
    scene: "finish",
    notes:
      "Close at 16:00. Ask what changed, who was allowed to request it, and when a database would suffice. Further learning: production identities, policies, multi-node ordering and concurrency. Do not imply this local demo is production-ready.",
    labels: [],
    quizIndex: 5,
  },
];
