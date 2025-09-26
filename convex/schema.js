import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorAlias: v.string(),               // immutable signature
    createdAt: v.number(),
    updatedAt: v.number(),
    slug: v.string(),                      // simple slug from title + short id
  }).index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"]),

 replies: defineTable({
    postId: v.id("posts"),
    body: v.string(),
    kind: v.optional(v.string()),     // "suggestion" | "assist" | "collab" | "comment"
    // public user fields:
    name: v.optional(v.string()),
    contact: v.optional(v.string()),
    // admin signature (if an admin replies):
    fromAlias: v.optional(v.string()),
    isAdmin: v.boolean(),
    createdAt: v.number(),
  })
  .index("by_postId_createdAt", ["postId", "createdAt"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    start: v.float64(),        // JS Date.getTime() (ms)
    end: v.float64(),          // JS Date.getTime() (ms)
    allDay: v.optional(v.boolean()),
    authorAlias: v.optional(v.string()),
    slug: v.string(),          // stable unique slug/id
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_time", ["start"])
    .index("by_slug", ["slug"]),

    users: defineTable({
    clerkId: v.string(),
    role: v.number(), // 0 public, 1 member, 2 core
    displayName: v.string(),
    artistId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  media: defineTable({
    ownerUserId: v.id("users"),
    artistId: v.optional(v.string()),
    title: v.string(),
    kind: v.union(v.literal("image"), v.literal("video"), v.literal("audio")),
    mimeType: v.string(),
    fileId: v.id("_storage"),
    visibility: v.union(v.literal("public"), v.literal("members"), v.literal("core")),
    createdAt: v.number(),
  }).index("by_owner", ["ownerUserId"]).index("by_artist", ["artistId"]),
});
