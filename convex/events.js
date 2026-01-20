import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Create / Update
export const upsertEvent = mutation({
  args: {
    slug: v.string(), // stable id (e.g. nanoid)
    title: v.string(),
    description: v.optional(v.string()),
    start: v.float64(),
    end: v.float64(),
    allDay: v.optional(v.boolean()),
    authorAlias: v.optional(v.string()),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async ({ db }, args) => {
    const existing = await db.query("events").withIndex("by_slug", q => q.eq("slug", args.slug)).unique();
    const payload = { ...args, updatedAt: Date.now(), createdAt: existing?.createdAt ?? Date.now() };
    if (existing) { await db.patch(existing._id, payload); return existing._id; }
    return await db.insert("events", payload);
  },
});

// Read: events overlapping a time range (for calendar views)
export const listInRange = query({
  args: { start: v.float64(), end: v.float64(), limit: v.optional(v.number()) },
  handler: async ({ db }, { start, end, limit = 500 }) => {
    // Use by_time index and filter overlap window
    const afterStart = await db
      .query("events")
      .withIndex("by_time", q => q.gte("start", start - 1000 * 60 * 60 * 24)) // small prefetch window
      .order("asc")
      .take(limit);

    return afterStart.filter(e => e.end >= start && e.start <= end);
  },
});

// Alias for calendar compatibility
export const listEvents = query({
  args: { from: v.optional(v.float64()), to: v.optional(v.float64()), limit: v.optional(v.number()) },
  handler: async ({ db }, { from, to, limit = 1000 }) => {
    if (from && to) {
      // Use by_time index and filter overlap window
      const afterStart = await db
        .query("events")
        .withIndex("by_time", q => q.gte("start", from - 1000 * 60 * 60 * 24))
        .order("asc")
        .take(limit ?? 1000);
      return afterStart.filter(e => e.end >= from && e.start <= to);
    }
    // If no range, return all events
    return await db.query("events").withIndex("by_time").order("asc").take(limit ?? 1000);
  },
});

// List all events (for admin)
export const listAllEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async ({ db }, { limit = 500 }) => {
    return await db.query("events").withIndex("by_time").order("desc").take(limit);
  },
});

// Delete event (admin only)
export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    // Check admin status
    const admin = await ctx.runQuery(api.admin.isAdmin, {});
    if (!admin) throw new Error("Not admin");
    await ctx.db.delete(id);
  },
});

// Update event (admin only)
export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    start: v.optional(v.float64()),
    end: v.optional(v.float64()),
    allDay: v.optional(v.boolean()),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check admin status
    const admin = await ctx.runQuery(api.admin.isAdmin, {});
    if (!admin) throw new Error("Not admin");
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return id;
  },
});

// Create event (for calendar compatibility - uses code for auth)
export const createEvent = mutation({
  args: {
    code: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    start: v.float64(),
    end: v.float64(),
    allDay: v.optional(v.boolean()),
    alias: v.optional(v.string()),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async ({ db }, args) => {
    // Generate slug from title + timestamp
    const slug = `${args.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    return await db.insert("events", {
      slug,
      title: args.title,
      description: args.description,
      start: args.start,
      end: args.end,
      allDay: args.allDay,
      authorAlias: args.alias,
      location: args.location,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});