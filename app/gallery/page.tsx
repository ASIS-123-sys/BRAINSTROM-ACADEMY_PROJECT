"use client";

import React, { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  src: string;
};

const galleryItems: GalleryItem[] = [
  { id: 1, title: "Annual Function", category: "Events", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600" },
  { id: 2, title: "Sports Day", category: "Events", src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600" },
  { id: 3, title: "Science Exhibition", category: "Events", src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600" },
  { id: 4, title: "Computer Lab", category: "Classes", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" },
  { id: 5, title: "Maths Class", category: "Classes", src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600" },
  { id: 6, title: "Study Session", category: "Classes", src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600" },
  { id: 7, title: "Toppers Felicitation", category: "Achievements", src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600" },
  { id: 8, title: "Certificate Distribution", category: "Achievements", src: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600" },
  { id: 9, title: "Trophy Ceremony", category: "Achievements", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600" },
];

const categories = ["All", "Events", "Classes", "Achievements"];

export default function PhotoGallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeFilter]); // Re-run when filter changes to animate new items

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  const filteredItems = activeFilter === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  return (
    <div className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden ${poppins.className}`}>
      
      {/* Top Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <div
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20"
        >
          OUR MEMORIES
        </div>
        <h1
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          Photo Gallery
        </h1>
        <p
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out text-lg text-[#94A3B8] max-w-xl mx-auto"
        >
          Moments from our events, classes and achievements
        </p>
      </section>

      {/* Filter Buttons Row */}
      <section className="max-w-6xl mx-auto px-6 mb-12" ref={addToRefs}>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out" style={glassCardStyle as React.CSSProperties & { opacity: number; transform: string; transitionDelay: string; transitionDuration: string; transitionProperty: string; transitionTimingFunction: string; borderRadius: string; padding: string; width: string; margin: string; display: string; justifyContent: string; gap: string; }}>
          <div className="flex flex-wrap justify-center gap-3 w-full p-2 rounded-[16px]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  // Reset animation state for items to re-animate
                  scrollRef.current = scrollRef.current.slice(0, 4); // Keep headers/filters in ref, discard grid items
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-[#06B6D4] text-[#0F172A] shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    : "text-[#F8FAFC] hover:bg-white/10"
                }`}
                style={activeFilter !== category ? { ...glassCardStyle, borderRadius: "9999px" } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.id}-${activeFilter}`} // Force re-render/re-animate on filter change
              ref={addToRefs}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out relative rounded-2xl overflow-hidden group cursor-pointer aspect-video sm:aspect-square md:aspect-[4/3]"
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedImage(item.src)}
            >
              {/* Using standard img to avoid next/image domain configuration issues since we cannot edit next.config.js */}
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Hover Glow Effect Layer */}
              <div className="absolute inset-0 bg-[#06B6D4]/0 group-hover:bg-[#06B6D4]/20 transition-colors duration-500 pointer-events-none" />

              {/* Gradient Overlay for bottom text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge Top Right */}
              <div className="absolute top-4 right-4 bg-[#06B6D4] text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {item.category}
              </div>

              {/* Event Name Bottom */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-[#F8FAFC] shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
           <div className="text-center text-[#94A3B8] py-12 w-full">
              No images found for this category.
           </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.95)" }}
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white hover:text-[#06B6D4] transition-colors p-2 z-[60]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Main Image */}
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Fullscreen view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
