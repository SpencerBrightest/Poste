import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ContentStudio from "@/components/ContentStudio";

// Protects the content studio and provides the signed-in profile to its preview.
export default async function NewPostPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/editor/new-post");
  }

  const user = await currentUser();

  return <ContentStudio firstName={user?.firstName ?? user?.username ?? "Creator"} imageUrl={user?.imageUrl ?? ""} />;
}
