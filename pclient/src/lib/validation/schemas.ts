import { z } from "zod";

// ============================================
// AUTH VALIDATION
// ============================================

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

// ============================================
// POST VALIDATION
// ============================================

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000, "Content must be less than 5000 characters"),
  hashtags: z.array(z.string()).max(30, "Maximum 30 hashtags allowed").default([]),
  cta: z.string().max(200, "CTA must be less than 200 characters").optional(),
  targetPlatform: z.enum(["X", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "TIKTOK"]),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().cuid(),
});

export const schedulePostSchema = z.object({
  postId: z.string().cuid(),
  socialAccountId: z.string().cuid(),
  scheduledFor: z.coerce.date().min(new Date(), "Scheduled time must be in the future"),
});

export const publishImmediatelySchema = z.object({
  postId: z.string().cuid(),
  socialAccountId: z.string().cuid(),
});

// ============================================
// AI VALIDATION
// ============================================

export const generateContentSchema = z.object({
  goal: z.string().min(10, "Goal description must be at least 10 characters").max(500),
  targetPlatform: z.enum(["X", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "TIKTOK"]),
  tone: z.enum(["professional", "casual", "friendly", "formal", "humorous"]).default("professional"),
  includeCTA: z.boolean().default(true),
});

export const transformContentSchema = z.object({
  postId: z.string().cuid(),
  transformation: z.enum(["shorten", "expand", "make_casual", "make_professional", "change_tone"]),
  targetPlatform: z.enum(["X", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "TIKTOK"]).optional(),
  tone: z.enum(["professional", "casual", "friendly", "formal", "humorous"]).optional(),
});

export const scoreContentSchema = z.object({
  postId: z.string().cuid(),
});

// ============================================
// SOCIAL ACCOUNT VALIDATION
// ============================================

export const connectSocialAccountSchema = z.object({
  platform: z.enum(["X", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "TIKTOK"]),
});

export const disconnectSocialAccountSchema = z.object({
  socialAccountId: z.string().cuid(),
});

// ============================================
// MEDIA VALIDATION
// ============================================

export const uploadMediaSchema = z.object({
  file: z.instanceof(File),
  postId: z.string().cuid().optional(),
});

// ============================================
// SUBSCRIPTION VALIDATION
// ============================================

export const createCheckoutSessionSchema = z.object({
  plan: z.enum(["FREE", "PRO", "BUSINESS"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const updateSubscriptionSchema = z.object({
  plan: z.enum(["PRO", "BUSINESS"]),
});

export const cancelSubscriptionSchema = z.object({
  cancelAtPeriodEnd: z.boolean().default(true),
});

// ============================================
// ANALYTICS VALIDATION
// ============================================

export const getAnalyticsSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  platform: z.enum(["X", "LINKEDIN", "INSTAGRAM", "FACEBOOK", "TIKTOK"]).optional(),
});

// ============================================
// ACCOUNT DELETION VALIDATION
// ============================================

export const requestDeletionSchema = z.object({
  confirmation: z.literal("DELETE_MY_ACCOUNT", {
    message: "You must type DELETE_MY_ACCOUNT to confirm",
  }),
});

export const cancelDeletionSchema = z.object({});

// ============================================
// ADMIN VALIDATION
// ============================================

export const adminUpdateUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["USER", "ADMIN"]),
});

export const adminGetUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
});

export const adminGetSubscriptionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  status: z.enum(["ACTIVE", "PAST_DUE", "CANCELLED", "TRIALING"]).optional(),
});

export const adminGetFailedJobsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  jobType: z.string().optional(),
});
