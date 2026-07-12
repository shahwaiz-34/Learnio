import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPurchaseByUserAndCourse = query({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .collect();

    return purchases.length > 0 ? purchases[0] : null;
  },
});

export const recordPurchase = mutation({
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

    const existingByUserAndCourse = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId),
      )
      .collect();

    if (existingByUserAndCourse.length > 0) {
      return existingByUserAndCourse[0]._id;
    }

    return await ctx.db.insert("purchases", {
      userId: args.userId,
      amount: args.amount,
      courseId: args.courseId,
      stripePurchaseId: args.stripePurchaseId,
      purchaseDate: Date.now(),
    });
  },
});
