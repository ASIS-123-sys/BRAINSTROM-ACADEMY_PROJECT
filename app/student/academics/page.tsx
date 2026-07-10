"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Score = {
  id: string;
  subject: string;
  score: number;
  total: number;
  test_date: string;
};

export default function StudentAcademics() {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    async function loadScores() {
      // Session check only — actual scores now come from the server-side
      // API route, which safely fetches only this student's own records.
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.user) {
        router.push("/auth/student-login");
        return;
      }

      try {
        const res = await fetch("/api/student/scores");
        const json = await res.json();
        if (json.data) setScores(json.data);
      } catch {
        // leave scores empty on failure
      } finally {
        setLoading(false);
      }
    }
    loadScores();
  }, []);

  // filter scores based on selected year and month
  const filteredScores = scores.filter((score) => {
    const date = new Date(score.test_date);
    const yearMatch =
      selectedYear === "all" || date.getFullYear().toString() === selectedYear;
    const monthMatch =
      selectedMonth === "all" ||
      (date.getMonth() + 1).toString() === selectedMonth;
    return yearMatch && monthMatch;
  });

  // get unique years from scores
  const years = [
    ...new Set(
      scores.map((s) => new Date(s.test_date).getFullYear().toString()),
    ),
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // group scores by subject for graph
  const subjectAverages = Object.entries(
    filteredScores.reduce(
      (acc, score) => {
        if (!acc[score.subject]) acc[score.subject] = { total: 0, count: 0 };
        acc[score.subject].total += (score.score / score.total) * 100;
        acc[score.subject].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    ),
  ).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#2dbcfe]/30 border-t-[#2dbcfe] rounded-full animate-spin mx-auto" />
          <p className="text-[#42576E] text-lg">Loading academics...</p>
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
            className="text-[#2dbcfe] font-semibold text-sm border-b-2 border-[#2dbcfe] pb-0.5"
          >
            Academics
          </a>
          <a
            href="/student/fees"
            className="text-[#42576E] hover:text-[#003358] font-semibold text-sm transition-colors"
          >
            Fees
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-[#003358]">Academic Overview</h1>

        {/* Subject Average Graph */}
        {subjectAverages.length > 0 && (
          <div style={glassCard} className="p-6">
            <h2 className="text-xs font-bold mb-6 text-[#42576E] uppercase tracking-wider">
              Subject Performance
            </h2>
            <div className="space-y-4">
              {subjectAverages.map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#1E3A52]">
                      {item.subject}
                    </span>
                    <span className="text-sm font-bold text-[#003358]">
                      {item.average}%
                    </span>
                  </div>
                  <div className="w-full bg-[#9FC7F0]/40 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.average}%`,
                        background:
                          item.average >= 75
                            ? "linear-gradient(90deg, #2dbcfe, #0ea5e9)"
                            : item.average >= 50
                              ? "linear-gradient(90deg, #F59E0B, #D97706)"
                              : "linear-gradient(90deg, #EF4444, #DC2626)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={glassCard} className="p-6">
          <h2 className="text-xs font-bold mb-4 text-[#42576E] uppercase tracking-wider">
            Filter Marks
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[#42576E] font-semibold uppercase tracking-wider mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-white/60 border border-[#7FB3E8] text-[#1E3A52] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#2dbcfe] transition-colors"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#42576E] font-semibold uppercase tracking-wider mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white/60 border border-[#7FB3E8] text-[#1E3A52] rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#2dbcfe] transition-colors"
              >
                <option value="all">All Months</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div>
          <h2 className="text-xs font-bold mb-4 text-[#42576E] uppercase tracking-wider">
            Individual Marks ({filteredScores.length} records)
          </h2>
          <div
            className="overflow-x-auto rounded-2xl border border-[#7FB3E8]"
            style={{ background: "#B8D9F5" }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#7FB3E8] bg-[#9FC7F0]/30 text-xs uppercase tracking-wider text-[#003358] font-semibold">
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7FB3E8]/50 text-sm text-[#1E3A52]">
                {filteredScores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#42576E]">
                      No marks found for selected period.
                    </td>
                  </tr>
                ) : (
                  filteredScores.map((score) => {
                    const percentage = Math.round(
                      (score.score / score.total) * 100,
                    );
                    return (
                      <tr
                        key={score.id}
                        className="hover:bg-[#9FC7F0]/20 transition-colors"
                      >
                        <td className="p-4 font-medium">{score.subject}</td>
                        <td className="p-4 text-center font-mono text-[#003358] font-bold">
                          {score.score}/{score.total}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              percentage >= 75
                                ? "bg-green-500/15 text-green-700"
                                : percentage >= 50
                                  ? "bg-yellow-500/15 text-yellow-700"
                                  : "bg-red-500/15 text-red-700"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-right text-[#42576E]">
                          {new Date(score.test_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
