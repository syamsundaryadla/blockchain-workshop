import { BEGINNER_LESSONS } from "./beginner-workshop";
import { teachingNotes } from "./teaching-cues";
export type WorkshopLayout =
  | "diagram"
  | "process"
  | "poster"
  | "code"
  | "code-pair"
  | "terminal";
export interface WorkshopFrame {
  layout: WorkshopLayout;
  eyebrow: string;
  cue: string;
  caption?: string;
  code?: string;
  secondCode?: string;
  filename?: string;
  diagram?: number;
  scene?: string;
  steps?: number;
}
export const WORKSHOP_FRAMES: Record<number, WorkshopFrame> =
  Object.fromEntries(
    BEGINNER_LESSONS.map((l, i) => [
      i + 1,
      {
        layout: l.layout ?? "diagram",
        eyebrow: [
          l.syllabusTopic ? `Topic ${l.syllabusTopic}` : "",
          l.sectionLabel,
        ]
          .filter(Boolean)
          .join(" · "),
        cue: teachingNotes(l.scene, l.notes),
        caption: l.caption,
        code: l.code,
        secondCode: l.secondCode,
        filename: "Campus Credits / JavaScript excerpt",
        diagram: l.diagram,
        scene: l.scene,
        steps: l.steps,
      },
    ]),
  );
