import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Clerk webhook handler for user events
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload.type;

    logger.info("Clerk webhook received", { eventType });

    // Handle user.created event
    if (eventType === "user.created") {
      const { id, email_addresses } = payload.data;
      const email = email_addresses?.[0]?.email_address;

      if (email) {
        await prisma.user.create({
          data: {
            clerkUserId: id,
            email,
            role: "USER",
          },
        });

        logger.info("User created", { clerkUserId: id, email });
      }
    }

    // Handle user.deleted event
    if (eventType === "user.deleted") {
      const { id } = payload.data;

      await prisma.user.delete({
        where: { clerkUserId: id },
      });

      logger.info("User deleted", { clerkUserId: id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Webhook error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
