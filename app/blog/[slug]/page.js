import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const post = await fetchQuery(api.posts.getPostBySlug, { slug: params.slug });
  if (!post) return notFound();
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="text-sm opacity-70">
        by {post.authorAlias} • {new Date(post.createdAt).toLocaleString()}
      </div>
      <br></br>
      <article className="prose whitespace-pre-wrap">{post.body}</article>
    </main>
  );
}
