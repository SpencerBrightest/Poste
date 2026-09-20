import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        {/* Sidebar will be implemented in Phase 3 */}
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/content">Content Studio</a>
          <a href="/dashboard/calendar">Calendar</a>
          <a href="/dashboard/analytics">Analytics</a>
          <a href="/dashboard/social">Social Accounts</a>
          <a href="/dashboard/billing">Billing</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </div>
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
