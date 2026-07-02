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

const MAX_NOTICES = 5;

// Local row type — avoids modifying @/types
type NoticeRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

const defaultForm = { title: "", content: "" };

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch all notices (newest first) ────────────────────────────────────
  useEffect(() => {
    async function fetchNotices() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setNotices(data as NoticeRow[]);
      setLoading(false);
    }
    fetchNotices();
  }, []);

  // ─── Add notice ───────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and Content are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }

      // Prepend new notice and enforce the 5-notice cap client-side.
      // If the list would exceed MAX_NOTICES, delete the oldest from the DB
      // then trim it locally.
      const updated = [json.data as NoticeRow, ...notices];

      if (updated.length > MAX_NOTICES) {
        const oldest = updated[updated.length - 1];
        // Fire-and-forget delete of oldest — best-effort, matching the
        // DB trigger pattern described in lib/api/notices.ts
        fetch("/api/admin/notices", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: oldest.id }),
        }).catch(() => {
          // silent — page will refresh correctly on next load
        });
        setNotices(updated.slice(0, MAX_NOTICES));
      } else {
        setNotices(updated);
      }

      setForm(defaultForm);
      setIsModalOpen(false);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Delete notice ────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this notice? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting notice: " + json.error);
      } else {
        setNotices((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Shared styles ────────────────────────────────────────────────────────
  const glassStyle: React.CSSProperties = {
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Manage Notices
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {loading
              ? "Loading…"
              : `${notices.length} / ${MAX_NOTICES} notices`}
          </p>
          <p className="text-xs text-[#F59E0B]/80 mt-1 font-medium">
            Max {MAX_NOTICES} notices — oldest is auto-removed when a new one is
            added.
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none shrink-0"
        >
          + Add Notice
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#94A3B8] animate-pulse">
              Fetching notices…
            </p>
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && notices.length === 0 && (
        <div
          style={glassStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">📢</span>
          <p className="text-[#F8FAFC] font-semibold text-lg">
            No notices found
          </p>
          <p className="text-[#94A3B8] text-sm">
            Add your first notice to display it on the student portal.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none mt-2"
          >
            + Add Notice
          </Button>
        </div>
      )}

      {/* ─── Notice cards list ─── */}
      {!loading && notices.length > 0 && (
        <div style={glassStyle} className="divide-y divide-white/5">
          {notices.map((notice, idx) => (
            <div
              key={notice.id}
              className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-white/[0.03] transition-colors duration-150"
            >
              {/* Index badge */}
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </span>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-[#F8FAFC] font-semibold text-base leading-snug">
                    {notice.title}
                  </h2>
                  <span className="text-xs text-[#94A3B8] shrink-0">
                    {new Date(notice.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-wrap break-words">
                  {notice.content}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(notice.id)}
                disabled={deletingId === notice.id}
                className="shrink-0 self-start text-rose-400 hover:text-rose-300 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === notice.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── Add Notice Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add New Notice"
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
              form="add-notice-form"
              isLoading={submitting}
              className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 font-bold border-none"
            >
              Add Notice
            </Button>
          </div>
        }
      >
        <form id="add-notice-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="notice-title" className={labelClass}>
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="notice-title"
              type="text"
              required
              placeholder="e.g. Holiday Notice"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="notice-content" className={labelClass}>
              Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="notice-content"
              required
              rows={5}
              placeholder="Write the full notice content here…"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          {notices.length >= MAX_NOTICES && (
            <p className="text-xs text-[#F59E0B] font-medium bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl px-4 py-2.5">
              ⚠️ You currently have {MAX_NOTICES} notices. Adding this will
              automatically delete the oldest one.
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
