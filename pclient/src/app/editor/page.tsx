import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// Provides the authenticated landing surface used after sign-in or sign-up.
export default function EditorPage() {
  return (
    <main className="editor-page">
      <header className="editor-navbar">
        <Link className="editor-brand" href="/editor" aria-label="Poste editor">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>poste</span>
        </Link>
        <nav className="editor-navbar-actions" aria-label="Workspace navigation">
          <Link className="editor-nav-link" href="/editor">Editor</Link>
          <UserButton />
        </nav>
      </header>
      <section className="editor-empty-state" aria-labelledby="editor-heading">
        <p className="mono-label">Poste workspace</p>
        <h1 id="editor-heading">Your editor is ready.</h1>
        <p>Plan, publish, and learn from your social content in one calm workspace.</p>
      </section>
    </main>
  );
}
