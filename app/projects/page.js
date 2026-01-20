"use client";

import Link from "next/link";
import HudSidebar from "../components/HudSidebar";
import Image from "next/image";
import { Timeline, TimelineItem } from "@/components/timeline";

// Projects data - starting with Cities in January 2026
const projects = [
  {
    id: "cities",
    title: "Cities",
    date: new Date(2026, 0, 1), // January 2026
    href: "/projects/cities",
    status: "completed",
  },
  // Add more projects here as they're created
];

export default function ProjectsPage() {
  return (
    <>
      <HudSidebar />
      <div className="flex justify-center pt-5 mb-4 min-[550px]:hidden">
        <Link href="/" className="block" aria-label="Go to Home">
          <Image
            src="/MRND%20TP.png"
            alt="Modern Renaissance — Home"
            width={160}
            height={60}
            priority
            className="mx-auto h-12 w-auto object-center hover:opacity-90 transition"
          />
        </Link>
      </div>
      <main className="bg-black text-white min-h-screen">
        <div className="ml-[calc(6rem+1in)] max-[550px]:ml-[calc(6rem)] lg:mr-[22rem] px-6 md:px-10 py-10">
          <header className="mb-8">
            <h1 className="text-[1rem] md:text-4xl font-[var(--font-dogica,monospace)] tracking-[0.25em]">
              [ PROJECTS · TIMELINE ]
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-80">
              timeline · projects · history
            </p>
          </header>

          {/* Timeline */}
          <div className="mt-8">
            <Timeline>
              {projects.map((project) => (
                <TimelineItem
                  key={project.id}
                  date={project.date}
                  title={project.title}
                  href={project.href}
                  status={project.status}
                />
              ))}
            </Timeline>
          </div>
        </div>
      </main>
    </>
  );
}
