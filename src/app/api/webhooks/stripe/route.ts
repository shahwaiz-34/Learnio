import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`Webhook signature verification failed.`, message);
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
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error processing webhook ${event.type} : `, message);
    return new Response("Error processing webhooks", { status: 400 });
  }
  return new Response(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const courseId = session.metadata?.courseId;
  const stripeCustomerId = session.customer as string;

  if (!courseId || !stripeCustomerId) {
    throw new Error("Missing courseId or stripeCustomerId");
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });
  if (!user) {
    throw new Error("user not Found");
  }

  await convex.mutation(api.purchases.recordPurchase, {
    userId: user._id,
    courseId: courseId as Id<"courses">,
    amount: session.amount_total as number,
    stripePurchaseId: session.id,
  });
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  eventType: string,
) {
  if (subscription.status !== "active" || !subscription.latest_invoice) {
    console.log(
      `Skipping subcription ${subscription.id} - Status: ${subscription.status}`,
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
      (subscription as any).current_period_start ??
      (subscription as any).current_period?.start ??
      0;
    const currentPeriodEnd =
      (subscription as any).current_period_end ??
      (subscription as any).current_period?.end ??
      0;
    const cancelAtPeriodEnd =
      (subscription as any).cancel_at_period_end ?? false;

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
      `Subscription ${eventType}  for subscription ${subscription.id} `,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error updating subscription for user ${user._id}:`, message);
    throw new Error(
      `Error updating subscription for user ${user._id}: ${message}`,
    );
  }
}
