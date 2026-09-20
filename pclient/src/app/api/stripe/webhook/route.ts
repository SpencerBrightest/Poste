import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { handleStripeWebhook } from "@/lib/actions/billing";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new NextResponse("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    logger.info("Stripe webhook received", { eventType: event.type });

    const result = await handleStripeWebhook(event);

    if (!result.success) {
      return new NextResponse("Webhook handler failed", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Stripe webhook error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
