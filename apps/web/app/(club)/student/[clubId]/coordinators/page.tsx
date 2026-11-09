"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Users,
} from "lucide-react";

import { useStudentClubCoordinatorsQuery } from "@/features/clubs/api/club-query";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

/* Theme-aware avatar tints (cycled per card). */
const avatarStyles = [
  "bg-primary-subtle text-primary",
  "bg-accent-subtle text-accent",
  "bg-green-500/10 text-green-600",
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
const onBrandFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

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
                The people behind the club
              </p>
              <h1 className="mt-2 text-display-sm font-extrabold tracking-tight">
                Club coordinators
              </h1>
              <p className="mt-3 text-body leading-relaxed text-white/80">
                Meet the coordinators who organize activities, support members
                and keep your club running.
              </p>
            </div>

            {showResults && (
              <div className="w-fit shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-heading font-extrabold leading-none">
                  {coordinators.length}
                </p>
                <p className="mt-1 text-caption text-white/80">
                  {coordinators.length === 1 ? "Coordinator" : "Coordinators"}
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="mt-8">
          {/* Loading */}
          {isLoading && (
            <div
              role="status"
              aria-label="Loading coordinators"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card
                  key={item}
                  aria-hidden="true"
                  padding="lg"
                  className="animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-secondary-hover" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-secondary-hover" />
                      <div className="h-3 w-1/2 rounded bg-secondary-hover" />
                    </div>
                  </div>
                  <div className="mt-6 h-10 rounded-lg bg-secondary-hover" />
                </Card>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <Card
              role="alert"
              padding="lg"
              className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                Unable to load coordinators
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
          {showResults && coordinators.length === 0 && (
            <Card
              role="status"
              padding="lg"
              className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                No coordinators listed yet
              </h2>
              <p className="mt-2 max-w-md text-label text-text-muted">
                Coordinator details haven&apos;t been added yet. Check back
                later for information about your club team.
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

          {/* Coordinator cards */}
          {showResults && coordinators.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coordinators.map((coordinator, index) => {
                const initials = getInitials(coordinator.name);
                const avatarStyle = avatarStyles[index % avatarStyles.length];

                return (
                  <li
                    key={`${coordinator.id}-${coordinator.email ?? coordinator.name}-${index}`}
                  >
                    <Card
                      padding="lg"
                      className="group flex h-full flex-col transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      {/* Identity */}
                      <div className="flex items-center gap-4">
                        <div
                          aria-hidden="true"
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-subheading font-extrabold ${avatarStyle}`}
                        >
                          {initials || "CC"}
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-body-lg font-bold leading-snug text-text">
                            {coordinator.name}
                          </h2>
                          <p className="mt-0.5 text-caption text-text-muted">
                            Club coordinator
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="mt-5 flex-1 border-t border-border-subtle pt-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-text-muted">
                            <Mail className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-caption text-text-subtle">
                              Email
                            </p>
                            {coordinator.email ? (
                              <p className="break-all text-label font-medium text-text">
                                {coordinator.email}
                              </p>
                            ) : (
                              <p className="text-label text-text-muted">
                                Contact details unavailable
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {coordinator.email && (
                        <a
                          href={`mailto:${coordinator.email}`}
                          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-label font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground ${focusRing}`}
                        >
                          Contact coordinator
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
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
