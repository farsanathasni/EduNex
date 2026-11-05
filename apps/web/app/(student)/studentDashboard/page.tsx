

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import { useAccess } from "@/lib/navigation/access";
import {
  useAllEventsQuery,
  useMyEventsQuery,
} from "@/features/events/api/event-query";
import {
  useMyStudentMembershipRequestsQuery,
  useStudentClubsQuery,
} from "@/features/clubs/api/club-query";

const eventIcons = ["🎓", "🎉", "💡", "🏆"];
const clubGradients = [
  "from-blue-600 to-indigo-600",
  "from-orange-500 to-pink-500",
  "from-green-500 to-emerald-600",
];

const studentQuickActions = [
  { title: "Explore Clubs", description: "Find your campus community", icon: "🤝", href: "/student", color: "bg-green-50" },
  { title: "Browse Events", description: "Discover campus activities", icon: "🎉", href: "/studentEvents", color: "bg-orange-50" },
  { title: "My Memberships", description: "Track your club applications", icon: "📋", href: "/student/my-memberships", color: "bg-blue-50" },
  { title: "My Profile", description: "View your student profile", icon: "👤", href: "/studentprofile", color: "bg-purple-50" },
];
const activities = [
  { title: "Event proposal submitted", description: "Your event proposal was submitted for approval.", date: "2 hours ago", icon: "📝" },
  { title: "Student membership updated", description: "A membership request was updated.", date: "Yesterday", icon: "👥" },
  { title: "Event details updated", description: "You updated your event information.", date: "2 days ago", icon: "📅" },
];

// const coordinatorQuickActions = [
//   { title: "View Events", description: "Manage your club events", icon: "📅", href: "/" },
//   { title: "Request an Event", description: "Submit a new event proposal", icon: "📝", href: "/club-coordinator/request-event" },
// ];

