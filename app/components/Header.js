"use client";

import Link from "next/link";

/** Fixed left vertical nav */
export default function Header() {
  return (
    <aside
      className="
        fixed inset-y-0 left-0
        w-40 lg:w-48
        border-r border-white/10
        bg-black/50 backdrop-blur
        px-4 lg:px-6 py-6
        flex flex-col
      "
    >
      <Link
        href="/"
        className="text-base font-semibold tracking-wide mb-10 lg:mb-14"
      >
        MRND
      </Link>

     <nav className="fixed left-0 top-0 h-full w-24 flex flex-col items-center justify-center border-r border-black/20">
  {["Cities", "Projects", "Portfolio", "Join", "Map"].map(link => (
    <a key={link} href={`#${link.toLowerCase()}`} className="rotate-[-90deg] text-sm tracking-widest hover:text-green-400 transition-colors">
      {link}
    </a>
  ))}
</nav>
    </aside>
  );
}

function NavLink({ href, children }) {
  const isHash = href.startsWith("#");
  return isHash ? (
    <a
      href={href}
      className="text-lg lg:text-xl leading-none hover:opacity-80 transition-opacity"
      onClick={(e) => {
        // smooth scroll for hash links
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", href);
        }
      }}
    >
      {children}
    </a>
  ) : (
    <Link
      href={href}
      className="text-lg lg:text-xl leading-none hover:opacity-80 transition-opacity"
    >
      {children}
    </Link>
  );
}
