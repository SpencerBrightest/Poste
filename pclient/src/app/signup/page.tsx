import Link from "next/link";
import { SignupForm } from "@/src/components/auth/SignupForm";
import { PublicAuthLayout } from "@/src/components/auth/PublicAuthLayout";

// Renders Poste's public signup page using the shared reference-inspired auth frame.
export default function SignupPage() {
  return (
    <PublicAuthLayout
      cardClassName="auth-signup-card"
      headingId="signup-heading"
      visualCaption="Plan your ideas, keep your rhythm, and grow with more intention."
    >
      <div className="auth-card-head">
        <p className="mono-label">Create your workspace</p>
        <h1 id="signup-heading">Join Poste</h1>
        <p>Start free and bring your social workflow into focus.</p>
      </div>
      <SignupForm />
      <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
    </PublicAuthLayout>
  );
}
