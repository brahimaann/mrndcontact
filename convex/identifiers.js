import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/** Get whether the authed user is allow-listed and whether they have a profile. */
export const checkMe = query({
  args: {},
  handler: async (ctx) => {
    const ident = await ctx.auth.getUserIdentity();
    if (!ident) return { signedIn: false, allowed: false, hasProfile: false };

    // Collect candidate identifiers
    const emails = (ident.email ? [ident.email.toLowerCase()] : []);
    const phone = ident.phoneNumber ? [ident.phoneNumber] : [];

    let allowed = false;
    for (const e of emails) {
      const row = await ctx.db
        .query("allowed_identifiers")
        .withIndex("by_value_type", (q) => q.eq("value", e).eq("type", "EMAIL"))
        .first();
      if (row?.allowed) { allowed = true; break; }
    }
    if (!allowed) {
      for (const p of phone) {
        const row = await ctx.db
          .query("allowed_identifiers")
          .withIndex("by_value_type", (q) => q.eq("value", p).eq("type", "PHONE"))
          .first();
        if (row?.allowed) { allowed = true; break; }
      }
    }

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ident.subject))
      .first();

    return {
      signedIn: true,
      allowed,
      hasProfile: Boolean(profile),
    };
  },
});
