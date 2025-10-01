"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WelcomeBanner({ className = "" }) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const profile = useQuery(api.profile.getMyProfile, isSignedIn ? {} : "skip");

  if (!isSignedIn) return null;

  const display =
    (profile?.alias && profile.alias.trim()) ||
    (profile?.name && profile.name.trim()) ||
    user?.fullName ||
    user?.username ||
    "Guest";

  return (
    <div
      className={
        "inline-flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2 " +
        "text-sm md:text-base tracking-wide " +
        className
      }
    >
      <span>Welcome&nbsp;{display}</span>

      {/* logout button */}
      <button
        onClick={() => signOut()}
        aria-label="Sign out"
        title="Sign out"
        className=" ml-[2rem] rounded-lg pl-2 border border-white/20 p-1 hover:bg-white hover:text-black transition"
      >
        {/* minimalist door/arrow icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 12h11M10 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
