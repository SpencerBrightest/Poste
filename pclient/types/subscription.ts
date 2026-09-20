import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

export interface Subscription {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  aiGenerationsLimit: number;
  aiGenerationsUsed: number;
  scheduledPostsLimit: number;
  scheduledPostsUsed: number;
  connectedAccountsLimit: number;
  connectedAccountsUsed: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanLimits {
  aiGenerations: number;
  scheduledPosts: number;
  connectedAccounts: number;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    aiGenerations: 10,
    scheduledPosts: 5,
    connectedAccounts: 1,
  },
  PRO: {
    aiGenerations: 100,
    scheduledPosts: 50,
    connectedAccounts: 3,
  },
  BUSINESS: {
    aiGenerations: 1000,
    scheduledPosts: 500,
    connectedAccounts: 10,
  },
};
