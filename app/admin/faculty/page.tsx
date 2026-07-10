"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Local row type — includes all DB columns without modifying @/types
type FacultyRow = {
  id: string;
  name: string;
  phone: string | null;
  subject: string;
  position: string | null;
  experience: string | null;
  pic_url: string | null;
  created_at: string;
};

const defaultForm = {
  name: "",
  phone: "",
  subject: "",
  position: "",
  experience: "",
};

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all faculty ────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchFaculty() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/faculty");
        const json = await res.json();
        if (json.data) setFaculty(json.data as FacultyRow[]);
      } catch {
        setError("Failed to load faculty");
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);
  // ─── Add faculty ──────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.subject.trim()) {
      setError("Name and Subject are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setFaculty((prev) =>
          [...prev, json.data as FacultyRow].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
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

  // ─── Delete faculty ───────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this faculty member? This action cannot be undone."))
      return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/faculty", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting faculty: " + json.error);
      } else {
        setFaculty((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Shared styles ────────────────────────────────────────────────────────
  const tableContainerStyle: React.CSSProperties = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  const labelClass =
    "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-8 ${poppins.className}`}>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003358]">
            Manage Faculty
          </h1>
          <p className="text-sm text-[#42576E] mt-1">
            {loading
              ? "Loading…"
              : `${faculty.length} faculty member${faculty.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none shrink-0"
        >
          + Add Faculty
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#42576E] animate-pulse">
              Fetching faculty…
            </p>
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && faculty.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">👨‍🏫</span>
          <p className="text-[#003358] font-semibold text-lg">
            No faculty found
          </p>
          <p className="text-[#42576E] text-sm">
            Add your first faculty member to get started.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none mt-2"
          >
            + Add Faculty
          </Button>
        </div>
      )}

      {/* ─── Table ─── */}
      {!loading && faculty.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#1E3A52]">
            <thead>
              <tr className="border-b border-[#7FB3E8] bg-[#9FC7F0]/30 text-xs uppercase tracking-wider text-[#003358] font-semibold">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7FB3E8]/50">
              {faculty.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-[#9FC7F0]/20 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-medium text-[#1E3A52]">
                    <div className="flex items-center gap-3">
                      {member.pic_url ? (
                        <img
                          src={member.pic_url}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#7FB3E8] shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8] flex items-center justify-center font-bold text-xs shrink-0">
                          {member.name[0]?.toUpperCase()}
                        </span>
                      )}
                      <div>
                        <span className="block">{member.name}</span>
                        {member.phone && (
                          <span className="block text-xs text-[#42576E] mt-0.5">
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#42576E]">{member.subject}</td>
                  <td className="px-5 py-4">
                    {member.position || (
                      <span className="italic opacity-40 text-[#42576E]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#42576E]">
                    {member.experience || (
                      <span className="italic opacity-40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      className="text-rose-700 hover:text-rose-600 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {deletingId === member.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Add Faculty Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add New Faculty Member"
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
              form="add-faculty-form"
              isLoading={submitting}
              className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none"
            >
              Add Faculty
            </Button>
          </div>
        }
      >
        <form id="add-faculty-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="faculty-name" className={labelClass}>
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="faculty-name"
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="faculty-phone" className={labelClass}>
              Phone Number
            </label>
            <input
              id="faculty-phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="faculty-subject" className={labelClass}>
              Subject <span className="text-rose-400">*</span>
            </label>
            <input
              id="faculty-subject"
              type="text"
              required
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="faculty-position" className={labelClass}>
              Position
            </label>
            <input
              id="faculty-position"
              type="text"
              placeholder="e.g. Senior Lecturer"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="faculty-experience" className={labelClass}>
              Experience
            </label>
            <input
              id="faculty-experience"
              type="text"
              placeholder="e.g. 5 years"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className={inputClass}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
