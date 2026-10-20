"use client";


import Link from "next/link";
import PageHeader from "@/app/ui/pageHeader";
// import { useRouter } from "next/router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Button from "@/app/ui/button";

const stats = [
  { title: "Study Materials", value: "24", icon: "📚", color: "bg-primary-subtle text-primary" },
  { title: "Upcoming Events", value: "3", icon: "📅", color: "bg-secondary text-secondary-foreground" },
  { title: "My Clubs", value: "2", icon: "🎭", color: "bg-accent-subtle text-accent" },
  { title: "Pending Issues", value: "1", icon: "🛠️", color: "bg-secondary text-text-muted" },
];

const events = [
  { title: "Tech Fest 2026", date: "18", month: "OCT", category: "Technology", color: "bg-primary-subtle text-primary" },
  { title: "Arts & Cultural Day", date: "22", month: "OCT", category: "Cultural", color: "bg-accent-subtle text-accent" },
  { title: "Project Exhibition", date: "26", month: "OCT", category: "Academic", color: "bg-secondary text-secondary-foreground" },
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
  const router=useRouter()
  const[isSigningOut,setIsSigningOut]=useState(false)
  const {data:session,isPending}=authClient.useSession()
  const studentName = session?.user?.name || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();

  const handleSignOut=async()=>{
    setIsSigningOut(true)
    try{
      await authClient.signOut({
        fetchOptions:{
          onSuccess:()=>{
            router.replace("/");
            router.refresh()
          }
        }
      })
    }
    catch(error){
      console.error("Logout failed:", error);
    }
    finally{
      setIsSigningOut(false)
    }
  }


  return (
    <div className="min-h-screen bg-background text-text">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <Link href="/" className="flex items-center gap-3 px-6 py-7">
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
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-primary-subtle text-primary"
                      : "text-text-muted hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl bg-inkwell p-4 text-text-inverse">
              <p className="font-semibold">Need help?</p>
              <p className="mt-2 text-xs leading-5 opacity-80">
                Have a campus problem? Report it and follow its status.
              </p>

              <a
                href="#issues"
                className="mt-4 inline-block rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-secondary"
              >
                Report an issue
              </a>
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
              <p className="text-xs text-text-muted">EduNex / Student</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
  {/* Notifications */}
  <button
    type="button"
    aria-label="Notifications"
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
    className="rounded-xl  "
  >
    {isSigningOut ? "Signing out..." : "Logout"}
  </Button>

  {/* Student Profile */}
  <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary">
    {isPending ? "..." : studentInitial} 
  </div>
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
                  resources, stay updated, and make the most of your day.
                </p>

                <a
                  href="#events"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary"
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
              <PageHeader
                title="Campus Overview"
                description="A quick look at your campus activities."
              />

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <article
                    key={stat.title}
                    className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"
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
                      Sample dashboard data
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Events and Announcements */}
            <div className="grid gap-8 xl:grid-cols-5">
              <section id="events" className="xl:col-span-3">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <PageHeader
                    title="Upcoming Events"
                    description="Don't miss what's happening on campus."
                  />

                  <a
                    href="#events"
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    View all →
                  </a>
                </div>

                <div className="space-y-3">
                  {events.map((event) => (
                    <article
                      key={event.title}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-primary hover:shadow-md sm:p-5"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary">
                        <span className="text-xl font-bold">{event.date}</span>
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

                      <span className="text-xl text-text-subtle">→</span>
                    </article>
                  ))}
                </div>
              </section>

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
                          {announcement.title}
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

            {/* Quick Actions */}
            <section id="materials">
              <PageHeader
                title="Quick Actions"
                description="Jump directly to a campus service."
              />

              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-start rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"
                  >
                    <span className="text-3xl">{action.icon}</span>
                    <span className="mt-4 text-sm font-semibold">
                      {action.label}
                    </span>
                    <span className="mt-2 text-sm font-semibold text-primary">
                      Open →
                    </span>
                  </a>
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
