export default function MissionFeed(){
  const items = [
    { date: "2025-10-01", title: "OPERATION: Launch Party", level: "PUBLIC" },
    { date: "2025-10-10", title: "BRIEFING: Artist Meet-Up", level: "ALPHA" },
    { date: "2025-11-03", title: "FIELD: Photo Walk", level: "PUBLIC" },
  ];
  return (
    <div className="card hud-card">
      <h3 className="text-xl font-semibold font-mono text-green-400 uppercase tracking-[0.18em]">
        Incoming Transmission
      </h3>
      <div className="mt-3">
        {items.map((it) => (
          <div key={it.date+it.title} className="mission-row">
            <div className="muted text-xs font-mono">{it.date}</div>
            <div className="">{it.title}</div>
            <div className="level text-xs">{it.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
