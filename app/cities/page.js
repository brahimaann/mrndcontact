// app/cities/page.js
import Link from "next/link";
import DataBlock from "../components/DataBlock";
import HudSidebar from "../components/HudSidebar";

export default function CitiesPage() {
  return (
    <> 
    <HudSidebar />
    <main className="bg-black text-white min-h-screen">
      <div className="ml-[calc(6rem+1in)] lg:mr-[22rem] px-6 md:px-10 py-10">
        <header className="mb-6">
          <h1 className="text-3xl mb-2 md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
            [ FILE: THE CITIES ]
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.3em]">
            [ Decoding: Genesis Report ]
          </p>
        </header>

        {/* Responsive container – single column <970px, two cols ≥970px */}
        <div className="grid gap-5 mdx:grid-cols-[2fr_1fr]">
          {/* LEFT STACK (Overview + Breakdown) */}
          <div className="space-y-5">
            <DataBlock title="Project Overview">
              <p className="text-sm  leading-[2] opacity-80">
                <strong>The Cities</strong> is a living report of the Twin Cities’
                first bloom—an initialization signal for a culture we’re building
                together. We highlight artists, organizers, and builders, threading
                personal stories into a shared narrative of craft, connection, and
                homegrown abundance. This page is the <em>Genesis Protocol</em> message
                file—your entry point to the transmission.
              </p>
            </DataBlock>

            <DataBlock title="Issue 01: Breakdown">
              <div className="grid leading-[2] md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <ul className="space-y-2 list-none marker:content-none m-0 p-0">
                    <li>
                      <span className="opacity-70">What we did:</span>
                      <ul className="mt-1 ml-4 list-none marker:content-none">
                        <li>- Portrait sessions</li>
                        <li>- Field notes & transcripts</li>
                        <li>- Features & spreads</li>
                        <li>- Partners / locations</li>
                      </ul>
                    </li>
                    <li className="pt-3">
                      <span className="opacity-70">Outcomes:</span>
                      <ul className="mt-1 ml-4 list-none marker:content-none">
                        <li>- Sessions: 12 • Interviews: 8 • Themes: Craft, Care, Signal</li>
                      </ul>
                    </li>
                    <li className="pt-3">
                      <span className="opacity-70">Credits:</span>
                      <ul className="mt-1 ml-4 list-none marker:content-none">
                        <li>- Team: … / Tools: … / Dates: …</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <aside className="border border-white/25 p-3 text-xs">
                  <div className="uppercase tracking-[0.2em] mb-2">Asset Log</div>
                  <div className="opacity-70">Thumbs / selects / BTS notes</div>
                </aside>
              </div>
            </DataBlock>
          </div>

 {/* RIGHT: Teaser */}
  <div className="space-y-5 min-w-0">
    <DataBlock title="Teaser: Magazine Cover">
      <div className="flex flex-col gap-4">
        <div className="w-full aspect-[4/5] max-w-full overflow-hidden border border-white/40 bg-black/50">
          {/* use an <img> or next/image here */}
          {/* <img src="/cover.jpg" alt="" className="w-full h-full object-cover" /> */}
          <span className="block w-full h-full text-xs opacity-60 flex items-center justify-center">
            [ COVER_IMAGE_PLACEHOLDER ]
          </span>
        </div>

        <div className="text-sm">
          <p className="opacity-80">
            First decrypt reveals the Issue 01 cover and a peek into the spreads inside.
          </p>
          <div className="mt-4 space-x-6 text-xs uppercase tracking-[0.25em]">
            <a href="/magazine/issue-01" className="text-black underline">Magazine — Issue 01</a>
            <a href="/magazine/issue-01/teaser" className="text-black underline">Read the Teaser →</a>
          </div>
        </div>
      </div>
    </DataBlock>
  </div>
        </div>

        {/* Footer */}
        <DataBlock className="mt-8">
          <p className="text-center text-sm uppercase tracking-[0.35em]">
            good dope sells itself
          </p>
        </DataBlock>
      </div>
    </main>
       </>
  );
}
