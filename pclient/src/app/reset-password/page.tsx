import Link from "next/link";

import { PublicAuthLayout } from "@/src/components/auth/PublicAuthLayout";
import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";

// Renders Poste's public new-password page after a recovery link is opened.
export default function ResetPasswordPage() {
  return (
    <PublicAuthLayout
      headingId="reset-password-heading"
      visualCaption="Set a fresh password and return to a calmer way to manage your content."
    >
      <div className="auth-card-head">
        <p className="mono-label">Password recovery</p>
        <h1 id="reset-password-heading">Create a new password</h1>
        <p>Choose a secure password to protect your Poste workspace.</p>
      </div>
      <ResetPasswordForm />
      <p className="auth-switch">Remembered your password? <Link href="/login">Sign in</Link></p>
    </PublicAuthLayout>
  );
}
