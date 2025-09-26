"use client";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

export default function UserPage() {
  return (
    <>
      <SignedOut><div className="p-6">Please sign in.</div></SignedOut>
      <SignedIn><Dashboard /></SignedIn>
    </>
  );
}

function Dashboard() {
  const { user } = useUser();
  const ensureUser = useMutation(api.users.ensureUser);
  const myMedia = useQuery(api.media.listMyMedia) ?? [];
  const getFileUrl = useAction(api.media.getFileUrl);

  useEffect(() => {
    if (user) ensureUser({ displayName: user.fullName || user.username || "Member" });
  }, [user, ensureUser]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Your Space</h1>
      <UploadWidget />
      <section>
        <h2 className="text-xl font-semibold mb-3">Your Uploads</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {myMedia.map((m) => <MediaCard key={m._id} m={m} getFileUrl={getFileUrl} />)}
        </ul>
      </section>
    </div>
  );
}

function UploadWidget() {
  const genUrl = useAction(api.media.generateUploadUrl);
  const save = useMutation(api.media.saveMediaRecord);
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPending(true);
    try {
      const url = await genUrl();
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": f.type }, body: f });
      const { storageId } = await r.json();
      const kind = f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : "audio";
      await save({ storageId, title: title || f.name, kind, mimeType: f.type, visibility });
      setTitle("");
      e.target.value = "";
    } finally { setPending(false); }
  };

  return (
    <div className="rounded-xl border border-white/15 p-4 bg-black/30">
      <h3 className="font-medium mb-2">Upload song / snippet / look</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <input className="px-3 py-2 rounded bg-transparent border border-white/20"
               placeholder="Title (optional)" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <select className="px-3 py-2 rounded bg-transparent border border-white/20"
                value={visibility} onChange={(e)=>setVisibility(e.target.value)}>
          <option value="public">Public</option>
          <option value="members">Members</option>
          <option value="core">Core</option>
        </select>
        <label className="px-3 py-2 rounded border border-white/20 cursor-pointer hover:bg-white/10">
          {pending ? "Uploading..." : "Choose file"}
          <input type="file" hidden accept="image/*,video/*,audio/*" onChange={onPick} />
        </label>
      </div>
    </div>
  );
}

function MediaCard({ m, getFileUrl }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { (async () => setUrl(await getFileUrl({ storageId: m.fileId })))(); }, [m.fileId, getFileUrl]);
  return (
    <li className="p-3 rounded-xl border border-white/15 bg-black/30">
      <div className="text-xs opacity-70 mb-1">{m.kind.toUpperCase()} • {m.visibility}</div>
      <div className="font-medium mb-2">{m.title}</div>
      <div className="aspect-video grid place-items-center bg-white/5 rounded">
        {url ? (m.kind==="image" ? <img src={url} alt={m.title} className="object-cover h-full w-full rounded" />
              : m.kind==="video" ? <video controls src={url} className="h-full w-full rounded" />
              : <audio controls src={url} className="w-full" />)
             : <span className="text-sm opacity-60">Loading…</span>}
      </div>
    </li>
  );
}
