import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Upsert a user from Clerk data (call on sign-in or via Clerk webhook)
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    displayName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    const existing = await db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", args.clerkId)).unique();
    const payload = { ...args, lastSeenAt: Date.now() };
    if (existing) {
      await db.patch(existing._id, payload);
      return existing._id;
    }
    const id = await db.insert("users", payload);
    return id;
  },
});

// Who am I?
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async ({ db }, { clerkId }) => {
    return await db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", clerkId)).unique();
  },
});

// Is this Clerk identity an admin?
export const isAdmin = query({
  args: { email: v.optional(v.string()), phone: v.optional(v.string()), clerkId: v.optional(v.string()) },
  handler: async ({ db }, { email, phone, clerkId }) => {
    // 1) role >= 2 in users
    if (clerkId) {
      const u = await db.query("users").withIndex("by_clerkId", q => q.eq("clerkId", clerkId)).unique();
      if (u?.role && u.role >= 2) return true;
    }
    // 2) explicit admin_users allowlist
    const checks = [];
    if (email) checks.push(db.query("admin_users").withIndex("by_value_type", q => q.eq("value", email.toLowerCase()).eq("type", "EMAIL")).unique());
    if (phone) checks.push(db.query("admin_users").withIndex("by_value_type", q => q.eq("value", phone).eq("type", "PHONE")).unique());
    const results = await Promise.all(checks);
    return results.some(Boolean);
  },
});

// Gatekeeper: is identifier allowed to sign in?
export const isAllowedIdentifier = query({
  args: { type: v.union(v.literal("EMAIL"), v.literal("PHONE")), value: v.string() },
  handler: async ({ db }, { type, value }) => {
    const rec = await db.query("allowed_identifiers").withIndex("by_value_type", q => q.eq("value", value.toLowerCase?.() ?? value).eq("type", type)).unique();
    return rec?.allowed ?? true; // default allow unless you want default deny
  },
});