export default function StudentDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { getNavItems, mode, setMode, canSwitchMode, me } = useAccess();
  console.log("Access details:", {
  mode,
  canSwitchMode,
  coordinatedClubs: me?.coordinatedClubs,
  me,
});
  const coordinatedClubs = me?.coordinatedClubs ?? [];
  const assignedClubIds = new Set(coordinatedClubs.map((club) => club.id));
  const { data: session, isPending } = authClient.useSession();
  const isStudentMode = mode === "student";
  const eventsQuery = useAllEventsQuery(isStudentMode);
  const coordinatorEventsQuery = useMyEventsQuery(
    !isStudentMode && coordinatedClubs.length > 0,
  );
  const clubsQuery = useStudentClubsQuery();
  const membershipsQuery = useMyStudentMembershipRequestsQuery(isStudentMode);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const displayName = user?.name?.trim() || "";
  const firstName = displayName.split(/\s+/)[0] || "Student";
  const coordinatorName = displayName || "Coordinator";
  const coordinatorInitial = coordinatorName.charAt(0).toUpperCase();
  const menuItems = getNavItems(mode).filter(
    (item) =>
      item.mode === mode ||
      (mode === "coordinator" && item.href === "/dashboard"),
  ).map((item) => ({
    ...item,
    label:
      mode === "coordinator" && item.href === "/dashboard"
        ? "Dashboard"
        : mode === "coordinator" &&
      item.href === "/club-coordinator/events"
        ? "My Events"
        : mode === "coordinator" &&
            item.href === "/club-coordinator/request-event"
          ? "Request Event"
          : item.label,
    icon:
      item.href === "/dashboard"
        ? "\u25a6"
        : item.href === "/studentDashboard"
        ? "\u2302"
        : item.href === "/studentprofile"
          ? "\u{1f464}"
          : item.href === "/student"
            ? "\u{1f91d}"
            : item.href === "/studentEvents" ||
                item.href === "/club-coordinator/events"
              ? "\u{1f4c5}"
              : item.href === "/student/my-memberships" ||
                  item.href === "/club-coordinator/membership-requests" ||
                  item.href === "/club-coordinator/members"
                ? "\u{1f465}"
                : item.href === "/club-coordinator/request-event"
                  ? "\u{1f4dd}"
                  : item.icon,
  }));

  const events = eventsQuery.data ?? [];
  const upcomingEvents = events
    .filter((event) => {
      const startTime = new Date(event.startTime).getTime();
      return Number.isFinite(startTime) && startTime >= Date.now();
    })
    .sort(
      (left, right) =>
        new Date(left.startTime).getTime() - new Date(right.startTime).getTime(),
    );
  const filteredEvents = upcomingEvents.filter((event) =>
    `${event.title} ${event.clubName} ${event.location ?? ""} ${event.description ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const clubs = clubsQuery.data ?? [];
  const assignedEvents = (coordinatorEventsQuery.data ?? [])
    .filter((event) => assignedClubIds.has(event.clubId))
    .sort(
      (left, right) =>
        new Date(left.startTime).getTime() - new Date(right.startTime).getTime(),
    );
  const coordinatorUpcomingEvents = assignedEvents.filter(
    (event) => new Date(event.startTime).getTime() >= Date.now(),
  );
  const coordinatorPastEvents = assignedEvents.filter(
    (event) => new Date(event.startTime).getTime() < Date.now(),
  );
  const coordinatorCount = (value: number) =>
    coordinatedClubs.length === 0
      ? "0"
      : coordinatorEventsQuery.isPending
      ? "…"
      : coordinatorEventsQuery.isError
        ? "—"
        : String(value);
  const coordinatorStats = [
    { title: "Published Assigned Events", value: coordinatorCount(assignedEvents.length), icon: "📅", color: "bg-primary-subtle text-primary", href: "/" },
    { title: "Upcoming Published Events", value: coordinatorCount(coordinatorUpcomingEvents.length), icon: "🎯", color: "bg-secondary text-secondary-foreground", href: "/club-coordinator/events" },
    { title: "Assigned Clubs", value: String(coordinatedClubs.length), icon: "🏷️", color: "bg-accent-subtle text-accent", href: "/club-coordinator/profile" },
    { title: "Past Events", value: coordinatorCount(coordinatorPastEvents.length), icon: "✅", color: "bg-secondary text-text-muted", href: "/club-coordinator/events" },
  ];
  const memberships = membershipsQuery.data ?? [];
  const approvedMemberships = memberships.filter(
    (membership) => membership.status.toLowerCase() === "approved",
  );
  const pendingMemberships = memberships.filter(
    (membership) => membership.status.toLowerCase() === "pending",
  );
  const studentStats = [
    { title: "Upcoming Events", value: eventsQuery.isPending ? "…" : eventsQuery.isError ? "—" : String(upcomingEvents.length), description: "Events scheduled for campus", icon: "🎉", href: "/studentEvents", color: "bg-orange-50 text-orange-600" },
    { title: "Available Clubs", value: clubsQuery.isPending ? "…" : clubsQuery.isError ? "—" : String(clubs.length), description: "Campus communities to explore", icon: "🤝", href: "/student", color: "bg-green-50 text-green-700" },
    { title: "My Clubs", value: membershipsQuery.isPending ? "…" : membershipsQuery.isError ? "—" : String(approvedMemberships.length), description: "Approved memberships", icon: "🏷️", href: "/student/my-memberships", color: "bg-blue-50 text-blue-700" },
    { title: "Pending Requests", value: membershipsQuery.isPending ? "…" : membershipsQuery.isError ? "—" : String(pendingMemberships.length), description: "Memberships awaiting review", icon: "📋", href: "/student/my-memberships", color: "bg-purple-50 text-purple-700" },
  ];

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm font-medium text-muted">Preparing your campus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {mobileMenuOpen && (
        <Button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-border px-6">
          <Link href="/studentDashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md">E</div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-primary">EduNex</p>
              <p className="text-xs text-muted">Your campus, connected.</p>
            </div>
          </Link>
          <Button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-muted hover:bg-secondary lg:hidden">✕</Button>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
            {mode === "student" ? "Student workspace" : "Coordinator workspace"}
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${active ? "bg-primary text-white shadow-md shadow-primary/15" : "text-muted hover:bg-secondary hover:text-primary"}`}>
                  <span className="flex h-7 w-7 items-center justify-center text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          {mode === "student" ? (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#416fc2] p-5 text-white">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">✨</div>
              <h3 className="font-bold">Make campus life count!</h3>
              <p className="mt-2 text-xs leading-5 text-white/80">Join a club, attend an event, and discover new opportunities.</p>
              <Link href="/student" className="mt-4 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-primary transition hover:bg-blue-50">Find your community →</Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-inkwell p-4 text-text-inverse">
              <p className="font-semibold">Plan an Event?</p>
              <p className="mt-2 text-xs leading-5 opacity-80">Organize campus activities and submit event proposals for approval.</p>
              <Link href="/club-coordinator/request-event" className="mt-4 inline-block rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-secondary">Request an event</Link>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary">{(mode === "student" ? firstName : coordinatorInitial).charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{mode === "student" ? displayName || "Student" : coordinatorName}</p>
              <p className="truncate text-xs text-muted">{mode === "student" ? "Student account" : "Club Coordinator"}</p>
            </div>
            <Button type="button" onClick={handleLogout} disabled={isSigningOut} title="Log out" aria-label="Log out" className="rounded-lg p-2 ">{isSigningOut ? "…" : "↗"}</Button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[270px]">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
          <div className="flex min-h-[82px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
            <div className="flex items-center gap-3">
              <Button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" className="rounded-xl border border-border p-2.5 text-primary hover:bg-secondary lg:hidden">☰</Button>
              <div>
                <p className="text-sm font-bold text-text">{mode === "student" ? "Student Dashboard" : "Club Coordinator Dashboard"}</p>
                <p className="hidden text-xs text-muted sm:block">{mode === "student" ? "Your personal campus space" : "Manage your club activities"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {mode === "student" && (
                <label className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 md:flex">
                  <span className="text-muted">⌕</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-36 bg-transparent text-sm outline-none placeholder:text-subtle lg:w-48" />
                </label>
              )}

              {canSwitchMode && (
                <Button type="button" onClick={() => { setMode(mode === "student" ? "coordinator" : "student"); setMobileMenuOpen(false); }} className="rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4">
                  <span className="sm:hidden">{mode === "student" ? "Coordinator →" : "← Student"}</span>
                  <span className="hidden sm:inline">{mode === "student" ? "Switch to Coordinator" : "Switch to Student"}</span>
                </Button>
              )}

              <Button type="button" onClick={handleLogout} disabled={isSigningOut} className="rounded-xl border border-border px-3 py-2.5 ">
                {isSigningOut ? "Signing out..." : <><span className="sm:hidden">↗</span><span className="hidden sm:inline">Log out</span></>}
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
          {mode === "student" ? (
            <>
              <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-[#2c5bab] to-[#4777c7] px-6 py-8 text-white shadow-lg shadow-primary/10 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
                <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border-[40px] border-white/[0.06]" />
                <div className="pointer-events-none absolute -bottom-24 right-[22%] -z-10 h-48 w-48 rounded-full bg-white/[0.06]" />
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                  <div className="max-w-2xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90"><span className="h-2 w-2 rounded-full bg-green-300" />YOUR CAMPUS JOURNEY STARTS HERE</div>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Hey, {firstName}! 👋<br /><span className="text-blue-100">Ready to make today count?</span></h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/90 sm:text-base">Discover new opportunities, connect with your campus community, and make every college day meaningful.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/studentEvents" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50">Explore Events <span>→</span></Link>
                      <Link href="/student" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">Discover Clubs</Link>
                    </div>
                  </div>
                  <div className="hidden lg:flex"><div className="flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">🎓</div></div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-blue-50/90"><span>📚 Learn something new</span><span>🤝 Meet your community</span><span>🚀 Build your future</span></div>
              </section>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your overview</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Your campus at a glance</h2>
                    <p className="mt-1 text-sm text-muted">Current events and club activity from your account.</p>
                  </div>
                  <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">Student workspace</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {studentStats.map((stat) => (
                    <Link href={stat.href} key={stat.title} className="group rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${stat.color}`}>{stat.icon}</div>
                        <span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">→</span>
                      </div>
                      <p className="mt-5 text-sm font-medium text-muted">{stat.title}</p>
                      <span className="mt-1 block text-3xl font-extrabold tracking-tight">{stat.value}</span>
                      <p className="mt-2 text-xs text-subtle">{stat.description}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Don't miss out</p>
                      <h2 className="mt-1 text-xl font-extrabold">Upcoming Events</h2>
                      <p className="mt-1 text-sm text-muted">What's happening around your campus.</p>
                    </div>
                    <Link href="/studentEvents" className="shrink-0 rounded-lg px-2 py-2 text-sm font-bold text-primary hover:bg-primary-subtle">View all →</Link>
                  </div>
                  <div className="mb-4 md:hidden">
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                  {eventsQuery.isPending ? (
                    <p className="py-8 text-center text-sm text-muted">Loading campus events...</p>
                  ) : eventsQuery.isError ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted">Unable to load campus events.</p>
                      <button type="button" onClick={() => void eventsQuery.refetch()} className="mt-3 text-sm font-semibold text-primary">Try again</button>
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <p className="text-2xl">🔎</p>
                      <p className="mt-2 font-semibold">{search ? "No matching events" : "No upcoming events"}</p>
                      <p className="mt-1 text-sm text-muted">{search ? "Try searching with a different keyword." : "New campus events will appear here when available."}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.slice(0, 4).map((event, index) => {
                        const startTime = new Date(event.startTime);
                        return (
                          <article key={event.id} className="group flex gap-4 rounded-2xl border border-border-subtle p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]">
                            <div className="flex w-[68px] shrink-0 flex-col items-center justify-center self-start rounded-xl bg-primary-subtle px-2 py-3 text-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{startTime.toLocaleDateString("en-IN", { month: "short" })}</span>
                              <span className="mt-0.5 text-2xl font-extrabold text-primary">{startTime.getDate()}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-text transition group-hover:text-primary">{event.title}</h3>
                                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted">{event.clubName}</span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-muted">{event.description || "No event description provided."}</p>
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-subtle">
                                <span>◷ {startTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                                <span>⌖ {event.location || "Venue to be announced"}</span>
                              </div>
                            </div>
                            <span className="hidden text-2xl sm:block">{eventIcons[index % eventIcons.length]}</span>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Stay informed</p>
                      <h2 className="mt-1 text-xl font-extrabold">My Memberships</h2>
                      <p className="mt-1 text-sm text-muted">Your latest club application statuses.</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-xl">📢</div>
                  </div>
                  {membershipsQuery.isPending ? (
                    <p className="py-6 text-center text-sm text-muted">Loading membership requests...</p>
                  ) : membershipsQuery.isError ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted">Unable to load membership requests.</p>
                      <button type="button" onClick={() => void membershipsQuery.refetch()} className="mt-3 text-sm font-semibold text-primary">Try again</button>
                    </div>
                  ) : memberships.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted">You have no club membership requests yet.</p>
                      <Link href="/student" className="mt-3 inline-block text-sm font-semibold text-primary">Explore clubs →</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {memberships.slice(0, 4).map((membership) => (
                        <article key={membership.id} className="flex items-center justify-between gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{membership.club?.name ?? `Club ${membership.clubId}`}</p>
                            <p className="mt-1 text-xs text-muted">Club membership request</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold capitalize text-muted">{membership.status}</span>
                        </article>
                      ))}
                    </div>
                  )}
                  <Link href="/student/my-memberships" className="mt-6 flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary-subtle">View all memberships →</Link>
                </div>
              </section>
              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">Find your people</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Discover Campus Clubs</h2>
                    <p className="mt-1 text-sm text-muted">Meet people who share your interests.</p>
                  </div>
                  <Link href="/student" className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary-subtle">Explore all clubs →</Link>
                </div>
                {clubsQuery.isPending ? (
                  <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">Loading campus clubs...</p>
                ) : clubsQuery.isError ? (
                  <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-muted">Unable to load campus clubs.</p>
                    <button type="button" onClick={() => void clubsQuery.refetch()} className="mt-3 text-sm font-semibold text-primary">Try again</button>
                  </div>
                ) : clubs.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">No clubs are available yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {clubs.slice(0, 3).map((club, index) => (
                      <article key={club.id} className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                        <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${clubGradients[index % clubGradients.length]}`}>
                          <span className="text-5xl transition duration-300 group-hover:scale-110">🤝</span>
                        </div>
                        <div className="p-5">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">Campus club</span>
                          <h3 className="mt-3 text-lg font-extrabold">{club.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted">{club.description || "Explore this campus community."}</p>
                          <Link href={`/student/${club.id}`} className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary-subtle">View club details <span>→</span></Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Get things done</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Quick Actions</h2><p className="mt-1 text-sm text-muted">Jump straight to what you need.</p></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{studentQuickActions.map((action) => <Link key={action.title} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105 ${action.color}`}>{action.icon}</div><div className="min-w-0 flex-1"><h3 className="font-bold transition group-hover:text-primary">{action.title}</h3><p className="mt-1 text-xs leading-5 text-muted">{action.description}</p></div><span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">→</span></Link>)}</div>
              </section>

              <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-subtle sm:flex-row sm:text-left"><p>© {new Date().getFullYear()} EduNex. Built for a better campus experience.</p><div className="flex items-center gap-4"><Link href="/studentprofile" className="transition hover:text-primary">My Profile</Link><Link href="/student/my-memberships" className="transition hover:text-primary">My Memberships</Link></div></footer>
            </>
          ) : (
            <>
              <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
                <div className="relative z-10 max-w-2xl"><p className="text-sm font-medium opacity-80">CLUB MANAGEMENT ✨</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Welcome back, {coordinatorName}!</h1><p className="mt-3 max-w-lg text-sm leading-6 opacity-90 sm:text-base">Manage your club activities, organize campus events, and keep students informed. Everything you need to coordinate your club is in one place.</p><Link href="/club-coordinator/request-event" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary">Request an Event <span>→</span></Link></div>
                <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">🎓</div>
              </section>

              <section><div><h2 className="text-2xl font-bold">Club Overview</h2><p className="mt-1 text-sm text-text-muted">A quick look at your club activities.</p></div>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{coordinatorStats.map((stat) => <Link key={stat.title} href={stat.href} className="block rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-text-muted">{stat.title}</p><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}>{stat.icon}</span></div><p className="mt-4 text-3xl font-bold">{stat.value}</p><p className="mt-2 text-xs text-text-subtle">View details →</p></Link>)}</div>
              </section>

              <div className="grid gap-8 xl:grid-cols-5">
                <section className="xl:col-span-3">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">Assigned Club Events</h2>
                      <p className="mt-1 text-sm text-text-muted">Published events from clubs assigned to you.</p>
                    </div>
                    {coordinatedClubs.length > 0 && <Link href="/club-coordinator/events" className="shrink-0 text-sm font-semibold text-primary hover:underline">Manage events →</Link>}
                  </div>
                  {coordinatedClubs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                      <h3 className="font-semibold">No clubs assigned</h3>
                      <p className="mt-2 text-sm text-text-muted">Events and management links will appear here when a club is assigned to your coordinator account.</p>
                    </div>
                  ) : coordinatorEventsQuery.isPending ? (
                    <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">Loading assigned-club events...</div>
                  ) : coordinatorEventsQuery.isError ? (
                    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                      <p className="text-sm text-text-muted">Unable to load assigned-club events.</p>
                      <button type="button" onClick={() => void coordinatorEventsQuery.refetch()} className="mt-3 text-sm font-semibold text-primary">Try again</button>
                    </div>
                  ) : coordinatorUpcomingEvents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">There are no upcoming published events for your assigned clubs.</div>
                  ) : (
                    <div className="space-y-3">
                      {coordinatorUpcomingEvents.slice(0, 5).map((event) => {
                        const startTime = new Date(event.startTime);
                        return (
                          <article key={event.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
                            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary">
                              <span className="text-xl font-bold">{startTime.getDate()}</span>
                              <span className="text-xs font-semibold">{startTime.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              <p className="mt-1 text-sm text-text-muted">{event.clubName}</p>
                              <p className="mt-1 text-xs text-text-subtle">{startTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {event.location || "Venue to be announced"}</p>
                            </div>
                            <span className="rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-medium capitalize text-primary">{event.status}</span>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section><section className="xl:col-span-2"><div><h2 className="text-xl font-bold">Recent Activities</h2><p className="mt-1 text-sm text-text-muted">Your latest club updates.</p></div><div className="mt-5 rounded-2xl border border-border bg-surface p-5">{activities.map((activity, index) => <article key={activity.title} className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${index !== activities.length - 1 ? "border-b border-border-subtle" : ""}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">{activity.icon}</div><div><h3 className="text-sm font-semibold leading-5">{activity.title}</h3><p className="mt-1 text-xs leading-5 text-text-muted">{activity.description}</p><p className="mt-2 text-xs text-primary">{activity.date}</p></div></article>)}</div></section>
              </div>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">All Available Clubs</h2>
                    <p className="mt-1 text-sm text-text-muted">Assigned clubs are marked and show coordinator management access.</p>
                  </div>
                </div>
                {coordinatedClubs.length === 0 && (
                  <div className="mb-4 rounded-xl border border-dashed border-border bg-surface p-5 text-sm text-text-muted">
                    No clubs are assigned to your coordinator account. You can still view all available clubs below.
                  </div>
                )}
                {clubsQuery.isPending ? (
                  <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">Loading available clubs...</div>
                ) : clubsQuery.isError ? (
                  <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-text-muted">Unable to load available clubs.</p>
                    <button type="button" onClick={() => void clubsQuery.refetch()} className="mt-3 text-sm font-semibold text-primary">Try again</button>
                  </div>
                ) : clubs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">There are no clubs available yet.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {clubs.map((club) => {
                      const isAssigned = assignedClubIds.has(club.id);
                      return (
                        <article key={club.id} className="rounded-2xl border border-border bg-surface p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-bold">{club.name}</h3>
                              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-text-muted">{club.description || "No club description provided."}</p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isAssigned ? "bg-green-100 text-green-800" : "bg-secondary text-text-muted"}`}>
                              {isAssigned ? "Assigned to you" : "Not assigned"}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
                            <span className="text-xs text-text-subtle">Club #{club.id}</span>
                            {isAssigned ? (
                              <Link href="/club-coordinator/events" className="text-sm font-semibold text-primary hover:underline">Manage assigned clubs →</Link>
                            ) : (
                              <span className="text-xs text-text-subtle">View only</span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
              {/* <section><div><h2 className="text-2xl font-bold">Quick Actions</h2><p className="mt-1 text-sm text-text-muted">Jump directly to a club management service.</p></div><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{coordinatorQuickActions.map((action) => <Link key={action.title} href={action.href} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">{action.icon}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{action.title}</h3><p className="mt-1 text-sm text-text-muted">{action.description}</p></div><span className="text-lg text-primary">→</span></Link>)}</div></section> */}

              <footer className="border-t border-border pt-6 text-center text-sm text-text-muted">© {new Date().getFullYear()} EduNex · Your campus, connected.</footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
