"use client";
import { useState, useMemo, useEffect } from "react";
import ButtonNav from "./components/ButtonNav";
import CalanderScreen from "./components/CalanderScreen";
import Header from "./components/Header";
import Featured from "./components/Featured";
import CultureInMotion from "./components/CultureInMotion";
import FloatingMiniCalendar from "./components/FloatingMiniCalendar";


export default function Page() {
  return (
    <>
      <FloatingMiniCalendar />
      <Header />
      <div className="pt-24 pr-24 lg:pr-28">   {/* safe lane for fixed HUD + room under header */}
   {/* HERO … */}
   <section className="section grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-4xl md:text-5xl font-bold">Culture Lives Here.</h1>
          <p className="mt-3 max-w-prose text-white/80">
            Building community through projects, events, and storytelling.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#projects" className="rounded-md bg-white/90 px-4 py-2 text-black hover:bg-white">
              Explore
            </a>
            <a href="#join" className="rounded-md px-4 py-2 hover:bg-white/10">Join</a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[4/5] w-full rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
        </div>
      </section>

      <Featured />
      <CultureInMotion />

      {/* Pillars */}
      <section className="section">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {["Equity", "Collaboration", "Growth"].map(p => (
            <div key={p} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">Pillar</p>
              <h3 className="mt-1 text-lg font-medium">{p}</h3>
              <p className="mt-2 text-white/70 text-sm">
                Short line about how this principle shows up in practice.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Updates band */}
      <section className="section bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Updates & Recaps</h3>
            <a href="#archive" className="rounded-md px-3 py-1 hover:bg-white/10">View all</a>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}