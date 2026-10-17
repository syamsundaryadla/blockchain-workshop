"use client";
import React, { useState } from "react";
import type { LessonActivity } from "@/content/beginner-workshop";
export function LessonPrompt({ activity }: { activity: LessonActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <aside
      className={`lesson-prompt ${open ? "answer-open" : ""}`}
      aria-label="Audience activity"
    >
      <div>
        <span className="eyebrow">{activity.label}</span>
        <p>{activity.prompt}</p>
        {open && (
          <p className="prompt-answer" role="status">
            {activity.answer}
          </p>
        )}
      </div>
      <button
        className="text-button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide reasoning" : "Reveal reasoning"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
    </aside>
  );
}
