"use client";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function HudSidebar({}) {
  const { isSignedIn } = useUser();
  const isAdmin = useQuery(api.admin.isAdmin, isSignedIn ? {} : "skip");
  const pathname = usePathname();

  const Item = ({ id, label, href, active, onClick }) => (
    <li key={id}>
      {href ? (
        <Link
          href={href}
          className="text-[11px] tracking-[0.25em] uppercase hover:opacity-70 vertical-text"
          title={label}
          aria-label={label}
        >
          <span
            className={`chip chip--invert ${active ? "ring-2 ring-black" : ""}`}
          >
            {label}
          </span>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="text-[11px] tracking-[0.25em] uppercase hover:opacity-70 vertical-text"
          title={label}
          aria-label={label}
        >
          <span
            className={`chip chip--invert ${active ? "ring-2 ring-black" : ""}`}
          >
            {label}
          </span>
        </button>
      )}
    </li>
  );

  return (
    <aside className="fixed left-0 top-5 h-screen w-[6rem] px-5 z-40">
      <div className="px-4 pt-4 pb-3 rotate-0 [writing-mode:horizontal-tb]">
        <Link href="/" className="block" aria-label="Go to Home">
          {/* If you kept the space in the filename */}
          <Image
            src="/MRND%20TP.png" // or "/mrnd-tp.png" if you renamed
            alt="Modern Renaissance — Home"
            width={160} // tweak as needed
            height={60} // tweak as needed
            priority
            className="mx-auto h-12 w-auto object-contain hover:opacity-90 transition"
          />
        </Link>
      </div>

      <nav className="h-[80%] flex flex-col items-center justify-between py-8">
        <ul className="flex flex-col  items-center gap-12 py-3">
          <Item
            id="cities"
            label="Cities"
            href="/cities"
            active={pathname === "/cities"}
          />

          {isSignedIn && isAdmin && (
            <Item
              id="admin"
              label="Admin"
              active={pathname === "/admin/talents"}
              href="/admin/talents"
              className="mt-4 block px-4 py-2 rounded-lg  text-sm hover:bg-white hover:text-black rotate-[-90] transition"
            >
              Admin
            </Item>
          )}

          {isSignedIn && (
            <Link
              href="/profile"
              className="mt-4 inline-flex items-center gap-4 px-3 py-2 rounded-xl  border-white/20 hover:bg-white hover:text-black transition"
              title="Profile"
              aria-label="Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle cx="12" cy="8" r="4" stroke="currentColor" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" />
              </svg>
              <span className="sr-only">Profile</span>
            </Link>
          )}
        </ul>
      </nav>
    </aside>
  );
}
