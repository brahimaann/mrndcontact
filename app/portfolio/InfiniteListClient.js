// app/portfolio/InfiniteListClient.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ARTIST_OBJS } from "./data";

const PAGE_SIZE = 40;

export default function InfiniteListClient() {
  const router = useRouter();

  const [items, setItems] = useState(ARTIST_OBJS.slice(0, PAGE_SIZE));
  const [offset, setOffset] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(PAGE_SIZE >= ARTIST_OBJS.length);

  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loading || done) return;
    setLoading(true);

    const next = ARTIST_OBJS.slice(offset, offset + PAGE_SIZE);
    setItems((prev) => [...prev, ...next]);

    const newOffset = offset + next.length;
    setOffset(newOffset);
    if (newOffset >= ARTIST_OBJS.length || next.length === 0) setDone(true);

    setLoading(false);
  }, [loading, done, offset]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px 600px 0px" }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [loadMore]);

  const openArtist = (slug) => router.push(`/portfolio/${slug}`);

  return (
    <div>
      {/* One-column vertical by default; grows to multi-col nicely */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((a) => (
          <button
            key={a.slug}
            type="button"
            onClick={() => openArtist(a.slug)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition p-6 text-left"
            aria-label={`Open ${a.name}`}
          >
            <span className="block font-medium text-neutral-900">{a.name}</span>
          </button>
        ))}
      </div>

      {/* Sentinel triggers loading when visible */}
      <div ref={sentinelRef} className="h-16" />

      <p className="text-center text-xs text-neutral-500 py-6">
        {done ? "All artists loaded." : loading ? "Loading…" : ""}
      </p>
    </div>
  );
}
