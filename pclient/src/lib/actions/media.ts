"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { uploadMediaSchema } from "@/lib/validation/schemas";
import { MediaType } from "@prisma/client";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Upload media to storage
 */
export async function uploadMedia(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string | undefined;

    if (!file) {
      throw new ValidationError("No file provided");
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      throw new ValidationError("Invalid file type. Only images and videos are allowed.");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError("File size exceeds 10MB limit");
    }

    // TODO: Upload to Cloudinary (Phase 4)
    // For now, create a placeholder media record
    const mediaType = file.type.startsWith("image/") ? MediaType.IMAGE : MediaType.VIDEO;
    const storageKey = `uploads/${organization.id}/${Date.now()}_${file.name}`;
    const url = `https://placeholder.com/${storageKey}`;

    // Create media record
    const media = await prisma.media.create({
      data: {
        organizationId: organization.id,
        postId,
        type: mediaType,
        storageKey,
        url,
        mimeType: file.type,
        size: file.size,
        width: 800, // TODO: Get actual dimensions
        height: 600,
      },
    });

    logger.info("Media uploaded", { mediaId: media.id, organizationId: organization.id });

    revalidatePath("/editor");
    return { success: true, media };
  } catch (error) {
    logger.error("Failed to upload media", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to upload media" };
  }
}

/**
 * Delete media
 */
export async function deleteMedia(mediaId: string) {
  try {
    const user = await getCurrentUser();
    const organization = await getOrganization();

    // Verify ownership
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.organizationId !== organization.id) {
      throw new ValidationError("Media not found or access denied");
    }

    // TODO: Delete from Cloudinary (Phase 4)

    // Delete media record
    await prisma.media.delete({
      where: { id: mediaId },
    });

    logger.info("Media deleted", { mediaId });

    revalidatePath("/editor");
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete media", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete media" };
  }
}
