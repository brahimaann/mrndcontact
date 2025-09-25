// app/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonNav from "./components/ButtonNav";
import CalanderScreen from "./components/CalanderScreen";

export default function HomePage() {
  const [showCitiesModal, setShowCitiesModal] = useState(false);

  return (
    <main className="min-h-screen w-full bg-black text-white">
      {/* Top bar */}
       <br></br>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pt-2">
        <div className="flex items-center justify-center gap-3">
          {/* Cities Project button opens full-screen password overlay */}
          <button
            onClick={() => setShowCitiesModal(true)}
            className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-black hover:text-white hacker"
          >
            Cities 
          </button>

          {/* Other nav buttons with per-button loader */}
          <ButtonNav href="/projects"  className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-black hover:text-white hacker">Projects</ButtonNav>
          <ButtonNav href="/portfolio" className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-black hover:text-white hacker">Portfolio</ButtonNav>
          <ButtonNav href="/contact"   className="px-4 py-2 rounded-lg border border-white/20 bg-black hover:bg-black hover:text-white hacker">Contact</ButtonNav>
        </div>
      </section>

      {/* Calendar under the menu */}
      <br></br>
      <br></br>
     <CalanderScreen />

      {showCitiesModal && (
        <CitiesPasswordOverlay onClose={() => setShowCitiesModal(false)} />
      )}
    </main>
  );
}

function CitiesPasswordOverlay({ onClose }) {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErr("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/poi-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd.trim() }),
      });
      if (!res.ok) {
        setErr("Incorrect password");
        setSubmitting(false);
        return;
      }
      const { slug } = await res.json();
      router.push(`/poi/${encodeURIComponent(slug)}`);
    } catch {
      setErr("Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  return (
    // Full-screen opaque cover
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* Top-right close X */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 h-10 w-10 rounded-full border border-white/30 text-white
                   hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        ×
      </button>

      {/* Centered dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="min-h-screen grid place-items-center px-4"
        onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
      >
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-black border border-white/15 rounded-xl p-5 space-y-4 shadow-2xl"
        >
          <h3 className="text-lg font-semibold">Enter Cities Project Password</h3>

          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Password"
            className="w-full bg-black border border-white/20 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            required
            disabled={submitting}
            autoFocus
          />

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 rounded"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-white text-black rounded ${submitting ? "opacity-75 cursor-wait" : ""}`}
            >
              {submitting ? "Checking…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
