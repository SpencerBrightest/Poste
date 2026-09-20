"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { PostStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

export interface DashboardMetric {
  name: string;
  value: number;
  published: number;
  scheduled: number;
  color: string;
}

export interface DashboardChartPoint {
  month: string;
  posts: number;
  published: number;
}

export interface DashboardData {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  connectedAccounts: number;
  platformMetrics: DashboardMetric[];
  chartPoints: DashboardChartPoint[];
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagementRate: number;
}

const platformColors: Record<string, string> = {
  X: "#38bdf8",
  LINKEDIN: "#2563eb",
  INSTAGRAM: "#e879a9",
  FACEBOOK: "#3b82f6",
  TIKTOK: "#111827",
};

/** Build the organization-scoped data snapshot used by the editor dashboard. */
export async function getDashboardData(): Promise<{
  success: boolean;
  data: DashboardData | null;
  error?: string;
}> {
  try {
    const { organization } = await getOrganization();

    if (!organization) {
      return { success: false, data: null, error: "No organization found" };
    }

    const [posts, accounts, analytics] = await Promise.all([
      prisma.post.findMany({
        where: { organizationId: organization.id },
        select: { targetPlatform: true, status: true, createdAt: true, publishedAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.socialAccount.findMany({
        where: { organizationId: organization.id },
        select: { platform: true },
      }),
      prisma.postAnalytics.findMany({
        where: { organizationId: organization.id },
        select: { likes: true, comments: true, shares: true, impressions: true },
      }),
    ]);

    const platformMetrics = Object.entries(
      posts.reduce<Record<string, DashboardMetric>>((metrics, post) => {
        const name = post.targetPlatform;
        const metric = metrics[name] ?? {
          name,
          value: 0,
          published: 0,
          scheduled: 0,
          color: platformColors[name] ?? "#64748b",
        };
        metric.value += 1;
        if (post.status === PostStatus.PUBLISHED) metric.published += 1;
        if (post.status === PostStatus.SCHEDULED) metric.scheduled += 1;
        metrics[name] = metric;
        return metrics;
      }, {})
    ).map(([, metric]) => metric);

    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const chartPoints = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (6 - index));
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthPosts = posts.filter((post) => {
        const createdAt = new Date(post.createdAt);
        return createdAt.getFullYear() === year && createdAt.getMonth() === month;
      });
      return {
        month: monthFormatter.format(date),
        posts: monthPosts.length,
        published: monthPosts.filter((post) => post.status === PostStatus.PUBLISHED).length,
      };
    });

    const likes = analytics.reduce((total, item) => total + item.likes, 0);
    const comments = analytics.reduce((total, item) => total + item.comments, 0);
    const shares = analytics.reduce((total, item) => total + item.shares, 0);
    const impressions = analytics.reduce((total, item) => total + item.impressions, 0);

    return {
      success: true,
      data: {
        totalPosts: posts.length,
        publishedPosts: posts.filter((post) => post.status === PostStatus.PUBLISHED).length,
        scheduledPosts: posts.filter((post) => post.status === PostStatus.SCHEDULED).length,
        draftPosts: posts.filter((post) => post.status === PostStatus.DRAFT).length,
        connectedAccounts: accounts.length,
        platformMetrics,
        chartPoints,
        likes,
        comments,
        shares,
        impressions,
        engagementRate: impressions > 0 ? ((likes + comments + shares) / impressions) * 100 : 0,
      },
    };
  } catch (error) {
    logger.error("Failed to build dashboard data", error);
    return { success: false, data: null, error: "Failed to load dashboard data" };
  }
}

/**
 * Get analytics data for the dashboard
 */
export async function getAnalyticsData() {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();

    if (!organization) {
      return {
        success: false,
        error: "No organization found",
        data: null,
      };
    }

    // Get post counts
    const totalPosts = await prisma.post.count({
      where: { organizationId: organization.id },
    });

    const publishedPosts = await prisma.post.count({
      where: {
        organizationId: organization.id,
        status: PostStatus.PUBLISHED,
      },
    });

    const scheduledPosts = await prisma.post.count({
      where: {
        organizationId: organization.id,
        status: PostStatus.SCHEDULED,
      },
    });

    // Get social accounts count
    const connectedAccounts = await prisma.socialAccount.count({
      where: { organizationId: organization.id },
    });

    // Get recent analytics from PostAnalytics
    const recentAnalytics = await prisma.postAnalytics.findMany({
      where: { organizationId: organization.id },
      orderBy: { syncedAt: "desc" },
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
      where: { organizationId: organization.id },
      _count: true,
    });

    logger.info("Analytics data fetched", { organizationId: organization.id });

    const data = {
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
    };

    return {
      success: true,
      data,
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
    const { organization } = await getOrganization();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        analytics: true,
      },
    });

    if (!organization || !post || post.organizationId !== organization.id) {
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
