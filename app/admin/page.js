"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const admin = useQuery(api.admin.isAdmin, isSignedIn ? {} : "skip");
  const list = useQuery(api.admin.listAllowed, isSignedIn ? {} : "skip");
  const upsert = useMutation(api.admin.upsertAllowed);
  const toggle = useMutation(api.admin.toggleAllowed);
  const remove = useMutation(api.admin.removeAllowed);

  const [type, setType] = useState("EMAIL");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isSignedIn && admin === false) router.replace("/");
  }, [admin, isSignedIn, router]);

  if (!isSignedIn) return <div className="p-6">Please sign in…</div>;
  if (admin === undefined) return <div className="p-6">Checking admin…</div>;
  if (admin === false) return null; // redirected

  async function onAdd(e) {
    e.preventDefault();
    await upsert({ type, value, allowed: true });
    setValue("");
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin – Access Control</h1>

      <form onSubmit={onAdd} className="flex flex-wrap items-end gap-3 border border-white/10 bg-white/5 rounded-xl p-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-white/70">Type</span>
          <select
            className="mt-1 bg-black border border-white/20 rounded-lg px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
          </select>
        </label>

        <label className="block grow">
          <span className="text-xs uppercase tracking-wider text-white/70">Value</span>
          <input
            className="mt-1 w-full bg-black border border-white/20 rounded-lg px-3 py-2"
            placeholder={type === "EMAIL" ? "name@example.com" : "+16125551234"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>

        <button className="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-black transition">
          Add / Allow
        </button>
      </form>

      <div className="mt-6 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-2 text-xs uppercase tracking-wider bg-white/5 border-b border-white/10">
          Allow-listed Identifiers
        </div>

        <div className="divide-y divide-white/10">
          {(list ?? []).map((row) => (
            <div key={row._id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-[11px] px-2 py-1 rounded bg-white/10">{row.type}</span>
              <span className="font-mono text-sm">{row.value}</span>
              <span
                className={
                  "ml-auto text-xs px-2 py-1 rounded " +
                  (row.allowed ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300")
                }
              >
                {row.allowed ? "allowed" : "blocked"}
              </span>
              <button
                onClick={() => toggle({ id: row._id })}
                className="px-3 py-1 rounded border border-white/20 hover:bg-white hover:text-black text-sm transition"
              >
                Toggle
              </button>
              <button
                onClick={() => remove({ id: row._id })}
                className="px-3 py-1 rounded border border-white/20 hover:bg-red-600 hover:border-red-600 text-sm transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: manage admins themselves */}
      {/* You can add a second panel using listAdmins/addAdmin/removeAdmin similarly */}
    </main>
  );
}
