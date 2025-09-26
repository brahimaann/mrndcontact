"use client";
import { useState, useMemo, useEffect } from "react";
import ButtonNav from "./components/ButtonNav";
import CalanderScreen from "./components/CalanderScreen";

const MOCK_FEATURED = [
  { id: "a1", title: "SANKTUARY LOOK 01", artist: "Ama", type: "photo" },
  { id: "a2", title: "Late Night Loop", artist: "Baba", type: "audio" },
  { id: "a3", title: "Short Film: Corner Store", artist: "Manny", type: "video" },
];
const MOCK_EVENTS = [
  { id: "e1", date: "2025-09-05", title: "Gallery Pop-Up" },
  { id: "e2", date: "2025-09-11", title: "Submission Deadline" },
  { id: "e3", date: "2025-09-29", title: "Alasan bday" },
];

export default function HomePage() {
  const [expandedCal, setExpandedCal] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  return (
    <main className="min-h-screen w-full bg-black text-white">
      {/* top nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center gap-3">
          <button onClick={()=>setCitiesOpen(true)} className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-white/10 hacker">Cities</button>
          <ButtonNav href="/projects"  className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-white/10 hacker">Projects</ButtonNav>
          <ButtonNav href="/portfolio" className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-white/10 hacker">Portfolio</ButtonNav>
          <ButtonNav href="/contact"   className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-white/10 hacker">Join the Movement</ButtonNav>
        </div>
      </section>

      <Hero />

      <Featured items={MOCK_FEATURED} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Culture in Motion</h2>
        {!expandedCal ? (
          <MiniCalendar events={MOCK_EVENTS} onExpand={()=>setExpandedCal(true)} />
        ) : (
          <div className="relative">
            <div className="flex justify-end mb-2">
              <button onClick={()=>setExpandedCal(false)} className="px-3 py-1 text-sm rounded border border-white/20 hover:bg-white/10">Collapse</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              <div className="rounded-xl border border-white/15 p-2 bg-black/40">
                <CalanderScreen/>
              </div>
              <TimelineRail events={MOCK_EVENTS}/>
            </div>
          </div>
        )}
      </section>

      <Pillars />
      <Updates />

      {citiesOpen && <CitiesPasswordOverlay onClose={()=>setCitiesOpen(false)} />}
      <VaultKey />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-50"
           style={{backgroundImage:"radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.15), transparent), url('/hero-texture.png')",backgroundSize:"cover",backgroundPosition:"center"}}/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Culture Lives Here.</h1>
        <p className="mt-4 max-w-2xl text-white/80">The living archive of Minnesota’s creative movement—artists, builders, and the community shaping what’s next.</p>
        <div className="mt-8 flex gap-3">
          <a href="#featured" className="px-5 py-3 rounded-lg bg-white text-black hover:opacity-90">Explore the Movement</a>
          <a href="/contact" className="px-5 py-3 rounded-lg border border-white/20 hover:bg-white/10">Join the Movement</a>
        </div>
      </div>
    </section>
  );
}

function Featured({ items }) {
  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl font-semibold mb-4">Featured Work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it)=>(
          <article key={it.id} className="group rounded-xl border border-white/10 p-4 hover:border-white/30 transition">
            <div className="aspect-video w-full rounded-lg bg-white/5 grid place-items-center text-white/60">
              <span className="text-sm">{it.type.toUpperCase()} PREVIEW</span>
            </div>
            <h3 className="mt-3 font-medium">{it.title}</h3>
            <p className="text-white/60 text-sm">{it.artist}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MiniCalendar({ events, onExpand }) {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const first = new Date(y, m, 1), start = first.getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const dots = useMemo(()=> new Set(events.map(e => e.date)), [events]);
  const cells = [];
  for (let i=0;i<42;i++){
    const d = i - start + 1;
    const inMonth = d>=1 && d<=days;
    const dateStr = inMonth ? new Date(y,m,d).toISOString().slice(0,10) : null;
    const hasEvent = inMonth && dots.has(dateStr);
    cells.push(
      <div key={i} className={`relative h-10 w-10 grid place-items-center rounded-sm border border-white/10 bg-black/40 ${inMonth?"text-white/80":"opacity-30"}`}>
        <span className="text-[11px] leading-none">{inMonth?d:""}</span>
        {hasEvent && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-white/80" />}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/15 p-3 bg-black/40">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-medium opacity-80">
          {today.toLocaleString(undefined,{month:"long",year:"numeric"})}
        </h3>
        <button onClick={onExpand} className="px-2 py-1 text-xs rounded border border-white/20 hover:bg-white/10">Open Calendar</button>
      </div>
      <div role="button" tabIndex={0} onClick={onExpand}
           onKeyDown={(e)=>((e.key==="Enter"||e.key===" ")&&onExpand())}
           className="inline-grid grid-cols-7 gap-1 cursor-pointer">
        {["S","M","T","W","T","F","S"].map((d, i) => (
  <div key={i} className="text-[10px] text-white/50 px-1">{d}</div>
))}
        {cells}
      </div>
    </div>
  );
}

function TimelineRail({ events }) {
  const sorted = [...events].sort((a,b)=> new Date(a.date)-new Date(b.date));
  return (
    <aside className="rounded-xl border border-white/15 p-3 bg-black/40 h-full">
      <h4 className="text-sm font-medium mb-3 opacity-80">Cultural Timeline</h4>
      <ol className="space-y-4 text-sm">
        {sorted.map(e=>(
          <li key={e.id} className="relative pl-4">
            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-white/80"/>
            <div className="text-white/70">{new Date(e.date).toLocaleDateString()}</div>
            <div className="font-medium">{e.title}</div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function Pillars() {
  const items = [
    { t:"Equity", d:"Redistributing access to funding, platforms, and visibility." },
    { t:"Collaboration", d:"Artists, builders, and community shaping the work together." },
    { t:"Growth", d:"Opportunities, deadlines, and tools that create leverage." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-xl font-semibold mb-6">Our Pillars</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(x=>(
          <div key={x.t} className="rounded-xl border border-white/15 p-5 bg-black/40">
            <h3 className="font-semibold mb-1">{x.t}</h3>
            <p className="text-white/70 text-sm">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Updates(){
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl font-semibold mb-4">Updates & Recaps</h2>
      <div className="rounded-xl border border-white/15 p-5 bg-black/40">
        <p className="text-white/70 text-sm">Latest stories from the movement. <a className="underline" href="/archive">Browse the archive →</a></p>
      </div>
    </section>
  );
}

function CitiesPasswordOverlay({ onClose }) {
  const [pwd, setPwd] = useState(""); const [err,setErr]=useState(""); const [submitting,setSubmitting]=useState(false);
  useEffect(()=>{ const k=(e)=>e.key==="Escape"&&onClose(); window.addEventListener("keydown",k); return ()=>window.removeEventListener("keydown",k);},[onClose]);
  const submit=async(e)=>{ e.preventDefault(); if(submitting) return; setErr(""); setSubmitting(true);
    try{
      const res=await fetch("/api/poi-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pwd.trim()})});
      if(!res.ok) throw new Error("bad"); const data=await res.json();
      window.location.href = data.slug ? `/poi/${encodeURIComponent(data.slug)}` : "/user";
    }catch{ setErr("Incorrect password"); } finally{ setSubmitting(false); }
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} aria-label="Close"
              className="absolute top-4 right-4 h-10 w-10 rounded-full border border-white/30 hover:bg-white/10">×</button>
      <div role="dialog" aria-modal="true" className="min-h-screen grid place-items-center px-4" onClick={(e)=>e.stopPropagation()}>
        <form onSubmit={submit} className="w-full max-w-md bg-black border border-white/15 rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold">Enter Cities Project Password</h3>
          <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="Password"
                 className="w-full bg-black border border-white/20 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" required autoFocus/>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-white/20 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-white text-black rounded">{submitting?"Checking…":"Submit"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VaultKey(){
  const [open,setOpen]=useState(false); const [pwd,setPwd]=useState(""); const [msg,setMsg]=useState("");
  const submit=async(e)=>{ e.preventDefault(); setMsg(""); try{
    const r=await fetch("/api/poi-login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pwd.trim()})});
    if(!r.ok) throw new Error(); setMsg("Unlocked."); window.location.reload();
  }catch{ setMsg("No."); }};
  return (
    <div className="fixed left-4 bottom-4 z-[60]">
      {!open?(
        <button onClick={()=>setOpen(true)} className="h-10 w-10 rounded-full border border-white/20 grid place-items-center hover:bg-white/10" title="N">N</button>
      ):(
        <form onSubmit={submit} className="flex items-center gap-2 bg-black/70 border border-white/20 rounded-xl px-3 py-2">
          <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="Key"
                 className="bg-transparent outline-none text-sm w-32" autoFocus />
          <button className="text-xs px-2 py-1 rounded border border-white/20 hover:bg-white/10">Open</button>
          <button type="button" onClick={()=>setOpen(false)} className="text-xs px-2 py-1 rounded hover:bg-white/10">×</button>
          {msg && <span className="text-xs text-white/60 ml-1">{msg}</span>}
        </form>
      )}
    </div>
  );
}
