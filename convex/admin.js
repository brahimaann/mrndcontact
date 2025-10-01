import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function normalizeEmail(x) {
  return (x ?? "").trim().toLowerCase();
}
function normalizePhone(x) {
  return (x ?? "").trim(); // expect E.164, e.g. +16125551234
}

/** Check if the current user is an admin. */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) return false;

    const emails = ident.email ? [normalizeEmail(ident.email)] : [];
    const phone = ident.phoneNumber ? [normalizePhone(ident.phoneNumber)] : [];

    for (const e of emails) {
      const hit = await ctx.db
        .query("admin_users")
        .withIndex("by_value_type", (q) => q.eq("value", e).eq("type", "EMAIL"))
        .first();
      if (hit) return true;
    }
    for (const p of phone) {
      const hit = await ctx.db
        .query("admin_users")
        .withIndex("by_value_type", (q) => q.eq("value", p).eq("type", "PHONE"))
        .first();
      if (hit) return true;
    }
    return false;
  },
});

/** List all allowed identifiers (optionally filtered by type). */
export const listAllowed = query({
  args: { type: v.optional(v.union(v.literal("EMAIL"), v.literal("PHONE"))) },
  handler: async (ctx, args) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");

    const all = await ctx.db.query("allowed_identifiers").collect();
    return args.type ? all.filter(i => i.type === args.type) : all;
  },
});

/** Add or update an allowed identifier. */
export const upsertAllowed = mutation({
  args: {
    type: v.union(v.literal("EMAIL"), v.literal("PHONE")),
    value: v.string(),
    allowed: v.boolean(),
  },
  handler: async (ctx, { type, value, allowed }) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");

    const now = Date.now();
    const vNorm = type === "EMAIL" ? normalizeEmail(value) : normalizePhone(value);

    const existing = await ctx.db
      .query("allowed_identifiers")
      .withIndex("by_value_type", (q) => q.eq("value", vNorm).eq("type", type))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { allowed, updatedAt: now });
      return existing._id;
    } else {
      return await ctx.db.insert("allowed_identifiers", {
        type,
        value: vNorm,
        allowed,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/** Toggle allowed flag. */
export const toggleAllowed = mutation({
  args: { id: v.id("allowed_identifiers") },
  handler: async (ctx, { id }) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");

    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(id, { allowed: !row.allowed, updatedAt: Date.now() });
  },
});

/** Remove identifier. */
export const removeAllowed = mutation({
  args: { id: v.id("allowed_identifiers") },
  handler: async (ctx, { id }) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");
    await ctx.db.delete(id);
  },
});

/** Admins list controls (optional, handy to seed via UI) */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");
    return await ctx.db.query("admin_users").collect();
  },
});

export const addAdmin = mutation({
  args: { type: v.union(v.literal("EMAIL"), v.literal("PHONE")), value: v.string() },
  handler: async (ctx, { type, value }) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");
    const vNorm = type === "EMAIL" ? normalizeEmail(value) : normalizePhone(value);
    const existing = await ctx.db
      .query("admin_users")
      .withIndex("by_value_type", (q) => q.eq("value", vNorm).eq("type", type))
      .first();
    if (!existing) {
      await ctx.db.insert("admin_users", { type, value: vNorm, createdAt: Date.now() });
    }
  },
});

export const removeAdmin = mutation({
  args: { id: v.id("admin_users") },
  handler: async (ctx, { id }) => {
    const admin = await ctx.runQuery(isAdmin, {});
    if (!admin) throw new Error("Not admin");
    await ctx.db.delete(id);
  },
});
