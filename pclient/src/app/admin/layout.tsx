import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

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
          <Link href="/admin">Overview</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/subscriptions">Subscriptions</Link>
          <Link href="/admin/jobs">Failed Jobs</Link>
        </nav>
      </div>
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
