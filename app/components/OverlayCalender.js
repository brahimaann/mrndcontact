"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import OverlayWindow from "./OverlayWindow";

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

export default function OverlayCalender({
  onClose,
  title = "Calendar",
}) {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(() => computeRange(Views.MONTH, new Date()));
  const [slot, setSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const components = useMemo(() => ({ event: EventCell }), []);

  return (
    <OverlayWindow
      title={title}
      initial={{ x: 32, y: 150, width: 1100, height: 680 }}
      onClose={onClose}
      zIndex={9999}           // ⬅ ensure on top
    >
      <style>{rbcCss}</style>

      {/* Ensure the window content has height to give to the calendar */}
      <div className="h-full min-h-0 bg-white">
        <div className="relative w-full h-full grid grid-cols-[300px_1fr] gap-3 text-black">
          {/* LEFT: Incoming */}
          <aside className="rounded-xl border border-neutral-200 bg-white p-3 overflow-auto">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-widest text-neutral-700">INCOMING</h3>
              <button
                onClick={() => openNew()}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
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
                  <li key={e._id} className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 hover:bg-neutral-100" title={e.description || ""}>
                    <div className="text-[13px] font-medium">{e.title}</div>
                    <div className="text-[11px] text-neutral-600">
                      {moment(e.start).format("ddd, MMM D • h:mm a")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* RIGHT: Calendar */}
          <div className="rounded-xl border border-neutral-200 bg-white p-2 overflow-hidden">
            <div className="h-full min-h-0">
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
                style={{ height: "100%" }}   // ← gets real height now
              />
            </div>
          </div>
        </div>
      </div>
    </OverlayWindow>
  );
}
