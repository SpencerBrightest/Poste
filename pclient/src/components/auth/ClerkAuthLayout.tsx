// Provides the minimal two-panel shell used by Clerk's sign-in and sign-up pages.

import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/landing/ThemeToggle";

interface ClerkAuthLayoutProps {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
}

const authCopy = {
  "sign-in": {
    eyebrow: "Poste workspace",
    title: "Keep your publishing rhythm in view.",
    description: "Return to one calm place for the ideas, schedules, and signals behind your social presence.",
  },
  "sign-up": {
    eyebrow: "Start with Poste",
    title: "Make space for work that moves you forward.",
    description: "Create a focused workspace for planning, publishing, and learning from every post.",
  },
} as const;

const authFeatures = [
  "Plan your next publishing rhythm",
  "Create with a clear content direction",
  "Learn from the signals that matter",
];

// Renders the compact brand panel and centered Clerk form area.
export function ClerkAuthLayout({ children, mode }: ClerkAuthLayoutProps) {
  const copy = authCopy[mode];

  return (
    <main className="clerk-auth-shell">
      <aside className="clerk-auth-aside" aria-label="Poste introduction">
        <Link className="clerk-auth-brand" href="/sign-in" aria-label="Poste sign in">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>poste</span>
        </Link>
        <div className="clerk-auth-aside-copy">
          <p className="mono-label">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <ul className="clerk-auth-features">
            {authFeatures.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
      </aside>
      <section className="clerk-auth-main" aria-label={mode === "sign-in" ? "Sign in" : "Sign up"}>
        <div className="clerk-auth-toolbar">
          <Link className="clerk-auth-home-link" href="/sign-in">Back to sign in</Link>
          <ThemeToggle />
        </div>
        <div className="clerk-auth-form-wrap">{children}</div>
      </section>
    </main>
  );
}
