"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization, checkSubscriptionQuota, incrementQuotaUsage } from "@/lib/permissions";
import { generateContentSchema, transformContentSchema, scoreContentSchema } from "@/lib/validation/schemas";
import { SocialPlatform } from "@prisma/client";
import { AppError, ValidationError, QuotaExceededError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { geminiProvider } from "@/lib/ai/gemini";

/**
 * Generate AI content for a post
 */
export async function generateAIContent(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = generateContentSchema.parse({
      goal: formData.get("goal"),
      targetPlatform: formData.get("targetPlatform"),
      tone: formData.get("tone") || "professional",
      includeCTA: formData.get("includeCTA") === "true",
    });

    // Check quota
    const quota = await checkSubscriptionQuota("aiGenerations");
    if (quota.remaining <= 0) {
      throw new QuotaExceededError("AI generation quota exceeded. Please upgrade your subscription.");
    }

    // Call Gemini API
    const generatedContent = await geminiProvider.generateContent({
      goal: data.goal,
      targetPlatform: data.targetPlatform as SocialPlatform,
      tone: data.tone,
      includeCTA: data.includeCTA,
    });

    // Increment quota
    await incrementQuotaUsage("aiGenerations");

    logger.info("AI content generated", { organizationId: organization.id });

    return { success: true, content: generatedContent };
  } catch (error) {
    logger.error("Failed to generate AI content", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to generate AI content" };
  }
}

/**
 * Transform existing content with AI
 */
export async function transformContent(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = transformContentSchema.parse({
      postId: formData.get("postId"),
      transformation: formData.get("transformation"),
      targetPlatform: formData.get("targetPlatform") || undefined,
      tone: formData.get("tone") || undefined,
    });

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post || post.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Check quota
    await checkSubscriptionQuota("aiGenerations");

    // Call Gemini API for transformation
    const transformedContent = await geminiProvider.transformContent({
      postId: data.postId,
      originalContent: post.content,
      transformation: data.transformation,
      targetPlatform: data.targetPlatform as SocialPlatform,
      tone: data.tone,
    });

    // Increment quota
    await incrementQuotaUsage("aiGenerations");

    logger.info("Content transformed", { postId: data.postId });

    return { success: true, content: transformedContent };
  } catch (error) {
    logger.error("Failed to transform content", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to transform content" };
  }
}

/**
 * Score content quality with AI
 */
export async function scoreContent(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = scoreContentSchema.parse({
      postId: formData.get("postId"),
    });

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post || post.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Call Gemini API for scoring
    const score = await geminiProvider.scoreContent({
      postId: data.postId,
      content: post.content,
      platform: post.targetPlatform,
    });

    // Update post with AI score
    await prisma.post.update({
      where: { id: data.postId },
      data: {
        aiScore: score.overall,
        scoreBreakdown: score as any,
      },
    });

    logger.info("Content scored", { postId: data.postId });

    return { success: true, score };
  } catch (error) {
    logger.error("Failed to score content", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to score content" };
  }
}
