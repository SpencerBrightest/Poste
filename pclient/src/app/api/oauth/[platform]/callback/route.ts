import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization, incrementQuotaUsage } from "@/lib/permissions";
import { getOAuthProvider } from "@/lib/social/oauth";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const redirectToEditor = (error: string) => NextResponse.redirect(new URL(`/editor?error=${error}`, request.url));

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = request.cookies.get(`${platform}_oauth_state`)?.value;
    if (searchParams.get("error")) return redirectToEditor("oauth_failed");
    if (!code) return redirectToEditor("no_code");
    if (!state || !storedState || state.length !== storedState.length || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))) {
      return redirectToEditor("oauth_state_mismatch");
    }

    await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) return NextResponse.redirect(new URL("/onboarding", request.url));

    const provider = getOAuthProvider(platform);
    const tokenResponse = await provider.handleOAuthCallback(code, state);
    const accountInfo = await provider.getAccount(tokenResponse.accessToken);
    const socialPlatform = provider.getPlatformType();
    const existingAccount = await prisma.socialAccount.findUnique({
      where: {
        organizationId_platform_platformAccountId: {
          organizationId: organization.id,
          platform: socialPlatform,
          platformAccountId: accountInfo.platformAccountId,
        },
      },
    });

    if (existingAccount) {
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken,
          status: "ACTIVE",
          lastSyncedAt: new Date(),
        },
      });
    } else {
      const accounts = await prisma.socialAccount.count({ where: { organizationId: organization.id } });
      const subscription = await prisma.subscription.findFirst({ where: { organizationId: organization.id } });
      if (accounts >= (subscription?.connectedAccountsLimit || 1)) return redirectToEditor("quota_exceeded");

      await prisma.socialAccount.create({
        data: {
          organizationId: organization.id,
          platform: socialPlatform,
          platformAccountId: accountInfo.platformAccountId,
          username: accountInfo.username,
          displayName: accountInfo.displayName,
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken,
          status: "ACTIVE",
          lastSyncedAt: new Date(),
        },
      });
      await incrementQuotaUsage("connectedAccounts");
    }

    logger.info("OAuth completed", { organizationId: organization.id, platform, platformAccountId: accountInfo.platformAccountId });
    const response = NextResponse.redirect(new URL(`/editor?success=${platform}_connected`, request.url));
    response.cookies.set(`${platform}_oauth_state`, "", { httpOnly: true, maxAge: 0, path: `/api/oauth/${platform}/callback` });
    return response;
  } catch (error) {
    logger.error("OAuth callback failed", { platform, error });
    return redirectToEditor("oauth_callback_failed");
  }
}
