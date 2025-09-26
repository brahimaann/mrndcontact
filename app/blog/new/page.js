"use client";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const router = useRouter();
  const createPost = useMutation(api.posts.createPost);
  const initializeAlias = useMutation(api.admins.initializeAlias);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [firstTime, setFirstTime] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("blog_alias");
    if (saved) setAlias(saved);
  }, []);

  async function onPublish(e) {
    e.preventDefault();
    try {
      const res = await createPost({ title, body, alias, password });
      localStorage.setItem("blog_alias", alias);
      router.push(`/blog/${res.slug}`);
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes("not_initialized")) setFirstTime(true);
      else alert(msg);
    }
  }

  async function onInitialize(e) {
    e.preventDefault();
    try {
      await initializeAlias({
        email: undefined,                 // optional: collect if you created by email
        alias,
        defaultPassword: password,        // their default one-time password
        newPassword,                      // their new private password
      });
      localStorage.setItem("blog_alias", alias);
      setFirstTime(false);
      alert("Alias initialized. You can now publish.");
    } catch (err) {
      alert(err?.message || String(err));
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create a Post</h1>

      {!firstTime ? (
        <form className="space-y-4" onSubmit={onPublish}>
          <div>
            <label className="block text-sm">Title</label>
            <input className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm">Body</label>
            <textarea className="w-full border p-2 rounded min-h-[180px]" value={body} onChange={e => setBody(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Alias</label>
              <input className="w-full border p-2 rounded" value={alias} onChange={e => setAlias(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button className="px-4 py-2 rounded bg-black text-white">Publish</button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onInitialize}>
          <p className="text-sm">First time with this admin? Set your alias and new password.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Desired Alias</label>
              <input className="w-full border p-2 rounded" value={alias} onChange={e => setAlias(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm">Default Password</label>
              <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm">New Private Password</label>
            <input type="password" className="w-full border p-2 rounded" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button className="px-4 py-2 rounded bg-black text-white">Initialize & Continue</button>
        </form>
      )}
    </main>
  );
}
