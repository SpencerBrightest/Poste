"use client";

// Provides the email form used to begin Poste's password recovery flow.

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

// Checks the recovery email before a reset request can be submitted.
function validateRecoveryEmail(email: string) {
  if (!email.trim()) {
    return "Enter your email address.";
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Use a valid email address.";
  }

  return "";
}

// Manages the recovery email and the safe reset-request confirmation state.
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Validates the email and reports the next backend integration step.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validateRecoveryEmail(email);
    setError(nextError);

    if (nextError) {
      setMessage("");
      return;
    }

    setMessage("If an account uses this email, reset instructions will be sent when recovery is connected.");
  }

  // Clears the email error when the user edits the field.
  function updateEmail(value: string) {
    setEmail(value);
    setError("");
    setMessage("");
  }

  return (
    <form className="auth-form auth-recovery-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-reference-field">
        <label className="auth-visually-hidden" htmlFor="recovery-email">Email address</label>
        <Mail className="auth-reference-field-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          id="recovery-email"
          name="email"
          type="email"
          value={email}
          placeholder="Email address"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "recovery-email-error" : undefined}
          onChange={(event) => updateEmail(event.target.value)}
        />
        {error ? <p className="auth-field-error" id="recovery-email-error">{error}</p> : null}
      </div>
      <Button className="auth-submit" type="submit">Send reset link</Button>
      {message ? <p className="auth-form-message" role="status">{message}</p> : null}
    </form>
  );
}
