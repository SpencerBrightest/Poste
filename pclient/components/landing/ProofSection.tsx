import { BriefcaseBusiness, PenLine, Store } from "lucide-react";

const audiences = [
  { icon: PenLine, label: "Creators", title: "Keep your ideas moving", description: "A calm place to turn the thoughts in your notes app into a publishing rhythm you can keep." },
  { icon: BriefcaseBusiness, label: "Freelancers", title: "Make client work easier to see", description: "Plan multiple content streams without losing your own voice, calendar, or performance context." },
  { icon: Store, label: "Small businesses", title: "Build trust one post at a time", description: "Show up with more intention across the channels where your customers already spend time." },
];

// Replaces unverifiable testimonials with clear, honest audience outcomes for the first launch.
export function ProofSection() {
  return (
    <section className="proof-section section-shell" aria-labelledby="proof-title">
      <div className="section-heading centered-heading"><p className="mono-label">Made for the work you actually do</p><h2 id="proof-title">One workspace. Different kinds of momentum.</h2><p>Poste is built for people who need consistency to feel practical, not performative.</p></div>
      <div className="proof-grid">
        {audiences.map(({ icon: Icon, label, title, description }) => <article className="proof-card" key={label}><div className="proof-card-top"><span className="proof-icon"><Icon size={17} strokeWidth={1.7} /></span><span className="mono-label">{label}</span></div><h3>{title}</h3><p>{description}</p><div className="proof-line" /></article>)}
      </div>
    </section>
  );
}
