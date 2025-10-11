import { mutation } from "./_generated/server";

// tiny slugifier (keeps it human, safe, and deterministic)
function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const backfillTalentSlugs = mutation({
  args: {},
  handler: async ({ db }) => {
    const talents = await db.query("talents").collect();
    let updates = 0;

    // helper to ensure uniqueness
    async function uniqueSlug(base) {
      let candidate = base || "untitled";
      let n = 1;
      // use the by_slug index to check collisions quickly
      // NOTE: some existing docs may still have undefined slug; skip those
      // and only treat exact equality as a collision.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const hit = await db.query("talents").withIndex("by_slug", q => q.eq("slug", candidate)).unique();
        if (!hit) return candidate;
        n += 1;
        candidate = `${base}-${n}`;
      }
    }

    for (const t of talents) {
      if (!t.slug) {
        const base = slugify(t.name || t.nameLower || "");
        const slug = await uniqueSlug(base || "artist");
        await db.patch(t._id, {
          slug,
          nameLower: (t.name || "").toLowerCase(),
          createdAt: t.createdAt ?? Date.now(),
        });
        updates += 1;
      }
    }
    return { updated: updates };
  },
});
