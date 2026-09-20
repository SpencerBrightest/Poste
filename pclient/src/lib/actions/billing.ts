"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrganization } from "@/lib/permissions";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Create a Stripe checkout session for subscription upgrade
 */
export async function createCheckoutSession(plan: "PRO" | "BUSINESS") {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const user = await getCurrentUser();
    const { organization } = await getOrganization();

    if (!organization) {
      throw new ValidationError("No organization found");
    }

    const priceId = plan === "PRO" 
      ? process.env.STRIPE_PRO_PRICE_ID 
      : process.env.STRIPE_BUSINESS_PRICE_ID;

    if (!priceId) {
      throw new ValidationError("Price ID not configured");
    }

    // Create or get Stripe customer
    let customerId = organization.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organizationId: organization.id,
        },
      });
      customerId = customer.id;

      await prisma.organization.update({
        where: { id: organization.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/editor/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/editor/billing?canceled=true`,
      metadata: {
        organizationId: organization.id,
        plan: plan,
      },
    });

    logger.info("Checkout session created", { organizationId: organization.id, plan });

    return { success: true, checkoutUrl: session.url };
  } catch (error) {
    logger.error("Failed to create checkout session", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create checkout session" };
  }
}

/**
 * Create a Stripe billing portal session
 */
export async function createBillingPortalSession() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const { organization } = await getOrganization();

    if (!organization || !organization.stripeCustomerId) {
      throw new ValidationError("No Stripe customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/editor/billing`,
    });

    logger.info("Billing portal session created", { organizationId: organization.id });

    return { success: true, portalUrl: session.url };
  } catch (error) {
    logger.error("Failed to create billing portal session", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create billing portal session" };
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        const plan = session.metadata?.plan;

        if (organizationId && plan) {
          await prisma.subscription.update({
            where: { organizationId },
            data: {
              plan: plan as any,
              status: "ACTIVE",
              stripeSubscriptionId: session.subscription as string,
              aiGenerationsLimit: plan === "PRO" ? 100 : 1000,
              scheduledPostsLimit: plan === "PRO" ? 50 : 500,
              connectedAccountsLimit: plan === "PRO" ? 5 : 20,
            },
          });

          logger.info("Subscription activated", { organizationId, plan });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;

        if (organizationId) {
          await prisma.subscription.update({
            where: { organizationId: organizationId },
            data: {
              status: "CANCELLED",
              plan: "FREE",
              aiGenerationsLimit: 10,
              scheduledPostsLimit: 5,
              connectedAccountsLimit: 1,
            },
          });

          logger.info("Subscription canceled", { organizationId });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const organizationId = invoice.metadata?.organizationId;

        if (organizationId) {
          await prisma.subscription.update({
            where: { organizationId },
            data: { status: "PAST_DUE" },
          });

          logger.info("Subscription payment failed", { organizationId });
        }
        break;
      }

      default:
        logger.info("Unhandled Stripe event", { eventType: event.type });
    }

    return { success: true };
  } catch (error) {
    logger.error("Failed to handle Stripe webhook", error);
    return { success: false, error: "Failed to handle webhook" };
  }
}

/**
 * Get current subscription details
 */
export async function getSubscription() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new ValidationError("Unauthorized");
    }

    const { organization } = await getOrganization();

    if (!organization) {
      return { success: false, error: "No organization found", subscription: null };
    }

    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id },
    });

    return { success: true, subscription };
  } catch (error) {
    logger.error("Failed to get subscription", error);
    if (error instanceof AppError) {
      return { success: false, error: error.message, subscription: null };
    }
    return { success: false, error: "Failed to get subscription", subscription: null };
  }
}
