// app/cities/page.js
import Link from "next/link";
import DataBlock from "../components/DataBlock";
import HudSidebar from "../components/HudSidebar";
import Image from "next/image";

export default function CitiesPage() {
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
        <header className="mb-6">
          <div className="flex ml-[calc(-6rem-1in)] max-[550px]:ml-[calc(-6rem)] justify-center pt-5 mb-4 "> {/* Added a wrapper for centering and padding */}
              <Image
                  src="/SNKTRY%20logo.png" // or "/mrnd-tp.png" if you renamed
                  alt="Modern Renaissance — Home"
                  width={160} // tweak as needed
                  height={60} // tweak as needed
                  priority
                  // Keep only centering and necessary sizing/visual classes
                  className="mx-auto h-12 w-auto object-center hover:opacity-90 transition"
              />
            </div>
          <p className="mt-3 leading-[2] text-xs uppercase tracking-[0.3em]">
            [ Decoding: THE CITIES — Issue 01 ]
          </p>
        </header>

        {/* Responsive container – single column <970px, two cols ≥970px */}
        <div className="grid gap-5 mdx:grid-cols-[2fr_1fr]">
          {/* LEFT STACK (Overview + Breakdown) */}
          <div className="space-y-5">
            <DataBlock title="Project Overview">
              <p className="text-sm  leading-[2] opacity-80">
                <strong>The Cities</strong> is a living report of the Twin Cities’ evolving culture,
                 built by artists, organizers, designers, and neighbors. 
                 Together we’re weaving personal stories into a resilient foundation of craft,
                  connection, and homegrown abundance—dedicated to the diamonds in the rough and
                   the roses in the concrete.
                   <br /><br />By us, for our future
              </p>
            </DataBlock>

            <DataBlock title="Issue 01: Breakdown">
              <div className="grid leading-[2] md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <ul className="space-y-2 list-none marker:content-none m-0 p-0">
                    <li>
                      <span className="opacity-70">What we did:</span>
                      <ul className="mt-1 ml-4 list-none marker:content-none">
                        <li>- Portraits</li>
                        <p className="leading-[.5]">capturing their being in time and space</p>
                        <li>- Interviews</li>
                        <p className="leading-[.5]">capturing a little bit of what they share from their minds</p>
                        <li>- Partners / locations</li>
                        <p className="leading-[.5]">Big thank you to STUDIO APPARATUS</p>
                      </ul>
                    </li>
                    <li className="pt-3">
                      <span className="opacity-70">Outcomes:</span>
                      <ul className="mt-1 ml-4 list-none marker:content-none">
                        <li>-Subjects: 22 • Portraits: 110 • Vol 1 Mag • </li>
                      </ul>
                    </li>
                    
                  </ul>
                </div>
                
              </div>
            </DataBlock>
            <br />
          </div>

 {/* RIGHT: Teaser */}
  <div className="hidden space-y-5 min-w-0">
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
          <p className="text-center style-bold text-sm uppercase tracking-[0.35em]">
            good dope sells itself
          </p>
        </DataBlock>
      </div>
    </main>
       </>
  );
}
