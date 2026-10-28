import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Blocks } from "lucide-react";
import { STUDIO_LABS } from "@/content/studio";
import { SubjectVisual } from "@/components/presentation/StudioVisuals";
import { FabricWorkshopDiagram } from "@/components/presentation/FabricWorkshopDiagrams";
import { FoundationDiagram } from "@/components/presentation/FoundationDiagrams";

export default function SimulationsHubPage() {
  return (
    <div className="labs-directory">
      <header className="directory-header">
        <Link href="/" className="wordmark">
          <Blocks size={23} strokeWidth={1.5} />
          blockchain<span>lab</span>
          <span className="wordmark-period">.</span>
        </Link>
        <Link className="text-button" href="/">
          <ArrowLeft size={14} /> Back to the workshop
        </Link>
      </header>
      <main className="directory-main">
        <div className="directory-intro">
          <div>
            <span className="eyebrow">The experiment collection</span>
            <h1>Blockchain Interactive Simulations</h1>
          </div>
          <p>
            Seven focused experiments.
            <br />
            Change something. See what follows.
          </p>
        </div>
        <div className="directory-section-label">
          <span>Choose an experiment</span>
          <span>01 — {String(STUDIO_LABS.length).padStart(2, "0")}</span>
        </div>
        <div className="lab-collection">
          {STUDIO_LABS.map((lab, i) => (
            <Link href={lab.route} key={lab.type} className="lab-card">
              <div className="lab-card-art">
                {lab.type === "broadcast" || lab.type === "mining" ? (
                  <FoundationDiagram
                    scene={lab.type === "broadcast" ? "p2p" : "pow"}
                  />
                ) : lab.type === "hasher" || lab.type === "blockchain" ? (
                  <SubjectVisual kind={lab.visual} />
                ) : (
                  <FabricWorkshopDiagram
                    scene={
                      lab.type === "credits"
                        ? "balances"
                        : lab.type === "signatures"
                          ? "identity"
                          : "fabric-network"
                    }
                  />
                )}
              </div>
              <div className="lab-card-copy">
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")} / {lab.topic}
                </span>
                <h2>{lab.title}</h2>
                <p>{lab.description}</p>
                <span className="lab-card-action">
                  Open experiment <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <footer className="directory-footer">
          <span>Built to be understood.</span>
          <Link className="text-button" href="/">
            Take the guided workshop <ArrowUpRight size={14} />
          </Link>
        </footer>
      </main>
    </div>
  );
}
