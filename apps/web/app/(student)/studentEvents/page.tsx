"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAllEventsQuery } from "@/app/club-coordinator/eventquery";
import Card from "@/app/ui/card";
import Button from "@/app/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { Link } from "lucide-react";

type CampusEvent = {
  id: string | number;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  startDate?: string | Date | null;
  category?: string | null;
  venue?: string | null;
};

const eventThemes = [
  {
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    light: "bg-blue-50 dark:bg-blue-950/30",
    icon: "🎓",
  },
  {
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    light: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "🎉",
  },
  {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-700",
    light: "bg-violet-50 dark:bg-violet-950/30",
    icon: "💡",
  },
  {
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    light: "bg-orange-50 dark:bg-orange-950/30",
    icon: "🏆",
  },
];

function formatEventDate(date?: string | Date | null) {
  if (!date) return "Date to be announced";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentEventsPage() {
  const router = useRouter();
  const { data, isPending, isError } = useAllEventsQuery();
  const [search, setSearch] = useState("");

  const events: CampusEvent[] = Array.isArray(data)
    ? data
    : (data as { events?: CampusEvent[] } | undefined)?.events ?? [];

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) =>
      [
        event.title,
        event.name,
        event.description,
        event.category,
        event.venue,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, search]);

  if (isPending) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-64 rounded-[2rem] bg-muted/30" />
          <div className="h-14 max-w-md rounded-2xl bg-muted/30" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 rounded-3xl border border-border bg-surface"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl dark:bg-red-950/30">
            !
          </div>
          <h2 className="mt-5 text-xl font-bold">We couldn't load the events</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Top navigation */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md">
              E
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">EduNex</p>
              <p className="text-xs text-muted">Student portal</p>
            </div>
          </div>

          <Link
  href="/studentDashboard"
  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-primary hover:bg-primary/5 hover:text-primary"
>
  <ArrowLeft size={18} aria-hidden="true" />
  <span>Back to Dashboard</span>
</Link>
        </div>

        {/* Hero */}
        <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 px-5 py-6 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute right-12 top-12 hidden text-7xl opacity-10 sm:block">
            ✦
          </div>

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              CAMPUS LIFE · STUDENT COMMUNITY
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Make campus
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                unforgettable.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Discover workshops, cultural celebrations, competitions, and
              opportunities to connect with your campus community.
            </p>

            <button
              onClick={() =>
                document.getElementById("event-list")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Explore all events
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          <div className="relative mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:mt-11 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
              <p className="text-3xl font-extrabold">{events.length}</p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Total events
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
              <p className="text-3xl font-extrabold">
                {new Set(events.map((event) => event.category).filter(Boolean)).size}
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Event categories
              </p>
            </div>
          </div>
        </section>

        {/* Events heading and search */}
        <section id="event-list" className="scroll-mt-6 pt-10 sm:pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Find your next experience
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Explore campus events
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Something exciting is happening. Find your place in it.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, categories, venues..."
                aria-label="Search campus events"
                className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-b border-border pb-4">
            <p className="text-sm text-muted">
              <span className="font-bold text-foreground">
                {filteredEvents.length}
              </span>{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>

                    {/* Event cards using reusable Card component */}
          {filteredEvents.length === 0 ? (
            <Card className="my-8 border-dashed py-16 text-center" padding="lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl dark:bg-blue-950/30">
                📅
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {search ? "No matching events" : "No events available yet"}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {search
                  ? "Try another keyword or clear your search."
                  : "New campus events will appear here when available."}
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear search
                </button>
              )}
            </Card>
          ) : (
            <div className="grid gap-5 pt-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event, index) => {
                const theme = eventThemes[index % eventThemes.length];

                return (
                  <Card
                    key={event.id}
                    padding="sm"
                    className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl"
                  >
                    {/* Event banner */}
                    <div
                      className={`relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient}`}
                    >
                      <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[22px] border-white/10 transition duration-500 group-hover:scale-110" />

                      <div className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-white/10 blur-sm" />

                      <span className="relative text-6xl transition duration-300 group-hover:scale-110">
                        {theme.icon}
                      </span>

                      <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {event.category || "Campus event"}
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                      <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-blue-600">
                        {event.title || event.name || "Untitled event"}
                      </h3>

                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted">
                        {event.description ||
                          "Join your campus community and be part of this experience."}
                      </p>

                      <div className="mt-5 space-y-4 border-t border-border pt-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${theme.light}`}
                          >
                            📅
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">Event date</p>
                            <p className="mt-1 break-words text-sm font-semibold">
                              {formatEventDate(event.startDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${theme.light}`}
                          >
                            📍
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">Venue</p>
                            <p className="mt-1 break-words text-sm font-semibold">
                              {event.venue || "Venue to be announced"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-5">
                        <span className="text-xs font-medium text-muted">
                          EduNex Events
                        </span>

                        <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:gap-3">
                          Discover <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-border py-7 text-center">
          <p className="text-sm font-semibold">
            EduNex <span className="text-blue-600">·</span> Your campus, connected.
          </p>
          <p className="mt-2 text-xs text-muted">
            Discover opportunities. Connect with your community.
          </p>
        </footer>
      </div>
    </main>
  );
}