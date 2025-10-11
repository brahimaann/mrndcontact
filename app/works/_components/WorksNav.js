"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/cn";

// Keep label order + routes here
const ITEMS = [
  { label: "media",       href: "/works" },
  { label: "photos",      href: "/works/photos" },
  { label: "writing",     href: "/works/writing" },
  { label: "performance", href: "/works/performance" },
  { label: "video",       href: "/works/video" },
];

export default function WorksNav() {
  const pathname = usePathname(); // App Router hook for active state
  return (
    <nav className="mb-4">
      <ul className="flex flex-wrap items-center gap-3 text-sm font-[var(--font-dogica,monospace)] tracking-[0.35em] uppercase">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-2 py-1 border border-white/40 hover:bg-white/10 transition",
                  "text-white no-underline",
                  // Active = bold + dark invert per your spec
                  isActive
                    ? "bg-white text-black font-bold"
                    : "bg-black text-white"
                )}
              >
                {item.label} <span className="opacity-60">•</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
