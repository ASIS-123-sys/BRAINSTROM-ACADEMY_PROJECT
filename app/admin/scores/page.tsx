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

type StudentReference = {
  id: string;
  name: string;
  enrollment_id: string;
};

// Local row type matching DB schema + joined student
type ScoreRow = {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  total: number;
  test_date: string;
  created_at: string;
  students: {
    name: string;
    enrollment_id: string;
  } | null;
};

// Default test date to today (YYYY-MM-DD format)
const today = new Date().toISOString().split("T")[0];

const defaultForm = {
  student_id: "",
  subject: "",
  score: "",
  total: "100",
  test_date: today,
};

export default function AdminScoresPage() {
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [studentsList, setStudentsList] = useState<StudentReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();

      const [scoresRes, studentsRes] = await Promise.all([
        supabase
          .from("scores")
          .select("*, students(name, enrollment_id)")
          .order("test_date", { ascending: false }),
        supabase
          .from("students")
          .select("id, name, enrollment_id")
          .order("name"),
      ]);

      if (!scoresRes.error && scoresRes.data)
        setScores(scoresRes.data as ScoreRow[]);
      if (!studentsRes.error && studentsRes.data)
        setStudentsList(studentsRes.data as StudentReference[]);

      setLoading(false);
    }
    fetchData();
  }, []);

  // ─── Add score record ──────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (
      !form.student_id ||
      !form.subject.trim() ||
      !form.score ||
      !form.total ||
      !form.test_date
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const scoreNum = parseFloat(form.score);
    const totalNum = parseFloat(form.total);

    if (scoreNum > totalNum) {
      setError("Score cannot be greater than Total.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: form.student_id,
          subject: form.subject,
          score: scoreNum,
          total: totalNum,
          test_date: form.test_date,
        }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }

      // We need to attach the student data manually for the UI since the POST
      // response doesn't run the JOIN.
      const selectedStudent = studentsList.find(
        (s) => s.id === form.student_id
      );
      const newRecord = {
        ...json.data,
        students: selectedStudent
          ? {
              name: selectedStudent.name,
              enrollment_id: selectedStudent.enrollment_id,
            }
          : null,
      } as ScoreRow;

      setScores((prev) =>
        [...prev, newRecord].sort(
          (a, b) =>
            new Date(b.test_date).getTime() - new Date(a.test_date).getTime()
        )
      );
      setForm(defaultForm);
      setIsModalOpen(false);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Delete score record ───────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this score record? This action cannot be undone."))
      return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/scores", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting record: " + json.error);
      } else {
        setScores((prev) => prev.filter((f) => f.id !== id));
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

  const labelClass =
    "block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-white/10 rounded-xl px-4 py-2.5 bg-white/5 text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]/50 text-sm transition";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-8 ${poppins.className}`}>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Manage Scores
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {loading
              ? "Loading…"
              : `${scores.length} score record${
                  scores.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
        >
          + Add Score
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8] animate-pulse">
              Fetching records…
            </p>
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && scores.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">📝</span>
          <p className="text-[#F8FAFC] font-semibold text-lg">
            No score records found
          </p>
          <p className="text-[#94A3B8] text-sm">
            Add a new score record to get started.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none mt-2"
          >
            + Add Score
          </Button>
        </div>
      )}

      {/* ─── Table ─── */}
      {!loading && scores.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Score</th>
                <th className="px-5 py-4">Test Date</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scores.map((score) => (
                <tr
                  key={score.id}
                  className="hover:bg-white/5 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-medium">
                    <div className="flex flex-col">
                      <span>{score.students?.name || "N/A"}</span>
                      <span className="text-xs text-[#06B6D4] font-mono mt-0.5">
                        {score.students?.enrollment_id || ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">{score.subject}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#06B6D4] text-base">
                      {score.score}
                    </span>
                    <span className="text-[#94A3B8] text-xs">
                      {" "}
                      / {score.total}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">
                    {new Date(score.test_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(score.id)}
                      disabled={deletingId === score.id}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete score record"
                    >
                      {deletingId === score.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Add Score Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add Score Record"
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
              form="add-score-form"
              isLoading={submitting}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Add Record
            </Button>
          </div>
        }
      >
        <form id="add-score-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Student Dropdown */}
          <div>
            <label htmlFor="score-student" className={labelClass}>
              Student <span className="text-rose-400">*</span>
            </label>
            <select
              id="score-student"
              required
              value={form.student_id}
              onChange={(e) =>
                setForm({ ...form, student_id: e.target.value })
              }
              className={inputClass}
            >
              <option value="" disabled className="bg-[#0F172A] text-[#94A3B8]">
                -- Select a student --
              </option>
              {studentsList.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  className="bg-[#0F172A] text-[#F8FAFC]"
                >
                  {s.name} ({s.enrollment_id})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="score-subject" className={labelClass}>
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              id="score-subject"
              type="text"
              required
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Score */}
            <div>
              <label htmlFor="score-value" className={labelClass}>
                Score <span className="text-rose-400">*</span>
              </label>
              <input
                id="score-value"
                type="number"
                min="0"
                step="0.5"
                required
                placeholder="0"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Total */}
            <div>
              <label htmlFor="score-total" className={labelClass}>
                Total <span className="text-rose-400">*</span>
              </label>
              <input
                id="score-total"
                type="number"
                min="1"
                step="0.5"
                required
                placeholder="100"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Test Date */}
          <div>
            <label htmlFor="score-date" className={labelClass}>
              Test Date <span className="text-rose-400">*</span>
            </label>
            <input
              id="score-date"
              type="date"
              required
              value={form.test_date}
              onChange={(e) =>
                setForm({ ...form, test_date: e.target.value })
              }
              className={`${inputClass} !appearance-none`}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
