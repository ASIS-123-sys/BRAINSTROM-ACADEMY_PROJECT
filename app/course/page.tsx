"use client";

import React, { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ComputerCourse = {
  shortName: string;
  fullName: string;
  description: string;
  fee: string;
};

const computerCourses: ComputerCourse[] = [
  {
    shortName: "ADCA",
    fullName: "Advanced Diploma in Computer Application",
    description: "In-depth training covering office automation, database systems, web design, and advanced software tools.",
    fee: "Rs. 250",
  },
  {
    shortName: "CCA",
    fullName: "Certificate in Computer Application",
    description: "Fundamental course introducing computer basics, operating systems, and essential internet applications.",
    fee: "Rs. 250",
  },
  {
    shortName: "DCA",
    fullName: "Diploma in Computer Application",
    description: "Comprehensive program covering MS Office, database management, and programming foundations.",
    fee: "Rs. 250",
  },
  {
    shortName: "PGDCA",
    fullName: "Post Graduate Diploma in Computer Application",
    description: "Advanced post-graduate program specializing in system analysis, programming language structures, and IT applications.",
    fee: "Rs. 250",
  },
  {
    shortName: "Tally ERP 9",
    fullName: "Accounting and Finance Software",
    description: "Practical accounting module focusing on inventory management, GST computation, billing, and financial reports.",
    fee: "Rs. 250",
  },
  {
    shortName: "Spoken English",
    fullName: "Communication and Language Skills",
    description: "Personality development, vocabulary enrichment, active listening, and fluent conversational practice.",
    fee: "Rs. 250",
  },
];

type StreamCard = {
  stream: string;
  tagline: string;
  subjects: string[];
};

const streams: StreamCard[] = [
  {
    stream: "Science",
    tagline: "Caring Soul stream",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
  },
  {
    stream: "Commerce",
    tagline: "All Subjects",
    subjects: ["Accountancy", "Business Studies", "Economics", "Maths"],
  },
  {
    stream: "Arts",
    tagline: "All Subjects",
    subjects: ["History", "Political Science", "Geography", "Odia"],
  },
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"computer" | "grade12" | "school">("computer");
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
  }, [activeTab]); // Reset observer whenever active tab changes to capture new elements

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

  return (
    <div className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden pb-12 ${poppins.className}`}>
      
      {/* Top Section */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <div
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20"
        >
          WHAT WE OFFER
        </div>
        <h1
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          Our Courses
        </h1>
        <p
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out text-lg text-[#94A3B8] max-w-xl mx-auto"
        >
          Choose your path to success
        </p>
      </section>

      {/* Tab Buttons Row */}
      <section className="max-w-4xl mx-auto px-6 mb-12 flex justify-center">
        <div 
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out flex flex-col sm:flex-row gap-3 w-full p-2"
          style={glassCardStyle}
        >
          <button
            onClick={() => {
              setActiveTab("computer");
              scrollRef.current = [];
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center ${
              activeTab === "computer"
                ? "bg-[#06B6D4] text-[#0F172A] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "text-[#F8FAFC] hover:bg-white/5"
            }`}
          >
            Computer Courses
          </button>
          <button
            onClick={() => {
              setActiveTab("grade12");
              scrollRef.current = [];
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center ${
              activeTab === "grade12"
                ? "bg-[#06B6D4] text-[#0F172A] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "text-[#F8FAFC] hover:bg-white/5"
            }`}
          >
            12th Grade
          </button>
          <button
            onClick={() => {
              setActiveTab("school");
              scrollRef.current = [];
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center ${
              activeTab === "school"
                ? "bg-[#06B6D4] text-[#0F172A] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : "text-[#F8FAFC] hover:bg-white/5"
            }`}
          >
            5th to 10th
          </button>
        </div>
      </section>

      {/* Tab Contents */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        
        {/* Tab 1 — Computer Courses */}
        {activeTab === "computer" && (
          <div className="space-y-12">
            <div className="flex justify-center" ref={addToRefs}>
              <span className="opacity-0 translate-y-10 transition-all duration-700 ease-out px-4 py-1.5 rounded-full text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                ★ ISO 9001:2015 Certified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {computerCourses.map((course, idx) => (
                <div
                  key={course.shortName}
                  ref={addToRefs}
                  style={glassCardStyle}
                  className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 flex flex-col hover:border-[#06B6D4]/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all duration-300"
                  style={{ ...glassCardStyle, transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="text-2xl mb-4 flex items-center justify-between">
                    <span className="text-[#06B6D4] bg-[#06B6D4]/10 p-2.5 rounded-xl">💻</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-[#94A3B8]">
                      {course.fee}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#F59E0B] mb-1">{course.shortName}</h3>
                  <h4 className="text-md font-semibold text-[#F8FAFC] mb-3">{course.fullName}</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed flex-grow">{course.description}</p>
                </div>
              ))}
            </div>

            {/* Computer Facilities */}
            <div className="space-y-6 pt-8 border-t border-white/5" ref={addToRefs}>
              <h3 className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-center text-xl font-bold text-[#F8FAFC]">
                What's Included
              </h3>
              <div className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out flex flex-wrap justify-center gap-3">
                {["Seminars Exam", "Syllabus Material", "KIT Bag", "ID Card", "AC Class Room"].map((facility) => (
                  <span
                    key={facility}
                    style={glassCardStyle}
                    className="px-4 py-2 text-xs font-medium text-[#94A3B8]"
                  >
                    ✓ {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 — 12th Grade */}
        {activeTab === "grade12" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {streams.map((item, idx) => (
                <div
                  key={item.stream}
                  ref={addToRefs}
                  style={glassCardStyle}
                  className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 md:p-8 flex flex-col hover:border-[#06B6D4]/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all duration-300"
                  style={{ ...glassCardStyle, transitionDelay: `${idx * 100}ms` }}
                >
                  <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider mb-2">Stream</span>
                  <h3 className="text-3xl font-bold text-[#F59E0B] mb-1">{item.stream}</h3>
                  <p className="text-sm italic text-[#94A3B8] mb-6">{item.tagline}</p>
                  
                  <div className="space-y-3 flex-grow">
                    <h4 className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">Subjects covered:</h4>
                    <ul className="space-y-2">
                      {item.subjects.map((sub) => (
                        <li key={sub} className="flex items-center text-sm text-[#94A3B8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mr-2"></span>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* 12th Facilities */}
            <div className="space-y-6 pt-8 border-t border-white/5" ref={addToRefs}>
              <h3 className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-center text-xl font-bold text-[#F8FAFC]">
                What's Included
              </h3>
              <div className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out flex flex-wrap justify-center gap-3">
                {[
                  "Experienced Faculty",
                  "Fundamental Clearing Classes",
                  "Doubt Clearing Class",
                  "Monthly Test",
                  "Class Examination Test",
                  "Crash Course with Exam"
                ].map((facility) => (
                  <span
                    key={facility}
                    style={glassCardStyle}
                    className="px-4 py-2 text-xs font-medium text-[#94A3B8]"
                  >
                    ✓ {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3 — 5th to 10th Grade */}
        {activeTab === "school" && (
          <div className="space-y-12">
            <div 
              ref={addToRefs}
              style={glassCardStyle}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-8 md:p-12 hover:border-[#06B6D4]/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                <div>
                  <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider mb-2 block">Comprehensive School Program</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#F59E0B]">Class 5th to 10th</h3>
                  <p className="text-[#94A3B8] mt-2">All school subjects covered under expert guidance.</p>
                </div>
                
                {/* Highlighted Note */}
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-4 max-w-sm">
                  <p className="text-sm font-semibold text-[#F59E0B] flex items-start gap-2">
                    <span className="text-lg">📢</span>
                    <span>Special focus on Board Exam preparation with intensive test series.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase mb-4">Subjects:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["Mathematics", "Science", "Social Studies", "English", "Odia", "Sanskrit"].map((sub) => (
                      <div key={sub} className="flex items-center text-sm text-[#94A3B8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mr-2"></span>
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase mb-4">Facilities:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Monthly Test",
                      "Sunday Special Classes",
                      "Weekly Test",
                      "Surprise Test",
                      "Doubt Session",
                      "Board Exam Preparation"
                    ].map((facility) => (
                      <div key={facility} className="flex items-center text-sm text-[#94A3B8]">
                        <span className="text-[#06B6D4] mr-2">✓</span>
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div 
          ref={addToRefs}
          style={glassCardStyle}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-8 md:p-12 text-center flex flex-col items-center justify-center border-l-4 border-l-[#F59E0B]"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enroll?</h2>
          <p className="text-[#94A3B8] mb-8 max-w-lg">
            Contact us today to join the next batch. Start your journey with Brainstorm Academy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/contact"
              className="px-8 py-4 rounded-xl font-bold bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 transition-colors duration-300 text-center shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              Contact Us
            </Link>
            <Link 
              href="/notice"
              className="px-8 py-4 rounded-xl font-bold border border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-colors duration-300 text-center"
            >
              View Notice Board
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
