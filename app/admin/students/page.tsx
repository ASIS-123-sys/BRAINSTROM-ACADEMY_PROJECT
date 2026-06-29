"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase";
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

// Extends the base Student shape with the `course` column the DB/API stores
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
  phone: "",
  course: COURSE_OPTIONS[0],
  batch: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all students ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("name");
      if (!error && data) setStudents(data as StudentRow[]);
      setLoading(false);
    }
    fetchStudents();
  }, []);

  // ─── Add student ─────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.batch.trim()) {
      setError("Name and Batch are required.");
      return;
    }
    setSubmitting(true);
    const enrollment_id = `BS${Date.now()}`;
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, enrollment_id }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setStudents((prev) =>
          [...prev, json.data as StudentRow].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        setForm(defaultForm);
        setIsModalOpen(false);
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Delete student ───────────────────────────────────────────────────────
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

  // ─── Shared styles ────────────────────────────────────────────────────────
  const tableContainerStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
  };

  const labelClass = "block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-white/10 rounded-xl px-4 py-2.5 bg-white/5 text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]/50 text-sm transition";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-8 ${poppins.className}`}>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Manage Students
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {loading ? "Loading…" : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>
        <Button
          onClick={() => { setError(null); setIsModalOpen(true); }}
          className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
        >
          + Add Student
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8] animate-pulse">Fetching students…</p>
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && students.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">👥</span>
          <p className="text-[#F8FAFC] font-semibold text-lg">No students found</p>
          <p className="text-[#94A3B8] text-sm">Add your first student to get started.</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none mt-2"
          >
            + Add Student
          </Button>
        </div>
      )}

      {/* ─── Table ─── */}
      {!loading && students.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                <th className="px-5 py-4">Enrollment ID</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/5 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-mono text-[#06B6D4] text-xs">
                    {student.enrollment_id}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      {student.profile_pic_url ? (
                        <img
                          src={student.profile_pic_url}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name[0]?.toUpperCase()}
                        </span>
                      )}
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">
                    {student.course || <span className="italic opacity-50">—</span>}
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">{student.batch}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* ─── Add Student Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(null); setForm(defaultForm); }}
        title="Add New Student"
        size="md"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setIsModalOpen(false); setError(null); setForm(defaultForm); }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-student-form"
              isLoading={submitting}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
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

          {/* Name */}
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

          {/* Phone */}
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

          {/* Course */}
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
                <option key={c} value={c} className="bg-[#0F172A] text-[#F8FAFC]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
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
        </form>
      </Modal>
    </div>
  );
}
