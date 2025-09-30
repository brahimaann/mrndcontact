"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import OverlayCalender from "./OverlayCalender"; // full-screen calendar

/** Renders children into <body> so nothing clips it */
function BodyPortal({ children }) {
  const nodeRef = useRef(null);
  if (!nodeRef.current) nodeRef.current = document.createElement("div");

  useEffect(() => {
    const el = nodeRef.current;
    document.body.appendChild(el);
    return () => document.body.removeChild(el);
  }, []);

  return nodeRef.current ? globalThis.ReactDOM?.createPortal?.(children, nodeRef.current) ?? null : null;
}

// tiny, local createPortal fallback (React 18+)
import * as ReactDOM from "react-dom";
if (typeof window !== "undefined") {
  // @ts-ignore
  globalThis.ReactDOM = ReactDOM;
}

export default function FloatingMiniCalendar() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Hover popover state (mounted in portal)
  const [hoverData, setHoverData] = useState(null);
  // { key: string, items: array, x: number, y: number, w: number, h: number }

  // Clicked-date infographic
  const [infoKey, setInfoKey] = useState(null);

  // Range for event dots (this month)
  const start = cursor.getTime();
  const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1).getTime();
  const eventsByDay = useQuery(api?.events?.inRange, { start, end }) ?? {};

  const { label, weeks } = useMemo(() => getMonthGrid(cursor), [cursor]);

  // Keep hover card positioned on scroll/resize if open
  useEffect(() => {
    if (!hoverData) return;
    const onScroll = () => setHoverData(null);
    const onResize = () => setHoverData(null);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize, true);
    };
  }, [hoverData]);

  return (
    <>
      {/* HUD mini calendar (fixed, top-right, white/gray, black text) */}
      <div
        style={{
          position: "fixed",
          right: "1rem",
          left: "auto",
          zIndex: 95,
          width: "16rem",
          height: "16rem",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          color: "#000",
          overflow: "hidden", // popover escapes via portal so clipping here is fine
        }}
      >
        {/* fill the square */}
        <div style={{ position: "absolute", inset: 8, display: "grid", gridTemplateRows: "auto auto 1fr" }}>
          {/* Month header — click label opens big calendar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
            <button
              aria-label="Previous month"
              onClick={() => setCursor(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
              style={btn()}
              onMouseEnter={(e)=>hoverBg(e,true)} onMouseLeave={(e)=>hoverBg(e,false)}
            >◀</button>

            <button
              onClick={() => setOverlayOpen(true)}
              title="Open full calendar"
              style={{ ...btn(), fontWeight: 600, padding: "2px 8px" }}
              onMouseEnter={(e)=>hoverBg(e,true)} onMouseLeave={(e)=>hoverBg(e,false)}
            >
              {label}
            </button>

            <button
              aria-label="Next month"
              onClick={() => setCursor(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
              style={btn()}
              onMouseEnter={(e)=>hoverBg(e,true)} onMouseLeave={(e)=>hoverBg(e,false)}
            >▶</button>
          </div>

          {/* Weekday header (unique keys) */}
          <div style={{ marginTop: 4, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, fontSize: 10, opacity: 0.75 }}>
            {["S","M","T","W","T","F","S"].map((d,i) => (
              <div key={`wd-${i}`} style={{ textAlign: "center" }}>{d}</div>
            ))}
          </div>

          {/* Month grid */}
          <div style={{ marginTop: 2, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {weeks.flat().map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} style={{ width: "100%", paddingTop: "100%" }} />;
              const key = cell.key;
              const dayEvents = eventsByDay[key] ?? [];
              const has = dayEvents.length > 0;

              return (
                <div
                  key={key}
                  title={cell.date.toDateString()}
                  onClick={() => setInfoKey(key)}
                  onMouseEnter={(e) => {
                    if (!has) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    setHoverData({
                      key,
                      items: dayEvents.slice(0, 3),
                      x: r.left + r.width / 2,
                      y: r.bottom, // bottom of cell
                      w: r.width,
                      h: r.height,
                    });
                  }}
                  onMouseLeave={() => setHoverData(null)}
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%", // square cell
                    borderRadius: 6,
                    outline: cell.isToday ? "1px solid rgba(0,0,0,.65)" : "1px solid transparent",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e)=>{ if(!cell.isToday) e.currentTarget.style.background = "rgba(0,0,0,.06)"; }}
                  onMouseOut={(e)=>{ e.currentTarget.style.background = "transparent"; }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    {cell.date.getDate()}
                  </span>

                  {has && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4, height: 4, borderRadius: 9999, background: "#111",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover dropdown rendered OUTSIDE the calendar via portal */}
      {hoverData && (
        <BodyPortal>
          <HoverDropdown {...hoverData} onClose={() => setHoverData(null)} />
        </BodyPortal>
      )}

      {/* Big calendar overlay */}
      {overlayOpen && <OverlayCalender onClose={() => setOverlayOpen(false)} />}

      {/* Date infographic modal */}
      {infoKey && (
        <DateInfographic
          dateKey={infoKey}
          items={(eventsByDay[infoKey] ?? []).slice(0, 12)}
          onClose={() => setInfoKey(null)}
        />
      )}
    </>
  );
}

/* ---------- Hover popover (outside via portal) ---------- */

function HoverDropdown({ key: _k, items, x, y, onClose }) {
  // position with viewport coords; flip if near right edge
  const width = 220;
  const maxH = 160;
  const margin = 8;
  const vpW = typeof window !== "undefined" ? window.innerWidth : 1200;

  const left = Math.min(Math.max(x - width / 2, 12), vpW - width - 12);
  const top = y + margin;

  return (
    <div
      onMouseEnter={() => void 0}
      onMouseLeave={onClose}
      style={{
        position: "fixed",
        left,
        top,
        width,
        maxHeight: maxH,
        overflow: "auto",
        zIndex: 200,
        background: "#fff",
        color: "#000",
        border: "1px solid rgba(0,0,0,.15)",
        borderRadius: 10,
        boxShadow: "0 12px 28px rgba(0,0,0,.18)",
        padding: "8px 10px",
        fontSize: 12,
      }}
    >
      {items.map((e, i) => (
        <div key={e._id ?? i} style={{ padding: "6px 2px", borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,.06)" : "none" }}>
          <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{e.title}</div>
          <div style={{ opacity: .7, lineHeight: 1.2 }}>{fmtTime(e.start)} – {fmtTime(e.end)}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */

function btn() {
  return {
    borderRadius: 8,
    padding: "2px 6px",
    border: "1px solid rgba(0,0,0,.12)",
    background: "#f4f4f4",
    color: "#111",
    cursor: "pointer",
  };
}
function hoverBg(e, on) {
  e.currentTarget.style.background = on ? "#e9e9e9" : "#f4f4f4";
}
function fmtTime(ms) {
  try { return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  catch { return ""; }
}

function getMonthGrid(firstOfMonth) {
  const month = firstOfMonth.getMonth();
  const label = firstOfMonth.toLocaleString(undefined, { month: "long", year: "numeric" });
  const startDay = (firstOfMonth.getDay() + 7) % 7;
  const gridStart = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), 1 - startDay);
  const today = new Date();
  const weeks = [];
  let cur = new Date(gridStart);

  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      if (cur.getMonth() === month) {
        row.push({
          date: new Date(cur),
          isToday:
            cur.getFullYear() === today.getFullYear() &&
            cur.getMonth() === today.getMonth() &&
            cur.getDate() === today.getDate(),
          key: new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()).toDateString(),
        });
      } else {
        row.push(null);
      }
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return { label, weeks };
}

/* ---------- Date Infographic Modal (unchanged from previous) ---------- */

function DateInfographic({ dateKey, items, onClose }) {
  const date = new Date(dateKey);
  const label = date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        zIndex: 220,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        style={{
          width: "min(92vw, 720px)",
          maxHeight: "85vh",
          background: "#fff",
          color: "#000",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: "12px 16px", borderBottom:"1px solid rgba(0,0,0,.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{label}</div>
          <button onClick={onClose} aria-label="Close" style={{ borderRadius:8, padding:"4px 10px", background:"#111", color:"#fff" }}>×</button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
            <Card title="Events" value={items.length} />
            <Card title="Earliest" value={items[0] ? fmtTime(items[0].start) : "—"} />
            <Card title="Latest" value={items[items.length-1] ? fmtTime(items[items.length-1].end) : "—"} />
          </div>

          <div style={{ border:"1px solid rgba(0,0,0,.08)", borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:0 }}>
              <thead>
                <tr style={{ background:"#f7f7f7" }}>
                  <th style={th()}>Title</th>
                  <th style={th(120)}>Start</th>
                  <th style={th(120)}>End</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding:12, textAlign:"center", color:"#666" }}>No events for this date.</td></tr>
                ) : items.map((e, i) => (
                  <tr key={e._id ?? i} style={{ borderTop:"1px solid rgba(0,0,0,.06)" }}>
                    <td style={td()}>{e.title}</td>
                    <td style={td(120)}>{fmtTime(e.start)}</td>
                    <td style={td(120)}>{fmtTime(e.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border:"1px solid rgba(0,0,0,.08)", borderRadius:12, padding:"10px 12px", background:"#fafafa" }}>
      <div style={{ fontSize:12, opacity:.7 }}>{title}</div>
      <div style={{ fontSize:20, fontWeight:700, marginTop:2 }}>{value}</div>
    </div>
  );
}
function th(w){ return { textAlign:"left", padding:"10px 12px", fontSize:12, color:"#333", width:w }; }
function td(w){ return { padding:"10px 12px", fontSize:13, color:"#111", width:w }; }