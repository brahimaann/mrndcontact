// app/calendar/page.js
"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useMemo, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";


const localizer = momentLocalizer(moment);

// Monochrome overrides for RBC (kept inside component)
const rbcCss = `
.rbc-calendar { background:#fff; color:#000; border:1px solid #d5d5d5; }
.rbc-toolbar { color:#000; border-bottom:1px solid #dfdfdf; padding:8px 12px; }
.rbc-toolbar button { background:#eee; color:#000; border:1px solid #ccc; padding:6px 10px; }
.rbc-toolbar button:hover { background:#e7e7e7; }
.rbc-month-view, .rbc-time-view { border-color:#ddd; }
.rbc-off-range-bg { background:#f4f4f4; }
.rbc-today { background:#f0f0f0; }
.rbc-event { background:#eee; border:1px solid #c5c5c5; color:#000; }
.rbc-selected-cell { background:#efefef; }
.rbc-time-header, .rbc-time-content, .rbc-month-row { border-color:#ddd; }
.rbc-current-time-indicator { background:#000; }
`;

export default function CalendarScreen() {
  // keep the window we’re showing (so we only fetch that range)
  const [range, setRange] = useState({ from: null, to: null });
  const [modal, setModal] = useState(null); // {start, end} or null

  const eventsRaw = useQuery(api.events.listEvents, {
    from: range.from ?? undefined,
    to: range.to ?? undefined,
    limit: 1000,
  });

  const createEvent = useMutation(api.events.createEvent);

  const events = useMemo(() => {
    if (!eventsRaw) return [];
    return eventsRaw.map((e) => ({
      id: e._id,
      title: e.title,
      start: new Date(e.start),
      end: new Date(e.end),
      allDay: e.allDay ?? false,
      resource: e,
    }));
  }, [eventsRaw]);

  const onRangeChange = useCallback((r) => {
    // r can be: array of dates (month view) or {start,end} (time views)
    if (Array.isArray(r) && r.length) {
      const from = +moment(r[0]).startOf("day");
      const to = +moment(r[r.length - 1]).endOf("day");
      setRange({ from, to });
    } else if (r?.start && r?.end) {
      const from = +moment(r.start).startOf("day");
      const to = +moment(r.end).endOf("day");
      setRange({ from, to });
    }
  }, []);

  const onSelectSlot = useCallback((slotInfo) => {
    setModal({
      start: slotInfo.start,
      end: slotInfo.end,
      allDay: !!slotInfo.action && slotInfo.action !== "select",
    });
  }, []);

  const closeModal = () => setModal(null);

  return (
    <main className="min-h-screen w-full p-4 bg-white text-black">
      <style>{rbcCss}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Events & Key Dates</h1>
        <p className="text-sm opacity-70 mb-4">
          Browse upcoming events. Have access? Select a day/time to add an item.
        </p>

        <div className="bg-white rounded-xl  p-2">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: "calc(100vh - 190px)" }}
            onRangeChange={onRangeChange}
            onSelectSlot={onSelectSlot}
          />
        </div>
      </div>

      {modal && (
        <AddEventModal
          initial={modal}
          onClose={closeModal}
          onCreate={async (payload) => {
            await createEvent({
              code: payload.code, // must be 13647 by default
              title: payload.title,
              description: payload.description || "",
              start: +payload.start,
              end: +payload.end,
              allDay: !!payload.allDay,
              alias: payload.alias || undefined,
            });
            closeModal();
          }}
        />
      )}
    </main>
  );
}

function AddEventModal({ initial, onClose, onCreate }) {
  const [code, setCode] = useState("");
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [allDay, setAllDay] = useState(!!initial.allDay);
  const [start, setStart] = useState(moment(initial.start).format("YYYY-MM-DDTHH:mm"));
  const [end, setEnd] = useState(moment(initial.end).format("YYYY-MM-DDTHH:mm"));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

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
      setBusy(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-black border border-white/15 rounded-xl p-4 space-y-3"
      >
        <h2 className="text-xl font-semibold">Add Calendar Item</h2>

        <label className="block text-sm opacity-80">Access Code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code (e.g. 13647)"
          className="w-full bg-black border border-white/20 rounded px-3 py-2"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm opacity-80">Your alias (optional)</label>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="name or org"
              className="w-full bg-black border border-white/20 rounded px-3 py-2"
            />
          </div>

          <div className="flex items-end gap-2">
            <input
              id="allday"
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />
            <label htmlFor="allday" className="text-sm opacity-80">All day</label>
          </div>
        </div>

        <label className="block text-sm opacity-80">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full bg-black border border-white/20 rounded px-3 py-2"
          required
        />

        <label className="block text-sm opacity-80">Description (optional)</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Details, location, link…"
          className="w-full bg-black border border-white/20 rounded px-3 py-2 min-h-[80px]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm opacity-80">Starts</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-black border border-white/20 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm opacity-80">Ends</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-black border border-white/20 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {err && <p className="text-red-400 text-sm">{err}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-white/20 rounded">
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 bg-white text-black rounded hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
