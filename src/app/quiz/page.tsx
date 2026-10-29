import type { Metadata } from "next";
import { LiveQuiz } from "@/components/quiz/LiveQuiz";
import "./quiz.css";
export const metadata: Metadata = {
  title: "Join the live quiz · Blockchain Lab",
  description:
    "Join the workshop quiz with your room code. Twenty seconds, one answer, a live leaderboard.",
};
export default function QuizPage() {
  return <LiveQuiz />;
}
