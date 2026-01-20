"use client";
import Loader from "./components/ui/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <Loader size={24} label="Loading page" />
    </div>
  );
}
