"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function PerformancePage() {
  const events = useQuery(api.works.listWorksByMedium, { type: "performance", limit: 60 }) || [];
  return (
    <section className="space-y-5">
      <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">Performance</div>
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e._id} className="border border-white/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em]">{e.title}</div>
            <div className="opacity-70 text-[11px]">{e.date || ""}</div>
          </div>
        ))}
        {events.length === 0 && <div className="border border-white/40 p-4 text-xs opacity-70">[ No performances yet ]</div>}
      </div>
    </section>
  );
}
