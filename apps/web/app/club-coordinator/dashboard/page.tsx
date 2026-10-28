
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageHeader from "@/app/ui/pageHeader";
import { authClient } from "@/lib/auth-client";
import Button from "@/app/ui/button";

const stats = [
  {
    title: "Total Events",
    value: "24",
    icon: "📅",
    color: "bg-primary-subtle text-primary",
    href: "/club-coordinator/events",
  },
  {
    title: "Upcoming Events",
    value: "08",
    icon: "🎯",
    color: "bg-secondary text-secondary-foreground",
    href: "/club-coordinator/events",
  },
  {
    title: "Pending Requests",
    value: "03",
    icon: "⏳",
    color: "bg-accent-subtle text-accent",
    href: "/club-coordinator/request-event",
  },
  {
    title: "Events Completed",
    value: "16",
    icon: "✅",
    color: "bg-secondary text-text-muted",
    href: "/club-coordinator/events",
  },
];

const events = [
  {
    title: "TechFest 2026",
    date: "15",
    month: "NOV",
    category: "Technical",
    status: "Approved",
    color: "bg-primary-subtle text-primary",
  },
  {
    title: "Cultural Fusion",
    date: "20",
    month: "NOV",
    category: "Cultural",
    status: "Pending",
    color: "bg-accent-subtle text-accent",
  },
  {
    title: "Campus Football Cup",
    date: "25",
    month: "NOV",
    category: "Sports",
    status: "Approved",
    color: "bg-secondary text-secondary-foreground",
  },
];

const activities = [
  {
    title: "Event proposal submitted",
    description: "Your event proposal was submitted for approval.",
    date: "2 hours ago",
    icon: "📝",
  },
  {
    title: "Student membership updated",
    description: "A membership request was updated.",
    date: "Yesterday",
    icon: "👥",
  },
  {
    title: "Event details updated",
    description: "You updated your event information.",
    date: "2 days ago",
    icon: "📅",
  },
];

const quickActions = [
  {
    label: "View Events",
    description: "Manage your club events",
    icon: "📅",
    href: "/club-coordinator/events",
  },
  {
    label: "Request an Event",
    description: "Submit a new event proposal",
    icon: "📝",
    href: "/club-coordinator/request-event",
  },
];

const menuItems = [
  {
    icon: "▦",
    label: "Dashboard",
    href: "/club-coordinator/dashboard",
  },
  {
    icon: "📅",
    label: "My Events",
    href: "/club-coordinator/events",
  },
  {
    icon: "📝",
    label: "Request Event",
    href: "/club-coordinator/request-event",
  },
];

export default function CoordinatorDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const coordinatorName = session?.user?.name || "Coordinator";
  const coordinatorInitial = coordinatorName.charAt(0).toUpperCase();

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
          <Link
            href="/club-coordinator/dashboard"
            className="flex items-center gap-3 px-6 py-7"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
              E
            </span>

            <span className="text-2xl font-bold">
              Edu<span className="text-primary">Nex</span>
            </span>
          </Link>

          <div className="px-4">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-text-subtle">
              Coordinator Menu
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

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

          {/* Sidebar Help */}
          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-inkwell p-4 text-text-inverse">
              <p className="font-semibold">Plan an Event?</p>

              <p className="mt-2 text-xs leading-5 opacity-80">
                Organize campus activities and submit event proposals for
                approval.
              </p>

              <Link
                href="/club-coordinator/request-event"
                className="mt-4 inline-block rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-secondary"
              >
                Request an event
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
        <main className="min-w-0 flex-1">
          {/* Top Navbar */}
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/95 px-5 py-4 backdrop-blur sm:px-8">
            <div>
              <p className="text-xs text-text-muted">
                EduNex / Club Coordinator
              </p>

              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Switch to Student */}
              <Button
                type="button"
                onClick={() => router.push("/studentDashboard")}
                className="rounded-xl bg-primary px-4 py-2 "              >
                <span className="sm:hidden">← Student</span>
                <span className="hidden sm:inline">
                  ← Switch to Student
                </span>
              </Button>

              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border transition hover:bg-secondary"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </button>

              {/* Logout */}
              <Button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-xl border border-border px-3 py-2 "
              >
                {isSigningOut ? "Signing out..." : "Logout"}
              </Button>

              {/* Profile */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary"
                title={coordinatorName}
              >
                {isPending ? "..." : coordinatorInitial}
              </div>
            </div>
          </header>

          {/* Dashboard Sections */}
          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
              <div className="relative z-10 max-w-2xl">
                <p className="text-sm font-medium opacity-80">
                  CLUB MANAGEMENT ✨
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Welcome back, {isPending ? "Loading..." : coordinatorName}!
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 opacity-90 sm:text-base">
                  Manage your club activities, organize campus events, and
                  keep students informed. Everything you need to coordinate
                  your club is in one place.
                </p>

                <Link
                  href="/club-coordinator/request-event"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary"
                >
                  Request an Event <span>→</span>
                </Link>
              </div>

              <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">
                🎓
              </div>
            </section>

            {/* Statistics */}
            <section>
              <PageHeader
                title="Club Overview"
                description="A quick look at your club activities."
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

                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>

                    <p className="mt-2 text-xs text-text-subtle">
                      View details →
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Events and Recent Activities */}
            <div className="grid gap-8 xl:grid-cols-5">
              {/* Upcoming Events */}
              <section className="xl:col-span-3">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <PageHeader
                    title="Upcoming Events"
                    description="Stay updated with your club events."
                  />

                  <Link
                    href="/club-coordinator/events"
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
                        <h3 className="font-semibold">{event.title}</h3>

                        <p className="mt-1 text-sm text-text-muted">
                          Campus Event
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${event.color}`}
                        >
                          {event.category}
                        </span>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            event.status === "Approved"
                              ? "bg-primary-subtle text-primary"
                              : "bg-secondary text-text-muted"
                          }`}
                        >
                          {event.status}
                        </span>

                        <Link
                          href="/club-coordinator/events"
                          aria-label={`View ${event.title}`}
                          className="text-xl text-text-subtle hover:text-primary"
                        >
                          →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Recent Activities */}
              <section className="xl:col-span-2">
                <PageHeader
                  title="Recent Activities"
                  description="Your latest club updates."
                />

                <div className="mt-5 rounded-2xl border border-border bg-surface p-5">
                  {activities.map((activity, index) => (
                    <article
                      key={activity.title}
                      className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${
                        index !== activities.length - 1
                          ? "border-b border-border-subtle"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                        {activity.icon}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold leading-5">
                          {activity.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-primary">
                          {activity.date}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Quick Actions */}
            <section>
              <PageHeader
                title="Quick Actions"
                description="Jump directly to a club management service."
              />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
                      {action.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold">
                        {action.label}
                      </h3>

                      <p className="mt-1 text-sm text-text-muted">
                        {action.description}
                      </p>
                    </div>

                    <span className="text-lg text-primary">→</span>
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
