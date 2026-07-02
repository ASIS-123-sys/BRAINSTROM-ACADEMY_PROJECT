"use client";
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
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.user) {
        router.push("/auth/student-login");
        return;
      }

      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("student_id", session.user.id)
        .order("test_date", { ascending: false });

      if (!error && data) setScores(data);
      setLoading(false);
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-[#94A3B8] text-lg">Loading academics...</p>
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
            className="text-[#06B6D4] font-semibold text-sm"
          >
            Academics
          </a>
          <a
            href="/student/fees"
            className="text-[#94A3B8] hover:text-white font-semibold text-sm"
          >
            Fees
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-bold">Academic Overview</h1>

        {/* Subject Average Graph */}
        {subjectAverages.length > 0 && (
          <div style={glassCard} className="p-6">
            <h2 className="text-lg font-bold mb-6 text-[#94A3B8] uppercase tracking-wider text-sm">
              Subject Performance
            </h2>
            <div className="space-y-4">
              {subjectAverages.map((item) => (
                <div key={item.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#F8FAFC]">
                      {item.subject}
                    </span>
                    <span className="text-sm font-bold text-[#06B6D4]">
                      {item.average}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.average}%`,
                        background:
                          item.average >= 75
                            ? "linear-gradient(90deg, #06B6D4, #0891B2)"
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
          <h2 className="text-lg font-bold mb-4 text-[#94A3B8] uppercase tracking-wider text-sm">
            Filter Marks
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#06B6D4]"
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
              <label className="block text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-[#0F172A] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none text-sm focus:border-[#06B6D4]"
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
          <h2 className="text-lg font-bold mb-4 text-[#94A3B8] uppercase tracking-wider text-sm">
            Individual Marks ({filteredScores.length} records)
          </h2>
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
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-center">Percentage</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-[#F8FAFC]">
                {filteredScores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#94A3B8]">
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
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-medium">{score.subject}</td>
                        <td className="p-4 text-center font-mono text-[#F59E0B] font-bold">
                          {score.score}/{score.total}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              percentage >= 75
                                ? "bg-green-500/15 text-green-400"
                                : percentage >= 50
                                  ? "bg-yellow-500/15 text-yellow-400"
                                  : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-right text-[#94A3B8]">
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
