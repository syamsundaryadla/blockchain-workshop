import { TransactionSim } from "@/components/simulations/TransactionSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function TransactionsSimulationPage() {
  return (
    <SimulationPageLayout
      title="Public Blockchain Transaction Lifecycle"
      subtitle="Wallet ECDSA signing, mempool propagation, gossip verification, and block inclusion"
      slideNumber={0}
      moduleName="Supplementary model"
    >
      <TransactionSim />
    </SimulationPageLayout>
  );
}
