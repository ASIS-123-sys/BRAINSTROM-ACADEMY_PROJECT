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
  course: string;
  profile_pic_url: string | null;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      // get session first then user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        router.push("/auth/student-login");
        return;
      }

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        // user is logged in but no student record found
        setLoading(false);
        return;
      }

      setStudent(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/student-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <p className="text-[#42576E] text-lg font-bold">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] flex flex-col md:flex-row text-[#003358] ${poppins.className}`}
    >
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#003358] text-white flex flex-col p-6 shrink-0 md:min-h-screen border-r border-[#003358]">
        {/* Profile in Sidebar */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-20 h-20 rounded-full bg-[#2dbcfe] border-2 border-[#B8D9F5] flex items-center justify-center overflow-hidden mb-4 shadow-sm">
            {student?.profile_pic_url ? (
              <img
                src={student.profile_pic_url}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-[#003358]">
                {student?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-center">{student?.name}</h2>
          <p className="text-sm text-[#2dbcfe] font-medium mt-1">
            {student?.enrollment_id}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 mt-8">
          <Link
            href="/student/dashboard"
            className="px-4 py-3 rounded-xl bg-[#2dbcfe] text-[#003358] font-bold shadow-sm transition-all flex items-center gap-3"
          >
            Dashboard
          </Link>
          <Link
            href="/student/academics"
            className="px-4 py-3 rounded-xl text-white hover:bg-[#B8D9F5]/20 font-semibold transition-all flex items-center gap-3"
          >
            Academics
          </Link>
          <Link
            href="/student/fees"
            className="px-4 py-3 rounded-xl text-white hover:bg-[#B8D9F5]/20 font-semibold transition-all flex items-center gap-3"
          >
            Fees
          </Link>
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile & Stats */}
            <div className="space-y-8 lg:col-span-1 flex flex-col">
              {/* Card 3 (Moved here for layout): Profile Summary */}
              <div className="bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-30 h-30 rounded-full bg-[#9FC7F0] border-2 border-[#7FB3E8] flex items-center justify-center overflow-hidden mb-6">
                  {student?.profile_pic_url ? (
                    <img
                      src={student.profile_pic_url}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-[#003358]">
                      {student?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#003358]">
                  {student?.name}
                </h3>
                <p className="text-[#42576E] mb-6 font-medium text-sm">
                  Student Profile
                </p>

                <div className="w-full mt-auto flex flex-col">
                  <div className="py-4 border-b border-[#7FB3E8] flex justify-between items-center text-sm">
                    <span className="text-[#42576E] font-semibold uppercase text-xs">
                      Enrollment ID
                    </span>
                    <span className="font-medium text-[#003358]">
                      {student?.enrollment_id}
                    </span>
                  </div>
                  <div className="py-4 border-b border-[#7FB3E8] flex justify-between items-center text-sm">
                    <span className="text-[#42576E] font-semibold uppercase text-xs">
                      Batch
                    </span>
                    <span className="font-medium text-[#003358]">
                      {student?.batch || "N/A"}
                    </span>
                  </div>
                  <div className="py-4 flex justify-between items-center text-sm">
                    <span className="text-[#42576E] font-semibold uppercase text-xs">
                      Course
                    </span>
                    <span className="font-medium text-[#003358]">
                      {student?.course || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5: Quick Stats */}
              <div className="bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#003358] mb-4">
                  Quick Stats
                </h3>
                <div className="flex-1 flex flex-col justify-center gap-6">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-[#42576E] uppercase">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-[#003358] truncate">
                      {student?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-[#42576E] uppercase">
                      Status
                    </p>
                    <p className="text-sm font-medium text-[#2dbcfe]">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle & Right Columns: Main Dash */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Attendance */}
              <Link
                href="/student/academics"
                className="group block bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm hover:border-[#2dbcfe] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <h3 className="text-lg font-bold text-[#003358] mb-4">
                  Attendance
                </h3>
                <div className="flex justify-center items-center py-6">
                  {/* CSS Donut Chart */}
                  <div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center bg-[#9FC7F0] shadow-inner"
                    style={{
                      background: "conic-gradient(#2dbcfe 85%, #9FC7F0 0)",
                    }}
                  >
                    <div className="w-24 h-24 bg-[#B8D9F5] rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-[#003358]">
                        85%
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 2: Academic Performance */}
              <Link
                href="/student/academics"
                className="group block bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm hover:border-[#2dbcfe] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <h3 className="text-lg font-bold text-[#003358] mb-4">
                  Academic Performance
                </h3>
                <div className="space-y-5 mt-2">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-[#003358] mb-2">
                      <span>Midterms</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-[#9FC7F0] h-3 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-[#2dbcfe] h-full rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-[#003358] mb-2">
                      <span>Assignments</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-[#9FC7F0] h-3 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-[#2dbcfe] h-full rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-[#003358] mb-2">
                      <span>Practicals</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-[#9FC7F0] h-3 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-[#2dbcfe] h-full rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 3: Fee Status */}
              <Link
                href="/student/fees"
                className="group flex flex-col bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm hover:border-[#2dbcfe] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <h3 className="text-lg font-bold text-[#003358] mb-4">
                  Fee Status
                </h3>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#42576E] uppercase mb-1">
                      Total Pending
                    </p>
                    <p className="text-3xl font-medium text-[#003358]">₹0</p>
                  </div>
                  <div className="px-4 py-2 bg-green-500/10 text-green-700 font-bold text-xs rounded-full border border-green-500/20 uppercase tracking-wide">
                    PAID
                  </div>
                </div>
              </Link>

              {/* Card 4: Upcoming Notices */}
              <Link
                href="/notice"
                className="group block bg-[#B8D9F5] border border-[#7FB3E8] rounded-2xl p-6 shadow-sm hover:border-[#2dbcfe] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-[#003358]">
                    Recent Notices
                  </h3>
                  <span className="text-sm font-medium text-[#2dbcfe] group-hover:underline">
                    View All &rarr;
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="py-3 border-b border-[#7FB3E8] flex justify-between items-center transition-colors">
                    <p className="text-sm font-medium text-[#003358]">
                      Final Exam Schedule Released
                    </p>
                    <p className="text-xs font-semibold text-[#42576E] whitespace-nowrap ml-2">
                      12 May
                    </p>
                  </div>
                  <div className="py-3 border-b border-[#7FB3E8] flex justify-between items-center transition-colors">
                    <p className="text-sm font-medium text-[#003358]">
                      Holiday for Summer Break
                    </p>
                    <p className="text-xs font-semibold text-[#42576E] whitespace-nowrap ml-2">
                      10 May
                    </p>
                  </div>
                  <div className="py-3 flex justify-between items-center transition-colors">
                    <p className="text-sm font-medium text-[#003358]">
                      Fee Submission Deadline
                    </p>
                    <p className="text-xs font-semibold text-[#42576E] whitespace-nowrap ml-2">
                      05 May
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
