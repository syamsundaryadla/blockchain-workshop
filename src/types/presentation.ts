export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Slide {
  id: string;
  moduleId: number;
  slideNumber: number;
  title: string;
  subtitle?: string;
  category: string;
  content: {
    lead?: string;
    points?: string[];
    comparison?: {
      leftTitle: string;
      leftItems: string[];
      rightTitle: string;
      rightItems: string[];
    };
    quote?: string;
    codeSnippet?: {
      language: string;
      code: string;
      filename?: string;
    };
  };
  simulationType?: "hasher" | "blockchain" | "network" | "transaction" | "mining" | "fabric" | "docker" | "asset-demo" | "consensus" | "hello-blockchain";
  infographicType?: "centralized-vs-decentralized" | "sha256-pipeline" | "block-anatomy" | "transaction-lifecycle" | "consensus-comparison" | "docker-architecture" | "fabric-eov-flow" | "state-vs-ledger" | string;
  quiz?: QuizQuestion;
  speakerNotes: string;
}

export interface WorkshopModule {
  id: number;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  summary: string;
  topics: string[];
  slideRange: [number, number];
  primaryColor: string;
}
