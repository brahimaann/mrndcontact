"use client";
import { Rnd } from "react-rnd";
import { useEffect, useState } from "react";

export default function OverlayWindow({
  children,
  initial = { x: 48, y: 120, width: 960, height: 640 }, // start lower
  minWidth = 420,
  minHeight = 320,
  onClose = () => {},
  title = "Overlay",
  zIndex = 9999,              // ⬅ on top of everything
  showBackdrop = true,
}) {
  const [position, setPosition] = useState({ x: initial.x, y: initial.y });
  const [size, setSize] = useState({ width: initial.width, height: initial.height });

  // Keep window in view on viewport resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPosition((p) => ({
        x: Math.max(8, Math.min(p.x, vw - 120)),
        y: Math.max(8, Math.min(p.y, vh - 120)),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex }} aria-label={`${title} window container`}>
      {showBackdrop && (
        <div
          className="absolute inset-0 bg-black/30 pointer-events-auto"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <Rnd
        size={size}
        position={position}
        onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(_, __, ref, ___, pos) => {
          setSize({ width: parseInt(ref.style.width, 10), height: parseInt(ref.style.height, 10) });
          setPosition(pos);
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        bounds="window"
        enableResizing={{ top:true, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true }}
        dragHandleClassName="overlay-drag-handle"
        className="pointer-events-auto"
      >
        {/* Window chrome */}
        <div className="flex h-full w-full bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Title bar (drag handle) */}
        <div className="overlay-drag-handle relative w-full h-10 flex items-center justify-center border-b bg-neutral-50">
          <div className="text-sm font-medium truncate px-10">{title}</div>
          {/* Close button at absolute top-right */}
          <button
            aria-label="Close window"
            onClick={onClose}
            className="absolute right-2 top-1.5 h-7 w-7 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-200"
            title="Close"
          >
            ×
          </button>
        </div>

          {/* Content area — make sure it can grow */}
          <div className="flex-1 min-w-0 min-h-0 p-2">
            {/* Inner wrapper ensures children can use h-full */}
            <div className="h-full min-h-0">{children}</div>
          </div>
        </div>
      </Rnd>
    </div>
  );
}
