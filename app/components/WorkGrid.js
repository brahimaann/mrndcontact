// components/WorkGrid.js
export function WorkGrid({ works }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {works.map((w) => (
        <a key={w.slug} href={w.href} className="block">
          <div className="aspect-[4/3] overflow-hidden bg-black/50 border border-white/40">
            <img src={w.thumbnail} className="w-full h-full object-cover" alt={w.title} />
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide">{w.title}</div>
        </a>
      ))}
    </div>
  );
}
