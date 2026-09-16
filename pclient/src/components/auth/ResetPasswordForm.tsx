"use client";

// Provides the new-password form used after a password recovery link is opened.

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";

// Checks the new password and its confirmation before submission.
function validateNewPassword(password: string, confirmPassword: string) {
  const errors: { password?: string; confirmPassword?: string } = {};

  if (password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/\d/.test(password)) {
    errors.password = "Include at least one number.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

// Renders the live password requirements for the reset form.
function ResetPasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "One number", met: /\d/.test(password) },
  ];

  return (
    <ul className="password-requirements" aria-label="Password requirements">
      {requirements.map((requirement) => (
        <li className={requirement.met ? "is-met" : ""} key={requirement.label}>
          <span aria-hidden="true">{requirement.met ? "+" : "-"}</span>
          {requirement.label}
        </li>
      ))}
    </ul>
  );
}

// Manages the new password, visibility controls, validation, and pre-API status.
export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [message, setMessage] = useState("");

  // Validates the new password and reports the next backend integration step.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateNewPassword(password, confirmPassword);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    setMessage("Your new password is valid. Reset completion will be connected next.");
  }

  // Updates the new password and clears its previous validation state.
  function updatePassword(value: string) {
    setPassword(value);
    setErrors((currentErrors) => ({ ...currentErrors, password: undefined }));
    setMessage("");
  }

  // Updates the confirmation and clears its previous validation state.
  function updateConfirmPassword(value: string) {
    setConfirmPassword(value);
    setErrors((currentErrors) => ({ ...currentErrors, confirmPassword: undefined }));
    setMessage("");
  }

  return (
    <form className="auth-form auth-recovery-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-reference-field">
        <label className="auth-visually-hidden" htmlFor="new-password">New password</label>
        <LockKeyhole className="auth-reference-field-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          id="new-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="New password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "new-password-error" : undefined}
          onChange={(event) => updatePassword(event.target.value)}
        />
        <button className="auth-reference-input-action" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
          {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
        </button>
        {errors.password ? <p className="auth-field-error" id="new-password-error">{errors.password}</p> : null}
      </div>
      <ResetPasswordRequirements password={password} />

      <div className="auth-reference-field">
        <label className="auth-visually-hidden" htmlFor="confirm-new-password">Confirm new password</label>
        <LockKeyhole className="auth-reference-field-icon" size={16} strokeWidth={1.8} aria-hidden="true" />
        <input
          id="confirm-new-password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          placeholder="Confirm new password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={errors.confirmPassword ? "confirm-new-password-error" : undefined}
          onChange={(event) => updateConfirmPassword(event.target.value)}
        />
        <button className="auth-reference-input-action" type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirmPassword((visible) => !visible)}>
          {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
        </button>
        {errors.confirmPassword ? <p className="auth-field-error" id="confirm-new-password-error">{errors.confirmPassword}</p> : null}
      </div>

      <Button className="auth-submit" type="submit">Save new password</Button>
      {message ? <p className="auth-form-message" role="status">{message}</p> : null}
    </form>
  );
}
