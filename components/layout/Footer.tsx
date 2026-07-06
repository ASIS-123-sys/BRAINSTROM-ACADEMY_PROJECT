"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings } from "@/lib/api/settings";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Faculty", href: "/faculty" },
  { label: "Courses", href: "/course" },
  { label: "Notice Board", href: "/notice" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await getSettings();
      setSettings(data);
    }

    loadSettings();
  }, []);

  const handleCopyrightClick = () => {
    clickCount.current += 1;

    if (clickCount.current >= 3) {
      router.push("/auth/admin-login");
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      return;
    }

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1500);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-1 w-fit">
              <span className="text-2xl font-extrabold text-[#2dbcfe] tracking-tight">
                Brainstorm
              </span>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Academy
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Empowering students with quality education, expert guidance, and a
              passion for excellence. Your success is our mission.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#2dbcfe] transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-[#2dbcfe] text-xs">▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              {/* Address */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#2dbcfe] shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-400 leading-relaxed">
                  {settings?.address ||
                    "Brainstorm Academy, Your City, State – 000000"}
                </span>
              </li>

              {/* Phone numbers */}
              {(settings?.phone1 ? [settings.phone1] : [])
                .concat(settings?.phone2 ? [settings.phone2] : [])
                .map((phone) => (
                  <li key={phone} className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#2dbcfe] shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="text-sm text-gray-400 hover:text-[#2dbcfe] transition-colors duration-200"
                    >
                      {phone}
                    </a>
                  </li>
                ))}

              {/* Email addresses */}
              {(settings?.email1 ? [settings.email1] : [])
                .concat(settings?.email2 ? [settings.email2] : [])
                .map((email) => (
                  <li key={email} className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#2dbcfe] shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-gray-400 hover:text-[#2dbcfe] transition-colors duration-200 break-all"
                    >
                      {email}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            onClick={handleCopyrightClick}
            className="text-xs text-gray-500 text-center sm:text-left select-none"
          >
            &copy; {currentYear} Brainstorm Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
