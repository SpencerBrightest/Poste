import { ArrowUpRight, CalendarClock, ChartNoAxesCombined, Layers3, Sparkles } from "lucide-react";

// Renders the reference-inspired bento section for deeper product capabilities.
export function BentoFeatures() {
  return (
    <section className="bento-section reference-band" aria-labelledby="bento-title">
      <div className="section-shell">
        <div className="section-heading split-heading">
          <div><p className="mono-label">Designed for human calm, built for steady growth</p><h2 id="bento-title">A clearer system for the work behind the post.</h2></div>
          <p>Every part of Poste is designed to cut context switching, keep your creative energy visible, and make progress easier to repeat.</p>
        </div>
        <div className="bento-grid">
          <article className="bento-card bento-wide">
            <div className="bento-card-copy"><span className="bento-icon bento-blue"><Sparkles size={17} /></span><p className="mono-label">AI content starting points</p><h3>Turn an idea into a post-ready direction.</h3><p>Bring a raw thought, a niche, or a recent performance signal. Poste helps you find a useful angle and a clearer next step.</p></div>
            <div className="idea-ui"><div className="idea-ui-top"><span>Content direction</span><Sparkles size={13} /></div><strong>Three ways to make your next post more useful</strong><div className="idea-tags"><span>Educate</span><span>Connect</span><span>Convert</span></div><div className="idea-line" /></div>
          </article>
          <article className="bento-card bento-wide">
            <div className="bento-card-copy"><span className="bento-icon bento-green"><Layers3 size={17} /></span><p className="mono-label">Multi-platform publishing</p><h3>Manage your channels simultaneously.</h3><p>Keep connected accounts and publishing details together, with a single queue for what is ready to go next.</p></div>
            <div className="channel-ui"><div><span className="channel-avatar channel-pink">◎</span><strong>@amara.studio</strong><CheckMark /></div><div><span className="channel-avatar channel-blue">f</span><strong>Amara Studio</strong><CheckMark /></div><div><span className="channel-avatar channel-cyan">in</span><strong>Amara Design</strong><CheckMark /></div></div>
          </article>
          <article className="bento-card bento-small">
            <span className="bento-icon bento-violet"><ChartNoAxesCombined size={17} /></span><p className="mono-label">Meaningful analytics</p><h3>See the signal, not just the number.</h3><div className="mini-metric"><strong>6.42%</strong><span>engagement rate</span><i /></div>
          </article>
          <article className="bento-card bento-small">
            <span className="bento-icon bento-orange"><CalendarClock size={17} /></span><p className="mono-label">Smart timing</p><h3>Choose your next best moment.</h3><div className="time-row"><span>Today</span><strong>6:30 PM</strong><ArrowUpRight size={14} /></div><div className="time-row"><span>Tomorrow</span><strong>9:00 AM</strong><ArrowUpRight size={14} /></div></article>
        </div>
      </div>
    </section>
  );
}

// Renders the compact confirmation mark used in connected-channel previews.
function CheckMark() {
  return <span className="channel-check">✓</span>;
}
