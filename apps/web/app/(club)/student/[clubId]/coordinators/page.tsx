"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubCoordinatorsQuery } from "../../../clubQuery";
import PageHeader from "@/app/ui/pageHeader";
import Card from "@/app/ui/card";

const avatarStyles = [
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

export default function ClubCoordinatorsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: coordinators = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubCoordinatorsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

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
            className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[38px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center lg:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                The people behind the club
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Meet your team.
                <span className="block text-blue-100">
                  Make great things happen.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Get to know the coordinators who help organize activities,
                support members, and bring your campus community together.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">🤝</span>
                Your club team is here to help
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                👥
              </div>
            </div>
          </div>
        </section>

        {/* Page heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="Meet the team"
              title="Club Coordinators"
              description="Connect with the people coordinating your club activities."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {String(coordinators.length).padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {coordinators.length === 1
                    ? "Coordinator"
                    : "Coordinators"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="animate-pulse p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-secondary" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-secondary" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-secondary" />
                  </div>
                </div>
                <div className="mt-6 h-10 rounded-xl bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <Card className="mt-6 py-10 text-center">
            <div className="text-4xl">😕</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Unable to load coordinators
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
        {!isLoading && !isError && coordinators.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-subtle text-4xl">
              👥
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-text">
              Your team is coming soon!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              Coordinator details haven't been added yet. Please check back
              later for information about your club team.
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

        {/* Coordinator cards */}
        {!isLoading && !isError && coordinators.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coordinators.map((coordinator, index) => {
              const initials = coordinator.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("");

              const avatarStyle =
                avatarStyles[index % avatarStyles.length];

              return (
                <article
  key={`${coordinator.id}-${coordinator.email ?? coordinator.name}-${index}`}
  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
>
                  <div className="h-1.5 bg-primary/80 transition-colors group-hover:bg-accent" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold shadow-sm ${avatarStyle}`}
                      >
                        {initials || "CC"}
                      </div>

                      <span className="rounded-full bg-primary-subtle px-3 py-1.5 text-xs font-bold text-primary">
                        Coordinator
                      </span>
                    </div>

                    <h2 className="mt-6 break-words text-xl font-extrabold text-text transition group-hover:text-primary">
                      {coordinator.name}
                    </h2>

                    <p className="mt-2 text-sm text-text-muted">
                      Club Coordinator
                    </p>

                    <div className="mt-5 border-t border-border-subtle pt-4">
                      {coordinator.email ? (
                        <a
                          href={`mailto:${coordinator.email}`}
                          className="flex min-w-0 items-center gap-3 rounded-xl bg-secondary-subtle p-3 transition hover:bg-primary-subtle"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                            ✉
                          </span>

                          <span className="min-w-0">
                            <span className="block text-xs font-medium text-text-subtle">
                              Email address
                            </span>
                            <span className="mt-1 block break-all text-sm font-semibold text-text">
                              {coordinator.email}
                            </span>
                          </span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 rounded-xl bg-secondary-subtle p-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-text-muted">
                            ✉
                          </span>
                          <p className="text-sm text-text-muted">
                            Contact details unavailable
                          </p>
                        </div>
                      )}
                    </div>

                    {coordinator.email && (
                      <a
                        href={`mailto:${coordinator.email}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                      >
                        Contact coordinator
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-border-subtle py-6 text-center">
          <p className="text-sm text-text-muted">
            Stronger together, better together
            <span className="mx-2 text-primary">✦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}