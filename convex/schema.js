import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─────────────────────────────
  // Auth / Users (Clerk)
  // ─────────────────────────────
  users: defineTable({
    // Clerk user id (a.k.a. subject)
    clerkId: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    displayName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    // roles: 0 = public, 1 = member, 2 = core/admin
    role: v.optional(v.number()),
    // misc
    lastSeenAt: v.optional(v.float64()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // optional allow/deny list for sign-in gates (email or phone)
  allowed_identifiers: defineTable({
    type: v.union(v.literal("EMAIL"), v.literal("PHONE")),
    value: v.string(), // lowercased email or E.164 phone
    allowed: v.boolean(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_value_type", ["value", "type"]),

  // lightweight admins table (e.g. for Ops to grant admin without editing users)
  admin_users: defineTable({
    type: v.union(v.literal("EMAIL"), v.literal("PHONE")),
    value: v.string(), // lowercased email or E.164 phone
    createdAt: v.float64(),
  }).index("by_value_type", ["value", "type"]),

  user_profiles: defineTable({
    userId: v.string(), // Clerk id again (simple join)
    name: v.string(),
    alias: v.optional(v.string()),
    instagram: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_userId", ["userId"]),

  // ─────────────────────────────
  // Content
  // ─────────────────────────────
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorAlias: v.string(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    slug: v.string(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"]),

  replies: defineTable({
    postId: v.id("posts"),
    body: v.string(),
    kind: v.optional(v.string()), // "suggestion" | "assist" | "collab" | "comment"
    name: v.optional(v.string()),
    contact: v.optional(v.string()),
    fromAlias: v.optional(v.string()),
    isAdmin: v.boolean(),
    createdAt: v.float64(),
  }).index("by_postId_createdAt", ["postId", "createdAt"]),

  // ─────────────────────────────
  // Events / Calendar
  // ─────────────────────────────
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    start: v.float64(),   // ms since epoch (Date.getTime())
    end: v.float64(),     // ms since epoch
    allDay: v.optional(v.boolean()),
    authorAlias: v.optional(v.string()),
    slug: v.string(),     // stable unique slug/id
    createdAt: v.float64(),
    updatedAt: v.float64(),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_time", ["start"])
    .index("by_slug", ["slug"]),

  // ─────────────────────────────
  // Media
  // ─────────────────────────────
  media: defineTable({
    ownerUserId: v.id("users"),
    artistId: v.optional(v.string()),
    title: v.string(),
    kind: v.union(v.literal("image"), v.literal("video"), v.literal("audio")),
    mimeType: v.string(),
    fileId: v.id("_storage"),
    visibility: v.union(v.literal("public"), v.literal("members"), v.literal("core")),
    createdAt: v.float64(),
  })
    .index("by_owner", ["ownerUserId"])
    .index("by_artist", ["artistId"]),

  // ─────────────────────────────
  // Talents & Works (portfolio)
  // ─────────────────────────────
talents: defineTable({
  // Make slug optional until backfill runs
  slug: v.optional(v.string()),

  // Required core field
  name: v.string(),

  // Your previously used/legacy fields — optional so existing docs validate
  nameLower: v.optional(v.string()),
  createdAt: v.optional(v.float64()),
  updatedAt: v.optional(v.float64()),

  // Profile-style extras present in old docs
  cityState: v.optional(v.string()),
  focus: v.optional(v.string()),
  igHandle: v.optional(v.string()),
  status: v.optional(v.string()),
  createdBy: v.optional(v.string()),

  // Existing fields you already used
  bio: v.optional(v.string()),
  portraitUrl: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
})
  .index("by_name", ["name"])
  .index("by_nameLower", ["nameLower"])
  .index("by_createdAt", ["createdAt"])
  .index("by_slug", ["slug"]),


  works: defineTable({
    slug: v.string(),          // unique within artist/talent
    talentSlug: v.string(),    // FK -> talents.slug
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("photo"),
      v.literal("writing"),
      v.literal("performance"),
      v.literal("video"),
      v.literal("other")
    ),
    coverPublicId: v.optional(v.string()),             // Cloudinary publicId
    media: v.optional(v.array(v.object({ url: v.string(), kind: v.string() }))),
    date: v.optional(v.string()),
    credits: v.optional(v.array(v.string())),
    metadata: v.optional(v.any()),                     // e.g. { youtubeId }
  })
    .index("by_talentSlug", ["talentSlug"])
    .index("by_type", ["type"])
    .index("by_talent_and_slug", ["talentSlug", "slug"]),
});
