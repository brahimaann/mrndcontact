"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PASSWORD_TO_SLUG } from "./poi/poi_passwords";

export default function Home() {
  const [phase, setPhase] = useState("loader");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEnter = () => setPhase("split");

const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const pwd = password.trim();
    const res = await fetch("/api/poi-login/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password : pwd }),
    });
    if (!res.ok) {
      alert("Invalid password. Please try again.");
      return;
    }
    const { slug } = await res.json();
    router.push(`/poi/${encodeURIComponent(slug)}`);
};

  if (phase === "loader") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        {/* Replace this with your actual loader UI if you already have one */}
        <button
          onClick={handleEnter}
          className="rounded-2xl px-8 py-4 border border-white/20 hover:border-white transition"
        >
          Enter
        </button>
      </main>
    );
  }

  // SPLIT VIEW
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black/50"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white py-3 hover:opacity-90 transition"
          >
            Submit
          </button>

          {/* Optional helper text / status */}
          <p className="text-xs text-neutral-500 text-center">
            Use the password given
          </p>
        </form>
      </section>

      {/* Right: Button into contact page */}
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
    </main>
  );
}
