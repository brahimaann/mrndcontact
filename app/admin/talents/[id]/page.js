// app/admin/talents/[id]/page.js
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function TalentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const doc = useQuery(api.talents.getTalentById, { id });
  const updateTalent = useMutation(api.talents.updateTalent);
  const deleteTalent = useMutation(api.talents.deleteTalent);

  const [form, setForm] = useState({
    name: "",
    cityState: "",
    igHandle: "",
    focus: "",
    status: "",
  });

  useEffect(() => {
    if (doc) {
      setForm({
        name: doc.name ?? "",
        cityState: doc.cityState ?? "",
        igHandle: doc.igHandle ?? "",
        focus: doc.focus ?? "",
        status: doc.status ?? "",
      });
    }
  }, [doc]);

  if (!doc) {
    return (
      <div className="ml-[calc(6rem+1in)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8">
        Loading…
      </div>
    );
  }

  async function onSave() {
    await updateTalent({ id, ...form });
    router.push("/admin/talents");
  }

  async function onDelete() {
    if (confirm("Delete this talent?")) {
      await deleteTalent({ id });
      router.push("/admin/talents");
    }
  }

  return (
    <div className="ml-[calc(6rem)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl leading-[2] font-semibold">Edit Talent</h1>
        <Link href="/admin/talents" className="text-sm underline">Cancel</Link>
      </header>

      <div className="mt-6 grid gap-4 max-w-xl">
        <Field label="Name *" value={form.name} onChange={(v) => setForm(s => ({ ...s, name: v }))} required />
        <Field label="City, State *" value={form.cityState} onChange={(v) => setForm(s => ({ ...s, cityState: v }))} required />
        <Field label="Instagram Handle" value={form.igHandle} onChange={(v) => setForm(s => ({ ...s, igHandle: v }))} placeholder="@username" />
        <Field label="Focus" value={form.focus} onChange={(v) => setForm(s => ({ ...s, focus: v }))} placeholder="Videographer, Model, Musician…" />
        <Field label="Status" value={form.status} onChange={(v) => setForm(s => ({ ...s, status: v }))} placeholder="Active Roster, Freelance, Archived…" />
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onSave} className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition">
          Save Changes
        </button>
        <button onClick={onDelete} className="rounded-xl border border-red-500/40 text-red-300 px-4 py-2 text-sm hover:bg-red-600 hover:text-white transition">
          Delete
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none"
      />
    </label>
  );
}
