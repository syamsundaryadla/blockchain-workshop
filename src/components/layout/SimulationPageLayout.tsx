"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Blocks, ChevronDown } from "lucide-react";
import { STUDIO_LABS } from "@/content/studio";
import { LESSON_EDITORIAL } from "@/content/studio";

interface SimulationPageLayoutProps {
  title: string;
  subtitle: string;
  slideNumber: number;
  moduleName: string;
  children: ReactNode;
}

export function SimulationPageLayout({
  title,
  subtitle,
  slideNumber,
  moduleName,
  children,
}: SimulationPageLayoutProps) {
  const [showContext, setShowContext] = useState(false);
  const lab = STUDIO_LABS.find((l) => l.slide === slideNumber);
  return (
    <div className="standalone-lab">
      <header className="directory-header">
        <Link href="/" className="wordmark">
          <Blocks size={23} strokeWidth={1.5} />
          blockchain<span>lab</span>
          <span className="wordmark-period">.</span>
        </Link>
        <Link className="text-button" href="/simulations">
          All experiments <ArrowUpRight size={14} />
        </Link>
      </header>
      <main className="standalone-main">
        <Link className="lab-back-link" href={lab ? `/?slide=${slideNumber}` : "/simulations"}>
          <ArrowLeft size={14} />
          {lab ? "Back to the lesson" : "Back to workshop labs"}
        </Link>
        <div className="standalone-heading">
          <div>
            <span className="eyebrow">
              The lab / {lab?.topic || moduleName}
            </span>
            <h1>{lab?.title || title}</h1>
            <p>{lab ? LESSON_EDITORIAL[slideNumber - 1]?.idea : subtitle}</p>
          </div>
          <button
            className="text-button"
            onClick={() => setShowContext(!showContext)}
            aria-expanded={showContext}
          >
            About this experiment <ChevronDown size={14} />
          </button>
        </div>
        {showContext && (
          <div className="experiment-context">
            <span>{moduleName}</span>
            <p>{subtitle}</p>
          </div>
        )}
        <section className="standalone-instrument" aria-label={title}>
          <div className="simulation-surface">{children}</div>
        </section>
        <footer className="directory-footer">
          <span>Change an input. Follow the evidence.</span>
          <Link className="text-button" href="/simulations">
            Try another experiment <ArrowUpRight size={14} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
