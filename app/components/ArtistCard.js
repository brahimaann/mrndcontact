// components/ArtistCard.js
export function ArtistCard({ name, slug, thumbUrl, tagline }) {
  return (
    <a href={`/works/${slug}`} className="block border border-white/40 p-4 hover:bg-white/5">
      <div className="aspect-square w-full overflow-hidden bg-black/50">
        <img src={thumbUrl} className="w-full h-full object-cover" alt={`${name} thumbnail`} />
      </div>
      <div className="mt-2 text-xs uppercase tracking-widest">{name}</div>
      <div className="text-xs opacity-80">{tagline}</div>
    </a>
  );
}
