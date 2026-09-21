import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { getAnalyticsData } from "@/lib/actions/analytics";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const user = await getCurrentUser();
  const clerkProfile = await currentUser();
  const { organization } = await getOrganization();

  if (!organization) {
    redirect("/onboarding");
  }

  // Fetch real analytics data
  const analytics = await getAnalyticsData();

  const data = analytics.success && analytics.data ? analytics.data : {
    totalPosts: 0,
    publishedPosts: 0,
    scheduledPosts: 0,
    connectedAccounts: 0,
    engagementRate: 0,
    postsByPlatform: [],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {clerkProfile?.firstName || clerkProfile?.username || user.email}!</h1>
        <p>Here's what's happening with your social media</p>
      </div>
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h3>Total Posts</h3>
          <p className="metric-value">{data.totalPosts}</p>
        </div>
        <div className="metric-card">
          <h3>Published</h3>
          <p className="metric-value">{data.publishedPosts}</p>
        </div>
        <div className="metric-card">
          <h3>Scheduled</h3>
          <p className="metric-value">{data.scheduledPosts}</p>
        </div>
        <div className="metric-card">
          <h3>Connected Accounts</h3>
          <p className="metric-value">{data.connectedAccounts}</p>
        </div>
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <p className="metric-value">{data.engagementRate.toFixed(2)}%</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link href="/editor/new-post" className="action-button primary">
          Create New Post
        </Link>
        <Link href="/editor/post-schedule" className="action-button secondary">
          View Schedule
        </Link>
      </div>
      {/* Recent activity will be implemented in Phase 3 */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <p>No recent activity</p>
      </div>
    </div>
  );
}
