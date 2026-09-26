import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { PostStatus } from "@prisma/client";
import { format } from "date-fns";
import CalendarView from "@/components/CalendarView";

export default async function PostSchedulePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/editor/post-schedule");
  }

  await getCurrentUser();
  const { organization } = await getOrganization();

  if (!organization) {
    redirect("/onboarding");
  }

  // Fetch scheduled posts
  const scheduledPosts = await prisma.scheduledPost.findMany({
    where: {
      organizationId: organization.id,
      status: PostStatus.SCHEDULED,
    },
    include: {
      post: true,
      socialAccount: true,
    },
    orderBy: { scheduledFor: "asc" },
  });

  // Group posts by date
  const postsByDate = scheduledPosts.reduce((acc, post) => {
    const date = format(new Date(post.scheduledFor), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(post);
    return acc;
  }, {} as Record<string, typeof scheduledPosts>);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Publishing workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Post schedule</h1>
            <p className="mt-2 text-sm text-muted-foreground">Keep your next publishing moments visible and intentional.</p>
          </div>
          <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:bg-primary-active">
            <Plus className="h-4 w-4" /> Schedule post
          </button>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-foreground"><CalendarDays className="h-4 w-4 text-primary" /> Scheduled content</span>
          <span className="rounded-sm bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{scheduledPosts.length} upcoming</span>
        </div>
        <CalendarView postsByDate={postsByDate} />
      </div>
    </main>
  );
}
