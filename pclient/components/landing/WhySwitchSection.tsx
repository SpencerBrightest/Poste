import { Focus, Gauge, ShieldCheck } from "lucide-react";

const reasons = [
  { icon: Focus, title: "Transparent, not overwhelming", description: "See what is next, what is working, and what needs attention without a crowded interface." },
  { icon: Gauge, title: "Built around momentum", description: "The product helps you make a useful next decision instead of asking you to manage more tools." },
  { icon: ShieldCheck, title: "Practical by design", description: "Start with the free plan, grow into deeper workflows, and keep your content history in one place." },
];

// Explains the product principles that distinguish Poste from a crowded social tool stack.
export function WhySwitchSection() {
  return (
    <section className="why-section section-shell" id="resources" aria-labelledby="why-title">
      <div className="why-panel"><div className="section-heading centered-heading"><p className="mono-label">Why Poste</p><h2 id="why-title">Social work should feel like progress.</h2><p>Less tab-hopping. More clarity. A workspace that helps you keep going.</p></div><div className="why-grid">{reasons.map(({ icon: Icon, title, description }) => <article className="why-card" key={title}><span className="why-icon"><Icon size={16} /></span><h3>{title}</h3><p>{description}</p></article>)}</div></div>
    </section>
  );
}
