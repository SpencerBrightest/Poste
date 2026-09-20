import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.userId) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { clerkUserId: session.userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <nav>
          <a href="/admin">Overview</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/subscriptions">Subscriptions</a>
          <a href="/admin/jobs">Failed Jobs</a>
        </nav>
      </div>
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
