"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";

export default function ButtonNav({ href, children, className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    if (loading) return;
    // Ensure the "Loading…" text paints before navigation
    flushSync(() => setLoading(true));
    setTimeout(() => router.push(href), 0);
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-busy={loading ? "true" : "false"}
      className={`${className} transition-opacity duration-150 ${loading ? "opacity-75 cursor-wait" : ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
