"use client";
import Link from "next/link";
import useTypewriter from "../lib/useTypeWriter";

export default function TerminalHero({ headline, sub, ctaLeft, ctaRight }){
  const typed = useTypewriter(headline, 28);
  return (
    <div className="font-mono">
      <h1 className="text-3xl md:text-5xl text-green-400 typewriter">
        {typed}
      </h1>
      <p className="mt-2 text-green-200">{sub}</p>
      <div className="mt-5 flex gap-3">
        {ctaLeft && (
          <Link href={ctaLeft.href} className="hud-btn">
            {ctaLeft.label}
          </Link>
        )}
        {ctaRight && (
          <Link href={ctaRight.href} className="hud-btn hud-btn--ghost">
            {ctaRight.label}
          </Link>
        )}
      </div>
    </div>
  );
}
