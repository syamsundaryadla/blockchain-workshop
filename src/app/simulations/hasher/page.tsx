import { Sha256HasherSim } from "@/components/simulations/Sha256HasherSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function HasherSimulationPage() {
  return (
    <SimulationPageLayout
      title="SHA-256 Hasher & Avalanche Effect"
      subtitle="Interactive cryptographic digest calculation and bit divergence visualizer"
      slideNumber={5}
      moduleName="Module 1 • Fundamentals"
    >
      <Sha256HasherSim />
    </SimulationPageLayout>
  );
}
