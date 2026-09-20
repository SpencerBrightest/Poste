import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/permissions";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  const user = await getCurrentUser();

  if (user?.role !== "ADMIN") {
    redirect("/editor");
  }

  // Fetch real admin metrics
  const totalUsers = await prisma.user.count();
  const totalOrganizations = await prisma.organization.count();
  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" },
  });
  const totalPosts = await prisma.post.count();
  const publishedPosts = await prisma.post.count({
    where: { status: "PUBLISHED" },
  });

  // Calculate monthly revenue (placeholder - would come from Stripe)
  const monthlyRevenue = 0;

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Get failed jobs
  const failedPosts = await prisma.post.count({
    where: { status: "FAILED" },
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and metrics</p>
      </div>
      <div className="admin-metrics">
        <div className="admin-metric-card">
          <h3>Total Users</h3>
          <p className="admin-metric-value">{totalUsers}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Organizations</h3>
          <p className="admin-metric-value">{totalOrganizations}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Active Subscriptions</h3>
          <p className="admin-metric-value">{activeSubscriptions}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Monthly Revenue</h3>
          <p className="admin-metric-value">${monthlyRevenue.toFixed(2)}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Total Posts</h3>
          <p className="admin-metric-value">{totalPosts}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Published Posts</h3>
          <p className="admin-metric-value">{publishedPosts}</p>
        </div>
        <div className="admin-metric-card">
          <h3>Failed Jobs</h3>
          <p className="admin-metric-value">{failedPosts}</p>
        </div>
      </div>
      <div className="admin-sections">
        <div className="admin-section">
          <h2>Recent Users</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
