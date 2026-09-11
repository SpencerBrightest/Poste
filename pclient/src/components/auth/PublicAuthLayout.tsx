// Provides the shared split-screen shell for Poste's public authentication pages.

import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/landing/ThemeToggle";

import { AuthNetworkIllustration } from "./AuthNetworkIllustration";

interface PublicAuthLayoutProps {
  children: ReactNode;
  cardClassName?: string;
  headingId: string;
  visualCaption: string;
}

// Renders the branded visual panel, theme controls, and centered auth card.
export function PublicAuthLayout({ children, cardClassName = "", headingId, visualCaption }: PublicAuthLayoutProps) {
  return (
    <main className="auth-reference-page">
      <section className="auth-visual-panel" aria-label="Poste social workspace">
        <Link className="auth-reference-brand" href="/" aria-label="Poste home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>poste</span>
        </Link>
        <AuthNetworkIllustration />
        <p className="auth-visual-caption">{visualCaption}</p>
      </section>

      <section className="auth-form-canvas">
        <div className="auth-canvas-toolbar">
          <Link className="auth-canvas-home" href="/">Back to home</Link>
          <ThemeToggle />
        </div>
        <div className={`auth-card ${cardClassName}`.trim()} aria-labelledby={headingId}>
          {children}
        </div>
      </section>
    </main>
  );
}
