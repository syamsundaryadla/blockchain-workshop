/** Selective on-slide prompts; each example replaces part of the explanation time. */
export interface TeachingCue {
  subtopics: string[];
  example?: string;
  note: string;
}

export const TEACHING_CUES: Record<string, TeachingCue> = {
  "blockchain-definition": {
    subtopics: ["Shared record", "Linked blocks", "Agreed rules"],
    example:
      "Two campus clubs keep matching copies of the same expense register.",
    note: "Use the register analogy in 30 seconds. Ask what happens when one club changes only its own copy; connect the answer to verification, not automatic truth.",
  },
  banking: {
    subtopics: ["Separate records", "Reconciliation", "Trusted intermediary"],
    example: "A transfer between two banks requires their records to agree.",
    note: "Spend 30 seconds on reconciliation: checking separate records match. Banks also provide valuable services; blockchain does not remove every intermediary or delay.",
  },
  conflict: {
    subtopics: ["Multiple participants", "Shared history", "Common rules"],
    example:
      "A supplier and a college disagree about when equipment was delivered.",
    note: "Ask which parties should approve a delivery record. Cap the example at 30 seconds; a recorded claim still needs reliable evidence from the physical world.",
  },
  transaction: {
    subtopics: ["Who requests?", "What changes?", "Is it allowed?"],
    note: "Point to Alice, Bob and 20 credits in the diagram. Ask for the expected balances before playing the next animation. Do not explain the same transfer twice.",
  },
  "block-fields": {
    subtopics: ["Transaction data", "Header", "Previous-block link"],
    note: "Use the existing field diagram. Explain that nonce and timestamp here illustrate common blockchain concepts; the later Fabric block format differs. Keep platform details to 45 seconds.",
  },
  hash: {
    subtopics: ["Digital fingerprint", "Changed input", "Integrity check"],
    example:
      "Change ‘send 20’ to ‘send 200’; compare the two SHA-256 fingerprints.",
    note: "Use this as the input for the following hashing lab. Ask for a prediction first, then let students change one character; avoid a second separate demo.",
  },
  "hash-vs-encryption": {
    subtopics: ["Hash: compare", "Encrypt: conceal"],
    example:
      "Hash a document to check changes; encrypt its contents to keep them secret.",
    note: "Allow 30 seconds. A hash is not a reversible encrypted message, and hashing alone does not prove who created the document.",
  },
  "ledger-replicas": {
    subtopics: ["Copies", "Synchronization", "Verification"],
    example: "Org1 and Org2 keep matching committed Campus Credits records.",
    note: "Point to the copies in the diagram. Briefly distinguish multiple copies from the rules that make participants agree; limit this example to 30 seconds.",
  },
  p2p: {
    subtopics: ["Peers", "Message relay", "Reachable paths"],
    note: "Use the network diagram and upcoming propagation lab. Ask students to point out another reachable route; extra connections do not guarantee consensus.",
  },
  verification: {
    subtopics: ["Valid signature?", "Valid request?", "Enough balance?"],
    example: "Alice has 100 credits. A request to send 200 must fail.",
    note: "Ask which check fails and whether balances should change. Use 30 seconds; a correctly signed request can still violate business rules.",
  },
  agreement: {
    subtopics: ["Accepted order", "Shared rules", "Consistent history"],
    example:
      "Two requests each spend 80 of Alice’s 100 credits. Both cannot take effect.",
    note: "Take one prediction in 45 seconds. Explain that ordering and validation rules determine the accepted outcome; receipt by a node is not final acceptance.",
  },
  pow: {
    subtopics: ["Candidate block", "Nonce search", "Difficulty target"],
    note: "Use the next toy mining lab once, for at most three minutes. It uses real hashes with an easy teaching target and is not a full mining network.",
  },
  pos: {
    subtopics: ["Stake", "Validators", "Protocol rules"],
    note: "Compare with PoW for one minute: validators use stake under protocol rules rather than a PoW nonce race. Avoid validator economics and production configuration today.",
  },
  "cryptography-tools": {
    subtopics: [
      "Hash: detect changes",
      "Encrypt: hide data",
      "Sign: verify approval",
    ],
    note: "Point to each tool in the diagram and name its job. Move to the signature demonstration rather than adding cryptography mathematics.",
  },
  identity: {
    subtopics: ["Private key", "Public key", "Digital signature"],
    example:
      "Alice signs ‘send 20’. Editing it to ‘send 200’ breaks signature verification.",
    note: "Use this exact message in the following signature lab. Students predict the edited-message result; keep keys private even though these are disposable demo identities.",
  },
  "wallet-address": {
    subtopics: ["Manage keys", "Receive address", "Sign requests"],
    example: "Knowing Alice’s public address does not let Bob spend her funds.",
    note: "Use 30 seconds to distinguish an address from spending authority. Later, distinguish Fabric certificates and application wallet IDs from public-chain addresses.",
  },
  rules: {
    subtopics: ["Inputs", "Permission checks", "State changes"],
    example:
      "Transfer only when the signer owns the sender wallet and has enough credits.",
    note: "Turn the sentence into an if-condition aloud. Cap at 45 seconds; students implement only the supplied transfer-rule TODOs in the afternoon.",
  },
  dapp: {
    subtopics: ["User interface", "Signing identity", "Contract rules"],
    example:
      "The Transfer button sends a request; contract rules decide whether it is allowed.",
    note: "Point to the interface and contract separately. A pleasant screen cannot bypass ledger authorization; use the existing architecture diagram for 30 seconds.",
  },
  "identity-verification": {
    subtopics: ["Issuer", "Record fingerprint", "Verification"],
    example:
      "An employer checks that a degree record matches the university’s issued record.",
    note: "Use a hypothetical degree-checking example in 30 seconds. The university must still verify the original qualification; storing a fingerprint does not make a false degree true.",
  },
  voting: {
    subtopics: ["Eligible voter", "One vote", "Ballot secrecy"],
    example:
      "A college election must prevent duplicate votes while protecting voter privacy.",
    note: "Allow 30 seconds. This is a design challenge, not a claim that blockchain alone delivers secure voting. Eligibility, coercion, secrecy and endpoint security need separate solutions.",
  },
  records: {
    subtopics: ["Sensitive data", "Access rules", "Audit trail"],
    example:
      "Keep a medical file in controlled storage; record a verification reference on the ledger.",
    note: "Explain this as a possible design, not a universal healthcare solution. Avoid public patient data; use 30 seconds to ask who should receive access.",
  },
  tradeoffs: {
    subtopics: ["Privacy", "Performance", "Governance"],
    note: "Ask who operates the network and resolves disputes. Keep to one minute and use the following truthful-input and database comparisons to close the concept.",
  },
  permissions: {
    subtopics: ["Membership", "Authentication", "Authorization"],
    example: "Bob may join the network, but he cannot debit Alice’s wallet.",
    note: "Ask students to explain why a valid member may still be rejected. Spend 30 seconds on the example and use the existing prediction as the checkpoint.",
  },
  channel: {
    subtopics: ["Participating members", "Separate ledger", "Channel policies"],
    example: "Org1 and Org2 share Campus Credits records on mychannel.",
    note: "Use the private-group analogy for 30 seconds. Channel membership scopes the shared ledger; it does not automatically hide every record from every channel member.",
  },
  "state-history": {
    subtopics: ["Current values", "Ordered transaction history"],
    example:
      "After Alice sends 20: current balances are 80/70; history retains the transfer.",
    note: "Point to current state and history in turn. Only valid committed writes update state. Keep the distinction to 45 seconds and return to it in the real demo.",
  },
  query: {
    subtopics: ["Query: read", "Submit: request a change"],
    example:
      "Refresh balances reads state. Transfer 20 requests a ledger update.",
    note: "Use the two interface actions in 30 seconds. A query does not create a new committed transfer; submission still needs validation and valid commit.",
  },
  endorsement: {
    subtopics: ["Simulate", "Endorse", "Validate and commit"],
    note: "Use the transaction flow already shown. Ask whether endorsement alone changes balances; keep the recap to 45 seconds before the real demonstration.",
  },
  architecture: {
    subtopics: ["Browser interface", "Gateway backend", "Chaincode and ledger"],
    note: "Trace one Transfer click through the diagram, using Alice sends 20. Do not introduce another app or ask students to implement the prepared backend.",
  },
  "fabric-wallet-ids": {
    subtopics: ["Wallet label", "Signing certificate", "Owner check"],
    example:
      "The label ‘alice’ selects a record; Alice’s signing identity authorizes spending.",
    note: "Use 45 seconds. Browser-supplied names are not proof of identity. The contract checks the actual signing identity and its MSP against the stored owner.",
  },
  tests: {
    subtopics: ["Successful transfer", "Invalid amount", "Wrong signer"],
    note: "Preview the acceptance checks, then let pairs run them during the protected build hour. Require one valid commit and one rejection with unchanged balances.",
  },
  security: {
    subtopics: ["Protect keys", "Check permissions", "Validate inputs"],
    example:
      "Changing the sender name in a browser must never grant access to another wallet.",
    note: "Tie security to the wrong-signer test students already ran. Use 30 seconds; production authentication and operations are follow-up work.",
  },
};

