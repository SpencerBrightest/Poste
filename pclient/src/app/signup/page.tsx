import { Button } from "@/components/ui/button";

// Provides a temporary route target while the signup experience is built.
export default function SignupPage() {
  return (
    <main className="auth-placeholder section-shell">
      <p className="mono-label">Create your workspace</p>
      <h1>Signup is the next public page.</h1>
      <p>The landing page is ready. We will build the signup experience next.</p>
      <Button href="/">Return home</Button>
    </main>
  );
}
