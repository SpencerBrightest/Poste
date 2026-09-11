import Image from "next/image";
import { CalendarClock, Check, Play, Sparkles, TrendingUp } from "lucide-react";

// Renders a static product-and-creator collage inspired by the supplied reference image.
export function DashboardPreview() {
  return (
    <div className="hero-collage" aria-label="Poste workspace preview">
      <div className="collage-outline collage-outline-one" aria-hidden="true" />
      <div className="collage-outline collage-outline-two" aria-hidden="true" />
      <span className="accent-square accent-cyan accent-top" aria-hidden="true" />
      <span className="accent-square accent-coral accent-top-small" aria-hidden="true" />
      <span className="accent-square accent-navy accent-top-dark" aria-hidden="true" />

      <div className="collage-photo">
        <Image src="/workspace_preview.jpg" alt="A bright creator workspace with a laptop and notebook" fill priority sizes="(max-width: 900px) 75vw, 390px" />
      </div>

      <div className="collage-video-card">
        <div className="video-thumb"><Play size={15} fill="currentColor" strokeWidth={0} /></div>
        <p className="mono-label">AI idea starter</p>
        <strong>Turn your next thought into a post.</strong>
        <div className="mini-lines"><i /><i /><i /></div>
        <span className="video-chip"><Sparkles size={11} /> Ready to shape</span>
      </div>

      <div className="collage-growth-card">
        <div className="growth-avatar">P</div>
        <div><strong>Reach this month</strong><small>From your latest posts</small></div>
        <span className="growth-badge"><TrendingUp size={12} /> 18.4%</span>
      </div>

      <div className="collage-platforms" aria-label="Connected social platforms">
        <span>in</span><span>f</span><span>◎</span><span>✦</span>
      </div>
      <div className="collage-doodle" aria-hidden="true">↗</div>
      <span className="accent-square accent-cyan accent-bottom" aria-hidden="true" />
      <span className="accent-square accent-coral accent-bottom-large" aria-hidden="true" />
      <div className="collage-dots" aria-hidden="true"><i /><i /><i /><b /></div>

      <div className="collage-schedule-card">
        <div className="schedule-icon"><CalendarClock size={13} /></div>
        <div><strong>Next up</strong><small>Today · 6:30 PM</small></div>
        <Check size={15} className="schedule-check" />
      </div>
    </div>
  );
}
