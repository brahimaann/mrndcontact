// app/components/DataBlock.js
import React from "react";
import clsx from "clsx";

export default function DataBlock({ title, className = "", children }) {
  return (
    <section
      className={clsx(
        "rounded-sm p-4 md:p-5 bg-black text-white",
        "shadow-[0_0_0_1px_rgba(255,255,255,.08)_inset]",
        "font-[var(--font-dogica,monospace)] tracking-wide leading-relaxed",
        className
      )}
    >
      {title ? (
        <div className="mb-3 -mt-2">
          <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
            {title}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
