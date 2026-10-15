import { NetworkTopologySim } from "@/components/simulations/NetworkTopologySim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function NetworksSimulationPage() {
  return (
    <SimulationPageLayout
      title="Network Topology & Resilience Simulator"
      subtitle="Single point of failure vs. decentralized mesh packet propagation and fault tolerance"
      slideNumber={8}
      moduleName="Module 1 • Fundamentals"
    >
      <NetworkTopologySim />
    </SimulationPageLayout>
  );
}
