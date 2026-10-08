// Diagnostic endpoint: sends a test email to the currently authenticated Clerk user
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/email";
import TestEmail from "@/emails/test-email";

// GET /api/email/test — sends a test email to the logged-in user's primary address
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "No email on your Clerk account" }, { status: 400 });
  }

  const result = await sendEmail({
    to: email,
    subject: "Poste email test",
    react: TestEmail({ name: user?.firstName || "there" }),
  });

  if (!result.success) {
    return NextResponse.json({ error: "Send failed", details: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: result.id });
}
