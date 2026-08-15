"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const COURSE_OPTIONS = [
  "ADCA",
  "CCA",
  "DCA",
  "PGDCA",
  "Tally ERP 9",
  "Spoken English",
  "Science (12th)",
  "Commerce (12th)",
  "Arts (12th)",
  "School Section",
];

const COURSE_CODES: Record<string, string> = {
  ADCA: "ADCA",
  CCA: "CCA",
  DCA: "DCA",
  PGDCA: "PGDCA",
  "Tally ERP 9": "TALLY",
  "Spoken English": "SE",
  "Science (12th)": "SCI",
  "Commerce (12th)": "COM",
  "Arts (12th)": "ART",
  "School Section": "SCH",
};

type StudentRow = {
  id: string;
  enrollment_id: string;
  name: string;
  phone: string;
  batch: string;
  course: string | null;
  rank: number | null;
  profile_pic_url: string | null;
  created_at: string;
};

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  course: COURSE_OPTIONS[0],
  batch: "",
  rollNo: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resettingPasswords, setResettingPasswords] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/students");
        const json = await res.json();
        if (json.data) setStudents(json.data);
      } catch {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.rollNo.trim()) {
      setError("Name and Roll No are required.");
      return;
    }

    const courseCode = COURSE_CODES[form.course] || "GEN";
    const enrollment_id = `${courseCode}${form.rollNo.trim()}`;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim(),
          phone: form.phone,
          batch: form.batch,
          course: form.course,
          enrollment_id,
        }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
        return;
      }

      setStudents([...students, json.data]);
      setForm(defaultForm);
      setIsModalOpen(false);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this student? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting student: " + json.error);
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleResetAllPasswords() {
    if (
      !confirm(
        "Reset EVERY student's password to BA@<their enrollment ID>? This cannot be undone.",
      )
    )
      return;

    setResettingPasswords(true);
    try {
      const res = await fetch("/api/admin/reset-passwords", {
        method: "POST",
      });
      const json = await res.json();
      if (json.failed && json.failed.length > 0) {
        alert(
          `Updated ${json.updated}/${json.total}. Failed: ${json.failed
            .map((f: { enrollment_id: string }) => f.enrollment_id)
            .join(", ")}`,
        );
      } else {
        alert(`Successfully reset ${json.updated} student password(s).`);
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setResettingPasswords(false);
    }
  }

  const tableContainerStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const labelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition";

  return (
    <div className={`space-y-8 ${poppins.className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003358]">
            Manage Students
          </h1>
          <p className="text-sm text-[#42576E] mt-1">
            {loading
              ? "Loading…"
              : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button
            onClick={handleResetAllPasswords}
            isLoading={resettingPasswords}
            className="bg-white text-[#003358] hover:bg-gray-50 font-bold border border-[#7FB3E8]"
          >
            🔑 Reset All Passwords
          </Button>
          <Button
            onClick={() => {
              setError(null);
              setForm(defaultForm);
              setIsModalOpen(true);
            }}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none"
          >
            + Add Student
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#42576E] animate-pulse">
              Fetching students…
            </p>
          </div>
        </div>
      )}

      {!loading && students.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">🎓</span>
          <p className="text-[#003358] font-semibold text-lg">
            No students found
          </p>
          <p className="text-[#42576E] text-sm">
            Add your first student to get started.
          </p>
          <Button
            onClick={() => {
              setError(null);
              setForm(defaultForm);
              setIsModalOpen(true);
            }}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none mt-2"
          >
            + Add Student
          </Button>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#1E3A52]">
            <thead>
              <tr className="border-b border-[#7FB3E8] bg-[#9FC7F0]/30 text-xs uppercase tracking-wider text-[#003358] font-semibold">
                <th className="px-5 py-4">Enrollment ID</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7FB3E8]/50">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[#9FC7F0]/20 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-mono text-[#003358] text-xs">
                    {student.enrollment_id}
                  </td>
                  <td className="px-5 py-4 font-medium text-[#1E3A52]">
                    <div className="flex items-center gap-3">
                      {student.profile_pic_url ? (
                        <img
                          src={student.profile_pic_url}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#7FB3E8] shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8] flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name[0]?.toUpperCase()}
                        </span>
                      )}
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#42576E]">
                    {student.course || (
                      <span className="italic opacity-50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#42576E]">{student.batch}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                      className="text-rose-700 hover:text-rose-600 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {deletingId === student.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add New Student"
        size="md"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setError(null);
                setForm(defaultForm);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-student-form"
              isLoading={submitting}
              className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none"
            >
              Add Student
            </Button>
          </div>
        }
      >
        <form id="add-student-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="student-name" className={labelClass}>
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-name"
              type="text"
              required
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="student-email" className={labelClass}>
              Password Reset Email
            </label>
            <input
              id="student-email"
              type="email"
              placeholder="e.g. student@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="student-phone" className={labelClass}>
              Phone Number
            </label>
            <input
              id="student-phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="student-course" className={labelClass}>
              Course <span className="text-rose-400">*</span>
            </label>
            <select
              id="student-course"
              required
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className={inputClass}
            >
              {COURSE_OPTIONS.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-[#B8D9F5] text-[#003358]"
                >
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="student-batch" className={labelClass}>
              Batch <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-batch"
              type="text"
              required
              placeholder="e.g. July 2025"
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="student-rollno" className={labelClass}>
              Roll No <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-rollno"
              type="text"
              required
              placeholder="e.g. 01"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
              className={inputClass}
            />
            <p className="text-xs text-[#42576E] mt-1.5">
              Login ID will be:{" "}
              <strong>
                {COURSE_CODES[form.course] || "GEN"}
                {form.rollNo || "__"}
              </strong>{" "}
              — same roll no. can be reused across different courses.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
