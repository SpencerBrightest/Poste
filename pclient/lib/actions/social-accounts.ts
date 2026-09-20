"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization, checkSubscriptionQuota, incrementQuotaUsage } from "@/lib/permissions";
import { connectSocialAccountSchema, disconnectSocialAccountSchema } from "@/lib/validation/schemas";
import { SocialPlatform, SocialAccountStatus } from "@prisma/client";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Get social accounts for the current user's organization
 */
export async function getSocialAccounts() {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    const accounts = await prisma.socialAccount.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, accounts };
  } catch (error) {
    logger.error("Failed to get social accounts", error);
    return { success: false, error: "Failed to get social accounts", accounts: [] };
  }
}

/**
 * Connect a social account (OAuth flow initiation)
 */
export async function connectSocialAccount(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    // Validate input
    const data = connectSocialAccountSchema.parse({
      platform: formData.get("platform"),
    });

    // Check quota
    await checkSubscriptionQuota("connectedAccounts");

    // TODO: Initiate OAuth flow for the platform (Phase 6)
    // For now, return a placeholder response
    
    logger.info("Social account connection initiated", { platform: data.platform });

    return { 
      success: true, 
      message: "OAuth flow will be implemented in Phase 6",
      platform: data.platform 
    };
  } catch (error) {
    logger.error("Failed to connect social account", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to connect social account" };
  }
}

/**
 * Handle OAuth callback and create social account
 */
export async function handleOAuthCallback(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    const platform = formData.get("platform") as SocialPlatform;
    const accessToken = formData.get("accessToken") as string;
    const refreshToken = formData.get("refreshToken") as string | undefined;
    const platformAccountId = formData.get("platformAccountId") as string;
    const username = formData.get("username") as string;
    const displayName = formData.get("displayName") as string | undefined;

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findUnique({
      where: {
        organizationId_platform_platformAccountId: {
          organizationId: organization.id,
          platform,
          platformAccountId,
        },
      },
    });

    if (existingAccount) {
      // Update existing account
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken,
          refreshToken,
          status: SocialAccountStatus.ACTIVE,
          lastSyncedAt: new Date(),
        },
      });

      logger.info("Social account reconnected", { accountId: existingAccount.id });
    } else {
      // Create new account
      await prisma.socialAccount.create({
        data: {
          organizationId: organization.id,
          platform,
          platformAccountId,
          username,
          displayName,
          accessToken,
          refreshToken,
          status: SocialAccountStatus.ACTIVE,
          lastSyncedAt: new Date(),
        },
      });

      // Increment quota
      await incrementQuotaUsage("connectedAccounts");

      logger.info("Social account connected", { platform, username });
    }

    revalidatePath("/editor");
    return { success: true };
  } catch (error) {
    logger.error("Failed to handle OAuth callback", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to handle OAuth callback" };
  }
}

/**
 * Disconnect a social account
 */
export async function disconnectSocialAccount(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    // Validate input
    const data = disconnectSocialAccountSchema.parse({
      socialAccountId: formData.get("socialAccountId"),
    });

    // Verify ownership
    const account = await prisma.socialAccount.findUnique({
      where: { id: data.socialAccountId },
    });

    if (!account || account.organizationId !== organization.id) {
      throw new ValidationError("Social account not found or access denied");
    }

    // Delete account
    await prisma.socialAccount.delete({
      where: { id: data.socialAccountId },
    });

    logger.info("Social account disconnected", { accountId: data.socialAccountId });

    revalidatePath("/editor");
    return { success: true };
  } catch (error) {
    logger.error("Failed to disconnect social account", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to disconnect social account" };
  }
}
