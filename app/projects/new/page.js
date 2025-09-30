"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function NewProjectPage() {
  const createPost = useMutation(api.posts.createPost);
  const router = useRouter();

  const [form, set] = useState({ title: "", body: "", alias: "", code: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => set({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { slug } = await createPost(form);
      router.push(`/projects/${slug}`);
    } catch (err) {
      setError(err?.message === "invalid_code" ? "Wrong secret code." : (err?.message || "Failed to publish."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative max-w-3xl mx-auto p-6">
      <div className="scanlines" />
      <h1 className="text-2xl font-bold">New Project</h1>
      <p className="muted text-sm mt-1">Anyone with the secret code can post.</p>

      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="body"
          value={form.body}
          onChange={onChange}
          placeholder="Describe the project…"
          className="w-full border px-3 py-2 rounded min-h-[180px]"
          required
        />
        <input
          name="signature"
          value={form.alias}
          onChange={onChange}
          placeholder="Your signature"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="code"
          value={form.code}
          onChange={onChange}
          placeholder="Secret code"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="border px-4 py-2 rounded"
        >
          {busy ? "Publishing…" : "Publish"}
        </button>
      </form>
    </main>
  );
}
