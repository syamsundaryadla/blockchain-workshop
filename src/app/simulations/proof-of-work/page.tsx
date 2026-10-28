import { ProofOfWorkLab } from "@/components/simulations/ProofOfWorkLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";
import { getLabSlide } from "@/content/studio";
export default function ProofOfWorkPage() {
  return (
    <SimulationPageLayout
      title="Find a proof-of-work nonce"
      subtitle="A toy puzzle using real browser SHA-256. It does not mine currency, connect to Bitcoin or run Fabric consensus."
      slideNumber={getLabSlide("mining")}
      moduleName="Chapter 3 · Networking & consensus"
    >
      <ProofOfWorkLab />
    </SimulationPageLayout>
  );
}
