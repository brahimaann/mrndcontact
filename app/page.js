"use client";
import { useState } from "react";

import Featured from "./components/Featured";
import CultureInMotion from "./components/CultureInMotion";
import OverlayCalender from "./components/OverlayCalender";
import FloatingMiniCalendar from "./components/FloatingMiniCalendar";

import HudSidebar from "./components/HudSidebar";
import TerminalHero from "./components/TerminalHero";
import MissionFeed from "./components/MissionFeed";
import AccessOverlay from "./components/AccessOverlay";

export default function Page() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [granted, setGranted] = useState(false);

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

        {/* Incoming grows to fill remaining height */}
      

 
      </aside>

      {/* CENTER: main content starts exactly at nav’s right edge */}
      <div className="min-h-screen ml-[calc(6rem+1in)] mr-[22rem] px-10 pt-10">
        <section className="section">
          <h1 className="typewriter text-3xl md:text-5xl">
            <span className="chip chip--invert">INITIATING <br /> KLTRE_PROTOCOL</span>
          </h1>
          <p className="mt-1 text-white/80 font-mono">
            Access level: PUBLIC <br /><br /> Clearance: COMMUNITY
          </p>
          <div className="mt-6 flex gap-3">
            <button className="chip chip--invert pr-3" onClick={() => setShowCalendar(true)}>
              Open Calendar
            </button>
            <button className="chip" onClick={() => setGranted(true)}>
              ###### 
            </button>
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
