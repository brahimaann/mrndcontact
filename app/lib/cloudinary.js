"use client";

// Build a Cloudinary fetch URL from a publicId + transformation string
export function cldUrl(publicId, { w, h, crop = "fill", gravity = "auto", format = "auto", quality = "auto" } = {}) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const parts = [
    "https://res.cloudinary.com",
    cloud,
    "image",
    "upload",
    // transforms: f_auto,q_auto are Cloudinary best-practice for perf
    // (we include width/height only if passed)
    [
      `f_${format}`,           // f_auto
      `q_${quality}`,          // q_auto
      crop ? `c_${crop}` : null,
      gravity ? `g_${gravity}` : null,
      w ? `w_${w}` : null,
      h ? `h_${h}` : null,
      "dpr_auto",
    ].filter(Boolean).join(","),
    publicId
  ].join("/");

  return parts;
}

// Dynamically load the Cloudinary Upload Widget script once
let widgetScriptLoaded = false;
export async function ensureCloudinaryWidget() {
  if (widgetScriptLoaded) return;
  await new Promise((resolve, reject) => {
    const id = "cloudinary-widget";
    if (document.getElementById(id)) { widgetScriptLoaded = true; return resolve(); }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    s.onload = () => { widgetScriptLoaded = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
