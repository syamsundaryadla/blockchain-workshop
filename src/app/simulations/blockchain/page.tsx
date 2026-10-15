import { BlockchainSim } from "@/components/simulations/BlockchainSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function BlockchainSimulationPage() {
  return (
    <SimulationPageLayout
      title="Anatomy of a Block & Tamper Detection"
      subtitle="Interactive blockchain builder, hash chain linking, and invalid state isolation"
      slideNumber={11}
      moduleName="Module 2 • Architecture"
    >
      <BlockchainSim />
    </SimulationPageLayout>
  );
}
