
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

const campusServices = [
  {
    icon: "📚",
    title: "Learning",
    description: "Resources & notes",
    color: "bg-primary-subtle text-primary",
  },
  {
    icon: "🎭",
    title: "Community",
    description: "Clubs & activities",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: "📅",
    title: "Events",
    description: "Campus happenings",
    color: "bg-accent-subtle text-accent",
  },
  {
    icon: "👥",
    title: "Study Groups",
    description: "Learn together",
    color: "bg-secondary text-secondary-foreground",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
              E
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Edu<span className="text-primary">Nex</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-text-muted md:flex">
            <a href="#home" className="transition hover:text-primary">
              Home
            </a>
            <a href="#features" className="transition hover:text-primary">
              Features
            </a>
            <a href="#about" className="transition hover:text-primary">
              About
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-secondary hover:text-primary sm:px-4"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover sm:px-4"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative scroll-mt-24 overflow-hidden px-6 py-20 sm:py-28 lg:px-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-subtle blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-accent-subtle blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Your campus, connected
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              One platform.
              <br />
              Endless campus{" "}
              <span className="text-primary">possibilities.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Welcome to EduNex — your digital campus for learning resources,
              events, clubs, study groups, and campus services, all in one
              convenient place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Get Started
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-text-muted transition hover:border-primary hover:text-primary"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <span className="font-bold text-primary">✓</span>
                Easy access to resources
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-primary">✓</span>
                Connected campus community
              </span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-4 rounded-3xl bg-primary-subtle blur-2xl" />

            <div className="relative rounded-3xl border border-border bg-surface p-5 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-border-subtle pb-5">
                <div>
                  <p className="text-sm text-text-muted">Welcome to</p>
                  <h2 className="mt-1 text-xl font-bold">
                    Your Campus Hub
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-2xl">
                  🎓
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {campusServices.map((service) => (
                  <div
                    key={service.title}
                    className={`rounded-2xl p-5 ${service.color}`}
                  >
                    <span className="text-3xl">{service.icon}</span>

                    <p className="mt-4 font-semibold">{service.title}</p>

                    <p className="mt-1 text-sm opacity-80">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-inkwell p-5 text-text-inverse">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  ✨
                </div>

                <div>
                  <p className="font-semibold">
                    Everything in one place
                  </p>

                  <p className="mt-1 text-sm opacity-75">
                    A smarter way to experience campus life.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-1/3 hidden rounded-xl border border-border bg-surface p-3 shadow-lg sm:block">
              <span className="text-xl">💡</span>
            </div>

            <div className="absolute -right-3 bottom-10 hidden rounded-xl border border-border bg-surface p-3 shadow-lg sm:block">
              <span className="text-xl">🚀</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 border-y border-border-subtle bg-surface px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              What EduNex offers
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your campus needs
            </h2>

            <p className="mt-4 leading-7 text-text-muted">
              Explore the tools that help students stay informed, connected,
              and involved in campus life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-3xl transition group-hover:bg-secondary">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-text-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / Call to Action */}
      <section
        id="about"
        className="scroll-mt-20 px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-7 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <span className="text-4xl">🎓</span>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Make your campus experience better.
            </h2>

            <p className="mt-5 leading-7 opacity-85">
              Join your campus community on EduNex and keep your academic
              resources and campus activities within reach.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 font-semibold text-primary transition hover:bg-secondary"
            >
              Create Your Account
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-6 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="text-xl font-bold">
            Edu<span className="text-primary">Nex</span>
          </Link>

          <p className="text-center text-sm text-text-muted">
            Connecting students, faculty, and campus communities.
          </p>

          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} EduNex
          </p>
        </div>
      </footer>
    </main>
  );
}
