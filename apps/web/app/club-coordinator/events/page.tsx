
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users,
  ArrowUpRight,
  CalendarCheck2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import {
  useAllEventsQuery,
  useMyEventsQuery,
} from "@/features/events/api/event-query";

import { useAccess } from "@/lib/navigation/access";

const gradients = [
  "from-[#19396f] via-[#234c96] to-[#5278bd]",
  "from-[#234c96] via-[#315eaa] to-[#7898d6]",
  "from-[#19396f] via-[#234c96] to-[#d97706]",
  "from-[#315eaa] via-[#536eb4] to-[#8ca8dc]",
];

type EventFilter = "all" | "my";

export default function BrowseEventsPage() {
  const [search, setSearch] = useState("");
  const [selectedClubId, setSelectedClubId] = useState<number | "all">("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [expandedDescriptions, setExpandedDescriptions] = useState<
  Set<number>
>(new Set());

  const { me } = useAccess();

  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const assignedClubIds = useMemo(
    () => new Set(coordinatedClubs.map((club) => club.id)),
    [coordinatedClubs],
  );

  const hasAssignedClubs = coordinatedClubs.length > 0;

  const allEventsQuery = useAllEventsQuery(eventFilter === "all");

  const myEventsQuery = useMyEventsQuery(
    eventFilter === "my" && hasAssignedClubs,
  );

  const activeQuery =
    eventFilter === "all" ? allEventsQuery : myEventsQuery;

  const sourceEvents = activeQuery.data ?? [];

  const events = useMemo(() => {
    if (eventFilter === "all") {
      return sourceEvents;
    }

    return sourceEvents.filter((event) =>
      assignedClubIds.has(event.clubId),
    );
  }, [sourceEvents, eventFilter, assignedClubIds]);

  const filteredEvents = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return events.filter((event) => {
      if (
        eventFilter === "my" &&
        selectedClubId !== "all" &&
        event.clubId !== selectedClubId
      ) {
        return false;
      }

      const searchableText = [
        event.title,
        event.clubName,
        event.location ?? "",
        event.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [events, search, selectedClubId, eventFilter]);

  const handleFilterChange = (filter: EventFilter) => {
    setEventFilter(filter);
    setSelectedClubId("all");
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedClubId("all");
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
      case "pending":
        return "bg-amber-50 text-amber-700 ring-amber-600/10";
      case "rejected":
        return "bg-red-50 text-red-700 ring-red-600/10";
      default:
        return "bg-slate-100 text-slate-600 ring-slate-500/10";
    }
  };

  return (
    <CoordinatorLayout>
      <main className="space-y-8 pb-10">

        {/* Page Heading */}
        <div>
          <p className="text-sm font-semibold text-primary">
            Campus activities
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
            Browse Events
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Explore campus events, discover activities from different clubs,
            and stay connected with your college community.
          </p>
        </div>

        {/* Hero Section */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#19396f] via-[#234c96] to-[#315eaa] px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">

          {/* Decorations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.07]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-[25%] h-56 w-56 rounded-full bg-orange-400/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-orange-300" />
              CLUB COORDINATOR PORTAL
            </div>

            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Discover what&apos;s happening on campus.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
              Explore exciting campus activities, follow events from your
              assigned clubs, and stay updated with everything happening
              around you.
            </p>

            {/* Statistics */}
            <div className="mt-8 flex flex-wrap gap-3">

              <div className="min-w-[145px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-100">
                  <CalendarCheck2 className="h-4 w-4" />
                  <span className="text-xs font-medium">Matching events</span>
                </div>

                <p className="mt-2 text-3xl font-extrabold">
                  {filteredEvents.length}
                </p>
              </div>

              <div className="min-w-[145px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-100">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Assigned clubs</span>
                </div>

                <p className="mt-2 text-3xl font-extrabold">
                  {coordinatedClubs.length}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="space-y-4">

          <div>
            <h2 className="text-xl font-bold text-text">
              Find your next event
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Search events by title, club name, or venue.
            </p>
          </div>

          <Card className="border border-border-subtle p-4 shadow-subtle sm:p-5">

            {/* Filter Tabs */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-text-muted" />
                <span className="text-sm font-semibold text-text">
                  Event filters
                </span>
              </div>

              <div className="flex rounded-xl bg-background p-1">
                <button
                  type="button"
                  onClick={() => handleFilterChange("all")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    eventFilter === "all"
                      ? "bg-[#234c96] text-white shadow-sm"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  }`}
                >
                  All Events
                </button>

                <button
                  type="button"
                  onClick={() => handleFilterChange("my")}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    eventFilter === "my"
                      ? "bg-[#234c96] text-white shadow-sm"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  }`}
                >
                  My Events
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-subtle" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, clubs, venues..."
                  aria-label="Search events"
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {eventFilter === "my" && coordinatedClubs.length > 1 && (
                <select
                  value={selectedClubId}
                  onChange={(event) =>
                    setSelectedClubId(
                      event.target.value === "all"
                        ? "all"
                        : Number(event.target.value),
                    )
                  }
                  aria-label="Filter events by assigned club"
                  className="min-w-0 rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 md:w-60"
                >
                  <option value="all">All assigned clubs</option>

                  {coordinatedClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              )}

              {(search || selectedClubId !== "all") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary-subtle"
                >
                  Clear filters
                </button>
              )}
            </div>
          </Card>
        </section>

        {/* Events Section */}
        <section>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Explore campus life
              </p>

              <h2 className="mt-1 text-xl font-bold text-text">
                {eventFilter === "all"
                  ? "All Campus Events"
                  : selectedClubId === "all"
                    ? "Events from your assigned clubs"
                    : coordinatedClubs.find(
                        (club) => club.id === selectedClubId,
                      )?.name ?? "Assigned club events"}
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"} found
              </p>
            </div>

            <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted">
              {eventFilter === "all" ? "Campus-wide" : "Assigned clubs"}
            </div>
          </div>

          {/* No Assigned Clubs */}
          {eventFilter === "my" && !hasAssignedClubs ? (

            <Card className="border border-dashed border-border py-16 text-center shadow-subtle">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <Users className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-text">
                No clubs assigned
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-muted">
                Events will appear here after a club is assigned to your
                coordinator account.
              </p>

            </Card>

          ) : activeQuery.isPending ? (

            /* Loading Skeleton */
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
                >
                  <div className="h-40 animate-pulse bg-primary/10" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 w-full animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-border-subtle" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-border-subtle" />
                  </div>
                </div>
              ))}
            </div>

          ) : activeQuery.isError ? (

            /* Error State */
            <Card className="border border-dashed border-border py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <RefreshCw className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-bold text-text">
                Unable to load events
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                Please check your connection and try again.
              </p>

              <Button
                className="mt-5"
                onClick={() => activeQuery.refetch()}
              >
                Try again
              </Button>

            </Card>

          ) : filteredEvents.length > 0 ? (

            /* Event Cards */
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredEvents.map((event, index) => (

                <article
                  key={event.id}
                  className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >

                  {/* Event Banner */}
                  <div
                    className={`relative flex h-40 items-end overflow-hidden bg-gradient-to-br ${
                      gradients[index % gradients.length]
                    } p-5`}
                  >

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border-[20px] border-white/10 transition duration-500 group-hover:scale-110"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 right-12 h-20 w-20 rounded-full bg-white/10 blur-xl"
                    />

                    <div className="relative z-10 flex w-full items-center justify-between gap-3">

                      <span className="max-w-[75%] truncate rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {event.clubName}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/90">
                        <Sparkles className="h-3.5 w-3.5" />
                        EVENT
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="min-w-0 text-lg font-bold leading-snug text-text transition group-hover:text-primary">
                        {event.title}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${getStatusStyle(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>

                    </div>

                    <div className="mt-3">
  <p
    className={`text-sm leading-6 text-text-muted ${
      expandedDescriptions.has(event.id)
        ? "whitespace-pre-line"
        : "line-clamp-2"
    }`}
  >
    {event.description ||
      "Discover the details of this campus event."}
  </p>

  {event.description && event.description.length > 100 && (
    <button
      type="button"
      onClick={() => {
        setExpandedDescriptions((previous) => {
          const updated = new Set(previous);

          if (updated.has(event.id)) {
            updated.delete(event.id);
          } else {
            updated.add(event.id);
          }

          return updated;
        });
      }}
      className="mt-2 text-sm font-bold text-primary transition hover:text-primary-hover"
    >
      {expandedDescriptions.has(event.id)
        ? "See less"
        : "See more"}
    </button>
  )}
</div>

                    {/* Event Information */}
                    <div className="mt-5 space-y-4 border-t border-border-subtle pt-4">

                      {/* Date */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                          <CalendarDays className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-text-subtle">
                            Event date
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-text">
                            {formatDate(event.startTime)}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <Clock3 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-text-subtle">
                            Event time
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-text">
                            {formatTime(event.startTime)} –{" "}
                            {formatTime(event.endTime)}
                          </p>
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-text-subtle">
                            Venue
                          </p>

                          <p className="mt-0.5 break-words text-sm font-semibold text-text">
                            {event.location || "Venue not specified"}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">

                      <span className="text-xs font-medium text-text-subtle">
                        EduNex Campus
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Event information
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>

                    </div>
                  </div>
                </article>
              ))}
            </div>

          ) : (

            /* Empty State */
            <Card className="border border-dashed border-border py-16 text-center shadow-subtle">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <CalendarDays className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-text">
                No events found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-muted">
                {search || selectedClubId !== "all"
                  ? "Try a different search term or clear your filters."
                  : eventFilter === "my"
                    ? "There are no events for your assigned clubs."
                    : "There are no campus events available right now."}
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={resetFilters}
              >
                Reset filters
              </Button>

            </Card>
          )}
        </section>

        {/* Footer */}
        <div className="border-t border-border-subtle pt-5 text-center">
          <p className="text-xs text-text-subtle">
            EduNex · Connecting students, clubs and campus activities.
          </p>
        </div>

      </main>
    </CoordinatorLayout>
  );
}
