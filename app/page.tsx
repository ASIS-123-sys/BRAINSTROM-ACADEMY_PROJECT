import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardDivider, CardFooter } from "@/components/ui/Card";

export default function Home() {
  // 5 performers placeholder data
  const performers = [
    {
      name: "Aditya Patra",
      batch: "Class 12th Science",
      percentage: "98.2%",
      rank: "Rank 1",
      initials: "AP",
    },
    {
      name: "Subhashree Jena",
      batch: "Class 12th Commerce",
      percentage: "97.6%",
      rank: "Rank 2",
      initials: "SJ",
    },
    {
      name: "Rohan Kumar Sahu",
      batch: "Class 10th Board",
      percentage: "96.8%",
      rank: "Rank 5",
      initials: "RS",
    },
    {
      name: "Priyanka Maharana",
      batch: "PGDCA Computer",
      percentage: "95.5%",
      rank: "A+ Grade",
      initials: "PM",
    },
    {
      name: "Sourav K. Mohanty",
      batch: "Class 10th Board",
      percentage: "95.2%",
      rank: "Rank 10",
      initials: "SM",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-zinc-950 dark:to-zinc-950 py-20 md:py-32">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/5"></div>
        <div className="absolute top-20 left-10 -z-10 h-[250px] w-[250px] md:h-[300px] md:w-[300px] rounded-full bg-orange-400/10 blur-3xl dark:bg-orange-600/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <Badge variant="info" className="mb-4 shadow-sm">
                Leading Coaching Institute in Odisha
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
                  Brainstorm
                </span>{" "}
                <span className="text-orange-500">Academy</span>
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                Empowering Students Since Day One
              </p>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Discover a legacy of academic brilliance in Berhampur, Odisha. At Brainstorm Academy, we provide quality education, robust conceptual clarity, and comprehensive guidance for board prep, secondary school, and skill-oriented computer courses.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
                <Link href="/course" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/auth/student-login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Student Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Decorative Section (Stats / Highlights) */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-md mx-auto lg:max-w-none">
              <Card accent="blue" className="shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose Brainstorm?
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg">
                    <span className="block text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                      10+
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Years Exp</span>
                  </div>
                  <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg">
                    <span className="block text-2xl font-extrabold text-orange-500">
                      1.5k+
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Alumni</span>
                  </div>
                  <div className="p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg">
                    <span className="block text-2xl font-extrabold text-green-700 dark:text-green-400">
                      98%
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Pass Rate</span>
                  </div>
                </div>
                <CardDivider />
                <ul className="space-y-3">
                  {[
                    "Experienced and supportive mentors",
                    "Well-structured study materials",
                    "Regular mock tests and reviews",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE SECTION */}
      <section className="py-20 bg-gray-50/30 dark:bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="warning" className="mb-3">
              Academic & Professional Programs
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Our Comprehensive Courses
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Unlock your potential with our meticulously structured curricula tailored for all academic and vocational levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Computer Courses */}
            <Card accent="blue" className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2} />
                    <path d="M8 21h8" strokeWidth={2} strokeLinecap="round" />
                    <path d="M12 17v4" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Computer Courses</h3>
                  <p className="text-xs text-gray-500">Skill Development</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["ADCA", "CCA", "DCA", "PGDCA", "Tally ERP 9", "Spoken English"].map((course) => (
                  <Badge key={course} variant="info">
                    {course}
                  </Badge>
                ))}
              </div>

              <CardDivider />

              <div className="flex-1 space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Campus Facilities
                </h4>
                <ul className="space-y-2">
                  {["Seminars", "Exam", "Syllabus Material", "Kit Bag", "ID Card", "AC Class Room"].map((facility) => (
                    <li key={facility} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="pt-4 mt-6">
                <Link href="/course" className="w-full">
                  <Button variant="ghost" fullWidth>
                    Program Details &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Column 2: 12th Grade */}
            <Card accent="orange" className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth={2} />
                    <path d="M3 14v7a1 1 0 001 1h2a1 1 0 001-1v-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">12th Grade</h3>
                  <p className="text-xs text-gray-500">Board Preparation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {["Science", "Commerce", "Arts"].map((stream) => (
                  <Badge key={stream} variant="warning">
                    {stream}
                  </Badge>
                ))}
              </div>

              <CardDivider />

              <div className="flex-1 space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Coaching Features
                </h4>
                <ul className="space-y-2">
                  {[
                    "Experienced Faculty",
                    "Fundamental Clearing Classes",
                    "Doubt Clearing",
                    "Monthly Test",
                    "Class Examination Test",
                    "Crash Course",
                  ].map((facility) => (
                    <li key={facility} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="pt-4 mt-6">
                <Link href="/course" className="w-full">
                  <Button variant="ghost" fullWidth>
                    Program Details &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Column 3: 5th to 10th Grade */}
            <Card accent="blue" className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">5th to 10th Grade</h3>
                  <p className="text-xs text-gray-500">School Foundation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <Badge variant="success">All Subjects</Badge>
              </div>

              <CardDivider />

              <div className="flex-1 space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Academic Framework
                </h4>
                <ul className="space-y-2">
                  {[
                    "Monthly Test",
                    "Sunday Special Classes",
                    "Weekly Test",
                    "Surprise Test",
                    "Doubt Session",
                    "Board Exam Preparation",
                  ].map((facility) => (
                    <li key={facility} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="pt-4 mt-6">
                <Link href="/course" className="w-full">
                  <Button variant="ghost" fullWidth>
                    Program Details &rarr;
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. STUDENT EXCELLENCE SECTION */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="success" className="mb-3">
              Wall of Fame
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Our Top Performers
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Celebrating our students who demonstrated commitment and reached new levels of academic distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {performers.map((student) => (
              <Card key={student.name} className="flex flex-col items-center text-center hover:scale-105 hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-600 dark:border-t-blue-500">
                {/* Grey circle for pic */}
                <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border-4 border-gray-100 dark:border-zinc-900 shadow-inner">
                  <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                    {student.initials}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                  {student.name}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                  {student.batch}
                </p>
                
                <CardDivider />
                
                <div className="text-2xl font-black text-blue-700 dark:text-blue-400">
                  {student.percentage}
                </div>
                <div className="mt-2">
                  <Badge variant={student.rank.includes("1") || student.rank.includes("2") ? "success" : "info"}>
                    {student.rank}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section className="py-20 bg-gray-50/30 dark:bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <Badge variant="neutral" className="mb-3">
                Our Legacy
              </Badge>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                About Us
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded with a strong commitment to educational enrichment, Brainstorm Academy has grown to become Berhampur's trusted coaching institute. We believe that conceptual foundations and persistent efforts pave the way for success. 
              </p>
              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our curriculum bridges the gap between text books and practical learning. By integrating periodic examinations, experienced faculties, and modern classrooms with custom study packages, we prepare our students to excel under pressure while maintaining a deep love for active learning.
              </p>
              <div className="mt-8 flex gap-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-orange-500">100%</span>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Syllabus Covered</span>
                </div>
                <div className="border-l border-gray-200 dark:border-zinc-800"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">1-on-1</span>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Doubt Clearing</span>
                </div>
              </div>
            </div>

            {/* Right Card: Owner details placeholder */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              <Card accent="orange" className="shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 dark:bg-orange-950/10 rounded-full blur-2xl -z-10"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Founder's Message
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed mb-6">
                  "At Brainstorm Academy, our core philosophy is simple: empower the student from day one. We ensure that our training goes beyond memorization to instil analytical thinking and lifelong values. Our success is measured by the progress and smiles of our learners."
                </p>
                <CardDivider />
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-200 dark:border-orange-900/40">
                    AK
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-950 dark:text-white text-sm">
                      Mr. Asis Kumar
                    </h5>
                    <p className="text-xs text-gray-500">
                      Founder & Director, Brainstorm Academy
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="info" className="mb-3">
              Reach Out
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Have questions about admissions, fees, or course structures? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Columns: Contact cards */}
            <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
              {/* Phones Card */}
              <Card className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-100 dark:border-orange-900/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">Phone Numbers</h4>
                  <p className="text-sm text-gray-500">Call us for immediate assistance:</p>
                  <div className="flex flex-col gap-1 pt-1.5">
                    <a href="tel:+910093582535" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base">
                      +91 00935 82535
                    </a>
                    <a href="tel:+912008548156" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base">
                      +91 20085 48156
                    </a>
                  </div>
                </div>
              </Card>

              {/* Emails Card */}
              <Card className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-900/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">Email Addresses</h4>
                  <p className="text-sm text-gray-500">Send us your queries anytime:</p>
                  <div className="flex flex-col gap-1 pt-1.5">
                    <a href="mailto:asissanoy4@gmail.com" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base break-all">
                      asissanoy4@gmail.com
                    </a>
                    <a href="mailto:brainstromacademy@gmail.com" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base break-all">
                      brainstromacademy@gmail.com
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Google Map Placeholder */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center group">
                {/* Grid Overlay background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  {/* Location Icon pin circle */}
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 border border-blue-100 dark:border-blue-900/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">
                    Interactive Google Map
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                    Brainstorm Academy Campus, Berhampur, Odisha, India
                  </p>
                  
                  <div className="mt-6">
                    <a
                      href="https://maps.google.com/?q=Brainstorm+Academy+Berhampur+Odisha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button variant="outline" size="md">
                        Get Directions on Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
