
import Link from "next/link";

const stats = [
  {
    title: "Study Materials",
    value: "24",
    icon: "📚",
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Upcoming Events",
    value: "3",
    icon: "📅",
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "My Clubs",
    value: "2",
    icon: "🎭",
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Pending Issues",
    value: "1",
    icon: "🛠️",
    color: "bg-amber-50 text-amber-700",
  },
];

const events = [
  {
    title: "Tech Fest 2026",
    date: "18",
    month: "OCT",
    category: "Technology",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Arts & Cultural Day",
    date: "22",
    month: "OCT",
    category: "Cultural",
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Project Exhibition",
    date: "26",
    month: "OCT",
    category: "Academic",
    color: "bg-amber-100 text-amber-700",
  },
];

const announcements = [
  {
    title: "Semester examination schedule",
    description: "Check the examination dates and prepare accordingly.",
    date: "Today",
    icon: "📢",
  },
  {
    title: "Study materials updated",
    description: "New learning resources are available for students.",
    date: "Yesterday",
    icon: "📚",
  },
  {
    title: "Club membership open",
    description: "Submit your membership request for available clubs.",
    date: "2 days ago",
    icon: "🎭",
  },
];

const quickActions = [
  { label: "Study Materials", icon: "📖", href: "#materials" },
  { label: "Campus Events", icon: "🗓️", href: "#events" },
  { label: "Report an Issue", icon: "🛠️", href: "#issues" },
  { label: "Lost & Found", icon: "🔎", href: "#lost-found" },
];

const menuItems = [
  { icon: "▦", label: "Dashboard", href: "#dashboard", active: true },
  { icon: "📚", label: "Study Materials", href: "#materials", active: false },
  { icon: "📅", label: "Campus Events", href: "#events", active: false },
  { icon: "🎭", label: "Clubs", href: "#clubs", active: false },
  { icon: "👥", label: "Study Groups", href: "#groups", active: false },
  { icon: "🛠️", label: "Report an Issue", href: "#issues", active: false },
  { icon: "🔎", label: "Lost & Found", href: "#lost-found", active: false },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <Link href="/" className="flex items-center gap-3 px-6 py-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-xl font-bold text-white">
              E
            </span>

            <span className="text-2xl font-bold">
              Edu<span className="text-cyan-600">Nex</span>
            </span>
          </Link>

          <div className="px-4">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-cyan-700"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              <p className="font-semibold">Need help?</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                Have a campus problem? Report it and follow its status.
              </p>

              <a
                href="#issues"
                className="mt-4 inline-block rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-50"
              >
                Report an issue
              </a>
            </div>

            <Link
              href="/"
              className="mt-4 block rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-50"
            >
              ← Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main id="dashboard" className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
            <div>
              <p className="text-xs text-slate-500">EduNex / Student</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">Student</p>
                  <p className="text-xs text-slate-500">Student Account</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700">
                  S
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-cyan-700 via-cyan-600 to-teal-500 p-6 text-white sm:p-9">
              <div className="relative z-10 max-w-2xl">
                <p className="text-sm font-medium text-cyan-100">
                  CAMPUS LIFE ✨
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Welcome back, Student!
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-cyan-50 sm:text-base">
                  Your campus life, all in one place. Explore learning
                  resources, stay updated, and make the most of your day.
                </p>

                <a
                  href="#events"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50"
                >
                  Explore Campus <span>→</span>
                </a>
              </div>

              <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">
                🎓
              </div>
            </section>

            {/* Statistics */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-bold">Campus Overview</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A quick look at your campus activities
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${stat.color}`}
                      >
                        {stat.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Sample dashboard data
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Events and Announcements */}
            <div className="grid gap-8 xl:grid-cols-5">
              <section id="events" className="xl:col-span-3">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Upcoming Events</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Do not miss what is happening on campus
                    </p>
                  </div>

                  <a
                    href="#events"
                    className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                  >
                    View all →
                  </a>
                </div>

                <div className="space-y-3">
                  {events.map((event) => (
                    <article
                      key={event.title}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-md sm:p-5"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-50 text-cyan-800">
                        <span className="text-xl font-bold">{event.date}</span>
                        <span className="text-xs font-semibold">
                          {event.month}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Campus Event
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${event.color}`}
                        >
                          {event.category}
                        </span>
                      </div>

                      <span className="text-xl text-slate-400">→</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="xl:col-span-2">
                <div className="mb-5">
                  <h2 className="text-lg font-bold">Announcements</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest campus updates
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  {announcements.map((announcement, index) => (
                    <article
                      key={announcement.title}
                      className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${
                        index !== announcements.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl">
                        {announcement.icon}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold leading-5">
                          {announcement.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {announcement.description}
                        </p>

                        <p className="mt-2 text-xs text-cyan-700">
                          {announcement.date}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Quick Actions */}
            <section id="materials">
              <div className="mb-5">
                <h2 className="text-lg font-bold">Quick Actions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump directly to a campus service
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-lg"
                  >
                    <span className="text-3xl">{action.icon}</span>
                    <span className="mt-4 text-sm font-semibold">
                      {action.label}
                    </span>
                    <span className="mt-2 text-sm text-cyan-700">
                      Open →
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} EduNex · Your campus, connected.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

""