
import Link from "next/link";

const features = [
  {
    icon: "📚",
    title: "Study Materials",
    description:
      "Access notes, learning resources, and study materials shared by your faculty.",
  },
  {
    icon: "📅",
    title: "Campus Events",
    description:
      "Discover upcoming campus events, club activities, and student programs.",
  },
  {
    icon: "🎭",
    title: "Clubs & Activities",
    description:
      "Explore campus clubs, request membership, and participate in activities.",
  },
  {
    icon: "💬",
    title: "Study Groups",
    description:
      "Connect with classmates, create study groups, and learn together.",
  },
  {
    icon: "🛠️",
    title: "Issue Reporting",
    description:
      "Report campus-related issues and track their status in one place.",
  },
  {
    icon: "🔎",
    title: "Lost & Found",
    description:
      "Report lost belongings and browse items reported found on campus.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0FDFA] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-xl font-bold text-white">
              E
            </span>
            <span className="text-2xl font-bold tracking-tight">
              Edu<span className="text-cyan-600">Nex</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-cyan-700">
              Home
            </a>
            <a href="#features" className="transition hover:text-cyan-700">
              Features
            </a>
            <a href="#about" className="transition hover:text-cyan-700">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden px-6 py-20 sm:py-28 lg:px-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Your campus, connected
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              One platform.
              <br />
              Endless campus{" "}
              <span className="text-cyan-600">possibilities.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Welcome to EduNex — your digital campus for learning resources,
              events, clubs, study groups, and campus services, all in one
              convenient place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-600/20 transition hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                Get Started
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Easy access to resources
              </span>
              <span className="flex items-center gap-2">
                <span className="text-teal-600">✓</span>
                Connected campus community
              </span>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-4 rounded-[2rem] bg-cyan-300/30 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-cyan-900/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm text-slate-500">Welcome to</p>
                  <h2 className="mt-1 text-xl font-bold">Your Campus Hub</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-2xl">
                  🎓
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-cyan-50 p-5">
                  <span className="text-3xl">📚</span>
                  <p className="mt-4 font-semibold">Learning</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Resources & notes
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-5">
                  <span className="text-3xl">🎭</span>
                  <p className="mt-4 font-semibold">Community</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Clubs & activities
                  </p>
                </div>
                <div className="rounded-2xl bg-teal-50 p-5">
                  <span className="text-3xl">📅</span>
                  <p className="mt-4 font-semibold">Events</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Campus happenings
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5">
                  <span className="text-3xl">👥</span>
                  <p className="mt-4 font-semibold">Study Groups</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Learn together
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  ✨
                </div>
                <div>
                  <p className="font-semibold">Everything in one place</p>
                  <p className="mt-1 text-sm text-slate-300">
                    A smarter way to experience campus life.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-1/3 hidden rounded-xl border border-slate-100 bg-white p-3 shadow-lg sm:block">
              <span className="text-xl">💡</span>
            </div>
            <div className="absolute -right-3 bottom-10 hidden rounded-xl border border-slate-100 bg-white p-3 shadow-lg sm:block">
              <span className="text-xl">🚀</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
              What EduNex offers
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your campus needs
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Explore the tools that help students stay informed, connected,
              and involved in campus life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-900/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-3xl transition group-hover:bg-cyan-100">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-7 py-12 text-center sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <span className="text-4xl">🎓</span>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              Make your campus experience better.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              Join your campus community on EduNex and keep your academic
              resources and campus activities within reach.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-white transition hover:bg-cyan-400"
            >
              Create Your Account
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="text-xl font-bold">
            Edu<span className="text-cyan-600">Nex</span>
          </Link>
          <p className="text-center text-sm text-slate-500">
            Connecting students, faculty, and campus communities.
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EduNex
          </p>
        </div>
      </footer>
    </main>
  );
}
