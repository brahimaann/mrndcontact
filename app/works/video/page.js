"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import LazyYoutubeVideo from "../../components/media/LazyYoutubeVideo";

export default function VideoPage() {
  const videos = useQuery(api.works.listWorksByMedium, { type: "video", limit: 40 }) || [];
  return (
    <section className="space-y-5">
      <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">Video</div>
      <div className="space-y-4">
        {videos.map((v) => (
          <LazyYoutubeVideo key={v._id} videoId={(v.metadata && v.metadata.youtubeId) || ""} title={v.title} />
        ))}
        {videos.length === 0 && <div className="border border-white/40 p-4 text-xs opacity-70">[ No videos yet ]</div>}
      </div>
    </section>
  );
}
