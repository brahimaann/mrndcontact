"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function WritingPage() {
  const pieces = useQuery(api.works.listWorksByMedium, { type: "writing", limit: 60 }) || [];
  return (
    <section className="space-y-5">
      <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">Writing</div>
      <div className="space-y-3">
        {pieces.map((w) => (
          <article key={w._id} className="border border-white/40 p-4">
            <h2 className="text-sm uppercase tracking-[0.2em]">{w.title}</h2>
            <p className="text-xs opacity-80">{w.description || "[ No excerpt ]"}</p>
          </article>
        ))}
        {pieces.length === 0 && <div className="border border-white/40 p-4 text-xs opacity-70">[ No writing yet ]</div>}
      </div>
    </section>
  );
}
