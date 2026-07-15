import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import stripe from "../src/lib/stripe";
import resend from "../src/lib/resend";
import WelcomeEmail from "../src/emails/WelcomeEmail";
const http = httpRouter();

const clerkWebhook = httpAction(async (ctx, req) => {
  // Fixed argument order
  // 1. Use the Webhook Signing Secret from Clerk dashboard, NOT the Secret Key
  const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!clerkWebhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  // 2. req.headers is a Headers object; use .get() to retrieve values
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // 3. Get the raw body for verification
  const payload = await req.text(); // Using .text() is safer for signature verification

  const wb = new Webhook(clerkWebhookSecret);

  let event: WebhookEvent;
  try {
    event = wb.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Failed to verify Svix webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = event.type;

  // 4. Logic from Screenshot 2026-05-14 012246.png
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    if (!email) {
      console.error("Clerk webhook user.created missing email", event.data);
      return new Response("Missing email in webhook payload", { status: 400 });
    }

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { id },
      });
      console.log("Created Stripe customer:", customer.id);
      await ctx.runMutation(api.users.createUser, {
        email,
        name,
        clerkId: id,
        stripeCustomerId: customer.id,
      });


      //welcome email

      if (process.env.NODE_ENV === "development") {
				await resend.emails.send({
					from: "MasterClass <onboarding@resend.dev>",
					to: email,
					subject: "Welcome to MasterClass!",
					react: WelcomeEmail({ name, url: process.env.NEXT_PUBLIC_APP_URL! }),
				});
			}



    } catch (error) {
      console.error("Error creating user in Convex", error);
      return new Response("Error creating user", { status: 500 });
    }
  } else {
    console.log("Clerk webhook received unsupported event type:", eventType);
  }

  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

const stripeWebhook = httpAction(async (ctx, req) => {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.error("Failed to verify Stripe webhook:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return new Response("Missing checkout metadata", { status: 400 });
    }
    try {
      console.log("Stripe webhook checkout.session.completed", {
        sessionId: session.id,
        userId,
        courseId,
        amount: session.amount_total,
      });

      await ctx.runMutation(api.users.recordCoursePurchase, {
        userId: userId as Id<"users">,
        courseId: courseId as Id<"courses">,
        amount: session.amount_total ?? 0,
        stripePurchaseId: session.payment_intent?.toString() ?? session.id,
      });
    } catch (err) {
      console.error("Failed to record purchase from Stripe webhook", err, {
        sessionId: session.id,
        userId,
        courseId,
      });
      return new Response("Error recording purchase", { status: 500 });
    }
  }

  return new Response("Stripe webhook processed successfully", { status: 200 });
});

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
