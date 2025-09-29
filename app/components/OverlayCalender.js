"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const localizer = momentLocalizer(moment);

/* Monochrome light skin */
const rbcCss = `
.rbc-calendar { background:#fff; color:#111; border:1px solid #d9d9d9; border-radius:14px; overflow:hidden; }
.rbc-toolbar { color:#111; padding:8px 10px; gap:8px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #e6e6e6; }
.rbc-toolbar button { background:#f3f3f3; color:#111; border:1px solid #d4d4d4; padding:6px 10px; border-radius:10px }
.rbc-toolbar button:hover,.rbc-active{background:#eee !important}
.rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color:#e6e6e6; }
.rbc-time-header, .rbc-time-content, .rbc-month-row { border-color:#e6e6e6; }
.rbc-off-range-bg { background:#fafafa; }
.rbc-today { background:linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,0)); }
.rbc-event { background:#eaeaea; border:1px solid #cfcfcf; color:#111; position: relative; cursor: pointer; }
.rbc-selected-cell { background:#f3f3f3; }
.rbc-current-time-indicator { background:#111; height:2px; }
.rbc-header { background:#fbfbfb; color:#666; font-size:12px; padding:6px 4px; border-bottom:1px solid #e6e6e6; }
`;

function computeRange(view, date) {
  const d = moment(date);
  if (view === Views.MONTH)  return { from: +d.clone().startOf("month").startOf("week"), to: +d.clone().endOf("month").endOf("week") };
  if (view === Views.WEEK)   return { from: +d.clone().startOf("week"), to: +d.clone().endOf("week") };
  return { from: +d.clone().startOf("day"), to: +d.clone().endOf("day") };
}

function EventCell({ event }) {
  const alias = event?.resource?.authorAlias ? ` · ${event.resource.authorAlias}` : "";
  return <div title={`${event.title}${alias}`}>{event.title}{alias && <span className="opacity-70">{alias}</span>}</div>;
}

export default function OverlayCalender({ onClose }) {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(() => computeRange(Views.MONTH, new Date()));
  const [slot, setSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mark overlay open on <body> so mini calendar can hide itself
  useEffect(() => {
    document.body.classList.add("calendar-overlay-open");
    return () => document.body.classList.remove("calendar-overlay-open");
  }, []);

  useEffect(() => setRange(computeRange(view, date)), [view, date]);

  const onRangeChange = useCallback((r) => {
    if (Array.isArray(r) && r.length) {
      setRange({ from: +moment(r[0]).startOf("day"), to: +moment(r[r.length - 1]).endOf("day") });
    } else if (r?.start && r?.end) {
      setRange({ from: +moment(r.start).startOf("day"), to: +moment(r.end).endOf("day") });
    }
  }, []);

  const rows = useQuery(api.events.listEvents, { from: range.from, to: range.to, limit: 1000 }) ?? [];
  const createEvent = useMutation(api.events.createEvent);

  const events = useMemo(() => rows.map((e) => ({
    id: e._id,
    title: e.title,
    start: new Date(e.start),
    end: new Date(e.end),
    allDay: !!e.allDay,
    resource: e,
  })), [rows]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return rows.filter(e => e.start >= now).sort((a,b)=>a.start-b.start).slice(0, 20);
  }, [rows]);

  const openNew = useCallback((s = null) => { setSlot(s); setIsModalOpen(true); }, []);
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

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const components = useMemo(() => ({ event: EventCell }), []);

  return (
    // Always center the overlay on the full screen (covers nav too)
<div
  className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  onClick={onClose}
>


      <style>{rbcCss}</style>

      {/* Centered container: two columns, Incoming on the LEFT, both white */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-[min(96vw,1200px)] max-h-[88vh]
          rounded-2xl border border-neutral-300 bg-white p-3 md:p-4
          shadow-[0_20px_60px_rgba(0,0,0,.35)]
          grid grid-cols-[300px_1fr] gap-3
          text-black
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-4 -right-4 h-9 w-9 rounded-full bg-white text-black shadow-lg border border-neutral-200 hover:bg-neutral-100"
        >
          ×
        </button>

        {/* LEFT: Incoming (solid white) */}
        <aside className="rounded-xl border border-neutral-200 bg-white p-3 md:p-3.5 overflow-auto">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-widest bg-white text-neutral-700">INCOMING</h3>
            <button
              onClick={() => openNew()}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-neutral-100"
              title="Add Event"
            >
              + Add Event
            </button>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-xs text-neutral-500">No upcoming events in this view.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((e) => (
                <li
                  key={e._id}
                  className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 hover:bg-neutral-100"
                  title={e.description || ""}
                >
                  <div className="text-[13px] font-medium">{e.title}</div>
                  <div className="text-[11px] text-neutral-600">
                    {moment(e.start).format("ddd, MMM D • h:mm a")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* RIGHT: Calendar (white) */}
        <div className="rounded-xl border border-neutral-200 bg-white p-2 md:p-3">
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
            onSelectSlot={(s) => openNew(s)}
            components={components}
            step={30}
            timeslots={2}
            min={new Date(1970, 1, 1, 6, 0)}
            max={new Date(1970, 1, 1, 22, 0)}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: "70vh" }}
          />
        </div>

        {/* Add-event modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[120] grid place-items-center bg-black/60"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-[min(92vw,560px)] max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-300 bg-white p-4 text-black"
            >
              <h3 className="mb-2 text-base font-semibold">Add Calendar Item</h3>
              <EventEditor
                initial={slot}
                onCreate={async (payload) => await handleCreateEvent(payload)}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventEditor({ initial, onCreate, onClose }) {
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

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const s = moment(start), e2 = moment(end);
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
      onClose?.();
    } catch (er) {
      setErr(er.message || "Failed to create.");
    } finally { setBusy(false); }
  }

  const input = "w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-black";

  return (
    <form onSubmit={submit} className="space-y-3 text-black">
      <div>
        <label className="block text-sm text-neutral-700">Access Code</label>
        <input className={input} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code (e.g. 13647)" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-neutral-700">Your alias (optional)</label>
          <input className={input} value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="name or org" />
        </div>
        <label className="flex items-end gap-2 text-neutral-700">
          <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
          <span className="text-sm">All day</span>
        </label>
      </div>
      <div>
        <label className="block text-sm text-neutral-700">Title</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" required />
      </div>
      <div>
        <label className="block text-sm text-neutral-700">Description (optional)</label>
        <textarea className={`${input} min-h-[84px]`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Details, location, link…" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-neutral-700">Starts</label>
          <input type="datetime-local" className={input} value={start} onChange={(e) => setStart(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-neutral-700">Ends</label>
          <input type="datetime-local" className={input} value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-neutral-200 text-black hover:bg-neutral-300">Cancel</button>
        <button type="submit" disabled={busy} className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-900 disabled:opacity-50">
          {busy ? "Saving…" : "Add Event"}
        </button>
      </div>
    </form>
  );
}
