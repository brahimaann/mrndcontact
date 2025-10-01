// app/ClientLayout.js
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function ClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const firstLoad = useRef(true);

  // Show the pixel grid full-screen
  const coverScreen = () =>
    new Promise((resolve) => {
      gsap.set(".load-grid", { display: "grid" });
      gsap.to(".load-grid-item", {
        opacity: 1,
        duration: 0.001,
        ease: "none",
        stagger: { amount: 0.5, from: "random" },
        onComplete: resolve,
      });
    });

  // Hide the pixel grid
  const uncoverScreen = () =>
    new Promise((resolve) => {
      gsap.to(".load-grid-item", {
        opacity: 0,
        duration: 0.001,
        ease: "none",
        stagger: { amount: 0.5, from: "random" },
        onComplete: () => {
          gsap.set(".load-grid", { display: "none" });
          resolve();
        },
      });
    });

  // ONE-TIME INITIAL SEQUENCE
  useEffect(() => {
    if (!firstLoad.current) return;
    firstLoad.current = false;

    // Reveal splash
    uncoverScreen();
  }, []);

  // Intercept same-site links and animate cover → navigation
  useEffect(() => {
    const onClick = async (e) => {
      const a = e.target.closest("a");
      if (
        !a ||
        a.target === "_blank" ||
        a.host !== window.location.host ||
        (a.pathname === pathname && !a.hash)
      ) {
        return;
      }
      e.preventDefault();
      await coverScreen();
      router.push(a.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, pathname]);

  // Uncover the screen on navigation
  useEffect(() => {
    if (firstLoad.current) return; // Don't uncover on initial load, that's handled separately
    uncoverScreen();
  }, [pathname]);

  return (
    <>
      {children}

      {/* Pixel grid */}
      <div className="load-grid">
        {Array.from({ length: 12 * 8 }).map((_, i) => (
          <div key={i} className="load-grid-item" />
        ))}
      </div>
    </>
  );
}