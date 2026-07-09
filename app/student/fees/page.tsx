"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Fee = {
  id: string;
  total_amount: number;
  paid_amount: number;
  due_date: string;
  status: "paid" | "due" | "partial";
};

export default function StudentFees() {
  const router = useRouter();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "due">("all");

  useEffect(() => {
    async function loadFees() {
      try {
        const res = await fetch("/api/student/fees");
        const json = await res.json();
        if (json.error) {
          router.push("/auth/student-login");
          return;
        }
        if (json.data) setFees(json.data);
      } catch {
        router.push("/auth/student-login");
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);
  const filteredFees =
    activeTab === "all" ? fees : fees.filter((f) => f.status === activeTab);

  const totalDue = fees.reduce(
    (sum, f) => sum + (f.total_amount - f.paid_amount),
    0,
  );
  const totalPaid = fees.reduce((sum, f) => sum + f.paid_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
          <p className="text-[#42576E] text-lg">Loading fees...</p>
        </div>
      </div>
    );
  }

  const glassCard = {
    background: "#B8D9F5",
    border: "1px solid #7FB3E8",
    borderRadius: "16px",
  };

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] text-[#003358] ${poppins.className}`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#F7FAFD]/95 backdrop-blur-sm border-b border-[#7FB3E8] px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg text-[#003358]">
          Brainstorm Academy
        </div>
        <div className="flex gap-6">
          <a
            href="/student/dashboard"
            className="text-[#42576E] hover:text-[#003358] font-semibold text-sm transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/student/academics"
            className="text-[#42576E] hover:text-[#003358] font-semibold text-sm transition-colors"
          >
            Academics
          </a>
          <a
            href="/student/fees"
            className="text-[#2dbcfe] font-semibold text-sm border-b-2 border-[#2dbcfe] pb-0.5"
          >
            Fees
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-[#003358]">Fee Status</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div style={glassCard} className="p-6 text-center">
            <p className="text-xs text-[#42576E] uppercase tracking-wider font-semibold mb-2">
              Total Paid
            </p>
            <p className="text-3xl font-extrabold text-emerald-700">
              Rs. {totalPaid.toLocaleString()}
            </p>
          </div>
          <div style={glassCard} className="p-6 text-center">
            <p className="text-xs text-[#42576E] uppercase tracking-wider font-semibold mb-2">
              Total Due
            </p>
            <p className="text-3xl font-extrabold text-rose-700">
              Rs. {totalDue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "paid", "due"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#2dbcfe] text-[#003358]"
                  : "bg-[#9FC7F0]/30 text-[#42576E] hover:text-[#003358] border border-[#7FB3E8]"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Fees Table */}
        <div
          className="overflow-x-auto rounded-2xl border border-[#7FB3E8]"
          style={{ background: "#B8D9F5" }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#7FB3E8] bg-[#9FC7F0]/30 text-xs uppercase tracking-wider text-[#003358] font-semibold">
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Due</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7FB3E8]/50 text-sm text-[#1E3A52]">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#42576E]">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-[#9FC7F0]/20 transition-colors"
                  >
                    <td className="p-4 text-[#42576E]">
                      {new Date(fee.due_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-mono text-[#1E3A52]">
                      Rs. {fee.total_amount.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-emerald-700">
                      Rs. {fee.paid_amount.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-rose-700">
                      Rs.{" "}
                      {(fee.total_amount - fee.paid_amount).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          fee.status === "paid"
                            ? "bg-green-500/15 text-green-700"
                            : fee.status === "partial"
                              ? "bg-yellow-500/15 text-yellow-700"
                              : "bg-red-500/15 text-red-700"
                        }`}
                      >
                        {fee.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
