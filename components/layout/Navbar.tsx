"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Faculty", href: "/faculty" },
  { label: "Notice", href: "/notice" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Course", href: "/course" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={closeMenu}
          >
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight">
              Brainstorm
            </span>
            <span className="text-2xl font-extrabold text-orange-500 tracking-tight">
              Academy
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? "bg-blue-700 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/auth/student-login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-95 transition-all duration-200 shadow-sm"
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
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(link.href)
                        ? "bg-blue-700 text-white"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile Student Login */}
              <li className="mt-2 px-4">
                <Link
                  href="/auth/student-login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-5 py-2 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 active:scale-95 transition-all duration-200 shadow-sm"
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
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
