import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) return null;
    return await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ident.subject))
      .first();
  },
});

export const upsertMyProfile = mutation({
  args: {
    name: v.string(),
    alias: v.optional(v.string()),
    instagram: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw new Error("Not signed in.");
    const now = Date.now();

    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ident.subject))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        alias: args.alias ?? undefined,
        instagram: args.instagram ?? undefined,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("user_profiles", {
        userId: ident.subject,
        name: args.name,
        alias: args.alias ?? undefined,
        instagram: args.instagram ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
