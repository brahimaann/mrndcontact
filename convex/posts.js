import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const POST_CODE = process.env.POST_CODE ?? "13647";

/** Create a project (gated by shared code) */
export const createPost = mutation({
  args: { title: v.string(), body: v.string(), alias: v.string(), code: v.string() },
  handler: async (ctx, { title, body, alias, code }) => {
    if (code !== POST_CODE) throw new Error("invalid_code");

    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = slugBase + "-" + Math.random().toString(36).slice(2, 8);

    const now = Date.now();
    const postId = await ctx.db.insert("posts", {
      title,
      body,
      authorAlias: alias,   // <-- was `alias`; must be `authorAlias`
      slug,
      createdAt: now,
      updatedAt: now,
    });
    return { postId, slug };
  },
});

/** List projects (newest first) */
export const listPosts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 } = {}) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

/** Fetch a single project by slug */
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", q => q.eq("slug", slug))
      .unique();
  },
});

/** Replies (oldest → newest) */
export const listReplies = query({
  args: { postId: v.id("posts"), limit: v.optional(v.number()) },
  handler: async (ctx, { postId, limit = 200 }) => {
    return await ctx.db
      .query("replies")
      .withIndex("by_postId_createdAt", q => q.eq("postId", postId))
      .order("asc")
      .take(limit);
  },
});

/** Create a reply (public) */
export const createReply = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
    name: v.optional(v.string()),
    contact: v.optional(v.string()),
  },
  handler: async (ctx, { postId, body, name, contact }) => {
    await ctx.db.insert("replies", {
      postId,
      body,
      name,
      contact,
      createdAt: Date.now(),
    });
  },
});
