"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/cn";

export default function AdminIndex() {
  const { user, isSignedIn } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || undefined;
  const phone = user?.primaryPhoneNumber?.phoneNumber || undefined;
  const clerkId = user?.id || undefined;

  const isAdmin = useQuery(api.users.isAdmin, { email, phone, clerkId }) || false;

  if (!isSignedIn) {
    return (
      <main className="bg-black text-white min-h-screen grid place-items-center p-6">
        <div className="border border-white/40 p-6 text-center">
          <div className="text-sm uppercase tracking-[0.3em]">Please sign in</div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="bg-black text-white min-h-screen grid place-items-center p-6">
        <div className="border border-white/40 p-6 text-center">
          <div className="text-sm uppercase tracking-[0.3em]">Admins only</div>
          <p className="text-xs opacity-70 mt-2">Your account doesn’t have access to this tool.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="ml-[calc(6rem+1in)] lg:mr-[22rem] px-6 md:px-10 py-10">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
            [ ADMIN · DASHBOARD ]
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-80">
            talents · works · media
          </p>
        </header>

        {/* Actions row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {/* Add New Talent */}
          <Link
            href="/admin/talents/new"
            className={cn(
              "group border border-white/40 hover:bg-white/10 transition p-5",
              "flex items-center justify-between"
            )}
          >
            <div>
              <div className="text-sm uppercase tracking-[0.3em]">Add New Talent</div>
              <p className="text-xs opacity-70 mt-1">
                Create a profile for an artist (bio, tags, portrait).
              </p>
            </div>
            <span className="text-xl group-hover:translate-x-0.5 transition">+</span>
          </Link>

          {/* Add New Work */}
          <Link
            href="/admin/works/new"
            className={cn(
              "group border border-white/40 hover:bg-white/10 transition p-5",
              "flex items-center justify-between"
            )}
          >
            <div>
              <div className="text-sm uppercase tracking-[0.3em]">Add New Work</div>
              <p className="text-xs opacity-70 mt-1">
                Upload cover, set title/type, and document a work.
              </p>
            </div>
            <span className="text-xl group-hover:translate-x-0.5 transition">+</span>
          </Link>
        </section>

        {/* You can add more admin cards here later (Events, Posts, Media Library, etc.) */}
      </div>
    </main>
  );
}
