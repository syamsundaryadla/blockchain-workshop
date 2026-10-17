import React from "react";
import { PRESENTER } from "@/content/presenter";
export function AboutMeSlide() {
  return (
    <div className="about-me-slide">
      <header>
        <span className="eyebrow">Your workshop facilitator</span>
        <h1>About me</h1>
      </header>
      <div className="presenter-composition">
        <section className="presenter-identity">
          <h2>{PRESENTER.name}</h2>
          <p className="presenter-role">{PRESENTER.role}</p>
          <p className="presenter-introduction">{PRESENTER.introduction}</p>
        </section>
        <aside className="presenter-focus">
          <span className="eyebrow">What I work on</span>
          {PRESENTER.focus.map((item) => (
            <p key={item}>{item}</p>
          ))}
          <span className="eyebrow presenter-education-label">Education</span>
          <p>{PRESENTER.education}</p>
        </aside>
      </div>
      <footer>
        <a href={PRESENTER.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href={PRESENTER.website} target="_blank" rel="noreferrer">
          risenine.in ↗
        </a>
      </footer>
    </div>
  );
}
