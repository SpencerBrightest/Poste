import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { twitterProvider } from "@/lib/social/twitter";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();
    const { organization } = await getOrganization();

    if (!organization) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    // Generate state with organization ID
    const state = crypto.randomBytes(32).toString("hex");

    // Get authorization URL
    const authUrl = await twitterProvider.getAuthorizationUrl(state);

    logger.info("Twitter OAuth initiated", { organizationId: organization.id });

    return NextResponse.json({ authUrl, state });
  } catch (error) {
    logger.error("Failed to initiate Twitter OAuth", error);
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 });
  }
}
