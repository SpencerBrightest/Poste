import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EditorDashboard from "@/src/components/EditorDashboard";

// Protects the editor page at render time and provides the signed-in profile.
export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/editor");
  }

  const user = await currentUser();

  return (
    <EditorDashboard
      firstName={user?.firstName ?? user?.username ?? "Creator"}
      imageUrl={user?.imageUrl ?? ""}
    />
  );
}
