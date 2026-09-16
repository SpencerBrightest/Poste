import { redirect } from "next/navigation";

// Keeps the previous URL working while Clerk owns the authentication flow.
export default function LoginPage() {
  redirect("/sign-in");
}
