import { getLabSlide } from "@/content/studio";
import Link from "next/link";
import { CreditsLab } from "@/components/simulations/CreditsLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";
export default function MiniProjectPage() {
  return (
    <SimulationPageLayout
      title="Campus Credits rehearsal"
      subtitle="Predict balances and test permissions in a browser simulation. Run the downloaded kit for real Fabric transactions."
      slideNumber={getLabSlide("credits")}
      moduleName="Chapter 7 · Campus Credits practical"
    >
      <div className="project-resource-strip">
        <Link href="/workshop">Open the practical handout →</Link>
        <a href="/workshop/campus-credits-kit.zip" download>
          Download real Fabric project
        </a>
        <a href="http://127.0.0.1:3200" target="_blank" rel="noreferrer">
          Open local app after npm start ↗
        </a>
      </div>
      <CreditsLab />
    </SimulationPageLayout>
  );
}
