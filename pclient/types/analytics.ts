import { SocialPlatform } from "@prisma/client";

export interface PostAnalytics {
  id: string;
  postId: string;
  organizationId: string;
  platform: SocialPlatform;
  externalPostId: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  engagementRate?: number;
  syncedAt: Date;
  nextSyncAt: Date;
}

export interface AnalyticsInsight {
  id: string;
  organizationId: string;
  type: string;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface PlatformMetrics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  bestPerformingPost?: {
    postId: string;
    engagementRate: number;
  };
}
