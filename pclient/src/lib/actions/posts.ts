"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization, checkSubscriptionQuota, incrementQuotaUsage } from "@/lib/permissions";
import { createPostSchema, updatePostSchema, schedulePostSchema, publishImmediatelySchema } from "@/lib/validation/schemas";
import { PostStatus, SocialPlatform } from "@prisma/client";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { inngest } from "@/lib/inngest/client";
import { preventDuplicateScheduledPost } from "@/lib/security/concurrency";

/**
 * Create a new post
 */
export async function createPost(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();

    if (!organization) {
      throw new ValidationError("No organization found");
    }

    // Validate input
    const data = createPostSchema.parse(Object.fromEntries(formData));

    // Check quota
    await checkSubscriptionQuota("scheduledPosts");

    // Create post
    const post = await prisma.post.create({
      data: {
        organizationId: organization.id,
        content: data.content,
        hashtags: data.hashtags,
        cta: data.cta,
        targetPlatform: data.targetPlatform as SocialPlatform,
        status: PostStatus.DRAFT,
      },
    });

    logger.info("Post created", { postId: post.id, organizationId: organization.id });

    revalidatePath("/editor");
    return { success: true, post };
  } catch (error) {
    logger.error("Failed to create post", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create post" };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = updatePostSchema.parse({
      id: formData.get("id"),
      content: formData.get("content"),
      hashtags: formData.get("hashtags") ? JSON.parse(formData.get("hashtags") as string) : [],
      cta: formData.get("cta") || undefined,
      targetPlatform: formData.get("targetPlatform"),
    });

    // Verify ownership
    const existingPost = await prisma.post.findUnique({
      where: { id: data.id },
    });

    if (!existingPost || existingPost.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Update post
    const post = await prisma.post.update({
      where: { id: data.id },
      data: {
        content: data.content,
        hashtags: data.hashtags,
        cta: data.cta,
        targetPlatform: data.targetPlatform as SocialPlatform,
      },
    });

    logger.info("Post updated", { postId: post.id });

    revalidatePath("/editor");
    return { success: true, post };
  } catch (error) {
    logger.error("Failed to update post", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update post" };
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { media: true },
    });

    if (!post || post.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Delete post (media will cascade delete)
    await prisma.post.delete({
      where: { id: postId },
    });

    logger.info("Post deleted", { postId });

    revalidatePath("/editor");
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete post", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete post" };
  }
}

/**
 * Schedule a post for publication
 */
export async function schedulePost(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = schedulePostSchema.parse({
      postId: formData.get("postId"),
      socialAccountId: formData.get("socialAccountId"),
      scheduledFor: formData.get("scheduledFor"),
    });

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post || post.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Verify social account ownership
    const socialAccount = await prisma.socialAccount.findUnique({
      where: { id: data.socialAccountId },
    });

    if (!socialAccount || socialAccount.organizationId !== organization.id) {
      throw new ValidationError("Social account not found or access denied");
    }

    // Check quota
    await checkSubscriptionQuota("scheduledPosts");

    // Update post status
    await prisma.post.update({
      where: { id: data.postId },
      data: { status: PostStatus.SCHEDULED },
    });

    // Prevent duplicate scheduled posts
    await preventDuplicateScheduledPost(
      organization.id,
      data.socialAccountId,
      data.scheduledFor
    );

    // Create scheduled post
    const scheduledPost = await prisma.scheduledPost.create({
      data: {
        postId: data.postId,
        organizationId: organization.id,
        socialAccountId: data.socialAccountId,
        scheduledFor: data.scheduledFor,
        status: PostStatus.SCHEDULED,
      },
    });

    // Increment quota
    await incrementQuotaUsage("scheduledPosts");

    // Enqueue background job for publishing
    await inngest.send({
      name: "post/publish",
      data: { scheduledPostId: scheduledPost.id },
      scheduledFor: data.scheduledFor,
    });

    logger.info("Post scheduled", { scheduledPostId: scheduledPost.id });

    revalidatePath("/editor");
    return { success: true, scheduledPost };
  } catch (error) {
    logger.error("Failed to schedule post", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to schedule post" };
  }
}

/**
 * Publish a post immediately
 */
export async function publishPostImmediately(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    // Validate input
    const data = publishImmediatelySchema.parse({
      postId: formData.get("postId"),
      socialAccountId: formData.get("socialAccountId"),
    });

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post || post.organizationId !== organization.id) {
      throw new ValidationError("Post not found or access denied");
    }

    // Verify social account ownership
    const socialAccount = await prisma.socialAccount.findUnique({
      where: { id: data.socialAccountId },
    });

    if (!socialAccount || socialAccount.organizationId !== organization.id) {
      throw new ValidationError("Social account not found or access denied");
    }

    await prisma.post.update({
      where: { id: data.postId },
      data: { status: PostStatus.PUBLISHING },
    });

    const result = socialAccount.platform === SocialPlatform.X
      ? await (await import("@/lib/social/twitter")).twitterProvider.publishPost({
          accessToken: socialAccount.accessToken,
          content: post.content,
          hashtags: post.hashtags,
        })
      : { success: false, error: "Publishing is not supported for this platform yet" };

    if (result.success) {
      await prisma.post.update({
        where: { id: data.postId },
        data: {
          status: PostStatus.PUBLISHED,
          platformPostId: result.externalPostId,
          publishedAt: result.publishedAt ?? new Date(),
        },
      });
    } else {
      await prisma.post.update({
        where: { id: data.postId },
        data: { status: PostStatus.FAILED, failureReason: result.error },
      });
      throw new ValidationError(result.error || "Failed to publish post");
    }

    logger.info("Post published immediately", { postId: data.postId });

    revalidatePath("/editor");
    return { success: true };
  } catch (error) {
    logger.error("Failed to publish post", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to publish post" };
  }
}

/**
 * Get posts for the current user's organization
 */
export async function getPosts() {
  try {
    const user = await getCurrentUser();
    const { organization } = await getOrganization();
    if (!organization) throw new ValidationError("No organization found");

    const posts = await prisma.post.findMany({
      where: { organizationId: organization.id },
      include: {
        media: true,
        scheduledPost: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, posts };
  } catch (error) {
    logger.error("Failed to get posts", error);
    return { success: false, error: "Failed to get posts", posts: [] };
  }
}
