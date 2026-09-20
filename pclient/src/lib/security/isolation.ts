import prisma from "@/lib/prisma";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Ensure user has access to the specified organization
 */
export async function ensureOrganizationAccess(userId: string, organizationId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.organizationId !== organizationId) {
    logger.warn("Unauthorized organization access attempt", { userId, organizationId });
    throw new ValidationError("Access denied to this organization");
  }

  return user;
}

/**
 * Ensure user has access to the specified post
 */
export async function ensurePostAccess(userId: string, postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { organization: true },
  });

  if (!post) {
    throw new ValidationError("Post not found");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.organizationId !== post.organizationId) {
    logger.warn("Unauthorized post access attempt", { userId, postId });
    throw new ValidationError("Access denied to this post");
  }

  return post;
}

/**
 * Ensure user has access to the specified social account
 */
export async function ensureSocialAccountAccess(userId: string, socialAccountId: string) {
  const account = await prisma.socialAccount.findUnique({
    where: { id: socialAccountId },
  });

  if (!account) {
    throw new ValidationError("Social account not found");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.organizationId !== account.organizationId) {
    logger.warn("Unauthorized social account access attempt", { userId, socialAccountId });
    throw new ValidationError("Access denied to this social account");
  }

  return account;
}

/**
 * Ensure user has admin role
 */
export async function ensureAdminRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    logger.warn("Unauthorized admin access attempt", { userId });
    throw new ValidationError("Admin access required");
  }

  return user;
}
