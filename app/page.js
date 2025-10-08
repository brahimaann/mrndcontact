"use client";
import { useState } from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import FloatingMiniCalendar from "./components/FloatingMiniCalendar";
import WelcomeBanner from "./components/WelcomeBanner";
import HudSidebar from "./components/HudSidebar";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import AccessOverlay from "./components/AccessOverlay";

export default function Page() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [granted, setGranted] = useState(false);
  const { isSignedIn } = useUser();
  const isAdmin = useQuery(api.admin.isAdmin, isSignedIn ? {} : "skip");

  // Access text logic
  let accessLevel = "PUBLIC";
  let clearance = "COMMUNITY";
  if (isSignedIn) {
    accessLevel = "USER";
    clearance = "AUTHORIZED";
  }
  if (isSignedIn && isAdmin) {
    accessLevel = "ADMIN";
    clearance = "ACTIVE";
  }

  return (
<>
  {/* LEFT NAV (unchanged) */}
  <HudSidebar />

  {/* MAIN: full viewport height with footer pinned */}
<div className="grid grid-rows-[1fr_auto] ml-[6rem] mr-0 px-6 md:px-10 pt-8">
    {/* ROW 1: Content area split into main + right rail */}
    <main className="min-h-0 overflow-x-hidden">
<div className="grid gap-6 lg:gap-8 grid-cols-[1fr_18rem] md:grid-cols-[1fr_20rem] lg:grid-cols-[1fr_22rem]">
        {/* LEFT COLUMN — scrollable content */}
        <div className="min-h-0 overflow-x-hidden pr-1">
          {/* Banner aligned to the right edge of the left column */}
          <div className="flex justify-end">
            <WelcomeBanner className="mt-2" />
          </div>

          {/* Content */}
          <section className="section mt-4">
            <h1 className="typewriter text-3xl md:text-5xl">
              <span className="chip chip--invert">GENESIS_PROTOCOL</span>
            </h1>
            <p className="mt-1 text-white/80 font-mono">
              Access level: {accessLevel}
              <br />
              <br />
              Clearance: {clearance}
            </p>
            <div className="mt-6 flex">
              {!isSignedIn ? (
                <Link
                  href="/user"
                  className="px-6 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition"
                >
                  <span className="chip chip--invert">Enter</span>
                </Link>
              ) : (
                <span className="px-6 py-3 rounded-xl border border-white text-white/90">
                  <span className="chip chip--invert">Access Granted</span>
                </span>
              )}
            </div>
          </section>

          <section className="section grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-xs tracking-[0.25em] uppercase text-white/70">
                [ SYS.BODY ]
              </h2>
              <h3 className="mt-2 max-w-[34ch] leading-[1.6] [text-wrap:balance] text-xs tracking-[0.25em] uppercase text-white/70">
                Planting Seeds for Tomorrow’s Trees
              </h3>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN — sticky rail that fills viewport height */}
        <aside className="block min-h-0">
          <div className="sticky top-0 h-dvh pb-4">
    <div className="h-full flex flex-col gap-4">
      <div className="font-dogica border border-white/20 rounded-xl p-3 bg-black text-white shrink-0">
        <FloatingMiniCalendar />
      </div>
      <div className="flex-1 min-h-0 border border-white/10 rounded-xl p-3 bg-black/40">
        {/* Incoming ... */}
      </div>
      <div className="shrink-0">{/* Login */}</div>
    </div>
  </div>
        </aside>
      </div>
    </main>

    {/* ROW 2: Footer sits at the bottom, always visible */}

  </div>

  {/* Overlays */}
  {showCalendar && <OverlayCalender onClose={() => setShowCalendar(false)} />}
  <AccessOverlay show={granted} onClose={() => setGranted(false)} />
</>

  );
}
