"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Sticky header with always-accessible nav buttons */
export default function Header() {
  return (
    <header
      className="
        fixed top-0 left-0 right-0
        z-[90]                /* above floating mini-map & overlay */
        border-b border-white/10
        bg-black/60 backdrop-blur-lg
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-wide">MRND</a>
          <NavBar />
        </div>
      </div>
    </header>
  );
}

function NavBar() {
  return (
    <div className="grid grid-cols-4 gap-2 max-w-[560px]">
      <NavButton href="#cities">Cities</NavButton>
      <NavButton href="/projects">Projects</NavButton>
      <NavButton href="/portfolio">Portfolio</NavButton>
      <NavButton href="#join">Join</NavButton>
    </div>
  );
}

/** Button with brief loading state then navigate */
function NavButton({ href, children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const go = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        window.location.hash = id;
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setLoading(false);
      } else {
        router.push(href);
      }
    }, 350);
  };

  return (
    <button
      onClick={go}
      disabled={loading}
      className="
        w-full px-4 py-2 text-center text-sm rounded-md border
        bg-white text-black border-black
        hover:bg-black hover:text-white transition-colors
        disabled:opacity-60
      "
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
