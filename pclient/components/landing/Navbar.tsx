import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ThemeToggle } from "./ThemeToggle";

// Renders the reference-inspired sticky navigation for the public landing page.
export function Navbar() {
  return (
    <header className="site-header reference-header">
      <div className="nav-shell">
        <Link className="brand" href="/" aria-label="Poste home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>poste</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#publishing">Publishing</a>
          <a href="#analytics">Analytics</a>
          <a href="#engagement">AI advisor</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <Link className="nav-login" href="/login">Sign in</Link>
          <Button href="/signup" size="small">
            Start free <ArrowUpRight size={15} strokeWidth={1.8} />
          </Button>
        </div>

        <details className="mobile-nav">
          <summary aria-label="Open navigation menu"><Menu size={18} strokeWidth={1.8} /></summary>
          <div className="mobile-nav-panel">
            <a href="#publishing">Publishing</a>
            <a href="#analytics">Analytics</a>
            <a href="#engagement">AI advisor</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
          </div>
        </details>
      </div>
    </header>
  );
}
