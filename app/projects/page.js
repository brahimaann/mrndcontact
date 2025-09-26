"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProjectsList() {
  const posts = useQuery(api.posts.listPosts, { limit: 100 }) ?? [];

  return (
    <main className="hacker relative max-w-5xl mx-auto p-6 space-y-6">
      <div className="scanlines" />
      <Link href="/" className="underline">{'< Back'}</Link>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">Projects</h1>
        <Link href="/projects/new" className="underline">+ New Project</Link>
      </header>

      {posts.length === 0 && (
        <p className="muted">No projects yet. Be the first to post.</p>
      )}

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p._id} className="card">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold">
                <Link href={`/projects/${p.slug}`} className="underline">{p.title}</Link>
              </h2>
              <span className="muted text-sm whitespace-nowrap">
                {new Date(p.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="muted text-sm mt-1">
              by <span className="font-mono">{p.authorAlias}</span>
            </p>
            {p.body && (
              <p className="mt-3">
                {p.body.length > 220 ? p.body.slice(0, 220) + "…" : p.body}
              </p>
            )}
            <div className="mt-3">
              <Link href={`/projects/${p.slug}`} className="underline">View</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
