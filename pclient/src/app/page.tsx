import Link from "next/link";

// Renders the public landing page
export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span>Poste</span>
        </div>
        <div className="landing-nav-links">
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up" className="landing-cta">Get Started</Link>
        </div>
      </nav>
      <main className="landing-main">
        <section className="landing-hero">
          <h1>AI-Powered Social Media Management</h1>
          <p>Create, schedule, and analyze your social media content with the power of AI</p>
          <div className="landing-hero-actions">
            <Link href="/sign-up" className="landing-button primary">Start Free</Link>
            <Link href="/sign-in" className="landing-button secondary">Sign In</Link>
          </div>
        </section>
        <section className="landing-features">
          <h2>Features</h2>
          <div className="landing-feature-grid">
            <div className="landing-feature-card">
              <h3>AI Content Generation</h3>
              <p>Generate engaging content with Google Gemini AI</p>
            </div>
            <div className="landing-feature-card">
              <h3>Multi-Platform Support</h3>
              <p>Connect and publish to Twitter/X and more</p>
            </div>
            <div className="landing-feature-card">
              <h3>Scheduling</h3>
              <p>Schedule posts for automatic publishing</p>
            </div>
            <div className="landing-feature-card">
              <h3>Analytics</h3>
              <p>Track performance with AI-powered insights</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2026 Poste. All rights reserved.</p>
      </footer>
    </div>
  );
}


