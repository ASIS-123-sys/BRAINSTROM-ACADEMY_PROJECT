"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
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
type FeeRow = {
  id: string;
  student_id: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
  status: "paid" | "due" | "partial";
  last_reminder_sent: string | null;
  created_at: string;
  students: {
    name: string;
    enrollment_id: string;
  } | null;
};

const defaultForm = {
  student_id: "",
  total_amount: "",
  paid_amount: "0",
  due_date: "",
};

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeRow[]>([]);
  const [studentsList, setStudentsList] = useState<StudentReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [feesRes, studentsRes] = await Promise.all([
          fetch("/api/admin/fees"),
          fetch("/api/admin/students"),
        ]);

        const feesJson = await feesRes.json();
        const studentsJson = await studentsRes.json();

        if (feesJson.data) setFees(feesJson.data);
        if (studentsJson.data) setStudentsList(studentsJson.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ─── Add fee record ───────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.student_id || !form.total_amount || !form.due_date) {
      setError("Please fill all required fields.");
      return;
    }

    const total = parseFloat(form.total_amount);
    const paid = parseFloat(form.paid_amount || "0");
    const status = paid >= total ? "paid" : paid > 0 ? "partial" : "due";

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: form.student_id,
          total_amount: total,
          paid_amount: paid,
          due_date: form.due_date,
          status,
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
        (s) => s.id === form.student_id,
      );
      const newRecord = {
        ...json.data,
        students: selectedStudent
          ? {
              name: selectedStudent.name,
              enrollment_id: selectedStudent.enrollment_id,
            }
          : null,
      } as FeeRow;

      setFees((prev) =>
        [...prev, newRecord].sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
        ),
      );
      setForm(defaultForm);
      setIsModalOpen(false);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Mark as Paid ─────────────────────────────────────────────────────────
  async function handleMarkPaid(id: string, totalAmount: number) {
    setActionId(id);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          paid_amount: totalAmount,
          total_amount: totalAmount,
        }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error updating fee: " + json.error);
      } else {
        setFees((prev) =>
          prev.map((fee) =>
            fee.id === id
              ? { ...fee, paid_amount: totalAmount, status: "paid" }
              : fee,
          ),
        );
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setActionId(null);
    }
  }

  // ─── Delete fee record ────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this fee record? This action cannot be undone."))
      return;
    setActionId(id);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.error) {
        alert("Error deleting record: " + json.error);
      } else {
        setFees((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      alert("Unexpected error. Please try again.");
    } finally {
      setActionId(null);
    }
  }

  // ─── Shared styles (light theme to match admin layout) ──────────────────
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
            Manage Fees
          </h1>
          <p className="text-sm text-[#42576E] mt-1">
            {loading
              ? "Loading…"
              : `${fees.length} fee record${fees.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none shrink-0"
        >
          + Add Fee Record
        </Button>
      </div>

      {/* ─── Loading state ─── */}
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#42576E] animate-pulse">
              Fetching records…
            </p>
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && fees.length === 0 && (
        <div
          style={tableContainerStyle}
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl">💰</span>
          <p className="text-[#003358] font-semibold text-lg">
            No fee records found
          </p>
          <p className="text-[#42576E] text-sm">
            Add a new fee record to get started.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none mt-2"
          >
            + Add Fee Record
          </Button>
        </div>
      )}

      {/* ─── Table ─── */}
      {!loading && fees.length > 0 && (
        <div style={tableContainerStyle} className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-[#1E3A52]">
            <thead>
              <tr className="border-b border-[#7FB3E8] bg-[#9FC7F0]/30 text-xs uppercase tracking-wider text-[#003358] font-semibold">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7FB3E8]/50">
              {fees.map((fee) => {
                const isPaid = fee.status === "paid";
                return (
                  <tr
                    key={fee.id}
                    className="hover:bg-[#9FC7F0]/20 transition-colors duration-150"
                  >
                    <td className="px-5 py-4 font-medium">
                      <div className="flex flex-col">
                        <span>{fee.students?.name || "N/A"}</span>
                        <span className="text-xs text-[#42576E] font-mono mt-0.5">
                          {fee.students?.enrollment_id || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#42576E]">
                      ₹{fee.total_amount}
                    </td>
                    <td className="px-5 py-4 text-[#42576E]">
                      ₹{fee.paid_amount}
                    </td>
                    <td className="px-5 py-4 text-[#42576E]">
                      {new Date(fee.due_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
                          fee.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : fee.status === "partial"
                              ? "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20"
                              : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center space-x-2">
                      {!isPaid ? (
                        <button
                          onClick={() =>
                            handleMarkPaid(fee.id, fee.total_amount)
                          }
                          disabled={actionId === fee.id}
                          className="font-semibold text-xs px-3 py-1.5 rounded-lg bg-[#2dbcfe]/20 text-[#003358] hover:bg-[#2dbcfe]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold px-3 py-1.5 inline-block cursor-default">
                          Cleared
                        </span>
                      )}

                      <button
                        onClick={() => handleDelete(fee.id)}
                        disabled={actionId === fee.id}
                        className="text-rose-700 hover:text-rose-600 font-semibold text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Delete fee record"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Add Fee Modal ─── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
          setForm(defaultForm);
        }}
        title="Add Fee Record"
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
              form="add-fee-form"
              isLoading={submitting}
              className="bg-[#2dbcfe] text-[#003358] hover:opacity-90 font-bold border-none"
            >
              Add Record
            </Button>
          </div>
        }
      >
        <form id="add-fee-form" onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Student Dropdown */}
          <div>
            <label htmlFor="fee-student" className={labelClass}>
              Student <span className="text-rose-400">*</span>
            </label>
            <select
              id="fee-student"
              required
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>
                -- Select a student --
              </option>
              {studentsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.enrollment_id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Amount */}
            <div>
              <label htmlFor="fee-total" className={labelClass}>
                Total Amount <span className="text-rose-400">*</span>
              </label>
              <input
                id="fee-total"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={form.total_amount}
                onChange={(e) =>
                  setForm({ ...form, total_amount: e.target.value })
                }
                className={inputClass}
              />
            </div>

            {/* Paid Amount */}
            <div>
              <label htmlFor="fee-paid" className={labelClass}>
                Paid Amount
              </label>
              <input
                id="fee-paid"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.paid_amount}
                onChange={(e) =>
                  setForm({ ...form, paid_amount: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="fee-due" className={labelClass}>
              Due Date <span className="text-rose-400">*</span>
            </label>
            <input
              id="fee-due"
              type="date"
              required
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className={`${inputClass} !appearance-none`}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
