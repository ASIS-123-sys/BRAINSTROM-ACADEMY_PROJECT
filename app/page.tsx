"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.borderColor = "#2dbcfe";
    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,53,88,0.12)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.borderColor = "#7FB3E8";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,53,88,0.08)";
  };

  // Card style object
  const cardStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,53,88,0.08)",
  };
  //Notices ticker content
  const notices = [
    "Welcome TO BrainStorm Academy",
    "ISO 9001:2015 Certified",
    "Berhampur, Odisha",
  ];

  type TopScorer = {
    id: string;
    name: string;
    batch: string;
    rank: string;
    percentage: string;
    profile_pic_url?: string;
  };

  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [loadingTopScorers, setLoadingTopScorers] = useState(true);

  useEffect(() => {
    async function fetchTopScorers() {
      try {
        const res = await fetch("/api/top-scorers");
        const json = await res.json();
        if (json.data) setTopScorers(json.data);
      } catch {
        // silently fail — section just stays empty
      } finally {
        setLoadingTopScorers(false);
      }
    }

    fetchTopScorers();
  }, []);
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const performers = topScorers.map((student) => ({
    ...student,
    initials: getInitials(student.name),
  }));

  return (
    <div
      className={`${poppins.variable} bg-[#F7FAFD] text-[#111c2d] overflow-hidden min-h-screen relative w-full`}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* ─── INJECTED KEYFRAME & TRANSITION CSS ─────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[92vh] lg:min-h-[85vh] flex items-center py-20 lg:py-24 overflow-hidden section-animate bg-[#F7FAFD]">
        {/* Large Decorative Blurred Circles */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#2dbcfe] opacity-10 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#00658d] opacity-[0.05] blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text content + stats pills */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Cyan Border pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-[#003358] border border-[#B8D4F0] bg-[#D8E8FB] uppercase mb-5 shadow-sm">
                ISO 9001:2015 Certified • Berhampur, Odisha
              </div>

              {/* Main Tagline Heading */}
              <h1
                className="font-bold tracking-tight mb-4 select-none leading-tight text-[#003358]"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  lineHeight: "1.2",
                }}
              >
                Empowering Every Student to Achieve{" "}
                <span className="text-[#2dbcfe]">Excellence</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-[#111c2d]/80 max-w-2xl leading-relaxed mb-6 font-medium">
                Comprehensive coaching for Computer Courses, 12th Grade and
                Class 5–10 in Berhampur, Odisha. Expert faculty. Proven results.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mb-8">
                <Link href="/course" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2dbcfe] text-[#003358] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#20a8e8] hover:scale-105 active:scale-98 shadow-md cursor-pointer">
                    Explore Courses
                  </button>
                </Link>
                <Link href="/auth/student-login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#003358] hover:bg-[#003358]/5 text-[#003358] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer">
                    Student Login
                  </button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                {[
                  { val: "9+", label: "Years Experience" },
                  { val: "98%", label: "Pass Rate" },
                  { val: "ISO", label: "9001:2015" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={cardStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="text-center py-2 px-2 hover:border-[#2dbcfe]"
                  >
                    <span className="block text-xl font-bold text-[#00658d]">
                      {stat.val}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#111c2d]/80 font-medium tracking-wide block mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Placeholder */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div
                className="w-full max-w-md aspect-[4/3] rounded-2xl shadow-lg border border-[#B8D4F0]"
                style={{
                  background:
                    "linear-gradient(135deg, #D8E8FB 0%, #C5DDF5 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — NOTICE TICKER */}
      <section className="bg-[#DCE9F9] py-4 flex items-center overflow-hidden z-20 relative border-t border-b border-[#B8D4F0]">
        <div className="pl-6 pr-4 border-r border-[#B8D4F0] flex-shrink-0 z-10 bg-[#DCE9F9]">
          <span className="text-[#003358] font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-1.5">
            <span></span>
            <span></span>
          </span>
        </div>
        <div className="flex-1 ticker-container py-1">
          <div className="ticker">
            {/* Set 1 */}
            {notices.map((n, i) => (
              <span
                key={i}
                className="flex items-center gap-4 text-[#111c2d] font-semibold text-xs sm:text-sm"
              >
                <span>{n}</span>
                <span className="w-2 h-2 rounded-full bg-[#2dbcfe]"></span>
              </span>
            ))}
            {/* Set 2 */}
            {notices.map((n, i) => (
              <span
                key={`dup-${i}`}
                className="flex items-center gap-4 text-[#111c2d] font-semibold text-xs sm:text-sm"
              >
                <span>{n}</span>
                <span className="w-2 h-2 rounded-full bg-[#2dbcfe]"></span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — COURSES */}
      <section className="py-20 bg-[#F2F7FC] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#003358]">
              Our Programs
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#111c2d]/80 font-medium">
              Structured learning paths for every stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 — Computer Courses */}
            <div
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#2dbcfe]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#9FC7F0] border border-[#7FB3E8] text-[#00658d] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="14"
                      rx="2"
                      strokeWidth={1.5}
                    />
                    <path d="M8 21h8" strokeWidth={1.5} strokeLinecap="round" />
                    <path
                      d="M12 17v4"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003358] leading-tight">
                    Computer Courses 💻
                  </h3>
                  <p className="text-xs text-[#42576E] font-medium">
                    Vocational Tech
                  </p>
                </div>
              </div>

              {/* Badges list */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {[
                  "ADCA",
                  "CCA",
                  "DCA",
                  "PGDCA",
                  "Tally ERP 9",
                  "Spoken English",
                ].map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Note details */}
              <div className="p-3 rounded-xl bg-[#9FC7F0] border border-[#7FB3E8] text-xs text-[#003358] text-center mb-6">
                ISO 9001:2015 Certified
              </div>

              <div className="border-t border-[#7FB3E8] pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#5A7186] uppercase tracking-widest mb-3">
                    Facilities:
                  </h4>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Seminars Exam",
                      "Syllabus Material",
                      "KIT Bag",
                      "ID Card",
                      "AC Class Room",
                    ].map((fac) => (
                      <li
                        key={fac}
                        className="flex items-center gap-2.5 text-sm text-[#1E3A52] font-medium"
                      >
                        <svg
                          className="w-4 h-4 text-[#2dbcfe] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-4 rounded-full border border-[#003358] hover:bg-[#003358] hover:text-white text-[#003358] text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2 — 12th Grade */}
            <div
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#2dbcfe]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#9FC7F0] border border-[#7FB3E8] text-[#00658d] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 14v7a1 1 0 001 1h2a1 1 0 001-1v-7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003358] leading-tight">
                    12th Grade 📚
                  </h3>
                  <p className="text-xs text-[#42576E] font-medium">
                    Higher Secondary
                  </p>
                </div>
              </div>

              {/* Streams details */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {[
                  "Science (Coming Soon)",
                  "Commerce (All Subjects)",
                  "Arts (All Subjects)",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Placeholder gap for alignment */}
              <div className="h-[46px] mb-6"></div>

              <div className="border-t border-[#7FB3E8] pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#5A7186] uppercase tracking-widest mb-3">
                    Facilities:
                  </h4>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Experienced Faculty",
                      "Fundamental Clearing Classes",
                      "Doubt Clearing Class",
                      "Monthly Test",
                      "Class Examination Test",
                      "Crash Course with Exam",
                    ].map((fac) => (
                      <li
                        key={fac}
                        className="flex items-center gap-2.5 text-sm text-[#1E3A52] font-medium"
                      >
                        <svg
                          className="w-4 h-4 text-[#2dbcfe] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-4 rounded-full border border-[#003358] hover:bg-[#003358] hover:text-white text-[#003358] text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 3 — 5th to 10th Grade */}
            <div
              style={cardStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="p-6 flex flex-col h-full hover:border-[#2dbcfe]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#9FC7F0] border border-[#7FB3E8] text-[#00658d] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003358] leading-tight">
                    5th to 10th Grade ✏️
                  </h3>
                  <p className="text-xs text-[#42576E] font-medium">
                    Secondary Foundation
                  </p>
                </div>
              </div>

              {/* Subject details */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]">
                  All Subjects
                </span>
              </div>

              {/* Placeholder gap for alignment */}
              <div className="h-[46px] mb-6"></div>

              <div className="border-t border-[#7FB3E8] pt-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#5A7186] uppercase tracking-widest mb-3">
                    Facilities:
                  </h4>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Monthly Test",
                      "Sunday Special Classes",
                      "Weekly Test",
                      "Surprise Test",
                      "Doubt Session",
                      "Board Exam Preparation",
                    ].map((fac) => (
                      <li
                        key={fac}
                        className="flex items-center gap-2.5 text-sm text-[#1E3A52] font-medium"
                      >
                        <svg
                          className="w-4 h-4 text-[#2dbcfe] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/course" className="w-full">
                  <button className="w-full py-4 rounded-full border border-[#003358] hover:bg-[#003358] hover:text-white text-[#003358] text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center">
                    Learn More &rarr;
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — STUDENT EXCELLENCE */}
      <section className="py-20 bg-[#F7FAFD] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#003358]">
              Best Scorers of All Time
            </h2>
            <p className="mt-4 text-[#111c2d]/80 text-sm sm:text-base font-medium">
              Celebrating conceptual mastery and exemplary results.
            </p>
          </div>

          {loadingTopScorers && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
            </div>
          )}

          {!loadingTopScorers && performers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#111c2d]/70">Top scorers coming soon.</p>
            </div>
          )}

          {!loadingTopScorers && performers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {performers.map((student) => (
                <div
                  key={student.id}
                  style={cardStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="p-6 flex flex-col items-center text-center hover:border-[#2dbcfe]"
                >
                  {/* Initials circle in cyan */}
                  <div className="w-16 h-16 rounded-full bg-[#F7FAFD] border border-[#D6E4F5] text-[#00658d] flex items-center justify-center mb-4 font-bold text-lg">
                    {student.initials}
                  </div>

                  <h4 className="font-bold text-[#003358] text-base leading-tight mb-1">
                    {student.name}
                  </h4>
                  <p className="text-[10px] text-[#111c2d]/80 uppercase font-bold tracking-wider mb-4">
                    {student.batch}
                  </p>

                  <div className="border-t border-[#D6E4F5] w-full my-3"></div>

                  {/* Big percentage */}
                  <div className="text-3xl font-bold text-[#2dbcfe] tracking-tight my-2">
                    {student.percentage}
                  </div>

                  {/* Rank badge */}
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F7FAFD] text-[#003358] border border-[#B8D4F0] tracking-wider">
                      {student.rank}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 — ABOUT */}
      <section className="py-20 bg-[#F2F7FC] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-5xl font-bold text-[#003358] mb-6">
                About Brainstorm Academy
              </h2>
              <p className="text-base text-[#111c2d]/90 font-medium leading-relaxed mb-6">
                At Brainstorm Academy, we are dedicated to transforming learning
                into a journey of discovery and success. Strategically situated
                in Berhampur, Odisha, our academy has been a trusted guide for
                academic success since 2017. We specialize in building robust
                concepts, sharpening technical expertise, and equipping students
                with the confidence to excel in high school, higher secondary,
                and IT skill sets.
              </p>
              <p className="text-base text-[#111c2d]/90 font-medium leading-relaxed">
                We advocate for concept-driven pacing rather than mechanical
                memorization. By pairing highly specialized faculty mentors with
                routine test reviews and smart air-conditioned classrooms, we
                ensure our students remain highly prepared and inspired to
                succeed.
              </p>
            </div>

            {/* Right Desk Card + Added Classroom Image */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-md mx-auto lg:max-w-none">
              {/* Founder desk card */}
              <div
                style={cardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-6 relative overflow-hidden hover:border-[#2dbcfe]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00658d]/5 rounded-full blur-2xl -z-10"></div>
                <h3 className="text-lg font-bold text-[#003358] mb-2">
                  Director&apos;s Desk
                </h3>
                <p className="text-sm text-[#111c2d]/80 font-medium italic leading-relaxed mb-6">
                  At Brainstorm Academy, our core philosophy is simple: empower
                  the student from day one. We ensure that our training goes
                  beyond memorization to instil analytical thinking and lifelong
                  values. Our success is measured by the progress and smiles of
                  our learners.
                </p>
                <div className="border-t border-[#D6E4F5] w-full my-4"></div>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#F7FAFD] text-[#00658d] flex items-center justify-center font-bold text-sm border border-[#D6E4F5]">
                    AK
                  </div>
                  <div>
                    <h5 className="font-bold text-[#003358] text-sm">
                      K ASIS DAS
                    </h5>
                    <p className="text-xs text-[#111c2d]/80 font-medium">
                      Founder and Managing Director
                    </p>
                  </div>
                </div>
              </div>

              {/* Classroom Placeholder */}
              <div
                className="w-full h-48 sm:h-60 rounded-2xl shadow-lg border border-[#B8D4F0]"
                style={{
                  background:
                    "linear-gradient(135deg, #D8E8FB 0%, #C5DDF5 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CONTACT */}
      <section className="py-20 bg-[#111c2d] relative overflow-hidden section-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#ffffff]">
              Get In Touch
            </h2>
            <p className="mt-4 text-[#ffffff]/70 text-sm sm:text-base font-medium">
              Reach out to our team or navigate directly to our office campus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column — 3 stacked cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Phone card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2dbcfe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
                className="p-6 flex items-start gap-4 flex-1 hover:border-[#2dbcfe]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#2dbcfe] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">
                    Phone Numbers
                  </h4>
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:+919938828835"
                      className="text-[#2dbcfe] hover:underline font-semibold text-sm sm:text-base"
                    >
                      +91 9938828835
                    </a>
                    <a
                      href="tel:+917008546156"
                      className="text-[#2dbcfe] hover:underline font-semibold text-sm sm:text-base"
                    >
                      +91 7008546156
                    </a>
                  </div>
                </div>
              </div>

              {/* Email card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2dbcfe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
                className="p-6 flex items-start gap-4 flex-1 hover:border-[#2dbcfe]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#2dbcfe] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">
                    Email Addresses
                  </h4>
                  <div className="flex flex-col gap-1">
                    <a
                      href="mailto:avisdasw4@gmail.com"
                      className="text-[#2dbcfe] hover:underline font-semibold text-sm sm:text-base break-all"
                    >
                      asisdas1994@gmail.com
                    </a>
                    <a
                      href="mailto:brainstormdplusacademy@gmail.com"
                      className="text-[#2dbcfe] hover:underline font-semibold text-sm sm:text-base break-all"
                    >
                      brainstormcomputeracademy@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Location card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2dbcfe";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
                className="p-6 flex items-start gap-4 flex-1 hover:border-[#2dbcfe]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#2dbcfe] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">
                    Location
                  </h4>
                  <span className="text-sm text-[#ffffff]/70 font-semibold">
                    Near Radio Station, Berhampur, Odisha
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — Large glass box with location pin and button */}
            <div className="lg:col-span-6 flex">
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group w-full min-h-[350px]"
              >
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-[#2dbcfe] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>

                  <h4 className="font-extrabold text-white text-lg tracking-wide">
                    Interactive Campus Map
                  </h4>
                  <p className="text-sm text-[#ffffff]/70 mt-2 max-w-xs leading-relaxed font-medium">
                    Brainstorm Academy, Radio Station Road, Berhampur, Odisha,
                    India
                  </p>

                  <div className="mt-8">
                    <a
                      href="https://maps.google.com/?q=Brainstorm+Academy+Radio+Station+Berhampur+Odisha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <button className="px-8 py-4 rounded-full bg-[#2dbcfe] text-[#003358] font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#20a8e8] hover:scale-105 active:scale-98 shadow-md cursor-pointer">
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
