"use client";
import { useEffect, useRef } from "react";

export default function AsciiGlobeBackground() {
  const preRef = useRef(null);

  useEffect(() => {
    // Wait for the element to be in the DOM
    const checkAndLoad = () => {
      const pre = document.getElementById("ascii-globe-bg");
      if (!pre) {
        // If element doesn't exist yet, try again
        requestAnimationFrame(checkAndLoad);
        return;
      }

      // Check if script already loaded
      const existingScript = document.querySelector('script[src="/ascii-globe/globe.js"]');
      if (existingScript) return;

      // Load the script
      const script = document.createElement("script");
      script.src = "/ascii-globe/globe.js";
      script.async = true;
      script.onload = () => {
        console.log("ASCII globe script loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load ASCII globe script");
      };
      document.body.appendChild(script);
    };

    // Start checking after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkAndLoad, 100);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector('script[src="/ascii-globe/globe.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return <pre id="ascii-globe-bg" ref={preRef} />;
}
