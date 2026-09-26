import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { UnauthorizedError, ForbiddenError, NotFoundError } from "@/lib/errors";

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    throw new UnauthorizedError();
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { organization: true },
  });

  if (existingUser) {
    return existingUser;
  }

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId
  )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new UnauthorizedError("Clerk user has no email address");
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: { email },
    create: {
      clerkUserId: userId,
      email,
      role: UserRole.USER,
    },
    include: { organization: true },
  });

  return user;
}

/**
 * Check if user has ADMIN role
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (user.role !== UserRole.ADMIN) {
    throw new ForbiddenError("Admin access required");
  }

  return user;
}

/**
 * Get user's organization
 */
export async function getOrganization(organizationId?: string) {
  const user = await getCurrentUser();
  
  const orgId = organizationId || user.organizationId;
  
  if (!orgId) {
    return { organization: null };
  }

  // Verify user belongs to organization
  if (user.organizationId !== orgId) {
    throw new ForbiddenError("You do not have access to this organization");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    return { organization: null };
  }

  return { organization };
}

/**
 * Check if user can access a resource
 */
export async function canAccessResource(
  resourceType: "post" | "socialAccount" | "subscription",
  resourceId: string
) {
  const { organization } = await getOrganization();
  
  if (!organization) {
    return false;
  }

  switch (resourceType) {
    case "post": {
      const post = await prisma.post.findUnique({
        where: { id: resourceId },
      });
      return post?.organizationId === organization.id;
    }
    case "socialAccount": {
      const account = await prisma.socialAccount.findUnique({
        where: { id: resourceId },
      });
      return account?.organizationId === organization.id;
    }
    case "subscription": {
      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: organization.id },
      });
      return !!subscription;
    }
    default:
      return false;
  }
}

/**
 * Require access to a resource
 */
export async function requireResourceAccess(
  resourceType: "post" | "socialAccount" | "subscription",
  resourceId: string
) {
  const hasAccess = await canAccessResource(resourceType, resourceId);
  
  if (!hasAccess) {
    throw new ForbiddenError("You do not have access to this resource");
  }

  return true;
}

/**
 * Check subscription quota
 */
export async function checkSubscriptionQuota(
  quotaType: "aiGenerations" | "scheduledPosts" | "connectedAccounts"
) {
  const { organization } = await getOrganization();
  
  if (!organization) {
    throw new ForbiddenError("No organization found");
  }
  
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: organization.id },
  });

  if (!subscription) {
    throw new ForbiddenError("No subscription found");
  }

  const used = subscription[`${quotaType}Used` as keyof typeof subscription] as number;
  const limit = subscription[`${quotaType}Limit` as keyof typeof subscription] as number;

  if (used >= limit) {
    throw new ForbiddenError(
      `You have reached your ${quotaType} limit. Please upgrade your subscription.`
    );
  }

  return { used, limit, remaining: limit - used };
}

/**
 * Increment subscription quota usage
 */
export async function incrementQuotaUsage(
  quotaType: "aiGenerations" | "scheduledPosts" | "connectedAccounts"
) {
  const { organization } = await getOrganization();
  
  if (!organization) {
    throw new ForbiddenError("No organization found");
  }
  
  const subscription = await prisma.subscription.update({
    where: { organizationId: organization.id },
    data: {
      [`${quotaType}Used`]: {
        increment: 1,
      },
    },
  });

  return subscription;
}
