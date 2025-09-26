// app/components/CalanderScreen.js
"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const localizer = momentLocalizer(moment);

// Monochrome skin to match your site
const rbcCss = `
.rbc-calendar { background:#fff; color:#000; border:1px solid #d5d5d5; }
.rbc-toolbar { color:#000; border-bottom:1px solid #dfdfdf; padding:8px 12px; gap:8px}
.rbc-toolbar button { background:#eee; color:#000; border:1px solid #ccc; padding:6px 10px; border-radius:8px}
.rbc-toolbar button:hover,.rbc-active{background:#e7e7e7!important}
.rbc-month-view, .rbc-time-view { border-color:#ddd; }
.rbc-off-range-bg { background:#f4f4f4; }
.rbc-today { background:#f0f0f0; }
.rbc-event { background:#eee; border:1px solid #c5c5c5; color:#000; position: relative; cursor: pointer; }
.rbc-selected-cell { background:#efefef; }
.rbc-time-header, .rbc-time-content, .rbc-month-row { border-color:#ddd; }
.rbc-current-time-indicator { background:#000; }

.rbc-event .tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5px;
  background-color: #333;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  width: 200px;
  z-index: 10;
}

.rbc-event:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
`;

// ------- helpers -------
function computeRange(view, date) {
  const d = moment(date);
  if (view === Views.MONTH) {
    return { from: +d.clone().startOf("month").startOf("week"), to: +d.clone().endOf("month").endOf("week") };
  }
  if (view === Views.WEEK) {
    return { from: +d.clone().startOf("week"), to: +d.clone().endOf("week") };
  }
  return { from: +d.clone().startOf("day"), to: +d.clone().endOf("day") };
}

function EventCell({ event }) {
  const by = event?.resource?.alias ? ` · ${event.resource.alias}` : "";
  return (
    <div title={`${event.title}${by}`}>
      {event.title}
      {event?.resource?.alias && <span className="opacity-70">{by}</span>}
      {event.resource?.description && (
        <div className="tooltip">{event.resource.description}</div>
      )}
    </div>
  );
}

// Render children into <body> so nothing can clip it
function BodyPortal({ children }) {
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef(null);
  if (!nodeRef.current) nodeRef.current = document.createElement("div");

  useEffect(() => {
    const el = nodeRef.current;
    document.body.appendChild(el);
    setMounted(true);
    return () => document.body.removeChild(el);
  }, []);

  return mounted ? createPortal(children, nodeRef.current) : null;
}

export default function CalanderScreen() {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(() => computeRange(Views.MONTH, new Date()));
  const [slot, setSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => setRange(computeRange(view, date)), [view, date]);

  const onRangeChange = useCallback((r) => {
    if (Array.isArray(r) && r.length) {
      setRange({ from: +moment(r[0]).startOf("day"), to: +moment(r[r.length - 1]).endOf("day") });
    } else if (r?.start && r?.end) {
      setRange({ from: +moment(r.start).startOf("day"), to: +moment(r.end).endOf("day") });
    }
  }, []);

  // Data
  const rows = useQuery(api.events.listEvents, { from: range.from, to: range.to, limit: 1000 });
  const createEvent = useMutation(api.events.createEvent);

  const events = useMemo(
    () =>
      (rows ?? []).map((e) => ({
        id: e._id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: !!e.allDay,
        resource: e,
      })),
    [rows]
  );

  const openNew = useCallback((s = null) => {
    setSlot(s);
    setIsModalOpen(true);
  }, []);

  const onSelectSlot = useCallback((s) => openNew(s), [openNew]);

  const handleCreateEvent = async (payload) => {
    await createEvent({
      code: payload.code,
      title: payload.title,
      description: payload.description || "",
      start: +payload.start,
      end: +payload.end,
      allDay: !!payload.allDay,
      alias: payload.alias || undefined,
    });
    setIsModalOpen(false);
    setSlot(null);
  };

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  return (
    <section className="relative w-full bg-white text-black pt-4 pb-8 px-4 lg:px-24">
      <style>{rbcCss}</style>

      <div className={`flex-1 ${view === Views.MONTH ? "h-[calc(100vh-224px)]" : "h-[85vh]"}`}>
        <div className="bg-white rounded-xl border border-black/10 p-2 h-full relative">
          <Calendar
            popup
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onRangeChange={onRangeChange}
            onSelectSlot={onSelectSlot}
            onSelectEvent={handleSelectEvent}
            components={{ event: EventCell }}
            step={30}
            timeslots={2}
            min={new Date(1970, 1, 1, 6, 0)}
            max={new Date(1970, 1, 1, 22, 0)}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: "100%" }}
          />

          {/* Floating + button */}
          <br></br>
          <button
            onClick={() => openNew()}
            className="absolute bottom-4 right-4 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-gray-800 transition"
            aria-label="Add Calendar Item"
          >
            +
          </button>
        </div>
      </div>

      {/* Full-screen modal rendered to <body> with inline styles (can’t be clipped) */}
      {isModalOpen && (
        <BodyPortal>
          <FullScreenModal title="Add Calendar Item" onClose={() => setIsModalOpen(false)}>
            {(props) => (
              <EventEditor
                initial={slot}
                onCreate={handleCreateEvent}
                onClose={() => setIsModalOpen(false)}
                firstFieldRef={props.firstFieldRef}
              />
            )}
          </FullScreenModal>
        </BodyPortal>
      )}

      {selectedEvent && (
        <BodyPortal>
          <FullScreenModal title="Event Details" onClose={() => setSelectedEvent(null)}>
            <EventDetails event={selectedEvent} />
          </FullScreenModal>
        </BodyPortal>
      )}
    </section>
  );
}

