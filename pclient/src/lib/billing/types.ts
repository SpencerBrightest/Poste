import { SubscriptionPlan } from "@prisma/client";

export interface CheckoutSessionParams {
  plan: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface BillingProvider {
  /**
   * Create a checkout session for subscription
   */
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;

  /**
   * Create a billing portal session
   */
  createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }>;

  /**
   * Get subscription details
   */
  getSubscription(subscriptionId: string): Promise<unknown>;

  /**
   * Cancel a subscription
   */
  cancelSubscription(subscriptionId: string, atPeriodEnd: boolean): Promise<unknown>;

  /**
   * Update subscription
   */
  updateSubscription(subscriptionId: string, priceId: string): Promise<unknown>;

  /**
   * Verify webhook signature
   */
  verifyWebhook(payload: string, signature: string): unknown;
}
