import { BarChart3, CalendarDays, Sparkles } from "lucide-react";

const routines = [
  { id: "publishing", icon: CalendarDays, tone: "green", title: "Calendar & scheduled flow", description: "Plan a week of thoughtful content without losing the thread between your idea and your audience.", points: ["See the next post at a glance", "Keep a consistent cadence"] },
  { id: "analytics", icon: BarChart3, tone: "blue", title: "Crystal-clear analytics", description: "Understand the signals behind your work without digging through disconnected platform reports.", points: ["Follow reach and engagement", "Spot patterns worth repeating"] },
  { id: "engagement", icon: Sparkles, tone: "violet", title: "An advisor for what is next", description: "Use your niche and performance context to move from uncertainty to a useful next step.", points: ["Get niche-based guidance", "Turn insight into an idea"] },
];

// Presents the three core routines that organize the Poste product story.
export function LifecycleSection() {
  return (
    <section className="lifecycle-section section-shell" aria-labelledby="lifecycle-title">
      <div className="section-heading centered-heading">
        <p className="mono-label">Poste in practice</p>
        <h2 id="lifecycle-title">Simplify your entire social lifecycle.</h2>
        <p>No complicated menus or steep learning curves. Poste groups the work into three peaceful routines.</p>
      </div>
      <div className="lifecycle-grid">
        {routines.map(({ id, icon: Icon, tone, title, description, points }) => (
          <article className={`lifecycle-card lifecycle-${tone}`} id={id} key={id}>
            <div className="lifecycle-card-top"><span className="lifecycle-icon"><Icon size={18} strokeWidth={1.8} /></span><span className="mono-label">{id}</span></div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul>{points.map((point) => <li key={point}><span className="list-dot" />{point}</li>)}</ul>
            <div className="routine-mini-ui"><span /><span /><span /><span /><span /></div>
          </article>
        ))}
      </div>
    </section>
  );
}
