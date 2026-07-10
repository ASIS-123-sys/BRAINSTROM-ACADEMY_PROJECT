"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Student = {
  id: string;
  enrollment_id: string;
  name: string;
  phone: string;
  batch: string;
  course: string | null;
  profile_pic_url: string | null;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile");
        const json = await res.json();

        if (json.error) {
          router.push("/auth/student-login");
          return;
        }

        setStudent(json.data);
      } catch {
        router.push("/auth/student-login");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#003358]/30 border-t-[#003358] rounded-full animate-spin mx-auto" />
          <p className="text-[#003358] text-sm font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <p className="text-[#003358] font-semibold">
          No profile found. Please contact admin.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] text-[#42576E] flex ${poppins.className}`}
    >
      {/* Left Sidebar (fixed, ~250px wide) */}
      <aside className="fixed left-0 top-0 h-screen w-[250px] bg-[#B8D9F5] border-r border-[#7FB3E8] p-6 flex flex-col justify-between z-30">
        <div className="flex flex-col">
          {/* Academy logo + name at top */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg text-[#003358]">Brainstorm Academy</span>
          </div>

          {/* Student avatar circle with initial below logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#2dbcfe] flex items-center justify-center overflow-hidden mb-3">
              {student.profile_pic_url ? (
                <img
                  src={student.profile_pic_url}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Student name bold */}
            <div className="font-bold text-base text-[#003358]">{student.name}</div>
            {/* Student role: 'Student' in muted text */}
            <div className="text-xs text-[#42576E] opacity-75 mt-0.5">Student</div>
          </div>

          {/* Navigation links below */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/student/dashboard"
              className="text-[#2dbcfe] font-bold text-sm flex items-center gap-2"
            >
              <span>📊</span> Dashboard
            </Link>
            <Link
              href="/student/academics"
              className="text-[#003358] hover:text-[#2dbcfe] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <span>📖</span> Academics
            </Link>
            <Link
              href="/student/fees"
              className="text-[#003358] hover:text-[#2dbcfe] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <span>💳</span> Fees
            </Link>
          </nav>
        </div>

        {/* Logout button at very bottom */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-xl font-bold text-xs bg-transparent text-[#003358] border border-[#003358] hover:bg-[#003358]/5 transition-all mt-auto"
        >
          Logout
        </button>
      </aside>

      {/* Main Content (right side) */}
      <main className="flex-1 ml-[250px] p-8 min-h-screen bg-[#F7FAFD]">
        {/* Top welcome banner */}
        <div className="p-6 rounded-2xl bg-[#B8D9F5] border border-[#7FB3E8] flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#003358]">
              Welcome back, {student.name}!
            </h1>
            <p className="text-[#42576E] text-sm mt-1">
              Always stay updated in your student portal
            </p>
          </div>
          <div className="text-[#003358] font-semibold text-sm" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Info cards row (3 cards side by side) */}
        <div className="grid grid-cols-3 gap-6 mt-8 mb-8">
          {[
            { label: "Enrollment ID", value: student.enrollment_id, icon: "🎓" },
            { label: "Phone", value: student.phone || "Not provided", icon: "📞" },
            { label: "Batch", value: student.batch || "Not provided", icon: "📅" },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-8 bg-[#B8D9F5] border border-[#7FB3E8] flex items-center justify-between min-h-[120px]"
            >
              <div>
                <p className="text-xs text-[#42576E] uppercase tracking-wider font-semibold mb-1">
                  {card.label}
                </p>
                <p className="text-[#003358] font-bold text-2xl">{card.value}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          ))}
        </div>

        {/* Course card below */}
        <div className="w-full rounded-xl p-8 bg-[#9FC7F0] border border-[#7FB3E8] mb-8 min-h-[120px] flex flex-col justify-center">
          <p className="text-xs text-[#42576E] uppercase tracking-wider font-semibold mb-1">
            Course
          </p>
          <p className="text-2xl font-bold text-[#003358]">
            {student.course || "Not provided"}
          </p>
        </div>

        {/* Two action buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/student/academics"
            className="flex-1 text-center py-4 rounded-xl bg-[#2dbcfe] text-white font-bold text-sm hover:opacity-90 transition-all"
          >
            View Academics
          </Link>
          <Link
            href="/student/fees"
            className="flex-1 text-center py-4 rounded-xl bg-[#003358] text-white font-bold text-sm hover:opacity-90 transition-all"
          >
            View Fees
          </Link>
        </div>
      </main>
    </div>
  );
}
