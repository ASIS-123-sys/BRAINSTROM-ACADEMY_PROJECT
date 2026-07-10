"use client";
export const dynamic = "force-dynamic";
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin mx-auto" />
          <p className="text-[#94A3B8] text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-[#94A3B8]">
          No profile found. Please contact admin.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#0F172A] text-[#F8FAFC] ${poppins.className}`}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">Brainstorm Academy</div>
        <div className="flex gap-6">
          <Link
            href="/student/dashboard"
            className="text-[#06B6D4] font-semibold text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/student/academics"
            className="text-[#94A3B8] hover:text-white font-semibold text-sm"
          >
            Academics
          </Link>
          <Link
            href="/student/fees"
            className="text-[#94A3B8] hover:text-white font-semibold text-sm"
          >
            Fees
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          Logout
        </button>
      </nav>

      {/* Profile */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-[#06B6D4]/20 border-2 border-[#06B6D4]/40 flex items-center justify-center overflow-hidden shrink-0">
              {student.profile_pic_url ? (
                <img
                  src={student.profile_pic_url}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#06B6D4]">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#F8FAFC]">
                {student.name}
              </h2>
              <p className="text-[#94A3B8] text-sm mt-1">Student</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Enrollment ID", value: student.enrollment_id },
              { label: "Phone", value: student.phone || "Not provided" },
              { label: "Batch", value: student.batch || "Not provided" },
              { label: "Course", value: student.course || "Not provided" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-[#F8FAFC] font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex gap-4 mt-8">
            <Link
              href="/student/academics"
              className="flex-1 text-center py-3 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] font-bold text-sm hover:bg-[#06B6D4]/20 transition-all"
            >
              View Academics
            </Link>

            <Link
              href="/student/fees"
              className="flex-1 text-center py-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] font-bold text-sm hover:bg-[#F59E0B]/20 transition-all"
            >
              View Fees
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
