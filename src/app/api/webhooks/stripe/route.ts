import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  console.log("Stripe webhook received", {
    path: "/api/webhooks/stripe",
    method: req.method,
    signaturePresent: Boolean(signature),
    bodyLength: body.length,
  });

  if (!signature) {
    console.error("Stripe webhook missing Stripe-Signature header");
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Webhook signature verification failed.", errorMessage);
    return new Response("Webhook signature verification failed.", {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(
          event.data.object as Stripe.Subscription,
          event.type,
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing webhook (${event.type}):`, errorMessage);
    return new Response("Error processing webhook", { status: 400 });
  }

  console.log(`Stripe webhook processed successfully: ${event.type}`);
  return new Response(JSON.stringify({ success: true, type: event.type }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const courseId = session.metadata?.courseId;
  const metadataUserId = session.metadata?.userId;
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  console.log("checkout.session.completed payload", {
    sessionId: session.id,
    courseId,
    metadataUserId,
    stripeCustomerId,
    amount_total: session.amount_total,
    payment_intent: session.payment_intent,
  });

  if (!courseId) {
    throw new Error("Missing courseId in checkout session metadata");
  }

  let user;
  if (metadataUserId) {
    user = await convex.query(api.users.getUserById, {
      userId: metadataUserId as Id<"users">,
    });
  } else if (stripeCustomerId) {
    user = await convex.query(api.users.getUserByStripeCustomerId, {
      stripeCustomerId,
    });
  }

  if (!user) {
    console.error("User not found for Stripe checkout session", {
      sessionId: session.id,
      courseId,
      metadataUserId,
      stripeCustomerId,
    });
    throw new Error("User not found");
  }

  const purchaseId = await convex.mutation(api.users.recordCoursePurchase, {
    userId: user._id,
    courseId: courseId as Id<"courses">,
    amount: session.amount_total ?? 0,
    stripePurchaseId: session.id,
  });

  console.log("Recorded course purchase", {
    userId: user._id,
    courseId,
    stripePurchaseId: session.id,
    purchaseId,
  });
}

//email

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  eventType: string,
) {
  if (subscription.status !== "active" || !subscription.latest_invoice) {
    console.log(
      `Skipping subscription ${subscription.id} - Status: ${subscription.status}`,
    );
    return;
  }

  const stripeCustomerId = subscription.customer as string;
  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });

  if (!user) {
    throw new Error(
      `User not found for stripe customer ID: ${stripeCustomerId}`,
    );
  }

  try {
    const currentPeriodStart =
      (
        subscription as Stripe.Subscription & {
          current_period_start?: number;
          current_period?: { start?: number; end?: number };
        }
      ).current_period_start ??
      (
        subscription as Stripe.Subscription & {
          current_period?: { start?: number; end?: number };
        }
      ).current_period?.start ??
      0;
    const currentPeriodEnd =
      (
        subscription as Stripe.Subscription & {
          current_period_end?: number;
          current_period?: { start?: number; end?: number };
        }
      ).current_period_end ??
      (
        subscription as Stripe.Subscription & {
          current_period?: { start?: number; end?: number };
        }
      ).current_period?.end ??
      0;
    const cancelAtPeriodEnd =
      (subscription as Stripe.Subscription & { cancel_at_period_end?: boolean })
        .cancel_at_period_end ?? false;

    await convex.mutation(api.subscriptions.upsertSubscription, {
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      state: subscription.status,
      planType: subscription.items.data[0].plan.interval as "month" | "year",
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    });
    console.log(
      `Subscription ${eventType} for subscription ${subscription.id}`,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error updating subscription for user ${user._id}:`, message);
    throw new Error(
      `Error updating subscription for user ${user._id}: ${message}`,
    );
  }
}
