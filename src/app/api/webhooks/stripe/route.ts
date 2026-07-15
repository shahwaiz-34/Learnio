import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import resend from "@/lib/resend";
import PurchaseConfirmationEmail from "../../../../emails/PurchaseConfirmationEmail";

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
        case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "invoice.payment_succeeded":
      case "invoice.finalized":
        await handleInvoiceEvent(
          event.data.object as Stripe.Invoice,
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

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  console.log("checkout.session.completed payload", {
    sessionId: session.id,
    courseId,
    metadataUserId,
    stripeCustomerId,
    subscriptionId,
    amount_total: session.amount_total,
    payment_intent: session.payment_intent,
  });

  if (!courseId && subscriptionId) {
    if (!stripeCustomerId && !metadataUserId) {
      throw new Error(
        "Missing Stripe customer or user metadata for subscription session",
      );
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
      console.error("User not found for Stripe subscription checkout session", {
        sessionId: session.id,
        subscriptionId,
        metadataUserId,
        stripeCustomerId,
      });
      throw new Error("User not found");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["latest_invoice"],
    });
    await handleSubscriptionUpsert(subscription, "checkout.session.completed");
    return;
  }

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



if (
		session.metadata &&
		session.metadata.courseTitle &&
		session.metadata.courseImageUrl &&
		process.env.NODE_ENV === "development"
	) {
		await resend.emails.send({
			from: "MasterClass <onboarding@resend.dev>",
			to: user.email,
			subject: "Purchase Confirmed",
			react: PurchaseConfirmationEmail({
				customerName: user.name,
				courseTitle: session.metadata?.courseTitle,
				courseImage: session.metadata?.courseImageUrl,
				courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
				purchaseAmount: session.amount_total! / 100,
			}),
		});
	}


  

  console.log("Recorded course purchase", {
    userId: user._id,
    courseId,
    stripePurchaseId: session.id,
    purchaseId,
  });



}



async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  eventType: string,
) {
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : (subscription.customer?.id ?? "");

  if (!stripeCustomerId) {
    throw new Error("Stripe subscription customer is missing");
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });

  if (!user) {
    throw new Error(
      `User not found for stripe customer ID: ${stripeCustomerId}`,
    );
  }

  try {
    const subscriptionData = subscription as unknown as {
      current_period_start?: number;
      current_period_end?: number;
      current_period?: { start?: number; end?: number };
      cancel_at_period_end?: boolean;
    };
    const currentPeriodStart =
      subscriptionData.current_period_start ??
      subscriptionData.current_period?.start ??
      0;
    const currentPeriodEnd =
      subscriptionData.current_period_end ??
      subscriptionData.current_period?.end ??
      0;
    const cancelAtPeriodEnd = subscriptionData.cancel_at_period_end ?? false;

    const priceInterval = subscription.items?.data?.[0]?.price?.recurring
      ?.interval as "month" | "year" | undefined;
    const planInterval = subscription.items?.data?.[0]?.plan?.interval as
      | "month"
      | "year"
      | undefined;
    const planType =
      priceInterval ??
      planInterval ??
      (subscription.metadata?.planType as "month" | "year") ??
      "month";

    if (!priceInterval && !planInterval) {
      console.warn(
        "Stripe subscription item missing interval; defaulting planType to month",
        {
          subscriptionId: subscription.id,
          item: subscription.items?.data?.[0],
        },
      );
    }

    console.log("Persisting Stripe subscription", {
      subscriptionId: subscription.id,
      status: subscription.status,
      planType,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      eventType,
    });

    await convex.mutation(api.subscriptions.upsertSubscription, {
      userId: user._id,
      stripeSubscriptionId: subscription.id,
      state: subscription.status,
      planType,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    });
    console.log(
      `Subscription ${eventType} for subscription ${subscription.id}`,
    );

   //send success subcription email

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error updating subscription for user ${user._id}:`, message);
    throw new Error(
      `Error updating subscription for user ${user._id}: ${message}`,
    );
  }
}
async function handleInvoiceEvent(invoice: Stripe.Invoice, eventType: string) {
  const invoiceData = invoice as unknown as {
    subscription?: string | { id?: string };
  };
  const subscriptionId =
    typeof invoiceData.subscription === "string"
      ? invoiceData.subscription
      : invoiceData.subscription?.id;

  if (!subscriptionId) {
    console.log("Invoice event ignored because subscription ID is missing", {
      invoiceId: invoice.id,
      eventType,
    });
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["latest_invoice"],
  });

  await handleSubscriptionUpsert(subscription, eventType);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	try {
		await convex.mutation(api.subscriptions.removeSubscription, {
			stripeSubscriptionId: subscription.id,
		});
		console.log(`Successfully deleted subscription ${subscription.id}`);
	} catch (error) {
		console.error(`Error deleting subscription ${subscription.id}:`, error);
	}
}