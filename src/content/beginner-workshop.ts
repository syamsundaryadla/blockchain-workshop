export interface LessonActivity {
  label: string;
  prompt: string;
  answer: string;
}
export interface BeginnerLesson {
  title: string;
  idea: string;
  explanation?: string;
  syllabusTopic?: number;
  sectionLabel?: string;
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
    | "credits"
    | "broadcast"
    | "mining";
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
    "09:30–10:00",
    "1 · Introduction to Blockchain",
    "Compare trust, Bitcoin’s beginnings and system control.",
  ],
  [
    "10:00–10:40",
    "2 · Blockchain Architecture & Working",
    "Hash a message; link blocks; detect tampering.",
  ],
  [
    "10:40–11:15",
    "3 · Blockchain Networking & Consensus",
    "Propagate a request; try a toy mining puzzle; compare protocols.",
  ],
  [
    "11:15–11:45",
    "4 · Cryptography, Wallets & Smart Contracts",
    "Sign and verify; explain wallets, DApps and contract rules.",
  ],
  [
    "11:45–12:05",
    "5 · Blockchain Applications & Use Cases",
    "Trace a food lot; examine finance, identity, healthcare and voting.",
  ],
  ["12:05–12:15", "Break", ""],
  [
    "12:15–12:30",
    "5 · Blockchain Applications & Use Cases (continued)",
    "Discuss TradeLens, privacy and when a database is enough.",
  ],
  ["12:30–13:30", "Lunch", ""],
  [
    "13:30–14:10",
    "6 · Introduction to Hyperledger Fabric",
    "Role-play peers and orderer; observe a real committed transfer.",
  ],
  [
    "14:10–14:35",
    "7 · Mini Project – Blockchain-Based Digital Wallet & Transaction System",
    "Trace browser → Node.js → chaincode and predict both balances.",
  ],
  ["14:35–14:45", "Break", ""],
  [
    "14:45–15:00",
    "7 · Mini Project – Blockchain-Based Digital Wallet & Transaction System · Readiness",
    "Locate three TODOs; check the prepared network and commands.",
  ],
  [
    "15:00–16:00",
    "7 · Mini Project – Blockchain-Based Digital Wallet & Transaction System · Student build",
    "Complete the rule; deploy; prove success and permission failures.",
  ],
  [
    "16:00–16:30",
    "8 · Project Demonstration & Conclusion",
    "Show a commit and a rejection; explain the design tradeoffs.",
  ],
];
export const BEGINNER_LESSONS: BeginnerLesson[] = [
  {
    title: "Block chain fundamentals",
    idea: "",
    scene: "cover",
    notes:
      "09:30–10:00. Welcome first- and second-year CSE Networking students. Begin with concepts, move to a real Fabric demonstration after lunch, and protect 15:00–16:00 for student work. Students use prepared laptops in pairs. Finish demonstrations and Q&A by 16:30.",
    labels: [],
  },
  {
    title: "About me",
    idea: "Meet your workshop facilitator.",
    scene: "about-me",
    notes:
      "Introduce Syam Sundar Yadla, founder of Risenine Technologies. Briefly share the practical AI focus and Aditya University background from the verified public profile. Invite questions throughout. The first concept starts on slide 3.",
    labels: [],
  },
  {
    title: "What is Blockchain Technology?",
    scene: "blockchain-definition",
    idea: "A blockchain is a shared digital record book. It stores records in linked blocks, and participants use agreed rules to verify new entries.",
    explanation:
      "A blockchain is a shared digital record book. It stores records in linked blocks, and participants use agreed rules to verify new entries.",
    notes:
      "Name the three ideas: recorded changes, links between blocks, and agreement about accepted history. A local linked list alone is not a complete blockchain network. Use the club-record disagreement as the reason for shared verification.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Would linking files with hashes alone create a working blockchain network?",
      answer:
        "No. Participants also need validation rules and an agreement protocol.",
    },
    syllabusTopic: 1,
  },
  {
    title: "Evolution of Blockchain and Introduction to Bitcoin (2009)",
    scene: "bitcoin-timeline",
    idea: "The paper appeared in 2008; the Bitcoin network started in 2009.",
    explanation:
      "The paper appeared in 2008; the Bitcoin network started in 2009.",
    notes:
      "Give a brief history: earlier cryptographic ideas, Satoshi Nakamoto’s 2008 paper, Bitcoin in 2009, then programmable and organizational ledgers. Bitcoin addresses double spending using signatures, P2P networking and proof of work. Avoid prices or investment discussion. Sources: https://bitcoin.org/en/faq and https://bitcoin.org/bitcoin.pdf",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Can a digital file be copied? Should the same balance be spendable twice?",
      answer:
        "Files are easy to copy. A payment system needs a rule for which spending history counts.",
    },
    syllabusTopic: 2,
  },
  {
    title: "Traditional Banking Systems and Their Limitations",
    scene: "banking",
    idea: "Traditional banking uses institutions to maintain balances and coordinate payments. Transfers across institutions may require reconciliation of separate records.",
    explanation:
      "Traditional banking uses institutions to maintain balances and coordinate payments. Transfers across institutions may require reconciliation of separate records.",
    notes:
      "Follow a transfer between two banks. Banks provide useful payment, custody and compliance services. Discuss reconciliation and intermediary dependence without claiming every bank transfer is slow or insecure. Blockchain adds governance and operating costs of its own.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "If two institutions disagree about a transfer, who reconciles their records?",
      answer:
        "The institutions and their payment arrangements do. A shared ledger changes the trust and verification arrangement.",
    },
    syllabusTopic: 3,
  },
  {
    title: "Centralized vs Decentralized vs Distributed Systems",
    scene: "topologies",
    idea: "A centralized system has one main control point; a decentralized system shares control. A distributed system runs across several computers or locations.",
    explanation:
      "A centralized system has one main control point; a decentralized system shares control. A distributed system runs across several computers or locations.",
    notes:
      "Draw one hub, multiple independently controlled hubs and a mesh. A company can run a distributed database across ten servers while retaining centralized control. Treat decentralization as a matter of governance as well as topology. Use Play, Pause or Next step to demonstrate node failure. These examples assume a single central hub, several independent control groups, and a replicated mesh. Failure recovery is design-dependent; distributed placement alone is not a fault-tolerance guarantee.",
    syllabusTopic: 4,
  },
  {
    title: "Why Do We Need Blockchain?",
    idea: "Blockchain can help independent participants maintain a shared, verifiable record. It is useful when no single record keeper is trusted to decide alone.",
    scene: "conflict",
    notes:
      "09:30–10:00. Ask two volunteers to record one shared club expense. Give them different updates. Let the room identify the trust problem before naming a solution.",
    labels: ["Same event", "Different copies", "Who decides?"],
    activity: {
      label: "Discuss · 60 sec",
      prompt: "Two copies disagree. Who gets the final say?",
      answer:
        "That depends on the trust model. First identify who is authorized to maintain or approve the record.",
    },
    syllabusTopic: 5,
    explanation:
      "Blockchain can help independent participants maintain a shared, verifiable record. It is useful when no single record keeper is trusted to decide alone.",
  },
  {
    scene: "case-examples",
    title: "Real-World Examples – Walmart, Maersk and Financial Transactions",
    idea: "Examples of shared records across organizations—not a guarantee that blockchain is always suitable.",
    explanation:
      "Examples of shared records across organizations—not a guarantee that blockchain is always suitable.",
    notes:
      "Introduce the three examples briefly; detailed applications come in Module 5. Walmart announced a leafy-greens traceability initiative in 2018. Maersk/IBM TradeLens is discontinued: a November 2022 announcement planned shutdown by Q1 2023. Financial reconciliation is an illustrative use case, not a claim about every banking system. Sources: https://corporate.walmart.com/news/2018/09/24/in-wake-of-romaine-e-coli-scare-walmart-deploys-blockchain-to-track-leafy-greens and https://www.maersk.com/news/articles/2022/11/29/maersk-and-ibm-to-discontinue-tradelens",
    activity: {
      label: "Discuss",
      prompt: "What information would two organizations need to share?",
      answer:
        "A common record is useful only when its participants, governance and input quality are appropriate.",
    },
    syllabusTopic: 6,
  },
  {
    title: "Walmart Mango Traceability Example",
    syllabusTopic: 6,
    sectionLabel: "Example after Topic 6",
    scene: "mango-trace",
    idea: "Trace a mango lot from the store back to the farm using recorded handovers.",
    explanation:
      "Walmart reported tracing mango origins in 2.2 seconds in a pilot, compared with nearly seven days using its manual-record exercise.",
    notes:
      "Place this example immediately after Module 1, Topic 6. Walmart’s 2018 Global Responsibility Report Summary describes its 2017 mango traceability exercise: six days, 18 hours and 26 minutes using existing methods, versus 2.2 seconds for the blockchain pilot lookup to a farm in Mexico. Use the animation to follow store → distributor → packer → farm. All drawn lots and handovers are illustrative. The measured pilot result is not a guarantee for every deployment. Blockchain still depends on truthful data capture. Source: https://stock.walmart.com/_assets/_513a414897667f69e48953e02796048d/walmart/db/951/9698/file/WMT-2018-GRR-Summary-for-digital.pdf",
  },
  {
    title: "Introduction to Blockchain",
    idea: "Vote first. Explain the trust assumption.",
    scene: "decision",
    notes:
      "Ask for a show of hands before selecting an answer. The goal is a reasoned tradeoff, not memorizing a slogan. Have one student explain the database option.",
    labels: [],
    quizIndex: 0,
    sectionLabel: "Knowledge check",
  },
  {
    title: "What is a Transaction?",
    idea: "A transaction is a request to record an action, such as transferring credits. The network checks its rules before accepting the change.",
    scene: "transaction",
    explanation:
      "A transaction is a request to record an action, such as transferring credits. The network checks its rules before accepting the change.",
    notes:
      "10:00–10:40. Use Alice-to-Bob as a request with an action and input values. Distinguish a requested change from a confirmed result. Mention that signatures will be demonstrated later; a sender label alone never proves authorization.",
    labels: ["Signing identity", "Requested action", "Input values"],
    activity: {
      label: "Invent a test · 60 sec",
      prompt: "What would you check before accepting a transfer request?",
      answer:
        "The actual signer, wallet ownership, recipient, amount, available funds, and the valid committed result.",
    },
    syllabusTopic: 1,
  },
  {
    title: "What is a Transaction?",
    syllabusTopic: 1,
    sectionLabel: "Conceptual transaction animation",
    scene: "transaction-animation",
    idea: "A transfer request is checked before the model records new balances.",
    explanation:
      "A transfer request is checked before the model records new balances.",
    notes:
      "After explaining what a transaction is, play the four-step model. Ask students when Alice and Bob’s balances may change. They remain 100/50 until the final accepted step, then become 80/70. This is an introductory animation, not live Fabric or a full consensus protocol. Detailed Fabric stages appear in Module 6.",
  },
  {
    scene: "block-batch",
    title: "What is a Block?",
    idea: "A block is a group of transaction records stored together with a header. The header helps identify the block and link it to earlier blocks.",
    explanation:
      "A block is a group of transaction records stored together with a header. The header helps identify the block and link it to earlier blocks.",
    notes:
      "Introduce a block as a batch of records with a header. Exact formats differ by blockchain. A block is not the same as a single transaction. Point to the records first, then introduce header fields on the next slide.",
    activity: {
      label: "Discuss",
      prompt: "Must one transaction always occupy its own block?",
      answer: "No. A block can contain multiple transaction records.",
    },
    syllabusTopic: 2,
  },
  {
    title: "What is a Block?",
    syllabusTopic: 2,
    sectionLabel: "Block assembly animation",
    scene: "block-animation",
    idea: "Watch separate transaction records become a candidate block with a header.",
    explanation:
      "Watch separate transaction records become a candidate block with a header.",
    notes:
      "After defining a block, animate the collection of three records and the appearance of header information. This illustrates grouping and structure, not Bitcoin mining or the precise Fabric encoding. Candidate blocks still require the network’s acceptance rules.",
  },
  {
    title:
      "Structure of a Block – Data, Timestamp, Previous Hash, Nonce and Hash",
    scene: "block-fields",
    idea: "Data and hash links are common; exact block fields depend on the platform.",
    explanation:
      "Data and hash links are common; exact block fields depend on the platform.",
    notes:
      "Use a Bitcoin-like teaching block: transaction data, timestamp, previous block hash and nonce. Bitcoin’s block hash is calculated from the header, which includes a commitment to transaction data. A mining nonce is not a universal blockchain field. Fabric has a different block format and no mining nonce. Source: https://bitcoin.org/bitcoin.pdf",
    activity: {
      label: "Predict · discuss",
      prompt: "Will our Fabric transfer need a mining nonce?",
      answer:
        "No. The nonce shown here belongs to a proof-of-work example, not the Fabric project.",
    },
    syllabusTopic: 3,
  },
  {
    title: "Understanding SHA-256 Hashing",
    idea: "A hash is a fixed-length digital fingerprint of data. SHA-256 produces a 256-bit fingerprint; changing the input usually changes the fingerprint.",
    scene: "hash",
    explanation:
      "A hash is a fixed-length digital fingerprint of data. SHA-256 produces a 256-bit fingerprint; changing the input usually changes the fingerprint.",
    notes:
      "Introduce SHA-256 as a deterministic, fixed-size fingerprint. Ask students to predict the effect of changing one character before running the lab. Similar inputs need not have similar outputs; do not claim collisions are mathematically impossible.",
    labels: ["Input", "SHA-256", "256-bit fingerprint"],
    diagram: 4,
    activity: {
      label: "Predict · 30 sec",
      prompt: "Will the same message produce the same fingerprint tomorrow?",
      answer:
        "Yes, with the same bytes and hash algorithm. Changing whitespace or letter case changes the input.",
    },
    syllabusTopic: 4,
  },
  {
    title: "Understanding SHA-256 Hashing",
    idea: "Try your own message in the hash lab.",
    scene: "hash-lab",
    notes:
      "Ask the room to predict before typing. Change only one character, then compare the full outputs. This demo calculates real SHA-256 hashes in the browser. Let pairs suggest their own messages.",
    labels: [],
    simulationType: "hasher",
    syllabusTopic: 4,
    sectionLabel: "Interactive simulation",
  },
  {
    title: "Understanding SHA-256 Hashing",
    idea: "Fingerprinting and encryption solve different problems.",
    scene: "hash-vs-encryption",
    explanation:
      "Hashing checks for change; encryption hides content from unauthorized readers.",
    notes:
      "Contrast verifying that a file changed with encrypting content for an authorized reader. A hash is not decoded back into the original. Hashing predictable data does not make it confidential.",
    labels: ["Integrity check", "Not encryption", "Not automatic privacy"],
    activity: {
      label: "Discuss · 30 sec",
      prompt: "Does hashing an exam answer keep it secret?",
      answer:
        "Not reliably. Predictable inputs can be guessed and hashed. Integrity is different from confidentiality.",
    },
    syllabusTopic: 4,
    sectionLabel: "Hashing versus encryption",
  },
  {
    title: "How Blocks Are Connected to Form a Blockchain",
    idea: "Each block refers to the previous block’s hash. These links form a sequence and help reveal changes to earlier records.",
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
    syllabusTopic: 5,
    explanation:
      "Each block refers to the previous block’s hash. These links form a sequence and help reveal changes to earlier records.",
  },
  {
    title: "How Blocks Are Connected to Form a Blockchain",
    idea: "Which verification fails first?",
    scene: "chain-lab",
    notes:
      "Let a volunteer edit an earlier transaction in the toy chain. Inspect the failed hash and dependent links. Recomputing all local hashes does not make a rewritten history acceptable to an actual network. This simplified model does not implement a consensus protocol.",
    labels: [],
    simulationType: "blockchain",
    syllabusTopic: 5,
    sectionLabel: "Interactive simulation",
  },
  {
    title: "How Blocks Are Connected to Form a Blockchain",
    syllabusTopic: 5,
    sectionLabel: "Blockchain linking animation",
    scene: "chain-animation",
    idea: "Add blocks one at a time, then see why editing an earlier record breaks verification.",
    explanation:
      "Add blocks one at a time, then see why editing an earlier record breaks verification.",
    notes:
      "After the topic’s explanation and hash-chain exercise, reveal B1, B2 and B3 in sequence. Each new block carries the preceding hash. Use Edit first block to show the mismatch at the next stored link. Hash labels H1/H2/H3 are illustrative; accepted network history cannot be rewritten merely by editing this local model.",
  },
  {
    title: "Distributed Ledger Technology (DLT)",
    scene: "ledger-replicas",
    idea: "Distributed Ledger Technology (DLT) means maintaining shared records across multiple participants. Blockchain is one type that organizes records in linked blocks.",
    explanation:
      "Distributed Ledger Technology (DLT) means maintaining shared records across multiple participants. Blockchain is one type that organizes records in linked blocks.",
    notes:
      "Explain DLT as the wider family. Blockchain uses a sequence of hash-linked blocks. Three copies do not establish agreement by themselves. Give three pairs the same record and then one conflicting update.",
    activity: {
      label: "Predict · discuss",
      prompt: "Do three copies automatically tell us which update is correct?",
      answer:
        "No. Participants still need agreed rules and a protocol for accepted history.",
    },
    syllabusTopic: 6,
  },
  {
    title:
      "Key Features – Transparency, Immutability, Security and Decentralization",
    scene: "features",
    idea: "Transparency lets authorized readers inspect records; immutability means accepted history resists rewriting. Security and decentralization depend on the network’s design.",
    explanation:
      "Transparency lets authorized readers inspect records; immutability means accepted history resists rewriting. Security and decentralization depend on the network’s design.",
    notes:
      "Define transparency as visibility to authorized readers, immutability as resistance to rewriting accepted history under protocol assumptions, and security as the result of cryptography, validation and operations. Decentralization varies by governance. Avoid unhackable, absolutely immutable or everyone sees everything.",
    activity: {
      label: "Predict · discuss",
      prompt: "Does a private blockchain make every record public?",
      answer: "No. Visibility depends on its access and membership rules.",
    },
    syllabusTopic: 7,
  },
  {
    title: "Blockchain Architecture & Working",
    idea: "Choose a reason, then compare with your neighbor.",
    scene: "hash-check",
    notes:
      "Before the 11:10 break, give pairs 30 seconds to explain what a hash can and cannot establish. Resume at 11:20 with the idea of identifying who requests a change.",
    labels: [],
    quizIndex: 1,
    sectionLabel: "Knowledge check",
  },
  {
    title: "Peer-to-Peer (P2P) Networks",
    scene: "p2p",
    idea: "A peer-to-peer (P2P) network lets connected computers exchange messages directly. Each computer can communicate with other peers under the network’s rules.",
    explanation:
      "A peer-to-peer (P2P) network lets connected computers exchange messages directly. Each computer can communicate with other peers under the network’s rules.",
    notes:
      "10:40–11:15. Let six students pass a request to neighbors. Communication links between nodes are not hash links between blocks. Real networks use protocol-specific discovery and propagation. Fabric’s proposal and ordering path differs from generic public-network broadcasting.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Are network connections the same as the hash links between blocks?",
      answer:
        "No. Network links carry messages; hash links connect records in a history.",
    },
    syllabusTopic: 1,
  },
  {
    title: "Nodes and Their Roles in Blockchain",
    scene: "node-roles",
    idea: "A node is a computer or process participating in a blockchain network. Its role may include requesting, checking, storing or proposing records.",
    explanation:
      "A node is a computer or process participating in a blockchain network. Its role may include requesting, checking, storing or proposing records.",
    notes:
      "Compare a full verifying node, a light client and a block proposer or validator. Roles depend on the protocol; not every node mines or stores the entire chain. Later compare these with Fabric clients, peers and orderers.",
    activity: {
      label: "Predict · discuss",
      prompt: "Does every node have to mine?",
      answer:
        "No. Mining is one role in proof-of-work systems; independent nodes still verify rules.",
    },
    diagram: 14,
    syllabusTopic: 2,
  },
  {
    title: "How Transactions Propagate Across the Network",
    idea: "Transaction propagation means passing a request from one node to its peers. Receiving a request does not mean it is valid or confirmed.",
    scene: "broadcast-lab",
    notes:
      "Predict which nodes receive the next hop, then repeat with an amount larger than the balance. Receipt, local rule checks and ledger confirmation are separate. This is a manual propagation model, not live P2P networking or implemented consensus.",
    simulationType: "broadcast",
    syllabusTopic: 3,
    sectionLabel: "Interactive simulation",
    explanation:
      "Transaction propagation means passing a request from one node to its peers. Receiving a request does not mean it is valid or confirmed.",
  },
  {
    title: "Transaction Verification and Validation",
    scene: "verification",
    idea: "Verification checks a request against the required signatures and rules. Confirmation requires the network to accept and record it under its protocol.",
    explanation:
      "Verification checks a request against the required signatures and rules. Confirmation requires the network to accept and record it under its protocol.",
    notes:
      "Use two spending requests against the same available balance. Check signature, permission and funds, then discuss ordering. A request that appears affordable can later conflict with an earlier accepted update. Majority clicking is not universal consensus.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Can two requests both look affordable before either is recorded?",
      answer:
        "Yes. Ordering and state validation prevent both from spending the same available balance.",
    },
    syllabusTopic: 4,
  },
  {
    title: "What is Consensus and Why Is It Required?",
    idea: "Consensus is how a network agrees on accepted records and their order. Different blockchains use different agreement protocols.",
    scene: "agreement",
    explanation:
      "Consensus is how a network agrees on accepted records and their order. Different blockchains use different agreement protocols.",
    notes:
      "Explain consensus conceptually: participants follow a protocol to agree on accepted records and their sequence. Different protocols have different assumptions. Do not imply every chain uses voting, mining or the same fault model.",
    labels: ["Execute rules", "Agree sequence", "Validate and record"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Do all blockchains use mining to agree?",
      answer:
        "No. Different protocols use different agreement mechanisms. Our Fabric network has an ordering service.",
    },
    syllabusTopic: 5,
  },
  {
    title: "Proof of Work (PoW) and Mining",
    scene: "pow",
    idea: "Proof of Work asks miners to find a hash that meets a target. Other nodes check the proof and still verify the block’s transaction rules.",
    explanation:
      "Proof of Work asks miners to find a hash that meets a target. Other nodes check the proof and still verify the block’s transaction rules.",
    notes:
      "Explain costly search and inexpensive verification. The next lab uses two leading hexadecimal zeros only for teaching. Bitcoin uses a much harder target. Finding a valid proof does not excuse invalid transactions. Source: https://bitcoin.org/bitcoin.pdf",
    activity: {
      label: "Predict · discuss",
      prompt:
        "May a miner include an invalid payment after finding a valid hash?",
      answer:
        "No. Other nodes still reject a block that violates transaction rules.",
    },
    syllabusTopic: 6,
  },
  {
    title: "Proof of Work (PoW) and Mining",
    idea: "Try real SHA-256 with a deliberately easy target: 00…",
    scene: "mining-lab",
    notes:
      "First try one nonce, then search. Change the message after success and observe that the proof must be redone. This is a toy puzzle using real browser hashing: no currency, block rewards, live Bitcoin network or Fabric mining.",
    simulationType: "mining",
    syllabusTopic: 6,
    sectionLabel: "Interactive simulation",
  },
  {
    title: "Introduction to Proof of Stake (PoS) and Validators",
    scene: "pos",
    idea: "Proof of Stake uses validators who commit assets as stake and follow the protocol to propose or attest to blocks. It does not use a mining hash race.",
    explanation:
      "Proof of Stake uses validators who commit assets as stake and follow the protocol to propose or attest to blocks. It does not use a mining hash race.",
    notes:
      "Use Ethereum as a named example: validators stake ETH and propose or attest under protocol rules; misbehavior can incur penalties. It is not a richest-person-wins vote. No staking or funds are required today. Fabric’s ordering service is neither this PoS model nor a mining race. Source: https://ethereum.org/developers/docs/consensus-mechanisms/pos/",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Are Ethereum validators and our Fabric orderer solving the same mining puzzle?",
      answer:
        "No. Ethereum uses proof of stake; our Fabric test network uses a configured ordering service.",
    },
    syllabusTopic: 7,
  },
  {
    title: "Public, Private and Consortium Blockchains",
    scene: "network-types",
    idea: "Public blockchains allow open participation; private blockchains restrict it under one organization. Consortium blockchains are governed by a group of organizations.",
    explanation:
      "Public blockchains allow open participation; private blockchains restrict it under one organization. Consortium blockchains are governed by a group of organizations.",
    notes:
      "Compare open public participation, one-organization permissioned governance and consortium governance across independent organizations. These broad categories do not guarantee privacy, speed or safety. Fabric supports explicit organizational membership and governance.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Three colleges govern a shared network together. Which arrangement fits?",
      answer:
        "A consortium with agreed membership, responsibilities and access rules.",
    },
    syllabusTopic: 8,
  },
  {
    scene: "cryptography-tools",
    title: "Introduction to Cryptography in Blockchain",
    idea: "Cryptography uses mathematical methods to protect information. Hashes, digital signatures and encryption help check integrity, signing keys and confidentiality.",
    explanation:
      "Cryptography uses mathematical methods to protect information. Hashes, digital signatures and encryption help check integrity, signing keys and confidentiality.",
    notes:
      "Explain the job of each tool without equations. A hash is not encryption, and a valid signature does not prove that a statement is true. These tools support the blockchain rules rather than replacing governance or truthful data capture.",
    activity: {
      label: "Discuss",
      prompt: "Which tool helps detect an altered message?",
      answer:
        "A hash comparison can check integrity; a signature also connects an exact message to a signing key.",
    },
    syllabusTopic: 1,
  },
  {
    title: "Public Keys, Private Keys and Digital Signatures",
    idea: "A digital signature is a cryptographic proof tied to a message and signing key. The private key signs; the matching public key verifies.",
    scene: "identity",
    explanation:
      "A digital signature is a cryptographic proof tied to a message and signing key. The private key signs; the matching public key verifies.",
    notes:
      "11:15–11:45. Distinguish a copied public label from possession of a private signing key. Introduce public keys, private keys and signatures without mathematics. The signature lab uses temporary browser keys, not enrolled Fabric certificates.",
    labels: ["Public identity", "Private signing key", "Authorization rule"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "I know your username. Can I sign as you?",
      answer: "Knowing a label is not possession of its private signing key.",
    },
    syllabusTopic: 2,
  },
  {
    title: "Public Keys, Private Keys and Digital Signatures",
    idea: "A real browser signature makes the difference visible.",
    scene: "signature-lab",
    notes:
      "This experiment uses real browser ECDSA signing with a temporary key pair, not Fabric enrollment. Sign a short message, edit it, then verify again. The signature binds that message to the key; it does not establish the truth of the message.",
    labels: [],
    simulationType: "signatures",
    syllabusTopic: 2,
    sectionLabel: "Interactive simulation",
  },
  {
    title: "What is a Cryptocurrency Wallet?",
    scene: "wallet-address",
    idea: "A cryptocurrency wallet manages keys and signs transactions. The cryptocurrency balance is recorded on the blockchain, not inside the wallet.",
    explanation:
      "A cryptocurrency wallet manages keys and signs transactions. The cryptocurrency balance is recorded on the blockchain, not inside the wallet.",
    notes:
      "Explain a public-chain address as an account identifier; exact derivation varies by platform. Copying an address does not copy spending authority. Our later Fabric project uses application wallet IDs bound to certificates, not cryptocurrency addresses. No MetaMask or funded wallet is required.",
    activity: {
      label: "Predict · discuss",
      prompt: "If I copy someone’s public address, may I spend their balance?",
      answer: "No. An identifier is different from an authorized signing key.",
    },
    syllabusTopic: 3,
  },
  {
    scene: "wallet-transactions",
    title: "Wallet Addresses and Blockchain Transactions",
    idea: "A wallet address is a public identifier used when sending or receiving cryptocurrency. It is different from the private key that authorizes spending.",
    explanation:
      "A wallet address is a public identifier used when sending or receiving cryptocurrency. It is different from the private key that authorizes spending.",
    notes:
      "Use generic Address A and Address B. Address formats and derivation vary by platform. Public identifiers can be shared; private keys must be protected. The later Fabric project uses application wallet IDs bound to certificates, not cryptocurrency addresses.",
    activity: {
      label: "Discuss",
      prompt: "Does knowing Address A let you spend its balance?",
      answer:
        "No. A public identifier is not possession of the authorized signing key.",
    },
    syllabusTopic: 4,
  },
  {
    title: "Introduction to Ethereum",
    scene: "ethereum",
    idea: "Ethereum is a programmable blockchain that runs smart contracts in the Ethereum Virtual Machine (EVM). Its public network uses Proof of Stake.",
    explanation:
      "Ethereum is a programmable blockchain that runs smart contracts in the Ethereum Virtual Machine (EVM). Its public network uses Proof of Stake.",
    notes:
      "Introduce Ethereum, EVM execution and gas at awareness level. Public Ethereum uses proof of stake and gas paid in ETH. Do not introduce Solidity or Remix as a second practical. Fabric uses different identity and execution mechanisms. Source: https://ethereum.org/developers/docs/smart-contracts/",
    activity: {
      label: "Predict · discuss",
      prompt: "Will writing a web page alone create a smart contract?",
      answer:
        "No. The interface calls application logic; the contract runs in the platform’s execution environment.",
    },
    syllabusTopic: 5,
  },
  {
    title: "What Are Smart Contracts?",
    idea: "A smart contract is a program that applies agreed rules to blockchain data. Our contract checks who may transfer credits and whether the amount is valid.",
    scene: "rules",
    explanation:
      "A smart contract is a program that applies agreed rules to blockchain data. Our contract checks who may transfer credits and whether the amount is valid.",
    notes:
      "Define a smart contract as code applying agreed rules to recorded state. Ask the room to invent rejection cases before revealing owner, amount and funds checks. Fabric packages smart contract logic as chaincode. A contract does not make a poor business rule sensible.",
    labels: ["Who may spend?", "Is the amount valid?", "Is there enough?"],
    activity: {
      label: "Think–pair–share · 60 sec",
      prompt: "Suggest one transfer that must fail.",
      answer:
        "Examples: a negative amount, insufficient funds, an unknown recipient, or the wrong signing identity.",
    },
    syllabusTopic: 6,
  },
  {
    title: "Decentralized Applications (DApps)",
    scene: "dapp",
    idea: "A decentralized application (DApp) uses blockchain or other decentralized services for part of its backend. Its interface calls shared application rules.",
    explanation:
      "A decentralized application (DApp) uses blockchain or other decentralized services for part of its backend. Its interface calls shared application rules.",
    notes:
      "A DApp uses decentralized backend components such as smart contracts. Its frontend may still be centrally hosted; not every component is automatically decentralized. Compare with our HTML/CSS/JS interface, Node.js gateway and Fabric chaincode. Source: https://ethereum.org/developers/docs/dapps/",
    activity: {
      label: "Predict · discuss",
      prompt: "Should the spending check exist only in a browser button?",
      answer:
        "No. The contract must enforce it even when the interface is bypassed.",
    },
    syllabusTopic: 7,
  },
  {
    title: "Introduction to Hyperledger Fabric",
    idea: "Hyperledger Fabric is a permissioned blockchain platform for organizations. It uses known identities, smart contracts and agreed policies to maintain shared records.",
    scene: "permissioned",
    explanation:
      "Hyperledger Fabric is a permissioned blockchain platform for organizations. It uses known identities, smart contracts and agreed policies to maintain shared records.",
    notes:
      "Introduce Fabric briefly before the afternoon deep dive. Participation uses organizational identities and policies. It does not require mining, cryptocurrency, MetaMask or Solidity. Permissioned does not mean all data is automatically private.",
    labels: ["Known organizations", "Certified identities", "Agreed policies"],
    activity: {
      label: "Choose · 30 sec",
      prompt: "Do we need to buy cryptocurrency to use this Fabric project?",
      answer:
        "No. Our demo credits are records defined by our own application.",
    },
    syllabusTopic: 8,
  },
  {
    title: "Cryptography, Wallets & Smart Contracts",
    idea: "Does that let Bob spend Alice's credits?",
    scene: "identity-check",
    notes:
      "Ask students to distinguish claimed sender from actual signing identity. This is the key permission rule they will later test in the project. No cryptography mathematics is needed.",
    labels: [],
    quizIndex: 2,
    sectionLabel: "Knowledge check",
  },
  {
    title: "Banking and Financial Transactions",
    scene: "finance",
    idea: "Participants can reconcile a common transaction record instead of separate copies.",
    explanation:
      "Participants can reconcile a common transaction record instead of separate copies.",
    notes:
      "Use a hypothetical invoice between a buyer, seller and bank. Discuss shared status and auditability alongside existing banking systems. Do not promise universal instant settlement, legal finality or lower costs. A token entry is not automatically a bank deposit.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Is a recorded token transfer automatically a completed bank payment?",
      answer: "No. That depends on the asset and settlement arrangements.",
    },
    syllabusTopic: 1,
  },
  {
    title: "Supply Chain Management",
    scene: "supply-chain",
    idea: "Shared checkpoints help trace a product across organizations.",
    explanation:
      "Shared checkpoints help trace a product across organizations.",
    notes:
      "11:45–12:05. Trace a food lot from farm to packer to shop. Walmart announced a leafy-greens blockchain traceability initiative in 2018; label it as a dated case study, not a claim that every product currently uses one platform. Ask who enters each record. Source: https://corporate.walmart.com/news/2018/09/24/in-wake-of-romaine-e-coli-scare-walmart-deploys-blockchain-to-track-leafy-greens",
    activity: {
      label: "Predict · discuss",
      prompt:
        "If the farm enters the wrong lot number, will blockchain fix that fact?",
      answer:
        "No. Capturing truthful input still requires trusted processes and checks.",
    },
    syllabusTopic: 2,
  },
  {
    scene: "identity-verification",
    title: "Digital Identity and Record Verification",
    idea: "A digital identity is a set of claims used to identify a person or organization. Verification checks the issuer and the integrity of the supporting records.",
    explanation:
      "A digital identity is a set of claims used to identify a person or organization. Verification checks the issuer and the integrity of the supporting records.",
    notes:
      "Use a college credential as a hypothetical example. Verify the issuer and the record fingerprint or signature under a trust policy. A ledger entry alone does not guarantee a truthful original claim. Sensitive documents need separate privacy and access controls.",
    activity: {
      label: "Discuss",
      prompt:
        "Would a matching hash alone prove that a degree came from the college?",
      answer:
        "No. You also need to verify the issuer and the authorization behind the claim.",
    },
    syllabusTopic: 3,
  },
  {
    title: "Blockchain-Based Voting Systems",
    scene: "voting",
    idea: "Eligibility, secrecy, coercion resistance and secure devices remain separate challenges.",
    explanation:
      "Eligibility, secrecy, coercion resistance and secure devices remain separate challenges.",
    notes:
      "Treat blockchain voting as a design and research problem, not a recommendation for public elections. A tamper-evident tally cannot prove eligibility, ballot secrecy or that a compromised device captured the intended vote.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "Does an unchanged ledger prove a phone recorded the voter’s intended choice?",
      answer:
        "No. Device security and the election process need separate protections.",
    },
    syllabusTopic: 4,
  },
  {
    title: "Healthcare and Insurance",
    scene: "records",
    idea: "Blockchain can coordinate record access and claim status across organizations. Sensitive medical or personal data still needs privacy and access controls.",
    explanation:
      "Blockchain can coordinate record access and claim status across organizations. Sensitive medical or personal data still needs privacy and access controls.",
    notes:
      "Use healthcare record access and insurance claim status as design examples. Do not put sensitive medical documents directly on a shared ledger. Share only the necessary facts, control access, and keep protected records in appropriate systems. Blockchain alone does not guarantee privacy or truthful input.",
    activity: {
      label: "Predict · discuss",
      prompt: "Should every participant see a patient’s medical documents?",
      answer:
        "No. Minimize shared sensitive data and design access controls separately.",
    },
    syllabusTopic: 5,
  },
  {
    title: "Opportunities, Challenges and Limitations of Blockchain",
    scene: "tradeoffs",
    idea: "Ask who must trust whom, what must be shared, and what must stay private.",
    explanation:
      "Ask who must trust whom, what must be shared, and what must stay private.",
    notes:
      "Close the morning with paired choices: a personal list, one office’s attendance record and a multi-college certificate register. Revisit the hashing or broadcast model if needed. Ethereum, PoS and sector use cases are introductory exposure, not separate projects. Lunch 12:30–13:30.",
    activity: {
      label: "Predict · discuss",
      prompt:
        "One trusted office maintains one private list. What is the simpler starting point?",
      answer: "Usually a database with suitable permissions and an audit log.",
    },
    syllabusTopic: 6,
  },
  {
    title: "Opportunities, Challenges and Limitations of Blockchain",
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
    syllabusTopic: 6,
    sectionLabel: "Data quality",
  },
  {
    title: "Opportunities, Challenges and Limitations of Blockchain",
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
    syllabusTopic: 6,
    sectionLabel: "Database comparison",
  },
  {
    title: "Opportunities, Challenges and Limitations of Blockchain",
    scene: "tradelens",
    idea: "TradeLens is a historical lesson in governance and commercial viability.",
    explanation:
      "TradeLens is a historical lesson in governance and commercial viability.",
    notes:
      "12:15–12:30, after the ten-minute break. Maersk and IBM announced TradeLens discontinuation in November 2022, with an intended shutdown by the end of Q1 2023. Label it discontinued, not a current success story. Collaboration and commercial viability matter alongside code. Source: https://www.maersk.com/news/articles/2022/11/29/maersk-and-ibm-to-discontinue-tradelens",
    activity: {
      label: "Predict · discuss",
      prompt: "If technology works, must every organization adopt it?",
      answer:
        "No. Incentives, governance, integration costs and commercial viability still matter.",
    },
    syllabusTopic: 6,
    sectionLabel: "Case study: TradeLens",
  },
  {
    scene: "fabric-overview",
    title: "Overview of Hyperledger Fabric",
    idea: "Hyperledger Fabric is a permissioned blockchain platform for organizations. It combines identities, contract rules and ledgers without cryptocurrency mining.",
    explanation:
      "Hyperledger Fabric is a permissioned blockchain platform for organizations. It combines identities, contract rules and ledgers without cryptocurrency mining.",
    notes:
      "13:30–14:10. Start the afternoon by naming Fabric’s purpose and the prepared local network. It has no native currency or cryptocurrency mining requirement. The test network is a learning environment; independent production operations require more infrastructure and governance.",
    activity: {
      label: "Discuss",
      prompt: "Are our credits a built-in Fabric currency?",
      answer:
        "No. Our application defines the wallet records and transfer rules.",
    },
    syllabusTopic: 1,
  },
  {
    title: "Permissioned Blockchain Networks",
    idea: "A permissioned blockchain restricts participation to approved identities. Membership and access policies determine what each participant may do.",
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
    syllabusTopic: 2,
    explanation:
      "A permissioned blockchain restricts participation to approved identities. Membership and access policies determine what each participant may do.",
  },
  {
    title: "Understanding Organizations, Peers and Ordering Services",
    idea: "An organization is a network member with its own identities and policies. Peers run contract rules and keep ledgers; the ordering service sequences transactions into blocks.",
    scene: "fabric-network",
    explanation:
      "An organization is a network member with its own identities and policies. Peers run contract rules and keep ledgers; the ordering service sequences transactions into blocks.",
    notes:
      "13:30–14:10. Trace two organizations, one peer per organization, an ordering service and mychannel. Each prepared laptop runs a separate local test network. A single orderer is a teaching simplification, not production fault tolerance.",
    labels: ["Org1 peer", "Org2 peer", "Ordering service"],
    activity: {
      label: "Point it out · 60 sec",
      prompt:
        "Which component runs the transfer rule? Which orders transactions?",
      answer:
        "Peers execute chaincode. The ordering service sequences endorsed transactions into blocks.",
    },
    syllabusTopic: 3,
  },
  {
    title: "Understanding Organizations, Peers and Ordering Services",
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
    syllabusTopic: 3,
    sectionLabel: "Interactive role-play",
  },
  {
    title: "Understanding Organizations, Peers and Ordering Services",
    idea: "CA issues it. MSP defines which identities to trust.",
    scene: "certificate",
    explanation:
      "CA = certificate authority. MSP = membership service provider: defines trusted identities.",
    notes:
      "Use a campus ID analogy carefully: a certificate binds a key to an identity under an issuer's trust; it is not the same as business permission to spend any wallet. Explain CA and MSP in plain terms; students will not configure them from scratch.",
    labels: ["Certificate authority", "Signed certificate", "Membership rules"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "A valid certificate means I can spend any wallet. True?",
      answer:
        "False. Membership identifies a participant; business permissions still restrict spending.",
    },
    syllabusTopic: 3,
    sectionLabel: "Components, identities and examples",
  },
  {
    title: "Introduction to Docker and Ubuntu/WSL",
    scene: "environment",
    idea: "Docker runs software services in containers. Ubuntu is the Linux environment we use through Windows Subsystem for Linux (WSL 2).",
    explanation:
      "Docker runs software services in containers. Ubuntu is the Linux environment we use through Windows Subsystem for Linux (WSL 2).",
    notes:
      "Installation is completed before the event. Show Docker Desktop with WSL 2 Ubuntu integration, pinned samples and images, and the Node/Fabric Gateway backend. HTML and CSS form the interface; browser JavaScript calls the backend. Python is not required for this real Fabric practical.",
    activity: {
      label: "Predict · discuss",
      prompt: "Can HTML and CSS alone sign and submit our Fabric transactions?",
      answer:
        "No. The supplied Node.js/Fabric Gateway backend uses prepared signing identities.",
    },
    syllabusTopic: 4,
  },
  {
    scene: "test-network",
    title: "Understanding the Hyperledger Fabric Test Network",
    idea: "The Fabric test network is a small, preconfigured development network. Each prepared laptop runs two logical organizations and an ordering service.",
    explanation:
      "The Fabric test network is a small, preconfigured development network. Each prepared laptop runs two logical organizations and an ordering service.",
    notes:
      "Show that one prepared laptop hosts the test components in Docker under Ubuntu/WSL. Logical organizations and their credentials remain distinct, but this does not demonstrate independently operated production infrastructure or production fault tolerance.",
    activity: {
      label: "Discuss",
      prompt:
        "Are the two organizations running on two independently administered campus servers?",
      answer:
        "No. In this practical they are logical test organizations on the same prepared laptop.",
    },
    syllabusTopic: 5,
  },
  {
    title: "Understanding the Hyperledger Fabric Test Network",
    idea: "Only its participating organizations share that channel.",
    scene: "channel",
    explanation:
      "A channel gives its member organizations a shared ledger with separate access rules.",
    notes:
      "Locate the channel boundary. Each channel has a ledger shared among its participating organizations under policies. Membership does not make every field secret from other members. Ask a volunteer to explain peer versus orderer before continuing.",
    labels: ["mychannel", "Org1 + Org2", "One channel ledger"],
    activity: {
      label: "Teach it back · 60 sec",
      prompt: "Explain peer, orderer, and channel to your neighbor.",
      answer:
        "Peers execute and validate; the orderer sequences transactions; the channel has its own shared ledger.",
    },
    syllabusTopic: 5,
    sectionLabel: "Channels",
  },
  {
    title: "Understanding the Hyperledger Fabric Test Network",
    idea: "Two views of the same ledger.",
    scene: "state-history",
    explanation:
      "World state stores current values; the blockchain records the transaction history.",
    notes:
      "World state holds the latest key-value data; the blockchain records ordered blocks and transactions. Invalid ordered transactions do not update current balances. A rejected proposal need not appear in the ledger.",
    labels: ["Current state", "Transaction history", "Different jobs"],
    activity: {
      label: "Point it out · 30 sec",
      prompt: "Where would you read the latest balance?",
      answer:
        "From current state. Blocks preserve the transaction record; they serve a different purpose.",
    },
    syllabusTopic: 5,
    sectionLabel: "Current state and block history",
  },
  {
    title: "Understanding the Hyperledger Fabric Test Network",
    idea: "A query reads current state. A transaction requests a change.",
    scene: "query",
    notes:
      "Compare GetBalance with TransferCredits. A query evaluates current state without ordering a new ledger update. It is still subject to identity and access rules. A submitted transfer prepares writes, then requires ordering, validation and valid commit before the state changes. Ask pairs to identify which operation the balance refresh button performs.",
    labels: ["Read balance", "Request transfer", "Wait for commit"],
    activity: {
      label: "Choose · 30 sec",
      prompt: "Does refreshing a balance need a new transfer transaction?",
      answer:
        "No. A query reads current state without submitting new writes for ordering.",
    },
    explanation:
      "A query reads state; a submitted transaction may change it after valid commit.",
    syllabusTopic: 5,
    sectionLabel: "Read queries and state-changing requests",
  },
  {
    title: "Demonstration of Blockchain Transactions Using Fabric",
    idea: "Reveal each stage. Watch when the balance changes.",
    scene: "fabric-flow",
    notes:
      "Use the transaction explorer. Pause at endorsement and ask whether Alice's balance has changed yet. Only the valid commit applies the prepared writes. Repeat with validation failure and note that real validation can reject stale reads or insufficient endorsements.",
    labels: [],
    simulationType: "fabric-flow",
    syllabusTopic: 6,
    sectionLabel: "Transaction flow model",
  },
  {
    title: "Demonstration of Blockchain Transactions Using Fabric",
    idea: "Execution prepares a result; validation decides whether it applies.",
    scene: "endorsement",
    explanation:
      "An endorsement is a signed proposed result. A valid commit updates the saved balances.",
    notes:
      "Compare proposed 80/70 with committed 100/50. Endorsements attest to a simulated result. Required endorsement policy and version checks are validated before current state changes. Do not teach the orderer as the component that executes the transfer rule.",
    labels: ["Simulated result", "Required endorsements", "Valid commit"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Can an endorsed transaction still fail later?",
      answer:
        "Yes. Peers validate endorsements and read versions before valid writes change current state.",
    },
    syllabusTopic: 6,
    sectionLabel: "Endorsement and valid commit",
  },
  {
    title: "Demonstration of Blockchain Transactions Using Fabric",
    scene: "live-demo",
    idea: "Use the real app and confirm valid commit before reporting new balances.",
    explanation:
      "Use the real app and confirm valid commit before reporting new balances.",
    notes:
      "Complete the instructor demonstration by 14:10 using the downloaded kit and prepared network. Initialize 100/50 once; Alice transfers 20; wait for valid commit and a real transaction ID; read 80/70. Attempt 1,000 and the wrong signer; read unchanged balances. The slide describes an expected flow. Only the separately running application provides live Fabric evidence.",
    activity: {
      label: "Predict · discuss",
      prompt: "What distinguishes this from the browser rehearsal?",
      answer:
        "The real app submits to Fabric, checks valid commit, reports its transaction ID and reads the ledger.",
    },
    syllabusTopic: 6,
    sectionLabel: "Instructor live demonstration",
  },
  {
    title: "Introduction to Hyperledger Fabric",
    idea: "Which balance should the app show as confirmed?",
    scene: "fabric-check",
    notes:
      "Ask the room to vote. Explain that the application waits for valid commit and reads balances again. Concurrency/version conflicts are instructor context, not a second student project.",
    labels: [],
    quizIndex: 3,
    sectionLabel: "Knowledge check",
  },
  {
    title: "Understanding the Project Architecture and Workflow",
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
    syllabusTopic: 1,
  },
  {
    title: "Understanding the Project Architecture and Workflow",
    idea: "Two wallets. One transfer. Clear rules.",
    scene: "project",
    notes:
      "14:10–14:35. Explain the real project: application-defined demo credits, Alice bound to an Org1 identity and Bob to Org2. The two users are not the organizations themselves. No real money or native Fabric currency is involved.",
    labels: ["Alice: 100", "Transfer: 20", "Bob: 50"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Is Fabric itself creating these credits for us?",
      answer: "No. Our contract defines the records and their rules.",
    },
    syllabusTopic: 1,
    sectionLabel: "Project accounts",
  },
  {
    title: "Understanding the Project Architecture and Workflow",
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
    syllabusTopic: 1,
    sectionLabel: "Predict the balances",
  },
  {
    scene: "project-setup",
    title: "Setting Up the Development Environment",
    idea: "Installation is completed before the day; use the supplied readiness and launch commands.",
    explanation:
      "Installation is completed before the day; use the supplied readiness and launch commands.",
    notes:
      "Open the downloaded Campus Credits kit inside Ubuntu. Dependencies and runtime images were cached before workshop day. Explain npm run check, npm run network, npm run deploy and npm start. Save existing edits before selecting starter or solution. No installation marathon is scheduled during the practical.",
    activity: {
      label: "Discuss",
      prompt: "Which part should already be completed before the workshop?",
      answer:
        "Installing WSL/Ubuntu, Docker integration, Node.js, Fabric tools and project dependencies.",
    },
    syllabusTopic: 2,
  },
  {
    title:
      "Mini Project – Blockchain-Based Digital Wallet & Transaction System",
    idea: "The small rule, not the entire network.",
    scene: "readiness-check",
    notes:
      "14:45–15:00. Confirm Docker and dependencies were installed beforehand. Open the real kit; explain npm run use:starter, the three TODOs, npm run deploy and npm start. Save edits before selecting the solution. Keep 15:00–16:00 for students.",
    labels: [],
    quizIndex: 4,
    sectionLabel: "Knowledge check",
  },
  {
    title: "Creating Simulated Wallet Accounts",
    idea: "A demo wallet account is a ledger record holding a balance and its owner’s identity. Alice and Bob represent simulated credits stored on a real Fabric ledger.",
    scene: "wallet",
    explanation:
      "A demo wallet account is a ledger record holding a balance and its owner’s identity. Alice and Bob represent simulated credits stored on a real Fabric ledger.",
    notes:
      "Introduce only the JavaScript needed: object fields, function arguments, if/throw, basic arithmetic, await. The supplied contract binds owner certificate fingerprints and MSPs. Students complete the arithmetic guards; they do not write certificate handling.",
    labels: ["Wallet ID", "Owner identity + MSP", "Whole-number balance"],
    activity: {
      label: "Discuss · 30 sec",
      prompt: "Why isn't an owner's display name enough?",
      answer:
        "The contract needs an actual validated signing identity and its organization.",
    },
    syllabusTopic: 3,
  },
  {
    scene: "fabric-wallet-ids",
    title: "Generating and Managing Wallet Addresses",
    idea: "A wallet ID such as alice is an application label. Fabric checks the caller’s certificate and organization before allowing that caller to spend from the wallet.",
    explanation:
      "A wallet ID such as alice is an application label. Fabric checks the caller’s certificate and organization before allowing that caller to spend from the wallet.",
    notes:
      "Alice and Bob are application-level demo-credit accounts on a real Fabric ledger. Their identifiers are supplied labels; actual authorization uses the signing certificate fingerprint and MSP. Do not imply that typing a different address or label changes ownership.",
    activity: {
      label: "Discuss",
      prompt: "If Bob types alice as the sender wallet, may he debit it?",
      answer: "No. The actual signing identity must own that wallet.",
    },
    syllabusTopic: 4,
  },
  {
    title: "Implementing Virtual Currency Transfers",
    idea: "Virtual currency here means application-defined demo credits. The contract transfers these credits on a real Fabric ledger; they are not real money.",
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
    syllabusTopic: 5,
    sectionLabel: "Guided code: amount validation",
    explanation:
      "Virtual currency here means application-defined demo credits. The contract transfers these credits on a real Fabric ledger; they are not real money.",
  },
  {
    title: "Implementing Virtual Currency Transfers",
    idea: "A request for 1,000 must not change anything.",
    scene: "code",
    notes:
      "During the guided walkthrough, Start the prepared Fabric project, show 100/50, transfer 20 as Alice, wait for commit, refresh, then try insufficient funds. A business-rule rejection during endorsement is not automatically a ledger entry.",
    labels: ["Read current balance", "Reject overspending", "Preserve state"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Alice has 80. She requests 1,000. What changes?",
      answer: "Nothing. Reject before preparing any balance updates.",
    },
    code: 'if (senderBalance < amount) {\n  throw new Error("Insufficient credits");\n}\n// A rejected request changes no balances.',
    layout: "code",
    syllabusTopic: 5,
    sectionLabel: "Guided code: sufficient funds",
  },
  {
    title: "Implementing Virtual Currency Transfers",
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
    syllabusTopic: 5,
    sectionLabel: "Student starter: three TODOs",
  },
  {
    title: "Creating Transaction Records",
    idea: "A transaction record captures a requested change and its result on the ledger. Our transfer updates two wallet balances together after valid commit.",
    scene: "code",
    notes:
      "Explain that putState prepares writes during execution; it is not an immediate ledger commit. Show 80/70 then 90/60 in the real app. After the 14:35–14:45 break, walk through the supplied identity check, starter TODOs and launch commands until 15:00.",
    labels: ["Debit sender", "Credit recipient", "Wait for valid commit"],
    activity: {
      label: "Predict · 30 sec",
      prompt: "Does putState immediately prove a successful transfer?",
      answer:
        "No. It prepares writes during execution. Only a valid commit updates current state.",
    },
    code: "const result = prepareTransfer(\n  sender.balance, recipient.balance, rawAmount\n);\nsender.balance = result.senderBalance;\nrecipient.balance = result.recipientBalance;\nawait ctx.stub.putState(senderKey, encode(sender));\nawait ctx.stub.putState(recipientKey, encode(recipient));\n// Only valid commit applies these prepared writes.",
    layout: "code",
    syllabusTopic: 6,
    sectionLabel: "Atomic updates and transaction records",
    explanation:
      "A transaction record captures a requested change and its result on the ledger. Our transfer updates two wallet balances together after valid commit.",
  },
  {
    scene: "fabric-block-storage",
    title: "Storing Transactions in Blocks",
    idea: "A block stores an ordered group of transaction records. In Fabric, the ordering service forms blocks and peers validate and append them.",
    explanation:
      "A block stores an ordered group of transaction records. In Fabric, the ordering service forms blocks and peers validate and append them.",
    notes:
      "Fabric manages the block format. Students do not implement a second blockchain inside the chaincode. Ordered transactions can be marked invalid during validation; invalid transactions remain in block history but do not update world state.",
    activity: {
      label: "Discuss",
      prompt:
        "Does the transfer function manually construct a new Fabric block?",
      answer:
        "No. The ordering and peer components handle block formation and commit.",
    },
    syllabusTopic: 7,
  },
  {
    scene: "fabric-block-hashes",
    title: "Generating SHA-256 Block Hashes",
    idea: "A block hash is a cryptographic fingerprint of its encoded header. Fabric generates data and header hashes; the transfer contract does not mine blocks.",
    explanation:
      "A block hash is a cryptographic fingerprint of its encoded header. Fabric generates data and header hashes; the transfer contract does not mine blocks.",
    notes:
      "Explain SHA-256 hashing as a platform-provided mechanism. Fabric’s block header contains the block number, previous header hash and data hash. The header hash is computed from its encoded header; it is not a mining nonce puzzle. Treat this as an instructor explanation of Fabric internals, not an additional student implementation.",
    activity: {
      label: "Discuss",
      prompt:
        "Should students copy the toy mining loop into their Fabric chaincode?",
      answer:
        "No. Fabric handles its ledger hashes and uses its configured ordering and validation mechanisms.",
    },
    syllabusTopic: 8,
    sectionLabel: "Fabric-managed operation",
  },
  {
    scene: "fabric-block-links",
    title: "Linking Blocks Using Previous Hashes",
    idea: "The previous_hash field refers to the preceding block header’s hash. This links blocks in sequence and helps detect changes to earlier records.",
    explanation:
      "The previous_hash field refers to the preceding block header’s hash. This links blocks in sequence and helps detect changes to earlier records.",
    notes:
      "Point to number, data_hash and previous_hash in a simplified Fabric header. Exact encoded bytes are managed by Fabric. Explain that changing an earlier header would break the expected link and other integrity checks. This diagram is illustrative, not evidence of a live block fetch.",
    activity: {
      label: "Discuss",
      prompt: "Which field connects this block to its predecessor?",
      answer: "previous_hash refers to the preceding block header hash.",
    },
    syllabusTopic: 9,
    sectionLabel: "Fabric-managed operation",
  },
  {
    scene: "fabric-integrity",
    title: "Implementing Blockchain Integrity Verification",
    idea: "Integrity verification checks that recorded data matches its expected hashes and signatures. Fabric also validates transactions before applying state changes.",
    explanation:
      "Integrity verification checks that recorded data matches its expected hashes and signatures. Fabric also validates transactions before applying state changes.",
    notes:
      "Separate block integrity from transaction validity. Hashes and signatures protect the recorded data; peers also check endorsement policies and read versions before applying writes. The student implementation checks amount, funds and resulting balances; the supplied platform handles ledger verification.",
    activity: {
      label: "Discuss",
      prompt:
        "Does a valid data hash make an unauthorized transfer acceptable?",
      answer:
        "No. Cryptographic integrity and transaction authorization are different checks.",
    },
    syllabusTopic: 10,
    sectionLabel: "Platform-provided verification",
  },
  {
    scene: "fabric-tampering",
    title: "Detecting Modified or Tampered Transactions",
    idea: "Tampering means changing data without valid authorization. Altering signed transaction bytes causes the expected signature or integrity check to fail.",
    explanation:
      "Tampering means changing data without valid authorization. Altering signed transaction bytes causes the expected signature or integrity check to fail.",
    notes:
      "Relate this diagram to the real browser signature experiment from the morning. It is a conceptual explanation of altered content, not a demonstration of rewriting a live Fabric ledger. In the real practical, demonstrate wrong-signer and invalid-input rejections and inspect unchanged balances.",
    activity: {
      label: "Discuss",
      prompt: "Can a changed payload keep the original signature valid?",
      answer:
        "Not under the same signature verification rule; the signature covers the exact signed bytes.",
    },
    syllabusTopic: 11,
    sectionLabel: "Integrity explanation",
  },
  {
    title: "Testing the Complete Application",
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
    syllabusTopic: 12,
  },
  {
    title: "Testing the Complete Application",
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
    syllabusTopic: 12,
    sectionLabel: "Student build: 15:00–16:00",
  },
  {
    title: "Testing the Complete Application",
    idea: "A clearly labeled browser rehearsal of the same balances.",
    scene: "credits-lab",
    notes:
      "This is an in-memory simulation, not Fabric evidence. Use it to rehearse predictions or as a connectivity fallback. For the real practical, run the downloaded project and confirm committed transaction IDs. Swap the keyboard after the first successful transfer.",
    labels: [],
    simulationType: "credits",
    syllabusTopic: 12,
    sectionLabel: "Optional browser rehearsal: simulation",
  },
  {
    title: "Demonstration of the Completed Mini Project",
    idea: "Who signed? What changed? Why did it fail?",
    scene: "showcase",
    notes:
      "16:00–16:20. Invite pairs to show a real committed transfer and a rejection. Ask the partner who typed less to explain the signer and permission rule. Each pair keeps the total at 150. Use committed transaction IDs from the real app, not the rehearsal.",
    labels: ["Show a commit", "Show a rejection", "Explain the owner rule"],
    activity: {
      label: "Demonstrate · 10 min",
      prompt: "Ask the partner who did less typing to explain the rule.",
      answer:
        "Only the identity bound to the sender wallet may debit it; both resulting balances change together.",
    },
    syllabusTopic: 1,
  },
  {
    scene: "transaction-receipt",
    title: "Verifying Blockchain Transactions",
    idea: "Confirm valid commit, then query the ledger and compare both balances.",
    explanation:
      "Confirm valid commit, then query the ledger and compare both balances.",
    notes:
      "Use the real application’s transaction ID and commit result. After Alice sends 20, read 80/70; after Bob sends 10 back, read 90/60. A success message from the labeled rehearsal is not Fabric evidence. A timeout needs a ledger check before retrying.",
    activity: {
      label: "Discuss",
      prompt:
        "Is a browser success animation enough proof of a Fabric transfer?",
      answer:
        "No. Check the real committed transaction result and read the ledger balances.",
    },
    syllabusTopic: 2,
  },
  {
    scene: "production-network",
    title: "Understanding Real-World Blockchain Implementation",
    idea: "A real deployment needs independent operations, governance, resilience and controlled identities.",
    explanation:
      "A real deployment needs independent operations, governance, resilience and controlled identities.",
    notes:
      "Compare the single-laptop learning environment with independently operated organizations. The local identity selector is not production authentication. Production decisions include key management, policies, privacy, availability and operational responsibility. Do not present this local workshop project as a production payment service.",
    activity: {
      label: "Discuss",
      prompt:
        "What differs between our one-laptop network and production operations?",
      answer:
        "Independent administration, resilient infrastructure, identity handling, governance and security controls.",
    },
    syllabusTopic: 3,
  },
  {
    title: "Common Challenges and Security Considerations",
    scene: "security",
    idea: "A local demonstration is a starting point, not a production payment system.",
    explanation:
      "A local demonstration is a starting point, not a production payment system.",
    notes:
      "Discuss key handling, actual caller authorization, strict amount checks and valid-commit confirmation. The demo identity selector is not production login. Production also needs privacy, operational resilience, dependency management and security review. Do not ask students for real money or private keys.",
    activity: {
      label: "Predict · discuss",
      prompt: "What needs work before real users could use this system?",
      answer:
        "Authentication, key management, access policies, privacy, operations and a fuller security review.",
    },
    syllabusTopic: 4,
  },
  {
    title: "Future Learning Pathways in Blockchain Development",
    scene: "next-steps",
    idea: "Practice JavaScript, then explore Fabric identities, policies and application design.",
    explanation:
      "Practice JavaScript, then explore Fabric identities, policies and application design.",
    notes:
      "Close at 16:30. Suggest networking and cryptography foundations, the official Fabric application tutorial, then production identities and policies. Ethereum is a separate follow-up learning path, not another installation today. Source: https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html",
    activity: {
      label: "Predict · discuss",
      prompt: "In one sentence: who may debit Alice’s wallet?",
      answer:
        "Only the actual signing identity bound to Alice’s wallet, subject to all other transfer and validation rules.",
    },
    syllabusTopic: 5,
  },
  {
    title: "Interactive Q&A Session",
    idea: "Leave with a reason, not just a working button.",
    scene: "finish",
    notes:
      "16:20–16:30. Ask what changed, who signed, why a request failed and when a database is enough. Let students explain, then take questions. The local demo is not production-ready.",
    labels: [],
    quizIndex: 5,
    syllabusTopic: 6,
    sectionLabel: "Exit question and Q&A",
  },
];
export const STUDENT_BUILD_SLIDE =
  BEGINNER_LESSONS.findIndex((lesson) => lesson.scene === "practical") + 1;
