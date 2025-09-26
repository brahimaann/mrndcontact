// app/portfolio/[slug]/page.js
import Link from "next/link";
import { ARTIST_OBJS, getArtistBySlug } from "../data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  // Prebuild pages for all dummy artists (optional but nice for speed)
  return ARTIST_OBJS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const artist = getArtistBySlug(params.slug);
  return {
    title: artist ? `${artist.name} — Portfolio` : "Artist — Portfolio",
  };
}

export default function ArtistPage({ params }) {
  const artist = getArtistBySlug(params.slug);
  if (!artist) return notFound();

  return (
    <main className="min-h-screen w-full bg-white">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6">
          <Link href="/portfolio" className="text-sm underline text-neutral-600 hover:text-neutral-900">
            ← Back to Portfolio
          </Link>
        </nav>

        <h1 className="text-3xl font-semibold">{artist.name}</h1>
        <p className="text-neutral-600 mt-2">Slug: <span className="font-mono">{artist.slug}</span></p>

        {/* Placeholder content — replace with real portfolio data later */}
        <div className="mt-8 rounded-2xl border border-neutral-200 p-6 bg-neutral-50">
          <p className="text-neutral-700">
            This is the starter slug page for <strong>{artist.name}</strong>. 
            Add gallery, bio, links, and embeds here — fully separate from Cities Mag POI.
          </p>
        </div>
      </section>
    </main>
  );
}
