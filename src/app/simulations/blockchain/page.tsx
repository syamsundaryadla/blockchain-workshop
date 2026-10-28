import { getLabSlide } from "@/content/studio";
import { LinkedBlocksLab } from "@/components/simulations/LinkedBlocksLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function BlockchainSimulationPage() {
  return (
    <SimulationPageLayout
      title="Anatomy of a Block & Tamper Detection"
      subtitle="A simplified hash-chain experiment. Edit a record and inspect the fingerprint and next link."
      slideNumber={getLabSlide("blockchain")}
      moduleName="Chapter 2 · Architecture & working"
    >
      <LinkedBlocksLab />
    </SimulationPageLayout>
  );
}
