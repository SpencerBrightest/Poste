"use client";

// Provides the client-side signup form and its validation states.

import { useState, type FormEvent, type ReactNode } from "react";
import { Eye, EyeOff, KeyRound, Mail, TicketPercent, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  acceptedTerms: boolean;
}

type SignupField = keyof SignupValues;
type SignupErrors = Partial<Record<SignupField, string>>;

const initialValues: SignupValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
  acceptedTerms: false,
};

// Checks the fields that can be validated before the auth API is connected.
function validateSignup(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Use a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Include at least one number.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "Accept the terms to continue.";
  }

  return errors;
}

// Renders a labelled input with the visual language shared by the auth page.
function FormField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  error,
  icon,
  onChange,
  trailingAction,
}: {
  id: SignupField;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  icon: ReactNode;
  onChange: (value: string) => void;
  trailingAction?: ReactNode;
}) {
  return (
    <div className="auth-field">
      <label className="auth-field-label" htmlFor={id}>
        {label}
      </label>
      <div className={`auth-input-wrap${error ? " auth-input-wrap-error" : ""}`}>
        <span className="auth-input-icon" aria-hidden="true">{icon}</span>
        <input
          id={id}
          name={id}
          className="auth-input"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {trailingAction}
      </div>
      {error ? <p className="auth-field-error" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

// Displays the password requirements as the user types.
function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "One number", met: /\d/.test(password) },
  ];

  return (
    <ul className="password-requirements" aria-label="Password requirements">
      {requirements.map((requirement) => (
        <li className={requirement.met ? "is-met" : ""} key={requirement.label}>
          <span aria-hidden="true">{requirement.met ? "✓" : "·"}</span>
          {requirement.label}
        </li>
      ))}
    </ul>
  );
}

// Manages signup input, validation, and the pre-API submission message.
export function SignupForm() {
  const [values, setValues] = useState<SignupValues>(initialValues);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  // Updates one field while clearing its previous validation message.
  function updateField(field: SignupField, value: string | boolean) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setFormMessage("");
  }

  // Validates the form and reports that the backend connection is the next step.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("");
      return;
    }

    setFormMessage("Your details look good. Account creation will be connected next.");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="name"
        label="Your name"
        value={values.name}
        placeholder="e.g. Amélie Ngu"
        autoComplete="name"
        error={errors.name}
        icon={<UserRound size={17} strokeWidth={1.8} />}
        onChange={(value) => updateField("name", value)}
      />

      <FormField
        id="email"
        label="Email address"
        type="email"
        value={values.email}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email}
        icon={<Mail size={17} strokeWidth={1.8} />}
        onChange={(value) => updateField("email", value)}
      />

      <div className="auth-field-group">
        <FormField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          placeholder="Create a secure password"
          autoComplete="new-password"
          error={errors.password}
          icon={<KeyRound size={17} strokeWidth={1.8} />}
          onChange={(value) => updateField("password", value)}
          trailingAction={
            <button
              className="auth-input-action"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
            </button>
          }
        />
        <PasswordRequirements password={values.password} />
      </div>

      <FormField
        id="confirmPassword"
        label="Confirm password"
        type={showConfirmPassword ? "text" : "password"}
        value={values.confirmPassword}
        placeholder="Repeat your password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        icon={<KeyRound size={17} strokeWidth={1.8} />}
        onChange={(value) => updateField("confirmPassword", value)}
        trailingAction={
          <button
            className="auth-input-action"
            type="button"
            aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
            onClick={() => setShowConfirmPassword((visible) => !visible)}
          >
            {showConfirmPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
          </button>
        }
      />

      <div className="auth-referral">
        <button className="auth-referral-toggle" type="button" onClick={() => setShowReferral((visible) => !visible)}>
          <span><TicketPercent size={16} strokeWidth={1.8} /> Have a referral code?</span>
          <span aria-hidden="true">{showReferral ? "−" : "+"}</span>
        </button>
        {showReferral ? (
          <div className="auth-referral-field">
            <label className="auth-field-label" htmlFor="referralCode">Referral code <span>(optional)</span></label>
            <input
              id="referralCode"
              name="referralCode"
              className="auth-input auth-input-plain"
              type="text"
              value={values.referralCode}
              placeholder="Paste your code"
              autoComplete="off"
              onChange={(event) => updateField("referralCode", event.target.value)}
            />
          </div>
        ) : null}
      </div>

      <label className="auth-checkbox-row" htmlFor="acceptedTerms">
        <input
          id="acceptedTerms"
          name="acceptedTerms"
          type="checkbox"
          checked={values.acceptedTerms}
          aria-invalid={Boolean(errors.acceptedTerms)}
          onChange={(event) => updateField("acceptedTerms", event.target.checked)}
        />
        <span>I agree to Poste&apos;s Terms and Privacy Policy.</span>
      </label>
      {errors.acceptedTerms ? <p className="auth-field-error auth-checkbox-error">{errors.acceptedTerms}</p> : null}

      <Button className="auth-submit" type="submit">
        Create my free workspace <span aria-hidden="true">→</span>
      </Button>
      {formMessage ? <p className="auth-form-message" role="status">{formMessage}</p> : null}
    </form>
  );
}
