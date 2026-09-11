import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

// Renders the conversion banner that closes the public product story.
export function CtaBanner() {
  return (
    <section className="cta-section section-shell" id="pricing" aria-labelledby="cta-title">
      <div className="cta-glow cta-glow-one" aria-hidden="true" /><div className="cta-glow cta-glow-two" aria-hidden="true" />
      <div className="cta-content"><p className="mono-label"><Sparkles size={13} /> Start with a calmer cadence</p><h2 id="cta-title">Ready to build your social presence the calm way?</h2><p>Join Poste with a free plan and give your next idea a clearer path from thought to published post.</p><div className="cta-actions"><Button href="/signup" variant="light">Get started for free <ArrowUpRight size={15} /></Button><Button href="#workflow" variant="outlineLight">Explore the workflow</Button></div><span className="cta-note">No complicated setup. Just a clearer place to begin.</span></div>
    </section>
  );
}
