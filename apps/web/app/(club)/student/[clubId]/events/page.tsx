"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubEventsQuery } from "../../../clubQuery";
import PageHeader from "@/app/ui/pageHeader";
import Card from "@/app/ui/card";

export default function ClubEventsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubEventsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

  const formatEventDate = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return {
      day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      year: date.toLocaleDateString("en-IN", { year: "numeric" }),
      full: date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/student/${clubId}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          Back to club
        </Link>

        {/* Hero banner */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Campus life
              </span>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Make memories.
                <span className="block text-blue-100">
                  Be part of the action.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Discover club activities, meet new people, and find exciting
                opportunities happening on your campus.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">✦</span>
                Your next campus experience starts here
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                🎉
              </div>
            </div>
          </div>
        </section>

        {/* Events heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="What's happening"
              title="Club Events"
              description="Explore activities and events organized by your club."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {events.length.toString().padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {events.length === 1 ? "Event listed" : "Events listed"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-4 w-24 rounded bg-secondary" />
                <div className="mt-5 h-6 w-3/4 rounded bg-secondary" />
                <div className="mt-4 h-4 w-full rounded bg-secondary" />
                <div className="mt-2 h-4 w-2/3 rounded bg-secondary" />
                <div className="mt-6 h-10 w-28 rounded-xl bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="mt-6 border-red-200 py-10 text-center">
            <div className="text-4xl">😕</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Events couldn't be loaded
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !isError && events.length === 0 && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-subtle text-4xl">
              📅
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-text">
              Something exciting is on the way!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              There are no events scheduled right now. Check back soon for
              workshops, activities, and club gatherings.
            </p>
            <Link
              href={`/student/${clubId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Explore your club
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Event cards */}
        {!isLoading && !isError && events.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {events.map((event, index) => {
              const rawDate = event.startDate || event.date;
              const formattedDate = formatEventDate(rawDate);
              const colors = [
                "bg-blue-100 text-blue-700",
                "bg-orange-100 text-orange-700",
                "bg-emerald-100 text-emerald-700",
                "bg-violet-100 text-violet-700",
              ];
              const color = colors[index % colors.length];

              return (
                <article
                  key={event.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="h-1.5 bg-primary/80 transition-colors group-hover:bg-accent" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl ${color}`}
                      >
                        {formattedDate && typeof formattedDate !== "string" ? (
                          <>
                            <span className="text-2xl font-extrabold leading-none">
                              {formattedDate.day}
                            </span>
                            <span className="mt-1 text-xs font-bold uppercase">
                              {formattedDate.month}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl">📅</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Club activity
                        </span>
                        <h2 className="mt-2 break-words text-lg font-extrabold leading-snug text-text transition group-hover:text-primary sm:text-xl">
                          {event.title}
                        </h2>
                        {formattedDate && typeof formattedDate !== "string" && (
                          <p className="mt-2 text-xs font-medium text-text-muted">
                            {formattedDate.year}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-text-muted">
                      {event.description || "More details about this event will be available soon."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                        <span aria-hidden="true">🗓️</span>
                        {formattedDate && typeof formattedDate !== "string"
                          ? formattedDate.full
                          : rawDate || "Date to be announced"}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                        Club event
                        <span aria-hidden="true">✦</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-border-subtle py-6 text-center">
          <p className="text-sm text-text-muted">
            Made for your campus community
            <span className="mx-2 text-primary">✦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}