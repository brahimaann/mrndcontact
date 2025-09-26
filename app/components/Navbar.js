import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          MRND
        </Link>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/portfolio" className="hover:underline">
            Portfolio
          </Link>
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
