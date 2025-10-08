// app/cities/page.js
"use client";

import Link from "next/link";
import HudSidebar from "../components/HudSidebar";

export default function CitiesLanding() {
  return (
    <>
      <HudSidebar />

      {/* GUTTERS: left HUD offset; keep room for a future right rail on lg+ */}
      <div className="min-h-screen ml-[calc(6rem+1in)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8 bg-black font-dogica text-white">
        {/* ===== <Header> — primary decoded header ===== */}
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-xs tracking-[0.25em] uppercase opacity-80">
            [ FILE: <span className="font-bold">THE CITIES</span> ]
          </h1>

          {/* CTA must be visibly black text; give it a white chip so it’s legible on black */}
          <Link
            href="/magazine/cities"
            className="text-black visited:text-black rounded-xl border border-white/10 bg-white px-4 py-2 text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition"
            aria-label="Open Magazine — Issue 01"
          >
            Magazine — Issue 01
          </Link>
        </header>

        {/* ===== <CuratorialBlurb> — decoded body block ===== */}
        <section className="mt-6 max-w-prose">
          <h2 className="text-[10px] tracking-[0.25em] uppercase text-white/70">
            [ DECODING: GENESIS REPORT ]
          </h2>

          <div className="mt-3 border border-white/15 rounded-xl p-4 bg-black/40">
            <p className="leading-[2.5] text-white/90">
              <strong>The Cities</strong> is a living report of the Twin Cities’ first bloom—an
              initialization signal for a culture we’re building together. We highlight
              artists, organizers, and builders, threading personal stories into a shared
              narrative of craft, connection, and homegrown abundance.
            </p>
            <p className="mt-3 leading-[2.5] text-white/80">
              This page functions as the <em>Genesis Protocol</em> message file—your entry
              point to the transmission. Proceed to the magazine for spreads, interviews,
              and features as new packets are decrypted.
            </p>
          </div>
        </section>

        {/* ===== <TeaserCard> — high-priority data card / printer block ===== */}
        <section className="mt-8">
          <div className="border border-white/20 rounded-xl bg-white text-black">
            {/* card header strip */}
            <div className="px-5 py-2 border-b border-black/15">
              <p className="text-[10px] tracking-[0.25em] uppercase opacity-70">
                [ PRIORITY DATA: FEATURE PREVIEW ]
              </p>
            </div>

            {/* card body */}
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed">
                Portraits, field notes, and transcripts from creators shaping what’s next:
                Jay • Mancapa Wanta • Lyric • + more.
              </p>
            </div>

            {/* card footer / CTA (must be black text) */}
            <div className="px-5 py-3 border-t border-black/15">
              <Link
                href="/magazine/cities"
                className="text-black visited:text-black font-bold underline decoration-black/40 underline-offset-4 hover:decoration-black"
                aria-label="Read the Teaser"
              >
                Read the Teaser →
              </Link>
            </div>
          </div>
        </section>

        {/* breathe above global footer */}
        <div className="h-8" />
      </div>
    </>
  );
}
