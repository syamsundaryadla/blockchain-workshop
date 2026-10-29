import type { Metadata } from "next";
import { LiveQuiz } from "@/components/quiz/LiveQuiz";
import "../quiz.css";
export const metadata: Metadata = {
  title: "Host a live quiz · Blockchain Lab",
  robots: { index: false, follow: false },
};
export default function HostQuizPage() {
  return <LiveQuiz host />;
}
