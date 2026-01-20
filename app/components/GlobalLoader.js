"use client";
import { useEffect, useState } from "react";
import Loader from "./ui/Loader";

/**
 * Global loader that shows while the page is loading
 * Automatically hides when content is ready
 */
export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader once page is fully loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    // If already loaded, hide immediately
    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <Loader size={24} label="Loading page" />
    </div>
  );
}
