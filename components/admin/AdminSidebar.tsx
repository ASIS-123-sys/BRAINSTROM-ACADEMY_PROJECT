"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "📊" },
  { label: "Students", href: "/admin/dashboard#students", icon: "👥" },
  { label: "Faculty", href: "/admin/dashboard#faculty", icon: "👨‍🏫" },
  { label: "Notices", href: "/admin/dashboard#notices", icon: "📢" },
  { label: "Gallery", href: "/admin/dashboard#gallery", icon: "🖼️" },
  { label: "Fees", href: "/admin/dashboard#fees", icon: "💰" },
  { label: "Scores", href: "/admin/dashboard#scores", icon: "📝" },
  { label: "Top Scorers", href: "/admin/top-scorers", icon: "🏆" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentHash, setCurrentHash] = React.useState("");

  React.useEffect(() => {
    // Set initial hash asynchronously to avoid cascading renders warning
    const timer = setTimeout(() => {
      setCurrentHash(window.location.hash);
    }, 0);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Determine current page name for top bar based on pathname and hash
  const currentItem = navItems.find((item) => {
    if (item.href.includes("#")) {
      const [path, hash] = item.href.split("#");
      return pathname === path && currentHash === `#${hash}`;
    }
    return (
      pathname === item.href && (currentHash === "" || currentHash === "#")
    );
  });
  const pageTitle = currentItem ? currentItem.label : "Admin Panel";

  const sidebarStyle = {
    background: "#B8D9F5",
    borderRight: "1px solid #7FB3E8",
  };

  return (
    <div
      className={`min-h-screen bg-[#F7FAFD] text-[#003358] flex ${poppins.className}`}
    >
      {/* Fixed Sidebar */}
      <aside
        style={sidebarStyle}
        className="w-[260px] h-screen sticky top-0 flex flex-col justify-between p-6 shrink-0 z-30"
      >
        {/* Top Branding */}
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-bold text-[#003358] tracking-tight">
              Brainstorm Academy
            </h1>
            <p className="text-xs text-[#42576E] font-medium tracking-widest uppercase mt-1">
              Admin Panel
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = (() => {
                if (item.href.includes("#")) {
                  const [path, hash] = item.href.split("#");
                  return pathname === path && currentHash === `#${hash}`;
                }
                return (
                  pathname === item.href &&
                  (currentHash === "" || currentHash === "#")
                );
              })();
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-[#2dbcfe] text-[#003358] border border-[#7FB3E8] shadow-sm"
                      : "text-[#42576E] hover:text-[#003358] hover:bg-[#9FC7F0] border border-transparent"
                  }`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div>
          <button
            onClick={async () => {
              try {
                const supabase = createClient();
                await supabase.auth.signOut();
              } catch (err) {
                // ignore sign out errors
              }
              router.push("/");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 shadow-sm cursor-pointer"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar */}
        <header className="px-8 py-5 border-b border-[#7FB3E8] bg-[#F7FAFD] flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-lg font-bold text-[#003358] tracking-tight">
            {pageTitle}
          </h2>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-[#42576E] font-semibold tracking-wider uppercase">
              Live Portal
            </span>
          </div>
        </header>

        {/* Dynamic Nested Content Wrapper */}
        <main className="p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}
