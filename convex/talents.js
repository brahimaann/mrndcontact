// convex/talents.js
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// --- helpers
async function assertAdmin(ctx) {
  const ok = await ctx.runQuery(api.admin.isAdmin, {}); // this is a function reference
  if (!ok) throw new Error("Not admin");
}

// ---------- Mutations ----------

// createTalent (required: name, cityState)
export const createTalent = mutation({
  args: {
    name: v.string(),
    cityState: v.string(),
    igHandle: v.optional(v.string()),
    focus: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();
    const id = await ctx.db.insert("talents", {
      name: args.name,
      nameLower: args.name.toLowerCase(),
      cityState: args.cityState,
      igHandle: args.igHandle,
      focus: args.focus,
      status: args.status,
      createdAt: now,
      updatedAt: now,
      createdBy: identity?.subject ?? undefined,
    });
    return id;
  },
});

// updateTalent (by id; any field)
export const updateTalent = mutation({
  args: {
    id: v.id("talents"),
    name: v.optional(v.string()),
    cityState: v.optional(v.string()),
    igHandle: v.optional(v.string()),
    focus: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await assertAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Talent not found");

    const update = { updatedAt: Date.now() };
    if (patch.name !== undefined) {
      update.name = patch.name;
      update.nameLower = patch.name.toLowerCase();
    }
    if (patch.cityState !== undefined) update.cityState = patch.cityState;
    if (patch.igHandle !== undefined) update.igHandle = patch.igHandle;
    if (patch.focus !== undefined) update.focus = patch.focus;
    if (patch.status !== undefined) update.status = patch.status;

    await ctx.db.patch(id, update);
    return { ok: true };
  },
});

// deleteTalent (by id)
export const deleteTalent = mutation({
  args: { id: v.id("talents") },
  handler: async (ctx, { id }) => {
    await assertAdmin(ctx);
    await ctx.db.delete(id);
    return { ok: true };
  },
});

// ---------- Queries ----------

// listTalents — paginated, sorted by name (25 default)
export const listTalents = query({
  args: {
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, pageSize }) => {
    const PAGE = pageSize ?? 25;
    const q = ctx.db.query("talents").withIndex("by_name").order("asc");
    const page = await q.paginate({ cursor, numItems: PAGE });
    return {
      ...page,
      page: page.page.map((doc) => ({ _id: doc._id, name: doc.name })),
    };
  },
});

// searchTalents — case-insensitive prefix search on name
export const searchTalents = query({
  args: {
    term: v.string(),
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, { term, cursor, pageSize }) => {
    const PAGE = pageSize ?? 25;
    const t = term.trim().toLowerCase();
    const q = ctx
      .db
      .query("talents")
      .withIndex("by_nameLower", (q2) => q2.gte("nameLower", t))
      .order("asc");
    const page = await q.paginate({ cursor, numItems: PAGE });

    const filtered = page.page.filter((d) => d.nameLower.startsWith(t));
    return {
      ...page,
      page: filtered.map((doc) => ({ _id: doc._id, name: doc.name })),
    };
  },
});

// getTalentById — full document
export const getTalentById = query({
  args: { id: v.id("talents") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    return doc ?? null;
  },
});
