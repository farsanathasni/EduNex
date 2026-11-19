
"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  AlertCircle,
  ArrowDown,
  CalendarDays,
  GraduationCap,
  MapPin,
  Search,
  Tag,
  X,
} from "lucide-react";

import { useAllEventsQuery } from "@/features/events/api/event-query";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type CampusEvent = {
  id: string | number;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  startDate?: string | Date | null;
  startTime?: string | Date | null;
  category?: string | null;
  clubName?: string | null;
  venue?: string | null;
  location?: string | null;
};

type EventDateParts = {
  day: string;
  month: string;
  full: string;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const onBrandFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

const getEventDate = (event: CampusEvent) =>
  event.startDate ?? event.startTime ?? null;

const getEventVenue = (event: CampusEvent) =>
  event.venue || event.location;

const getEventCategory = (event: CampusEvent) =>
  event.category || event.clubName;

function getEventDateParts(
  date?: string | Date | null,
): EventDateParts | null {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    day: parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
    }),
    month: parsedDate.toLocaleDateString("en-IN", {
      month: "short",
    }),
    full: parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

// Statistics card
function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <Card
      padding="lg"
      className="flex items-center gap-4 shadow-lg transition-shadow duration-200 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        {icon}
      </div>

      <div>
        <p className="text-caption font-medium text-text-muted">
          {label}
        </p>

        <p className="mt-0.5 text-heading-sm font-extrabold leading-tight text-text">
          {value}
        </p>
      </div>
    </Card>
  );
}

