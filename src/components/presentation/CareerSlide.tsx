import React from "react";
import {
  AppWindow,
  BookOpenCheck,
  Server,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const roles = [
  {
    title: "Blockchain Application Developer",
    skills: "JavaScript / Node.js · APIs · Fabric basics",
    icon: AppWindow,
    featured: true,
  },
  {
    title: "Smart Contract Developer",
    skills: "Business rules · Chaincode or Solidity · Testing",
    icon: BookOpenCheck,
  },
  {
    title: "Blockchain Infrastructure Engineer",
    skills: "Linux · Docker · Networking · Cloud",
    icon: Server,
  },
  {
    title: "Blockchain Security Specialist",
    skills: "Access control · Cryptography basics · Security testing",
    icon: ShieldCheck,
  },
];

export function CareerSlide() {
  return (
    <section
      className="career-content"
      aria-label="Blockchain roles and skills"
    >
      <div className="career-grid">
        {roles.map(({ title, skills, icon: Icon, featured }) => (
          <article
            className={featured ? "career-card career-featured" : "career-card"}
            key={title}
          >
            <div className="career-card-top">
              <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
              {featured && <span>Today’s project connects here</span>}
            </div>
            <h2>{title}</h2>
            <p>{skills}</p>
          </article>
        ))}
      </div>
      <div className="career-path" aria-label="Beginner learning path">
        {[
          "Programming basics",
          "Build projects",
          "Learn one platform",
          "Explore internships",
        ].map((step, i) => (
          <React.Fragment key={step}>
            {i > 0 && <ArrowRight size={15} aria-hidden="true" />}
            <span>{step}</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
