// app/admin/talents/new/page.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function NewTalentPage() {
  const router = useRouter();
  const createTalent = useMutation(api.talents.createTalent);

  const [form, setForm] = useState({
    name: "",
    cityState: "",
    igHandle: "",
    focus: "",
    status: "",
  });

  async function onCreate() {
    if (!form.name.trim() || !form.cityState.trim()) {
      alert("Name and City/State are required.");
      return;
    }
    const id = await createTalent(form);
    router.push(`/admin/talents/${id}`);
  }

  return (
    <div className="ml-[calc(6rem+1in)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Talent</h1>
        <Link href="/admin/talents" className="text-sm underline">Cancel</Link>
      </header>

      <div className="mt-6 grid gap-4 max-w-xl">
        <Field label="Name *" value={form.name} onChange={(v) => setForm(s => ({ ...s, name: v }))} required />
        <Field label="City, State *" value={form.cityState} onChange={(v) => setForm(s => ({ ...s, cityState: v }))} required />
        <Field label="Instagram Handle" value={form.igHandle} onChange={(v) => setForm(s => ({ ...s, igHandle: v }))} placeholder="@username" />
        <Field label="Focus" value={form.focus} onChange={(v) => setForm(s => ({ ...s, focus: v }))} placeholder="Videographer, Model, Musician…" />
        <Field label="Status" value={form.status} onChange={(v) => setForm(s => ({ ...s, status: v }))} placeholder="Active Roster, Freelance, Archived…" />
      </div>

      <div className="mt-6">
        <button onClick={onCreate} className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition">
          Create Talent
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
