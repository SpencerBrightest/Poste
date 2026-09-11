import { Button } from "@/components/ui/button";

// Provides a temporary route target while the authentication screens are built.
export default function LoginPage() {
  return (
    <main className="auth-placeholder section-shell">
      <p className="mono-label">Authentication</p>
      <h1>Login is the next public page.</h1>
      <p>The landing page is ready. We will build the login experience next.</p>
      <Button href="/">Return home</Button>
    </main>
  );
}
