import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import stripe from "../src/lib/stripe";
import ratelimit from "../src/lib/ratelimit";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  "http://localhost:3000";

export const createCheckoutSession = action({
  args: { courseId: v.id("courses"), clerkId: v.optional(v.string()) },
  handler: async (ctx, args): Promise<{ checkoutUrl: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    const clerkId = identity?.subject ?? args.clerkId;

    if (!clerkId) {
      throw new ConvexError("Unauthorized");
    }

    if (identity && args.clerkId && args.clerkId !== identity.subject) {
      throw new ConvexError("Mismatched clerkId");
    }

    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    const rateLimitKey = `checkout-rate-limit:${user._id}`;
    const { success } = await ratelimit.limit(rateLimitKey);


    if(!success) {
      throw new Error(
        `Rate limit exceeded`
      );
    }

    const course = await ctx.runQuery(api.courses.getCourseById, {
      courseId: args.courseId,
    });


    if (!course) {
      throw new ConvexError("Course not found");
    }

    const customerInfo = user.stripeCustomerId
      ? { customer: user.stripeCustomerId }
      : { customer_email: user.email };

    const session = await stripe.checkout.sessions.create({
      ...customerInfo,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              images: [course.imageUrl],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/courses/${String(args.courseId)}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/courses/${String(args.courseId)}`,
      metadata: {
        courseId: String(args.courseId),
        userId: String(user._id),
      },
    });

    return { checkoutUrl: session.url };
  },
});

export const confirmCheckoutSession = action({
  args: { sessionId: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; message: string }> => {
    const session = await stripe.checkout.sessions.retrieve(args.sessionId, {
      expand: ["payment_intent"],
    });

    if (!session) {
      throw new ConvexError("Checkout session not found");
    }

    const paymentStatus = session.payment_status;
    const sessionStatus = session.status;
    if (
      paymentStatus !== "paid" &&
      paymentStatus !== "no_payment_required" &&
      sessionStatus !== "complete"
    ) {
      throw new ConvexError("Payment has not completed yet.");
    }

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;
    if (!userId || !courseId) {
      throw new ConvexError("Missing checkout metadata.");
    }

    const stripePurchaseId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? session.id);

    await ctx.runMutation(api.users.recordCoursePurchase, {
      userId: userId as Id<"users">,
      courseId: courseId as Id<"courses">,
      amount: session.amount_total ?? 0,
      stripePurchaseId,
    });

    return {
      success: true,
      message: "Payment confirmed and course access recorded.",
    };
  },
});

export const createProPlanCheckoutSession = action({

  args: { planId: v.union(v.literal("month"), v.literal("year")) },
  handler: async (ctx, args): Promise<{ checkoutUrl: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
   
    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });
 if (!user) {
      throw new ConvexError("User not found");
    }

    let priceId;

    if (args.planId === "month") {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    } else if (args.planId === "year") {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID;
    }
    if (!priceId) {
      throw new ConvexError("Invalid plan ID");
    }

    // rate limit
		const rateLimitKey = `pro-plan-rate-limit:${user._id}`;
		const { success } = await ratelimit.limit(rateLimitKey);
		if (!success) {
			throw new Error(`Rate limit exceeded.`);
		}

    if (!priceId) {
      throw new ConvexError("Missing Stripe price ID for the selected plan.");
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/pro/success?session_id={CHECKOUT_SESSION_ID}&year=${args.planId === "year"}`,
      cancel_url: `${baseUrl}/pro`,
      metadata: {
        userId: String(user._id),
        planType: args.planId,
      },
    });
    return { checkoutUrl: session.url || null };
  },
})
