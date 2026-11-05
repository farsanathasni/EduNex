"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

import {
  useAllEventsQuery,
  useMyEventsQuery,
} from "@/features/events/api/event-query";

import { useAccess } from "@/lib/navigation/access";

const gradients = [
  "from-[#234c96] via-[#315eaa] to-[#7898d6]",
  "from-[#234c96] via-[#536eb4] to-[#a1b5e5]",
  "from-[#19396f] via-[#234c96] to-[#f28520]",
];

type EventFilter = "all" | "my";

export default function BrowseEventsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedClubId, setSelectedClubId] = useState<number | "all">("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");

  const { me, setMode, canSwitchMode } = useAccess();

  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const assignedClubIds = useMemo(
    () => new Set(coordinatedClubs.map((club) => club.id)),
    [coordinatedClubs],
  );

  const hasAssignedClubs = coordinatedClubs.length > 0;

  // Fetch all campus events or coordinator's events
  const allEventsQuery = useAllEventsQuery(eventFilter === "all");

  const myEventsQuery = useMyEventsQuery(
    eventFilter === "my" && hasAssignedClubs,
  );

  // Select the correct query based on the active filter
  const activeQuery =
    eventFilter === "all" ? allEventsQuery : myEventsQuery;

  const sourceEvents = activeQuery.data ?? [];

  // My Events only displays events from assigned clubs
  const events = useMemo(() => {
    if (eventFilter === "all") {
      return sourceEvents;
    }

    return sourceEvents.filter((event) =>
      assignedClubIds.has(event.clubId),
    );
  }, [sourceEvents, eventFilter, assignedClubIds]);

  // Search and club filtering
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

 

  const handleFilterChange = (filter: EventFilter) => {
    setEventFilter(filter);
    setSelectedClubId("all");
  };

  return (
    <CoordinatorLayout>
      <div className="space-y-7 pb-8">

        

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#19396f] via-[#234c96] to-[#315eaa] px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">

          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-[#f28520]/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50">
              <span className="h-2 w-2 rounded-full bg-[#f28520]" />
              CAMPUS LIFE · EVENTS
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Discover what&apos;s
              <span className="block text-orange-300">
                happening on campus.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Find exciting events, connect with your campus community, and
              never miss an opportunity to participate.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">
                  {filteredEvents.length}
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Matching events
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">
                  {coordinatedClubs.length}
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Assigned clubs
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Find Events */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-text">
              Find your next event
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Search events by title, club, or venue.
            </p>
          </div>

          <Card className="border-border-subtle p-3 shadow-subtle sm:p-4">

            {/* All Events / My Events Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">

              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  eventFilter === "all"
                    ? "bg-[#234c96] text-white shadow-sm hover:bg-[#19396f]"
                    : "border border-[#234c96] bg-white text-[#234c96] hover:bg-blue-50"
                }`}
              >
                All Events
              </button>

              <button
                type="button"
                onClick={() => handleFilterChange("my")}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  eventFilter === "my"
                    ? "bg-[#234c96] text-white shadow-sm hover:bg-[#19396f]"
                    : "border border-[#234c96] bg-white text-[#234c96] hover:bg-blue-50"
                }`}
              >
                My Events
              </button>

            </div>

            {/* Search and Club Filter */}
            <div className="flex flex-col gap-3 md:flex-row">

              <div className="relative min-w-0 flex-1">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-subtle"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>

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
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                >
                  <option value="all">All assigned clubs</option>

                  {coordinatedClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              )}

            </div>
          </Card>
        </section>

        {/* Events List */}
        <section>

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

            <div>
              <h2 className="text-xl font-bold text-text">
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

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-primary transition hover:text-primary-hover"
              >
                Clear search
              </button>
            )}

          </div>

          {/* No Assigned Clubs */}
          {eventFilter === "my" && !hasAssignedClubs ? (
            <Card className="border-dashed border-border py-16 text-center">

              <h3 className="text-lg font-bold text-text">
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
                  <div className="h-36 animate-pulse bg-primary/10" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-border-subtle" />
                  </div>
                </div>
              ))}

            </div>

          ) : activeQuery.isError ? (

            /* Error State */
            <Card className="border-dashed py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
                !
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

                    <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border-[20px] border-white/10 transition duration-500 group-hover:scale-110" />

                    <div className="pointer-events-none absolute bottom-0 right-12 h-20 w-20 rounded-full bg-white/10 blur-xl" />

                    <div className="relative z-10 flex w-full items-end justify-between gap-3">

                      <span className="max-w-[75%] truncate rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {event.clubName}
                      </span>

                      <span className="shrink-0 text-xs font-medium text-white/80">
                        EVENT
                      </span>

                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="text-lg font-bold leading-snug text-text transition group-hover:text-primary">
                        {event.title}
                      </h3>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold capitalize text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                        {event.status}
                      </span>

                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-text-muted">
                      {event.description ||
                        "Discover the details of this campus event."}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-border-subtle pt-4">

                      {/* Date */}
                      <div className="flex items-start gap-3 text-sm">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                          </svg>

                        </span>

                        <div>
                          <p className="text-xs text-text-subtle">Date</p>

                          <p className="mt-0.5 font-semibold text-text">
                            {formatDate(event.startTime)}
                          </p>
                        </div>

                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3 text-sm">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#d96f12]">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>

                        </span>

                        <div>
                          <p className="text-xs text-text-subtle">Time</p>

                          <p className="mt-0.5 font-semibold text-text">
                            {formatTime(event.startTime)} –{" "}
                            {formatTime(event.endTime)}
                          </p>
                        </div>

                      </div>

                      {/* Venue */}
                      <div className="flex items-start gap-3 text-sm">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>

                        </span>

                        <div className="min-w-0">
                          <p className="text-xs text-text-subtle">Venue</p>

                          <p className="mt-0.5 break-words font-semibold text-text">
                            {event.location || "Venue not specified"}
                          </p>
                        </div>

                      </div>

                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">

                      <span className="text-xs text-text-subtle">
                        Campus community
                      </span>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                        Event details
                        <span aria-hidden="true">→</span>
                      </span>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            /* Empty State */
            <Card className="border-dashed border-border py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18M9 15h2" />
                </svg>

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
                onClick={() => {
                  setSearch("");
                  setSelectedClubId("all");
                }}
              >
                Reset filters
              </Button>

            </Card>

          )}

        </section>
      </div>
    </CoordinatorLayout>
  );
}