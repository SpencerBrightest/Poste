"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { inngest } from "@/lib/inngest/client";

/**
 * Request account deletion (soft delete with confirmation period)
 */
export async function requestAccountDeletion() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const user = await getCurrentUser();
    const organization = await getOrganization();

    if (!organization.organization) {
      throw new ValidationError("No organization found");
    }

    // Mark organization for deletion (soft delete)
    await prisma.organization.update({
      where: { id: organization.organization.id },
      data: {
        deletionRequestedAt: new Date(),
        deletionScheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Enqueue background job for deletion
    await inngest.send({
      name: "deletion/process",
      data: { organizationId: organization.organization.id },
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    logger.info("Account deletion requested", { organizationId: organization.organization.id });

    return { success: true, message: "Account deletion scheduled for 7 days from now" };
  } catch (error) {
    logger.error("Failed to request account deletion", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to request account deletion" };
  }
}

/**
 * Cancel account deletion
 */
export async function cancelAccountDeletion() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const user = await getCurrentUser();
    const organization = await getOrganization();

    if (!organization.organization) {
      throw new ValidationError("No organization found");
    }

    await prisma.organization.update({
      where: { id: organization.organization.id },
      data: {
        deletionRequestedAt: null,
        deletionScheduledFor: null,
      },
    });

    logger.info("Account deletion canceled", { organizationId: organization.organization.id });

    return { success: true, message: "Account deletion canceled" };
  } catch (error) {
    logger.error("Failed to cancel account deletion", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to cancel account deletion" };
  }
}

/**
 * Process account deletion (called by Inngest)
 */
export async function processAccountDeletion(organizationId: string) {
  try {
    // Verify deletion was requested
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.deletionRequestedAt) {
      throw new Error("Organization not found or deletion not requested");
    }

    // Cancel Stripe subscription if exists
    if (organization.stripeCustomerId) {
      try {
        const Stripe = require("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        const subscriptions = await stripe.subscriptions.list({
          customer: organization.stripeCustomerId,
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
        }
      } catch (error) {
        logger.error("Failed to cancel Stripe subscription", error);
      }
    }

    // Delete all posts
    await prisma.post.deleteMany({
      where: { organizationId },
    });

    // Delete all scheduled posts
    await prisma.scheduledPost.deleteMany({
      where: { organizationId },
    });

    // Delete all media
    await prisma.media.deleteMany({
      where: { organizationId },
    });

    // Delete all social accounts
    await prisma.socialAccount.deleteMany({
      where: { organizationId },
    });

    // Delete all analytics
    await prisma.postAnalytics.deleteMany({
      where: { organizationId },
    });

    // Delete subscription
    await prisma.subscription.deleteMany({
      where: { organizationId },
    });

    // Delete users in organization
    await prisma.user.deleteMany({
      where: { organizationId },
    });

    // Delete organization
    await prisma.organization.delete({
      where: { id: organizationId },
    });

    logger.info("Account deletion completed", { organizationId });

    return { success: true };
  } catch (error) {
    logger.error("Failed to process account deletion", error);
    return { success: false, error: "Failed to process account deletion" };
  }
}

/**
 * Get deletion status
 */
export async function getDeletionStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const user = await getCurrentUser();
    const organization = await getOrganization();

    if (!organization.organization) {
      return { success: false, error: "No organization found", status: null };
    }

    return {
      success: true,
      status: {
        deletionRequestedAt: organization.organization.deletionRequestedAt,
        deletionScheduledFor: organization.organization.deletionScheduledFor,
      },
    };
  } catch (error) {
    logger.error("Failed to get deletion status", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message, status: null };
    }
    return { success: false, error: "Failed to get deletion status", status: null };
  }
}
