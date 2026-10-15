import { HelloBlockchainSim } from "@/components/simulations/HelloBlockchainSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function MiniProjectPage() {
  return (
    <SimulationPageLayout
      title="Mini Project: Hello Blockchain Message Store"
      subtitle="Interactive Hyperledger Fabric smart contract workbench with InitLedger, ReadMessage, UpdateMessage, StateDB, and Docker CLI"
      slideNumber={47}
      moduleName="Module 6 • Mini Project"
    >
      <HelloBlockchainSim />
    </SimulationPageLayout>
  );
}
