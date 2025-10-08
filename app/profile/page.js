"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Dossier-style profile editor
 * - Monochrome HUD, “TOP SECRET” stamp, photo slot
 * - Core fields: Name, Alias, Instagram
 * - Appearance block: Height, Weight, Hair, Eyes, Marks
 * - Identity block: DOB, Citizenship, Languages, Codename, File No.
 * - Location (city/region) picker with alias-friendly suggestions
 * - Save sends extras{} so you can extend Convex schema safely
 */

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useUser();

  const current = useQuery(api.profile.getMyProfile, {});
  const save = useMutation(api.profile.upsertMyProfile);
  const isAdmin = useQuery(api.admin.isAdmin, user ? {} : "skip");

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [instagram, setInstagram] = useState("");

  // dossier extras
  const [dob, setDob] = useState("");
  const [citizen, setCitizen] = useState("");
  const [languages, setLanguages] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hair, setHair] = useState("");
  const [eyes, setEyes] = useState("");
  const [marks, setMarks] = useState("");

  // LOCATION (nicknames roll up to regions later)
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [showOnMap, setShowOnMap] = useState(true);

  // Simple static list for now; swap with Convex search later
  const SUGGEST = useMemo(
    () => [
      // North America / Twin Cities cluster
      { id: "msp_region", label: "Twin Cities (Region)", kind: "region" },
      { id: "minneapolis_city", label: "Minneapolis", kind: "city", parent: "msp_region", aliases: ["mpls", "msp"] },
      { id: "saint_paul_city", label: "Saint Paul", kind: "city", parent: "msp_region", aliases: ["st paul"] },
      { id: "maple_grove_city", label: "Maple Grove", kind: "city", parent: "msp_region" },
      // King County hub
      { id: "king_county", label: "King County", kind: "county", parent: "washington_region", aliases: ["seattle area"] },
      { id: "kent_city", label: "Kent, WA", kind: "city", parent: "king_county" },
      // East coast
      { id: "nyc_city", label: "New York City", kind: "city", parent: "nyc_region", aliases: ["nyc", "new york"] },
      { id: "philadelphia_city", label: "Philadelphia", kind: "city", parent: "philly_region", aliases: ["philly"] },
      // ATL cluster
      { id: "atl_city", label: "Atlanta", kind: "city", parent: "atl_region" },
      { id: "decatur_ga_city", label: "Decatur, GA", kind: "city", parent: "atl_region", aliases: ["decatur"] },
    ],
    []
  );

  const matches = useMemo(() => {
    const q = locationInput.trim().toLowerCase();
    if (!q) return [];
    return SUGGEST.filter((s) => {
      const base = s.label.toLowerCase();
      const hit =
        base.includes(q) ||
        (s.aliases || []).some((a) => a.toLowerCase().includes(q));
      return hit;
    }).slice(0, 8);
  }, [locationInput, SUGGEST]);

  useEffect(() => {
    if (current) {
      setName(current.name ?? "");
      setAlias(current.alias ?? "");
      setInstagram(current.instagram ?? "");
      const ex = current.extras ?? {};
      setDob(ex.dob ?? "");
      setCitizen(ex.citizen ?? "");
      setLanguages(ex.languages ?? "");
      setFileNo(ex.fileNo ?? "");
      setHeight(ex.height ?? "");
      setWeight(ex.weight ?? "");
      setHair(ex.hair ?? "");
      setEyes(ex.eyes ?? "");
      setMarks(ex.marks ?? "");
      setLocationInput(ex.locationLabel ?? "");
      setSelectedLocationId(ex.locationId ?? null);
      setShowOnMap(ex.showOnMap ?? true);
    }
  }, [current]);

  const codename =
    (alias && alias.trim()) ||
    current?.alias ||
    user?.username ||
    (user?.firstName ? `${user.firstName}` : "AGENT");

  function normalizeIg(s) {
    let ig = (s || "").trim();
    if (ig.startsWith("@")) ig = ig.slice(1);
    const m = ig.match(/instagram\.com\/([^/?#]+)/i);
    if (m) ig = m[1];
    return ig;
  }

  async function onSubmit(e) {
    e.preventDefault();

    // lock the location to a known suggestion
    let picked = SUGGEST.find((s) => s.id === selectedLocationId);
    if (!picked && locationInput.trim()) {
      const q = locationInput.trim().toLowerCase();
      picked = SUGGEST.find(
        (s) =>
          s.label.toLowerCase() === q ||
          (s.aliases || []).some((a) => a.toLowerCase() === q)
      );
      if (!picked) {
        alert("Unknown location. Please pick from suggestions.");
        return;
      }
      setSelectedLocationId(picked.id);
    }

    await save({
      name: name.trim(),
      alias: alias.trim() || undefined,
      instagram: normalizeIg(instagram) || undefined,
      extras: {
        dob: dob || undefined,
        citizen: citizen || undefined,
        languages: languages || undefined,
        fileNo: fileNo || undefined,
        height: height || undefined,
        weight: weight || undefined,
        hair: hair || undefined,
        eyes: eyes || undefined,
        marks: marks || undefined,
        locationId: picked?.id || null,
        locationLabel: picked?.label || locationInput || "",
        showOnMap,
      },
    });

    router.replace("/");
  }

  if (current === undefined) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="font-mono text-black/60">Loading secure profile…</span>
      </div>
    );
  }

  return (
    <main className="relative hacker max-w-5xl mx-auto px-4 pb-16 pt-8">
      <div className="scanlines" aria-hidden></div>

      {/* Header strip */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="hud-btn"
          aria-label="Back"
          title="Back"
        >
          &larr; Back
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="px-2 py-1 text-[11px] rounded border border-black">ACCESS: {isAdmin ? "ADMIN" : "USER"}</span>
          <span className="px-2 py-1 text-[11px] rounded border border-black">CLEARANCE: {isAdmin ? "ACTIVE" : "AUTHORIZED"}</span>
        </div>
      </div>

      {/* Dossier Card */}
      <section className="hud-card rounded-2xl p-5 relative">
        

        {/* Header row: Dept + Subject */}
        <div className="flex items-start gap-6">
          {/* Subject photo */}
          <div className="shrink-0 w-[140px] aspect-[3/4] border border-black/60 rounded-lg overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.imageUrl || "/file.svg"}
              alt=""
              className="w-full h-full object-cover no-mono"
            />
          </div>

          <div className="grow">

            <h1 className="text-2xl leading-tight">
              PROFILE // <span className="font-bold">{codename}</span>
            </h1>
            <p className="mt-1 font-mono text-sm">
              Identity record linked to Clerk ID • Edits are audited.
            </p>

            {/* Quick identifiers */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="NAME">
                <input className="w-full hud-input" value={name} onChange={(e)=>setName(e.target.value)} required />
              </Field>
              <Field label="ALIAS (OPTIONAL)">
                <input className="w-full hud-input" value={alias} onChange={(e)=>setAlias(e.target.value)} />
              </Field>
              <Field label="INSTAGRAM">
                <input className="w-full hud-input" value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="@handle or url" />
              </Field>
              <Field label="FILE NO.">
                <input className="w-full hud-input" value={fileNo} onChange={(e)=>setFileNo(e.target.value)} />
              </Field>
            </div>
          </div>
        </div>

        {/* Identity block */}
        <Block title="IDENTITY">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="DATE OF BIRTH">
              <input className="w-full hud-input" value={dob} onChange={(e)=>setDob(e.target.value)} placeholder="YYYY-MM-DD" />
            </Field>
            <Field label="CITIZENSHIP">
              <input className="w-full hud-input" value={citizen} onChange={(e)=>setCitizen(e.target.value)} />
            </Field>
            <Field label="LANGUAGES">
              <input className="w-full hud-input" value={languages} onChange={(e)=>setLanguages(e.target.value)} placeholder="English, Somali, ..." />
            </Field>
            <Field label="CODENAME">
              <input className="w-full hud-input" value={alias} onChange={(e)=>setAlias(e.target.value)} />
            </Field>
          </div>
        </Block>

        {/* Appearance block */}
        <Block title="APPEARANCE">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Field label="HEIGHT">
              <input className="w-full hud-input" value={height} onChange={(e)=>setHeight(e.target.value)} placeholder="e.g., 5'9&quot; or 175 cm" />
            </Field>
            <Field label="WEIGHT">
              <input className="w-full hud-input" value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="lbs / kg" />
            </Field>
            <Field label="HAIR">
              <input className="w-full hud-input" value={hair} onChange={(e)=>setHair(e.target.value)} />
            </Field>
            <Field label="EYES">
              <input className="w-full hud-input" value={eyes} onChange={(e)=>setEyes(e.target.value)} />
            </Field>
            <Field label="MARKS">
              <input className="w-full hud-input" value={marks} onChange={(e)=>setMarks(e.target.value)} placeholder="scars, tattoos, etc." />
            </Field>
            <Field label="SHOW ON MAP">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showOnMap} onChange={(e)=>setShowOnMap(e.target.checked)} />
                <span className="text-xs">Opt-in</span>
              </label>
            </Field>
          </div>
        </Block>

        {/* Location (alias-aware) */}
        <Block title="LOCATION (CITY OR REGION)">
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <div>
              <input
                className="w-full hud-input"
                value={locationInput}
                onChange={(e)=>{ setLocationInput(e.target.value); setSelectedLocationId(null); }}
                placeholder="Type 'Maple Grove', 'Minneapolis', 'Twin Cities'…"
                list="loc-list"
              />
              <datalist id="loc-list">
                {matches.map((m)=>(
                  <option key={m.id} value={m.label} />
                ))}
              </datalist>
              {matches.length > 0 && (
                <div className="mt-2 grid gap-2">
                  {matches.map((m)=>(
                    <button
                      key={m.id}
                      type="button"
                      className={`hud-btn ${selectedLocationId===m.id ? "hud-btn--ghost" : ""}`}
                      onClick={()=>{ setLocationInput(m.label); setSelectedLocationId(m.id); }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs self-start">
              <div className="mb-1">Selected:</div>
              <div className="px-2 py-1 border inline-block rounded">{selectedLocationId ? locationInput : "—"}</div>
            </div>
          </div>
        </Block>

        {/* Footer controls */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs">LAST WRITE: live</span>
          <div className="flex gap-3">
            <button type="button" onClick={()=>router.replace("/")} className="hud-btn">Cancel</button>
            <button type="submit" onClick={onSubmit} className="hud-btn hud-btn--ghost">Save Transmission</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Block({ title, children }) {
  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-[0.18em] mb-2">{title}</div>
      <div className="border border-black rounded-xl p-4 bg-white/60">{children}</div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.2em] uppercase mb-1">{label}</div>
      {children}
    </label>
  );
}
