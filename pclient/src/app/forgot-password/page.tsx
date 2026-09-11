import Link from "next/link";

import { ForgotPasswordForm } from "@/src/components/auth/ForgotPasswordForm";
import { PublicAuthLayout } from "@/src/components/auth/PublicAuthLayout";

// Renders Poste's public password-recovery request page.
export default function ForgotPasswordPage() {
  return (
    <PublicAuthLayout
      headingId="forgot-password-heading"
      visualCaption="A clear path back to the workspace you use to keep showing up."
    >
      <div className="auth-card-head">
        <p className="mono-label">Password recovery</p>
        <h1 id="forgot-password-heading">Forgot password?</h1>
        <p>Enter your email and we&apos;ll help you get back into your Poste workspace.</p>
      </div>
      <ForgotPasswordForm />
      <p className="auth-switch"><Link href="/login">Back to sign in</Link></p>
    </PublicAuthLayout>
  );
}
