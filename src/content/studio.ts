import { BEGINNER_LESSONS } from "./beginner-workshop";
export type VisualKind =
  | "chain"
  | "hash"
  | "network"
  | "transaction"
  | "consensus"
  | "fabric"
  | "docker"
  | "state"
  | "contract";
export const LESSON_EDITORIAL = BEGINNER_LESSONS.map((l) => ({
  title: l.title,
  idea: l.explanation ?? l.idea,
  visual: "chain" as VisualKind,
  labels: l.labels ?? [],
}));
const LAB_DEFINITIONS = [
  {
    type: "hasher",
    title: "SHA-256 Hashing Simulation",
    description: "Change one letter. Compare the real fingerprint.",
    route: "/simulations/hasher",
    visual: "hash",
    topic: "Hashes",
  },
  {
    type: "blockchain",
    title: "Blockchain Linking and Tampering Simulation",
    description:
      "Edit a record and inspect failed links. A toy chain, not Fabric.",
    route: "/simulations/blockchain",
    visual: "chain",
    topic: "Blocks",
  },
  {
    type: "broadcast",
    title: "Transaction Propagation Simulation",
    description:
      "Separate receipt, local verification and confirmation in a manual model.",
    route: "/simulations/broadcast",
    visual: "network",
    topic: "P2P propagation",
  },
  {
    type: "mining",
    title: "Proof of Work and Mining Simulation",
    description:
      "Real SHA-256 with an easy teaching target. No live network or currency.",
    route: "/simulations/proof-of-work",
    visual: "consensus",
    topic: "Mining puzzle",
  },
  {
    type: "signatures",
    title: "Digital Signature Simulation",
    description: "Sign a real message, change it, and test its signature.",
    route: "/simulations/signatures",
    visual: "transaction",
    topic: "Identity",
  },
  {
    type: "fabric-flow",
    title: "Hyperledger Fabric Transaction Flow",
    description: "Reveal each stage. Watch when saved balances change.",
    route: "/simulations/fabric",
    visual: "fabric",
    topic: "Transaction journey",
  },
  {
    type: "credits",
    title: "Virtual Currency Transfer Rehearsal",
    description:
      "Predict balances and try permission failures in a labeled simulation.",
    route: "/mini-project",
    visual: "state",
    topic: "Project rehearsal",
  },
] as const;
export function getLabSlide(type: string) {
  const index = BEGINNER_LESSONS.findIndex(
    (lesson) => lesson.simulationType === type,
  );
  if (index < 0) throw new Error(`No workshop lesson for lab: ${type}`);
  return index + 1;
}
export const STUDIO_LABS = LAB_DEFINITIONS.map((lab) => ({
  ...lab,
  slide: getLabSlide(lab.type),
}));
