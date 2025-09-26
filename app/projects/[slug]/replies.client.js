"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Replies({ postId, replies }) {
  const createReply = useMutation(api.posts.createReply);
  const [form, set] = useState({ body: "", name: "", contact: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => set({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createReply({ postId, ...form });
      set({ body: "", name: "", contact: "" });
    } catch (err) {
      setError(err?.message || "Failed to reply.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Replies</h2>

      <ul className="space-y-3">
        {replies.map((r) => (
          <li key={r._id} className="card">
            <div className="flex items-start justify-between gap-4">
              <p className="whitespace-pre-wrap">{r.body}</p>
              <span className="muted text-xs whitespace-nowrap">
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="muted text-sm mt-1">
              {r.name ? <span className="font-mono">{r.name}</span> : <em className="muted">anonymous</em>}
              {r.contact ? <> • {r.contact}</> : null}
            </p>
          </li>
        ))}
        {replies.length === 0 && (
          <li className="muted">No replies yet — be the first.</li>
        )}
      </ul>

      <form onSubmit={onSubmit} className="card space-y-3">
        <textarea
          name="body"
          value={form.body}
          onChange={onChange}
          placeholder="Offer suggestions or collaboration…"
          className="w-full border px-3 py-2 rounded min-h-[120px]"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your name/alias (optional)"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="contact"
            value={form.contact}
            onChange={onChange}
            placeholder="Contact (optional)"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className="border px-4 py-2 rounded">
          {busy ? "Posting…" : "Reply"}
        </button>
      </form>
    </section>
  );
}
