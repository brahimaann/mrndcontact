import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
