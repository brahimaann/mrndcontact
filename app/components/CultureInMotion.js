export default function CultureInMotion() {
  return (
    <section id="calendar" className="section">
      <h2 className="mb-6 text-2xl font-semibold">Culture in Motion</h2>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* Swap this with your real month/week calendar component */}
          <div className="h-96 rounded-2xl border border-white/10 bg-white/5 p-4">
            Full Calendar (month/week)
            <div className="mt-3 flex gap-2 text-sm text-white/70">
              <button className="rounded-md px-2 py-1 hover:bg-white/10">All</button>
              <button className="rounded-md px-2 py-1 hover:bg-white/10">Events</button>
              <button className="rounded-md px-2 py-1 hover:bg-white/10">Due</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-[96px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-medium">Timeline</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li>• Today — Community meetup</li>
              <li>• 10/02 — Residency kickoff</li>
              <li>• 10/10 — Photoshoot TBD</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
