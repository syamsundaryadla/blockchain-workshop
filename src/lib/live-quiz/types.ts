export type QuizPhase =
  | "lobby"
  | "countdown"
  | "question"
  | "leaderboard"
  | "finished";
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
export type QuizSession = {
  code: string;
  token: string;
  role: "host" | "player";
};
export type QuizStanding = {
  id: string;
  name: string;
  score: number;
  correct: number;
  rank: number;
};
export type QuizState = {
  code: string;
  title: string;
  phase: QuizPhase;
  serverNow: number;
  revision: number;
  expiresAt: number;
  index: number;
  total: number;
  startsAt: number;
  endsAt: number;
  duration: number;
  count: number;
  capacity: number;
  answered: number;
  isHost: boolean;
  question: null | {
    id: string;
    question: string;
    options: string[];
    correctIndex?: number;
    explanation?: string;
  };
  standings: QuizStanding[];
  players: { id: string; name: string }[];
  me:
    | null
    | (Omit<QuizStanding, "rank"> & {
        rank: number | null;
        answer: number | null;
        points: number | null;
      });
};
export const QUIZ_PACKS = [
  {
    id: "foundations",
    title: "Morning · Blockchain Foundations",
    description:
      "12 questions on ledgers, hashes, networks, consensus and trust.",
    count: 12,
  },
  {
    id: "workshop",
    title: "Afternoon · Full Syllabus",
    description:
      "15 questions covering the full day, including Fabric and Campus Credits.",
    count: 15,
  },
] as const;
