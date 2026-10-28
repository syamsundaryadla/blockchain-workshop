import { getLabSlide } from "@/content/studio";
import { HashFingerprintLab } from "@/components/simulations/HashFingerprintLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";

export default function HasherSimulationPage() {
  return (
    <SimulationPageLayout
      title="Change a message. Compare its fingerprint."
      subtitle="Real SHA-256 in your browser. Predict the effect of changing one character."
      slideNumber={getLabSlide("hasher")}
      moduleName="Chapter 2 · Architecture & working"
    >
      <HashFingerprintLab />
    </SimulationPageLayout>
  );
}
