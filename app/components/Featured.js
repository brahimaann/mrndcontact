"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Featured() {
  const posts = useQuery(api.posts.latest, { limit: 3 }) ?? [];
  return (
    <section id="projects" className="section">
      <SectionLabel>Featured</SectionLabel>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(p => <FeaturedCard key={p._id} post={p} />)}
      </div>
    </section>
  );
}

function FeaturedCard({ post }) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "";
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20">
      <div className="aspect-video w-full overflow-hidden bg-black/20">
        {/* replace with real cover image if you add one later */}
        <div className="flex h-full items-center justify-center text-xs text-white/60">
          16:9 cover
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/60">
          Project
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-medium">{post.title}</h3>
        <p className="mt-2 text-sm text-white/70">{date}</p>
        <a href={`/posts/${post.slug}`} className="mt-3 inline-block text-sm hover:underline">
          View →
        </a>
      </div>
    </article>
  );
}

export function SectionLabel({ children }) {
  return (
    <p className="mb-6 text-xs uppercase tracking-[0.18em] text-white/60">
      {children}
    </p>
  );
}
