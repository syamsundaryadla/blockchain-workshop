import { DockerArchitectureSim } from "@/components/simulations/DockerArchitectureSim";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function DockerSimulationPage() {
  return (
    <SimulationPageLayout
      title="Docker Architecture & Container Isolation"
      subtitle="Interactive host virtualization, bridge network, isolated peer/orderer containers, and live terminal"
      slideNumber={32}
      moduleName="Module 4 • Docker"
    >
      <DockerArchitectureSim />
    </SimulationPageLayout>
  );
}
