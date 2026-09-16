import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Sends visitors to the correct entry point before rendering protected app content.
export default async function HomePage() {
  const { isAuthenticated } = await auth();

  redirect(isAuthenticated ? "/editor" : "/sign-in");
}
