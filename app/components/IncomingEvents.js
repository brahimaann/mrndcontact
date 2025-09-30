"use client";

export default function IncomingEvents({ events = [] }) {
  const data = events.length
    ? events
    : [
        { date: "2025-10-01", title: "OPERATION: Launch Party", where: "North Loop" },
        { date: "2025-10-10", title: "BRIEFING: Artist Meet-Up", where: "Cafe Mix" },
        { date: "2025-10-14", title: "FIELD: Gallery Pop-Up", where: "Warehouse 5" },
      ];

  return (
    <aside
      className="
        w-72 rounded-xl border border-white/20 bg-black/85 text-white shadow-xl
        backdrop-blur-sm p-3 font-mono leading-tight
      "
      aria-label="Incoming events"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm tracking-widest uppercase">Incoming</h3>
        <span className="text-xs opacity-70">Transmissions</span>
      </div>

      <ul className="mt-2 space-y-2">
        {data.map((e, i) => (
          <li
            key={i}
            className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/[0.08] transition"
          >
            <p className="text-xs opacity-80">[{e.date}]</p>
            <p className="text-sm">{e.title}</p>
            {e.where && <p className="text-xs opacity-70">→ {e.where}</p>}
          </li>
        ))}
      </ul>

      <a href="#archive" className="mt-3 inline-block text-xs underline opacity-80">
        View all
      </a>
    </aside>
  );
}
