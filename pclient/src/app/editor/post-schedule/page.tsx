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
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400"><Sparkles className="h-3.5 w-3.5" /> Publishing workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Post schedule</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Keep your next publishing moments visible and intentional.</p>
          </div>
          <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">
            <Plus className="h-4 w-4" /> Schedule post
          </button>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200"><CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Scheduled content</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">{scheduledPosts.length} upcoming</span>
        </div>
        <CalendarView postsByDate={postsByDate} />
      </div>
    </main>
  );
}
