"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarOff,
} from "lucide-react";

import { useStudentClubEventsQuery } from "@/features/clubs/api/club-query";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

type EventDate = {
  day: string;
  month: string;
  full: string;
};

/** Returns null when the value is missing or not a valid date. */
function formatEventDate(value?: string): EventDate | null {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }),
    full: date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

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
      <main className="min-h-screen bg-background px-4 py-10">
        <Card
          role="alert"
          padding="lg"
          className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-subheading font-bold text-text">
            Invalid club
          </h1>
          <p className="mt-2 text-label text-text-muted">
            This club link isn&apos;t valid. Go back and choose a club from the
            list.
          </p>
          <Link
            href="/student"
            className={`mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition-colors hover:bg-primary-hover ${focusRing}`}
          >
            All clubs
          </Link>
        </Card>
      </main>
    );
  }

  const showResults = !isLoading && !isError;

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href={`/student/${clubId}`}
          className={`group mb-6 inline-flex items-center gap-2 rounded-lg text-label font-semibold text-text-muted transition-colors hover:text-primary ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to club
        </Link>

        {/* Banner */}
        <header className="relative overflow-hidden rounded-3xl bg-brand px-6 py-10 text-text-on-primary shadow-lg sm:px-10 sm:py-12">
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

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-label font-semibold text-white/80">
                What&apos;s happening
              </p>
              <h1 className="mt-2 text-display-sm font-extrabold tracking-tight">
                Club events
              </h1>
              <p className="mt-3 text-body leading-relaxed text-white/80">
                Activities, workshops and gatherings organized by your club.
              </p>
            </div>

            {showResults && (
              <div className="w-fit shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-heading font-extrabold leading-none">
                  {events.length}
                </p>
                <p className="mt-1 text-caption text-white/80">
                  {events.length === 1 ? "Event" : "Events"}
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-4xl">
          {/* Loading */}
          {isLoading && (
            <div
              role="status"
              aria-label="Loading events"
              className="space-y-4"
            >
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  aria-hidden="true"
                  padding="lg"
                  className="animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-xl bg-secondary-hover" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/5 rounded bg-secondary-hover" />
                      <div className="h-3 w-1/3 rounded bg-secondary-hover" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-3 w-full rounded bg-secondary-hover" />
                    <div className="h-3 w-4/5 rounded bg-secondary-hover" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <Card
              role="alert"
              padding="lg"
              className="flex flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                Unable to load events
              </h2>
              <p className="mt-2 text-label text-text-muted">
                Check your connection and try again.
              </p>
              <Button className="mt-6" onClick={() => refetch()}>
                Try again
              </Button>
            </Card>
          )}

          {/* Empty */}
          {showResults && events.length === 0 && (
            <Card
              role="status"
              padding="lg"
              className="flex flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <CalendarOff className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                No events scheduled
              </h2>
              <p className="mt-2 max-w-md text-label text-text-muted">
                Check back soon for workshops, activities and club gatherings.
              </p>
              <Link
                href={`/student/${clubId}`}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition-colors hover:bg-primary-hover ${focusRing}`}
              >
                Back to club
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          )}

          {/* Events */}
          {showResults && events.length > 0 && (
            <ul className="space-y-4">
              {events.map((event) => {
                const rawDate = event.startDate || event.date;
                const eventDate = formatEventDate(rawDate);

                return (
                  <li key={event.id}>
                    <Card
                      padding="lg"
                      className="group transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        {/* Date tile */}
                        <div
                          aria-hidden="true"
                          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          {eventDate ? (
                            <>
                              <span className="text-subheading font-extrabold leading-none">
                                {eventDate.day}
                              </span>
                              <span className="mt-1 text-caption font-semibold uppercase">
                                {eventDate.month}
                              </span>
                            </>
                          ) : (
                            <CalendarDays className="h-6 w-6" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="break-words text-body-lg font-bold leading-snug text-text">
                            {event.title}
                          </h2>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-caption text-text-muted">
                            <CalendarDays
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                            {eventDate
                              ? eventDate.full
                              : rawDate || "Date to be announced"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap break-words text-label leading-7 text-text-muted sm:pl-20">
                        {event.description ||
                          "More details about this event will be available soon."}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
