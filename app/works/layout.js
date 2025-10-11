import WorksNav from "./_components/WorksNav";
import HudSidebar from "../components/HudSidebar";

export default function WorksLayout({ children }) {
  return (
    <>
    <HudSidebar />
    <main className="bg-black text-white min-h-screen">
      <div className="ml-[calc(6rem+1in)] lg:mr-[22rem] px-6 md:px-10 py-10">
        <header className="mb-3">
          <h1 className="text-3xl md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
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
