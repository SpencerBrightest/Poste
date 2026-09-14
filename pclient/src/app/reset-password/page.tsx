import { redirect } from "next/navigation";

// Clerk handles recovery links and the new-password step inside its sign-in flow.
export default function ResetPasswordPage() {
  redirect("/sign-in");
}
