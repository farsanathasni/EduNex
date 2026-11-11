
"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";

import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  GraduationCap,
  HeartHandshake,
  Inbox,
  MapPin,
  Search,
  User,
  Users,
} from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";

import { useAllEventsQuery } from "@/features/events/api/event-query";

import {
  useMyStudentMembershipRequestsQuery,
  useStudentClubsQuery,
} from "@/features/clubs/api/club-query";

type IconType = ComponentType<{ className?: string }>;

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: IconType;
  href: string;
  iconClassName: string;
};

type EventRowProps = {
  title: string;
  clubName: string;
  startTime: string;
  location?: string | null;
  description?: string | null;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const studentQuickActions = [
  {
    title: "Explore clubs",
    description: "Find your campus community",
    icon: HeartHandshake,
    href: "/student",
    iconClassName: "bg-primary-subtle text-primary",
  },
  {
    title: "Browse events",
    description: "Discover campus activities",
    icon: CalendarDays,
    href: "/studentEvents",
    iconClassName: "bg-accent-subtle text-accent",
  },
  {
    title: "My memberships",
    description: "Track your club applications",
    icon: Users,
    href: "/student/my-memberships",
    iconClassName: "bg-primary-subtle text-primary",
  },
  {
    title: "My profile",
    description: "View your student profile",
    icon: User,
    href: "/studentprofile",
    iconClassName: "bg-secondary text-secondary-foreground",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function membershipBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "border-green-500/30 bg-green-500/10 text-green-700";

    case "rejected":
      return "border-red-500/30 bg-red-500/10 text-red-700";

    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
  }
}

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "TBA",
      time: "Time unavailable",
    };
  }

  return {
    day: date.getDate(),
    month: date.toLocaleDateString("en-IN", {
      month: "short",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;

  return (
    <Link
      href={stat.href}
      className={`group block rounded-2xl ${focusRing}`}
    >
      <Card
        padding="lg"
        className="h-full shadow-lg transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-xl motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClassName}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <ArrowRight className="h-4 w-4 text-text-subtle transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        <p className="mt-5 text-label font-medium text-text-muted">
          {stat.title}
        </p>

        <p className="mt-1 text-heading font-extrabold leading-tight tracking-tight text-text">
          {stat.value}
        </p>

        <p className="mt-1 text-caption text-text-subtle">
          {stat.description}
        </p>
      </Card>
    </Link>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-heading font-extrabold tracking-tight text-text">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-label text-text-muted">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-label font-semibold text-primary transition-colors hover:bg-primary-subtle ${focusRing}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function InlineState({
  icon,
  title,
  description,
  action,
  role = "status",
  tone = "neutral",
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  role?: "status" | "alert";
  tone?: "neutral" | "error";
}) {
  return (
    <div
      role={role}
      className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-10 text-center"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          tone === "error"
            ? "bg-accent-subtle text-accent"
            : "bg-primary-subtle text-primary"
        }`}
      >
        {icon}
      </div>

      <p className="mt-4 text-label font-semibold text-text">
        {title}
      </p>

      {description && (
        <p className="mt-1 max-w-sm text-caption text-text-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex animate-pulse items-center gap-4 rounded-xl border border-border-subtle p-4"
        >
          <div className="h-16 w-16 shrink-0 rounded-xl bg-secondary-hover" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-secondary-hover" />
            <div className="h-3 w-full rounded bg-secondary-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EventRow({
  title,
  clubName,
  startTime,
  location,
  description,
}: EventRowProps) {
  const formattedDate = formatEventDate(startTime);

  return (
    <article className="group flex items-start gap-4 rounded-xl border border-border-subtle p-4 transition-colors hover:border-primary/30 hover:bg-secondary-subtle">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
      >
        <span className="text-subheading font-extrabold leading-none">
          {formattedDate.day}
        </span>

        <span className="mt-1 text-caption font-semibold uppercase">
          {formattedDate.month}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="break-words text-body font-bold text-text">
            {title}
          </h3>

          <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-caption font-semibold text-accent">
            {clubName}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-label leading-6 text-text-muted">
          {description || "No event description provided."}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {formattedDate.time}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {location || "Venue to be announced"}
          </span>
        </div>
      </div>
    </article>
  );
}

function Hero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand px-6 pb-24 pt-10 text-text-on-primary shadow-lg sm:px-10 sm:pb-28 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10"
      />

      <div className="relative z-10 max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
          <GraduationCap className="h-4 w-4" />
          {eyebrow}
        </p>

        <h1 className="mt-5 break-words text-display-sm font-extrabold tracking-tight sm:text-display">
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-body leading-relaxed text-white/80">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {children}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Student Dashboard Skeleton                                                */
/* -------------------------------------------------------------------------- */

function StudentDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="fixed inset-y-0 left-0 hidden w-[270px] border-r border-border bg-surface p-5 lg:block">
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="lg:ml-[270px]">
        {/* Header */}
        <header className="flex min-h-[76px] items-center justify-between border-b border-border bg-surface px-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-6 lg:px-9">
          {/* Hero */}
          <div>
            <div className="rounded-3xl bg-surface p-8 sm:p-10">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-6 h-10 w-72 max-w-full" />
              <Skeleton className="mt-4 h-4 w-full max-w-lg" />
              <Skeleton className="mt-3 h-4 w-64 max-w-full" />
              <div className="mt-7 flex gap-3">
                <Skeleton className="h-11 w-36 rounded-lg" />
                <Skeleton className="h-11 w-36 rounded-lg" />
              </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 -mt-8 grid grid-cols-1 gap-4 px-3 sm:grid-cols-2 sm:px-8 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="mt-5 h-3 w-24" />
                  <Skeleton className="mt-3 h-7 w-16" />
                  <Skeleton className="mt-2 h-3 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Events and memberships */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            {[0, 1].map((section) => (
              <div
                key={section}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-3 w-56" />
                <div className="mt-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Clubs */}
          <section>
            <Skeleton className="h-6 w-52" />
            <Skeleton className="mt-2 h-3 w-64" />
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <Skeleton className="mt-5 h-4 w-2/3" />
                  <Skeleton className="mt-3 h-3 w-full" />
                  <Skeleton className="mt-2 h-3 w-4/5" />
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <Skeleton className="h-6 w-36" />
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
                >
                  <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Student Dashboard                                                          */
/* -------------------------------------------------------------------------- */

export default function StudentDashboard() {
  const [search, setSearch] = useState("");

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const eventsQuery = useAllEventsQuery(true);
  const clubsQuery = useStudentClubsQuery();
  const membershipsQuery =
    useMyStudentMembershipRequestsQuery(true);

  const displayName = session?.user?.name?.trim() || "";
  const firstName = displayName.split(/\s+/)[0] || "Student";

  const events = eventsQuery.data ?? [];
  const clubs = clubsQuery.data ?? [];
  const memberships = membershipsQuery.data ?? [];

  const upcomingEvents = useMemo(() => {
    const now = Date.now();

    return events
      .filter((event) => {
        const startTime = new Date(event.startTime).getTime();

        return Number.isFinite(startTime) && startTime >= now;
      })
      .sort(
        (left, right) =>
          new Date(left.startTime).getTime() -
          new Date(right.startTime).getTime(),
      );
  }, [events]);

  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return upcomingEvents;

    return upcomingEvents.filter((event) =>
      `${event.title} ${event.clubName} ${event.location ?? ""} ${
        event.description ?? ""
      }`
        .toLowerCase()
        .includes(keyword),
    );
  }, [upcomingEvents, search]);

  const approvedMemberships = memberships.filter(
    (membership) => membership.status.toLowerCase() === "approved",
  );

  const pendingMemberships = memberships.filter(
    (membership) => membership.status.toLowerCase() === "pending",
  );

  const studentStats: Stat[] = [
    {
      title: "Upcoming events",
      value: eventsQuery.isPending
        ? "…"
        : eventsQuery.isError
          ? "—"
          : String(upcomingEvents.length),
      description: "Events scheduled for campus",
      icon: CalendarDays,
      href: "/studentEvents",
      iconClassName: "bg-primary-subtle text-primary",
    },
    {
      title: "Available clubs",
      value: clubsQuery.isPending
        ? "…"
        : clubsQuery.isError
          ? "—"
          : String(clubs.length),
      description: "Campus communities to explore",
      icon: HeartHandshake,
      href: "/student",
      iconClassName: "bg-secondary text-secondary-foreground",
    },
    {
      title: "My clubs",
      value: membershipsQuery.isPending
        ? "…"
        : membershipsQuery.isError
          ? "—"
          : String(approvedMemberships.length),
      description: "Approved memberships",
      icon: BadgeCheck,
      href: "/student/my-memberships",
      iconClassName: "bg-green-500/10 text-green-600",
    },
    {
      title: "Pending requests",
      value: membershipsQuery.isPending
        ? "…"
        : membershipsQuery.isError
          ? "—"
          : String(pendingMemberships.length),
      description: "Memberships awaiting review",
      icon: Clock3,
      href: "/student/my-memberships",
      iconClassName: "bg-accent-subtle text-accent",
    },
  ];

  if (isSessionPending) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="min-h-full bg-background text-text">
      <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
        {/* Welcome section and statistics */}
        <div>
          <Hero
            eyebrow="Student workspace"
            title={`Welcome back, ${firstName}`}
            description="Explore communities, discover upcoming events and make every college day count."
          >
            <Link
              href="/studentEvents"
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-label font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover ${focusRing}`}
            >
              Explore events
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/student"
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-label font-semibold text-white transition-colors hover:bg-white/20 ${focusRing}`}
            >
              Discover clubs
            </Link>
          </Hero>

          <section
            aria-label="Your overview"
            className="relative z-10 -mt-12 grid grid-cols-1 gap-4 px-3 sm:grid-cols-2 sm:px-8 xl:grid-cols-4"
          >
            {studentStats.map((stat) => (
              <StatCard key={stat.title} stat={stat} />
            ))}
          </section>
        </div>

        {/* Events and memberships */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card padding="lg" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-subheading font-extrabold text-text">
                  Upcoming events
                </h2>

                <p className="mt-1 text-label text-text-muted">
                  What&apos;s happening around your campus.
                </p>
              </div>

              <TextLink href="/studentEvents">
                View all
              </TextLink>
            </div>

            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search upcoming events..."
                aria-label="Search upcoming events"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-label text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {eventsQuery.isPending ? (
              <ListSkeleton rows={3} />
            ) : eventsQuery.isError ? (
              <InlineState
                role="alert"
                tone="error"
                icon={<AlertCircle className="h-6 w-6" />}
                title="Unable to load campus events"
                description="Please try again."
                action={
                  <Button
                    size="sm"
                    onClick={() => void eventsQuery.refetch()}
                  >
                    Try again
                  </Button>
                }
              />
            ) : filteredEvents.length === 0 ? (
              <InlineState
                icon={
                  search ? (
                    <Search className="h-6 w-6" />
                  ) : (
                    <CalendarDays className="h-6 w-6" />
                  )
                }
                title={
                  search
                    ? "No matching events"
                    : "No upcoming events"
                }
                description={
                  search
                    ? "Try searching with a different keyword."
                    : "New campus events will appear here when available."
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredEvents.slice(0, 4).map((event) => (
                  <EventRow
                    key={event.id}
                    title={event.title}
                    clubName={event.clubName}
                    startTime={event.startTime}
                    location={event.location}
                    description={event.description}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card padding="lg" className="flex flex-col">
            <div className="mb-5">
              <h2 className="text-subheading font-extrabold text-text">
                My memberships
              </h2>

              <p className="mt-1 text-label text-text-muted">
                Your latest club application statuses.
              </p>
            </div>

            <div className="flex-1">
              {membershipsQuery.isPending ? (
                <ListSkeleton rows={3} />
              ) : membershipsQuery.isError ? (
                <InlineState
                  role="alert"
                  tone="error"
                  icon={<AlertCircle className="h-6 w-6" />}
                  title="Unable to load membership requests"
                  action={
                    <Button
                      size="sm"
                      onClick={() => void membershipsQuery.refetch()}
                    >
                      Try again
                    </Button>
                  }
                />
              ) : memberships.length === 0 ? (
                <InlineState
                  icon={<Inbox className="h-6 w-6" />}
                  title="No memberships yet"
                  description="Join a club and become part of your campus community."
                  action={
                    <TextLink href="/student">
                      Explore clubs
                    </TextLink>
                  }
                />
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {memberships.slice(0, 4).map((membership) => (
                    <li
                      key={membership.id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-label font-extrabold text-primary">
                          {(
                            membership.clubName ||
                            `Club ${membership.clubId}`
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <p className="truncate text-label font-bold text-text">
                          {membership.clubName ||
                            `Club ${membership.clubId}`}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-caption font-semibold capitalize ${membershipBadgeClass(
                          membership.status,
                        )}`}
                      >
                        {membership.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href="/student/my-memberships"
              className={`mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-label font-semibold text-primary transition-colors hover:bg-primary-subtle ${focusRing}`}
            >
              View all memberships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </section>

        {/* Discover clubs */}
        <section>
          <SectionHeader
            title="Discover campus clubs"
            description="Meet people who share your interests."
            action={
              <TextLink href="/student">
                Explore all clubs
              </TextLink>
            }
          />

          {clubsQuery.isPending ? (
            <div
              role="status"
              aria-label="Loading clubs"
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  padding="lg"
                  className="animate-pulse"
                >
                  <div className="h-14 w-14 rounded-xl bg-secondary-hover" />
                  <div className="mt-5 h-4 w-2/3 rounded bg-secondary-hover" />
                  <div className="mt-3 h-3 w-full rounded bg-secondary-hover" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-secondary-hover" />
                </Card>
              ))}
            </div>
          ) : clubsQuery.isError ? (
            <InlineState
              role="alert"
              tone="error"
              icon={<AlertCircle className="h-6 w-6" />}
              title="Unable to load campus clubs"
              action={
                <Button
                  size="sm"
                  onClick={() => void clubsQuery.refetch()}
                >
                  Try again
                </Button>
              }
            />
          ) : clubs.length === 0 ? (
            <InlineState
              icon={<Inbox className="h-6 w-6" />}
              title="No clubs are available yet"
              description="Available campus clubs will appear here."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {clubs.slice(0, 3).map((club) => (
                <li key={club.id}>
                  <Card
                    padding="lg"
                    className="group relative flex h-full flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-subheading font-extrabold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {getInitials(club.name)}
                      </div>

                      <h3 className="line-clamp-2 text-body-lg font-bold leading-snug text-text">
                        {club.name}
                      </h3>
                    </div>

                    <p className="line-clamp-3 min-h-[4.5rem] flex-1 text-label leading-6 text-text-muted">
                      {club.description ||
                        "Explore this campus community."}
                    </p>

                    <div className="border-t border-border-subtle pt-4">
                      <Link
                        href={`/student/${club.id}`}
                        className={`inline-flex items-center gap-2 rounded-lg text-label font-semibold text-primary transition-colors hover:text-primary-hover ${focusRing}`}
                      >
                        View club details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <SectionHeader
            title="Quick actions"
            description="Jump straight to what you need."
          />

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {studentQuickActions.map((action) => {
              const Icon = action.icon;

              return (
                <li key={action.title}>
                  <Link
                    href={action.href}
                    className={`group block h-full rounded-2xl ${focusRing}`}
                  >
                    <Card className="flex h-full items-center gap-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.iconClassName}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-label font-bold text-text">
                          {action.title}
                        </h3>

                        <p className="mt-0.5 text-caption text-text-muted">
                          {action.description}
                        </p>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-text-subtle transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-caption text-text-subtle sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} EduNex. Built for a better campus
            experience.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/studentprofile"
              className="transition-colors hover:text-primary"
            >
              My profile
            </Link>

            <Link
              href="/student/my-memberships"
              className="transition-colors hover:text-primary"
            >
              My memberships
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
