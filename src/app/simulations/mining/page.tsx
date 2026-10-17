import { MiningSim } from "@/components/simulations/MiningSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function MiningSimulationPage() {
  return (
    <SimulationPageLayout
      title="Consensus Engine Comparison Simulator"
      subtitle="Side-by-side interactive execution of Proof of Work (PoW), Proof of Stake (PoS), and Enterprise Raft Quorum"
      slideNumber={21}
      moduleName="Module 2 • Consensus"
    >
      <MiningSim />
    </SimulationPageLayout>
  );
}
