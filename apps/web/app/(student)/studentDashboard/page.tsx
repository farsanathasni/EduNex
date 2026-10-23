
"use client";

import Link from "next/link";
import PageHeader from "@/app/ui/pageHeader";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/app/ui/button";

const stats = [
  {
    title: "Study Materials",
    value: "24",
    icon: "📚",
    color: "bg-primary-subtle text-primary",
    href: "/student/materials",
  },
  {
    title: "Upcoming Events",
    value: "3",
    icon: "📅",
    color: "bg-secondary text-secondary-foreground",
    href: "/student/events",
  },
  {
    title: "My Clubs",
    value: "2",
    icon: "🎭",
    color: "bg-accent-subtle text-accent",
    href: "/student",
  },
  {
    title: "Pending Issues",
    value: "1",
    icon: "🛠️",
    color: "bg-secondary text-text-muted",
    href: "/student/issues",
  },
];

const events = [
  {
    title: "Tech Fest 2026",
    date: "18",
    month: "OCT",
    category: "Technology",
    color: "bg-primary-subtle text-primary",
  },
  {
    title: "Arts & Cultural Day",
    date: "22",
    month: "OCT",
    category: "Cultural",
    color: "bg-accent-subtle text-accent",
  },
  {
    title: "Project Exhibition",
    date: "26",
    month: "OCT",
    category: "Academic",
    color: "bg-secondary text-secondary-foreground",
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
    description: "Explore clubs and submit your membership request.",
    date: "2 days ago",
    icon: "🎭",
    href: "/student/clubs",
  },
];  

const quickActions = [
  {
    label: "Study Materials",
    icon: "📖",
    href: "/student/materials",
  },
  {
    label: "Campus Events",
    icon: "🗓️",
    href: "/student/events",
  },
  {
    label: "Join a Club",
    icon: "🎭",
    href: "/",
  },
  {
    label: "Report an Issue",
    icon: "🛠️",
    href: "/student/issues",
  },
];

const menuItems = [
  { icon: "▦", label: "Dashboard", href: "/student" },
  { icon: "📚", label: "Study Materials", href: "/student/materials" },
  { icon: "📅", label: "Campus Events", href: "/student/events" },
  { icon: "🎭", label: "Clubs", href: "/student" },
  { icon: "👥", label: "Study Groups", href: "/student/groups" },
  { icon: "🛠️", label: "Report an Issue", href: "/student/issues" },
  { icon: "🔎", label: "Lost & Found", href: "/student/lost-found" },
];

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const studentName = session?.user?.name || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <Link href="/student" className="flex items-center gap-3 px-6 py-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
              E
            </span>

            <span className="text-2xl font-bold">
              Edu<span className="text-primary">Nex</span>
            </span>
          </Link>

          <div className="px-4">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-text-subtle">
              Main Menu
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/student"
                    ? pathname === "/student"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-subtle text-primary"
                        : "text-text-muted hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar help */}
          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-inkwell p-4 text-text-inverse">
              <p className="font-semibold">Need help?</p>

              <p className="mt-2 text-xs leading-5 opacity-80">
                Have a campus problem? Report it and follow its status.
              </p>

              <Link
                href="/student/issues"
                className="mt-4 inline-block rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-secondary"
              >
                Report an issue
              </Link>
            </div>

            <Link
              href="/"
              className="mt-4 block rounded-xl px-4 py-3 text-sm text-text-muted hover:bg-secondary"
            >
              ← Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main id="dashboard" className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/95 px-5 py-4 backdrop-blur sm:px-8">
            <div>
              <p className="text-xs text-text-muted">
                EduNex / Student
              </p>

              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/student/my-memberships"
                aria-label="My club memberships"
                title="My club memberships"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:bg-secondary"
              >
                🎭
              </Link>

              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:bg-secondary"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>

              <Button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-xl"
              >
                {isSigningOut ? "Signing out..." : "Logout"}
              </Button>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary"
                title={studentName}
              >
                {isPending ? "..." : studentInitial}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
              <div className="relative z-10 max-w-2xl">
                <p className="text-sm font-medium opacity-80">
                  CAMPUS LIFE ✨
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Welcome back, {isPending ? "Loading..." : studentName}!
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 opacity-90 sm:text-base">
                  Your campus life, all in one place. Explore learning
                  resources, stay updated, discover clubs, and make
                  the most of your day.
                </p>

                <Link
                  href="/student"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary"
                >
                  Explore Clubs <span>→</span>
                </Link>
              </div>

              <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">
                🎓
              </div>
            </section>

            {/* Statistics */}
            <section>
              <PageHeader
                title="Campus Overview"
                description="A quick look at your campus activities."
              />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className="block rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-muted">
                        {stat.title}
                      </p>

                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}
                      >
                        {stat.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-xs text-text-subtle">
                      View details →
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Events and Announcements */}
            <div className="grid gap-8 xl:grid-cols-5">
              {/* Events */}
              <section id="events" className="xl:col-span-3">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <PageHeader
                    title="Upcoming Events"
                    description="Don't miss what's happening on campus."
                  />

                  <Link
                    href="/student/events"
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    View all →
                  </Link>
                </div>

                <div className="space-y-3">
                  {events.map((event) => (
                    <article
                      key={event.title}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-primary hover:shadow-md sm:p-5"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary">
                        <span className="text-xl font-bold">
                          {event.date}
                        </span>

                        <span className="text-xs font-semibold">
                          {event.month}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">
                          {event.title}
                        </h3>

                        <p className="mt-1 text-sm text-text-muted">
                          Campus Event
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${event.color}`}
                        >
                          {event.category}
                        </span>
                      </div>

                      <Link
                        href="/student/events"
                        aria-label={`View ${event.title}`}
                        className="text-xl text-text-subtle hover:text-primary"
                      >
                        →
                      </Link>
                    </article>
                  ))}
                </div>
              </section>

              {/* Announcements */}
              <section className="xl:col-span-2">
                <PageHeader
                  title="Announcements"
                  description="Latest campus updates."
                />

                <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
                  {announcements.map((announcement, index) => (
                    <article
                      key={announcement.title}
                      className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${
                        index !== announcements.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                        {announcement.icon}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold leading-5">
                          {announcement.href ? (
                            <Link
                              href={announcement.href}
                              className="hover:text-primary"
                            >
                              {announcement.title}
                            </Link>
                          ) : (
                            announcement.title
                          )}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          {announcement.description}
                        </p>

                        <p className="mt-2 text-xs text-primary">
                          {announcement.date}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Clubs highlight */}
            <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-subtle text-2xl">
                    🎭
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Find Your Community
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
                      Discover campus clubs, explore their events and
                      announcements, and request to become a member.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/student"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Explore Clubs →
                  </Link>

                  <Link
                    href="/student/my-memberships"
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
                  >
                    My Memberships
                  </Link>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <PageHeader
                title="Quick Actions"
                description="Jump directly to a campus service."
              />

              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-start rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"
                  >
                    <span className="text-3xl">
                      {action.icon}
                    </span>

                    <span className="mt-4 text-sm font-semibold">
                      {action.label}
                    </span>

                    <span className="mt-2 text-sm font-semibold text-primary">
                      Open →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border pt-6 text-center text-sm text-text-muted">
              © {new Date().getFullYear()} EduNex · Your campus, connected.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
