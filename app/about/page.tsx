"use client";

import React, { useEffect, useRef } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AboutPage() {
  const scrollRef = useRef<
    (HTMLDivElement | HTMLElement | HTMLHeadingElement)[]
  >([]);

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
      { threshold: 0.1 },
    );

    scrollRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (
    el: HTMLDivElement | HTMLElement | HTMLHeadingElement | null,
  ) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  const cardStyle = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const values = [
    {
      icon: "🎯",
      title: "Excellence",
      desc: "We set high standards and never compromise on quality",
    },
    {
      icon: "🤝",
      title: "Trust",
      desc: "Building lasting relationships with students and parents",
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "Modern teaching methods for better understanding",
    },
    {
      icon: "❤️",
      title: "Care",
      desc: "Every student matters to us personally",
    },
  ];

  const reasons = [
    {
      icon: "👨‍🏫",
      title: "Expert Faculty",
      desc: "Experienced and dedicated teachers",
    },
    {
      icon: "📚",
      title: "Complete Syllabus",
      desc: "Full coverage of board exam syllabus",
    },
    {
      icon: "📝",
      title: "Regular Tests",
      desc: "Weekly and monthly assessments",
    },
    {
      icon: "🏆",
      title: "Proven Results",
      desc: "Consistent top performers every year",
    },
    {
      icon: "🏫",
      title: "Modern Facility",
      desc: "AC classrooms and computer labs",
    },
    {
      icon: "💬",
      title: "Personal Attention",
      desc: "Small batch sizes for focused learning",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] text-[#42576E] overflow-x-hidden ${poppins.className}`}
    >
      {/* Section 1 — Hero */}
      <section className="pt-24 pb-16 px-6 flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
        <div
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8]"
        >
          OUR STORY
        </div>
        <h1
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[#003358]"
        >
          About Brainstorm Academy
        </h1>
        <p
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out text-lg text-[#42576E] max-w-2xl mx-auto mb-16"
        >
          A decade of excellence in education at Berhampur, Odisha
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            { value: "10+", label: "Years of Excellence" },
            { value: "1500+", label: "Students Taught" },
            { value: "98%", label: "Pass Rate" },
            { value: "ISO", label: "9001:2015 Certified" },
          ].map((stat, idx) => (
            <div
              key={idx}
              ref={addToRefs}
              style={{ ...cardStyle, transitionDelay: `${idx * 100}ms` }}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 flex flex-col items-center justify-center text-center hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <span className="text-3xl md:text-4xl font-extrabold text-[#003358] mb-2">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-[#42576E] font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2 — Our Story */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side text */}
          <div
            ref={addToRefs}
            className="opacity-0 translate-y-10 transition-all duration-700 ease-out space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#003358]">
              Our Journey
            </h2>
            <p className="text-[#42576E] leading-relaxed text-md">
              Brainstorm Academy was established with a single vision — to
              provide quality education to every student in Berhampur, Odisha.
              Over the past decade, we have grown from a small coaching center
              to one of the most trusted educational institutes in the region.
            </p>
            <p className="text-[#42576E] leading-relaxed text-md">
              Our commitment to excellence, disciplined teaching methodology,
              and student-first approach has helped thousands of students
              achieve their academic goals. We continuously strive to improve
              our methods and align with modern standards to shape promising
              futures.
            </p>
          </div>

          {/* Right Side image */}
          <div
            ref={addToRefs}
            className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out relative group"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2dbcfe] to-[#00658d] opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"
              alt="Brainstorm Academy Learning Environment"
              className="relative w-full h-[350px] object-cover rounded-2xl border border-[#7FB3E8]"
            />
          </div>
        </div>
      </section>

      {/* Section 3 — Our Values */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <h2
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-3xl md:text-4xl font-bold text-center text-[#003358]"
        >
          What We Stand For
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val, idx) => (
            <div
              key={val.title}
              ref={addToRefs}
              style={{ ...cardStyle, transitionDelay: `${idx * 100}ms` }}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 md:p-8 flex gap-6 items-start hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <span className="text-4xl bg-[#9FC7F0] p-4 rounded-2xl border border-[#7FB3E8]">
                {val.icon}
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#003358] mb-2">
                  {val.title}
                </h3>
                <p className="text-[#42576E] leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Founder */}
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        <h2
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-3xl md:text-4xl font-bold text-center text-[#003358]"
        >
          Meet Our Founder
        </h2>

        <div
          ref={addToRefs}
          style={{ ...cardStyle }}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-8 md:p-12 border-l-4 border-l-[#003358] flex flex-col md:flex-row gap-8 items-center"
        >
          {/* Avatar circle */}
          <div className="w-24 h-24 rounded-full bg-[#9FC7F0] border border-[#7FB3E8] flex items-center justify-center text-3xl font-extrabold text-[#003358] shrink-0">
            AK
          </div>

          <div className="space-y-4 text-center md:text-left flex-grow">
            <div>
              <h3 className="text-2xl font-bold text-[#003358]">
                Mr. Asis Kumar
              </h3>
              <p className="text-[#00658d] font-medium text-sm">
                Founder & Director, Brainstorm Academy
              </p>
            </div>

            <p className="text-[#42576E] italic leading-relaxed text-md">
              Our mission is simple — every student who walks through our doors
              should leave with knowledge, confidence and the ability to achieve
              their dreams.
            </p>

            {/* ISO Badge */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]">
                ⭐ ISO 9001:2015 Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Why Choose Us */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12 mb-16">
        <h2
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-3xl md:text-4xl font-bold text-center text-[#003358]"
        >
          Why Students Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <div
              key={reason.title}
              ref={addToRefs}
              style={{ ...cardStyle, transitionDelay: `${idx * 50}ms` }}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 flex flex-col hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-4 bg-[#9FC7F0] border border-[#7FB3E8] w-fit p-3 rounded-xl text-[#003358]">
                {reason.icon}
              </div>
              <h3 className="text-lg font-bold text-[#003358] mb-2">
                {reason.title}
              </h3>
              <p className="text-[#42576E] text-sm leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
