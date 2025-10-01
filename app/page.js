"use client";
import { useState } from "react";
import Link from "next/link";
import Featured from "./components/Featured";
import CultureInMotion from "./components/CultureInMotion";
import OverlayCalender from "./components/OverlayCalender";
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
      {/* LEFT: nav */}
      <HudSidebar />


      
      {/* RIGHT: Calendar (top) → Incoming (fills) → Login (bottom) */}
      <aside className="fixed right-4 top-4 bottom-4 z-40 w-80 max-lg:hidden flex flex-col gap-4">
        {/* Calendar uses Dogica */}
        <div className="calendar-panel font-dogica border border-white/20 rounded-xl p-3 bg-black text-white">
          <FloatingMiniCalendar />
          
        </div>
      </aside>
{/* CENTER: main content starts exactly at nav’s right edge */}
<div className="min-h-[5%] ml-[calc(6rem+1in)] mr-[22rem] px-10 pt-6">
  {/* Banner row aligned to the right so it sits just to the LEFT of the calendar */}
  <div className="flex justify-end">
    <WelcomeBanner className="mt-2 " />
  </div>
</div>
  {/* Give the rest of the content a little top spacing so it doesn't touch the banner */}
  <section className="section mt-2"></section>
      {/* CENTER: main content starts exactly at nav’s right edge */}
      <div className="min-h-screen ml-[calc(6rem+1in)] mr-[22rem] px-10 pt-10">
        <section className="section">
          <h1 className="typewriter text-3xl md:text-5xl">
            <span className="chip chip--invert">INITIATING <br /> KLTRE_PROTOCOL</span>
          </h1>
        <p className="mt-1 text-white/80 font-mono">
          Access level: {accessLevel} <br /><br /> Clearance: {clearance}
        </p>
          <div className="mt-6 flex ">
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
            <h2 className="text-xs tracking-[0.25em] uppercase text-white/70">[ SYS.BODY ]</h2>
            <p className="mt-3 max-w-prose text-white/80 font-mono">
              Building community through projects, events, and storytelling.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="hud-poster" />
          </div>
        </section>

        <Featured />
        <CultureInMotion />

        <section className="section grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {["Equity", "Collaboration", "Growth"].map((p) => (
            <div key={p} className="card hud-card">
              <p className="muted text-xs uppercase tracking-[0.18em] font-mono">Pillar</p>
              <h3 className="mt-1 text-lg font-semibold">
                <span className="chip chip--invert">{p}</span>
              </h3>
              <p className="mt-2 text-white/70 text-sm font-mono">
                Short line about how this principle shows up in practice.
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* Overlays */}
      {showCalendar && <OverlayCalender onClose={() => setShowCalendar(false)} />}
      <AccessOverlay show={granted} onClose={() => setGranted(false)} />
    </>
  );
}
