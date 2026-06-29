"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Student = {
  id: string;
  enrollment_id: string;
  name: string;
  course: string;
  batch: string;
};

type Faculty = {
  id: string;
  name: string;
  subject: string;
  position: string;
  experience: string;
};

type Notice = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type GalleryImage = {
  id: string;
  event_name: string;
  image_url: string;
};

type FeeRecord = {
  id: string;
  student_id: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
  status: "paid" | "due" | "partial";
  students?: { name: string; enrollment_id: string };
};

type ScoreRecord = {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  total: number;
  test_date: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/admin-login");
  };

  // --- STICKY NAV SCROLL FUNCTION ---
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- DUMMY DATA STATES ---
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      setLoading(true);

      const [
        { data: studentsData },
        { data: facultyData },
        { data: noticesData },
        { data: galleryData },
        { data: feesData },
        { data: scoresData },
      ] = await Promise.all([
        supabase.from("students").select("*").order("name"),
        supabase.from("faculty").select("*").order("name"),
        supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("gallery").select("*").order("event_name"),
        supabase
          .from("fees")
          .select("*, students(name, enrollment_id)")
          .order("due_date"),
        supabase
          .from("scores")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (studentsData) setStudents(studentsData as any);
      if (facultyData) setFaculty(facultyData as any);
      if (noticesData) setNotices(noticesData as any);
      if (galleryData) setGallery(galleryData as any);
      if (feesData) setFees(feesData as any);
      if (scoresData) setScores(scoresData as any);

      setLoading(false);
    }
    loadData();
  }, []);

  // --- MODAL STATES ---
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // --- FORM STATES ---
  const [studentForm, setStudentForm] = useState({
    name: "",
    phone: "",
    course: "ADCA",
    batch: "July 2025",
  });
  const [facultyForm, setFacultyForm] = useState({
    name: "",
    phone: "",
    subject: "",
    position: "",
    experience: "",
  });
  const [noticeForm, setNoticeForm] = useState({ title: "" });
  const [galleryForm, setGalleryForm] = useState({ title: "", url: "" });
  const [scoreForm, setScoreForm] = useState({
    studentName: "",
    subject: "",
    score: "",
    examDate: "",
  });

  // --- MUTATION HANDLERS ---
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name) return;
    const enrollment_id = `BS${Date.now()}`;
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: studentForm.name,
        phone: studentForm.phone,
        batch: studentForm.batch,
        course: studentForm.course,
        enrollment_id,
      }),
    });
    const { data, error } = await res.json();
    if (error) {
      alert("Error adding student: " + error);
      return;
    }
    setStudents([...students, data]);
    setStudentForm({ name: "", phone: "", course: "ADCA", batch: "July 2025" });
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = async (id: string) => {
    const res = await fetch("/api/admin/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const { error } = await res.json();
    if (error) {
      alert("Error deleting student: " + error);
      return;
    }
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.subject) return;
    const res = await fetch("/api/admin/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facultyForm),
    });
    const { data, error } = await res.json();
    if (error) {
      alert("Error adding faculty: " + error);
      return;
    }
    setFaculty([...faculty, data]);
    setFacultyForm({
      name: "",
      phone: "",
      subject: "",
      position: "",
      experience: "",
    });
    setIsFacultyModalOpen(false);
  };

  const handleDeleteFaculty = async (id: string) => {
    const res = await fetch("/api/admin/faculty", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const { error } = await res.json();
    if (error) {
      alert("Error deleting faculty: " + error);
      return;
    }
    setFaculty(faculty.filter((f) => f.id !== id));
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title) return;
    const res = await fetch("/api/admin/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: noticeForm.title,
        content: noticeForm.title,
      }),
    });
    const { data, error } = await res.json();
    if (error) {
      alert("Error adding notice: " + error);
      return;
    }
    const updatedNotices = [data, ...notices];
    if (updatedNotices.length > 5) updatedNotices.pop();
    setNotices(updatedNotices);
    setNoticeForm({ title: "" });
    setIsNoticeModalOpen(false);
  };

  const handleDeleteNotice = async (id: string) => {
    const res = await fetch("/api/admin/notices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const { error } = await res.json();
    if (error) {
      alert("Error deleting notice: " + error);
      return;
    }
    setNotices(notices.filter((n) => n.id !== id));
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.url) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery")
      .insert({ event_name: galleryForm.title, image_url: galleryForm.url })
      .select()
      .single();
    if (error) {
      alert("Error adding image: " + (error.message || error));
      return;
    }
    setGallery([...gallery, data]);
    setGalleryForm({ title: "", url: "" });
    setIsGalleryModalOpen(false);
  };

  const handleDeleteImage = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) {
      alert("Error deleting image: " + (error.message || error));
      return;
    }
    setGallery(gallery.filter((g) => g.id !== id));
  };

  const handleMarkAsPaid = async (id: string, totalAmount: number) => {
    const res = await fetch("/api/admin/fees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        paid_amount: totalAmount,
        total_amount: totalAmount,
      }),
    });
    const { error } = await res.json();
    if (error) {
      alert("Error updating fee: " + error);
      return;
    }
    setFees(
      fees.map((f) =>
        f.id === id ? { ...f, status: "paid", paid_amount: totalAmount } : f,
      ),
    );
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreForm.studentName || !scoreForm.subject || !scoreForm.score)
      return;
    const res = await fetch("/api/admin/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: scoreForm.studentName,
        subject: scoreForm.subject,
        score: Number(scoreForm.score),
        total: 100,
        test_date: scoreForm.examDate || new Date().toISOString().split("T")[0],
      }),
    });
    const { data, error } = await res.json();
    if (error) {
      alert("Error adding score: " + error);
      return;
    }
    setScores([data, ...scores]);
    setScoreForm({ studentName: "", subject: "", score: "", examDate: "" });
  };

  // Glassmorphism Card Style
  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  const modalLabelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1";
  const modalInputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] flex items-center justify-center ${poppins.className}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">Loading dashboard...</div>
          <div className="text-sm text-[#94A3B8] mt-2">Fetching data...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden ${poppins.className}`}
    >
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-xl text-[#F8FAFC]">
          Brainstorm Academy
        </div>

        <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-4 scrollbar-none">
          {[
            "Overview",
            "Students",
            "Faculty",
            "Notices",
            "Gallery",
            "Fees",
            "Scores",
          ].map((section) => (
            <button
              key={section}
              onClick={() => handleScroll(section.toLowerCase())}
              className="text-[#94A3B8] hover:text-[#06B6D4] font-semibold transition-colors text-xs md:text-sm px-2 py-1 rounded-md"
            >
              {section}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 shadow-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* Section 1 — Overview */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8 tracking-tight">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Students", value: students.length + 119 },
              { label: "Total Faculty", value: faculty.length },
              {
                label: "Pending Fees",
                value: fees.filter((f) => f.status === "due").length,
              },
              { label: "Notices", value: notices.length },
            ].map((stat, i) => (
              <div
                key={i}
                style={glassCardStyle}
                className="p-6 flex flex-col items-center justify-center text-center hover:border-white/15 transition-all duration-300"
              >
                <span className="text-4xl font-extrabold text-[#06B6D4] mb-2">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-[#94A3B8] uppercase tracking-wider font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Students */}
        <section id="students" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Manage Students
            </h2>
            <Button
              onClick={() => setIsStudentModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Student
            </Button>
          </div>

          <div
            className="overflow-x-auto w-full rounded-2xl border border-white/10"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
            }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                  <th className="p-4">Enrollment ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Batch</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-mono text-[#06B6D4]">
                      {student.enrollment_id}
                    </td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4 text-[#94A3B8]">{student.course}</td>
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
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 — Faculty */}
        <section id="faculty" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Manage Faculty
            </h2>
            <Button
              onClick={() => setIsFacultyModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Faculty
            </Button>
          </div>

          <div
            className="overflow-x-auto w-full rounded-2xl border border-white/10"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
            }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
                {faculty.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-[#94A3B8]">{member.subject}</td>
                    <td className="p-4 text-[#94A3B8]">{member.position}</td>
                    <td className="p-4 text-[#06B6D4] font-mono">
                      {member.experience}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteFaculty(member.id)}
                        className="text-red-400 hover:text-red-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 — Notices */}
        <section id="notices" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Manage Notices
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Only 5 notices allowed. Oldest is auto deleted when new one is
                added.
              </p>
            </div>
            <Button
              onClick={() => setIsNoticeModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
            >
              + Add Notice
            </Button>
          </div>

          <div
            style={glassCardStyle}
            className="p-4 md:p-6 divide-y divide-white/5"
          >
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="py-4 flex justify-between items-center gap-4"
              >
                <div>
                  <h3 className="font-semibold text-md text-[#F8FAFC]">
                    {notice.title}
                  </h3>
                  <span className="text-xs text-[#94A3B8] font-medium">
                    {new Date(notice.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="text-red-400 hover:text-red-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
            {notices.length === 0 && (
              <div className="py-8 text-center text-[#94A3B8] text-sm">
                No notices added.
              </div>
            )}
          </div>
        </section>

        {/* Section 5 — Gallery */}
        <section id="gallery" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Manage Gallery
            </h2>
            <Button
              onClick={() => setIsGalleryModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                style={glassCardStyle}
                className="overflow-hidden relative group aspect-video sm:aspect-square flex flex-col justify-end"
              >
                <img
                  src={img.image_url}
                  alt={img.event_name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
                <div className="p-4 z-20 flex justify-between items-end gap-3 w-full">
                  <h4 className="font-bold text-sm text-[#F8FAFC]">
                    {img.event_name}
                  </h4>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="text-red-400 hover:text-red-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/25 transition-all duration-200 z-30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — Fees */}
        <section id="fees" className="scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            Fee Management
          </h2>

          <div
            className="overflow-x-auto w-full rounded-2xl border border-white/10"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
            }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Total Fee</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
                {fees.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      {record.students?.name || "Unknown"}
                    </td>
                    <td className="p-4 font-mono text-[#94A3B8]">
                      Rs. {record.total_amount}
                    </td>
                    <td className="p-4 font-mono text-green-400">
                      Rs. {record.paid_amount}
                    </td>
                    <td className="p-4 font-mono text-red-400">
                      Rs. {record.total_amount - record.paid_amount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${record.status === "paid" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {record.status === "due" ? (
                        <button
                          onClick={() =>
                            handleMarkAsPaid(record.id, record.total_amount)
                          }
                          className="text-[#06B6D4] hover:text-[#06B6D4]/80 hover:bg-[#06B6D4]/10 font-bold text-xs px-3 py-1.5 rounded-lg border border-[#06B6D4]/30 transition-all duration-200"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <span className="text-xs text-[#94A3B8] italic font-medium">
                          Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7 — Scores */}
        <section id="scores" className="scroll-mt-24 space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Add Student Scores
          </h2>

          <div style={glassCardStyle} className="p-6 md:p-8">
            <form
              onSubmit={handleAddScore}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
            >
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Select Student
                </label>
                <select
                  value={scoreForm.studentName}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, studentName: e.target.value })
                  }
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.enrollment_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics, Tally, DCA"
                  value={scoreForm.subject}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, subject: e.target.value })
                  }
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Score
                </label>
                <input
                  type="text"
                  placeholder="e.g. 85/100"
                  value={scoreForm.score}
                  onChange={(e) =>
                    setScoreForm({ ...scoreForm, score: e.target.value })
                  }
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={scoreForm.examDate}
                    onChange={(e) =>
                      setScoreForm({ ...scoreForm, examDate: e.target.value })
                    }
                    className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#06B6D4] text-[#0F172A] font-bold rounded-xl text-sm transition-all duration-300 hover:bg-[#06B6D4]/90 shadow-[0_0_15px_rgba(6,182,212,0.2)] h-[46px] shrink-0"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">
              Recently Added Scores
            </h3>
            <div
              className="overflow-x-auto w-full rounded-2xl border border-white/10"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(20px)",
              }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-right">Exam Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
                  {scores.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-medium">{rec.student_id}</td>
                      <td className="p-4 text-[#94A3B8]">{rec.subject}</td>
                      <td className="p-4 text-center font-mono font-bold text-[#F59E0B]">
                        {rec.score}/{rec.total}
                      </td>
                      <td className="p-4 text-right text-[#94A3B8]">
                        {rec.test_date}
                      </td>
                    </tr>
                  ))}
                  {scores.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-[#94A3B8] text-sm"
                      >
                        No scores recently added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* --- ADD STUDENT MODAL --- */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Add New Student"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsStudentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Submit
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className={modalLabelClass}>Student Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={studentForm.name}
              onChange={(e) =>
                setStudentForm({ ...studentForm, name: e.target.value })
              }
              className={modalInputClass}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass}>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +91 99999 88888"
              value={studentForm.phone}
              onChange={(e) =>
                setStudentForm({ ...studentForm, phone: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Course Selection</label>
            <select
              value={studentForm.course}
              onChange={(e) =>
                setStudentForm({ ...studentForm, course: e.target.value })
              }
              className={modalInputClass}
            >
              <option value="ADCA">
                ADCA — Advanced Diploma in Computer Application
              </option>
              <option value="CCA">
                CCA — Certificate in Computer Application
              </option>
              <option value="DCA">DCA — Diploma in Computer Application</option>
              <option value="PGDCA">
                PGDCA — Post Graduate Diploma in Computer Application
              </option>
              <option value="Tally ERP 9">
                Tally ERP 9 — Accounting & Finance
              </option>
              <option value="Spoken English">
                Spoken English — Language Skills
              </option>
              <option value="Science (12th)">Science (12th Grade)</option>
              <option value="Commerce (12th)">Commerce (12th Grade)</option>
              <option value="Arts (12th)">Arts (12th Grade)</option>
              <option value="School Section">Class 5th to 10th</option>
            </select>
          </div>
          <div>
            <label className={modalLabelClass}>Admission Batch</label>
            <input
              type="text"
              placeholder="e.g. July 2025"
              value={studentForm.batch}
              onChange={(e) =>
                setStudentForm({ ...studentForm, batch: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD FACULTY MODAL --- */}
      <Modal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        title="Add New Faculty"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsFacultyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFaculty}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Submit
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddFaculty} className="space-y-4">
          <div>
            <label className={modalLabelClass}>Faculty Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={facultyForm.name}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, name: e.target.value })
              }
              className={modalInputClass}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass}>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +91 99338 XXXXX"
              value={facultyForm.phone}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, phone: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Subject / Specialization</label>
            <input
              type="text"
              placeholder="e.g. Physics, Chemistry, Tally"
              value={facultyForm.subject}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, subject: e.target.value })
              }
              className={modalInputClass}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass}>Position</label>
            <input
              type="text"
              placeholder="e.g. Senior Lecturer, Tutor"
              value={facultyForm.position}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, position: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Teaching Experience</label>
            <input
              type="text"
              placeholder="e.g. 8 Years"
              value={facultyForm.experience}
              onChange={(e) =>
                setFacultyForm({ ...facultyForm, experience: e.target.value })
              }
              className={modalInputClass}
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD NOTICE MODAL --- */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Add Notice Announcement"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNoticeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNotice}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Publish
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddNotice} className="space-y-4">
          <div>
            <label className={modalLabelClass}>
              Notice Title / Announcement Details
            </label>
            <textarea
              placeholder="Enter details here..."
              value={noticeForm.title}
              onChange={(e) =>
                setNoticeForm({ ...noticeForm, title: e.target.value })
              }
              className={`${modalInputClass} min-h-[100px] resize-none`}
              required
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD IMAGE MODAL --- */}
      <Modal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title="Add Gallery Image"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsGalleryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddImage}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Add Image
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className={modalLabelClass}>Event / Caption Name</label>
            <input
              type="text"
              placeholder="e.g. Annual Function"
              value={galleryForm.title}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, title: e.target.value })
              }
              className={modalInputClass}
              required
            />
          </div>
          <div>
            <label className={modalLabelClass}>Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={galleryForm.url}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, url: e.target.value })
              }
              className={modalInputClass}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
