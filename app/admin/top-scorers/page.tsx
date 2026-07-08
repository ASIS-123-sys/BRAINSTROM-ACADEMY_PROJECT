"use client";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Student = {
  id: string;
  name: string;
  enrollment_id: string;
  batch: string;
  course: string | null;
  rank: number | null;
  percentage: number | null;
  profile_pic_url: string | null;
  is_top_scorer?: boolean;
};

const defaultForm = {
  student_id: "",
  rank: "",
  percentage: "",
};

export default function TopScorersPage() {
  const [topScorers, setTopScorers] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tableContainerStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
  };

  const labelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [topRes, allRes] = await Promise.all([
          fetch("/api/admin/top-scorers"),
          fetch("/api/admin/students"),
        ]);
        const topJson = await topRes.json();
        const allJson = await allRes.json();
        if (topJson.data) setTopScorers(topJson.data);
        if (allJson.data) setAllStudents(allJson.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.student_id || !form.rank || !form.percentage) {
      setError("All fields are required");
      return;
    }

    const rankNum = parseInt(form.rank);
    const percentageNum = parseFloat(form.percentage);

    if (isNaN(rankNum) || rankNum < 1) {
      setError("Rank must be a valid number");
      return;
    }

    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      setError("Percentage must be between 0 and 100");
      return;
    }

    // check if already a top scorer
    const alreadyAdded = topScorers.find((s) => s.id === form.student_id);
    if (alreadyAdded) {
      setError("This student is already in the top scorers list");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/top-scorers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: form.student_id,
          rank: rankNum,
          percentage: percentageNum,
        }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setTopScorers((prev) =>
        [...prev, json.data].sort((a, b) => (a.rank || 0) - (b.rank || 0)),
      );
      setForm(defaultForm);
      setIsModalOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(studentId: string) {
    if (!confirm("Remove this student from top scorers?")) return;
    setRemovingId(studentId);
    try {
      const res = await fetch("/api/admin/top-scorers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error: " + json.error);
      } else {
        setTopScorers((prev) => prev.filter((s) => s.id !== studentId));
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className={`space-y-8 ${poppins.className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Top Scorers
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {loading
              ? "Loading…"
              : `${topScorers.length} top scorer${topScorers.length !== 1 ? "s" : ""} listed`}
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
        >
          + Add Top Scorer
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8] animate-pulse">
              Loading top scorers…
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && topScorers.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">🏆</span>
          <p className="text-[#F8FAFC] font-semibold text-lg">
            No top scorers yet
          </p>
          <p className="text-[#94A3B8] text-sm">
            Add students who performed best to showcase them publicly.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none mt-2"
          >
            + Add Top Scorer
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && topScorers.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Percentage</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topScorers.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/5 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <span className="text-lg font-extrabold text-[#F59E0B]">
                      #{student.rank}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      {student.profile_pic_url ? (
                        <img
                          src={student.profile_pic_url}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-sm shrink-0">
                          {student.name[0]?.toUpperCase()}
                        </span>
                      )}
                      <div>
                        <span className="block font-semibold">
                          {student.name}
                        </span>
                        <span className="block text-xs text-[#06B6D4] font-mono mt-0.5">
                          {student.enrollment_id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">{student.batch}</td>
                  <td className="px-5 py-4 text-[#94A3B8]">
                    {student.course || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-400 text-base">
                      {student.percentage}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleRemove(student.id)}
                      disabled={removingId === student.id}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === student.id ? "Removing…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add Top Scorer"
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
              form="add-top-scorer-form"
              isLoading={submitting}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Add to Top Scorers
            </Button>
          </div>
        }
      >
        <form
          id="add-top-scorer-form"
          onSubmit={handleAdd}
          className="space-y-4"
        >
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Student Select */}
          <div>
            <label className={labelClass}>
              Select Student <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>
                -- Choose a student --
              </option>
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.enrollment_id})
                </option>
              ))}
            </select>
          </div>

          {/* Rank */}
          <div>
            <label className={labelClass}>
              Rank <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 1"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Percentage */}
          <div>
            <label className={labelClass}>
              Percentage <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 95.5"
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: e.target.value })}
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
