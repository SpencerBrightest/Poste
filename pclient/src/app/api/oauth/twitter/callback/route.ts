import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { twitterProvider } from "@/lib/social/twitter";
import { getCurrentUser, getOrganization, incrementQuotaUsage } from "@/lib/permissions";
import { SocialPlatform, SocialAccountStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/editor?error=oauth_failed", req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/editor?error=no_code", req.url));
    }

    const user = await getCurrentUser();
    const { organization } = await getOrganization();

    if (!organization) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Handle OAuth callback
    const tokenResponse = await twitterProvider.handleOAuthCallback(code, state || "");

    // Get account info
    const accountInfo = await twitterProvider.getAccount(tokenResponse.accessToken);

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findUnique({
      where: {
        organizationId_platform_platformAccountId: {
          organizationId: organization.id,
          platform: SocialPlatform.X,
          platformAccountId: accountInfo.platformAccountId,
        },
      },
    });

    if (existingAccount) {
      // Update existing account
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken,
          status: SocialAccountStatus.ACTIVE,
          lastSyncedAt: new Date(),
        },
      });
    } else {
      // Check quota
      const accounts = await prisma.socialAccount.count({
        where: { organizationId: organization.id },
      });

      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: organization.id },
      });

      const limit = subscription?.connectedAccountsLimit || 1;

      if (accounts >= limit) {
        return NextResponse.redirect(new URL("/editor?error=quota_exceeded", req.url));
      }

      // Create new account
      await prisma.socialAccount.create({
        data: {
          organizationId: organization.id,
          platform: SocialPlatform.X,
          platformAccountId: accountInfo.platformAccountId,
          username: accountInfo.username,
          displayName: accountInfo.displayName,
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken,
          status: SocialAccountStatus.ACTIVE,
          lastSyncedAt: new Date(),
        },
      });

      // Increment quota
      await incrementQuotaUsage("connectedAccounts");
    }

    logger.info("Twitter OAuth completed", { platformAccountId: accountInfo.platformAccountId });

    return NextResponse.redirect(new URL("/editor?success=twitter_connected", req.url));
  } catch (error) {
    logger.error("Twitter OAuth callback failed", error);
    return NextResponse.redirect(new URL("/editor?error=oauth_callback_failed", req.url));
  }
}
