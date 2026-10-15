import { TransactionSim } from "@/components/simulations/TransactionSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function TransactionsSimulationPage() {
  return (
    <SimulationPageLayout
      title="Public Blockchain Transaction Lifecycle"
      subtitle="Wallet ECDSA signing, mempool propagation, gossip verification, and block inclusion"
      slideNumber={17}
      moduleName="Module 2 • Architecture"
    >
      <TransactionSim />
    </SimulationPageLayout>
  );
}
