// app/portfolio/page.js
import Link from "next/link";
import InfiniteListClient from "./InfiniteListClient";

export const metadata = { title: "Portfolio Portal" };

export default function PortfolioPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Portfolio Portal</h1>
          <Link href="/" className="text-sm underline text-neutral-600 hover:text-neutral-900">
            ← Back
          </Link>
        </header>

        {/* Infinite, vertical list of buttons */}
        <InfiniteListClient />

        <p className="text-xs text-neutral-500 mt-6">
          *Dummy list for now — wired up to dynamic slug pages.
        </p>
      </section>
    </main>
  );
}
