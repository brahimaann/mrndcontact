"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const router = useRouter();
  const current = useQuery(api.profile.getMyProfile, {});
  const save = useMutation(api.profile.upsertMyProfile);
  const { user } = useUser();
  const isAdmin = useQuery(api.admin.isAdmin, user ? {} : "skip");

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    if (current) {
      setName(current.name ?? "");
      setAlias(current.alias ?? "");
      setInstagram(current.instagram ?? "");
    }
  }, [current]);

  async function onSubmit(e) {
    e.preventDefault();
    let ig = instagram.trim();
    if (ig.startsWith("@")) ig = ig.slice(1);
    const m = ig.match(/instagram\.com\/([^/?#]+)/i);
    if (m) ig = m[1];

    await save({
      name: name.trim(),
      alias: alias.trim() || undefined,
      instagram: ig || undefined,
    });
    router.replace("/");
  }

  if (current === undefined) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="font-mono text-white/70">Loading secure profile…</span>
      </div>
    );
  }

  const codename =
    (alias && alias.trim()) ||
    current?.alias ||
    user?.username ||
    (user?.firstName ? `${user.firstName}` : "AGENT");

  return (
    <main className="relative max-w-3xl mx-auto px-4 pb-16 pt-8">
      {/* scanline + corner frame */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.6),transparent_80%)]">
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_bottom,transparent_6px,rgba(255,255,255,.3)_7px,transparent_8px)] bg-[length:100%_8px] animate-[scan_12s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-white/15 rounded-2xl"></div>
      </div>

      {/* Top bar: back + title + status */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 hover:bg-white hover:text-black transition"
          aria-label="Go back"
          title="Go back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-mono text-sm">BACK</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="px-2 py-1 ml-[1rem] text-[11px] rounded bg-white/10 font-mono tracking-widest">
            ACCESS:{' '}
            {isAdmin ? "ADMIN" : "USER"}
          </span>
          <span className="px-2 py-1 text-[11px] rounded bg-white/10 font-mono tracking-widest">
            CLEARANCE:{' '}
            {isAdmin ? "ACTIVE" : "AUTHORIZED"}
          </span>
        </div>
      </div>

      {/* Header card */}
      <section className="relative border border-white/15 bg-white/[0.05] rounded-2xl p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">
              PROFILE // <span className="chip chip--invert">{codename}</span>
            </h1>
            <p className="mt-1 text-white/70 font-mono text-sm">
              Identity record linked to Clerk ID • Edits are audited.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-white/20 p-2">
            {/* silhouette / avatar */}
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ) : (
              <div className="h-12 w-12 grid place-items-center rounded-lg bg-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="opacity-80">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Form panel */}
      <form
        onSubmit={onSubmit}
        className="mt-6 border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* panel header */}
        <div className="px-5 py-3 bg-white/5 mb-2rem border-b border-white/10 flex items-center justify-between">
          <span className="font-mono text-sm tracking-widest">EDIT FIELDS</span>
          <span className="font-mono text-xs text-white/60">MRND // SECURE CHANNEL</span>
        </div>

        <div className="p-5 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/70">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2 font-mono focus:border-white outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/70">Alias (optional)</span>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2 font-mono focus:border-white outline-none"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs uppercase tracking-wider text-white/70">Instagram (handle or URL)</span>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@yourhandle or https://instagram.com/yourhandle"
              className="mt-1 w-full rounded-xl bg-black border border-white/20 px-3 py-2 font-mono focus:border-white outline-none"
            />
          </label>
        </div>

        {/* panel footer */}
        <div className="px-5 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono text-xs text-white/60">LAST WRITE: live</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white hover:text-black transition font-mono text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl border border-white text-black bg-white hover:bg-black hover:text-white transition font-mono text-sm"
            >
              Save Transmission
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes scan { 
          0% { background-position-y: 0; } 
          100% { background-position-y: 8px; } 
        }
      `}</style>
    </main>
  );
}
