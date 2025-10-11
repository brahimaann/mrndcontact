"use client";
import React from "react";
import { cldUrl } from "@/app/lib/cloudinary";

export default function CloudinaryImage({
  publicId,
  alt = "",
  className = "",
  sizes = "(min-width: 970px) 50vw, 100vw",
  // common widths for srcset; tweak to your layout
  widths = [320, 480, 640, 768, 960, 1280],
  aspect = "aspect-[4/3]" // keep your HUD cards tidy
}) {
  if (!publicId) {
    return (
      <div className={`border border-white/40 bg-black/40 ${aspect} flex items-center justify-center ${className}`}>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">[ Missing publicId ]</span>
      </div>
    );
  }

  const src = cldUrl(publicId, { w: 640 }); // fallback
  const srcSet = widths
    .map(w => `${cldUrl(publicId, { w })} ${w}w`)
    .join(", ");

  return (
    <figure className={`border border-white/40 bg-black/50 overflow-hidden ${aspect} ${className}`}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
