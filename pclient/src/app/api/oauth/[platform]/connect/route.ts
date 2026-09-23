import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { getOAuthProvider } from "@/lib/social/oauth";
import { logger } from "@/lib/logger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) return NextResponse.json({ error: "No organization found" }, { status: 400 });

    const state = crypto.randomBytes(32).toString("hex");
    const authUrl = await getOAuthProvider(platform).getAuthorizationUrl(state);
    const response = NextResponse.json({ authUrl });
    response.cookies.set(`${platform}_oauth_state`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: `/api/oauth/${platform}/callback`,
    });

    logger.info("OAuth initiated", { organizationId: organization.id, platform });
    return response;
  } catch (error) {
    logger.error("Failed to initiate OAuth", { platform, error });
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 });
  }
}
