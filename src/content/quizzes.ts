import type { QuizQuestion } from "@/types/presentation";
export const WORKSHOP_QUIZZES: QuizQuestion[] = [
  {
    id: "prediction-1",
    question:
      "One trusted college office manages its own attendance records. What would you consider first?",
    options: [
      "A database with permissions and an audit log",
      "A blockchain for every record",
      "A cryptocurrency for attendance",
    ],
    correctIndex: 0,
    explanation:
      "A trusted operator can use a database. Shared verification becomes useful when independent organizations need agreed rules and copies.",
  },
  {
    id: "prediction-2",
    question:
      "A false statement has a matching saved hash. What can we conclude?",
    options: [
      "The statement must be true",
      "The checked content matches that fingerprint",
      "The statement is encrypted",
    ],
    correctIndex: 1,
    explanation:
      "A matching fingerprint supports integrity of the checked content. It does not prove that the original statement was truthful.",
  },
  {
    id: "prediction-3",
    question:
      "Bob submits a request to debit Alice's wallet using Bob's signing identity. What should happen?",
    options: [
      "Accept it because Bob knows Alice's name",
      "Accept it because Bob is a network member",
      "Reject it because Bob does not own that wallet",
    ],
    correctIndex: 2,
    explanation:
      "A claimed sender is not proof. The contract must match the signing identity and organization to the wallet's authorized owner.",
  },
  {
    id: "prediction-4",
    question:
      "A transfer is endorsed but has not committed. Which balances are confirmed?",
    options: [
      "The proposed 80 / 70",
      "The existing 100 / 50",
      "Either result is equally final",
    ],
    correctIndex: 1,
    explanation:
      "Endorsement prepares a result. The app waits for valid commit before confirming the balance change.",
  },
  {
    id: "prediction-5",
    question: "What are students expected to complete during the final hour?",
    options: [
      "Docker, certificates, a network, backend, UI and contract from scratch",
      "Three small transfer-rule TODOs, then deploy and test with prepared tools",
      "A Solidity contract in Remix",
    ],
    correctIndex: 1,
    explanation:
      "The supplied kit handles the network, identity plumbing and UI. You focus on amount checks, sufficient funds and the two resulting balances.",
  },
  {
    id: "prediction-6",
    question:
      "Which situation most clearly motivates considering a shared blockchain?",
    options: [
      "One trusted operator needs a simple private list",
      "Independent organizations need a shared, verifiable record with agreed change rules",
      "A website needs a new color scheme",
    ],
    correctIndex: 1,
    explanation:
      "Start with the trust and coordination problem. Blockchain has costs, so a database may be the better choice when one operator is trusted.",
  },
];
