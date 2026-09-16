import { redirect } from "next/navigation";

// Clerk renders password recovery from its sign-in flow.
export default function ForgotPasswordPage() {
  redirect("/sign-in");
}
