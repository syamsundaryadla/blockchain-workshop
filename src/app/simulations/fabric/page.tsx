import { FabricExplorerSim } from "@/components/simulations/FabricExplorerSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function FabricSimulationPage() {
  return (
    <SimulationPageLayout
      title="Hyperledger Fabric Architecture & 8-Step Lifecycle"
      subtitle="Interactive Execute-Order-Validate transaction flow across Client, Endorsers, Raft Orderer, and Committer Peers"
      slideNumber={38}
      moduleName="Module 5 • Enterprise Fabric"
    >
      <FabricExplorerSim />
    </SimulationPageLayout>
  );
}
