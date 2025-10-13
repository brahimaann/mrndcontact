// app/admin/talents/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";

const PAGE_SIZE = 25;

export default function TalentRosterPage() {
  const [term, setTerm] = useState("");
  const [cursor, setCursor] = useState(undefined);

  const data = useQuery(
    term ? api.talents.searchTalents : api.talents.listTalents,
    term
      ? { term, cursor, pageSize: PAGE_SIZE }
      : { cursor, pageSize: PAGE_SIZE }
  );

  useEffect(() => {
    setCursor(undefined);
  }, [term]);

  const page = data?.page ?? [];
  const continueCursor = data?.continueCursor;
  const isDone = data?.isDone ?? true;

  return (
    <>
    <div className="flex justify-center pt-5 mb-4 min-[550px]:hidden"> {/* Added a wrapper for centering and padding */}
         <Link href="/" className="block" aria-label="Go to Home">
        <Image
            src="/MRND%20TP.png" // or "/mrnd-tp.png" if you renamed
            alt="Modern Renaissance — Home"
            width={160} // tweak as needed
            height={60} // tweak as needed
            priority
            // Keep only centering and necessary sizing/visual classes
            className="mx-auto h-12 w-auto object-center hover:opacity-90 transition"
        />
        </Link>
      </div>
    <div className="ml-[calc(6rem+1in)] max-[550px]:ml-[calc(6rem)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold"> Roster</h1>

        {/* REVISED BUTTON: Styled as a black item with inverse hover */}
        <Link
          href="/admin/talents/new"
          className="link-black w-full md:w-auto rounded-xl border border-black/40 px-4 py-3 text-sm
          text-black visited:text-black hover:bg-black hover:text-white transition text-center"
        >
          + Add New Talent
        </Link>

      </header>

      <div className="mt-4">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by name…"
          className="w-full  border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder-white/40"
        />
      </div>

        {/* 3. Roster List: Converted from horizontal table row to vertical, clean list view */}
      <div className="mt-6  overflow-hidden">
        {page.length > 0 ? (
          // Use a simple DIV structure for mobile-friendly stacking
          <div className="w-full text-sm">
            {page.map((row) => (
              // Use block-level list items for better touch targets
              <div 
                key={row._id} 
                className="border-t border-white/10 bg-white/5 last:border-b last:border-white/10"
              >
                {/* Full-width link for better tapping */}
                <Link
                  href={`/admin/talents/${row._id}`}
                  className="link-black text-black visited:text-black hover:text-black block px-4 py-3"
                >
                  {row.name}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // No results state
          <div className="px-4 py-6 text-white/60 text-sm">No results</div>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="mt-4 flex gap-3 justify-center md:justify-start">
        <button
          onClick={() => setCursor(undefined)}
          disabled={!cursor}
          className="rounded-lg border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
        >
          First
        </button>
        <button
          onClick={() => setCursor(continueCursor)}
          disabled={isDone}
          className="rounded-lg border border-white/20 px-3 py-1 text-sm disabled:opacity-40"
        >
          Next →
        </button>
      </div>

    </div>
    </>
  );
}
