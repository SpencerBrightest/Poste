import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/content">Content Studio</Link>
          <Link href="/dashboard/calendar">Calendar</Link>
          <Link href="/dashboard/analytics">Analytics</Link>
          <Link href="/dashboard/social">Social Accounts</Link>
          <Link href="/dashboard/billing">Billing</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </div>
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
