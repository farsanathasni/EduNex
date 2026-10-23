"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubAnnouncementsQuery } from "../../../clubQuery";
import PageHeader from "@/app/ui/pageHeader";
import Card from "@/app/ui/card";

export default function ClubAnnouncementsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: announcements = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubAnnouncementsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

  const formatDate = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center lg:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                Stay informed
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Every update.
                <span className="block text-blue-100">
                  All in one place.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Stay connected with your club through important notices,
                exciting updates, and the latest campus news.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">📣</span>
                Never miss an important update
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                📢
              </div>
            </div>
          </div>
        </section>

        {/* Page heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="Club communication"
              title="Latest Announcements"
              description="Important information and updates shared by your club."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {String(announcements.length).padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {announcements.length === 1
                    ? "Announcement"
                    : "Announcements"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-secondary" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-secondary" />
                    <div className="mt-3 h-4 w-1/3 rounded bg-secondary" />
                  </div>
                </div>
                <div className="mt-5 h-4 w-full rounded bg-secondary" />
                <div className="mt-2 h-4 w-4/5 rounded bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <Card className="mt-6 py-10 text-center">
            <div className="text-4xl">📡</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Updates are temporarily unavailable
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
        {!isLoading && !isError && announcements.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-subtle text-4xl">
              📭
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-text">
              You're all caught up!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              There are no announcements yet. New club notices and updates
              will appear here when they are published.
            </p>

            <Link
              href={`/student/${clubId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Back to club
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Announcement cards */}
        {!isLoading && !isError && announcements.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {announcements.map((announcement, index) => {
              const publishedDate = formatDate(announcement.createdAt);
              const content =
                announcement.content ||
                announcement.message ||
                "No additional details are available.";

              return (
                <article
                  key={announcement.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="h-1.5 bg-accent transition-colors group-hover:bg-primary" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                          index % 3 === 0
                            ? "bg-blue-100"
                            : index % 3 === 1
                              ? "bg-orange-100"
                              : "bg-emerald-100"
                        }`}
                      >
                        {index % 3 === 0
                          ? "📢"
                          : index % 3 === 1
                            ? "📌"
                            : "✦"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Club update
                        </span>

                        <h2 className="mt-2 break-words text-lg font-extrabold leading-snug text-text transition group-hover:text-primary sm:text-xl">
                          {announcement.title}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-text-muted">
                      {content}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                        <span aria-hidden="true">🗓️</span>
                        <span>
                          {publishedDate
                            ? `Published ${publishedDate}`
                            : "Club announcement"}
                        </span>
                      </div>

                      <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold text-accent-hover">
                        Official update
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
            Stay connected with your campus community
            <span className="mx-2 text-primary">✦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}