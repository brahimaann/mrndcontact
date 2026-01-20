"use client";

import { useEffect, useState, use, useCallback } from "react";
import HudSidebar from "../../components/HudSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../../components/ui/Loader";
import Link from "next/link";
import Image from "next/image";

export default function IssuePage({ params }) {
  const { issueId } = use(params);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftSide, setShowLeftSide] = useState(true);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile((prevMobile) => {
        const nowMobile = window.innerWidth < 768; // md breakpoint
        // Reset to left side when switching viewport modes
        if (prevMobile !== nowMobile) {
          setShowLeftSide(true);
        }
        return nowMobile;
      });
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset to left side when image changes on mobile
  useEffect(() => {
    if (isMobile) {
      setShowLeftSide(true);
    }
  }, [currentIndex, isMobile]);

  // Preload images for faster navigation
  const preloadImage = useCallback((url, priority = false) => {
    if (loadedImages.has(url)) return;
    const img = new window.Image();
    if (priority) {
      img.fetchPriority = 'high';
    }
    img.src = url;
    img.onload = () => {
      setLoadedImages((prev) => new Set([...prev, url]));
    };
    // Also use link preload for critical images
    if (priority && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [loadedImages]);

  useEffect(() => {
    fetch(`/api/magazine/${issueId}`)
      .then(async (r) => {
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await r.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }
        return r.json();
      })
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          console.log(`Loaded ${json.images?.length || 0} images for issue: ${issueId}`);
          // Add cover image as first image if viewing root issue
          const coverImage = issueId === "root" ? {
            name: "CITIES COVER.png",
            url: "/CITIES%20COVER.png" // URL-encoded space
          } : null;
          
          const allImages = coverImage 
            ? [coverImage, ...(json.images || [])]
            : (json.images || []);
          
          setImages(allImages);
          // Preload first 3-5 images immediately for faster initial load
          const imagesToPreload = allImages.slice(0, 5);
          imagesToPreload.forEach((img, index) => {
            if (img.url) {
              preloadImage(img.url, index === 0); // High priority for first image
            }
          });
        }
      })
      .catch((e) => {
        console.error("Error fetching magazine:", e);
        setError(String(e));
      });
  }, [issueId, preloadImage]);

  // Preload adjacent images when current index changes
  useEffect(() => {
    if (images.length === 0) return;
    
    // Preload current image (high priority)
    if (images[currentIndex]?.url) {
      preloadImage(images[currentIndex].url, true);
    }
    
    // Preload next 2-3 images ahead for smoother navigation
    for (let i = 1; i <= 3; i++) {
      const nextIndex = (currentIndex + i) % images.length;
      if (images[nextIndex]?.url) {
        preloadImage(images[nextIndex].url);
      }
    }
    
    // Preload previous image
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    if (images[prevIndex]?.url) {
      preloadImage(images[prevIndex].url);
    }
  }, [currentIndex, images, preloadImage]);

  const goNext = useCallback(() => {
    if (isMobile) {
      // On mobile: navigate through left/right sides
      if (showLeftSide) {
        // Currently showing left, switch to right of same image
        setShowLeftSide(false);
      } else {
        // Currently showing right, move to next image's left
        setShowLeftSide(true);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    } else {
      // Desktop: normal navigation
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length, isMobile, showLeftSide]);

  const goPrev = useCallback(() => {
    if (isMobile) {
      // On mobile: navigate through left/right sides
      if (showLeftSide) {
        // Currently showing left, move to previous image's right
        setShowLeftSide(false);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Currently showing right, switch to left of same image
        setShowLeftSide(true);
      }
    } else {
      // Desktop: normal navigation
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length, isMobile, showLeftSide]);

  // Calculate total pages for mobile (each image = 2 pages)
  const totalPages = isMobile ? images.length * 2 : images.length;
  const currentPageNumber = isMobile 
    ? (currentIndex * 2 + (showLeftSide ? 1 : 2))
    : (currentIndex + 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goNext, goPrev]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-red-500 text-xl mb-4">Error Loading Magazine</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-w-2xl">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} label="Loading magazine" />
          <div className="mt-4 opacity-60 text-sm">Fetching images </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <HudSidebar />
      
      {/* Mobile logo */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black flex items-center justify-center pt-2 pb-2" style={{ width: '100vw', marginLeft: 0 }}>
          <Link href="/" className="flex items-center justify-center" aria-label="Go to Home">
            <Image
              src="/MRND%20TP.png"
              alt="Modern Renaissance — Home"
              width={160}
              height={60}
              priority
              className="h-10 w-auto hover:opacity-90 transition"
              style={{ margin: '0 auto' }}
            />
          </Link>
        </div>
      )}
      
      <div 
        className={`flex items-center justify-center ${isMobile ? 'fixed top-[60px] left-0 right-0 bottom-0 w-full z-30' : 'min-h-screen ml-[6rem] mr-0 lg:mr-[22rem] px-6 md:px-10 py-10'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          // Don't handle clicks in the top 56px area (nav bar area)
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          if (y < 56) return; // Ignore clicks in nav bar area
          
          // Click on right side to go next, left side to go prev
          const x = e.clientX - rect.left;
          const clickPosition = x / rect.width;
          if (clickPosition > 0.6) {
            goNext();
          } else if (clickPosition < 0.4) {
            goPrev();
          }
        }}
      >
        <div className={`relative w-full ${isMobile ? 'h-full' : 'h-full'} flex ${isMobile ? 'items-start pt-16' : 'items-start pt-20'} justify-center ${isMobile ? '' : 'max-w-7xl'}`}>
          {/* Navigation buttons - hidden but still functional for accessibility */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full transition-opacity invisible"
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Current image */}
          <div className={`flex-1 flex items-center justify-center w-full ${isMobile ? 'h-full pb-16' : ''}`}>
            {isMobile ? (
              <div 
                className="relative w-full px-14"
                style={{ 
                  overflow: 'hidden',
                  width: '80%',
                  height: 'calc(100vh - 30px - 8rem)',
                  maxHeight: 'calc(100vh - 36px - 8rem)',
                  minHeight: '200px',
                  position: 'relative',
                  marginLeft: 'auto',
                  marginRight: '35px',
                  marginTop: '8rem',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '200%',
                    height: '100%',
                    left: showLeftSide ? '0%' : '-100%',
                    transition: 'left 0.3s ease-in-out',
                    top: 0,
                    display: 'flex'
                  }}
                >
                  {loadedImages.has(currentImage.url) ? (
                    <img
                      key={`${currentImage.url}-${currentIndex}`}
                      src={currentImage.url}
                      alt={`Magazine page ${currentPageNumber}`}
                      style={{ 
                        imageRendering: "high-quality",
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block',
                        flexShrink: 0
                      }}
                      loading={currentIndex === 0 ? "eager" : "lazy"}
                      fetchPriority={currentIndex === 0 ? "high" : "auto"}
                      decoding="async"
                      onLoad={() => {
                        setLoadedImages((prev) => new Set([...prev, currentImage.url]));
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', currentImage.url);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ flexShrink: 0 }}>
                      <Loader size={24} label="Loading image" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              loadedImages.has(currentImage.url) ? (
                <img
                  key={currentImage.url}
                  src={currentImage.url}
                  alt={`Magazine page ${currentPageNumber}`}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                  style={{ imageRendering: "high-quality" }}
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                  fetchPriority={currentIndex === 0 ? "high" : "auto"}
                  decoding="async"
                  onLoad={() => {
                    setLoadedImages((prev) => new Set([...prev, currentImage.url]));
                  }}
                />
              ) : (
                <div className="max-w-full max-h-[85vh] w-auto h-auto flex items-center justify-center min-h-[400px]">
                  <Loader size={24} label="Loading image" />
                </div>
              )
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/80 border border-white/20 rounded-full transition-opacity invisible"
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>

          {/* Page indicator */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full border border-white/20 text-sm ${isMobile ? 'hidden' : 'bottom-8'}`}
            style={!isMobile ? { top: '500px' } : {}}
          >
            {currentPageNumber} / {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
}