// Empty and error states
function StatePanel({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  role = "status",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  role?: "alert" | "status";
}) {
  return (
    <Card
      role={role}
      padding="lg"
      className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          tone === "error"
            ? "bg-accent-subtle text-accent"
            : "bg-primary-subtle text-primary"
        }`}
      >
        {icon}
      </div>

      <h2 className="mt-5 text-subheading font-bold text-text">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-label text-text-muted">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

// Individual event card
function EventCard({ event }: { event: CampusEvent }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateParts = getEventDateParts(getEventDate(event));
  const category = getEventCategory(event);
  const venue = getEventVenue(event);

  const description =
    event.description ||
    "Join your campus community and be part of this experience.";

  return (
    <Card
      padding="lg"
      className="group flex h-full flex-col transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {dateParts ? (
            <>
              <span className="text-subheading font-extrabold leading-none">
                {dateParts.day}
              </span>

              <span className="mt-1 text-caption font-semibold uppercase">
                {dateParts.month}
              </span>
            </>
          ) : (
            <CalendarDays className="h-6 w-6" />
          )}
        </div>

        <span className="max-w-[60%] truncate rounded-full bg-accent-subtle px-3 py-1 text-caption font-semibold text-accent">
          {category || "Campus event"}
        </span>
      </div>

      <h3 className="mt-5 line-clamp-2 break-words text-body-lg font-bold leading-snug text-text">
        {event.title || event.name || "Untitled event"}
      </h3>

      <div className="mt-2 flex-1">
        <p
          className={`text-label leading-6 text-text-muted ${
            isExpanded ? "whitespace-pre-line" : "line-clamp-3"
          }`}
        >
          {description}
        </p>

        {description.length > 120 && (
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() =>
              setIsExpanded((previous) => !previous)
            }
            className={`${focusRing} mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-hover`}
          >
            {isExpanded ? "See less" : "See more"}

            <ArrowDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      <dl className="mt-5 space-y-3 border-t border-border-subtle pt-4">
        <div className="flex items-start gap-3">
          <dt className="mt-0.5 text-text-subtle">
            <CalendarDays
              aria-hidden="true"
              className="h-4 w-4"
            />
            <span className="sr-only">Event date</span>
          </dt>

          <dd className="text-label font-medium text-text">
            {dateParts?.full ?? "Date to be announced"}
          </dd>
        </div>

        <div className="flex items-start gap-3">
          <dt className="mt-0.5 text-text-subtle">
            <MapPin
              aria-hidden="true"
              className="h-4 w-4"
            />
            <span className="sr-only">Venue</span>
          </dt>

          <dd className="break-words text-label font-medium text-text">
            {venue || "Venue to be announced"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Event Loading Skeleton                                                     */
/* -------------------------------------------------------------------------- */

function EventSkeleton() {
  return (
    <Card
      aria-hidden="true"
      padding="lg"
      className="animate-pulse"
    >
      <div className="flex items-start justify-between">
        <Skeleton className="h-16 w-16 rounded-xl" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <Skeleton className="mt-5 h-5 w-3/4" />

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      <div className="mt-6 space-y-3 border-t border-border-subtle pt-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Student Events Page                                                        */
/* -------------------------------------------------------------------------- */

export default function StudentEventsPage() {
  const { data, isPending, isError, refetch } =
    useAllEventsQuery();

  const [search, setSearch] = useState("");

  // Handle both array and object API responses
  const events: CampusEvent[] = Array.isArray(data)
    ? data
    : (
        (data as { events?: CampusEvent[] } | undefined)
          ?.events ?? []
      );

  // Search events
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) =>
      [
        event.title,
        event.name,
        event.description,
        event.category,
        event.clubName,
        event.venue,
        event.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [events, search]);

  // Upcoming events count
  const upcomingCount = events.filter((event) => {
    const date = getEventDate(event);

    if (!date) return false;

    const time = new Date(date).getTime();

    return Number.isFinite(time) && time >= Date.now();
  }).length;

  // Unique category count
  const categoryCount = new Set(
    events
      .map((event) => getEventCategory(event))
      .filter(Boolean),
  ).size;

  const hasSearch = search.trim().length > 0;

  /* ------------------------------ Loading ------------------------------ */

  if (isPending) {
    return (
      <main className="min-h-screen bg-background">
        <div
          role="status"
          aria-label="Loading events"
          className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
        >
          <Skeleton className="h-5 w-32" />

          {/* Hero skeleton */}
          <div className="rounded-3xl bg-surface p-8 sm:p-10">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-6 h-10 w-80 max-w-full" />
            <Skeleton className="mt-4 h-4 w-full max-w-xl" />
            <Skeleton className="mt-3 h-4 w-2/3" />
            <Skeleton className="mt-8 h-11 w-40 rounded-lg" />
          </div>

          {/* Statistics skeleton */}
          <div className="relative z-10 -mt-12 grid gap-4 px-3 sm:grid-cols-3 sm:px-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                padding="lg"
                className="flex items-center gap-4"
              >
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </Card>
            ))}
          </div>

          {/* Events heading and search */}
          <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl sm:max-w-md" />
          </div>

          {/* Event cards */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, item) => (
              <EventSkeleton key={item} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <StatePanel
          role="alert"
          tone="error"
          icon={<AlertCircle className="h-6 w-6" />}
          title="We couldn't load the events"
          description="Please check your connection and try again."
          action={
            <Button onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero section */}
        <section
          aria-labelledby="events-hero-title"
          className="relative overflow-hidden rounded-3xl bg-brand px-6 pb-24 pt-12 text-text-on-primary shadow-lg sm:px-10 sm:pb-28 sm:pt-16"
        >
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
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[40px] border-white/10"
          />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
              <GraduationCap className="h-4 w-4" />
              Campus life · Student community
            </span>

            <h1
              id="events-hero-title"
              className="mt-5 text-display-sm font-extrabold tracking-tight sm:text-display"
            >
              Make campus unforgettable
            </h1>

            <p className="mt-4 max-w-xl text-body leading-relaxed text-white/80">
              Discover workshops, cultural celebrations,
              competitions and opportunities to connect with
              your campus community.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("event-list")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
              className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-label font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover ${onBrandFocusRing}`}
            >
              Explore all events
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Event statistics */}
        <section
          aria-label="Event overview"
          className="relative z-10 -mt-12 grid gap-4 px-3 sm:grid-cols-3 sm:px-8"
        >
          <StatCard
            icon={<CalendarDays className="h-6 w-6" />}
            label="Total events"
            value={events.length}
          />

          <StatCard
            icon={<CalendarDays className="h-6 w-6" />}
            label="Upcoming events"
            value={upcomingCount}
          />

          <StatCard
            icon={<Tag className="h-6 w-6" />}
            label="Categories"
            value={categoryCount}
          />
        </section>

        {/* Events listing */}
        <section
          id="event-list"
          aria-labelledby="events-heading"
          className="mt-14 scroll-mt-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                id="events-heading"
                className="text-heading-lg font-extrabold tracking-tight text-text"
              >
                Explore campus events
              </h2>

              <p className="mt-1.5 text-label text-text-muted">
                Something exciting is happening. Find your place
                in it.
              </p>
            </div>

            {/* Search input */}
            <div className="w-full lg:max-w-md">
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                />

                <Input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search events, categories, venues"
                  aria-label="Search campus events"
                  className="rounded-xl py-3 pl-10 pr-10 shadow-sm [&::-webkit-search-cancel-button]:hidden"
                />

                {hasSearch && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className={`${focusRing} absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-text-subtle transition-colors hover:bg-secondary hover:text-text`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p
                className="mt-2 text-right text-caption text-text-muted"
                aria-live="polite"
              >
                <span className="font-semibold text-text">
                  {filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1
                  ? "event"
                  : "events"}{" "}
                found
              </p>
            </div>
          </div>

          {/* Event cards or empty state */}
          <div className="mt-7">
            {filteredEvents.length === 0 ? (
              <StatePanel
                icon={
                  hasSearch ? (
                    <Search className="h-6 w-6" />
                  ) : (
                    <CalendarDays className="h-6 w-6" />
                  )
                }
                title={
                  hasSearch
                    ? "No matching events"
                    : "No events available yet"
                }
                description={
                  hasSearch
                    ? "Try another keyword or clear your search."
                    : "New campus events will appear here when available."
                }
                action={
                  hasSearch ? (
                    <Button
                      variant="outline"
                      onClick={() => setSearch("")}
                    >
                      Clear search
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
