import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { LifecycleSection } from "@/components/landing/LifecycleSection";
import { Navbar } from "@/components/landing/Navbar";
import { ProofSection } from "@/components/landing/ProofSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { WhySwitchSection } from "@/components/landing/WhySwitchSection";

// Renders Poste's public marketing page for visitors who are not authenticated.
export default function LandingPage() {
  return (
    <div className="landing-page" id="top">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <LifecycleSection />
        <BentoFeatures />
        <ProofSection />
        <WhySwitchSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
