"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Student, Faculty, Notice, GalleryImage, Fee, Score } from "@/types";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminDashboard() {
  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Students", value: 0 },
    { label: "Total Faculty", value: 0 },
    { label: "Pending Fees", value: 0 },
    { label: "Notices", value: 0 },
  ]);

  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [fees, setFees] = useState<
    (Fee & { students: { name: string; enrollment_id: string } | null })[]
  >([]);
  const [scores, setScores] = useState<
    (Score & { students: { name: string; enrollment_id: string } | null })[]
  >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          studentsRes,
          facultyRes,
          noticesRes,
          galleryRes,
          feesRes,
          scoresRes,
        ] = await Promise.all([
          fetch("/api/admin/students"),
          fetch("/api/admin/faculty"),
          fetch("/api/admin/notices"),
          fetch("/api/admin/gallery"),
          fetch("/api/admin/fees"),
          fetch("/api/admin/scores"),
        ]);

        const [
          studentsJson,
          facultyJson,
          noticesJson,
          galleryJson,
          feesJson,
          scoresJson,
        ] = await Promise.all([
          studentsRes.json(),
          facultyRes.json(),
          noticesRes.json(),
          galleryRes.json(),
          feesRes.json(),
          scoresRes.json(),
        ]);

        const studentsData = studentsJson.data || [];
        const facultyData = facultyJson.data || [];
        const noticesData = noticesJson.data || [];
        const galleryData = galleryJson.data || [];
        const feesData = feesJson.data || [];
        const scoresData = scoresJson.data || [];

        setStudents(studentsData.slice(0, 5));
        setFaculty(facultyData.slice(0, 5));
        setNotices(noticesData.slice(0, 5));
        setGallery(galleryData.slice(0, 5));
        setFees(feesData.slice(0, 5));
        setScores(scoresData.slice(0, 5));

        setStats([
          { label: "Total Students", value: studentsData.length },
          { label: "Total Faculty", value: facultyData.length },
          {
            label: "Pending Fees",
            value: feesData.filter(
              (f: { status: string }) => f.status !== "paid",
            ).length,
          },
          { label: "Notices", value: noticesData.length },
        ]);
      } catch {
        console.error("Error loading dashboard data:");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // delete student handler
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Delete this student? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error: " + json.error);
        return;
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[300px] ${poppins.className}`}
      >
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[#94A3B8] font-medium animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-12 ${poppins.className}`}>
      {/* Stats Cards Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Quick statistics for Brainstorm Academy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              style={glassCardStyle}
              className="p-8 flex flex-col items-center justify-center text-center hover:border-white/15 transition-all duration-300"
            >
              <span className="text-5xl font-extrabold text-[#06B6D4] mb-3">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-[#94A3B8] uppercase tracking-wider font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Sections: Students, Faculty, Notices, Gallery, Fees, Scores */}

      {/* 1. Students Section */}
      <section id="students" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Students
          </h2>
          <Link
            href="/admin/students"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Students →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 overflow-x-auto hover:border-white/12 transition-all duration-300"
        >
          <table className="w-full border-collapse text-left text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                <th className="pb-3 pr-4">Enrollment ID</th>
                <th className="pb-3 px-4">Name</th>
                <th className="pb-3 px-4">Course</th>
                <th className="pb-3 px-4">Batch</th>
                <th className="pb-3 pl-4">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-mono text-[#06B6D4]">
                    {student.enrollment_id}
                  </td>
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-[#94A3B8]">
                    {(student as any).course}
                  </td>
                  <td className="p-4 text-[#94A3B8]">{student.batch}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-400 hover:text-red-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-[#94A3B8]">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Faculty Section */}
      <section id="faculty" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Faculty
          </h2>
          <Link
            href="/admin/faculty"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Faculty →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 overflow-x-auto hover:border-white/12 transition-all duration-300"
        >
          <table className="w-full border-collapse text-left text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 px-4">Subject</th>
                <th className="pb-3 px-4">Position</th>
                <th className="pb-3 pl-4">Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {faculty.map((fac) => (
                <tr key={fac.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-medium flex items-center gap-2">
                    {fac.pic_url ? (
                      <img
                        src={fac.pic_url}
                        alt={fac.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs">
                        {fac.name[0]}
                      </span>
                    )}
                    {fac.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">{fac.subject}</td>
                  <td className="py-3.5 px-4">{fac.position}</td>
                  <td className="py-3.5 pl-4 text-[#94A3B8]">
                    {fac.experience}
                  </td>
                </tr>
              ))}
              {faculty.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-[#94A3B8]">
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Notices Section */}
      <section id="notices" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Notices
          </h2>
          <Link
            href="/admin/notices"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Notices →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 hover:border-white/12 transition-all duration-300"
        >
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border-b border-white/5 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-[#F8FAFC]">
                    {notice.title}
                  </h3>
                  <span className="text-xs text-[#94A3B8]">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] mt-1 line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
            {notices.length === 0 && (
              <p className="text-center text-[#94A3B8] py-2">
                No notices found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Gallery Section */}
      <section id="gallery" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Gallery
          </h2>
          <Link
            href="/admin/gallery"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Gallery →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 hover:border-white/12 transition-all duration-300"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-xl aspect-square border border-white/5 bg-white/5"
              >
                <img
                  src={img.image_url}
                  alt={img.event_name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                  <span className="text-xs font-semibold text-[#F8FAFC]">
                    {img.event_name}
                  </span>
                </div>
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full py-6 text-center text-[#94A3B8]">
                No gallery images found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Fees Section */}
      <section id="fees" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Fees
          </h2>
          <Link
            href="/admin/fees"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Fees →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 overflow-x-auto hover:border-white/12 transition-all duration-300"
        >
          <table className="w-full border-collapse text-left text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 px-4">Enrollment ID</th>
                <th className="pb-3 px-4">Amount Due</th>
                <th className="pb-3 px-4">Paid</th>
                <th className="pb-3 px-4">Due Date</th>
                <th className="pb-3 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fees.map((fee) => {
                const statusColors = {
                  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  partial: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
                  due: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                };
                return (
                  <tr
                    key={fee.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-medium">
                      {fee.students?.name || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {fee.students?.enrollment_id || "N/A"}
                    </td>
                    <td className="py-3.5 px-4">₹{fee.total_amount}</td>
                    <td className="py-3.5 px-4">₹{fee.paid_amount}</td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {new Date(fee.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pl-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          statusColors[
                            fee.status as keyof typeof statusColors
                          ] || ""
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-[#94A3B8]">
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Scores Section */}
      <section id="scores" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
            Scores
          </h2>
          <Link
            href="/admin/scores"
            className="text-sm font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 flex items-center gap-1 transition-colors"
          >
            Manage Scores →
          </Link>
        </div>
        <div
          style={glassCardStyle}
          className="p-6 overflow-x-auto hover:border-white/12 transition-all duration-300"
        >
          <table className="w-full border-collapse text-left text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 px-4">Subject</th>
                <th className="pb-3 px-4">Score</th>
                <th className="pb-3 pl-4">Test Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scores.map((score) => (
                <tr
                  key={score.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3.5 pr-4 font-medium">
                    {score.students?.name || "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {score.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#06B6D4]">
                      {score.score}
                    </span>{" "}
                    / {score.total}
                  </td>
                  <td className="py-3.5 pl-4 text-[#94A3B8]">
                    {new Date(score.test_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {scores.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-[#94A3B8]">
                    No score records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
