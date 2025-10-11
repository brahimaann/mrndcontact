"use client";
import React from "react";
import { ensureCloudinaryWidget } from "@/app/lib/cloudinary";

export default function CloudinaryUploadButton({ onUploaded }) {
  const [busy, setBusy] = React.useState(false);

  const open = async () => {
    setBusy(true);
    try {
      await ensureCloudinaryWidget();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset, // must be an **unsigned** preset for client-side uploads
          multiple: false,
          sources: ["local", "url", "camera"],
          cropping: false,
          resourceType: "image"
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const { public_id } = result.info;
            onUploaded?.(public_id); // return the Cloudinary publicId to caller
          }
        }
      );

      widget.open();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 border border-white/50 px-3 py-2 text-xs uppercase tracking-[0.2em] bg-black hover:bg-white/10 rounded"
      disabled={busy}
    >
      {busy ? "Uploading…" : "Upload Image"}
    </button>
  );
}
