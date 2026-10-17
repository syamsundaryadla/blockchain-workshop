import Link from "next/link";
import { INSTRUCTOR_GUIDE } from "@/content/practical";
export default function InstructorPage() {
  const sections = INSTRUCTOR_GUIDE.split("\n## ").slice(1);
  return (
    <main className="workshop-kit instructor-kit">
      <header className="kit-navigation">
        <Link href="/workshop" className="text-button">
          ← Student kit
        </Link>
        <a
          href="/workshop/instructor-guide.md"
          download
          className="text-button"
        >
          Download instructor notes ↓
        </a>
      </header>
      <section className="kit-intro">
        <span className="eyebrow">Presenter companion</span>
        <h1>
          Teach the idea.
          <br />
          Then let them try.
        </h1>
        <p>Timing, audience activities, and recovery steps for a live beginner workshop.</p>
      </section>
      <div className="instructor-sections">
        {sections.map((section) => {
          const [title, ...lines] = section.split("\n");
          return (
            <section key={title}>
              <h2>{title}</h2>
              {lines.filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </section>
          );
        })}
      </div>
      <Link href="/workshop/replay" className="studio-button primary">
        Open the labeled fallback models →
      </Link>
    </main>
  );
}
