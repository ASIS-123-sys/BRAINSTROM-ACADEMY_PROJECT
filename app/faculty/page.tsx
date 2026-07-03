"use client";

import React, { useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export default function FacultyPage() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".section-animate");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Card hover animation events
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(4deg) rotateY(4deg) scale(1.02)";
    e.currentTarget.style.borderColor = "#2dbcfe";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,53,88,0.08)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    e.currentTarget.style.borderColor = "#7FB3E8";
    e.currentTarget.style.boxShadow = "none";
  };

  // Card glassmorphism style object
  const cardStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    transformStyle: "preserve-3d",
  };

  const facultyList = [
    {
      name: "Rajesh Kumar Panda",
      subject: "Computer Science",
      position: "HOD Computer",
      experience: "10 yrs",
      initials: "RP",
    },
    {
      name: "Sunita Rath",
      subject: "Mathematics",
      position: "HOD Maths",
      experience: "8 yrs",
      initials: "SR",
    },
    {
      name: "Deepak Sahoo",
      subject: "Tally & Accounts",
      position: "Senior Faculty",
      experience: "6 yrs",
      initials: "DS",
    },
    {
      name: "Priya Mishra",
      subject: "English",
      position: "Faculty",
      experience: "5 yrs",
      initials: "PM",
    },
    {
      name: "Amit Nayak",
      subject: "Science",
      position: "Senior Faculty",
      experience: "7 yrs",
      initials: "AN",
    },
    {
      name: "Sanjukta Das",
      subject: "Commerce",
      position: "Faculty",
      experience: "4 yrs",
      initials: "SD",
    },
  ];

  return (
    <div
      className={`${poppins.variable} bg-[#F7FAFD] text-[#42576E] min-h-screen relative w-full py-24 overflow-hidden`}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* Decorative blurred background circles */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#2dbcfe] opacity-10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#00658d] opacity-10 blur-[80px] pointer-events-none"></div>

      {/* Animation classes stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .section-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .section-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-20 section-animate">
          <span className="text-xs uppercase tracking-widest text-[#003358] font-bold bg-[#9FC7F0] px-3.5 py-1 rounded-full border border-[#7FB3E8]">
            Our Faculty
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003358] mt-4"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Meet the Experts
          </h1>
          <p className="mt-4 text-[#42576E] text-sm sm:text-base leading-relaxed">
            Meet the experts behind every success story. Our dedicated team of professional educators is committed to concept mastery and empowering students in Berhampur, Odisha.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 section-animate" style={{ transitionDelay: "0.15s" }}>
          {facultyList.map((faculty, idx) => (
            <div
              key={faculty.name}
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-8 flex flex-col items-center text-center relative group"
            >
              {/* Highlight accents on HOD / Senior classes to fit aesthetic */}
              {(faculty.position.includes("HOD") || idx === 0) && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#003358] rounded-t-[16px]"></div>
              )}
              {faculty.position.includes("Senior") && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#2dbcfe] rounded-t-[16px]"></div>
              )}

              {/* Circle with initials in cyan background */}
              <div className="w-20 h-20 rounded-full bg-[#9FC7F0] border border-[#7FB3E8] text-[#003358] flex items-center justify-center mb-6 font-bold text-2xl group-hover:scale-105 transition-transform duration-300">
                {faculty.initials}
              </div>

              {/* Name */}
              <h3
                className="text-xl font-bold text-[#003358] leading-snug mb-1"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                {faculty.name}
              </h3>

              {/* Subject */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8] mb-4 tracking-wide">
                {faculty.subject}
              </span>

              <div className="border-t border-[#7FB3E8] w-full my-4"></div>

              {/* Position and Experience */}
              <div className="space-y-1.5 text-center mb-6">
                <p className="text-sm font-semibold text-[#42576E]">{faculty.position}</p>
                <p className="text-xs text-[#42576E] font-medium">Experience: {faculty.experience}</p>
              </div>

              {/* Phone placeholder */}
              <div className="w-full mt-auto">
                <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-[#9FC7F0] border border-[#7FB3E8] text-xs font-bold text-[#003358] group-hover:bg-[#003358] group-hover:text-white transition-all duration-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact via office
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
