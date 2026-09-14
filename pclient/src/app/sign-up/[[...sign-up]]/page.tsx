import { SignUp } from "@clerk/nextjs";

import { ClerkAuthLayout } from "@/src/components/auth/ClerkAuthLayout";

// Renders Clerk's sign-up flow inside Poste's compact authentication shell.
export default function SignUpPage() {
  return (
    <ClerkAuthLayout mode="sign-up">
      <SignUp fallbackRedirectUrl="/editor" />
    </ClerkAuthLayout>
  );
}
