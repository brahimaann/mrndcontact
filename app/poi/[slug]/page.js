"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { POI_INDEX } from "../poi_data";

function nameFromSlug(slug) {
  return String(slug)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function POIPage() {
  const { slug } = useParams();
  const poi = POI_INDEX[slug] || {};
  const displayName = useMemo(
    () => poi.name || nameFromSlug(slug),
    [slug, poi.name]
  );

  const storageKey = `poi:suggestions:${slug}`;
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) setText(cached);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, text || "");
      } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [text, storageKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch(`/poi/${encodeURIComponent(slug)}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion: text,
          userId: slug,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Bad response");
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: profile preview (no download/context menu) */}
        <section className="bg-white border-2 border-black rounded-2xl p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{displayName}</h1>

          <div
            className="relative w-full aspect-[4/3] border border-black/20 rounded-xl overflow-hidden select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            {poi.image ? (
              <Image
                src={poi.image}
                alt={`${displayName} photo`}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm opacity-60 p-4 text-center">
                Add a Google Photos **direct image URL** to <code>POI_INDEX["{slug}"].image</code>
                {" "} (usually starts with <code>https://lh3.googleusercontent.com/…</code>).
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: suggestions / edits */}
        <section className="bg-black text-white rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-center mb-4">
            Suggestions 
          </h2>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Corrections, links, dates, etc."
              className="flex-1 w-full rounded-lg border-2 border-white p-4 bg-black text-white resize-vertical min-h-[200px] focus:outline-none focus:ring-2 focus:ring-white"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setText("")}
                className="px-4 py-2 rounded-lg border-2 border-white hover:bg-white hover:text-black transition"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Submit"}
              </button>
            </div>

            <p
              className={`text-center text-sm h-5 ${
                status === "saved"
                  ? "text-green-400"
                  : status === "error"
                  ? "text-red-400"
                  : "opacity-60"
              }`}
            >
              {status === "saved"
                ? "Saved. Thank you!"
                : status === "error"
                ? "Something went wrong. Try again."
                : ""}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
