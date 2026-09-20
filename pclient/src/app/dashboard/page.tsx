import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      
      {/* Dashboard metrics will be implemented in Phase 3 */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h3>Scheduled Posts</h3>
          <p className="metric-value">0</p>
        </div>
        <div className="metric-card">
          <h3>Published This Month</h3>
          <p className="metric-value">0</p>
        </div>
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <p className="metric-value">0%</p>
        </div>
        <div className="metric-card">
          <h3>Connected Accounts</h3>
          <p className="metric-value">0</p>
        </div>
      </div>

      {/* Recent activity will be implemented in Phase 3 */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <p>No recent activity</p>
      </div>
    </div>
  );
}
