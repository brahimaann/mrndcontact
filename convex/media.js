import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMediaRecord = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    kind: v.union(v.literal("image"), v.literal("video"), v.literal("audio")),
    mimeType: v.string(),
    visibility: v.union(v.literal("public"), v.literal("members"), v.literal("core")),
    artistId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) throw new Error("Unauthorized");

    const owner = await ctx.db
      .query("users").withIndex("by_clerkId", q => q.eq("clerkId", ident.subject))
      .unique();
    if (!owner) throw new Error("User missing");

    return await ctx.db.insert("media", {
      ownerUserId: owner._id,
      artistId: args.artistId,
      title: args.title,
      kind: args.kind,
      mimeType: args.mimeType,
      fileId: args.storageId,
      visibility: args.visibility,
      createdAt: Date.now(),
    });
  },
});

export const listMyMedia = query({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) return [];
    const owner = await ctx.db
      .query("users").withIndex("by_clerkId", q => q.eq("clerkId", ident.subject))
      .unique();
    if (!owner) return [];
    return await ctx.db.query("media")
      .withIndex("by_owner", q => q.eq("ownerUserId", owner._id))
      .order("desc")
      .collect();
  },
});

export const getFileUrl = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
