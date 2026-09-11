import Link from "next/link";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { PublicAuthLayout } from "@/src/components/auth/PublicAuthLayout";

// Renders Poste's public login page using the shared reference-inspired auth frame.
export default function LoginPage() {
  return (
    <PublicAuthLayout
      headingId="login-heading"
      visualCaption="Create, schedule, and learn from every post in one calm workspace."
    >
      <div className="auth-card-head">
        <p className="mono-label">Poste workspace</p>
        <h1 id="login-heading">Sign in</h1>
        <p>Welcome back. Let&apos;s keep your content moving.</p>
      </div>
      <LoginForm />
      <p className="auth-switch">New to Poste? <Link href="/signup">Create an account</Link></p>
    </PublicAuthLayout>
  );
}
