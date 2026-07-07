"use client";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { createClient } from "@/lib/supabase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Notice = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) setNotices(data);
      setLoading(false);
    }
    fetchNotices();
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#789ec4] text-[#F8FAFC] ${poppins.className}`}
    >
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Notice Board</h1>
        <p className="text-[#20385a] mb-10 text-sm">
          Latest announcements from Brainstorm Academy
        </p>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
          </div>
        )}

        {!loading && notices.length === 0 && (
          <div className="text-center py-20 text-[#2d3b50]">
            No notices at this time. Check back later.
          </div>
        )}

        <div className="space-y-4">
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              style={{
                background: "rgba(300,300,300,0.01)",
                border: "1px solid rgba(300,300,300,0.08)",
                backdropFilter: "blur(20px)",
                borderRadius: "16px",
              }}
              className="p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-bold text-[#0F172A] bg-[#029bb6] rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                    {index === 0 ? "NEW" : index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-[#282b2e] mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-[#29384c] text-sm leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#32425a] shrink-0 mt-1">
                  {new Date(notice.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
