import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

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
  platform: string,
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
  private static locks = new Map<string, Promise<void>>();

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
        new Promise((_, reject) =>
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

/**
 * Idempotent operation helper
 */
export async function withIdempotency<T>(
  idempotencyKey: string,
  operation: () => Promise<T>
): Promise<T> {
  // Check if operation was already performed
  const existing = await prisma.idempotencyKey.findUnique({
    where: { key: idempotencyKey },
  });

  if (existing) {
    logger.info("Idempotent operation already performed", { idempotencyKey });
    return existing.result as T;
  }

  // Perform operation
  const result = await operation();

  // Store result
  await prisma.idempotencyKey.create({
    data: {
      key: idempotencyKey,
      result: result as any,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  return result;
}
