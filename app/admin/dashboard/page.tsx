"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Student = {
  enrollmentId: string;
  name: string;
  course: string;
  batch: string;
};

type Faculty = {
  id: number;
  name: string;
  subject: string;
  position: string;
  experience: string;
};

type Notice = {
  id: number;
  title: string;
  date: string;
};

type GalleryImage = {
  id: number;
  title: string;
  url: string;
};

type FeeRecord = {
  id: number;
  studentName: string;
  totalFee: string;
  paid: string;
  due: string;
  status: "paid" | "due";
};

type ScoreRecord = {
  id: number;
  studentName: string;
  subject: string;
  score: string;
  examDate: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  // --- STICKY NAV SCROLL FUNCTION ---
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- DUMMY DATA STATES ---
  const [students, setStudents] = useState<Student[]>([
    { enrollmentId: "BS2025-001", name: "Rahul Patnaik", course: "ADCA", batch: "July 2025" },
    { enrollmentId: "BS2025-002", name: "Subhasmita Sahu", course: "PGDCA", batch: "July 2025" },
    { enrollmentId: "BS2025-003", name: "Priya Ranjan Panda", course: "Tally ERP 9", batch: "July 2025" },
    { enrollmentId: "BS2025-004", name: "Amit Kumar Nayak", course: "DCA", batch: "July 2025" },
    { enrollmentId: "BS2025-005", name: "Swagatika Jena", course: "Spoken English", batch: "July 2025" },
  ]);

  const [faculty, setFaculty] = useState<Faculty[]>([
    { id: 1, name: "Dr. Alok Mohapatra", subject: "Physics", position: "Senior Lecturer", experience: "12 Years" },
    { id: 2, name: "Mrs. Minati Dash", subject: "Mathematics", position: "Lecturer", experience: "8 Years" },
    { id: 3, name: "Mr. Biswajit Sahu", subject: "Computer Science", position: "Lab Instructor", experience: "5 Years" },
    { id: 4, name: "Ms. Sipra Rout", subject: "English", position: "Communication Coach", experience: "6 Years" },
    { id: 5, name: "Mr. Rakesh Behera", subject: "Social Studies", position: "Tutor", experience: "4 Years" },
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    { id: 1, title: "Monthly Test scheduled for June 30", date: "June 28, 2025" },
    { id: 2, title: "Sunday Special Class this weekend", date: "June 25, 2025" },
    { id: 3, title: "ADCA Admission Open for new batch", date: "June 22, 2025" },
    { id: 4, title: "Fee Reminder for June month", date: "June 20, 2025" },
    { id: 5, title: "Holiday Notice for Local Festival", date: "June 18, 2025" },
  ]);

  const [gallery, setGallery] = useState<GalleryImage[]>([
    { id: 1, title: "Annual Function", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600" },
    { id: 2, title: "Sports Day", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600" },
    { id: 3, title: "Science Exhibition", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600" },
    { id: 4, title: "Computer Lab", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" },
    { id: 5, title: "Maths Class", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600" },
    { id: 6, title: "Study Session", url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600" },
  ]);

  const [fees, setFees] = useState<FeeRecord[]>([
    { id: 1, studentName: "Rahul Patnaik", totalFee: "3000", paid: "3000", due: "0", status: "paid" },
    { id: 2, studentName: "Subhasmita Sahu", totalFee: "3000", paid: "1500", due: "1500", status: "due" },
    { id: 3, studentName: "Priya Ranjan Panda", totalFee: "2500", paid: "2500", due: "0", status: "paid" },
    { id: 4, studentName: "Amit Kumar Nayak", totalFee: "3000", paid: "1000", due: "2000", status: "due" },
    { id: 5, studentName: "Swagatika Jena", totalFee: "2500", paid: "2500", due: "0", status: "paid" },
  ]);

  const [scores, setScores] = useState<ScoreRecord[]>([
    { id: 1, studentName: "Rahul Patnaik", subject: "Computer Basics", score: "85/100", examDate: "2026-06-15" },
    { id: 2, studentName: "Subhasmita Sahu", subject: "Tally ERP", score: "92/100", examDate: "2026-06-18" },
  ]);

  // --- MODAL STATES ---
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // --- FORM STATES ---
  const [studentForm, setStudentForm] = useState({ name: "", phone: "", course: "ADCA", batch: "July 2025" });
  const [facultyForm, setFacultyForm] = useState({ name: "", phone: "", subject: "", position: "", experience: "" });
  const [noticeForm, setNoticeForm] = useState({ title: "" });
  const [galleryForm, setGalleryForm] = useState({ title: "", url: "" });
  const [scoreForm, setScoreForm] = useState({ studentName: "", subject: "", score: "", examDate: "" });

  // --- MUTATION HANDLERS ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name) return;
    const nextIdNum = students.length + 1;
    const newStudent: Student = {
      enrollmentId: `BS2025-00${nextIdNum}`,
      name: studentForm.name,
      course: studentForm.course,
      batch: studentForm.batch,
    };
    setStudents([...students, newStudent]);
    
    // Also generate a matching fee record
    const newFee: FeeRecord = {
      id: Date.now(),
      studentName: studentForm.name,
      totalFee: "3000",
      paid: "0",
      due: "3000",
      status: "due"
    };
    setFees([...fees, newFee]);

    setStudentForm({ name: "", phone: "", course: "ADCA", batch: "July 2025" });
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (enrollmentId: string) => {
    setStudents(students.filter((s) => s.enrollmentId !== enrollmentId));
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.subject) return;
    const newFac: Faculty = {
      id: Date.now(),
      name: facultyForm.name,
      subject: facultyForm.subject,
      position: facultyForm.position || "Tutor",
      experience: facultyForm.experience || "1 Year",
    };
    setFaculty([...faculty, newFac]);
    setFacultyForm({ name: "", phone: "", subject: "", position: "", experience: "" });
    setIsFacultyModalOpen(false);
  };

  const handleDeleteFaculty = (id: number) => {
    setFaculty(faculty.filter((f) => f.id !== id));
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title) return;
    
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newNotice: Notice = {
      id: Date.now(),
      title: noticeForm.title,
      date: formattedDate,
    };

    const updatedNotices = [newNotice, ...notices];
    if (updatedNotices.length > 5) {
      updatedNotices.pop(); // Remove oldest to maintain max of 5
    }

    setNotices(updatedNotices);
    setNoticeForm({ title: "" });
    setIsNoticeModalOpen(false);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.url) return;
    const newImg: GalleryImage = {
      id: Date.now(),
      title: galleryForm.title,
      url: galleryForm.url,
    };
    setGallery([...gallery, newImg]);
    setGalleryForm({ title: "", url: "" });
    setIsGalleryModalOpen(false);
  };

  const handleDeleteImage = (id: number) => {
    setGallery(gallery.filter((g) => g.id !== id));
  };

  const handleMarkAsPaid = (id: number) => {
    setFees(
      fees.map((f) => {
        if (f.id === id) {
          return { ...f, paid: f.totalFee, due: "0", status: "paid" };
        }
        return f;
      })
    );
  };

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreForm.studentName || !scoreForm.subject || !scoreForm.score) return;
    const newScore: ScoreRecord = {
      id: Date.now(),
      studentName: scoreForm.studentName,
      subject: scoreForm.subject,
      score: scoreForm.score,
      examDate: scoreForm.examDate || new Date().toISOString().split("T")[0],
    };
    setScores([newScore, ...scores]);
    setScoreForm({ studentName: "", subject: "", score: "", examDate: "" });
  };

  // Glassmorphism Card Style
  const glassCardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  // Form label and input classes for modal components (which are light/white themed)
  const modalLabelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1";
  const modalInputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] overflow-x-hidden ${poppins.className}`}>
      
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-xl text-[#F8FAFC]">Brainstorm Academy</div>
        
        {/* Navigation Links Scroll Container */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-4 scrollbar-none">
          {["Overview", "Students", "Faculty", "Notices", "Gallery", "Fees", "Scores"].map((section) => (
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
            onClick={() => router.push("/auth/admin-login")}
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
          <h2 className="text-3xl font-bold mb-8 tracking-tight">Dashboard Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Students", value: students.length + 119 },
              { label: "Total Faculty", value: faculty.length },
              { label: "Pending Fees", value: fees.filter(f => f.status === "due").length },
              { label: "Notices", value: notices.length }
            ].map((stat, i) => (
              <div key={i} style={glassCardStyle} className="p-6 flex flex-col items-center justify-center text-center hover:border-white/15 transition-all duration-300">
                <span className="text-4xl font-extrabold text-[#06B6D4] mb-2">{stat.value}</span>
                <span className="text-xs md:text-sm text-[#94A3B8] uppercase tracking-wider font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Students */}
        <section id="students" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Manage Students</h2>
            <Button
              onClick={() => setIsStudentModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Student
            </Button>
          </div>

          <div className="overflow-x-auto w-full rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
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
                  <tr key={student.enrollmentId} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-[#06B6D4]">{student.enrollmentId}</td>
                    <td className="p-4 font-medium">{student.name}</td>
                    <td className="p-4 text-[#94A3B8]">{student.course}</td>
                    <td className="p-4 text-[#94A3B8]">{student.batch}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteStudent(student.enrollmentId)}
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
            <h2 className="text-3xl font-bold tracking-tight">Manage Faculty</h2>
            <Button
              onClick={() => setIsFacultyModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Faculty
            </Button>
          </div>

          <div className="overflow-x-auto w-full rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
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
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4 text-[#94A3B8]">{member.subject}</td>
                    <td className="p-4 text-[#94A3B8]">{member.position}</td>
                    <td className="p-4 text-[#06B6D4] font-mono">{member.experience}</td>
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
              <h2 className="text-3xl font-bold tracking-tight">Manage Notices</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Only 5 notices allowed. Oldest is auto deleted when new one is added.</p>
            </div>
            <Button
              onClick={() => setIsNoticeModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
            >
              + Add Notice
            </Button>
          </div>

          <div style={glassCardStyle} className="p-4 md:p-6 divide-y divide-white/5">
            {notices.map((notice) => (
              <div key={notice.id} className="py-4 flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-md text-[#F8FAFC]">{notice.title}</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">{notice.date}</span>
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
              <div className="py-8 text-center text-[#94A3B8] text-sm">No notices added.</div>
            )}
          </div>
        </section>

        {/* Section 5 — Gallery */}
        <section id="gallery" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Manage Gallery</h2>
            <Button
              onClick={() => setIsGalleryModalOpen(true)}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              + Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div key={img.id} style={glassCardStyle} className="overflow-hidden relative group aspect-video sm:aspect-square flex flex-col justify-end">
                <img
                  src={img.url}
                  alt={img.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
                <div className="p-4 z-20 flex justify-between items-end gap-3 w-full">
                  <div>
                    <h4 className="font-bold text-sm text-[#F8FAFC]">{img.title}</h4>
                  </div>
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
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Fee Management</h2>

          <div className="overflow-x-auto w-full rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
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
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{record.studentName}</td>
                    <td className="p-4 font-mono text-[#94A3B8]">Rs. {record.totalFee}</td>
                    <td className="p-4 font-mono text-green-400">Rs. {record.paid}</td>
                    <td className="p-4 font-mono text-red-400">Rs. {record.due}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          record.status === "paid"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {record.status === "due" ? (
                        <button
                          onClick={() => handleMarkAsPaid(record.id)}
                          className="text-[#06B6D4] hover:text-[#06B6D4]/80 hover:bg-[#06B6D4]/10 font-bold text-xs px-3 py-1.5 rounded-lg border border-[#06B6D4]/30 transition-all duration-200"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <span className="text-xs text-[#94A3B8] italic font-medium">Clear</span>
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
          <h2 className="text-3xl font-bold tracking-tight">Add Student Scores</h2>
          
          <div style={glassCardStyle} className="p-6 md:p-8">
            <form onSubmit={handleAddScore} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Select Student</label>
                <select
                  value={scoreForm.studentName}
                  onChange={(e) => setScoreForm({ ...scoreForm, studentName: e.target.value })}
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((student) => (
                    <option key={student.enrollmentId} value={student.name}>
                      {student.name} ({student.enrollmentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Physics, Tally, DCA"
                  value={scoreForm.subject}
                  onChange={(e) => setScoreForm({ ...scoreForm, subject: e.target.value })}
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Score</label>
                <input
                  type="text"
                  placeholder="e.g. 85/100"
                  value={scoreForm.score}
                  onChange={(e) => setScoreForm({ ...scoreForm, score: e.target.value })}
                  className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-[#06B6D4] outline-none text-sm h-[46px]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Exam Date</label>
                  <input
                    type="date"
                    value={scoreForm.examDate}
                    onChange={(e) => setScoreForm({ ...scoreForm, examDate: e.target.value })}
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
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">Recently Added Scores</h3>
            <div className="overflow-x-auto w-full rounded-2xl border border-white/10" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
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
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{rec.studentName}</td>
                      <td className="p-4 text-[#94A3B8]">{rec.subject}</td>
                      <td className="p-4 text-center font-mono font-bold text-[#F59E0B]">{rec.score}</td>
                      <td className="p-4 text-right text-[#94A3B8]">{rec.examDate}</td>
                    </tr>
                  ))}
                  {scores.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#94A3B8] text-sm">No scores recently added.</td>
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
            <Button variant="ghost" onClick={() => setIsStudentModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent} className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none">Submit</Button>
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
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
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
              onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Course Selection</label>
            <select
              value={studentForm.course}
              onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
              className={modalInputClass}
            >
              <option value="ADCA">ADCA — Advanced Diploma in Computer Application</option>
              <option value="CCA">CCA — Certificate in Computer Application</option>
              <option value="DCA">DCA — Diploma in Computer Application</option>
              <option value="PGDCA">PGDCA — Post Graduate Diploma in Computer Application</option>
              <option value="Tally ERP 9">Tally ERP 9 — Accounting & Finance</option>
              <option value="Spoken English">Spoken English — Language Skills</option>
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
              onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
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
            <Button variant="ghost" onClick={() => setIsFacultyModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFaculty} className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none">Submit</Button>
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
              onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
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
              onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Subject / Specialization</label>
            <input
              type="text"
              placeholder="e.g. Physics, Chemistry, Tally"
              value={facultyForm.subject}
              onChange={(e) => setFacultyForm({ ...facultyForm, subject: e.target.value })}
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
              onChange={(e) => setFacultyForm({ ...facultyForm, position: e.target.value })}
              className={modalInputClass}
            />
          </div>
          <div>
            <label className={modalLabelClass}>Teaching Experience</label>
            <input
              type="text"
              placeholder="e.g. 8 Years"
              value={facultyForm.experience}
              onChange={(e) => setFacultyForm({ ...facultyForm, experience: e.target.value })}
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
            <Button variant="ghost" onClick={() => setIsNoticeModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNotice} className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none">Publish</Button>
          </>
        }
      >
        <form onSubmit={handleAddNotice} className="space-y-4">
          <div>
            <label className={modalLabelClass}>Notice Title / Announcement Details</label>
            <textarea
              placeholder="Enter details here..."
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
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
            <Button variant="ghost" onClick={() => setIsGalleryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddImage} className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none">Add Image</Button>
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
              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
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
              onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
              className={modalInputClass}
              required
            />
          </div>
        </form>
      </Modal>

    </div>
  );
}
