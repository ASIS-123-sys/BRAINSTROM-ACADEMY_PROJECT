"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Faculty", href: "/faculty" },
  { label: "Notice", href: "/notice" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Course", href: "/course" },
];

type SessionUser = {
  email?: string | null;
  user_metadata?: { full_name?: string; role?: string } | null;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Determine role — stored in user_metadata.role or check email domain
  const role = user?.user_metadata?.role ?? "student";
  const isAdmin = role === "admin" || !!user?.email?.endsWith("@brainstorm-admin.local");

  // Avatar initial: admin → "A", student → first letter of name or email
  const avatarInitial = isAdmin
    ? "A"
    : (
        user?.user_metadata?.full_name?.charAt(0) ||
        user?.email?.charAt(0) ||
        "S"
      ).toUpperCase();

  const dashboardHref = isAdmin ? "/admin/dashboard" : "/student/dashboard";

  const handleAvatarClick = () => {
    closeMenu();
    router.push(dashboardHref);
  };

  /* ── Avatar button (desktop + mobile reused) ── */
  const AvatarButton = () => (
    <button
      type="button"
      onClick={handleAvatarClick}
      title={isAdmin ? "Admin Dashboard" : "Student Dashboard"}
      className="
        w-9 h-9 rounded-full flex items-center justify-center
        bg-[#003358] text-white text-sm font-extrabold
        ring-2 ring-[#2dbcfe] ring-offset-1
        hover:bg-[#00497a] hover:ring-offset-2
        active:scale-95 transition-all duration-200
        shadow-md cursor-pointer select-none
      "
    >
      {avatarInitial}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#F7FAFD] shadow-sm border-b border-[#7FB3E8] text-[#111c2d]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            onClick={closeMenu}
          >
            <img
              src="/favicon.ico"
              alt="Brainstorm Academy Logo"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
            <span className="text-2xl font-extrabold text-[#003358] tracking-tight">
              Brainstorm
            </span>
            <span className="text-2xl font-extrabold text-[#2dbcfe] tracking-tight">
              Academy
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                    isActive(link.href)
                      ? "bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]"
                      : "text-[#42576E] hover:bg-[#B8D9F5] hover:text-[#003358]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — Login button OR Avatar */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <AvatarButton />
            ) : (
              <Link
                href="/auth/student-login"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#2dbcfe] text-[#003358] text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-[#42576E] hover:bg-[#B8D9F5] hover:text-[#003358] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2dbcfe]"
          >
            {isMenuOpen ? (
              /* X icon */
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`block px-4 py-2 rounded-md text-sm font-bold transition-colors duration-200 ${
                      isActive(link.href)
                        ? "bg-[#9FC7F0] text-[#003358] border border-[#7FB3E8]"
                        : "text-[#42576E] hover:bg-[#B8D9F5] hover:text-[#003358]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Mobile: Login button OR Avatar */}
              <li className="mt-2 px-4">
                {user ? (
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#003358] text-white text-sm font-bold hover:bg-[#00497a] active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#2dbcfe] text-[#003358] text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                      {avatarInitial}
                    </span>
                    {isAdmin ? "Go to Admin Dashboard" : "Go to Dashboard"}
                  </button>
                ) : (
                  <Link
                    href="/auth/student-login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full bg-[#2dbcfe] text-[#003358] text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm border border-[#003358]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Student Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
