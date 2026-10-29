import type { Slide } from "@/types/presentation";
import { BEGINNER_LESSONS } from "./beginner-workshop";
import { WORKSHOP_MODULES } from "./modules";
import { WORKSHOP_QUIZZES } from "./quizzes";
import {
  FABRIC_COMPONENTS,
  TEACHING_CUES,
  teachingNotes,
} from "./teaching-cues";
export const PRESENTATION_SLIDES: Slide[] = BEGINNER_LESSONS.map(
  (lesson, index) => {
    const slideNumber = index + 1;
    const module = WORKSHOP_MODULES.find(
      (m) => slideNumber >= m.slideRange[0] && slideNumber <= m.slideRange[1],
    )!;
    return {
      id: `slide-${slideNumber}`,
      moduleId: module.id,
      slideNumber,
      title: lesson.title,
      subtitle: lesson.idea,
      category: module.title,
      content: {
        lead: lesson.idea,
        points:
          lesson.scene === "certificate"
            ? FABRIC_COMPONENTS.map(
                (c) => `${c.name} — ${c.job}. ${c.analogy}: ${c.example}`,
              )
            : [
                ...(lesson.labels ?? []),
                ...(TEACHING_CUES[lesson.scene]?.subtopics ?? []),
                ...(TEACHING_CUES[lesson.scene]?.example
                  ? [`Example: ${TEACHING_CUES[lesson.scene].example}`]
                  : []),
              ],
        ...(lesson.code
          ? {
              codeSnippet: {
                language: "javascript",
                filename: "Campus Credits / JavaScript excerpt",
                code:
                  lesson.code +
                  (lesson.secondCode ? "\n\n" + lesson.secondCode : ""),
              },
            }
          : {}),
      },
      speakerNotes: teachingNotes(lesson.scene, lesson.notes),
      simulationType: lesson.simulationType,
      ...(lesson.quizIndex !== undefined
        ? { quiz: WORKSHOP_QUIZZES[lesson.quizIndex] }
        : {}),
    };
  },
);
