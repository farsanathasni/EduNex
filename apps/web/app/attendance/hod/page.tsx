"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarClock,
  CalendarRange,
  Building2,
  ClipboardList,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  SearchX,
  type LucideIcon,
} from "lucide-react";

import { useHodAttendanceEvents } from "@/features/attendence/api/attendance-query";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";

type Filter = "all" | "upcoming" | "past";

// Colours for known event statuses. Unknown statuses fall back to neutral.
const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-primary-subtle text-primary",
  approved: "bg-primary-subtle text-primary",
  scheduled: "bg-primary-subtle text-primary",
  ongoing: "bg-green-50 text-green-700",
  active: "bg-green-50 text-green-700",
  completed: "bg-secondary-hover text-text-muted",
  cancelled: "bg-red-50 text-red-700",
  rejected: "bg-red-50 text-red-700",
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function relativeDay(date: Date) {
  const diff = Math.round(
    (startOfDay(date) - startOfDay(new Date())) / 86_400_000,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${Math.abs(diff)} days ago`;
}

export default function HodAttendancePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isLoading, isError, error } = useHodAttendanceEvents();

  // API returns { events, pagination }
  const events = useMemo(() => data?.events ?? [], [data]);

  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const now = new Date();
    return {
      total: events.length,
      clubs: new Set(events.map((e) => e.clubName)).size,
      upcoming: events.filter((e) => startOfDay(new Date(e.startTime)) >= today)
        .length,
      thisMonth: events.filter((e) => {
        const d = new Date(e.startTime);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length,
    };
  }, [events]);

  const filtered = useMemo(() => {
    const today = startOfDay(new Date());
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const isUpcoming = startOfDay(new Date(event.startTime)) >= today;
      if (filter === "upcoming" && !isUpcoming) return false;
      if (filter === "past" && isUpcoming) return false;
      if (!query) return true;
      return (
        event.title.toLowerCase().includes(query) ||
        event.clubName?.toLowerCase().includes(query)
      );
    });
  }, [events, search, filter]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-secondary-hover" />
        <div className="h-24 animate-pulse rounded-2xl bg-secondary-hover" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-secondary-hover"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <Card padding="lg" className="border-red-200 bg-red-50">
          <p className="font-semibold text-red-700">
            Couldn&apos;t load attendance reports
          </p>
          <p className="mt-1 text-label text-red-600">
            {error instanceof Error
              ? error.message
              : "Check your connection and try again."}
          </p>
        </Card>
      </div>
    );
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All events" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Attendance reports"
        description="Review event attendance across your department."
      />

      {/* Summary strip */}
      {events.length > 0 && (
        <Card padding="sm" className="!p-0">
          <dl className="grid grid-cols-2 divide-border-subtle lg:grid-cols-4 lg:divide-x">
            <SummaryItem
              icon={ClipboardList}
              label="Total events"
              value={stats.total}
              className="border-b border-border-subtle lg:border-b-0"
            />
            <SummaryItem
              icon={Building2}
              label="Clubs"
              value={stats.clubs}
              className="border-b border-l border-border-subtle lg:border-b-0 lg:border-l-0"
            />
            <SummaryItem
              icon={CalendarClock}
              label="Upcoming"
              value={stats.upcoming}
            />
            <SummaryItem
              icon={CalendarRange}
              label="This month"
              value={stats.thisMonth}
              className="border-l border-border-subtle lg:border-l-0"
            />
          </dl>
        </Card>
      )}

      {/* Filters */}
      {events.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter events"
            className="inline-flex w-fit rounded-xl border border-border bg-secondary p-1"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-4 py-1.5 text-label font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  filter === f.id
                    ? "bg-surface text-primary shadow-subtle"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event or club"
              aria-label="Search events"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-label text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <Card padding="lg" className="border-dashed py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
            <ClipboardList className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-text">No events yet</h3>
          <p className="mt-1 text-label text-text-muted">
            Events from your department will appear here once they are created.
          </p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="border-dashed py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-text-subtle">
            <SearchX className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-text">No matching events</h3>
          <p className="mt-1 text-label text-text-muted">
            Try another filter, or a different event or club name.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((event) => {
            const start = new Date(event.startTime);
            const statusStyle =
              STATUS_STYLES[event.status?.toLowerCase()] ??
              "bg-secondary text-text-muted";

            return (
              <Card
                key={event.id}
                padding="sm"
                className="group flex flex-col overflow-hidden !p-0 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Header band */}
                <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-primary-subtle to-secondary px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <span className="text-caption font-semibold leading-none text-white/80">
                        {start.toLocaleDateString(undefined, { month: "short" })}
                      </span>
                      <span className="mt-0.5 text-subheading font-extrabold leading-none tabular-nums">
                        {start.getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-label font-semibold text-text">
                        {relativeDay(start)}
                      </p>
                      <p className="text-caption text-text-muted">
                        {start.toLocaleDateString(undefined, {
                          weekday: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-caption font-semibold capitalize ${statusStyle}`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-body font-bold leading-snug text-text">
                    {event.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-caption font-bold text-accent-hover">
                      {event.clubName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate text-label font-medium text-text-muted">
                      {event.clubName}
                    </span>
                  </div>

                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-label leading-relaxed text-text-muted">
                      {event.description}
                    </p>
                  )}

                  <ul className="mb-5 mt-4 space-y-2 text-label text-text-muted">
                    <li className="flex items-center gap-2.5">
                      <CalendarDays className="h-4 w-4 shrink-0 text-text-subtle" />
                      {start.toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0 text-text-subtle" />
                      {start.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </li>
                    {event.location && (
                      <li className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 shrink-0 text-text-subtle" />
                        <span className="truncate">{event.location}</span>
                      </li>
                    )}
                  </ul>

                  <Button
                    variant="secondary"
                    className="mt-auto w-full"
                    onClick={() =>
                      router.push(`/attendance/hod/${event.id}`)
                    }
                    aria-label={`View attendance for ${event.title}`}
                  >
                    View attendance
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-5 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <dd className="text-heading font-extrabold leading-none tabular-nums text-text">
          {value}
        </dd>
        <dt className="mt-1.5 text-caption text-text-muted">{label}</dt>
      </div>
    </div>
  );
}
