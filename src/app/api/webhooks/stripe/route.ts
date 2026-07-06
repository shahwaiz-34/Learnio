import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return new Response("Webhook signature verification failed.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        case "customer.subscription.created":
          case "customer.subscription.updated":
            await handleSubscriptionUpsert(event.data.object as Stripe.Subscription);
  default:
    console.log(`Unhandled event type: ${event.type}`);
    break;
  }
} catch (error:any) {

    console.error(`Error proccceing webhook ${event.type} : `, error)
    return new Response("Error procceing webhooks",{status : 400})
}
   return new Response(null,{status : 200})
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const courseId = session.metadata?.courseId;
  const stripeCustomerId = session.customer as string;

  if(!courseId || !stripeCustomerId) {
    throw new Error("Missing courseId or stripeCustomerId");
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId , {stripeCustomerId})
  if(!user){
    throw new Error("user not Found");
  }

  await convex.mutation(api.purchases.recordPurchase, {
    userId : user._id,
    courseId : courseId as Id<"courses">,
    amount : session.amount_total as number,
    stripePurchaseId : session.id
  })
 
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription,eventType: string) {

  if( subscription.status !== "active" || !subscription.latest_invoice) {  

    console.log(`Skipping subcription ${subscription.id} - Status: ${subscription.status}`);
    return;
  }
  
  
  const stripeCustomerId = subscription.customer as string;
  const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });

  if(!user) {
    throw new Error(`User not found for stripe customer ID: ${stripeCustomerId}`);


  }

  try {
  await convex.mutation(api.subscriptions.upsertSubscription, {
    userId: user._id,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    planType: subscription.items.data[0].plan.interval as "month" | "year",
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,

  })
  console.log(`Subscription ${eventType}  for subscription ${subscription.id} `);

}catch (error:any) {
  console.error(`Error updating subscription for user ${user._id}:`, error);
  throw new Error(`Error updating subscription for user ${user._id}: ${error.message}`);
  }


  
}