import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { twitterProvider } from "@/lib/social/twitter";
import { PostStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

export const publishScheduledPost = inngest.createFunction(
  { id: "publish-scheduled-post" },
  { event: "post/publish" },
  async ({ event, step }) => {
    const { scheduledPostId } = event.data;

    // Fetch scheduled post with relations
    const scheduledPost = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: {
        post: true,
        socialAccount: true,
      },
    });

    if (!scheduledPost) {
      throw new Error("Scheduled post not found");
    }

    // Update post status to publishing
    await prisma.post.update({
      where: { id: scheduledPost.postId },
      data: { status: PostStatus.PUBLISHING },
    });

    // Publish to platform
    let platformPostId: string | null = null;
    let publishedAt: Date | null = null;

    if (scheduledPost.socialAccount.platform === SocialPlatform.X) {
      const result = await twitterProvider.publishPost({
        accessToken: scheduledPost.socialAccount.accessToken,
        content: scheduledPost.post.content,
        hashtags: scheduledPost.post.hashtags,
      });

      if (result.success) {
        platformPostId = result.externalPostId || null;
        publishedAt = result.publishedAt || new Date();
      }
    }

    // Update post status
    if (platformPostId) {
      await prisma.post.update({
        where: { id: scheduledPost.postId },
        data: {
          status: PostStatus.PUBLISHED,
          platformPostId,
          publishedAt,
        },
      });

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: PostStatus.PUBLISHED },
      });

      logger.info("Post published successfully", { scheduledPostId, platformPostId });
    } else {
      await prisma.post.update({
        where: { id: scheduledPost.postId },
        data: { status: PostStatus.FAILED },
      });

      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: PostStatus.FAILED },
      });

      logger.error("Post publishing failed", { scheduledPostId });
    }
  }
);

export const syncPostAnalytics = inngest.createFunction(
  { id: "sync-post-analytics" },
  { event: "analytics/sync" },
  async ({ event }) => {
    // Implementation in Phase 9
    console.log("Sync post analytics:", event.data);
  }
);

export const processAccountDeletion = inngest.createFunction(
  { id: "process-account-deletion" },
  { event: "deletion/process" },
  async ({ event }) => {
    const { organizationId } = event.data;
    const { processAccountDeletion } = await import("@/lib/actions/deletion");
    await processAccountDeletion(organizationId);
  }
);
