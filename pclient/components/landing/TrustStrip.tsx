import { BarChart3, CalendarDays, MessageCircle, Sparkles } from "lucide-react";

// Gives visitors a compact overview of the connected Poste workflow.
export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Poste workflow capabilities">
      <div className="section-shell trust-inner">
        <p className="trust-heading">One calm workspace for the work behind every post.</p>
        <div className="trust-items">
          <span><Sparkles size={15} /> Create</span>
          <span><CalendarDays size={15} /> Schedule</span>
          <span><BarChart3 size={15} /> Understand</span>
          <span><MessageCircle size={15} /> Grow</span>
        </div>
      </div>
    </section>
  );
}
