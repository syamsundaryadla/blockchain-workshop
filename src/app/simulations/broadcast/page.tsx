import { BroadcastLab } from "@/components/simulations/BroadcastLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";
import { getLabSlide } from "@/content/studio";
export default function BroadcastPage() {
  return (
    <SimulationPageLayout
      title="Pass a request across peers"
      subtitle="A manual model of message propagation and local rule checks. No live P2P network or consensus."
      slideNumber={getLabSlide("broadcast")}
      moduleName="Chapter 3 · Networking & consensus"
    >
      <BroadcastLab />
    </SimulationPageLayout>
  );
}
