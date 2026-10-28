import Link from "next/link";
import { FabricFlowLab } from "@/components/simulations/FabricFlowLab";
import { CreditsLab } from "@/components/simulations/CreditsLab";
import { STUDENT_BUILD_SLIDE } from "@/content/beginner-workshop";
export default function WalkthroughPage() {
  return (
    <main className="workshop-kit">
      <header className="kit-navigation">
        <Link href="/workshop" className="text-button">
          ← Student kit
        </Link>
        <a
          href="/workshop/campus-credits-kit.zip"
          download
          className="text-button"
        >
          Download real Fabric project ↓
        </a>
      </header>
      <section className="kit-intro">
        <span className="eyebrow">Guided fallback / labeled simulations</span>
        <h1>Follow the transfer.</h1>
        <p>
          These interactive models explain the transaction journey and spending
          rules. They are not recordings or evidence of a live Fabric run. Use
          the downloaded project for actual committed transactions.
        </p>
      </section>
      <section>
        <h2>1. When do the saved balances change?</h2>
        <FabricFlowLab />
      </section>
      <section>
        <h2>2. Who may request the transfer?</h2>
        <CreditsLab />
      </section>
      <Link href={`/?slide=${STUDENT_BUILD_SLIDE}`} className="text-button">
        Return to your build hour →
      </Link>
    </main>
  );
}
