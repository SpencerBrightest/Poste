import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { SocialPlatform } from "@prisma/client";

/**
 * Prevent duplicate scheduled posts for the same time
 */
export async function preventDuplicateScheduledPost(
  organizationId: string,
  socialAccountId: string,
  scheduledFor: Date
) {
  const existing = await prisma.scheduledPost.findFirst({
    where: {
      organizationId,
      socialAccountId,
      scheduledFor,
      status: { in: ["SCHEDULED", "PUBLISHING"] },
    },
  });

  if (existing) {
    logger.warn("Duplicate scheduled post attempt prevented", {
      organizationId,
      socialAccountId,
      scheduledFor,
    });
    throw new Error("A post is already scheduled for this time on this account");
  }
}

/**
 * Prevent duplicate social account connections
 */
export async function preventDuplicateSocialAccount(
  organizationId: string,
  platform: SocialPlatform,
  platformAccountId: string
) {
  const existing = await prisma.socialAccount.findFirst({
    where: {
      organizationId,
      platform,
      platformAccountId,
    },
  });

  if (existing) {
    logger.warn("Duplicate social account connection attempt prevented", {
      organizationId,
      platform,
      platformAccountId,
    });
    throw new Error("This social account is already connected");
  }
}

/**
 * Lock mechanism for critical operations
 */
export class OperationLock {
  private static locks = new Map<string, Promise<unknown>>();

  static async acquire<T>(
    key: string,
    operation: () => Promise<T>,
    timeout = 30000
  ): Promise<T> {
    const existingLock = this.locks.get(key);
    if (existingLock) {
      // Wait for existing lock to resolve or timeout
      await Promise.race([
        existingLock,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Lock timeout")), timeout)
        ),
      ]);
    }

    const lockPromise = (async () => {
      try {
        return await operation();
      } finally {
        this.locks.delete(key);
      }
    })();

    this.locks.set(key, lockPromise);
    return lockPromise;
  }
}
