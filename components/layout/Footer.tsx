import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Faculty", href: "/faculty" },
  { label: "Courses", href: "/course" },
  { label: "Notice Board", href: "/notice" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const contactInfo = {
  address: "Brainstorm Academy, Your City, State – 000000",
  phones: ["+91 98765 43210", "+91 91234 56789"],
  emails: ["info@brainstormacademy.in", "admissions@brainstormacademy.in"],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-1 w-fit">
              <span className="text-2xl font-extrabold text-blue-400 tracking-tight">
                Brainstorm
              </span>
              <span className="text-2xl font-extrabold text-orange-400 tracking-tight">
                Academy
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Empowering students with quality education, expert guidance, and a
              passion for excellence. Your success is our mission.
            </p>
            {/* Social placeholders */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
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
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-orange-500 text-xs">▶</span>
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
                  className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5"
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
                  {contactInfo.address}
                </span>
              </li>

              {/* Phone numbers */}
              {contactInfo.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400 flex-shrink-0"
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
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
                  >
                    {phone}
                  </a>
                </li>
              ))}

              {/* Email addresses */}
              {contactInfo.emails.map((email) => (
                <li key={email} className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-400 flex-shrink-0"
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
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 break-all"
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
          <p className="text-xs text-gray-500 text-center sm:text-left">
            &copy; {currentYear} Brainstorm Academy. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Designed with ❤️ for education
          </p>
        </div>
      </div>
    </footer>
  );
}
