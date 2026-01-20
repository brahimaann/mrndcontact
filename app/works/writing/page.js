"use client";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function WritingModal({ piece, onClose }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getInitialSize = () => {
    if (typeof window === 'undefined') return { width: 816, height: 1056 };
    if (window.innerWidth < 768) {
      // Mobile: comfortable spacing with margins
      return {
        width: window.innerWidth * 0.92,
        height: window.innerHeight * 0.85
      };
    }
    return {
      width: Math.min(816, window.innerWidth * 0.9), // 8.5in or 90vw
      height: Math.min(1056, window.innerHeight * 0.9) // 11in or 90vh
    };
  };

  const getInitialPosition = (width) => {
    if (typeof window === 'undefined') return { x: 100, y: 100 };
    if (window.innerWidth < 768) {
      // Mobile: centered with comfortable margins
      const height = getInitialSize().height;
      return {
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2
      };
    }
    return {
      x: (window.innerWidth - width) / 2,
      y: (window.innerHeight - getInitialSize().height) / 2
    };
  };

  const [size, setSize] = useState(getInitialSize());
  const [position, setPosition] = useState(() => getInitialPosition(getInitialSize().width));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Keep window in view on viewport resize
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPosition((p) => ({
        x: Math.max(0, Math.min(p.x, vw - 100)),
        y: Math.max(0, Math.min(p.y, vh - 100)),
      }));
    };
    
    window.addEventListener("resize", onResize);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2147483647 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 pointer-events-auto"
        onClick={onClose}
      />

      {/* Draggable/Resizable Window - Notepad Style */}
      <Rnd
        size={size}
        position={position}
        onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(_, __, ref, ___, pos) => {
          setSize({ 
            width: parseInt(ref.style.width, 10), 
            height: parseInt(ref.style.height, 10) 
          });
          setPosition(pos);
        }}
        minWidth={isMobile ? (typeof window !== 'undefined' ? window.innerWidth * 0.85 : 350) : 400}
        minHeight={isMobile ? (typeof window !== 'undefined' ? window.innerHeight * 0.75 : 400) : 300}
        enableResizing={{ 
          top: true, 
          right: true, 
          bottom: true, 
          left: true, 
          topRight: true, 
          bottomRight: true, 
          bottomLeft: true, 
          topLeft: true 
        }}
        dragHandleClassName="writing-modal-drag-handle"
        className="pointer-events-auto"
      >
        <div
          className="border border-white/40 shadow-2xl overflow-hidden h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            fontFamily: "var(--font-dogica, monospace)",
            backgroundColor: "#fafafa"
          }}
        >
          {/* Title Bar / Drag Handle - Notepad Style */}
          <div className="writing-modal-drag-handle border-b border-black/10 px-4 py-2 flex items-center justify-between cursor-move" style={{ backgroundColor: "#f5f5f5" }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-black/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black/40"></div>
              </div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-black/90 truncate">
                {piece.title}
              </h2>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-black/70 hover:text-black hover:bg-black/10 active:bg-black/20 px-2 py-1 rounded transition flex-shrink-0 text-lg leading-none touch-manipulation"
              aria-label="Close"
              style={{ fontFamily: "monospace", minWidth: '44px', minHeight: '44px' }}
            >
              ×
            </button>
          </div>

          {/* Menu Bar (Optional - Notepad style) */}
          <div className="border-b border-black/10 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-black/60" style={{ backgroundColor: "#f8f8f8" }}>
            <span className="hover:text-black/80 cursor-pointer mr-4">File</span>
            <span className="hover:text-black/80 cursor-pointer mr-4">Edit</span>
            <span className="hover:text-black/80 cursor-pointer mr-4">View</span>
          </div>

          {/* Content Area - Notepad Style */}
          <div className="flex-1 overflow-y-auto px-6 py-4" style={{ backgroundColor: "#fafafa" }}>
            <p className="text-xs leading-[1.25] whitespace-pre-wrap text-black/90 font-mono">
              {piece.description || "[ No content ]"}
            </p>
          </div>

          {/* Status Bar */}
          <div className="border-t border-black/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-black/50" style={{ backgroundColor: "#f5f5f5" }}>
            <span>Ln 1, Col 1</span>
          </div>
        </div>
      </Rnd>
    </div>
  );
}

export default function WritingPage() {
  const pieces = useQuery(api.works.listWorksByMedium, { type: "writing", limit: 60 }) || [];
  const [selectedPiece, setSelectedPiece] = useState(null);

  // Get preview text (first 150 characters or first paragraph)
  const getPreview = (text) => {
    if (!text) return "[ No excerpt ]";
    const firstParagraph = text.split("\n\n")[0];
    if (firstParagraph.length <= 150) return firstParagraph;
    return text.substring(0, 150) + "...";
  };

  return (
    <>
      <section className="space-y-5">
        <div className="inline-block border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">Writing</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {pieces.map((w) => (
            <article
              key={w._id}
              className="border border-white/40 p-4 cursor-pointer hover:bg-white/5 transition hover:border-white/60 active:bg-white/10"
              onClick={() => setSelectedPiece(w)}
              onTouchStart={(e) => {
                // Prevent double-tap zoom on mobile
                if (e.touches.length > 1) e.preventDefault();
              }}
            >
              <h2 className="text-sm uppercase tracking-[0.2em] mb-2">{w.title}</h2>
              <p className="text-xs opacity-80 whitespace-pre-wrap leading-[1.25] line-clamp-4">
                {getPreview(w.description)}
              </p>
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] opacity-60">
                Tap to read →
              </div>
            </article>
          ))}
          {pieces.length === 0 && (
            <div className="border border-white/40 p-4 text-xs opacity-70 col-span-full">
              [ No writing yet ]
            </div>
          )}
        </div>
      </section>

      {selectedPiece && (
        <WritingModal piece={selectedPiece} onClose={() => setSelectedPiece(null)} />
      )}
    </>
  );
}
