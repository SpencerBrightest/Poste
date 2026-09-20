"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { PostStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

/**
 * Get analytics data for the dashboard
 */
export async function getAnalyticsData() {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    if (!organization.organization) {
      return {
        success: false,
        error: "No organization found",
        data: null,
      };
    }

    // Get post counts
    const totalPosts = await prisma.post.count({
      where: { organizationId: organization.organization.id },
    });

    const publishedPosts = await prisma.post.count({
      where: {
        organizationId: organization.organization.id,
        status: PostStatus.PUBLISHED,
      },
    });

    const scheduledPosts = await prisma.post.count({
      where: {
        organizationId: organization.organization.id,
        status: PostStatus.SCHEDULED,
      },
    });

    // Get social accounts count
    const connectedAccounts = await prisma.socialAccount.count({
      where: { organizationId: organization.organization.id },
    });

    // Get recent analytics from PostAnalytics
    const recentAnalytics = await prisma.postAnalytics.findMany({
      where: { organizationId: organization.organization.id },
      orderBy: { date: "desc" },
      take: 30,
    });

    // Calculate engagement rate
    const totalLikes = recentAnalytics.reduce((sum, a) => sum + (a.likes || 0), 0);
    const totalComments = recentAnalytics.reduce((sum, a) => sum + (a.comments || 0), 0);
    const totalImpressions = recentAnalytics.reduce((sum, a) => sum + (a.impressions || 0), 0);
    const engagementRate = totalImpressions > 0 
      ? ((totalLikes + totalComments) / totalImpressions) * 100 
      : 0;

    // Get posts by platform
    const postsByPlatform = await prisma.post.groupBy({
      by: ["targetPlatform"],
      where: { organizationId: organization.organization.id },
      _count: true,
    });

    logger.info("Analytics data fetched", { organizationId: organization.organization.id });

    return {
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        scheduledPosts,
        connectedAccounts,
        engagementRate,
        postsByPlatform: postsByPlatform.map((p) => ({
          platform: p.targetPlatform,
          count: p._count,
        })),
        recentAnalytics,
      },
    };
  } catch (error) {
    logger.error("Failed to fetch analytics data", error);
    return {
      success: false,
      error: "Failed to fetch analytics data",
      data: null,
    };
  }
}

/**
 * Get post analytics for a specific post
 */
export async function getPostAnalytics(postId: string) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        analytics: true,
      },
    });

    if (!post || post.organizationId !== organization.organization?.id) {
      return {
        success: false,
        error: "Post not found or access denied",
        analytics: null,
      };
    }

    return {
      success: true,
      analytics: post.analytics,
    };
  } catch (error) {
    logger.error("Failed to fetch post analytics", error);
    return {
      success: false,
      error: "Failed to fetch post analytics",
      analytics: null,
    };
  }
}
