import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization, incrementQuotaUsage } from "@/lib/permissions";
import { getOAuthProvider, type OAuthPlatform } from "@/lib/social/oauth";
import { logger } from "@/lib/logger";

function stateCookieName(platform: OAuthPlatform) {
  return `${platform}_oauth_state`;
}

function callbackPath(platform: OAuthPlatform) {
  return `/api/oauth/${platform}/callback`;
}

export async function startOAuth(platform: OAuthPlatform) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) return NextResponse.json({ error: "No organization found" }, { status: 400 });

    const state = crypto.randomBytes(32).toString("hex");
    const authUrl = await getOAuthProvider(platform).getAuthorizationUrl(state);
    const response = NextResponse.json({ authUrl });
    response.cookies.set(stateCookieName(platform), state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: callbackPath(platform),
    });

    logger.info("OAuth initiated", { organizationId: organization.id, platform });
    return response;
  } catch (error) {
    logger.error("Failed to initiate OAuth", { platform, error });
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 });
  }
}

export async function completeOAuth(platform: OAuthPlatform, request: NextRequest) {
  const redirectToEditor = (error: string) =>
    NextResponse.redirect(new URL(`/editor?error=${error}`, request.url));

  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = request.cookies.get(stateCookieName(platform))?.value;

    if (searchParams.get("error")) return redirectToEditor("oauth_failed");
    if (!code) return redirectToEditor("no_code");
    if (
      !state ||
      !storedState ||
      state.length !== storedState.length ||
      !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))
    ) {
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

    logger.info("OAuth completed", {
      organizationId: organization.id,
      platform,
      platformAccountId: accountInfo.platformAccountId,
    });

    const response = NextResponse.redirect(new URL(`/editor?success=${platform}_connected`, request.url));
    response.cookies.set(stateCookieName(platform), "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: callbackPath(platform),
    });
    return response;
  } catch (error) {
    logger.error("OAuth callback failed", { platform, error });
    return redirectToEditor("oauth_callback_failed");
  }
}
