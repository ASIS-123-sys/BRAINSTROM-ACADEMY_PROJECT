"use client";

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
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
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
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Manage Faculty
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
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
          className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
        >
          + Add Faculty
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8] animate-pulse">
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
          <p className="text-[#F8FAFC] font-semibold text-lg">
            No faculty found
          </p>
          <p className="text-[#94A3B8] text-sm">
            Add your first faculty member to get started.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none mt-2"
          >
            + Add Faculty
          </Button>
        </div>
      )}

      {/* ─── Table ─── */}
      {!loading && faculty.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#F8FAFC]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {faculty.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-white/5 transition-colors duration-150"
                >
                  <td className="px-5 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      {member.pic_url ? (
                        <img
                          src={member.pic_url}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs shrink-0">
                          {member.name[0]?.toUpperCase()}
                        </span>
                      )}
                      <div>
                        <span className="block">{member.name}</span>
                        {member.phone && (
                          <span className="block text-xs text-[#94A3B8] mt-0.5">
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">{member.subject}</td>
                  <td className="px-5 py-4">
                    {member.position || (
                      <span className="italic opacity-40 text-[#94A3B8]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#94A3B8]">
                    {member.experience || (
                      <span className="italic opacity-40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
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
