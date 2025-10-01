"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function SetupPage() {
  const router = useRouter();
  const save = useMutation(api.profile.upsertMyProfile);

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [instagram, setInstagram] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    let ig = instagram.trim();
    if (ig.startsWith("@")) ig = ig.slice(1);
    const m = ig.match(/instagram\.com\/([^/?#]+)/i);
    if (m) ig = m[1];

    await save({ name: name.trim(), alias: alias.trim() || undefined, instagram: ig || undefined });
    router.replace("/");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto mt-10 space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
      <h2 className="text-xl font-semibold">Set up your profile</h2>

      <label className="block">
        <span className="text-sm text-white/80">Name</span>
        <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2"/>
      </label>

      <label className="block">
        <span className="text-sm text-white/80">Alias (optional)</span>
        <input value={alias} onChange={(e)=>setAlias(e.target.value)} className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2"/>
      </label>

      <label className="block">
        <span className="text-sm text-white/80">Instagram (handle or URL)</span>
        <input value={instagram} onChange={(e)=>setInstagram(e.target.value)} className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2" placeholder="@yourhandle or https://instagram.com/yourhandle"/>
      </label>

      <button type="submit" className="mt-3 px-6 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition">
        Save & Continue
      </button>
    </form>
  );
}
