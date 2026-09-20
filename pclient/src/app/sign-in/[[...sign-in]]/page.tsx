import { SignIn } from "@clerk/nextjs";

import { ClerkAuthLayout } from "@/components/auth/ClerkAuthLayout";

// Renders Clerk's sign-in flow inside Poste's compact authentication shell.
export default function SignInPage() {
  return (
    <ClerkAuthLayout mode="sign-in">
      <SignIn fallbackRedirectUrl="/editor" />
    </ClerkAuthLayout>
  );
}
