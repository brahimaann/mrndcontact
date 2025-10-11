"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CloudinaryImage from "../../components/media/CloudinaryImage";

export default function PhotosPage() {
  const photos = useQuery(api.works.listWorksByMedium, { type: "photo", limit: 60 }) || [];
  return (
    <section className="space-y-5">
      <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">Photos</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p) => (
          <CloudinaryImage key={p._id} publicId={p.coverPublicId} alt={p.title} aspect="aspect-[4/5]" />
        ))}
        {photos.length === 0 && <div className="border border-white/40 p-4 text-xs opacity-70">[ No photos yet ]</div>}
      </div>
    </section>
  );
}
