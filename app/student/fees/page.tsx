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
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.user) {
        router.push("/auth/student-login");
        return;
      }

      const { data, error } = await supabase
        .from("fees")
        .select("*")
        .eq("student_id", session.user.id)
        .order("due_date", { ascending: false });

      if (!error && data) setFees(data);
      setLoading(false);
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-[#94A3B8] text-lg">Loading fees...</p>
      </div>
    );
  }

  const glassCard = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
  };

  return (
    <div
      className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] ${poppins.className}`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">Brainstorm Academy</div>
        <div className="flex gap-6">
          <a
            href="/student/dashboard"
            className="text-[#94A3B8] hover:text-white font-semibold text-sm"
          >
            Dashboard
          </a>
          <a
            href="/student/academics"
            className="text-[#94A3B8] hover:text-white font-semibold text-sm"
          >
            Academics
          </a>
          <a
            href="/student/fees"
            className="text-[#06B6D4] font-semibold text-sm"
          >
            Fees
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold">Fee Status</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div style={glassCard} className="p-6 text-center">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-2">
              Total Paid
            </p>
            <p className="text-3xl font-extrabold text-green-400">
              Rs. {totalPaid.toLocaleString()}
            </p>
          </div>
          <div style={glassCard} className="p-6 text-center">
            <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-2">
              Total Due
            </p>
            <p className="text-3xl font-extrabold text-red-400">
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
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#06B6D4] text-[#0F172A]"
                  : "bg-white/5 text-[#94A3B8] hover:text-white border border-white/10"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Fees Table */}
        <div
          className="overflow-x-auto rounded-2xl border border-white/10"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
          }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-[#06B6D4] font-semibold">
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Due</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#94A3B8]">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-[#94A3B8]">
                      {new Date(fee.due_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-mono">
                      Rs. {fee.total_amount.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-green-400">
                      Rs. {fee.paid_amount.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-red-400">
                      Rs.{" "}
                      {(fee.total_amount - fee.paid_amount).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          fee.status === "paid"
                            ? "bg-green-500/15 text-green-400"
                            : fee.status === "partial"
                              ? "bg-yellow-500/15 text-yellow-400"
                              : "bg-red-500/15 text-red-400"
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
