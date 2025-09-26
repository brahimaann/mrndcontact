// convex/events.js
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple, hard-coded gate for creation.
// You can change this or move to a Convex env var later.
const ACCESS_CODE = "13647";

function slugify(input) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base || "event"}-${rand}`;
}

/** List events within an optional time window (ms since epoch) */
export const listEvents = query({
  args: {
    from: v.optional(v.float64()),
    to: v.optional(v.float64()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { from, to, limit }) => {
    let q = ctx.db.query("events").withIndex("by_time");
    if (from != null) q = q.filter((q2) => q2.gte(q2.field("start"), from));
    if (to != null) q = q.filter((q2) => q2.lte(q2.field("start"), to));
    const rows = await q.order("asc").take(limit ?? 500);
    return rows;
  },
});

/** Create a new event (access-code gated) */
export const createEvent = mutation({
  args: {
    code: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    start: v.float64(),
    end: v.float64(),
    allDay: v.optional(v.boolean()),
    alias: v.optional(v.string()),
  },
  handler: async (ctx, { code, title, description, start, end, allDay, alias }) => {
    if (code !== ACCESS_CODE) {
      throw new Error("Invalid access code.");
    }
    if (!(end >= start)) {
      throw new Error("End time must be after start time.");
    }

    const now = Date.now();
    const slug = slugify(title);

    const id = await ctx.db.insert("events", {
      title,
      description,
      start,
      end,
      allDay: allDay ?? false,
      authorAlias: alias,
      slug,
      createdAt: now,
      updatedAt: now,
    });

    return { _id: id, slug };
  },
});

/** (Optional) Update an event (also code-gated) */
export const updateEvent = mutation({
  args: {
    code: v.string(),
    id: v.id("events"),
    patch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      start: v.optional(v.float64()),
      end: v.optional(v.float64()),
      allDay: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { code, id, patch }) => {
    if (code !== ACCESS_CODE) throw new Error("Invalid access code.");
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Event not found.");
    if (patch.start != null && patch.end != null && patch.end < patch.start) {
      throw new Error("End time must be after start time.");
    }
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
    return { ok: true };
  },
});

/** (Optional) Delete an event (also code-gated) */
export const deleteEvent = mutation({
  args: { code: v.string(), id: v.id("events") },
  handler: async (ctx, { code, id }) => {
    if (code !== ACCESS_CODE) throw new Error("Invalid access code.");
    await ctx.db.delete(id);
    return { ok: true };
  },
});
