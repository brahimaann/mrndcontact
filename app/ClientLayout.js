// app/ClientLayout.js
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function ClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const firstLoad = useRef(true);
  const [loaderText, setLoaderText] = useState("Loading...");

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

    // 1) Show "Welcome"
    setTimeout(() => {
      setLoaderText("Welcome");

      // 2) Fade out "Welcome" and spinner
      setTimeout(() => {
        gsap.to("#spinner", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            const sp = document.getElementById("spinner");
            if (sp) sp.style.display = "none";

            // 3) Reveal splash
            uncoverScreen();
          },
        });
      }, 1000); // Show "Welcome" for 1 second
    }, 500); // Initial delay
  }, []);

  // —— ROUTE-CHANGE GRID COVERING —— //
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

  return (
    <>
      {/* One-time spinner overlay */}
      <div
        id="spinner"
        className="spinner-overlay"
        style={{ opacity: 1, transition: "opacity 0.5s ease" }}
      >
        <span className="loader">{loaderText}</span>
      </div>
      {children}
      <div className="load-grid">
        {Array.from({ length: 12 * 8 }).map((_, i) => (
          <div key={i} className="load-grid-item" />
        ))}
      </div>
    </>
  );
}
