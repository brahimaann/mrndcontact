import WorksNav from "./_components/WorksNav";
import HudSidebar from "../components/HudSidebar";
import Link from "next/link";
import Image from "next/image";

export default function WorksLayout({ children }) {
  return (
    <>
    <HudSidebar />
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
    <main className="bg-black text-white min-h-screen">
      <div className="ml-[calc(6rem+1in)] max-[550px]:ml-[calc(6rem)] lg:mr-[22rem] px-6 md:px-10 py-10">
        <header className="mb-3">
          <h1 className="text-[1rem] md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
            [ WORKS · ]
          </h1>
        </header>

        {/* Top row tabs / nav */}
        <WorksNav />

        {/* Page content */}
        {children}
      </div>
    </main>
    </>
  );
}
