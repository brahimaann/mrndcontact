"use client";
import Link from "next/link";

const links = [
  ["Cities", "#cities"],
  ["Projects", "#projects"],
  ["Portfolio", "/portfolio"],
  ["Map", "#map"],
];

export default function HudSidebar() {
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
      </nav>
    </aside>
  );
}