export const FABRIC_COMPONENTS = [
  {
    name: "Peer",
    job: "Maintains the ledger and executes chaincode",
    analogy: "Company computer",
    example: "Org1’s peer checks Alice’s transfer.",
  },
  {
    name: "Chaincode",
    job: "Contains smart contract business logic",
    analogy: "Rulebook",
    example: "Reject a transfer above the sender’s balance.",
  },
  {
    name: "Ledger",
    job: "Stores blockchain history and current state",
    analogy: "Shared register",
    example: "Keep the transfer history and balances 80 / 70.",
  },
  {
    name: "Ordering Service",
    job: "Orders transactions into blocks",
    analogy: "Record organizer",
    example: "Sequence endorsed transfers into a block.",
  },
  {
    name: "MSP",
    job: "Defines trusted organizational identities",
    analogy: "Identity authority",
    example: "Recognize Alice’s identity as belonging to Org1.",
  },
  {
    name: "Channel",
    job: "Provides a separate ledger for participating members",
    analogy: "Private group",
    example: "Org1 and Org2 share records on mychannel.",
  },
];

export function teachingNotes(scene: string, original: string): string {
  const cue = TEACHING_CUES[scene];
  if (scene === "certificate")
    return `${original} Component comparison (three minutes): ${FABRIC_COMPONENTS.map((c) => `${c.name}: ${c.job}. Analogy: ${c.analogy}. Campus Credits example: ${c.example}`).join(" ")} These are memory aids: peers also validate and commit; the orderer does not execute the transfer rules; an MSP defines trust while a CA issues certificates. A channel separates ledgers but still requires access policies. Revisit the same examples in the following diagrams rather than adding another lecture.`;
  return cue
    ? `${original} Subtopics: ${cue.subtopics.join("; ")}.${cue.example ? ` Example: ${cue.example}` : ""} Teaching cue: ${cue.note}`
    : original;
}
