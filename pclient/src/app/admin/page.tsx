export default async function AdminPage() {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      
      {/* Admin metrics will be implemented in Phase 11 */}
      <div className="admin-metrics">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p className="metric-value">0</p>
        </div>
        <div className="metric-card">
          <h3>Active Subscriptions</h3>
          <p className="metric-value">0</p>
        </div>
        <div className="metric-card">
          <h3>Monthly Revenue</h3>
          <p className="metric-value">$0</p>
        </div>
        <div className="metric-card">
          <h3>Failed Jobs</h3>
          <p className="metric-value">0</p>
        </div>
      </div>
    </div>
  );
}
