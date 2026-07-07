import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      console.log("User already exists");
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
      stripeCustomerId: args.stripeCustomerId,
    });

    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getUserByStripeCustomerId = query({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId),
      )
      .unique();
  },
});

export const recordCoursePurchase = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    amount: v.number(),
    stripePurchaseId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingPurchase = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .unique();

    if (existingPurchase) {
      return existingPurchase._id;
    }

    return await ctx.db.insert("purchases", {
      userId: args.userId,
      courseId: args.courseId,
      amount: args.amount,
      purchaseDate: Date.now(),
      stripePurchaseId: args.stripePurchaseId,
    });
  },
});

export const getUserAccess = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasAccess: false, reason: "Not authenticated" };
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      return { hasAccess: false, reason: "User not found" };
    }

    if (user.clerkId !== identity.subject) {
      return { hasAccess: false, reason: "Wrong user" };
    }

    if (user.currentSubscriptionId) {
      const subscription = await ctx.db.get(user.currentSubscriptionId);
      if (subscription && subscription.state === "active") {
        return { hasAccess: true, accessType: "subscription" };
      }
    }

    // check for individual course purchase

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .unique();

    if (purchase) {
      return { hasAccess: true, accessType: "course" };
    }

    return { hasAccess: false };
  },
});
