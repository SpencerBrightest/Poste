import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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

  const user = await getCurrentUser();
  const organization = await getOrganization();

  if (!organization.organization) {
    redirect("/onboarding");
  }

  // Fetch scheduled posts
  const scheduledPosts = await prisma.scheduledPost.findMany({
    where: {
      organizationId: organization.organization.id,
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
    <div className="schedule-container">
      <div className="schedule-header">
        <div>
          <h1>Post Schedule</h1>
          <p>Manage your scheduled posts</p>
        </div>
      </div>
      <CalendarView postsByDate={postsByDate} />
    </div>
  );
}
