import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import EditorSectionPage from "@/src/components/EditorSectionPage";

const sections = {
  "post-schedule": { title: "Post Schedule", description: "Plan and manage everything you want to publish.", icon: "calendar" as const },
  analytics: { title: "Analytics", description: "Understand what is resonating with your audience.", icon: "analytics" as const },
  sponsorship: { title: "Sponsorship", description: "Organize brand opportunities and campaign partnerships.", icon: "sponsorship" as const },
  mails: { title: "Mails", description: "Keep messages and creator conversations in one place.", icon: "mail" as const },
  collaboration: { title: "Collaboration", description: "Work with your team and keep approvals moving.", icon: "collaboration" as const },
};

interface EditorSectionRouteProps {
  params: Promise<{ section: string }>;
}

// Protects each editor workspace destination and renders its dedicated page.
export default async function EditorSectionRoute({ params }: EditorSectionRouteProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/editor");

  const { section } = await params;
  const sectionConfig = sections[section as keyof typeof sections];
  if (!sectionConfig) notFound();

  return <EditorSectionPage {...sectionConfig} />;
}
