"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
      className={`min-h-screen bg-[#F7FAFD] ${poppins.className}`}
    >
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero banner — image + heading merged */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #7FB3E8",
            marginBottom: "2rem",
          }}
        >
          {/* Background image */}
          <Image
            src="/images/notice-board.JPG"
            alt="Notice Board"
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          {/* Gradient overlay — darker left so text is readable */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,51,88,0.75), rgba(0,51,88,0.3))",
            }}
          />

          {/* Text layered on top, vertically centred, left-aligned */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 2.5rem",
            }}
          >
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              Notice Board
            </h1>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>
              Latest announcements from Brainstorm Academy
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#7FB3E8]/30 border-t-[#7FB3E8] rounded-full animate-spin" />
          </div>
        )}

        {!loading && notices.length === 0 && (
          <div className="text-center py-20 text-[#42576E]">
            No notices at this time. Check back later.
          </div>
        )}

        <div className="space-y-4">
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              style={{
                background: "#B8D9F5",
                border: "1px solid #7FB3E8",
                borderRadius: "16px",
              }}
              className="p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-bold text-white bg-[#2dbcfe] rounded-full w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                    {index === 0 ? "NEW" : index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-[#003358] mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-[#42576E] text-sm leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#42576E] shrink-0 mt-1">
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
