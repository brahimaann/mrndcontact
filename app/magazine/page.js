import Link from "next/link";

export default function MagazineIndex() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">MRND Magazine</h1>
        <div className="space-y-4">
          <Link
            href="/magazine/root"
            className="block p-4 border border-white/20 hover:bg-white/10 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Current Issue</h2>
            <p className="text-white/70">View the latest magazine</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

