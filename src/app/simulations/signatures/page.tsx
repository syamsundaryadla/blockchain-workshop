import { getLabSlide } from "@/content/studio";
import { SignatureLab } from "@/components/simulations/SignatureLab";
import { SimulationPageLayout } from "@/components/layout/SimulationPageLayout";
export default function SignaturesPage() {
  return (
    <SimulationPageLayout
      title="Sign it. Change it. Check it."
      subtitle="Real browser cryptography with temporary keys. This demonstrates signatures; it does not enroll a Fabric identity."
      slideNumber={getLabSlide("signatures")}
      moduleName="Chapter 4 · Cryptography & smart contracts"
    >
      <SignatureLab />
    </SimulationPageLayout>
  );
}
