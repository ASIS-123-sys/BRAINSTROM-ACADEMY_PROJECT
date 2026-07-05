"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";

const AcademyMap = dynamic(() => import("@/components/public/Map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "400px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94A3B8",
      }}
    >
      Loading map...
    </div>
  ),
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ContactPage() {
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

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] text-[#42576E] overflow-x-hidden pb-24 ${poppins.className}`}
    >
      {/* Section 1 — Hero */}
      <section className="pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
        <div
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8]"
        >
          REACH OUT
        </div>
        <h1
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[#003358]"
        >
          Get In Touch
        </h1>
        <p
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out text-lg text-[#42576E] max-w-xl mx-auto"
        >
          We are here to answer your questions and help you get started
        </p>
      </section>

      {/* Section 2 — Contact Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column — 3 Stacked Cards */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Phone Card */}
            <div
              ref={addToRefs}
              style={cardStyle}
              className="opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 flex items-start gap-4 hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <div className="text-2xl text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8] p-3 rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#003358]">
                  Phone Numbers
                </h3>
                <p className="text-xs text-[#42576E] font-medium">
                  Call us directly during office hours
                </p>
                <div className="flex flex-col gap-1 pt-2">
                  <a
                    href="tel:+919933825835"
                    className="text-[#00658d] font-semibold hover:underline w-fit"
                  >
                    +91 99338 25835
                  </a>
                  <a
                    href="tel:+912008548156"
                    className="text-[#00658d] font-semibold hover:underline w-fit"
                  >
                    +91 20085 48156
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div
              ref={addToRefs}
              style={cardStyle}
              className="opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out p-6 flex items-start gap-4 hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <div className="text-2xl text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8] p-3 rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#003358]">
                  Email Addresses
                </h3>
                <p className="text-xs text-[#42576E] font-medium">
                  Send us your queries anytime
                </p>
                <div className="flex flex-col gap-1 pt-2">
                  <a
                    href="mailto:avisdasw4@gmail.com"
                    className="text-[#00658d] font-semibold hover:underline w-fit break-all"
                  >
                    avisdasw4@gmail.com
                  </a>
                  <a
                    href="mailto:brainstormdplusacademy@gmail.com"
                    className="text-[#00658d] font-semibold hover:underline w-fit break-all"
                  >
                    brainstormdplusacademy@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div
              ref={addToRefs}
              style={cardStyle}
              className="opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out p-6 flex items-start gap-4 hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300"
            >
              <div className="text-2xl text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8] p-3 rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#003358]">
                  Institute Location
                </h3>
                <p className="text-xs text-[#42576E] font-medium">
                  Come visit us
                </p>
                <p className="text-[#42576E] font-semibold pt-2 text-sm leading-relaxed">
                  Near Radio Station, Berhampur,
                  <br />
                  Odisha, India
                </p>
              </div>
            </div>
          </div>

          {/* Right Column — Map Card */}
          <div
            ref={addToRefs}
            style={cardStyle}
            className="opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out p-6 md:p-8 flex flex-col justify-between hover:border-[#2dbcfe] hover:shadow-md transition-all duration-300 h-full"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="text-3xl text-[#003358] bg-[#9FC7F0] border border-[#7FB3E8] p-4 rounded-full mb-3 shadow-md">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#003358]">
                Brainstorm Academy
              </h3>
              <p className="text-sm text-[#42576E] mt-1">
                Near Radio Station, Berhampur, Odisha, India
              </p>

              <a
                href="https://maps.google.com/?q=Brainstorm+Academy+Radio+Station+Berhampur+Odisha"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 px-6 py-2.5 bg-[#2dbcfe] text-[#003358] font-bold rounded-full text-xs uppercase tracking-wider hover:opacity-90 shadow-md transition-all duration-300"
              >
                Get Directions
              </a>
            </div>

            <div className="w-full relative overflow-hidden rounded-xl border border-[#7FB3E8] flex-grow min-h-[250px] lg:min-h-0 flex items-stretch">
              <AcademyMap />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Office Hours */}
      <section className="max-w-6xl mx-auto px-6">
        <h2
          ref={addToRefs}
          className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-3xl font-bold text-center text-[#003358] mb-10"
        >
          Office Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              day: "Monday to Friday",
              hours: "7:00 AM — 8:00 PM",
              active: true,
            },
            { day: "Saturday", hours: "7:00 AM — 6:00 PM", active: false },
            { day: "Sunday", hours: "Special Classes Only", active: false },
          ].map((item, index) => (
            <div
              key={item.day}
              ref={addToRefs}
              className={`opacity-0 translate-y-10 transition-all duration-700 ease-out p-6 text-center flex flex-col justify-center items-center hover:border-[#2dbcfe] transition-all duration-300 ${
                item.active ? "border-l-4 border-l-[#2dbcfe]" : ""
              }`}
              style={{ ...cardStyle, transitionDelay: `${index * 100}ms` }}
            >
              <span className="text-xs uppercase tracking-wider text-[#00658d] font-semibold mb-2">
                {item.day}
              </span>
              <span className="text-lg font-bold text-[#003358]">
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
