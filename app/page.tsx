"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export default function Home() {
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
    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  };

  // Card glassmorphism style object
  const glassCardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    transformStyle: "preserve-3d",
  };

  const glassCardCyanStyle: React.CSSProperties = {
    ...glassCardStyle,
    borderTop: "4px solid #06B6D4",
  };

  const glassCardAmberStyle: React.CSSProperties = {
    ...glassCardStyle,
    borderTop: "4px solid #F59E0B",
  };

  const notices = [
    "Monthly Test — June 30",
    "Sunday Special Class",
    "ADCA Admission Open",
    "Fee Reminder — June",
    "Holiday Notice",
  ];

  const performers = [
    {
      name: "Aditya Patra",
      batch: "Class 12th Science",
      percentage: "98.2%",
      rank: "Rank 1",
      initials: "AP",
    },
    {
      name: "Subhashree Jena",
      batch: "Class 12th Commerce",
      percentage: "97.6%",
      rank: "Rank 2",
      initials: "SJ",
    },
    {
      name: "Rohan Kumar Sahu",
      batch: "Class 10th Board",
      percentage: "96.8%",
      rank: "Rank 5",
      initials: "RS",
    },
    {
      name: "Priyanka Maharana",
      batch: "PGDCA Computer",
      percentage: "95.5%",
      rank: "A+ Grade",
      initials: "PM",
    },
    {
      name: "Sourav K. Mohanty",
      batch: "Class 10th Board",
      percentage: "95.2%",
      rank: "Rank 10",
      initials: "SM",
    },
  ];

  return (
    <div
      className={`${poppins.variable} bg-[#0F172A] text-[#F8FAFC] overflow-hidden min-h-screen relative w-full`}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* ─── INJECTED KEYFRAME & TRANSITION CSS ─────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ticker-container {
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .ticker {
          display: flex;
          gap: 3rem;
          white-space: nowrap;
          animation: ticker-scroll 25s linear infinite;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
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

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[92vh] lg:min-h-[85vh] flex items-center py-12 lg:py-16 overflow-hidden section-animate">
        {/* Large Decorative Blurred Circles */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#06B6D4] opacity-15 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#3B82F6] opacity-15 blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Text content + stats pills */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Cyan Border pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-[#06B6D4] border border-[#06B6D4] bg-[#06B6D4]/10 uppercase mb-5 shadow-inner">
                ISO 9001:2015 Certified • Berhampur, Odisha
              </div>

              {/* Main Tagline Heading - Fixed font size and fit in 2 lines on desktop */}
              <h1
                className="font-bold tracking-tight mb-4 select-none leading-tight"
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: "clamp(32px, 4.5vw, 52px)", // 32px on mobile, max 52px on desktop
                  lineHeight: "1.2",
                }}
              >
                Empowering Every Student to Achieve <span className="text-[#06B6D4]">Excellence</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed mb-6">
                Comprehensive coaching for Computer Courses, 12th Grade and Class 5–10 in Berhampur, Odisha. Expert faculty. Proven results.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mb-8">
                <Link href="/course" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#F59E0B] text-[#0F172A] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#d98c0b] hover:scale-105 active:scale-98 shadow-lg shadow-[#F59E0B]/20 cursor-pointer">
                    Explore Courses
                  </button>
                </Link>
                <Link href="/auth/student-login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 text-[#F8FAFC] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer">
                    Student Login
                  </button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
                {[
                  { val: "10+", label: "Years Experience" },
                  { val: "1500+", label: "Alumni" },
                  { val: "98%", label: "Pass Rate" },
                  { val: "ISO", label: "9001:2015" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={glassCardStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="text-center py-2 px-2 hover:border-[#06B6D4]/30"
                  >
                    <span className="block text-xl font-bold text-[#F59E0B]">
                      {stat.val}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#94A3B8] font-medium tracking-wide block mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Students Studying Image */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600"
                alt="Students Studying at Brainstorm Academy"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 0 40px rgba(6,182,212,0.2)",
                }}
                className="w-full max-w-md h-auto aspect-[4/3] object-cover border border-white/10"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — NOTICE TICKER */}
      <section className="bg-[#0F172A] py-4 flex items-center overflow-hidden z-20 relative border-t border-[#06B6D4]">
        <div className="pl-6 pr-4 border-r border-white/10 flex-shrink-0 z-10 bg-[#0F172A]">
          <span className="text-[#06B6D4] font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-1.5">
            <span>📢</span>
            <span>Notices:</span>
          </span>
        </div>
        <div className="flex-1 ticker-container py-1">
          <div className="ticker">
            {/* Set 1 */}
            {notices.map((n, i) => (
              <span key={i} className="flex items-center gap-4 text-[#F8FAFC]/90 font-medium text-xs sm:text-sm">
                <span>{n}</span>
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              </span>
            ))}
            {/* Set 2 */}
            {notices.map((n, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-4 text-[#F8FAFC]/90 font-medium text-xs sm:text-sm">
                <span>{n}</span>
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — COURSES */}
      <section className="py-24 bg-[#111827] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold text-[#F8FAFC]"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Our Programs
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#94A3B8]">
              Structured learning paths for every stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 — Computer Courses */}
            <div
              style={glassCardCyanStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#06B6D4]/40"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.5} />
                    <path d="M8 21h8" strokeWidth={1.5} strokeLinecap="round" />
                    <path d="M12 17v4" strokeWidth={1.5} strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] leading-tight">Computer Courses 💻</h3>
                  <p className="text-xs text-[#94A3B8]">Vocational Tech</p>
                </div>
              </div>

              {/* Badges list */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["ADCA", "CCA", "DCA", "PGDCA", "Tally ERP 9", "Spoken English"].map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Note details */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] text-center mb-6 shadow-inner">
                ISO 9001:2015 Certified • As. 250
              </div>

              <div className="border-t border-white/10 pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Facilities:</h4>
                  <ul className="space-y-2.5 mb-8">
                    {["Seminars Exam", "Syllabus Material", "KIT Bag", "ID Card", "AC Class Room"].map((fac) => (
                      <li key={fac} className="flex items-center gap-2.5 text-sm text-[#F8FAFC]/80">
                        <svg className="w-4 h-4 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-[#F8FAFC]/90 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2 — 12th Grade */}
            <div
              style={glassCardCyanStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#06B6D4]/40"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 14v7a1 1 0 001 1h2a1 1 0 001-1v-7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] leading-tight">12th Grade 📚</h3>
                  <p className="text-xs text-[#94A3B8]">Higher Secondary</p>
                </div>
              </div>

              {/* Streams details */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {[
                  "Science (Caring Soul)",
                  "Commerce (All Subjects)",
                  "Arts (All Subjects)",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white/90 border border-white/15"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Placeholder gap for alignment */}
              <div className="h-[46px] mb-6"></div>

              <div className="border-t border-white/10 pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Facilities:</h4>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Experienced Faculty",
                      "Fundamental Clearing Classes",
                      "Doubt Clearing Class",
                      "Monthly Test",
                      "Class Examination Test",
                      "Crash Course with Exam",
                    ].map((fac) => (
                      <li key={fac} className="flex items-center gap-2.5 text-sm text-[#F8FAFC]/80">
                        <svg className="w-4 h-4 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-[#F8FAFC]/90 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 3 — 5th to 10th Grade */}
            <div
              style={glassCardCyanStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#06B6D4]/40"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] leading-tight">5th to 10th Grade ✏️</h3>
                  <p className="text-xs text-[#94A3B8]">Secondary Foundation</p>
                </div>
              </div>

              {/* Subject details */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white/90 border border-white/15">
                  All Subjects
                </span>
              </div>

              {/* Placeholder gap for alignment */}
              <div className="h-[46px] mb-6"></div>

              <div className="border-t border-white/10 pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Facilities:</h4>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Monthly Test",
                      "Sunday Special Classes",
                      "Weekly Test",
                      "Surprise Test",
                      "Doubt Session",
                      "Board Exam Preparation",
                    ].map((fac) => (
                      <li key={fac} className="flex items-center gap-2.5 text-sm text-[#F8FAFC]/80">
                        <svg className="w-4 h-4 text-[#06B6D4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-[#F8FAFC]/90 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — STUDENT EXCELLENCE */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold text-[#F8FAFC]"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Our Top Performers
            </h2>
            <p className="mt-4 text-[#94A3B8] text-sm sm:text-base">
              Celebrating conceptual mastery and exemplary results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {performers.map((student) => (
              <div
                key={student.name}
                style={glassCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 flex flex-col items-center text-center hover:border-white/20"
              >
                {/* Initials circle in cyan */}
                <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center mb-4 font-bold text-lg">
                  {student.initials}
                </div>

                <h4 className="font-bold text-white text-base leading-tight mb-1">{student.name}</h4>
                <p className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider mb-4">
                  {student.batch}
                </p>

                <div className="border-t border-white/10 w-full my-3"></div>

                {/* Big amber percentage - maximum font-weight 700 */}
                <div className="text-3xl font-bold text-[#F59E0B] tracking-tight my-2">
                  {student.percentage}
                </div>

                {/* Cyan rank badge */}
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 tracking-wider">
                    {student.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — ABOUT */}
      <section className="py-24 bg-[#111827] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h2
                className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-6"
                style={{ fontFamily: "var(--font-poppins), sans-serif" }}
              >
                About Brainstorm Academy
              </h2>
              <p className="text-base text-[#94A3B8] leading-relaxed mb-6">
                At Brainstorm Academy, we are dedicated to transforming learning into a journey of discovery and success. Strategically situated in Berhampur, Odisha, our academy has been a trusted guide for academic success since 2010. We specialize in building robust concepts, sharpening technical expertise, and equipping students with the confidence to excel in high school, higher secondary, and IT skill sets.
              </p>
              <p className="text-base text-[#94A3B8] leading-relaxed">
                We advocate for concept-driven pacing rather than mechanical memorization. By pairing highly specialized faculty mentors with routine test reviews and smart air-conditioned classrooms, we ensure our students remain highly prepared and inspired to succeed.
              </p>
            </div>

            {/* Right Desk Card + Added Classroom Image */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-md mx-auto lg:max-w-none">
              {/* Founder desk card */}
              <div
                style={glassCardAmberStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 relative overflow-hidden hover:border-[#F59E0B]/40"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F59E0B]/5 rounded-full blur-2xl -z-10"></div>
                <h3 className="text-lg font-bold text-white mb-2">Director's Desk</h3>
                <p className="text-sm text-white/80 italic leading-relaxed mb-6">
                  "At Brainstorm Academy, our core philosophy is simple: empower the student from day one. We ensure that our training goes beyond memorization to instil analytical thinking and lifelong values. Our success is measured by the progress and smiles of our learners."
                </p>
                <div className="border-t border-white/10 w-full my-4"></div>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-white/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm border border-white/10">
                    AK
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Mr. Asis Kumar</h5>
                    <p className="text-xs text-[#94A3B8]">Founder and Director</p>
                  </div>
                </div>
              </div>

              {/* Classroom Image - border radius 16px and cyan glow */}
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"
                alt="Brainstorm Academy Classroom Study Hall"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 0 40px rgba(6,182,212,0.2)",
                }}
                className="w-full h-48 sm:h-60 object-cover border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CONTACT */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold text-[#F8FAFC]"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              Get In Touch
            </h2>
            <p className="mt-4 text-[#94A3B8] text-sm sm:text-base">
              Reach out to our team or navigate directly to our office campus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column — 3 stacked cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Phone card */}
              <div
                style={glassCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 flex items-start gap-4 flex-1 hover:border-white/20"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Phone Numbers</h4>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+919933825835" className="text-[#06B6D4] hover:underline font-semibold text-sm sm:text-base">
                      +91 99338 25835
                    </a>
                    <a href="tel:+912008548156" className="text-[#06B6D4] hover:underline font-semibold text-sm sm:text-base">
                      +91 20085 48156
                    </a>
                  </div>
                </div>
              </div>

              {/* Email card */}
              <div
                style={glassCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 flex items-start gap-4 flex-1 hover:border-white/20"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Email Addresses</h4>
                  <div className="flex flex-col gap-1">
                    <a href="mailto:avisdasw4@gmail.com" className="text-[#06B6D4] hover:underline font-semibold text-sm sm:text-base break-all">
                      avisdasw4@gmail.com
                    </a>
                    <a href="mailto:brainstormdplusacademy@gmail.com" className="text-[#06B6D4] hover:underline font-semibold text-sm sm:text-base break-all">
                      brainstormdplusacademy@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Location card */}
              <div
                style={glassCardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 flex items-start gap-4 flex-1 hover:border-white/20"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#06B6D4] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Location</h4>
                  <span className="text-sm text-[#94A3B8] font-semibold">
                    Near Radio Station, Berhampur, Odisha
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — Large glass box with location pin and button */}
            <div className="lg:col-span-6 flex">
              <div
                style={glassCardStyle}
                className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group w-full min-h-[350px]"
              >
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>

                  <h4 className="font-extrabold text-white text-lg tracking-wide">Interactive Campus Map</h4>
                  <p className="text-sm text-[#94A3B8] mt-2 max-w-xs leading-relaxed">
                    Brainstorm Academy, Radio Station Road, Berhampur, Odisha, India
                  </p>

                  <div className="mt-8">
                    <a
                      href="https://maps.google.com/?q=Brainstorm+Academy+Radio+Station+Berhampur+Odisha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <button className="px-6 py-3 rounded-xl bg-[#F59E0B] text-[#0F172A] font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#d98c0b] hover:scale-105 active:scale-98 shadow-md shadow-[#F59E0B]/10 cursor-pointer">
                        GET DIRECTIONS
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
