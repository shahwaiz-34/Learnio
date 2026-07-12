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

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
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
    const existingByStripe = await ctx.db
      .query("purchases")
      .withIndex("by_stripePurchaseId", (q) =>
        q.eq("stripePurchaseId", args.stripePurchaseId),
      )
      .collect();

    if (existingByStripe.length > 0) {
      return existingByStripe[0]._id;
    }

    const existingPurchases = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .collect();

    if (existingPurchases.length > 0) {
      return existingPurchases[0]._id;
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
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && !args.clerkId) {
      return { hasAccess: false, reason: "Not authenticated" };
    }

    let user = await ctx.db.get(args.userId);
    if (!user && args.clerkId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId!))
        .unique();
    }

    if (!user) {
      return { hasAccess: false, reason: "User not found" };
    }

    if (identity && user.clerkId !== identity.subject) {
      return { hasAccess: false, reason: "Wrong user" };
    }

    if (!identity && args.clerkId && user.clerkId !== args.clerkId) {
      return { hasAccess: false, reason: "Wrong user" };
    }

    if (user.currentSubscriptionId) {
      const subscription = await ctx.db.get(user.currentSubscriptionId);
      if (subscription && subscription.state === "active") {
        return { hasAccess: true, accessType: "subscription" };
      }
    }

    // check for individual course purchase

    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .collect();

    if (purchases.length > 0) {
      return { hasAccess: true, accessType: "course" };
    }

    return { hasAccess: false };
  },
});
