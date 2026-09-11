import { ArrowRight, CheckCircle2, Mail, PlayCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DashboardPreview } from "./DashboardPreview";

// Renders the reference-inspired editorial hero and product collage.
export function HeroSection() {
  return (
    <section className="hero reference-hero section-shell">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={14} strokeWidth={1.8} /> Your calmer social workspace</p>
        <h1>Grow your social presence <span>without the scramble.</span></h1>
        <p className="hero-description">
          Create thoughtful content, build a publishing rhythm, and learn from your performance—all from one clear workspace.
        </p>
        <div className="hero-email-card">
          <div className="hero-email-copy"><Mail size={18} strokeWidth={1.8} /><span>Ready to build a calmer content rhythm?</span></div>
          <Button href="/signup">Start free <ArrowRight size={16} strokeWidth={1.8} /></Button>
        </div>
        <div className="hero-proof">
          <span><CheckCircle2 size={14} strokeWidth={2} /> Free plan available</span>
          <a href="#workflow"><PlayCircle size={14} strokeWidth={1.8} /> See how it works</a>
        </div>
      </div>
      <DashboardPreview />
    </section>
  );
}
