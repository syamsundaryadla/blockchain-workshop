import type { Slide } from "@/types/presentation";
import { BEGINNER_LESSONS } from "./beginner-workshop";
import { WORKSHOP_MODULES } from "./modules";
import { WORKSHOP_QUIZZES } from "./quizzes";
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
        points: lesson.labels,
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
      speakerNotes: lesson.notes,
      simulationType: lesson.simulationType,
      ...(lesson.quizIndex !== undefined
        ? { quiz: WORKSHOP_QUIZZES[lesson.quizIndex] }
        : {}),
    };
  },
);
