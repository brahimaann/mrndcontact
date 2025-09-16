"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [phase, setPhase] = useState("loader"); // 'loader' -> 'split' -> 'loading'
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const handleEnter = () => setPhase("split");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMsg("");
    setSubmitting(true);

    try {
      const pwd = password.trim();
      const res = await fetch("/api/poi-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      if (!res.ok) {
        // Incorrect password UX: show message, shake, clear, refocus
        setErrorMsg("Incorrect password");
        setShake(true);
        setPassword("");
        setSubmitting(false);
        // finish the shake after 500ms
        setTimeout(() => setShake(false), 500);
        // put focus back for fast re-try
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }

      const { slug } = await res.json(); // backend returns slug on success
      // Loading transition before redirect
      setPhase("loading");
      // Give the animation a brief moment to show
      setTimeout(() => {
        router.push(`/poi/${encodeURIComponent(slug)}`);
      }, 500);
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  // Initial “Enter” screen
  if (phase === "loader") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <button
          onClick={handleEnter}
          className="rounded-2xl px-8 py-4 border border-white/20 hover:border-white transition"
        >
          Enter
        </button>
      </main>
    );
  }

  // Fullscreen loading transition after successful password
  if (phase === "loading") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-lg">
          <div className="h-4 w-4 rounded-full bg-white/90 animate-ping" />
          <span>Loading your page…</span>
        </div>

        {/* extra polish: subtle fade-in */}
        <style jsx>{`
          main {
            animation: fadeIn 240ms ease-out both;
          }
          @keyframes fadeIn {
            from { opacity: 0 }
            to   { opacity: 1 }
          }
        `}</style>
      </main>
    );
  }

  // Split view (password + contact link)
  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Left: Password box */}
      <section className="flex items-center justify-center p-8 bg-neutral-100">
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
        >
          <h1 className="text-xl font-semibold text-neutral-900 text-center">
            Enter password
          </h1>

          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 transition ${
              errorMsg
                ? "border-red-400 focus:ring-red-300"
                : "border-neutral-300 focus:ring-black/50"
            } ${shake ? "animate-shake" : ""}`}
            required
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-black text-white py-3 hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Checking…" : "Submit"}
          </button>

          {/* Status / helper */}
          <p
            aria-live="polite"
            className={`text-center text-sm min-h-[1.25rem] ${
              errorMsg ? "text-red-500" : "text-neutral-500"
            }`}
          >
            {errorMsg || "Use the password provided to you."}
          </p>
        </form>
      </section>

      {/* Right: Contact shortcut */}
      <section className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm bg-neutral-100 rounded-2xl shadow p-6 flex flex-col items-center gap-4">
          <h2 className="text-lg font-medium text-neutral-900 text-center">
            Lock in w us
          </h2>

          <Link
            href="/contact"
            className="w-full text-center rounded-lg bg-black text-white py-3 hover:opacity-90 transition"
          >
            Contact Page
          </Link>

          <p className="text-xs text-neutral-500 text-center">
            This will take you to the contact form.
          </p>
        </div>
      </section>

      {/* Tiny CSS for the shake animation */}
      <style jsx global>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-6px) }
          40% { transform: translateX(6px) }
          60% { transform: translateX(-4px) }
          80% { transform: translateX(4px) }
        }
        .animate-shake {
          animation: shakeX 500ms ease;
        }
      `}</style>
    </main>
  );
}
