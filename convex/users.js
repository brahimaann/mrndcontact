import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) return null;
    return await ctx.db
      .query("users").withIndex("by_clerkId", q => q.eq("clerkId", ident.subject))
      .unique();
  },
});

export const ensureUser = mutation({
  args: { displayName: v.string() },
  handler: async (ctx, { displayName }) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw new Error("Unauthorized");
    let u = await ctx.db
      .query("users").withIndex("by_clerkId", q => q.eq("clerkId", ident.subject))
      .unique();
    if (!u) {
      const id = await ctx.db.insert("users", {
        clerkId: ident.subject,
        role: 1,
        displayName,
        artistId: undefined,
        createdAt: Date.now(),
      });
      u = await ctx.db.get(id);
    }
    return u;
  },
});