// ---------- Modal & Editor ----------

function EventDetails({ event }) {
  const { title, resource, start, end } = event;
  const { description, authorAlias } = resource;

  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {description && <p className="mb-4 whitespace-pre-wrap">{description}</p>}
      <p className="mb-2">
        <strong>From:</strong> {moment(start).format('MMMM Do YYYY, h:mm a')}
      </p>
      <p className="mb-4">
        <strong>To:</strong> {moment(end).format('MMMM Do YYYY, h:mm a')}
      </p>
      {authorAlias && (
        <p className="text-sm text-gray-600">
          Posted by: {authorAlias}
        </p>
      )}
    </div>
  );
}

function FullScreenModal({ title, children, onClose }) {
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Inline styles guarantee fixed, full-screen, and top-most regardless of other CSS
  const wrapStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(2px)",
    zIndex: 2147483647, // maxed
  };

  return (
    <div style={wrapStyle} onClick={onClose} aria-modal="true" role="dialog">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          height: 40,
          width: 40,
          borderRadius: "9999px",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          background: "transparent",
        }}
      >
        ×
      </button>

      {/* Centered dialog */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%", // Use height: 100% to fill the parent, which is the full screen overlay
          display: "grid",
          placeItems: "center",
          padding: 16,
        }}
      >
        <div style={{ width: "min(92vw,560px)", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 15px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#000" }}>{title}</h3>
          </div>
          <div style={{ padding: 16 }}>
            {typeof children === "function" ? children({ firstFieldRef }) : children}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventEditor({ initial, onCreate, onClose, firstFieldRef }) {
  const [code, setCode] = useState("");
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [allDay, setAllDay] = useState(!!initial?.allDay);
  const [start, setStart] = useState(initial ? moment(initial.start).format("YYYY-MM-DDTHH:mm") : "");
  const [end, setEnd] = useState(initial ? moment(initial.end).format("YYYY-MM-DDTHH:mm") : "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setAllDay(!!initial.allDay);
    setStart(moment(initial.start).format("YYYY-MM-DDTHH:mm"));
    setEnd(moment(initial.end).format("YYYY-MM-DDTHH:mm"));
  }, [initial]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const s = moment(start);
      const e2 = moment(end);
      if (!title.trim()) throw new Error("Title required.");
      if (!s.isValid() || !e2.isValid()) throw new Error("Invalid date/time.");
      await onCreate({
        code: code.trim(),
        alias: alias.trim(),
        title: title.trim(),
        description: desc.trim(),
        start: s.toDate(),
        end: e2.toDate(),
        allDay,
      });
    } catch (er) {
      setErr(er.message || "Failed to create.");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = { width: "100%", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "8px 12px", color: "#000" };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm opacity-80">Access Code</label>
      <input ref={firstFieldRef} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code (e.g. 13647)" style={inputStyle} required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm opacity-80">Your alias (optional)</label>
          <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="name or org" style={inputStyle} />
        </div>

        <div className="flex items-end gap-2">
          <input id="allday" type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
          <label htmlFor="allday" className="text-sm opacity-80">All day</label>
        </div>
      </div>

      <label className="block text-sm opacity-80">Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" style={inputStyle} required />

      <label className="block text-sm opacity-80">Description (optional)</label>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Details, location, link…" style={{ ...inputStyle, minHeight: 84 }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm opacity-80">Starts</label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label className="block text-sm opacity-80">Ends</label>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} required />
        </div>
      </div>

      {err && <p className="text-red-500 text-sm">{err}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
          {busy ? "Saving…" : "Add Event"}
        </button>
      </div>
    </form>
  );
}
