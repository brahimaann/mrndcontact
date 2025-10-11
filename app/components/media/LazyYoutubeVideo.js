"use client";
import React from "react";

export default function LazyYoutubeVideo({
  videoId,
  title = "YouTube video",
  className = "",
  thumbnailQuality = "hqdefault", // or "maxresdefault" when available
}) {
  const [active, setActive] = React.useState(false);

  // YouTube thumbnail rules: https://img.youtube.com/vi/<id>/<quality>.jpg
  const thumb = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;

  return (
    <div className={`relative border border-white/40 bg-black ${className} aspect-video`}>
      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group w-full h-full relative"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover opacity-95"
            loading="lazy"
            decoding="async"
          />
          {/* Shadcn/HUD-style play overlay */}
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center justify-center rounded-full border border-white/70 p-5 bg-black/50 group-hover:bg-black/70 transition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="eager"
        />
      )}
    </div>
  );
}
