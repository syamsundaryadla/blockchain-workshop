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
  idea: l.idea,
  visual: "chain" as VisualKind,
  labels: l.labels ?? [],
}));
export const STUDIO_LABS = [
  {
    type: "hasher",
    title: "The hash lab",
    description: "Change one letter. Compare the real fingerprint.",
    route: "/simulations/hasher",
    slide: 8,
    visual: "hash",
    topic: "Hashes",
  },
  {
    type: "blockchain",
    title: "Build a chain",
    description:
      "Edit a record. Find the failed check. A toy chain, not Fabric.",
    route: "/simulations/blockchain",
    slide: 11,
    visual: "chain",
    topic: "Blocks",
  },
  {
    type: "signatures",
    title: "Sign and verify",
    description: "Sign a real message, change it, and test its signature.",
    route: "/simulations/signatures",
    slide: 15,
    visual: "transaction",
    topic: "Identity",
  },
  {
    type: "fabric-flow",
    title: "Follow a Fabric transaction",
    description: "Reveal each stage. Watch when saved balances change.",
    route: "/simulations/fabric",
    slide: 27,
    visual: "fabric",
    topic: "Transaction journey",
  },
  {
    type: "credits",
    title: "Campus Credits rehearsal",
    description:
      "Predict balances and try permission failures in a labeled simulation.",
    route: "/mini-project",
    slide: 41,
    visual: "state",
    topic: "Project rehearsal",
  },
] as const;
