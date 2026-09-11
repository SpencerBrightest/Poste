"use client";

// Provides the client-side login form and its pre-API interaction states.

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

// Validates the login fields before the authentication API is connected.
function validateLogin(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Use a valid email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

// Manages login input, password visibility, recovery messaging, and validation.
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formMessage, setFormMessage] = useState("");

  // Validates the form and reports that the backend connection is the next step.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("");
      return;
    }

    setFormMessage("Your details look good. Sign in will be connected next.");
  }

  // Clears a field's error after the user starts correcting it.
  function updateEmail(value: string) {
    setEmail(value);
    setErrors((currentErrors) => ({ ...currentErrors, email: undefined }));
    setFormMessage("");
  }

  // Clears the password error after the user starts correcting it.
  function updatePassword(value: string) {
    setPassword(value);
    setErrors((currentErrors) => ({ ...currentErrors, password: undefined }));
    setFormMessage("");
  }

  return (
    <form className="auth-form auth-login-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-reference-field">
        <label className="auth-visually-hidden" htmlFor="login-email">Email address</label>
        <Mail className="auth-reference-field-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          id="login-email"
          name="email"
          type="email"
          value={email}
          placeholder="Email address"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          onChange={(event) => updateEmail(event.target.value)}
        />
        {errors.email ? <p className="auth-field-error" id="login-email-error">{errors.email}</p> : null}
      </div>

      <div className="auth-reference-field">
        <label className="auth-visually-hidden" htmlFor="login-password">Password</label>
        <LockKeyhole className="auth-reference-field-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          onChange={(event) => updatePassword(event.target.value)}
        />
        <button
          className="auth-reference-input-action"
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
        </button>
        {errors.password ? <p className="auth-field-error" id="login-password-error">{errors.password}</p> : null}
      </div>

      <Link className="auth-forgot-link" href="/forgot-password">Forgot password?</Link>
      <Button className="auth-submit" type="submit">Sign in</Button>
      {formMessage ? <p className="auth-form-message" role="status">{formMessage}</p> : null}
    </form>
  );
}
