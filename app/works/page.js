"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WorksIndexPage() {
  const items = useQuery(api.works.listWorksByMedium, { type: "photo", limit: 24 }) || [];
  // ↑ swap to a curated "all" when you’re ready. Default to [] to avoid .map crash.

  return (
    <section className="space-y-5">
      <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
        Media · All
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it._id} className="border border-white/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em]">{it.title}</div>
            <div className="opacity-70 text-[11px]">{it.type}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="border border-white/40 p-4 text-xs opacity-70">[ No media yet ]</div>
        )}
      </div>
    </section>
  );
}
