"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/permissions";
import { createOrganizationSchema } from "@/lib/validation/schemas";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Create a new organization
 */
export async function createOrganization(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // Validate input
    const data = createOrganizationSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
    });

    // Check if user already has an organization
    if (user.organizationId) {
      throw new ValidationError("User already has an organization");
    }

    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existingOrg) {
      throw new ValidationError("Organization slug already taken");
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    // Update user with organization
    await prisma.user.update({
      where: { id: user.id },
      data: { organizationId: organization.id },
    });

    // Create default subscription
    await prisma.subscription.create({
      data: {
        organizationId: organization.id,
        plan: "FREE",
        status: "TRIALING",
        aiGenerationsLimit: 10,
        scheduledPostsLimit: 5,
        connectedAccountsLimit: 1,
      },
    });

    logger.info("Organization created", { organizationId: organization.id, userId: user.id });

    revalidatePath("/editor");
    return { success: true, organization };
  } catch (error) {
    logger.error("Failed to create organization", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create organization" };
  }
}

/**
 * Get the current user's organization
 */
export async function getOrganization() {
  try {
    const user = await getCurrentUser();

    if (!user.organizationId) {
      return { success: false, error: "No organization found", organization: null };
    }

    const organization = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      include: {
        subscriptions: true,
        users: true,
      },
    });

    return { success: true, organization };
  } catch (error) {
    logger.error("Failed to get organization", error);
    return { success: false, error: "Failed to get organization", organization: null };
  }
}

/**
 * Update organization details
 */
export async function updateOrganization(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    if (!organization.organization) {
      throw new ValidationError("No organization found");
    }

    const name = formData.get("name") as string | undefined;

    // Update organization
    const updatedOrg = await prisma.organization.update({
      where: { id: organization.organization.id },
      data: {
        ...(name && { name }),
      },
    });

    logger.info("Organization updated", { organizationId: updatedOrg.id });

    revalidatePath("/editor");
    return { success: true, organization: updatedOrg };
  } catch (error) {
    logger.error("Failed to update organization", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update organization" };
  }
}
