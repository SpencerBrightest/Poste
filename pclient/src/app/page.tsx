import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { LifecycleSection } from "@/components/landing/LifecycleSection";
import { Navbar } from "@/components/landing/Navbar";
import { ProofSection } from "@/components/landing/ProofSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { WhySwitchSection } from "@/components/landing/WhySwitchSection";
import LogoCloud from "@/components/landing/LogoCloud";

// Renders the public landing page from the reusable Poste marketing sections.
export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <LifecycleSection />
        <BentoFeatures />
        <LogoCloud />
        <TestimonialsSection />
        <ProofSection />
        <WhySwitchSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}


