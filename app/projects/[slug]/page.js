"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Replies from "./replies.client";

export default function ProjectDetail({ params }) {
  const { slug } = params;
  const post = useQuery(api.posts.getPostBySlug, { slug });
  const loading = post === undefined;

  // replies only after we know the postId
  const replies = useQuery(
    post ? api.posts.listReplies : undefined,
    post ? { postId: post._id, limit: 300 } : undefined
  ) ?? [];

  const created = useMemo(
    () => (post ? new Date(post.createdAt).toLocaleString() : ""),
    [post]
  );

  return (
    <main className="hacker relative max-w-5xl mx-auto p-6">
      <div className="scanlines" />

      <div className="mb-6 flex items-center justify-between">
        <Link href="/projects" className="underline">← Back</Link>
        <Link href="/projects/new" className="underline">+ New Project</Link>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {!loading && !post && <p className="muted">Not found.</p>}

      {post && (
        <article className="grid md:grid-cols-2 gap-6 items-start">
          {/* Original post - left */}
          <div className="card">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="muted text-sm mt-1">
              by <span className="font-mono">{post.alias}</span> • {created}
            </p>
            <p className="mt-4 whitespace-pre-wrap">{post.body}</p>
          </div>

          {/* Replies - right */}
          <div>
            <Replies postId={post._id} replies={replies} />
          </div>
        </article>
      )}
    </main>
  );
}
