import { getLabSlide } from "@/content/studio";
import { FabricFlowLab } from "@/components/simulations/FabricFlowLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";
export default function FabricPage() {
  return (
    <SimulationPageLayout
      title="Follow a Fabric transaction"
      subtitle="Reveal each stage. Predict when the confirmed balances change. This is an interactive model, not a live network."
      slideNumber={getLabSlide("fabric-flow")}
      moduleName="Chapter 6 · Hyperledger Fabric"
    >
      <FabricFlowLab />
    </SimulationPageLayout>
  );
}
