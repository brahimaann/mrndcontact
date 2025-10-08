// app/admin/talents/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
    <div className="ml-[calc(6rem+1in)] mr-0 lg:mr-[22rem] px-6 md:px-10 pt-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold"> Roster</h1>

        {/* REVISED BUTTON: Styled as a black item with inverse hover */}
        <Link
          href="/admin/talents/new"
          className="link-black rounded-xl border border-black/40 px-4 py-2 text-sm
          text-black visited:text-black hover:bg-black hover:text-white transition"
        >
          + Add New Talent
        </Link>

      </header>

      <div className="mt-4">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by name…"
          className="w-full  rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder-white/40"
        />
      </div>

      <div className="mt-6 border border-white/15 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {page.map((row) => (
              <tr key={row._id} className="border-t border-white/10">
                <td className="px-4 py-2 text-black">
                  <Link
                    href={`/admin/talents/${row._id}`}
                    className="link-black text-black visited:text-black hover:text-black
                 "
                  >
                    {row.name}
                  </Link>
                </td>

              </tr>
            ))}
            {page.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-white/60">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-3">
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
  );
}
