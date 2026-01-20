"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "../../lib/cn";

// Keep label order + routes here
const ITEMS = [
  { label: "media",       href: "/works",      type: "photo" },
  { label: "photos",      href: "/works/photos", type: "photo" },
  { label: "writing",     href: "/works/writing", type: "writing" },
  { label: "performance", href: "/works/performance", type: "performance" },
  { label: "video",       href: "/works/video", type: "video" },
];

export default function WorksNav() {
  const pathname = usePathname(); // App Router hook for active state
  
  // Query works count for each type
  const photos = useQuery(api.works.listWorksByMedium, { type: "photo", limit: 1 }) || [];
  const writing = useQuery(api.works.listWorksByMedium, { type: "writing", limit: 1 }) || [];
  const performance = useQuery(api.works.listWorksByMedium, { type: "performance", limit: 1 }) || [];
  const video = useQuery(api.works.listWorksByMedium, { type: "video", limit: 1 }) || [];
  
  // Create a map of type to hasContent
  const hasContent = {
    photo: photos.length > 0,
    writing: writing.length > 0,
    performance: performance.length > 0,
    video: video.length > 0,
  };
  
  // Filter items to only show those with content (media always shows if photos exist)
  const visibleItems = ITEMS.filter((item) => {
    if (item.label === "media") {
      return hasContent.photo; // Show media tab if there are photos
    }
    return hasContent[item.type];
  });
  
  return (
    <nav className="mb-4">
      <ul className="flex list-none flex-wrap items-center gap-3 text-[1rem] font-[var(--font-dogica,monospace)] tracking-[0.35em] uppercase">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-2  link-black leading-[1.5] hover:bg-white/10 transition",
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
