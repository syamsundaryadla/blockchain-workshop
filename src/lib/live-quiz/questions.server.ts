import type { QuizQuestion } from "./types";

// Only imported by the API. Answer keys must never be bundled into the quiz client.
const foundations: QuizQuestion[] = [
  {
    id: "shared-ledger",
    question: "What is a blockchain?",
    options: [
      "A shared record of linked blocks",
      "A password manager",
      "A faster type of Wi-Fi",
      "Every online database",
    ],
    correctIndex: 0,
    explanation:
      "A blockchain stores records in linked blocks. Participants follow agreed rules to verify additions.",
  },
  {
    id: "database",
    question:
      "One trusted college office manages attendance. What should it consider first?",
    options: [
      "Its own cryptocurrency",
      "A database with permissions",
      "Mining every attendance record",
      "A public blockchain for everything",
    ],
    correctIndex: 1,
    explanation:
      "When one operator is trusted, a database with permissions and an audit log may be sufficient.",
  },
  {
    id: "hash",
    question:
      "Change one letter in a message. What usually happens to its SHA-256 hash?",
    options: [
      "Only one digit changes",
      "It stays identical",
      "It changes dramatically",
      "It becomes a password",
    ],
    correctIndex: 2,
    explanation:
      "A small input change produces a very different fingerprint. Hashing is not encryption.",
  },
  {
    id: "link",
    question: "What connects a block to the block before it?",
    options: [
      "The sender's phone number",
      "A shared password",
      "Its file name",
      "A stored hash of the previous block",
    ],
    correctIndex: 3,
    explanation:
      "The previous-block hash makes changes to earlier history detectable when the links are checked.",
  },
  {
    id: "truth",
    question:
      "A false statement has a matching saved hash. What does that prove?",
    options: [
      "The checked content matches that fingerprint",
      "The statement is true",
      "Everyone agreed with the statement",
      "The statement is encrypted",
    ],
    correctIndex: 0,
    explanation:
      "Integrity is not truth. A blockchain cannot by itself verify that an input describes the real world correctly.",
  },
  {
    id: "hub",
    question:
      "The only central server goes offline. What can happen to its clients?",
    options: [
      "They automatically become miners",
      "They lose access to that service",
      "Every client becomes a new server",
      "Their passwords become public",
    ],
    correctIndex: 1,
    explanation:
      "A single central hub can be a point of failure. Actual recovery depends on the system's redundancy and design.",
  },
  {
    id: "receipt",
    question: "A peer has received a transaction. Is it necessarily confirmed?",
    options: [
      "Yes, receiving is confirmation",
      "Yes, if the sender is online",
      "No, validation and agreement still matter",
      "Only if its hash is short",
    ],
    correctIndex: 2,
    explanation:
      "Message delivery, local rule checks and ledger confirmation are different steps.",
  },
  {
    id: "private-key",
    question: "Which item must you keep secret?",
    options: [
      "A public key",
      "A public wallet address",
      "A transaction's public hash",
      "Your private signing key",
    ],
    correctIndex: 3,
    explanation:
      "The private key authorizes signatures. Knowing a public address does not give someone signing authority.",
  },
  {
    id: "consensus",
    question: "Why does a blockchain network need consensus rules?",
    options: [
      "To agree on accepted ledger updates",
      "To make every computer identical",
      "To hide every transaction",
      "To remove all network delays",
    ],
    correctIndex: 0,
    explanation:
      "Participants need agreed rules for which updates and history to accept, even when they do not all trust one operator.",
  },
  {
    id: "proof-of-work",
    question: "In Proof of Work, what do miners repeatedly try to find?",
    options: [
      "Someone else's private key",
      "A hash meeting the network's difficulty target",
      "A free Wi-Fi password",
      "A way to decrypt every transaction",
    ],
    correctIndex: 1,
    explanation:
      "Miners vary candidate data, such as a nonce, to find a hash that satisfies the difficulty target.",
  },
  {
    id: "proof-of-stake",
    question: "What does a validator put at stake in Proof of Stake?",
    options: [
      "Its screen resolution",
      "A list of friends",
      "Cryptocurrency as an economic commitment",
      "The recipient's private key",
    ],
    correctIndex: 2,
    explanation:
      "Stake creates an economic commitment. The protocol's rules determine validator selection, rewards and penalties.",
  },
  {
    id: "mango",
    question: "What did Walmart's mango blockchain pilot help trace?",
    options: [
      "The future price of every mango",
      "Whether every mango tasted sweet",
      "The Wi-Fi route used by a truck",
      "A mango lot's recorded path back to its origin",
    ],
    correctIndex: 3,
    explanation:
      "Linked supply-chain records helped trace the mango lot. The ledger still depends on trustworthy real-world inputs.",
  },
];
const fabric: QuizQuestion[] = [
  {
    id: "permissioned",
    question:
      "Hyperledger Fabric is primarily designed for which kind of network?",
    options: [
      "A permissioned network with known identities",
      "An anonymous mining competition",
      "A Wi-Fi mesh with no ledger",
      "A password-free public database",
    ],
    correctIndex: 0,
    explanation:
      "Fabric supports permissioned networks where organizations establish membership and policies.",
  },
  {
    id: "chaincode",
    question: "What is chaincode in our Fabric project?",
    options: [
      "The page's CSS",
      "The program enforcing ledger rules",
      "The Docker installer",
      "A cryptocurrency exchange",
    ],
    correctIndex: 1,
    explanation:
      "Chaincode contains the contract rules, including who can transfer credits and which amounts are allowed.",
  },
  {
    id: "owner",
    question:
      "Bob signs a request to spend Alice's credits. What should the contract do?",
    options: [
      "Accept because Bob knows her name",
      "Accept because Bob is a member",
      "Reject: Bob does not own her wallet",
      "Ask the browser to decide",
    ],
    correctIndex: 2,
    explanation:
      "Membership alone is not permission. The contract checks the verified signing identity against the wallet owner.",
  },
  {
    id: "endorsement",
    question:
      "A transfer is endorsed but has not committed. Which balance is confirmed?",
    options: [
      "The proposed new balance",
      "Both balances at once",
      "Whichever the browser displays",
      "The existing committed balance",
    ],
    correctIndex: 3,
    explanation:
      "Endorsement prepares a proposed result. The application confirms a change only after a valid commit.",
  },
  {
    id: "credits",
    question:
      "Alice has 100 credits and Bob has 50. Alice sends Bob 20. What are their new balances?",
    options: ["80 and 70", "120 and 30", "100 and 70", "80 and 50"],
    correctIndex: 0,
    explanation:
      "Debit Alice by 20 and credit Bob by 20. Their combined total stays 150.",
  },
  {
    id: "funds",
    question: "Alice has 80 credits and tries to send 90. What should happen?",
    options: [
      "Allow a negative balance",
      "Reject and leave both balances unchanged",
      "Send 80 automatically",
      "Create 10 extra credits",
    ],
    correctIndex: 1,
    explanation:
      "The sufficient-funds rule rejects the whole transfer. A failed request must not partially change state.",
  },
  {
    id: "ordering",
    question: "What is the ordering service responsible for?",
    options: [
      "Styling the wallet page",
      "Storing students' passwords",
      "Establishing transaction order and forming blocks",
      "Approving every user's business permissions",
    ],
    correctIndex: 2,
    explanation:
      "Orderers establish order and create blocks. Peers perform validation and apply valid updates.",
  },
  {
    id: "project-money",
    question: "What do the Campus Credits in this workshop represent?",
    options: [
      "Real money in a bank account",
      "Fabric's required native cryptocurrency",
      "Bitcoin mined on your laptop",
      "Application records used for learning",
    ],
    correctIndex: 3,
    explanation:
      "The credits are learning records in our application. Fabric does not require a native cryptocurrency.",
  },
];
const afternoonConcepts: QuizQuestion[] = [
  {
    id: "shared-organizations",
    question: "Which situation most clearly motivates a shared blockchain?",
    options: [
      "Independent organizations need a verifiable shared record",
      "A website needs a new color",
      "One person needs a private shopping list",
      "A spreadsheet has too many columns",
    ],
    correctIndex: 0,
    explanation:
      "Start with the trust and coordination problem. Independent organizations may benefit from shared verification and agreed change rules.",
  },
  {
    id: "tamper-links",
    question:
      "An old block is edited locally. Why can the next link fail verification?",
    options: [
      "The browser changes color",
      "The edited block's hash no longer matches the stored link",
      "All public keys vanish",
      "Every transaction becomes private",
    ],
    correctIndex: 1,
    explanation:
      "The following block refers to the earlier hash. Editing the earlier content changes its calculated fingerprint.",
  },
  {
    id: "consensus-platforms",
    question: "Do all blockchains use Proof of Work mining?",
    options: [
      "Yes, including every Fabric network",
      "Yes, if they store transactions",
      "No, different platforms use different agreement mechanisms",
      "No blockchain ever uses mining",
    ],
    correctIndex: 2,
    explanation:
      "Proof of Work is one approach. Ethereum uses Proof of Stake, while Fabric uses its permissioned ordering and validation model.",
  },
  {
    id: "contract-meaning",
    question: "What is a smart contract?",
    options: [
      "A legal document that cannot fail",
      "An AI that decides every transaction",
      "A password shared by all users",
      "A program that enforces defined rules",
    ],
    correctIndex: 3,
    explanation:
      "A smart contract executes programmed rules. Correct code, access checks and trusted inputs still matter.",
  },
  {
    id: "supply-chain-input",
    question:
      "A worker enters a false product origin. Does blockchain automatically fix it?",
    options: [
      "No, real-world inputs still need verification",
      "Yes, hashing detects all lies",
      "Yes, consensus inspects the physical product",
      "Only if the block is large enough",
    ],
    correctIndex: 0,
    explanation:
      "Tamper evidence helps identify changes to recorded information. It does not guarantee the truth of the original input.",
  },
  {
    id: "wallet-signature",
    question: "What does a valid digital signature help verify?",
    options: [
      "That the sender is wealthy",
      "That the signed content matches and the signer controls the corresponding key",
      "That the message is a true statement",
      "That the transaction has already committed",
    ],
    correctIndex: 1,
    explanation:
      "Signatures help authenticate signed content. They do not prove its truth or guarantee that a network has committed it.",
  },
  {
    id: "network-access",
    question: "What distinguishes permissioned participation?",
    options: [
      "There are never any identities",
      "Every user must mine a coin",
      "Membership and access follow defined policies",
      "The ledger cannot be distributed",
    ],
    correctIndex: 2,
    explanation:
      "A permissioned network controls participation through membership policies. It can still distribute its ledger across organizations.",
  },
];
export function questionsForPack(id: string): QuizQuestion[] | undefined {
  return id === "foundations"
    ? foundations
    : id === "workshop"
      ? [...afternoonConcepts, ...fabric]
      : undefined;
}
