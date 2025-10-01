"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const links = [
  ["Cities", "#cities"],
  ["Projects", "#projects"],
  ["Portfolio", "/portfolio"],
  ["Map", "#map"],
];

export default function HudSidebar() {
  const { isSignedIn } = useUser();
  // Fixed left HUD with 0.5in padding on BOTH sides
  // width = 10rem, margin-left on main uses calc(10rem + 1in)
  return (
    <aside className="fixed left-0 top-5 h-screen w-[6rem] px-5  z-40">
      <nav className="h-[80%] flex flex-col items-center justify-between py-8 text-black">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="text-[11px] tracking-[0.25em] uppercase hover:opacity-70 vertical-text"
          >
            <span className="chip chip--invert">{label}</span>
          </Link>
        ))}
        {isSignedIn && (
        <Link
          href="/profile"
          className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 hover:bg-white hover:text-black transition"
          title="Profile"
          aria-label="Profile"
        >
          {/* silhouette icon (inline) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#000" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#000" />
          </svg>
          <span className="sr-only">Profile</span>
        </Link>
      )}
      </nav>
      
    </aside>
  );
}
