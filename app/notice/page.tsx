"use client";

import React, { useEffect, useRef } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notices = [
  {
    id: 1,
    title: "Monthly Test scheduled for June 30",
    description: "All students of Class 10 and 12 must appear. Syllabus covers full portion.",
    date: "June 28, 2025",
    isLatest: true,
  },
  {
    id: 2,
    title: "Sunday Special Class this weekend",
    description: "Extra doubt clearing session for Science students.",
    date: "June 25, 2025",
    isLatest: false,
  },
  {
    id: 3,
    title: "ADCA Admission Open",
    description: "Admission for new batch starting July 2025. Limited seats available.",
    date: "June 22, 2025",
    isLatest: false,
  },
  {
    id: 4,
    title: "Fee Reminder for June month",
    description: "Please clear dues before June 30 to avoid late charges.",
    date: "June 20, 2025",
    isLatest: false,
  },
  {
    id: 5,
    title: "Holiday Notice",
    description: "Institute will remain closed on June 29 for local festival.",
    date: "June 18, 2025",
    isLatest: false,
  },
];

export default function NoticeBoard() {
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
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  const tickerAnimation = `
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-ticker {
      animation: ticker 30s linear infinite;
    }
    .animate-ticker:hover {
      animation-play-state: paused;
    }
  `;

  return (
    <div className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden ${poppins.className}`}>
      <style>{tickerAnimation}</style>
      
      {/* Top Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <div
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20"
        >
          STAY UPDATED
        </div>
        <h1
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          Notice Board
        </h1>
        <p
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out text-lg text-[#94A3B8] max-w-xl mx-auto"
        >
          Latest announcements and updates from Brainstorm Academy
        </p>
      </section>

      {/* Notice Ticker Strip */}
      <div 
        ref={addToRefs}
        className="opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out w-full border-l-4 border-[#06B6D4] bg-white/5 backdrop-blur-sm overflow-hidden py-3 mb-16 relative flex"
      >
        <div className="flex animate-ticker whitespace-nowrap min-w-max hover:cursor-pointer">
          {[...notices, ...notices].map((notice, i) => (
            <div key={i} className="flex items-center px-8">
               <span className="text-[#F59E0B] font-semibold text-sm mr-3">[{notice.date}]</span>
               <span className="text-[#F8FAFC]">{notice.title} - {notice.description}</span>
               <span className="mx-8 text-[#06B6D4]">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={notice.id}
                ref={addToRefs}
                className={`opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 md:p-8 flex flex-col ${
                  isFirst ? "md:col-span-2 border-l-4 border-l-[#06B6D4]" : ""
                }`}
                style={{
                   ...glassCardStyle,
                   transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      notice.isLatest
                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                        : "bg-white/10 text-[#94A3B8]"
                    }`}
                  >
                    {notice.isLatest ? "LATEST" : "NOTICE"}
                  </span>
                  <span className="text-sm font-medium text-[#94A3B8]">{notice.date}</span>
                </div>
                
                <h3 className={`font-semibold text-[#F8FAFC] mb-3 ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                  {notice.title}
                </h3>
                
                <p className="text-[#94A3B8] mb-6 flex-grow leading-relaxed">
                  {notice.description}
                </p>
                
                <div className="mt-auto">
                  <a
                    href="#"
                    className="inline-flex items-center text-[#06B6D4] font-medium text-sm hover:text-white transition-colors group"
                  >
                    Read More 
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
