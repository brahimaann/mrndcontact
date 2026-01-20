import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const listTalents = query({
  args: {},
  handler: async ({ db }) => db.query("talents").withIndex("by_name").collect(),
});

export const getTalentBySlug = query({
  args: { slug: v.string() },
  handler: async ({ db }, { slug }) =>
    db.query("talents").withIndex("by_nameLower", q => q.eq("nameLower", slug.toLowerCase())).unique()
    ?? db.query("talents").withIndex("by_name", q => q.eq("name", slug)).unique(),
});

export const listWorksByMedium = query({
  args: { type: v.string(), limit: v.optional(v.number()) },
  handler: async ({ db }, { type, limit = 48 }) => {
    const works = await db.query("works").withIndex("by_type", q => q.eq("type", type)).order("desc").take(limit);
    // Join with talents to get artist names
    return Promise.all(works.map(async (work) => {
      let talentName = null;
      if (work.talentSlug) {
        // Try to find talent by slug, nameLower, or name
        const talent = await db.query("talents")
          .withIndex("by_slug", q => q.eq("slug", work.talentSlug))
          .first()
          ?? await db.query("talents")
          .withIndex("by_nameLower", q => q.eq("nameLower", work.talentSlug.toLowerCase()))
          .first()
          ?? await db.query("talents")
          .withIndex("by_name", q => q.eq("name", work.talentSlug))
          .first();
        if (talent) {
          talentName = talent.name;
        }
      }
      return { ...work, artistName: talentName };
    }));
  },
});

export const listWorksByTalent = query({
  args: { talentSlug: v.string(), limit: v.optional(v.number()) },
  handler: async ({ db }, { talentSlug, limit = 96 }) =>
    db.query("works").withIndex("by_talentSlug", q => q.eq("talentSlug", talentSlug)).order("desc").take(limit),
});

export const getWorkBySlug = query({
  args: { talentSlug: v.string(), slug: v.string() },
  handler: async ({ db }, { talentSlug, slug }) =>
    db.query("works").withIndex("by_talent_and_slug", q => q.eq("talentSlug", talentSlug).eq("slug", slug)).unique(),
});

export const upsertTalent = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    bio: v.optional(v.string()),
    portraitUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async ({ db }, args) => {
    const existing = await db.query("talents").withIndex("by_nameLower", q => q.eq("nameLower", args.name.toLowerCase())).unique();
    const payload = { ...args, nameLower: args.name.toLowerCase(), createdAt: Date.now() };
    if (existing) { await db.patch(existing._id, payload); return existing._id; }
    return db.insert("talents", payload);
  },
});

export const createWork = mutation({
  args: {
    talentSlug: v.string(),
    slug: v.string(),
    title: v.string(),
    type: v.string(), // "photo" | "writing" | "performance" | "video" | "other"
    description: v.optional(v.string()),
    coverPublicId: v.optional(v.string()),
    date: v.optional(v.string()),
    credits: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async ({ db }, args) => db.insert("works", { ...args }),
});

export const attachCloudinaryPublicId = mutation({
  args: { talentSlug: v.string(), workSlug: v.string(), publicId: v.string() },
  handler: async ({ db }, { talentSlug, workSlug, publicId }) => {
    const work = await db
      .query("works")
      .withIndex("by_talent_and_slug", q => q.eq("talentSlug", talentSlug).eq("slug", workSlug))
      .unique();
    if (!work) throw new Error("Work not found");
    await db.patch(work._id, { coverPublicId: publicId });
    return work._id;
  },
});

// List all works (for admin)
export const listAllWorks = query({
  args: { limit: v.optional(v.number()) },
  handler: async ({ db }, { limit = 500 }) => {
    return await db.query("works").order("desc").take(limit);
  },
});

// Delete work (admin only)
export const deleteWork = mutation({
  args: { id: v.id("works") },
  handler: async (ctx, { id }) => {
    // Check admin status
    const admin = await ctx.runQuery(api.admin.isAdmin, {});
    if (!admin) throw new Error("Not admin");
    await ctx.db.delete(id);
  },
});

// Update work (admin only)
export const updateWork = mutation({
  args: {
    id: v.id("works"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    coverPublicId: v.optional(v.string()),
    date: v.optional(v.string()),
    credits: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check admin status
    const admin = await ctx.runQuery(api.admin.isAdmin, {});
    if (!admin) throw new Error("Not admin");
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});